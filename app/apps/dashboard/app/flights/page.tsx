'use client';

export default function FlightsPage() {
  return (
    <div className="w-full h-screen bg-gradient-to-b from-stone-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-neutral-900 mb-4">Envíos</h1>
        <p className="text-lg text-neutral-600 mb-8">
          Gestión de envíos y entregas automatizadas.
        </p>
        
        <div className="bg-white rounded-2xl shadow-lg p-8 min-h-[600px] flex items-center justify-center">
          <div className="text-center">
            <svg className="w-24 h-24 mx-auto mb-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M15.5066 8.79191L15.4969 4.00276C15.4974 2.34482 14.1559 1.00046 12.5007 1.00004C10.8455 0.999621 9.50339 2.34331 9.50297 4.00125L9.49337 8.79191L3.09998 12.0137C2.42549 12.3535 2 13.0444 2 13.7997V14.8043C2 15.426 2.56138 15.8971 3.17369 15.7891L9.49245 14.6746V17.2007L8.45276 18.4579C8.15621 18.8164 7.99396 19.2672 7.99396 19.7325V20.7662C7.99396 21.4018 8.57916 21.8762 9.20099 21.7446L12.5007 21.0463L15.7769 21.7431C16.399 21.8754 16.9849 21.401 16.9849 20.765V19.7256C16.9849 19.2645 16.8256 18.8175 16.5339 18.4604L15.5075 17.2039V14.6746L21.8263 15.7891C22.4386 15.8971 23 15.426 23 14.8043V13.7997C23 13.0444 22.5745 12.3535 21.9 12.0137L15.5066 8.79191Z"/>
            </svg>
            <h2 className="text-2xl font-semibold text-neutral-800">Envíos</h2>
            <p className="text-neutral-600 mt-2">Próximamente: Sistema de gestión de envíos</p>
          </div>
        </div>
      </div>
    </div>
  );
}
