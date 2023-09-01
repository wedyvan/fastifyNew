import { findRequestByLeito } from "../../services/solicitacaoServices";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { handleValidationError } from "./confirmarLimpeza";


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
  
      if (result[0] === null || result[0].length === 0) {
        return reply.status(404).send({ message: "Recurso não encontrado" });
      }
  
      reply.status(200).send(result[0]);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return handleValidationError(error, reply);
      }
      return reply.status(400).send(error);
    }
  };
  