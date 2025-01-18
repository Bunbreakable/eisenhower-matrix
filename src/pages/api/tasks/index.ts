import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const tasks = await prisma.task.findMany({
        orderBy: { order: "asc" },
      });
      return res.status(200).json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return res.status(500).json({ error: "Failed to fetch tasks" });
    }
  } else if (req.method === "POST") {
    const { title, category } = req.body;

    if (!title || typeof title !== "string") {
      return res.status(400).json({ error: "Invalid task title" });
    }

    if (!category || typeof category !== "string") {
      return res.status(400).json({ error: "Invalid task category" });
    }

    try {
      const lastTaskInCategory = await prisma.task.findFirst({
        where: { category },
        orderBy: { order: "desc" },
      });

      const newTask = await prisma.task.create({
        data: {
          title,
          priority: "Medium",
          completed: false,
          category,
          order: lastTaskInCategory ? lastTaskInCategory.order + 1 : 1,
        },
      });

      return res.status(201).json(newTask);
    } catch (error) {
      console.error("Error creating task:", error);
      return res.status(500).json({ error: "Failed to create task" });
    }
  } else if (req.method === "PUT") {
    const { id, category, title, priority, order } = req.body;

    if (!id || typeof id !== "number") {
      return res.status(400).json({ error: "Invalid task ID" });
    }

    type TaskUpdateData = {
      category?: string;
      title?: string;
      priority?: string;
      order?: number;
      completed?: boolean;
    };

    const updatedData: TaskUpdateData = {};

    if (typeof category === "string") {
      updatedData.category = category;
      updatedData.completed = category === "Completed";
    }
    if (typeof title === "string") updatedData.title = title;
    if (typeof priority === "string") updatedData.priority = priority;
    if (typeof order === "number" && order >= 0) updatedData.order = order;

    try {
      const updatedTask = await prisma.task.update({
        where: { id },
        data: updatedData,
      });

      return res.status(200).json(updatedTask);
    } catch (error) {
      console.error("Error updating task category:", error);
      return res.status(500).json({ error: "Failed to update task category" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST", "PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
