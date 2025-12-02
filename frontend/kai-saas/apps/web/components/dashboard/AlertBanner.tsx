'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AlertBannerProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function AlertBanner({ title, description, actionLabel, onAction }: AlertBannerProps) {
  return (
<div className="w-[1089px] h-48 bg-orange-400 rounded-2xl shadow-[0px_4px_20px_0px_rgba(0,0,0,0.08)]" >
      <div className="max-w-2xl">
        <p className="text-sm font-medium mb-2 opacity-90">NOVEDADES</p>
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-lg mb-4">{description}</p>
        
        {actionLabel && (
          <Button
            variant="secondary"
            className="bg-white/20 hover:bg-white/30 text-white border-white/40"
            onClick={onAction}
          >
            {actionLabel}
          </Button>
        )}
      </div>

      {/* Decorative dots */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 space-y-2">
        <div className="w-2 h-2 rounded-full bg-white/30" />
        <div className="w-2 h-2 rounded-full bg-white/50" />
        <div className="w-2 h-2 rounded-full bg-white/30" />
      </div>

      <button className="absolute top-4 right-4 text-white/70 hover:text-white">
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}
