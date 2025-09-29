import { Elysia } from "elysia";
import { openapi } from '@elysiajs/openapi'
import { z } from "zod"

import { betterAuthPlugin, OpenAPI } from "./http/plugins/better-auth";
import cors from "@elysiajs/cors";

const app = new Elysia()
  .use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
  }))
  .use(openapi({
    documentation: {
      components: await OpenAPI.components,
      paths: await OpenAPI.getPaths()
    }
  }))
  .use(betterAuthPlugin)
  .get("/", () => "Hello Elysia")
  .get("/users/:id", ({ params, user }) => {
    const userId = params.id

    const authenticatedUserName = user.name

    console.log({ authenticatedUserName })

    return { id: userId, name: 'Yaba Ernesto' }
  }, {
    auth: true,
    detail: {
      description: 'Buscar um usuário pelo ID',
      tags: ['users']
    },
    params: z.object({
      id: z.string()
    }),
    response: {
      200: z.object({
        id: z.string(),
        name: z.string()
      })
    }
  })
  .listen(3333);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
