import "dotenv/config";
import { buildApp } from "./app.js";

const app = await buildApp();

app.get("/", (req, res) => {
  return "Welcome to maic app";
});

try {
  await app.listen({
    port: 3000,
  });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
