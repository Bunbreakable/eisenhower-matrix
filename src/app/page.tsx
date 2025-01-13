import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-6 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {/* Logo and H1 */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        <Image
          className="dark:invert"
          src="/icon.svg"
          alt="Eisenhower Matrix logo"
          width={80}
          height={38}
          priority
        />
        <h1 className="text-4xl sm:text-6xl font-bold text-center sm:text-left">
          Eisenhower Matrix
        </h1>
      </div>

      {/* Description Paragraph */}
      <p className="text-center text-lg sm:text-xl max-w-xl">
        The Eisenhower Matrix is a productivity tool to help you organize tasks
        by urgency and importance, so you can focus on what truly matters.
      </p>

      {/* Plan Your Tasks Button */}
      <div className="flex items-center justify-center">
        <a
          className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
          href="/planner"
        >
          Start Planning
        </a>
      </div>
    </div>
  );
}
