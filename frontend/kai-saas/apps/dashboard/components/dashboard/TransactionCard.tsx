interface TransactionCardProps {
  variant: 'first' | 'second' | 'third';
}

export default function TransactionCard({ variant }: TransactionCardProps) {
  if (variant === 'first') {
    return (
      <>
        <div className="w-96 h-96 left-[286px] top-[751px] absolute mix-blend-soft-light bg-white rounded-2xl shadow-[0px_10px_30px_0px_rgba(62,73,84,0.04)]" />
        <div className="w-10 h-3 left-[390.99px] top-[1140.14px] absolute bg-sky-100 rounded-2xl" />
        <div className="w-5 h-4 left-[412.61px] top-[1137.50px] absolute bg-blue-600 rounded-full shadow-[0px_4px_9px_0px_rgba(0,0,0,0.25)]" />
        <div className="w-16 h-5 left-[318px] top-[1137.50px] absolute justify-start text-neutral-900 text-base font-semibold font-['Nunito_Sans']">Number</div>
        <div className="w-10 h-3 left-[559.30px] top-[1140.14px] absolute bg-zinc-300 rounded-2xl" />
        <div className="w-5 h-4 left-[559.30px] top-[1137.50px] absolute bg-neutral-400 rounded-full shadow-[0px_4px_9px_0px_rgba(0,0,0,0.25)]" />
        <div className="w-16 h-5 left-[479.01px] top-[1137.50px] absolute justify-start text-neutral-900 text-base font-semibold font-['Nunito_Sans']">Analytics</div>
        <div className="w-64 h-px left-[379.93px] top-[1098.76px] absolute bg-violet-100 rounded-2xl" />
        <div className="w-64 h-px left-[379.93px] top-[1053.86px] absolute bg-violet-100 rounded-2xl" />
        <div className="w-64 h-px left-[379.93px] top-[1008.96px] absolute bg-violet-100 rounded-2xl" />
        <div className="w-64 h-px left-[379.93px] top-[964.06px] absolute bg-violet-100 rounded-2xl" />
        <div className="w-64 h-px left-[379.93px] top-[919.16px] absolute bg-violet-100 rounded-2xl" />
        <div className="w-64 h-px left-[379.93px] top-[874.26px] absolute bg-violet-100 rounded-2xl" />
        <div className="w-4 h-36 left-[379.66px] top-[957.27px] absolute bg-green-500 rounded-2xl" />
        <div className="w-4 h-40 left-[398.57px] top-[930.99px] absolute bg-teal-500 rounded-2xl" />
        <div className="w-4 h-56 left-[441.37px] top-[873.38px] absolute bg-green-500 rounded-2xl" />
        <div className="w-4 h-32 left-[460.08px] top-[970.30px] absolute bg-teal-500 rounded-2xl" />
        <div className="w-4 h-20 left-[503.07px] top-[1020.57px] absolute bg-green-500 rounded-2xl" />
        <div className="w-4 h-12 left-[521.79px] top-[1051.85px] absolute bg-teal-500 rounded-2xl" />
        <div className="w-4 h-44 left-[564.77px] top-[917.85px] absolute bg-green-500 rounded-2xl" />
        <div className="w-4 h-44 left-[564.76px] top-[917.85px] absolute bg-sky-500 rounded-2xl" />
        <div className="w-32 h-60 left-[524.43px] top-[887.46px] absolute bg-white/25 rounded-2xl" />
        <div className="w-4 h-20 left-[583.68px] top-[1020.94px] absolute bg-teal-500 rounded-2xl" />
        <div className="w-0.5 h-48 left-[580.17px] top-[917.40px] absolute origin-top-left rotate-90 rounded-2xl border border-blue-800/30" />
        <div className="w-36 h-16 left-[612.80px] top-[912.12px] absolute origin-top-left rotate-180 bg-white rounded-2xl shadow-[0px_15px_21px_0px_rgba(0,0,0,0.06)]" />
        <div className="w-20 h-5 left-[500.61px] top-[847.85px] absolute text-center justify-start text-neutral-900 text-xl font-bold font-['Inter']">$85,66</div>
        <div className="w-20 h-3.5 left-[499.66px] top-[880.42px] absolute text-center justify-start text-zinc-400 text-sm font-normal font-['Inter']">Expense</div>
        <div className="w-4 h-5 left-[331.29px] top-[1041.54px] absolute justify-start text-neutral-500 text-sm font-normal font-['Poppins']">20</div>
        <div className="w-2.5 h-5 left-[339.52px] top-[1088.20px] absolute justify-start text-neutral-500 text-sm font-normal font-['Poppins']">0</div>
        <div className="w-5 h-5 left-[330.26px] top-[997.52px] absolute justify-start text-neutral-500 text-sm font-normal font-['Poppins']">40</div>
        <div className="w-5 h-5 left-[330.26px] top-[952.61px] absolute justify-start text-neutral-500 text-sm font-normal font-['Poppins']">60</div>
        <div className="w-5 h-5 left-[330.26px] top-[907.71px] absolute justify-start text-neutral-500 text-sm font-normal font-['Poppins']">80</div>
        <div className="w-6 h-5 left-[325.11px] top-[863.69px] absolute justify-start text-neutral-500 text-sm font-normal font-['Poppins']">100</div>
        <div className="w-5 h-4 left-[318px] top-[818.79px] absolute bg-green-500 rounded-2xl" />
        <div className="w-40 h-4 left-[349.91px] top-[817.03px] absolute justify-start text-neutral-900 text-base font-semibold font-['Inter']">Income</div>
        <div className="w-5 h-4 left-[427.17px] top-[819.67px] absolute bg-teal-500 rounded-2xl" />
        <div className="w-40 h-4 left-[459.08px] top-[817.03px] absolute justify-start text-neutral-900 text-base font-semibold font-['Inter']">Expense</div>
        <div className="w-60 h-5 left-[312px] top-[777.41px] absolute justify-start text-neutral-900 text-lg font-bold font-['Inter']">Transaction Overview</div>
      </>
    );
  }
  
  if (variant === 'second') {
    return (
      <>
        <div className="w-96 h-96 left-[654px] top-[751px] absolute mix-blend-soft-light bg-white rounded-2xl shadow-[0px_10px_30px_0px_rgba(62,73,84,0.04)]" />
        <div className="w-10 h-3 left-[758.96px] top-[1140.14px] absolute bg-sky-100 rounded-2xl" />
        <div className="w-5 h-4 left-[780.57px] top-[1137.50px] absolute bg-blue-600 rounded-full shadow-[0px_4px_9px_0px_rgba(0,0,0,0.25)]" />
        <div className="w-16 h-5 left-[685.99px] top-[1137.50px] absolute justify-start text-neutral-900 text-base font-semibold font-['Nunito_Sans']">Number</div>
        <div className="w-10 h-3 left-[927.21px] top-[1140.14px] absolute bg-zinc-300 rounded-2xl" />
        <div className="w-5 h-4 left-[927.21px] top-[1137.50px] absolute bg-neutral-400 rounded-full shadow-[0px_4px_9px_0px_rgba(0,0,0,0.25)]" />
        <div className="w-16 h-5 left-[846.95px] top-[1137.50px] absolute justify-start text-neutral-900 text-base font-semibold font-['Nunito_Sans']">Analytics</div>
        <div className="w-64 h-px left-[747.90px] top-[1098.76px] absolute bg-violet-100 rounded-2xl" />
        <div className="w-64 h-px left-[747.90px] top-[1053.86px] absolute bg-violet-100 rounded-2xl" />
        <div className="w-64 h-px left-[747.90px] top-[1008.96px] absolute bg-violet-100 rounded-2xl" />
        <div className="w-64 h-px left-[747.90px] top-[964.06px] absolute bg-violet-100 rounded-2xl" />
        <div className="w-64 h-px left-[747.90px] top-[919.16px] absolute bg-violet-100 rounded-2xl" />
        <div className="w-64 h-px left-[747.90px] top-[874.26px] absolute bg-violet-100 rounded-2xl" />
        <div className="w-4 h-36 left-[747.63px] top-[957.27px] absolute bg-kai-yellow rounded-2xl" />
        <div className="w-4 h-40 left-[766.54px] top-[930.99px] absolute bg-blue-900 rounded-2xl" />
        <div className="w-4 h-56 left-[809.32px] top-[873.38px] absolute bg-kai-yellow rounded-2xl" />
        <div className="w-4 h-32 left-[828.03px] top-[970.30px] absolute bg-blue-900 rounded-2xl" />
        <div className="w-4 h-20 left-[871px] top-[1020.57px] absolute bg-kai-yellow rounded-2xl" />
        <div className="w-4 h-12 left-[889.71px] top-[1051.85px] absolute bg-blue-900 rounded-2xl" />
        <div className="w-4 h-44 left-[932.68px] top-[917.85px] absolute bg-kai-yellow rounded-2xl" />
        <div className="w-4 h-44 left-[932.68px] top-[917.85px] absolute bg-sky-500 rounded-2xl" />
        <div className="w-32 h-60 left-[892.35px] top-[887.46px] absolute bg-white/25 rounded-2xl" />
        <div className="w-4 h-20 left-[951.58px] top-[1020.94px] absolute bg-blue-900 rounded-2xl" />
        <div className="w-0.5 h-48 left-[948.07px] top-[917.40px] absolute origin-top-left rotate-90 rounded-2xl border border-blue-800/30" />
        <div className="w-36 h-16 left-[980.70px] top-[912.12px] absolute origin-top-left rotate-180 bg-white rounded-2xl shadow-[0px_15px_21px_0px_rgba(0,0,0,0.06)]" />
        <div className="w-20 h-5 left-[868.54px] top-[847.85px] absolute text-center justify-start text-neutral-900 text-xl font-bold font-['Inter']">$85,66</div>
        <div className="w-20 h-3.5 left-[867.59px] top-[880.42px] absolute text-center justify-start text-zinc-400 text-sm font-normal font-['Inter']">Expense</div>
        <div className="w-4 h-5 left-[699.28px] top-[1041.54px] absolute justify-start text-neutral-500 text-sm font-normal font-['Poppins']">20</div>
        <div className="w-2.5 h-5 left-[707.51px] top-[1088.20px] absolute justify-start text-neutral-500 text-sm font-normal font-['Poppins']">0</div>
        <div className="w-5 h-5 left-[698.25px] top-[997.52px] absolute justify-start text-neutral-500 text-sm font-normal font-['Poppins']">40</div>
        <div className="w-5 h-5 left-[698.25px] top-[952.61px] absolute justify-start text-neutral-500 text-sm font-normal font-['Poppins']">60</div>
        <div className="w-5 h-5 left-[698.25px] top-[907.71px] absolute justify-start text-neutral-500 text-sm font-normal font-['Poppins']">80</div>
        <div className="w-6 h-5 left-[693.10px] top-[863.69px] absolute justify-start text-neutral-500 text-sm font-normal font-['Poppins']">100</div>
        <div className="w-5 h-4 left-[685.99px] top-[818.79px] absolute bg-kai-yellow rounded-2xl" />
        <div className="w-40 h-4 left-[717.89px] top-[817.03px] absolute justify-start text-neutral-900 text-base font-semibold font-['Inter']">Income</div>
        <div className="w-5 h-4 left-[795.12px] top-[819.67px] absolute bg-blue-900 rounded-2xl" />
        <div className="w-40 h-4 left-[827.01px] top-[817.03px] absolute justify-start text-neutral-900 text-base font-semibold font-['Inter']">Expense</div>
        <div className="w-60 h-5 left-[684.95px] top-[777.41px] absolute justify-start text-neutral-900 text-lg font-bold font-['Inter']">Transaction Overview</div>
      </>
    );
  }
  
  // variant === 'third'
  return (
    <>
      <div className="w-96 h-96 left-[1022px] top-[751px] absolute mix-blend-soft-light bg-white rounded-2xl shadow-[0px_10px_30px_0px_rgba(62,73,84,0.04)]" />
      <div className="w-10 h-3 left-[1127.12px] top-[1140.14px] absolute bg-sky-100 rounded-2xl" />
      <div className="w-5 h-4 left-[1148.77px] top-[1137.50px] absolute bg-blue-600 rounded-full shadow-[0px_4px_9px_0px_rgba(0,0,0,0.25)]" />
      <div className="w-16 h-5 left-[1054.04px] top-[1137.50px] absolute justify-start text-neutral-900 text-base font-semibold font-['Nunito_Sans']">Number</div>
      <div className="w-10 h-3 left-[1295.65px] top-[1140.14px] absolute bg-zinc-300 rounded-2xl" />
      <div className="w-5 h-4 left-[1295.65px] top-[1137.50px] absolute bg-neutral-400 rounded-full shadow-[0px_4px_9px_0px_rgba(0,0,0,0.25)]" />
      <div className="w-16 h-5 left-[1215.26px] top-[1137.50px] absolute justify-start text-neutral-900 text-base font-semibold font-['Nunito_Sans']">Analytics</div>
      <div className="w-64 h-px left-[1116.05px] top-[1098.76px] absolute bg-violet-100 rounded-2xl" />
      <div className="w-64 h-px left-[1116.05px] top-[1053.86px] absolute bg-violet-100 rounded-2xl" />
      <div className="w-64 h-px left-[1116.05px] top-[1008.96px] absolute bg-violet-100 rounded-2xl" />
      <div className="w-64 h-px left-[1116.05px] top-[964.06px] absolute bg-violet-100 rounded-2xl" />
      <div className="w-64 h-px left-[1116.05px] top-[919.16px] absolute bg-violet-100 rounded-2xl" />
      <div className="w-64 h-px left-[1116.05px] top-[874.26px] absolute bg-violet-100 rounded-2xl" />
      <div className="w-4 h-36 left-[1115.79px] top-[957.27px] absolute bg-kai-blue rounded-2xl" />
      <div className="w-4 h-40 left-[1134.72px] top-[930.99px] absolute bg-blue-900 rounded-2xl" />
      <div className="w-4 h-56 left-[1177.57px] top-[873.38px] absolute bg-kai-blue rounded-2xl" />
      <div className="w-4 h-32 left-[1196.31px] top-[970.30px] absolute bg-blue-900 rounded-2xl" />
      <div className="w-4 h-20 left-[1239.35px] top-[1020.57px] absolute bg-kai-blue rounded-2xl" />
      <div className="w-4 h-12 left-[1258.09px] top-[1051.85px] absolute bg-blue-900 rounded-2xl" />
      <div className="w-4 h-44 left-[1301.13px] top-[917.85px] absolute bg-kai-blue rounded-2xl" />
      <div className="w-4 h-44 left-[1301.13px] top-[917.85px] absolute bg-sky-500 rounded-2xl" />
      <div className="w-32 h-60 left-[1260.73px] top-[887.46px] absolute bg-white/25 rounded-2xl" />
      <div className="w-4 h-20 left-[1320.06px] top-[1020.94px] absolute bg-blue-900 rounded-2xl" />
      <div className="w-0.5 h-48 left-[1316.55px] top-[917.40px] absolute origin-top-left rotate-90 rounded-2xl border border-blue-800/30" />
      <div className="w-36 h-16 left-[1349.22px] top-[912.12px] absolute origin-top-left rotate-180 bg-white rounded-2xl shadow-[0px_15px_21px_0px_rgba(0,0,0,0.06)]" />
      <div className="w-20 h-5 left-[1236.89px] top-[847.85px] absolute text-center justify-start text-neutral-900 text-xl font-bold font-['Inter']">$85,66</div>
      <div className="w-20 h-3.5 left-[1235.94px] top-[880.42px] absolute text-center justify-start text-zinc-400 text-sm font-normal font-['Inter']">Expense</div>
      <div className="w-4 h-5 left-[1067.35px] top-[1041.54px] absolute justify-start text-neutral-500 text-sm font-normal font-['Poppins']">20</div>
      <div className="w-2.5 h-5 left-[1075.59px] top-[1088.20px] absolute justify-start text-neutral-500 text-sm font-normal font-['Poppins']">0</div>
      <div className="w-5 h-5 left-[1066.32px] top-[997.52px] absolute justify-start text-neutral-500 text-sm font-normal font-['Poppins']">40</div>
      <div className="w-5 h-5 left-[1066.32px] top-[952.61px] absolute justify-start text-neutral-500 text-sm font-normal font-['Poppins']">60</div>
      <div className="w-5 h-5 left-[1066.32px] top-[907.71px] absolute justify-start text-neutral-500 text-sm font-normal font-['Poppins']">80</div>
      <div className="w-6 h-5 left-[1061.16px] top-[863.69px] absolute justify-start text-neutral-500 text-sm font-normal font-['Poppins']">100</div>
      <div className="w-5 h-4 left-[1054.04px] top-[818.79px] absolute bg-kai-blue rounded-2xl" />
      <div className="w-40 h-4 left-[1085.99px] top-[817.03px] absolute justify-start text-neutral-900 text-base font-semibold font-['Inter']">Income</div>
      <div className="w-5 h-4 left-[1163.35px] top-[819.67px] absolute bg-blue-900 rounded-2xl" />
      <div className="w-40 h-4 left-[1195.30px] top-[817.03px] absolute justify-start text-neutral-900 text-base font-semibold font-['Inter']">Expense</div>
      <div className="w-60 h-5 left-[1053.01px] top-[777.41px] absolute justify-start text-neutral-900 text-lg font-bold font-['Inter']">Transaction Overview</div>
    </>
  );
}
