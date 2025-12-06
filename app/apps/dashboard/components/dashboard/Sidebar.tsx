'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const [expandedAgent, setExpandedAgent] = useState<string | null>('super-sanchez');
  
  const isActive = (path: string) => pathname === path;
  
  const agents = [
    { 
      name: 'Super Sanchez', 
      path: '/super-sanchez',
      subItems: [
        { name: 'Editar Agente', path: '/super-sanchez/edit' },
        { name: 'Tools', path: '/super-sanchez/tools' },
        { name: 'Enviar recordatorios', path: '/super-sanchez/reminders' }
      ]
    },
    { name: 'Pereyra', path: '/pereyra', subItems: [] },
    { name: 'Bimo', path: '/bimo', subItems: [] },
    { name: 'Ventanito', path: '/ventanito', subItems: [] },
    { name: 'Shuster', path: '/shuster', subItems: [] },
    { name: 'ADO', path: '/ado', subItems: [] },
    { name: 'Feria Tabasco', path: '/feria-tabasco', subItems: [] },
  ];
  
  const toggleAgent = (agentPath: string) => {
    setExpandedAgent(expandedAgent === agentPath ? null : agentPath);
  };
  
  return (
    <div className="w-52 h-[790px] left-[65px] top-[88px] absolute z-10">
      <div className="w-52 h-[790px] left-0 top-0 absolute bg-white/20 backdrop-blur-sm rounded-2xl shadow-[0px_4px_20px_0px_rgba(0,0,0,0.08)]" />
      
      {/* Header - Super Sanchez */}
      <div className="relative">
        <Link href="/super-sanchez">
          <div className={`w-48 h-9 left-[7px] top-[7px] absolute rounded-[10px] shadow-[inset_0px_0px_9px_1px_rgba(255,255,255,0.44)] cursor-pointer transition-colors ${
            isActive('/super-sanchez') || pathname.startsWith('/super-sanchez/') ? 'bg-kai-blue' : 'bg-kai-blue/80 hover:bg-kai-blue'
          }`} />
        </Link>
        <div className="flex items-center justify-between w-48 left-[7px] top-[7px] absolute px-[14px] h-9">
          <Link href="/super-sanchez">
            <span className={`text-base font-bold font-['Nunito_Sans'] cursor-pointer ${
              isActive('/super-sanchez') || pathname.startsWith('/super-sanchez/') ? 'text-white' : 'text-white/90'
            }`}>Super Sanchez</span>
          </Link>
          <button 
            onClick={() => toggleAgent('super-sanchez')}
            className="text-white hover:opacity-80 transition-opacity"
          >
            {expandedAgent === 'super-sanchez' ? 
              <ChevronUp className="w-4 h-4" /> : 
              <ChevronDown className="w-4 h-4" />
            }
          </button>
        </div>
      </div>
      
      {/* Expandable submenu for Super Sanchez */}
      {expandedAgent === 'super-sanchez' && (
        <div className="w-36 left-[37px] top-[45px] absolute space-y-2 opacity-90">
          <Link href="/super-sanchez/edit">
            <div className={`text-base font-light font-['Nunito_Sans'] cursor-pointer transition-colors ${
              pathname === '/super-sanchez/edit' ? 'text-kai-blue font-medium' : 'text-neutral-900/80 hover:text-kai-blue'
            }`}>
              Editar Agente
            </div>
          </Link>
          <Link href="/super-sanchez/tools">
            <div className={`text-base font-light font-['Nunito_Sans'] cursor-pointer transition-colors ${
              pathname === '/super-sanchez/tools' ? 'text-kai-blue font-medium' : 'text-neutral-900/80 hover:text-kai-blue'
            }`}>
              Tools
            </div>
          </Link>
          <Link href="/super-sanchez/reminders">
            <div className={`text-base font-light font-['Nunito_Sans'] cursor-pointer transition-colors ${
              pathname === '/super-sanchez/reminders' ? 'text-kai-blue font-medium' : 'text-neutral-900/80 hover:text-kai-blue'
            }`}>
              Enviar recordatorios
            </div>
          </Link>
        </div>
      )}
      
      <div className="w-[3px] h-20 left-[24px] top-[51px] absolute bg-blue-900/20 rounded-[10px]" />
      
      {/* Agent List */}
      <div className="absolute left-[21px] top-[144px] space-y-[42px]">
        <Link href="/pereyra">
          <div className={`text-base font-bold font-['Nunito_Sans'] cursor-pointer transition-colors ${
            isActive('/pereyra') ? 'text-kai-blue' : 'text-black/80 hover:text-kai-blue'
          }`}>Pereyra</div>
        </Link>
        
        <Link href="/bimo">
          <div className={`text-base font-bold font-['Nunito_Sans'] cursor-pointer transition-colors ${
            isActive('/bimo') ? 'text-kai-blue' : 'text-black/80 hover:text-kai-blue'
          }`}>Bimo</div>
        </Link>
        
        <Link href="/ventanito">
          <div className={`text-base font-bold font-['Nunito_Sans'] cursor-pointer transition-colors ${
            isActive('/ventanito') ? 'text-kai-blue' : 'text-black/80 hover:text-kai-blue'
          }`}>Ventanito</div>
        </Link>
        
        <Link href="/shuster">
          <div className={`text-base font-bold font-['Nunito_Sans'] cursor-pointer transition-colors ${
            isActive('/shuster') ? 'text-kai-blue' : 'text-black/80 hover:text-kai-blue'
          }`}>Shuster</div>
        </Link>
        
        <Link href="/ado">
          <div className={`text-base font-bold font-['Nunito_Sans'] cursor-pointer transition-colors ${
            isActive('/ado') ? 'text-kai-blue' : 'text-black/80 hover:text-kai-blue'
          }`}>ADO</div>
        </Link>
        
        <Link href="/feria-tabasco">
          <div className={`text-base font-bold font-['Nunito_Sans'] cursor-pointer transition-colors ${
            isActive('/feria-tabasco') ? 'text-kai-blue' : 'text-black/80 hover:text-kai-blue'
          }`}>Feria Tabasco</div>
        </Link>
      </div>
      
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
