export default function AlertBanner() {
  return (
    <div className="w-[1089px] h-48 left-[286px] top-[88px] absolute">
      <img className="w-[1089px] h-48 left-0 top-0 absolute rounded-2xl" src="/kaiBanner.png" />
      <div className="w-72 h-12 left-[27px] top-[60px] absolute justify-start text-white text-2xl font-semibold font-['Nunito_Sans']">
        Descubre el poder del nuevo panel web de kAI
      </div>
      <div className="w-24 h-3.5 left-[27px] top-[32px] absolute justify-start text-white text-sm font-normal font-['Nunito_Sans'] uppercase">
        Novedades
      </div>
      <div data-state="filled" data-type="text+icon" className="w-20 h-8 px-3 py-2 left-[27px] top-[126.57px] absolute bg-kai-yellow rounded-[40px] inline-flex justify-start items-center gap-3">
        <div className="text-right justify-start text-black text-sm font-medium font-['Nunito_Sans']">Ver Ahora</div>
      </div>
      
      {/* Carousel Dots */}
      <div className="w-3 h-3 left-[1083.02px] top-[95.42px] absolute bg-zinc-300/60 rounded-full" />
      <div className="w-3 h-3 left-[1083.02px] top-[69px] absolute bg-zinc-300 rounded-full" />
      <div className="w-3 h-3 left-[1083.02px] top-[121.84px] absolute bg-zinc-300/60 rounded-full" />
    </div>
  );
}
