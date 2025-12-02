'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { KaiLogo } from '@/components/ui/KaiLogo';
import { SidebarQR } from './SidebarQR';

interface Agent {
  id: string;
  name: string;
}

const agents: Agent[] = [
  { id: '1', name: 'Pereyra' },
  { id: '2', name: 'Bimo' },
  { id: '3', name: 'Ventanito' },
  { id: '4', name: 'Shuster' },
  { id: '5', name: 'ADO' },
  { id: '6', name: 'Feria Tabasco' },
];

export function Sidebar() {
  const [selectedAgent, setSelectedAgent] = useState('Super Sanchez');
  const [agentMenuOpen, setAgentMenuOpen] = useState(true);

  return (
    <aside className="w-64 bg-white/80 rounded-2xl shadow-[0px_0px_20px_0px_rgba(0,24,138,0.12)] flex flex-col h-[calc(100vh-2rem)] overflow-hidden m-4 border border-white/40 backdrop-blur-xl">
      {/* Logo */}
      <div className="relative mb-2 shrink-0">
        <div className="w-48 h-24 bg-blue-900 rounded-3xl shadow-[inset_0px_0px_9px_1px_rgba(255,255,255,0.44)] flex items-center justify-center -mt-5 -ml-5">
          <KaiLogo className="h-9 w-auto" />
        </div>
      </div>

      {/* Agent Selector */}
      <div className="px-5 flex-1 flex flex-col min-h-0 overflow-hidden">
        <button
          className="w-full bg-blue-700 text-white rounded-xl p-3 flex items-center justify-between mb-1 shadow-lg hover:bg-blue-800 transition-colors shrink-0"
          onClick={() => setAgentMenuOpen(!agentMenuOpen)}
        >
          <span className="text-subtitle font-semibold">Super Sanchez</span>
          <ChevronDown className={cn(
            "h-4 w-4 transition-transform",
            agentMenuOpen && "rotate-180"
          )} />
        </button>

        {agentMenuOpen && (
          <div className="space-y-0.5 mb-3 pl-4 shrink-0">
            <button className="w-full text-left px-3 py-1.5 text-textnormal text-slate-600 hover:text-blue-700 transition-all">
              Editar Agente
            </button>
            <button className="w-full text-left px-3 py-1.5 text-textnormal text-slate-600 hover:text-blue-700 transition-all">
              Tools
            </button>
            <button className="w-full text-left px-3 py-1.5 text-textnormal text-slate-600 hover:text-blue-700 transition-all">
              Enviar recordatorios
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-1 pb-4">
          {agents.map((agent) => (
            <button
              key={agent.id}
              className={cn(
                "w-full text-left p-3 rounded-xl flex items-center justify-between text-slate-600 hover:bg-slate-100 transition-colors",
                selectedAgent === agent.name && "bg-blue-700 text-white hover:bg-blue-800"
              )}
              onClick={() => setSelectedAgent(agent.name)}
            >
              <span className="text-textnormal font-medium">{agent.name}</span>
              <ChevronDown className="h-4 w-4" />
            </button>
          ))}
        </div>
      </div>

      {/* QR Section */}
      <div className="p-5 flex justify-center shrink-0">
        <SidebarQR />
      </div>
    </aside>
  );
}
