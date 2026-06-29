import "dotenv/config";
import { buildApp } from "./app.js";

try {
  console.log("Building app...");
  const app = await buildApp();
  console.log("App built successfully.");

  app.get("/", async () => {
    return "Welcome to maic app";
  });

  await app.listen({
    host: "0.0.0.0",
    port: process.env.PORT || 3000,
  });

  console.log("Server listening.");
} catch (err) {
  console.error("Startup failed:");
  console.error(err);
  process.exit(1);
}
