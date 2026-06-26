
import prisma from "../lib/prisma.js";
import fs from "fs";
import path from "path";
import { pipeline } from "stream/promises";
import { processEntry } from "../lib/processEntry.js";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

export async function entryRoutes(app) {

  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

  app.post("/entries", async (request, reply) => {
    const file = await request.file();
    if (!file) {
      return reply.status(400).send({ error: "No audio file provided" });
    }


    const entry = await prisma.entry.create({
      data: {
        audioUrl: "",
        recordedAt: new Date(),
      },
    });

    const ext = path.extname(file.filename) || ".m4a";
    const entryDir = path.join(UPLOAD_DIR, entry.id);
    fs.mkdirSync(entryDir, { recursive: true });
    const filePath = path.join(entryDir, `audio${ext}`);

    await pipeline(file.file, fs.createWriteStream(filePath));

    const updated = await prisma.entry.update({
      where: { id: entry.id },
      data: { audioUrl: filePath },
    });


    processEntry(updated.id).catch((err) => {
      app.log.error(err, `Processing failed for entry ${updated.id}`);
    });

    return reply.status(201).send(updated);
  });

  app.get("/entries", async (request, reply) => {
    const { category, limit = "20", offset = "0" } = request.query;

    const entries = await prisma.entry.findMany({
      where: category ? { category: category } : undefined,
      orderBy: { recordedAt: "desc" },
      take: Number(limit),
      skip: Number(offset),
    });

    return reply.send(entries);
  });

  app.get("/entries/:id", async (request, reply) => {
    const { id } = request.params;
    const entry = await prisma.entry.findUnique({ where: { id } });

    if (!entry) {
      return reply.status(404).send({ error: "Entry not found" });
    }
    return reply.send(entry);
  });

  app.patch("/entries/:id", async (request, reply) => {
    const { id } = request.params;
    const body = request.body;

    const data = {};
    if (body.category !== undefined) data.category = body.category;
    if (body.title !== undefined) data.title = body.title;
    if (body.tags !== undefined) data.tags = body.tags;

    try {
      const updated = await prisma.entry.update({ where: { id }, data });
      return reply.send(updated);
    } catch (err) {
      return reply.status(404).send({ error: "Entry not found" });
    }
  });
}
