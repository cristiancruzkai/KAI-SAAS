interface StatCardProps {
  title: string;
  imageSrc: string;
  left: string;
}

function StatCard({ title, imageSrc, left }: StatCardProps) {
  return (
    <>
      <img 
        className={`w-80 h-28 ${left} top-[295px] absolute rounded-2xl shadow-[0px_4px_20px_0px_rgba(0,0,0,0.08)]`} 
        src={imageSrc} 
      />
      <div className={`${left === "left-[286px]" ? "left-[313px]" : left === "left-[654px]" ? "left-[678px]" : "left-[1045px]"} top-[328px] absolute justify-center text-white text-lg font-semibold font-['Nunito_Sans'] leading-5`}>
        {title.split(' ').map((word, i) => (
          <span key={i}>
            {word}
            {i === 1 && <br />}
            {i !== 1 && i < title.split(' ').length - 1 && ' '}
          </span>
        ))}
      </div>
    </>
  );
}

export default function StatCards() {
  return (
    <>
      <div className="w-72 h-12 left-[313px] top-[329px] absolute justify-start text-color-gray-10 text-2xl font-semibold font-['Inter']">
        Descubre el poder del nuevo panel web de kAI
      </div>
      <StatCard title="Base de Conocimiento" imageSrc="/conocimiento.png" left="left-[286px]" />
      <StatCard title="Galería de Tools" imageSrc="/tools.png" left="left-[654px]" />
      <StatCard title="Bandeja de Entrada" imageSrc="/bandeja.png" left="left-[1022px]" />
    </>
  );
}
