import React from 'react';

export function PageSpinner({ label = 'Loading…' }) {
  return (
    <div className="flex min-h-[32vh] flex-col items-center justify-center gap-4 py-16">
      <div
        className="h-10 w-10 animate-spin rounded-full border-2 border-neutral-200 border-t-black"
        aria-hidden
      />
      <p className="text-sm text-neutral-500">{label}</p>
    </div>
  );
}

export default PageSpinner;
