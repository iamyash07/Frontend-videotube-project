const EmptyState = ({ icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="clay-card-no-hover p-8 flex flex-col items-center text-center max-w-md">
        {icon && (
          <div
            className="text-6xl mb-4"
            style={{ color: "var(--text-muted)" }}
          >
            {icon}
          </div>
        )}
        <h3
          className="text-xl font-bold mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          {title}
        </h3>
        <p className="mb-6" style={{ color: "var(--text-muted)" }}>
          {description}
        </p>
        {action && action}
      </div>
    </div>
  );
};

export default EmptyState;