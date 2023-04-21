import { confirmarLeito } from './../../schema';
import { FastifyInstance } from "fastify";
import { teste } from "../services/teste.services";
import { updateCleanLeitos } from "./controllers/confirmarLimpeza";
import { getLeitosVagos } from "./controllers/leitos";
import { login } from "./controllers/login";
import { getRequestHandle } from "./controllers/requestHandle";
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
    schema: {
      description: "Endpoint para buscar leitos vagos",
      tags: ["leitos"],
    },
    handler: getLeitosVagos,
  });

  app.route({
    method: "POST",
    url: "/ConfirmarSolicitacao",
    preHandler: jwtMiddleware,
    schema: confirmarLeito,
    handler: updateCleanLeitos
  });
  

  app.route({
    method: "GET",
    url: "/",
    preHandler: jwtMiddleware,
    handler: teste,
  });

  app.route({
    method: "POST",
    url: "/login",
    preHandler: authMiddleware,
    handler: login,
  });
}
