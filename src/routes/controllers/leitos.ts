import { FastifyRequest, FastifyReply } from "fastify";
import { findLeitosVagos } from "../../services/leitosVagos.services";


export const getLeitosVagos = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    try {
      const result = await findLeitosVagos();
      if (result[0] <= 0) {
        return reply
          .status(200)
          .send({ message: "Não há Leitos aguardando limpeza" });
      }
      reply.status(200).send(result[0]);
    } catch (error) {
      return reply.status(400).send(error);
    }
  };