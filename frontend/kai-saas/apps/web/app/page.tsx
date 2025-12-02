'use client';

import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { AlertBanner } from '@/components/dashboard/AlertBanner';
import { StatCard } from '@/components/dashboard/StatCard';
import { MetricsChart } from '@/components/dashboard/MetricsChart';
import { TransactionCard } from '@/components/dashboard/TransactionCard';

export default function Home() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Alert Banner */}
        <AlertBanner
          title="Nueva Integración Disponible"
          description="Ahora puedes conectar tus agentes de KAI con WhatsApp Business API directamente desde el panel de control."
          actionLabel="Configurar WhatsApp"
          onAction={() => console.log('Action clicked')}
        />

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard label="Mensajes Procesados" value="128,430" />
          <StatCard label="Agentes Activos" value="12" />
          <StatCard label="Alertas del Sistema" value="3" variant="warning" />
        </div>

        {/* Métricas Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Rendimiento</h2>
          <MetricsChart />
        </div>

        {/* Transaction Overview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TransactionCard color="blue" />
          <TransactionCard color="yellow" />
          <TransactionCard color="purple" />
        </div>
      </div>
    </DashboardLayout>
  );
}
