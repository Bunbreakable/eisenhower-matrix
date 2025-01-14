"use client";

import React, { useState } from "react";
import Link from "next/link";

type Task = {
  id: number;
  title: string;
  category: string;
};

export default function Dashboard({ tasks }: { tasks: Task[] }) {
  const categories = ["Do", "Decide", "Delegate", "Delete"];
  const [activeTab, setActiveTab] = useState("Do");

  const filteredTasks = tasks.filter((task) => task.category === activeTab);

  return (
      <div className="min-h-screen p-8 relative">
        <div className="absolute top-4 left-4">
          <Link
            href="/planner"
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
          <h2 className="text-2xl text-gray-800 font-bold mb-4">{activeTab}</h2>
          {filteredTasks.length > 0 ? (
            <ul className="list-disc pl-6">
              {filteredTasks.map((task) => (
                <li className="text-gray-800" key={task.id}>
                  {task.title}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Currently no tasks to show</p>
          )}
        </div>
      </div>
  );
}
