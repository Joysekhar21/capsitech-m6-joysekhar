import { Moon, Sun } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";

export function ModeToggle() {
  const { setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {/* Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="absolute right-8 mt-8 top-0 inline-flex items-center justify-center rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 p-2 shadow hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
      >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </button>

      {/* Dropdown menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-36 rounded-md bg-white dark:bg-slate-800 shadow-md border border-gray-200 dark:border-slate-700 z-50">
          <button
            onClick={() => {
              setTheme("light");
              setOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700"
          >
            Light
          </button>
          <button
            onClick={() => {
              setTheme("dark");
              setOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700"
          >
            Dark
          </button>
          <button
            onClick={() => {
              setTheme("system");
              setOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700"
          >
            System
          </button>
        </div>
      )}
    </div>
  );
}
