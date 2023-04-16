import { FastifyRequest, FastifyReply } from "fastify";

import { verify } from "jsonwebtoken";

export async function jwtMiddleware(
  request: FastifyRequest,
  response: FastifyReply,
  next: () => void
) {
  // Obtém o token da requisição
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    response.status(401).send("Unauthorized");
    return;
  }

  // Verifica se o token é válido
  const token = authHeader.split(" ")[1];

  try {
    const decoded = verify(token, `1234`);
    request.user = decoded;
    next();
  } catch (error) {
    response.status(401).send({ error: "Credenciais inválidas" });
  }
}
