import { KAI_COLORS } from '@/lib/constants';
import { ButtonHTMLAttributes } from 'react';

interface KaiButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function KaiButton({ children, className = '', ...props }: KaiButtonProps) {
  return (
    <button
      className={`px-6 py-2 rounded-full font-bold text-black transition-transform hover:scale-105 ${className}`}
      style={{ backgroundColor: KAI_COLORS.yellow }}
      {...props}
    >
      {children}
    </button>
  );
}
