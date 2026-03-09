import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div className="clay-card-no-hover p-12 text-center max-w-md animate-scale-in">
        <div className="text-8xl mb-4">🎬</div>
        <h1
          className="text-6xl font-bold mb-2"
          style={{ color: "var(--accent)" }}
        >
          404
        </h1>
        <h2
          className="text-2xl font-bold mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          Page Not Found
        </h2>
        <p className="mb-8" style={{ color: "var(--text-muted)" }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="clay-button">
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;