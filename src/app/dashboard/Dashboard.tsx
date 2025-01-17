"use client";

import React, { useState } from "react";
import Link from "next/link";
import Dropdown from "@/components/Dropdown";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { TrashIcon } from "@heroicons/react/24/solid";

type Task = {
  id: number;
  title: string;
  category: string;
  completed: boolean;
};

export default function Dashboard({ tasks: initialTasks }: { tasks: Task[] }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const categories = ["Do", "Decide", "Delegate", "Delete", "Completed"];
  const [activeTab, setActiveTab] = useState("Do");
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  const filteredTasks =
    activeTab === "Completed"
      ? tasks.filter((task) => task.completed)
      : tasks.filter((task) => task.category === activeTab);

  const markAsCompleted = async (taskId: number) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: taskId,
          category: "Completed",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to mark task as completed");
      }

      const updatedTask = await response.json();

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === updatedTask.id ? { ...task, category: "Completed" } : task
        )
      );
    } catch (error) {
      console.error("Failed to mark task as completed:", error);
    }
  };

  const markAsDeleted = async (taskId: number) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: taskId,
          category: "Delete",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      const updatedTask = await response.json();
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === updatedTask.id ? { ...task, category: "Delete" } : task
        )
      );
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleToggleDropdown = (id: number) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const moveTask = async (taskId: number, category: string) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: taskId,
          category,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to move task");
      }

      const updatedTask = await response.json();

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === updatedTask.id ? { ...task, category } : task
        )
      );
    } catch (error) {
      console.error("Failed to move task:", error);
    }
  };

  return (
    <div className="min-h-screen p-8 relative">
      <div className="absolute top-4 left-4">
        <Link
          href="/planner"
          className="flex items-center text-gray-700 hover:text-gray-800 font-medium dark:text-gray-200 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="h-5 w-5 mr-1" />
          To Planner
        </Link>
      </div>
      <h1 className="text-4xl font-bold text-center mb-8">Dashboard</h1>
      <div className="flex gap-4 justify-center mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveTab(category)}
            className={`px-4 py-2 rounded ${
              activeTab === category
                ? "bg-purple-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="bg-gray-200 p-6 rounded shadow-md">
        <h2 className="text-2xl text-gray-800 font-bold text-center mb-4">
          {activeTab}
        </h2>
        {filteredTasks.length > 0 ? (
          <ul className="space-y-4">
            {" "}
            {/* Add space between cards */}
            {filteredTasks.map((task) => (
              <li
                className="bg-white p-4 rounded-lg shadow flex justify-between items-center dark:bg-gray-800"
                key={task.id}
              >
                {/* Task Title */}
                <span className="text-lg font-medium text-gray-800 dark:text-gray-200">
                  {task.title}
                </span>

                {/* Action Buttons */}
                <div className="flex items-center gap-4">
                  {["Do", "Decide", "Delegate"].includes(activeTab) && (
                    <button
                      onClick={() => markAsDeleted(task.id)}
                      className="text-red-500 hover:text-red-700 dark:text-red-600 dark:hover:text-red-800"
                      aria-label="Delete Task"
                      title="Delete task"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  )}

                  {activeTab === "Do" && (
                    <button
                      onClick={() => markAsCompleted(task.id)}
                      className="text-green-600 hover:text-green-800 dark:text-green-700 dark:hover:text-green-900"
                      aria-label="Mark as Completed"
                      title="Mark as Completed"
                    >
                      <CheckCircleIcon className="h-5 w-5" />
                    </button>
                  )}

                  {activeTab === "Decide" && (
                    <Dropdown
                      isOpen={openDropdownId === task.id}
                      onToggle={() => handleToggleDropdown(task.id)}
                      onSelect={(category) => moveTask(task.id, category)}
                      ariaLabel={`Move task`}
                    />
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : activeTab === "Do" ? (
          <div className="text-gray-500 text-center">
            <p className="mb-4">Yay! You did all your tasks here! 🎉</p>
            <button
              onClick={() => setActiveTab("Decide")}
              className="text-purple-500 hover:underline"
            >
              Pick another task from the Decide tab?
            </button>
            <p className="mt-4">
              <Link href="/planner" className="text-yellow-600 hover:underline">
                Or go to the planner to add a new task.
              </Link>
            </p>
          </div>
        ) : (
          <p className="text-gray-500">Currently no tasks to show</p>
        )}
      </div>
    </div>
  );
}
