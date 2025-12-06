'use client';

interface TransactionCardProps {
  variant?: 'green' | 'yellow' | 'blue';
}

export function TransactionCard({ variant = 'green' }: TransactionCardProps) {
  const colors = {
    green: {
      income: 'bg-emerald-400',
      incomeDot: 'bg-emerald-400',
      expense: 'bg-emerald-500',
      expenseDot: 'bg-emerald-500',
    },
    yellow: {
      income: 'bg-yellow-400',
      incomeDot: 'bg-yellow-400',
      expense: 'bg-blue-900',
      expenseDot: 'bg-blue-900',
    },
    blue: {
      income: 'bg-blue-500',
      incomeDot: 'bg-blue-500',
      expense: 'bg-blue-900',
      expenseDot: 'bg-blue-900',
    },
  };

  const data = [
    { income: 45, expense: 65 },
    { income: 55, expense: 75 },
    { income: 35, expense: 55 },
    { income: 60, expense: 85 },
    { income: 40, expense: 60 },
    { income: 50, expense: 70 },
    { income: 45, expense: 80 },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <h3 className="text-subtitle font-bold text-slate-800 mb-4">Transaction Overview</h3>
      
      {/* Legend */}
      <div className="flex items-center gap-5 mb-5 text-textnormal">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${colors[variant].incomeDot}`} />
          <span className="text-gray-600">Income</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${colors[variant].expenseDot}`} />
          <span className="text-gray-600">Expense</span>
        </div>
      </div>

      {/* Chart Area */}
      <div className="relative">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-textnormal text-gray-300 pr-2">
          <span>100</span>
          <span>80</span>
        </div>
        
        {/* Tooltip */}
        <div className="absolute right-4 top-0 bg-white rounded-xl shadow-lg p-3 text-center z-10 border border-gray-100">
          <p className="text-subtitle font-bold text-slate-800">$85,66</p>
          <p className="text-textnormal text-gray-400">Expense</p>
        </div>

        {/* Horizontal dashed lines */}
        <div className="absolute left-6 right-0 top-4 border-t border-dashed border-emerald-200"></div>
        <div className="absolute left-6 right-0 top-12 border-t border-dashed border-emerald-200"></div>

        {/* Bar Chart */}
        <div className="flex items-end justify-around h-32 gap-3 pl-8 pt-8">
          {data.map((item, i) => (
            <div key={i} className="flex items-end gap-1 flex-1">
              <div
                className={`${colors[variant].income} rounded-full w-2`}
                style={{ height: `${item.income}%` }}
              />
              <div
                className={`${colors[variant].expense} rounded-full w-2`}
                style={{ height: `${item.expense}%` }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
