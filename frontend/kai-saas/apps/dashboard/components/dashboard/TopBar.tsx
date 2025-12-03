import { KaiLogo } from '../ui/KaiLogo';

export default function TopBar() {
  return (
    <div className="w-[1310px] h-24 left-[65px] top-[-22px] absolute">
      <div className="w-52 h-24 left-0 top-0 absolute bg-[#00188A] rounded-3xl shadow-[inset_0px_0px_9px_1px_rgba(255,255,255,0.44)]" />
      <div className="w-2 h-1 left-[344px] top-[84px] absolute origin-top-left -rotate-90 opacity-50 outline outline-2 outline-offset-[-1px] outline-black" />
      <div className="left-[248px] top-[70px] absolute justify-start text-slate-900 text-sm font-bold font-['Nunito_Sans']">Tus Agentes</div>
      <div className="left-[362px] top-[70px] absolute justify-start text-slate-900 text-sm font-bold font-['Nunito_Sans']">Dashboard Bimo</div>
      
      {/* Logo */}
      <div className="absolute left-[48px] top-[52px]">
        <KaiLogo className="h-9 w-auto" />
      </div>
      
      {/* User Section */}
      <div className="w-56 h-12 left-[939px] top-[54px] absolute bg-white/10 rounded-[10px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.10)] overflow-hidden">
        <div className="w-32 left-[65px] top-[16px] absolute justify-start text-black/80 text-sm font-bold font-['Nunito_Sans']">Miranda Villareal</div>
      </div>
      
      {/* Bell Icon */}
      <div className="w-12 h-12 left-[884px] top-[54px] absolute bg-white/10 rounded-[10px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.10)] overflow-hidden">
        <div className="w-6 h-6 left-[11px] top-[12px] absolute rounded-2xl">
          <div className="w-6 h-6 left-0 top-0 absolute" />
        </div>
      </div>
      
      {/* Create Agent Button */}
      <div className="w-32 h-12 left-[1178px] top-[54px] absolute bg-kai-blue rounded-2xl shadow-[0px_10px_30px_0px_rgba(0,0,0,0.05)]" />
      <div className="w-24 left-[1201px] top-[68px] absolute justify-start text-white text-sm font-bold font-['Nunito_Sans']">Crear Agente</div>
    </div>
  );
}
