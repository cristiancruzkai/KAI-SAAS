'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

// Todos los agentes tienen los mismos subItems
const getSubItems = (basePath: string) => [
  { name: 'Editar Agente', path: `${basePath}/edit` },
  { name: 'Tools', path: `${basePath}/tools` },
  { name: 'Enviar recordatorios', path: `${basePath}/reminders` }
];

const agents = [
  { name: 'Super Sanchez', path: '/super-sanchez' },
  { name: 'Pereyra', path: '/pereyra' },
  { name: 'Bimo', path: '/bimo' },
  { name: 'Ventanito', path: '/ventanito' },
  { name: 'Shuster', path: '/shuster' },
  { name: 'ADO', path: '/ado' },
  { name: 'Feria Tabasco', path: '/feria-tabasco' },
];

export function AppSidebar() {
  const pathname = usePathname();
  
  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');
  
  // Encontrar el agente activo actual
  const activeAgent = agents.find(agent => isActive(agent.path));
  
  return (
    <Sidebar 
      collapsible="none"
      className="fixed left-[65px] top-[88px] w-52 h-[calc(100vh-104px)] border-0 bg-transparent z-10"
    >
      <SidebarContent className="bg-white/20 backdrop-blur-sm rounded-2xl shadow-[0px_4px_20px_0px_rgba(0,0,0,0.08)] p-2 h-full relative">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu>
              {agents.map((agent, index) => {
                const agentIsActive = isActive(agent.path);
                const subItems = getSubItems(agent.path);
                
                return (
                  <Collapsible 
                    key={agent.path} 
                    defaultOpen={agentIsActive}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton 
                          className={`w-full font-bold font-['Nunito_Sans'] text-base h-9 ${
                            agentIsActive
                              ? 'rounded-[10px] shadow-[inset_0px_0px_9px_1px_rgba(255,255,255,0.44)] bg-kai-blue text-white hover:bg-kai-blue hover:text-white'
                              : 'text-black/80 hover:text-kai-blue hover:bg-transparent'
                          }`}
                        >
                          <Link 
                            href={agent.path} 
                            className="flex-1 text-left" 
                            onClick={(e) => e.stopPropagation()}
                          >
                            {agent.name}
                          </Link>
                          {agentIsActive ? (
                            <ChevronUp className="h-4 w-4 transition-transform duration-200 group-data-[state=closed]/collapsible:rotate-180" />
                          ) : (
                            <ChevronDown className="h-4 w-4 opacity-60" />
                          )}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      
                      {/* Solo mostrar el menú colapsable si este agente está activo */}
                      {agentIsActive && (
                        <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                          <SidebarMenuSub className="border-l-[3px] border-blue-900/20 ml-2 mt-2 pl-3 mr-0 pr-0">
                            {subItems.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.path}>
                                <SidebarMenuSubButton 
                                  asChild
                                  isActive={pathname === subItem.path}
                                  className={`font-['Nunito_Sans'] font-light text-base py-1 ${
                                    pathname === subItem.path 
                                      ? 'text-kai-blue font-medium' 
                                      : 'text-neutral-900/80 hover:text-kai-blue'
                                  }`}
                                >
                                  <Link href={subItem.path}>
                                    <span>{subItem.name}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      )}
                    </SidebarMenuItem>
                  </Collapsible>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {/* QR Section - Posición absoluta en la parte inferior */}
        <div className="absolute bottom-2 left-2 right-2">
          <div className="bg-gradient-to-b from-amber-200/30 to-white/30 rounded-[10px] shadow-[0px_0px_20px_0px_rgba(1,0,245,0.10)] p-4">
            <div className="flex flex-col items-center">
              <img className="w-28 h-28 rounded-2xl mb-3" src="/qr.png" alt="QR Code" />
              <p className="text-center text-neutral-800 text-base font-normal font-['Nunito_Sans'] leading-4">
                Escanea y genera tu Agente desde WhatsApp
              </p>
            </div>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}