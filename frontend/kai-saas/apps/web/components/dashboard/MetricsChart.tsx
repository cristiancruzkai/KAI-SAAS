'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function MetricsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Actividad de Mensajes</CardTitle>
        <p className="text-sm text-muted-foreground">
          Volumen de mensajes en los últimos 30 días
        </p>
      </CardHeader>
      <CardContent>
        {/* SVG Line Chart - Placeholder */}
        <div className="h-64 flex items-end justify-between gap-1">
          {Array.from({ length: 30 }).map((_, i) => {
            const height = Math.random() * 100;
            return (
              <div
                key={i}
                className="flex-1 bg-gradient-to-t from-emerald-400 to-emerald-300 rounded-t"
                style={{ height: `${height}%` }}
              />
            );
          })}
        </div>
        
        {/* X-axis labels */}
        <div className="flex justify-between text-xs text-muted-foreground mt-4">
          <span>Apr 3</span>
          <span>Apr 17</span>
          <span>May 2</span>
          <span>May 17</span>
          <span>May 27</span>
        </div>
      </CardContent>
    </Card>
  );
}
