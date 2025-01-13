import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { title } = req.body;

    if (!title || typeof title !== "string") {
      return res.status(400).json({ error: "Invalid task title" });
    }

    try {
      const newTask = await prisma.task.create({
        data: {
          title,
          priority: "Medium", // Default priority
          completed: false, // Default state
        },
      });

      return res.status(201).json(newTask);
    } catch (error) {
      console.error("Error creating task:", error);
      return res.status(500).json({ error: "Failed to create task" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}
