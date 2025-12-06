'use client';

export default function CalendarPage() {
  return (
    <div className="w-full h-screen bg-gradient-to-b from-stone-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-neutral-900 mb-4">Calendario</h1>
        <p className="text-lg text-neutral-600 mb-8">
          Vista de calendario para gestionar eventos y recordatorios.
        </p>
        
        <div className="bg-white rounded-2xl shadow-lg p-8 min-h-[600px] flex items-center justify-center">
          <div className="text-center">
            <svg className="w-24 h-24 mx-auto mb-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 1C16.5523 1 17 1.44772 17 2V3C19.2091 3 21 4.79086 21 7V17C21 19.2091 19.2091 21 17 21H7C4.79086 21 3 19.2091 3 17V7C3 4.79086 4.79086 3 7 3V2C7 1.44772 7.44772 1 8 1C8.55228 1 9 1.44772 9 2V3H15V2C15 1.44772 15.4477 1 16 1ZM9 5C9 5.55228 8.55228 6 8 6C7.48232 6 7.05621 5.60667 7.00488 5.10254L7 5C5.9457 5 5.08229 5.81581 5.00586 6.85059L5 7V8H19V7C19 5.9457 18.1842 5.08229 17.1494 5.00586L17 5C17 5.55228 16.5523 6 16 6C15.4823 6 15.0562 5.60667 15.0049 5.10254L15 5H9Z"/>
            </svg>
            <h2 className="text-2xl font-semibold text-neutral-800">Calendario</h2>
            <p className="text-neutral-600 mt-2">Próximamente: Vista de calendario completa</p>
          </div>
        </div>
      </div>
    </div>
  );
}
