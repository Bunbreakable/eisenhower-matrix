import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { title, category } = req.body;

    if (!title || typeof title !== "string") {
      return res.status(400).json({ error: "Invalid task title" });
    }

    if (!category || typeof category !== "string") {
      return res.status(400).json({ error: "Invalid task category" });
    }

    try {
      const newTask = await prisma.task.create({
        data: {
          title,
          priority: "Medium", // Default priority
          completed: false, // Default state
          category,
        },
      });

      return res.status(201).json(newTask);
    } catch (error) {
      console.error("Error creating task:", error);
      return res.status(500).json({ error: "Failed to create task" });
    }
  } else if (req.method === "PUT") {
    const { id, category } = req.body;

    if (!id || typeof id !== "number") {
      return res.status(400).json({ error: "Invalid task ID" });
    }

    if (!category || typeof category !== "string") {
      return res.status(400).json({ error: "Invalid task category" });
    }

    const isCompleted = category === "Completed";

    try {
      const updatedTask = await prisma.task.update({
        where: { id },
        data: {
          category,
          completed: isCompleted,
        },
      });

      return res.status(200).json(updatedTask);
    } catch (error) {
      console.error("Error updating task category:", error);
      return res.status(500).json({ error: "Failed to update task category" });
    }
  } else {
    res.setHeader("Allow", ["POST", "PUT"]);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}
