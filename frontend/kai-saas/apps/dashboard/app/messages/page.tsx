'use client';

export default function MessagesPage() {
  return (
    <div className="w-full h-screen bg-gradient-to-b from-stone-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-neutral-900 mb-4">Mensajes</h1>
        <p className="text-lg text-neutral-600 mb-8">
          Centro de mensajería y conversaciones.
        </p>
        
        <div className="bg-white rounded-2xl shadow-lg p-8 min-h-[600px] flex items-center justify-center">
          <div className="text-center">
            <svg className="w-24 h-24 mx-auto mb-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M22.1131 17.1417C23.2813 15.0135 23.2963 12.4606 22.153 10.3196C21.0098 8.17856 18.8557 6.72546 16.3968 6.43648C15.313 3.96537 12.925 2.27316 10.1786 2.03006C7.43221 1.78695 4.77042 3.03217 3.24746 5.27253C1.72449 7.5129 1.58606 10.387 2.88697 12.7565L2.30716 14.7344C2.17615 15.181 2.30391 15.6617 2.64093 15.9902C2.97795 16.3187 3.47124 16.4433 3.92957 16.3157L5.95948 15.7506C6.7809 16.179 7.67719 16.4543 8.60228 16.5622C9.42916 18.4471 11.03 19.9072 13.0148 20.5867C14.9995 21.2661 17.1857 21.1025 19.0407 20.1357L21.0705 20.7008C21.5288 20.8284 22.0221 20.7038 22.3591 20.3754C22.6961 20.047 22.824 19.5663 22.693 19.1197L22.1131 17.1417ZM20.6612 16.675C20.5556 16.848 20.5279 17.0558 20.5847 17.2494L21.1581 19.205L19.1512 18.6463C18.9526 18.591 18.7394 18.618 18.5619 18.7209C17.1753 19.5217 15.5165 19.7454 13.9588 19.3419C12.4012 18.9383 11.0754 17.9413 10.28 16.5753C12.3569 16.3658 14.2498 15.3212 15.5024 13.6933C16.7549 12.0655 17.2534 10.002 16.8777 8.00059C18.7362 8.42838 20.2748 9.69239 21.0218 11.405C21.7687 13.1175 21.6348 15.0742 20.6612 16.675V16.675Z"/>
            </svg>
            <h2 className="text-2xl font-semibold text-neutral-800">Mensajes</h2>
            <p className="text-neutral-600 mt-2">Próximamente: Sistema de mensajería integrado</p>
          </div>
        </div>
      </div>
    </div>
  );
}
