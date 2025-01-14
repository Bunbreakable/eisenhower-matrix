"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
//import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/solid";

type Task = {
  id: number;
  title: string;
  category?: string;
};

export default function PlannerPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [step, setStep] = useState(1);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [isImportant, setIsImportant] = useState<boolean | null>(null);
  const router = useRouter();

  const handleAddTask = async () => {
    if (!taskTitle.trim()) return;

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: taskTitle,
          category: "Uncategorized",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add task");
      }

      const newTask = await response.json();
      setTasks([...tasks, newTask]);
      setTaskTitle("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleDoneAdding = async () => {
    if (taskTitle.trim()) {
      handleAddTask();
    }

    if (tasks.length === 0) {
      alert("Please add at least one task before proceeding.");
      return;
    }

    setStep(2);
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      await handleAddTask();
    }
  };

  const handleYesNo = async (answer: boolean) => {
    if (isImportant === null) {
      // First question: Is it important?
      setIsImportant(answer);
    } else {
      // Second question: Is it urgent?
      const task = tasks[currentTaskIndex];
      const category =
        isImportant && answer
          ? "Do"
          : isImportant && !answer
          ? "Decide"
          : !isImportant && answer
          ? "Delegate"
          : "Delete";

      try {
        await fetch("/api/tasks", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: task.id,
            category,
          }),
        });

        // Update the task category
        const updatedTasks = [...tasks];
        updatedTasks[currentTaskIndex] = { ...task, category };
        setTasks(updatedTasks);

        // Reset for next task
        setIsImportant(null);

        // Move to the next task or finish
        if (currentTaskIndex + 1 < tasks.length) {
          setCurrentTaskIndex(currentTaskIndex + 1);
        } else {
          setStep(3); // All tasks categorized
        }
      } catch (error) {
        console.error("Error updating task category:", error);
      }
    }
  };

  const goToDashboard = () => {
    router.push("/dashboard");
  };

  if (step === 1) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 relative">
        <div className="absolute top-4 left-4">
          <Link
            href="/"
            className="flex items-center text-gray-200 hover:text-gray-300 font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5 mr-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
            Home
          </Link>
        </div>
        <h1 className="text-4xl sm:text-6xl font-bold text-center">
          Step #1: List all your tasks
        </h1>
        <p className="text-lg text-center mt-4 max-w-lg">
          List any tasks that come to your mind right now:
          <span className="relative group">
            <QuestionMarkCircleIcon className="w-5 h-5 inline-block ml-2 text-gray-500 cursor-pointer hover:text-gray-700" />
            <span className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-64 p-2 bg-gray-800 text-gray-200 text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
              The goal is to go from many thoughts racing through your head, to
              having them all in one clear overview.
            </span>
          </span>
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
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            Add
          </button>
        </div>
        <div>
          <button
            onClick={handleDoneAdding}
            className="bg-yellow-500 text-white p-3 mt-6 rounded-full hover:bg-yellow-600 flex items-center justify-center"
          >
            <ArrowRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }

  if (step === 2) {
    const task = tasks[currentTaskIndex];
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <h1 className="text-4xl sm:text-6xl font-bold text-center">
          Step #2: Categorize Your Tasks
        </h1>
        <p className="text-lg mt-6">
          {isImportant === null
            ? `Is "${task.title}" important?`
            : `Is "${task.title}" urgent?`}
        </p>
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => handleYesNo(true)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Yes
          </button>
          <button
            onClick={() => handleYesNo(false)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            No
          </button>
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <h1 className="text-4xl sm:text-6xl font-bold text-center">
          Great! Now you have all of your tasks neatly organized in four groups.
        </h1>
        <button
          onClick={goToDashboard}
          className="bg-purple-500 text-white px-4 py-2 mt-6 rounded hover:bg-purple-600"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return null;
}
