export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-b from-grid-cyan-50 to-white">
      <div className="z-10 max-w-5xl w-full items-center justify-between">
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-bold text-grid-navy-500 mb-4">
            GRID 78
          </h1>
          <h2 className="text-3xl font-semibold bg-gradient-to-r from-grid-cyan-500 via-grid-orange-500 to-grid-red-500 bg-clip-text text-transparent">
            Drone Team - Application de Gestion
          </h2>
          <p className="text-grid-navy-600 text-xl">
            Groupe Renseignement et Intervention Drone
          </p>
          <p className="text-grid-navy-500 text-lg">
            Sapeurs-Pompiers - Gestion d&apos;équipe de télépilotes
          </p>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg bg-white border-2 border-grid-cyan-500 shadow-lg">
              <div className="text-4xl mb-2">🚁</div>
              <h3 className="font-semibold text-grid-cyan-600">Missions Drone</h3>
              <p className="text-sm text-grid-navy-500 mt-2">Gestion complète des missions</p>
            </div>
            
            <div className="p-6 rounded-lg bg-white border-2 border-grid-orange-500 shadow-lg">
              <div className="text-4xl mb-2">📅</div>
              <h3 className="font-semibold text-grid-orange-600">Planning</h3>
              <p className="text-sm text-grid-navy-500 mt-2">Disponibilités en temps réel</p>
            </div>
            
            <div className="p-6 rounded-lg bg-white border-2 border-grid-red-500 shadow-lg">
              <div className="text-4xl mb-2">🎓</div>
              <h3 className="font-semibold text-grid-red-600">Formations</h3>
              <p className="text-sm text-grid-navy-500 mt-2">Suivi des certifications</p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-grid-navy-500 text-white rounded-lg">
            <p className="font-semibold">✅ Configuration réussie - Prêt pour le développement</p>
          </div>

          <div className="mt-8 flex justify-center gap-4">
            <a
              href="/auth/login"
              className="bg-grid-cyan-500 hover:bg-grid-cyan-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-lg"
            >
              Connexion
            </a>
            <a
              href="/auth/signup"
              className="bg-white hover:bg-gray-50 text-grid-navy-600 border-2 border-grid-navy-600 px-8 py-3 rounded-lg font-semibold transition-colors shadow-lg"
            >
              Créer un compte
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
