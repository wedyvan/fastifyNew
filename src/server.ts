import fastify from "fastify";
import { startup } from "./database/dataBaseInit";
import { appRoutes } from "./routes";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

const options = {
  exposeRoute: true,
  routePrefix: "/documentation",
  swagger: {
    info: {
      title: "Zeladoria",
      description: "API para o módulo de zeladoria",
      version: "1.0.0",
    },

    security: [{ bearerAuth: [] }],
    tags: [
      {
        name: "solicitacao",
        description: "Operações relacionadas a solicitações",
      },
    ],
    // Aqui você pode adicionar opções adicionais do Swagger, como esquemas e definições.
  },
};

const optionUi = {
  routePrefix: "/documentation",
  swaggerOptions: {},
  exposeRoute: true,
};

const app = fastify();
app.register(swagger, options);
app.register(swaggerUi, optionUi);
app.register(appRoutes);

const start = async () => {
  await startup();
  app
    .listen({
      port: 3000,
    })
    .then(() => {
      console.log("listening on port 3000");
    });
};

start();
