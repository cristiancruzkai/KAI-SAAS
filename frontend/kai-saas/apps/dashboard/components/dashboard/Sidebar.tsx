'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  
  const isActive = (path: string) => pathname === path;
  
  const agents = [
    { name: 'Super Sanchez', path: '/super-sanchez', expanded: true },
    { name: 'Pereyra', path: '/pereyra' },
    { name: 'Bimo', path: '/bimo' },
    { name: 'Ventanito', path: '/ventanito' },
    { name: 'Shuster', path: '/shuster' },
    { name: 'ADO', path: '/ado' },
    { name: 'Feria Tabasco', path: '/feria-tabasco' },
  ];
  
  return (
    <div className="w-52 h-[790px] left-[65px] top-[88px] absolute z-10">
      <div className="w-52 h-[790px] left-0 top-0 absolute bg-white/20 backdrop-blur-sm rounded-2xl shadow-[0px_4px_20px_0px_rgba(0,0,0,0.08)]" />
      
      {/* Header - Super Sanchez */}
      <Link href="/super-sanchez">
        <div className={`w-48 h-9 left-[7px] top-[7px] absolute rounded-[10px] shadow-[inset_0px_0px_9px_1px_rgba(255,255,255,0.44)] cursor-pointer transition-colors ${
          isActive('/super-sanchez') ? 'bg-kai-blue' : 'bg-kai-blue/80 hover:bg-kai-blue'
        }`} />
      </Link>
      <Link href="/super-sanchez">
        <div className={`left-[21px] top-[15px] absolute justify-start text-base font-bold font-['Nunito_Sans'] cursor-pointer ${
          isActive('/super-sanchez') ? 'text-white' : 'text-white/90'
        }`}>Super Sanchez</div>
      </Link>
      <div className="w-36 h-16 left-[37px] top-[45px] absolute opacity-90 justify-start text-neutral-900/80 text-base font-light font-['Nunito_Sans'] leading-8">
        Editar Agente<br/>Tools<br/>Enviar recordatorios
      </div>
      {/* Super Sanchez Arrow - Up */}
      <div className="absolute left-[186px] top-[23px]">
        <svg width="9" height="6" viewBox="0 0 9 6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 5L4.5 1L8 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div className="w-[3px] h-20 left-[24px] top-[51px] absolute bg-blue-900/20 rounded-[10px]" />
      
      {/* Agent List */}
      <Link href="/pereyra">
        <div className={`left-[21px] top-[144px] absolute justify-start text-base font-bold font-['Nunito_Sans'] cursor-pointer transition-colors ${
          isActive('/pereyra') ? 'text-kai-blue' : 'text-black/80 hover:text-kai-blue'
        }`}>Pereyra</div>
      </Link>
      
      <Link href="/bimo">
        <div className={`w-28 left-[21px] top-[186px] absolute justify-start text-base font-bold font-['Nunito_Sans'] cursor-pointer transition-colors ${
          isActive('/bimo') ? 'text-kai-blue' : 'text-black/80 hover:text-kai-blue'
        }`}>Bimo</div>
      </Link>
      
      <Link href="/ventanito">
        <div className={`w-28 left-[21px] top-[228px] absolute justify-start text-base font-bold font-['Nunito_Sans'] cursor-pointer transition-colors ${
          isActive('/ventanito') ? 'text-kai-blue' : 'text-black/80 hover:text-kai-blue'
        }`}>Ventanito</div>
      </Link>
      
      <Link href="/shuster">
        <div className={`w-14 left-[21px] top-[270px] absolute justify-start text-base font-bold font-['Nunito_Sans'] cursor-pointer transition-colors ${
          isActive('/shuster') ? 'text-kai-blue' : 'text-black/80 hover:text-kai-blue'
        }`}>Shuster</div>
      </Link>
      
      <Link href="/ado">
        <div className={`w-9 left-[21px] top-[312px] absolute justify-start text-base font-bold font-['Nunito_Sans'] cursor-pointer transition-colors ${
          isActive('/ado') ? 'text-kai-blue' : 'text-black/80 hover:text-kai-blue'
        }`}>ADO</div>
      </Link>
      
      <Link href="/feria-tabasco">
        <div className={`w-28 left-[21px] top-[354px] absolute justify-start text-base font-bold font-['Nunito_Sans'] cursor-pointer transition-colors ${
          isActive('/feria-tabasco') ? 'text-kai-blue' : 'text-black/80 hover:text-kai-blue'
        }`}>Feria Tabasco</div>
      </Link>
      
      {/* Agent Arrows - Down (rotated 180deg) */}
      <div className="absolute left-[178px] top-[148px] rotate-180">
        <svg width="9" height="6" viewBox="0 0 9 6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 5L4.5 1L8 5" stroke="#161717" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div className="absolute left-[178px] top-[190px] rotate-180">
        <svg width="9" height="6" viewBox="0 0 9 6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 5L4.5 1L8 5" stroke="#161717" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div className="absolute left-[178px] top-[232px] rotate-180">
        <svg width="9" height="6" viewBox="0 0 9 6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 5L4.5 1L8 5" stroke="#161717" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div className="absolute left-[178px] top-[274px] rotate-180">
        <svg width="9" height="6" viewBox="0 0 9 6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 5L4.5 1L8 5" stroke="#161717" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div className="absolute left-[178px] top-[316px] rotate-180">
        <svg width="9" height="6" viewBox="0 0 9 6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 5L4.5 1L8 5" stroke="#161717" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div className="absolute left-[178px] top-[358px] rotate-180">
        <svg width="9" height="6" viewBox="0 0 9 6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 5L4.5 1L8 5" stroke="#161717" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      
      {/* QR Section */}
      <div className="w-48 h-60 left-[10px] top-[535px] absolute bg-gradient-to-b from-amber-200/30 to-white/30 rounded-[10px] shadow-[0px_0px_20px_0px_rgba(1,0,245,0.10)] shadow-[inset_0px_0px_26px_21px_rgba(255,255,255,0.50)]" />
      <img className="w-28 h-28 left-[43px] top-[564px] absolute rounded-2xl" src="/qr.png" />
      <div className="w-32 h-12 left-[41px] top-[708px] absolute text-center justify-start text-neutral-800 text-base font-normal font-['Nunito_Sans'] leading-4">
        Escanea y genera tu Agente desde WhatsApp
      </div>
      <div className="w-1.5 h-1 left-[178px] top-[549px] absolute">
      <svg width="9" height="6" viewBox="0 0 9 6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 5L4.5 1L8 5" stroke="#161717" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        </div>
    </div>
  );
}
