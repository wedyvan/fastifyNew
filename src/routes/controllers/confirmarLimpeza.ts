import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import {
  updateClean,
  IUpdateCleanParams,
} from "../../services/confirmaLimpeza.services";
/**
 * Função genérica para lidar com erros de validação do Zod
 */
export const handleValidationError = (error: z.ZodError, reply: FastifyReply) => {
  const errors = error.errors.map((err) => {
    const message = err.message.replace(/"/g, "'");
    return `${err.path.join(".")} ${message}`;
  });
  return reply.status(400).send({ message: "Validation Error", errors });
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

  try {
    const params: IUpdateCleanParams = updateCleanSchema.parse(
      request.body
    ) as IUpdateCleanParams;
    const result = await updateClean(params);
    return reply.status(200).send({ result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleValidationError(error, reply);
    }
    return reply.status(400).send(error);
  }
};

