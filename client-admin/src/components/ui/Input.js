import React from 'react';

export function Input({
  label,
  id,
  className = '',
  inputClassName = '',
  hint,
  error,
  ...inputProps
}) {
  const inputId = id || (label ? label.replace(/\s+/g, '-').toLowerCase() : undefined);
  return (
    <label className={['block w-full', className].join(' ')} htmlFor={inputId}>
      {label && (
        <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-neutral-600">
          {label}
        </span>
      )}
      <input
        id={inputId}
        className={[
          'w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-black outline-none transition-all duration-200',
          'placeholder:text-neutral-400 focus:border-black focus:ring-2 focus:ring-black/10',
          error ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : '',
          inputClassName,
        ].join(' ')}
        {...inputProps}
      />
      {hint && !error && (
        <span className="mt-1 block text-xs text-neutral-500">{hint}</span>
      )}
      {error && (
        <span className="mt-1 block text-xs text-red-600">{error}</span>
      )}
    </label>
  );
}

export function Select({ label, id, children, className = '', selectClassName = '', ...rest }) {
  const selectId = id || (label ? label.replace(/\s+/g, '-').toLowerCase() : undefined);
  return (
    <label className={['block w-full', className].join(' ')} htmlFor={selectId}>
      {label && (
        <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-neutral-600">
          {label}
        </span>
      )}
      <select
        id={selectId}
        className={[
          'w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-black outline-none transition-all duration-200',
          'focus:border-black focus:ring-2 focus:ring-black/10',
          selectClassName,
        ].join(' ')}
        {...rest}
      >
        {children}
      </select>
    </label>
  );
}

export default Input;
