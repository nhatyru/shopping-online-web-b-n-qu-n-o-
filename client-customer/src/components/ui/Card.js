import React from 'react';

export function Card({ className = '', children, padding = true, ...rest }) {
  return (
    <div
      className={[
        'rounded-2xl border border-neutral-200/90 bg-white shadow-soft transition-shadow duration-200 hover:shadow-soft-lg',
        padding ? 'p-6 sm:p-8' : '',
        className,
      ].join(' ')}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action }) {
  return (
    <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {title && (
          <h2 className="text-lg font-semibold tracking-tight text-black">
            {title}
          </h2>
        )}
        {subtitle && (
          <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>
        )}
      </div>
      {action && <div className="mt-2 sm:mt-0">{action}</div>}
    </div>
  );
}

export default Card;
