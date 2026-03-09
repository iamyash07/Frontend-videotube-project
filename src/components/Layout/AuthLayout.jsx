import { Link } from "react-router-dom";
import ThemeToggle from "../UI/ThemeToggle";

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      {/* Logo */}
      <Link to="/" className="flex items-center gap-3 mb-8">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-xl"
          style={{ backgroundColor: "var(--accent)" }}
        >
          ▶
        </div>
        <span
          className="text-3xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          VideoTube
        </span>
      </Link>

      {/* Card */}
      <div className="clay-card-no-hover w-full max-w-md p-8 animate-scale-in">
        <h1
          className="text-2xl font-bold mb-1 text-center"
          style={{ color: "var(--text-primary)" }}
        >
          {title}
        </h1>
        <p
          className="text-center mb-6"
          style={{ color: "var(--text-muted)" }}
        >
          {subtitle}
        </p>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;