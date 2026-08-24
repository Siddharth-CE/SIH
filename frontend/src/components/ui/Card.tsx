import React from 'react';
import { clsx } from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'warm' | 'forest' | 'sand' | 'amber' | 'glass';
  highlightBorder?: boolean;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  highlightBorder = false,
  className,
  children,
  ...props
}) => {
  const variantStyles = {
    default: 'glass-panel-card rounded-3xl p-6 sm:p-7 card-warm-hover',
    warm: 'glass-panel-card rounded-3xl p-6 sm:p-7 card-warm-hover',
    forest: 'glass-panel-forest rounded-3xl p-6 sm:p-7 card-warm-hover',
    sand: 'glass-panel rounded-3xl p-6 sm:p-7 card-warm-hover',
    amber: 'glass-panel-gold rounded-3xl p-6 sm:p-7 card-warm-hover',
    glass: 'glass-panel rounded-3xl p-6 sm:p-7 card-warm-hover',
  };

  return (
    <div
      className={clsx(
        variantStyles[variant],
        highlightBorder && 'ring-2 ring-emerald-400 border-emerald-400',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface BadgeProps {
  variant?: 'forest' | 'amber' | 'coral' | 'blue' | 'slate' | 'neutral';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'forest',
  size = 'md',
  children,
  className,
}) => {
  const variantStyles = {
    forest: 'bg-emerald-900/60 backdrop-blur-md text-emerald-300 border-emerald-500/40 shadow-xs',
    amber: 'bg-amber-900/60 backdrop-blur-md text-amber-300 border-amber-500/40 shadow-xs',
    coral: 'bg-rose-900/60 backdrop-blur-md text-rose-300 border-rose-500/40 shadow-xs',
    blue: 'bg-sky-900/60 backdrop-blur-md text-sky-300 border-sky-500/40 shadow-xs',
    slate: 'bg-stone-800/60 backdrop-blur-md text-stone-200 border-stone-600 shadow-xs',
    neutral: 'bg-emerald-800/40 backdrop-blur-md text-emerald-100 border-emerald-600/50 shadow-xs',
  };

  const sizeStyles = {
    sm: 'text-xs px-3 py-1 font-bold rounded-full border',
    md: 'text-sm px-4 py-1.5 font-extrabold rounded-full border',
  };

  return (
    <span className={clsx('inline-flex items-center gap-1.5', variantStyles[variant], sizeStyles[size], className)}>
      {children}
    </span>
  );
};
