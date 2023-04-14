import { FastifyInstance } from "fastify";
import { updateClean } from "../services/confirmaLimpeza.services";

import { getLeitosVagos, getRequestHandle, updateCleanLeitos } from "./controllers/userController";

export async function appRoutes(app: FastifyInstance) {
    app.route({
        method: 'GET',
        url: '/solicitacao',
        schema: {
            description: 'Endpoint para buscar solicitações',
            tags: ['solicitacao'],
            querystring: {
                type: 'object',
                properties: {
                    cd_leito: { type: 'string' },
                },
                required: ['cd_leito'],
              },
        },
        handler: getRequestHandle
    });

    app.route({
        method: 'GET',
        url: '/leitos',
        handler: getLeitosVagos
    }),

    app.route({
        method: 'PUT',
        url: '/api/:id',
        handler: updateCleanLeitos
    })
}
