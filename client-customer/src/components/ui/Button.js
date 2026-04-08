import React from 'react';

const variants = {
  primary:
    'bg-black text-white hover:bg-neutral-800 active:scale-[0.98] shadow-soft',
  secondary:
    'bg-white text-black border border-black hover:bg-neutral-50 active:scale-[0.98]',
  outline:
    'bg-transparent text-black border border-neutral-300 hover:border-black hover:bg-white',
  ghost: 'bg-transparent text-black hover:bg-neutral-100',
  danger:
    'bg-black text-white hover:bg-red-600 active:scale-[0.98]',
};

const sizes = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-2.5 text-sm',
  lg: 'px-8 py-3 text-base',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  disabled,
  children,
  type = 'button',
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide transition-all duration-200 disabled:opacity-40 disabled:pointer-events-none',
        variants[variant] || variants.primary,
        sizes[size] || sizes.md,
        className,
      ].join(' ')}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;
