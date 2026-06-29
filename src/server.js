import Fastify from "fastify";

const app = Fastify({
  logger: true,
});

app.get("/", async () => {
  return { message: "Hello Railway!" };
});

await app.listen({
  host: "0.0.0.0",
  port: process.env.PORT || 3000,
});
