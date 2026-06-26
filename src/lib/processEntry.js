import fs from "fs";
import OpenAI from "openai";
import prisma from "./prisma.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const CLASSIFICATION_PROMPT = `
You are classifying a short voice journal entry transcript.

Return ONLY valid JSON in this exact format:

{
  "category": "IDEA" | "DREAM" | "PURCHASE" | "TASK" | "JOURNAL_NOTE" | "RANDOM_THOUGHT",
  "title": "3-7 word descriptive title",
  "tags": ["lowercase", "keywords"],
  "mood": "one word mood or null"
}
`;

export async function processEntry(entryId) {
  try {
    await prisma.entry.update({
      where: { id: entryId },
      data: { status: "PROCESSING" },
    });

    const entry = await prisma.entry.findUniqueOrThrow({
      where: { id: entryId },
    });


    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(entry.audioUrl),
      model: "whisper-1",
    });


    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: CLASSIFICATION_PROMPT,
        },
        {
          role: "user",
          content: transcription.text,
        },
      ],
    });

    const parsed = JSON.parse(response.output_text);


    await prisma.entry.update({
      where: { id: entryId },
      data: {
        transcript: transcription.text,
        category: parsed.category,
        title: parsed.title,
        tags: parsed.tags ?? [],
        mood: parsed.mood,
        status: "COMPLETED",
      },
    });
  } catch (err) {
    await prisma.entry.update({
      where: { id: entryId },
      data: {
        status: "FAILED",
      },
    });

    throw err;
  }
}
