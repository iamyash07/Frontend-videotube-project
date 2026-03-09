import { HiExclamation } from "react-icons/hi";

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirm", danger = false }) => {
  if (!isOpen) return null;

  return (
    <div className="clay-modal-overlay" onClick={onCancel}>
      <div
        className="clay-modal animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: danger ? "rgba(239,68,68,0.1)" : "rgba(46,125,50,0.1)",
            }}
          >
            <HiExclamation
              className="w-6 h-6"
              style={{ color: danger ? "var(--danger)" : "var(--accent)" }}
            />
          </div>
          <h3 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
            {title}
          </h3>
        </div>

        <p className="mb-6" style={{ color: "var(--text-secondary)" }}>
          {message}
        </p>

        <div className="flex justify-end gap-3">
          <button className="clay-button-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button
            className={danger ? "clay-button-danger" : "clay-button"}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;