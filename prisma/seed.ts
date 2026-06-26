import prisma from "../src/lib/prisma.js";
import { Category } from "../generated/prisma";
async function main() {
  const entry1 = await prisma.entry.create({
    data: {
      audioUrl: "https://example.com/audio/idea-1.mp3",
      transcript:
        "What if the wearable journal automatically categorizes thoughts using AI?",
      category: Category.IDEA,
      title: "AI Journal Device",
      tags: ["startup", "ai", "hardware"],
      mood: "excited",
      recordedAt: new Date("2026-06-19T09:15:00Z"),
    },
  });

  const entry2 = await prisma.entry.create({
    data: {
      audioUrl: "https://example.com/audio/dream-1.mp3",
      transcript:
        "I dreamed about building a futuristic workspace with holographic screens.",
      category: Category.DREAM,
      title: "Future Workspace Dream",
      tags: ["dream", "tech"],
      mood: "curious",
      recordedAt: new Date("2026-06-19T07:30:00Z"),
    },
  });

  const entry3 = await prisma.entry.create({
    data: {
      audioUrl: "https://example.com/audio/task-1.mp3",
      transcript: "Finish Node.js backend setup and create Prisma models.",
      category: Category.TASK,
      title: "Backend Setup",
      tags: ["coding", "backend"],
      mood: "focused",
      recordedAt: new Date("2026-06-19T12:00:00Z"),
    },
  });

  const entry4 = await prisma.entry.create({
    data: {
      audioUrl: "https://example.com/audio/purchase-1.mp3",
      transcript: "Need to buy a better microphone for voice journaling.",
      category: Category.PURCHASE,
      title: "Buy Microphone",
      tags: ["shopping", "equipment"],
      mood: "neutral",
      recordedAt: new Date("2026-06-19T15:00:00Z"),
    },
  });

  await prisma.dailySummary.create({
    data: {
      date: new Date("2026-06-19"),
      summaryText:
        "Today's thoughts revolved around building the AI journal device, planning backend work, and improving the voice capture setup.",
      entries: {
        connect: [
          { id: entry1.id },
          { id: entry2.id },
          { id: entry3.id },
          { id: entry4.id },
        ],
      },
    },
  });

  console.log("✅ Seeded successfully");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
