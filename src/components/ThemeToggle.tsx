import { Moon, Sun } from "lucide-react";
import { useTheme } from "../contexts/theme-context";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const label = isDark ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`flex items-center justify-center w-10 h-10 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors ${className}`}
      aria-label={label}
      title={label}
      data-testid="theme-toggle"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
