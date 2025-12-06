'use client';

export function SidebarQR() {
  return (
    <div className="w-48 h-60 relative bg-gradient-to-b from-amber-200/30 to-white/30 rounded-[10px] shadow-[0px_0px_20px_0px_rgba(1,0,245,0.10)] shadow-[inset_0px_0px_26px_21px_rgba(255,255,255,0.50)] p-4 flex flex-col items-center justify-center gap-3">
      <div className="bg-white p-2 rounded-lg shadow-sm">
        <div className="w-24 h-24 bg-gray-900 rounded" />
      </div>
      <p className="text-xs text-center font-medium text-slate-700">
        Escanea y genera tu Agente desde WhatsApp
      </p>
    </div>
  );
}
