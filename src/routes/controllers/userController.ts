import { FastifyRequest, FastifyReply } from "fastify";
import { findLeitosVagos } from "../../services/leitosVagos.services";
import { findRequestByLeito } from "../../services/solicitacaoServices";
import { z } from "zod";
import {
  updateClean,
  IUpdateCleanParams,
} from "../../services/confirmaLimpeza.services";

export const getRequestHandle = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  // validação do valor passado na chamada da API
  const userSchema = z.object({
    cd_leito: z.string().transform((value) => {
      const parsedValue = parseInt(value, 10);
      if (Number.isInteger(parsedValue) && parsedValue >= 0) {
        return parsedValue;
      }
      throw new Error("Value is not a positive integer");
    }),
  });
  type QueryParams = z.infer<typeof userSchema>;

  try {
    const { cd_leito } = userSchema.parse(request.query) as QueryParams;
    const result = await findRequestByLeito(cd_leito); // chamando o serviço que irá executar a consulta no banco de dados

    if (result === null || result.length === 0) {
      return reply.status(404).send({ message: "Recurso não encontrado" });
    }

    reply.status(200).send(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((err) => {
        const message = err.message.replace(/"/g, "'");
        return `${err.path.join(".")} ${message}`;
      });
      return reply.status(400).send({ message: "Validation Error", errors });
    }
    return reply.status(400).send(error);
  }
};

export const getLeitosVagos = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const result = await findLeitosVagos();
    if (result <= 0) {
      return reply
        .status(200)
        .send({ message: "Não há Leitos aguardando limpeza" });
    }
    reply.status(200).send(result);
  } catch (error) {
    return reply.status(400).send(error);
  }
};

export const updateCleanLeitos = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const updateCleanSchema = z.object({
    cd_solicitacao: z.number(),
    cd_tpLimpeza: z.number(),
    cd_funcionario: z.number(),
  });

  type BodyParams = z.infer<typeof updateCleanSchema>;

  try {
    const params: IUpdateCleanParams = updateCleanSchema.parse(
      request.body
    ) as BodyParams;
    const result = await updateClean(params);
    return reply.status(200).send({ result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((err) => {
        const message = err.message.replace(/"/g, "'");
        return `${err.path.join(".")} ${message}`;
      });
      return reply.status(400).send({ message: "Validation Error", errors });
    }
  }
};

export const login = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const usuario = request.user.userId;
    const token = request.token;
    reply.status(200).send({ usuario: usuario, token: token });
  } catch (error) {
    reply.status(400).send({ messagem: error });
  }
};
