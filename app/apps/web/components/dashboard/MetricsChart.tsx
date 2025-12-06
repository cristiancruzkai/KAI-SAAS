'use client';

export function MetricsChart() {
  // Generate a wavy line path for the chart
  const generateWavyPath = () => {
    const points = [
      { x: 0, y: 60 },
      { x: 40, y: 45 },
      { x: 80, y: 55 },
      { x: 120, y: 35 },
      { x: 160, y: 50 },
      { x: 200, y: 40 },
      { x: 240, y: 55 },
      { x: 280, y: 30 },
      { x: 320, y: 45 },
      { x: 360, y: 35 },
      { x: 400, y: 50 },
      { x: 440, y: 25 },
      { x: 480, y: 40 },
      { x: 520, y: 55 },
      { x: 560, y: 35 },
      { x: 600, y: 45 },
      { x: 640, y: 30 },
      { x: 680, y: 50 },
      { x: 720, y: 40 },
      { x: 760, y: 55 },
    ];
    
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpX = (prev.x + curr.x) / 2;
      path += ` C ${cpX} ${prev.y}, ${cpX} ${curr.y}, ${curr.x} ${curr.y}`;
    }
    return path;
  };

  const dates = ['Apr 3', 'Apr 7', 'Apr 12', 'Apr 17', 'Apr 22', 'Apr 27', 'May 2', 'May 7', 'May 12', 'May 17', 'May 22', 'May 27'];

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm">
      <div className="mb-8">
        <h3 className="text-subtitle font-bold text-slate-800">Line Chart - Interactive</h3>
        <p className="text-textnormal text-gray-500">Showing total visitors for the last 3 months</p>
      </div>
      
      <div className="relative h-48">
        <svg className="w-full h-full" viewBox="0 0 760 80" preserveAspectRatio="none">
          <path
            d={generateWavyPath()}
            fill="none"
            stroke="#14B8A6"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      
      {/* X-axis labels */}
      <div className="flex justify-between text-textnormal text-gray-400 mt-4 px-2">
        {dates.map((date, i) => (
          <span key={i}>{date}</span>
        ))}
      </div>
    </div>
  );
}
