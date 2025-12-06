'use client';

import AlertBanner from '../../../components/dashboard/AlertBanner';
import StatCards from '../../../components/dashboard/StatCards';
import MetricsSection from '../../../components/dashboard/MetricsSection';
import TransactionCard from '../../../components/dashboard/TransactionCard';

export default function FeriaTabascoPage() {
  return (
    <>
      {/* Alert Banner */}
      <AlertBanner />
      
      {/* Stat Cards */}
      <StatCards />
      
      {/* Metrics Section */}
      <MetricsSection />
      
      {/* Transaction Cards */}
      <TransactionCard variant="first" />
      <TransactionCard variant="second" />
      <TransactionCard variant="third" />
    </>
  );
}
