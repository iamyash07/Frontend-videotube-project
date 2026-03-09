const Loader = ({ size = "default", text = "Loading..." }) => {
  const sizeClasses = {
    small: "w-8 h-8",
    default: "w-16 h-16",
    large: "w-24 h-24",
  };

  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="clay-card-no-hover p-8 flex flex-col items-center gap-4">
        <div className={`relative ${sizeClasses[size]}`}>
          <div
            className="absolute inset-0 rounded-full border-4 border-t-transparent animate-spin"
            style={{
              borderColor: "var(--accent)",
              borderTopColor: "transparent",
            }}
          ></div>
          <div
            className="absolute inset-2 rounded-full border-4 border-b-transparent animate-spin"
            style={{
              borderColor: "var(--accent-light)",
              borderBottomColor: "transparent",
              animationDirection: "reverse",
              animationDuration: "0.8s",
            }}
          ></div>
        </div>
        {text && (
          <p style={{ color: "var(--text-secondary)" }} className="font-medium">
            {text}
          </p>
        )}
      </div>
    </div>
  );
};

export default Loader;