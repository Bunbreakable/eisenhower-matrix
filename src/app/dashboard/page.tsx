import { prisma } from "@/lib/prisma";
import Dashboard from "./Dashboard";

export default async function DashboardPage() {
  const tasks = await prisma.task.findMany();
  return <Dashboard tasks={tasks} />;
}
