// client/src/components/ThemeToggle.jsx
import { useTheme } from "../context/ThemeContext";
import "./ThemeToggle.css"; // optional, for styles

export default function ThemeToggle() {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <button className="theme-toggle" onClick={toggleTheme}>
      {darkMode ? "☀ Light" : "🌙 Dark"}
    </button>
  );
}
