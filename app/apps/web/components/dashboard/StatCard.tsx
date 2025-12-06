'use client';

import Image from 'next/image';

interface StatCardProps {
  title: string;
  imageSrc: string;
}

export function StatCard({ title, imageSrc }: StatCardProps) {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden transition-shadow">
      <Image 
        src={imageSrc} 
        alt={title}
        width={700}
        height={300}
        className="w-full h-auto object-cover"
      />
      {/* Gradient overlay for better text visibility */}
      
      <div className="absolute inset-0 flex items-center justify-center pl-8 z-10">
        <p className="text-subtitle font-bold text-white leading-relaxed max-w-[80%]">{title}</p>
      </div>
    </div>
  );
}
