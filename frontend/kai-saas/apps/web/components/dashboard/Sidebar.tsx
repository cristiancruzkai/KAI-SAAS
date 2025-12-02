'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Bot, 
  Briefcase, 
  Users, 
  MessageSquare, 
  FolderOpen,
  ChevronDown 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { KaiLogo } from '@/components/ui/KaiLogo';

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
    <aside className="w-64 bg-gradient-to-b from-blue-600 to-blue-700 text-white flex flex-col h-screen">
      {/* Logo */}
      <div className="p-6">
        <div className="px-2 py-1">
          <KaiLogo className="h-9 w-auto" />
        </div>
      </div>

      {/* Navigation Icons */}
      <div className="px-4 space-y-2">
        <Button variant="ghost" size="icon" className="w-full justify-start text-white hover:bg-blue-500">
          <Bot className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="w-full justify-start text-white hover:bg-blue-500">
          <Briefcase className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="w-full justify-start text-white hover:bg-blue-500">
          <Users className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="w-full justify-start text-white hover:bg-blue-500">
          <MessageSquare className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="w-full justify-start text-white hover:bg-blue-500">
          <FolderOpen className="h-5 w-5" />
        </Button>
      </div>

      <Separator className="my-4 bg-blue-500" />

      {/* Agent Selector */}
      <div className="px-4 flex-1">
        <Button
          variant="ghost"
          className="w-full justify-between text-white hover:bg-blue-500 mb-2"
          onClick={() => setAgentMenuOpen(!agentMenuOpen)}
        >
          <span className="font-semibold">{selectedAgent}</span>
          <ChevronDown className={cn(
            "h-4 w-4 transition-transform",
            agentMenuOpen && "rotate-180"
          )} />
        </Button>

        {agentMenuOpen && (
          <div className="space-y-1 mb-4 bg-blue-700 rounded-lg p-2">
            <button className="w-full text-left px-3 py-1.5 text-sm hover:bg-blue-800 rounded">
              Editar Agente
            </button>
            <button className="w-full text-left px-3 py-1.5 text-sm hover:bg-blue-800 rounded">
              Todos
            </button>
            <button className="w-full text-left px-3 py-1.5 text-sm hover:bg-blue-800 rounded">
              Enviar recordatorios
            </button>
          </div>
        )}

        <ScrollArea className="h-64">
          <div className="space-y-1">
            {agents.map((agent) => (
              <Button
                key={agent.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-white hover:bg-blue-500",
                  selectedAgent === agent.name && "bg-blue-500"
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
      <div className="p-4 bg-blue-800/50 m-4 rounded-lg">
        <div className="bg-white p-3 rounded-lg mb-2">
          <div className="w-full aspect-square bg-gray-200 rounded" />
        </div>
        <p className="text-xs text-center">
          Escanea y genera tu Agente desde WhatsApp
        </p>
      </div>
    </aside>
  );
}
