import { useEffect } from "react";
import { FiX } from "react-icons/fi";

const Dialog = ({ open, title, onClose, children, actions }) => {
  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4"
      role="presentation"
    >
      <div
        aria-labelledby="dialog-title"
        aria-modal="true"
        className="w-full max-w-lg rounded-xl border border-cyan-300/20 bg-slate-950 p-6 shadow-2xl shadow-cyan-950/40"
        role="dialog"
      >
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-white" id="dialog-title">
            {title}
          </h2>
          <button
            aria-label="Close dialog"
            className="rounded-lg border border-cyan-300/20 p-2 text-cyan-200 hover:bg-cyan-300/10 hover:text-white"
            onClick={onClose}
            type="button"
          >
            <FiX size={20} />
          </button>
        </div>
        <div className="mt-5">{children}</div>
        {actions && (
          <div className="mt-6 flex justify-end gap-2">{actions}</div>
        )}
      </div>
    </div>
  );
};

export default Dialog;
