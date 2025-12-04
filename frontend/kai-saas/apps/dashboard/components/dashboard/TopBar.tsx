import { KaiLogo } from '../ui/KaiLogo';

export default function TopBar() {
  return (
    <div className="w-[1310px] h-24 left-[65px] top-[-22px] absolute z-10">
      <div className="w-52 h-24 left-0 top-0 absolute bg-[#00188A] rounded-3xl shadow-[inset_0px_0px_9px_1px_rgba(255,255,255,0.44)]" />
      <div className="absolute left-[344px] top-[77px] rotate-90">
        <svg width="9" height="6" viewBox="0 0 9 6" fill="none">
          <path d="M1 5L4.5 1L8 5" stroke="black" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
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
      <div className="w-12 h-12 left-[884px] top-[54px] absolute bg-white/10 rounded-[10px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.10)] flex items-center justify-center">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.5566 17.1035C12.3273 17.1035 12.8084 17.9378 12.4219 18.6045C11.921 19.4681 10.9983 20 10 20C9.00166 20 8.07902 19.4681 7.57812 18.6045C7.2109 17.9712 7.62686 17.1863 8.33008 17.1094L8.44336 17.1035H11.5566ZM10 0C13.9511 1.86063e-05 17.1688 3.13986 17.2959 7.06055L17.2998 7.30078V11.8018C17.2998 12.6915 17.9833 13.4217 18.8535 13.4961L19.1328 13.5098C20.244 13.629 20.2873 15.2404 19.2617 15.4746L19.1328 15.4951L19 15.502H1L0.867188 15.4951C-0.288579 15.3711 -0.288579 13.6338 0.867188 13.5098L1.14648 13.4961C1.96832 13.4258 2.62312 12.7704 2.69336 11.9482L2.7002 11.8018V7.30078C2.70038 3.26868 5.96839 0 10 0ZM10 2C7.14611 2 4.81867 4.25657 4.7041 7.08301L4.7002 7.30078V11.8018C4.7002 12.3103 4.59771 12.7952 4.41211 13.2363L4.3125 13.4531L4.28516 13.502H15.7139L15.6875 13.4531C15.5037 13.085 15.3792 12.6813 15.3271 12.2559L15.3047 11.998L15.2998 11.8018V7.30078C15.2996 4.37318 12.9269 2.00002 10 2Z" fill="#0A1629"/>
        </svg>
      </div>
      
      {/* Create Agent Button */}
      <div className="w-32 h-12 left-[1178px] top-[54px] absolute bg-kai-blue rounded-2xl shadow-[0px_10px_30px_0px_rgba(0,0,0,0.05)]" />
      <div className="w-24 left-[1201px] top-[68px] absolute justify-start text-white text-sm font-bold font-['Nunito_Sans']">Crear Agente</div>
    </div>
  );
}
