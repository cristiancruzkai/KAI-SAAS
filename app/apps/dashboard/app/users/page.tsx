'use client';

export default function UsersPage() {
  return (
    <div className="w-full h-screen bg-gradient-to-b from-stone-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-neutral-900 mb-4">Usuarios</h1>
        <p className="text-lg text-neutral-600 mb-8">
          Gestión de usuarios y permisos del sistema.
        </p>
        
        <div className="bg-white rounded-2xl shadow-lg p-8 min-h-[600px] flex items-center justify-center">
          <div className="text-center">
            <svg className="w-24 h-24 mx-auto mb-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.58301 4C11.0907 4.00008 13.3027 5.63865 14.0273 8.0332C14.7519 10.4278 13.8183 13.0135 11.7295 14.3975C13.4634 15.0355 14.9626 16.1836 16.0273 17.6904C16.1903 17.9213 16.2104 18.224 16.0801 18.4746C15.9497 18.7251 15.6902 18.8827 15.4072 18.8828H1.75781C1.47489 18.8826 1.2153 18.7251 1.08496 18.4746C0.954761 18.224 0.975784 17.9222 1.13867 17.6914C2.20352 16.1843 3.70226 15.0356 5.43652 14.3975C3.34765 13.0135 2.41404 10.4278 3.13867 8.0332C3.86337 5.63859 6.07526 4 8.58301 4ZM14.7666 4.21387C17.4604 3.45918 20.3048 4.77148 21.4727 7.30762C22.6405 9.84379 21.7852 12.8509 19.4561 14.3975C21.1901 15.0355 22.6891 16.1836 23.7539 17.6904C23.9169 17.9213 23.937 18.224 23.8066 18.4746C23.6762 18.7251 23.4168 18.8828 23.1338 18.8828H18.8955C18.6009 18.8828 18.3326 18.7125 18.208 18.4463C17.6254 17.2005 16.805 16.0796 15.793 15.1465C15.7781 15.1327 15.7645 15.1181 15.751 15.1035C15.4863 14.8625 15.2094 14.6343 14.9219 14.4209C14.607 14.1872 14.5233 13.7527 14.7285 13.4189C16.2621 10.921 16.1178 7.7431 14.3643 5.39355C14.2153 5.19385 14.1744 4.93388 14.2549 4.69824C14.3354 4.46276 14.5265 4.28129 14.7666 4.21387Z"/>
            </svg>
            <h2 className="text-2xl font-semibold text-neutral-800">Usuarios</h2>
            <p className="text-neutral-600 mt-2">Próximamente: Gestión completa de usuarios</p>
          </div>
        </div>
      </div>
    </div>
  );
}
