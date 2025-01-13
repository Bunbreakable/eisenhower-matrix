"use client";

import { useState } from "react";

export default function PlannerPage() {
  const [taskTitle, setTaskTitle] = useState("");

  const handleAddTask = async () => {
    if (!taskTitle.trim()) return; // Prevent adding empty tasks

    console.log("Adding Task:", taskTitle); // Logs the value of the input before submission

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: taskTitle }),
      });

      if (!response.ok) {
        throw new Error("Failed to add task");
      }

      setTaskTitle(""); // Clear input after successful submission
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddTask();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-4xl sm:text-6xl font-bold text-center">
        Step #1: List all your tasks
      </h1>
      <p className="text-lg text-center mt-4 max-w-lg">
        The first step in planning your tasks is to clearly organize them. Go
        from many thoughts racing through your head, to having them all in one
        clear overview.
      </p>
      <p className="text-lg text-center mt-4 max-w-lg">
        List any tasks that come to your mind right now:
      </p>

      {/* Input Field and Add Button */}
      <div className="flex items-center gap-2 mt-6">
        <input
          type="text"
          placeholder="Enter your task"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          className="border border-gray-300 rounded p-2 w-64 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 placeholder-gray-500"
        />
        <button
          onClick={handleAddTask}
          className="bg-purple-500 text-white-100 px-4 py-2 rounded hover:bg-purple-600"
        >
          Add
        </button>
      </div>
    </div>
  );
}
