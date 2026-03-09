import { HiSun, HiMoon } from "react-icons/hi";
import { useTheme } from "../../context/ThemeContext.jsx";

const ThemeToggle = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className="clay-button-secondary !p-3 !rounded-full flex items-center justify-center"
      aria-label="Toggle dark mode"
    >
      {darkMode ? (
        <HiSun className="w-5 h-5 text-yellow-400" />
      ) : (
        <HiMoon className="w-5 h-5" style={{ color: "var(--accent)" }} />
      )}
    </button>
  );
};

export default ThemeToggle;