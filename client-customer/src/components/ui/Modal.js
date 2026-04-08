import React, { useEffect } from 'react';

export function Modal({ open, onClose, title, children, footer, size = 'md' }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  const maxW =
    size === 'sm'
      ? 'max-w-sm'
      : size === 'lg'
        ? 'max-w-lg'
        : 'max-w-md';

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        aria-label="Close"
        onClick={onClose}
      />
      <div
        className={`relative w-full ${maxW} rounded-2xl border border-neutral-200 bg-white p-6 shadow-soft-lg transition-all duration-200 scale-100`}
      >
        {title && (
          <h3 id="modal-title" className="text-lg font-semibold tracking-tight text-black">
            {title}
          </h3>
        )}
        <div className={title ? 'mt-4' : ''}>{children}</div>
        {footer && <div className="mt-6 flex flex-wrap justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}

export default Modal;
