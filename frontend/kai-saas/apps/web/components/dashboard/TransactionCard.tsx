'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TransactionCardProps {
  color?: 'blue' | 'yellow' | 'purple';
}

export function TransactionCard({ color = 'blue' }: TransactionCardProps) {
  const colors = {
    blue: {
      income: 'bg-blue-600',
      expense: 'bg-blue-900',
    },
    yellow: {
      income: 'bg-yellow-400',
      expense: 'bg-blue-900',
    },
    purple: {
      income: 'bg-purple-600',
      expense: 'bg-purple-900',
    },
  };

  const data = [
    { income: 60, expense: 40 },
    { income: 90, expense: 70 },
    { income: 70, expense: 50 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Resumen Financiero</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Legend */}
        <div className="flex items-center gap-4 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${colors[color].income}`} />
            <span>Ingresos</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${colors[color].expense}`} />
            <span>Gastos</span>
          </div>
        </div>

        {/* Amount */}
        <div className="text-right mb-4">
          <p className="text-2xl font-bold">$8,566</p>
          <p className="text-sm text-muted-foreground">Gastos Totales</p>
        </div>

        {/* Bar Chart */}
        <div className="flex items-end justify-around h-32 gap-4">
          {data.map((item, i) => (
            <div key={i} className="flex items-end gap-2 flex-1">
              <div
                className={`${colors[color].expense} rounded-t w-full`}
                style={{ height: `${item.expense}%` }}
              />
              <div
                className={`${colors[color].income} rounded-t w-full`}
                style={{ height: `${item.income}%` }}
              />
            </div>
          ))}
        </div>

        {/* Y-axis labels */}
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>80</span>
          <span>80</span>
          <span>100</span>
        </div>
      </CardContent>
    </Card>
  );
}
