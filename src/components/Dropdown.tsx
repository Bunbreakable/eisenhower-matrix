import { useEffect, useRef } from "react";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/solid";

export type DropdownProps = {
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (category: string) => void;
  ariaLabel?: string;
};

export default function Dropdown({
  isOpen,
  onToggle,
  onSelect,
  ariaLabel,
}: DropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onToggle();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onToggle]);

  const handleSelect = (category: string) => {
    onSelect(category);
    onToggle();
  };

  return (
    <div ref={dropdownRef} className="relative flex justify-center items-center group">
      <button
        onClick={onToggle}
        className="text-gray-700 hover:text-gray-900 dark:text-gray-800 dark:hover:text-black"
        aria-label={ariaLabel}
      >
        <ArrowsRightLeftIcon className="w-5 h-5" />
      </button>

      <div className="absolute bottom-full mb-2 hidden group-hover:block w-max bg-neutral-50 text-gray-700 text-xs rounded-sm py-1 px-2 z-20 shadow-lg">
        {ariaLabel}
      </div>

      {isOpen && (
        <div
          className="absolute top-full right-0 mt-1 w-40 bg-white border border-gray-300 rounded shadow-lg z-10 dark:bg-gray-800 dark:border-gray-700"
          role="menu"
          aria-labelledby={ariaLabel}
        >
          <ul className="py-1">
            {["Do", "Delegate"].map((category) => (
              <li key={category}>
                <button
                  onClick={() => handleSelect(category)}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Move to {category}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
