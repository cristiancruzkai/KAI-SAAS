export default function MetricsSection() {
  return (
    <>
      <div className="w-32 h-7 left-[313px] top-[418px] absolute justify-start text-neutral-900 text-3xl font-extrabold font-['Nunito_Sans']">
        Métricas
      </div>
      
      {/* Line Chart Section */}
      <div className="w-[1089px] h-64 left-[286px] top-[467px] absolute bg-white rounded-2xl shadow-[0px_10px_30px_0px_rgba(62,73,84,0.08)]" />
      <div className="w-[1033px] h-32 left-[313px] top-[564px] absolute">
        <div className="w-[1015.57px] h-0 left-[8.72px] top-[112.64px] absolute outline outline-1 outline-offset-[-0.50px] outline-neutral-200/50" />
        <div className="w-[1015.57px] h-0 left-[8.72px] top-[84.48px] absolute outline outline-1 outline-offset-[-0.50px] outline-neutral-200/50" />
        <div className="w-[1015.57px] h-0 left-[8.72px] top-[56.32px] absolute outline outline-1 outline-offset-[-0.50px] outline-neutral-200/50" />
        <div className="w-[1015.57px] h-0 left-[8.72px] top-[28.16px] absolute outline outline-1 outline-offset-[-0.50px] outline-neutral-200/50" />
        <div className="w-[1015.57px] h-0 left-[8.72px] top-0 absolute outline outline-1 outline-offset-[-0.50px] outline-neutral-200/50" />
        
        {/* Date Labels */}
        <div className="w-9 h-2 left-[-2.97px] top-[118.03px] absolute text-center justify-start text-neutral-500 text-[9px] font-normal font-['Geist']">Apr 3</div>
        <div className="w-8 h-2 left-[70.01px] top-[118.03px] absolute text-center justify-start text-neutral-500 text-[9px] font-normal font-['Geist']">Apr 7</div>
        <div className="w-10 h-2 left-[157.01px] top-[118.03px] absolute text-center justify-start text-neutral-500 text-[9px] font-normal font-['Geist']">Apr 12</div>
        <div className="w-10 h-2 left-[248.10px] top-[118.03px] absolute text-center justify-start text-neutral-500 text-[9px] font-normal font-['Geist']">Apr 17</div>
        <div className="w-11 h-2 left-[336.27px] top-[118.03px] absolute text-center justify-start text-neutral-500 text-[9px] font-normal font-['Geist']">Apr 22</div>
        <div className="w-10 h-2 left-[427.93px] top-[118.03px] absolute text-center justify-start text-neutral-500 text-[9px] font-normal font-['Geist']">Apr 27</div>
        <div className="w-10 h-2 left-[519.58px] top-[118.03px] absolute text-center justify-start text-neutral-500 text-[9px] font-normal font-['Geist']">May 2</div>
        <div className="w-10 h-2 left-[610.67px] top-[118.03px] absolute text-center justify-start text-neutral-500 text-[9px] font-normal font-['Geist']">May 7</div>
        <div className="w-11 h-2 left-[697.67px] top-[118.03px] absolute text-center justify-start text-neutral-500 text-[9px] font-normal font-['Geist']">May 12</div>
        <div className="w-11 h-2 left-[788.75px] top-[118.03px] absolute text-center justify-start text-neutral-500 text-[9px] font-normal font-['Geist']">May 17</div>
        <div className="w-12 h-2 left-[876.92px] top-[118.03px] absolute text-center justify-start text-neutral-500 text-[9px] font-normal font-['Geist']">May 22</div>
        <div className="w-12 h-2 left-[968.59px] top-[118.03px] absolute text-center justify-start text-neutral-500 text-[9px] font-normal font-['Geist']">May 27</div>
        <div className="w-[1006.47px] h-20 left-[8.72px] top-[18.96px] absolute outline outline-2 outline-offset-[-1px] outline-teal-500" />
      </div>
      
      <div className="w-72 h-4 left-[313px] top-[491px] absolute justify-center text-neutral-950 text-lg font-semibold font-['Nunito_Sans'] leading-4">
        Line Chart - Interactive
      </div>
      <div className="w-72 h-5 left-[313px] top-[510px] absolute justify-center text-neutral-500 text-sm font-normal font-['Nunito_Sans'] leading-5">
        Showing total visitors for the last 3 months
      </div>
    </>
  );
}
