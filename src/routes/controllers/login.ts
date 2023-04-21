import { FastifyRequest, FastifyReply } from "fastify";

export const login = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const usuario = request.user.userId;
      const token = request.token;
      reply.status(200).send({ usuario: usuario, token: token });
    } catch (error) {
      reply.status(400).send({ messagem: error });
    }
  };