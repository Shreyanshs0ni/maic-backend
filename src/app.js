import Fastify from "fastify";
import multipartPlugin from "./plugins/multipart.js";
import { entryRoutes } from "./routes/entryRoutes.js";

export async function buildApp() {
  const app = Fastify({
    logger: true,
  });

  await app.register(multipartPlugin);

  await app.register(entryRoutes);

  return app;
}
