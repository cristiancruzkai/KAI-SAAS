'use client';

export default function FilesPage() {
  return (
    <div className="w-full h-screen bg-gradient-to-b from-stone-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-neutral-900 mb-4">Archivos</h1>
        <p className="text-lg text-neutral-600 mb-8">
          Gestión de documentos y archivos del sistema.
        </p>
        
        <div className="bg-white rounded-2xl shadow-lg p-8 min-h-[600px] flex items-center justify-center">
          <div className="text-center">
            <svg className="w-24 h-24 mx-auto mb-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M22.7133 9.96615C22.427 9.56926 21.9681 9.33394 21.4793 9.33333H20.2529L20.2392 8.26013C20.2252 7.16563 19.3339 6.28571 18.2394 6.28571H12.4751C12.258 6.28571 12.0468 6.21507 11.8734 6.08444L9.6407 4.40254C9.2939 4.1413 8.8715 4 8.43731 4H4C2.89543 4 2 4.89543 2 6V18C2 19.1046 2.89543 20 4 20H18.5968C19.458 20 20.2224 19.4488 20.4944 18.6318L22.9223 11.339C23.0763 10.8743 22.9986 10.3638 22.7133 9.96615ZM8.25749 5.52381C8.47416 5.52381 8.68496 5.59418 8.85818 5.72432L11.2278 7.50474C11.4915 7.70195 11.8115 7.80883 12.1405 7.80952H17.7318C18.2841 7.80952 18.7318 8.25724 18.7318 8.80952V9.33333H6.35086C5.69595 9.33274 5.11436 9.75267 4.90782 10.3753L3.52108 14.543V6.52381C3.52108 5.97153 3.96879 5.52381 4.52108 5.52381H8.25749Z"/>
            </svg>
            <h2 className="text-2xl font-semibold text-neutral-800">Archivos</h2>
            <p className="text-neutral-600 mt-2">Próximamente: Explorador de archivos completo</p>
          </div>
        </div>
      </div>
    </div>
  );
}
