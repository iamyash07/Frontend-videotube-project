import { useEffect, useState } from "react";
import { HiCheckCircle, HiXCircle, HiExclamation, HiInformationCircle, HiX } from "react-icons/hi";

const Toast = ({ message, type = "info", duration = 4000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <HiCheckCircle className="w-6 h-6" style={{ color: "var(--success)" }} />,
    error: <HiXCircle className="w-6 h-6" style={{ color: "var(--danger)" }} />,
    warning: <HiExclamation className="w-6 h-6" style={{ color: "var(--warning)" }} />,
    info: <HiInformationCircle className="w-6 h-6" style={{ color: "var(--info)" }} />,
  };

  const toastTypeClass = {
    success: "clay-toast-success",
    error: "clay-toast-error",
    warning: "clay-toast-warning",
    info: "clay-toast-info",
  };

  return (
    <div
      className={`clay-toast ${toastTypeClass[type]} flex items-center gap-3 transition-all duration-300 ${
        visible ? "animate-slide-right opacity-100" : "opacity-0 translate-x-4"
      }`}
    >
      {icons[type]}
      <p className="flex-1 font-medium" style={{ color: "var(--text-primary)" }}>
        {message}
      </p>
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(onClose, 300);
        }}
        className="p-1 rounded-full hover:opacity-70"
        style={{ color: "var(--text-muted)" }}
      >
        <HiX className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;