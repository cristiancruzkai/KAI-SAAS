'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  ChevronDown 
} from 'lucide-react';
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
  const [selectedAgent, setSelectedAgent] = useState('Super Sánchez');
  const [agentMenuOpen, setAgentMenuOpen] = useState(true);

  return (
    <aside className="w-64 bg-white/20 rounded-2xl shadow-[0px_0px_20px_0px_rgba(0,24,138,0.12)] flex flex-col h-screen overflow-hidden m-4 border border-white/40 backdrop-blur-xl">
      {/* Logo */}
      <div className="relative mb-6 shrink-0">
        <div className="w-48 h-24 bg-blue-900 rounded-3xl shadow-[inset_0px_0px_9px_1px_rgba(255,255,255,0.44)] flex items-center justify-center -mt-5 -ml-5">
          <KaiLogo className="h-9 w-auto" />
        </div>
      </div>

      {/* Navigation Icons - REMOVED (Moved to GlobalSidebar) */}
      
      <Separator className="my-4 bg-slate-200" />

      {/* Agent Selector */}
      <div className="px-4 flex-1 flex flex-col min-h-0">
        <Button
          variant="ghost"
          className="w-full justify-between text-slate-700 hover:bg-blue-50 mb-2 shrink-0"
          onClick={() => setAgentMenuOpen(!agentMenuOpen)}
        >
          <span className="font-semibold">{selectedAgent}</span>
          <ChevronDown className={cn(
            "h-4 w-4 transition-transform",
            agentMenuOpen && "rotate-180"
          )} />
        </Button>

        {agentMenuOpen && (
          <div className="space-y-1 mb-4 bg-slate-100/50 rounded-lg p-2 shrink-0">
            <button className="w-full text-left px-3 py-1.5 text-sm text-slate-600 hover:bg-white hover:shadow-sm rounded transition-all">
              Editar Agente
            </button>
            <button className="w-full text-left px-3 py-1.5 text-sm text-slate-600 hover:bg-white hover:shadow-sm rounded transition-all">
              Todos
            </button>
            <button className="w-full text-left px-3 py-1.5 text-sm text-slate-600 hover:bg-white hover:shadow-sm rounded transition-all">
              Enviar recordatorios
            </button>
          </div>
        )}

        <ScrollArea className="flex-1 -mx-2 px-2">
          <div className="space-y-1 pb-4">
            {agents.map((agent) => (
              <Button
                key={agent.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-slate-600 hover:bg-blue-50 hover:text-blue-700",
                  selectedAgent === agent.name && "bg-blue-700 text-white hover:bg-blue-800 hover:text-white shadow-[inset_0px_0px_9px_1px_rgba(255,255,255,0.44)] rounded-[10px]"
                )}
                onClick={() => setSelectedAgent(agent.name)}
              >
                <ChevronDown className="h-4 w-4 mr-2" />
                {agent.name}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* QR Section */}
      <div className="p-4 flex justify-center shrink-0">
        <SidebarQR />
      </div>
    </aside>
  );
}
