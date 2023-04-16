import { FastifyInstance } from "fastify";
import { teste } from "../services/teste.services";
import {
  getLeitosVagos,
  getRequestHandle,
  login,
  updateCleanLeitos,
} from "./controllers/userController";
import { authMiddleware } from "./middleware/firebase";
import { jwtMiddleware } from "./middleware/jwtVeify";

export async function appRoutes(app: FastifyInstance) {
  app.route({
    method: "GET",
    url: "/solicitacao",
    schema: {
      description: "Endpoint para buscar solicitações",
      tags: ["solicitacao"],
      querystring: {
        type: "object",
        properties: {
          cd_leito: { type: "string" },
        },
        required: ["cd_leito"],
      },
    },
    preHandler: jwtMiddleware,
    handler: getRequestHandle,
  });

  app.route({
    method: "GET",
    url: "/leitos",
    preHandler: jwtMiddleware,
    handler: getLeitosVagos,
  }),
    app.route({
      method: "POST",
      url: "/ConfirmarLimpeza",
      preHandler: jwtMiddleware,
      handler: updateCleanLeitos,
    });

  app.route({
    method: "GET",
    url: "/",
    handler: teste,
  });

  app.route({
    method: "GET",
    url: "/login",
    preHandler: authMiddleware,
    handler: login,
  });
}
