'use client';

import { Card } from '@/components/ui/card';
import { Bell, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StatCardProps {
  label: string;
  value: string;
  variant?: 'default' | 'warning';
}

export function StatCard({ label, value, variant = 'default' }: StatCardProps) {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <Bell className={variant === 'warning' ? 'text-orange-500' : 'text-gray-400'} />
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
      
      <div>
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </Card>
  );
}
