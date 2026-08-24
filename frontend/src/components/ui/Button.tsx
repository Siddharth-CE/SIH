import React from 'react';
import { clsx } from 'clsx';
import { useAccessibility } from '../../context/AccessibilityContext';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'amber' | 'coral' | 'ghost';
  size?: 'md' | 'lg' | 'xl' | 'icon';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'lg',
  fullWidth = false,
  className,
  children,
  onClick,
  disabled,
  ...props
}) => {
  const { playChime } = useAccessibility();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      playChime('click');
      if (onClick) onClick(e);
    }
  };

  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-700/40 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

  const sizeStyles = {
    md: 'min-h-[48px] px-4 py-2 text-base touch-target-senior',
    lg: 'min-h-[56px] px-6 py-3.5 text-lg touch-target-senior font-bold tracking-wide',
    xl: 'min-h-[64px] px-8 py-4 text-xl touch-target-senior font-extrabold tracking-wide shadow-md',
    icon: 'min-h-[56px] min-w-[56px] p-3 touch-target-senior rounded-full',
  };

  const variantStyles = {
    primary:
      'bg-[#0F4C3A] text-white hover:bg-[#0A3327] shadow-sm hover:shadow-md active:bg-[#08291F]',
    secondary:
      'bg-[#E7F3ED] text-[#0F4C3A] hover:bg-[#D4EBE0] border border-[#BDE0D0]',
    outline:
      'bg-white text-stone-700 hover:bg-stone-50 border-2 border-stone-200 hover:border-stone-300 shadow-xs',
    amber:
      'bg-[#D97706] text-white hover:bg-[#B45309] shadow-sm hover:shadow-md',
    coral:
      'bg-[#E06D53] text-white hover:bg-[#C95339] shadow-sm hover:shadow-md',
    ghost:
      'bg-transparent text-stone-700 hover:bg-stone-100 hover:text-stone-900',
  };

  return (
    <button
      className={clsx(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        fullWidth && 'w-full',
        className
      )}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
