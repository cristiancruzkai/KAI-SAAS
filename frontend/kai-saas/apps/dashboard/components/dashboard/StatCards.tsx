interface StatCardProps {
  title: string;
  imageSrc: string;
  left: string;
}

function StatCard({ title, imageSrc, left }: StatCardProps) {
  return (
    <>
  
      <img 
        src={imageSrc} 
        className={`w-auto h-28 ${left} top-[295px] absolute rounded-2xl`} 
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
      
      <StatCard title="Base de Conocimiento" imageSrc="/conocimiento.png" left="left-[286px]" />
      <StatCard title="Galería de Tools" imageSrc="/tools.png" left="left-[654px]" />
      <StatCard title="Bandeja de Entrada" imageSrc="/bandeja.png" left="left-[1022px]" />
    </>
  );
}
