export function FeaturedBanner() {
  const featuredGames = [
    {
      title: "Smash Karts",
      subtitle: "Carreras con Armas",
      image: "https://tcf.admeen.org/game/17500/17357/400x246/smash-karts.webp",
    },
    {
      title: "Agar.io",
      subtitle: "El Clásico .io",
      image: "https://tcf.admeen.org/game/15500/15045/400x246/agar-io.webp",
      isHot: true,
    },
    {
      title: "Zombs Royale",
      subtitle: "Battle Royale",
      image: "https://upload.wikimedia.org/wikipedia/en/6/68/ZombsRoyale.io_Cover_Art.jpg",
      isNew: true,
    },
  ];

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 p-8 md:p-12 my-8 shadow-2xl border border-white/20 animate-scale-in">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-400 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-400 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}} />
      </div>
      
      {/* Grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-20"></div>
      
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-center md:text-left flex-1">
          <div className="inline-flex items-center gap-3 glass px-5 py-2.5 rounded-full text-white text-sm font-bold mb-6 shadow-lg animate-pulse border border-white/30">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            ✨ ¡14 juegos disponibles para jugar GRATIS!
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight drop-shadow-2xl">
            ¡Juega Directo en tu
            <br />
            <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent">
              Navegador!
            </span>
          </h2>
          <p className="text-white/90 text-lg md:text-xl max-w-2xl font-medium leading-relaxed drop-shadow-lg">
            Smash Karts, Agar.io, Venge.io y más juegos disponibles. Sin descargas, sin registro. ¡Haz clic y juega!
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-8">
            <button className="group px-8 py-4 bg-white text-purple-600 font-black rounded-2xl hover:bg-yellow-400 hover:text-gray-900 transition-all shadow-2xl hover:shadow-yellow-500/50 hover:-translate-y-1 hover:scale-105 text-lg">
              <span className="flex items-center gap-2">
                🎮 Jugar Ahora
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
            <button className="px-8 py-4 glass text-white font-bold rounded-2xl hover:bg-white/20 transition-all border-2 border-white/40 hover:border-white/60 hover:-translate-y-1 text-lg">
              📚 Ver Catálogo
            </button>
          </div>
        </div>
        
        {/* Featured Games Preview */}
        <div className="hidden lg:flex gap-4 perspective-1000">
          {featuredGames.map((game, index) => (
            <div 
              key={index}
              style={{
                animationDelay: `${index * 200}ms`,
                transform: index === 0 ? 'rotate(-6deg)' : index === 2 ? 'rotate(6deg)' : 'rotate(0deg)'
              }}
              className="group relative w-56 h-40 glass rounded-3xl border-2 border-white/30 overflow-hidden shadow-2xl hover:rotate-0 hover:scale-110 transition-all duration-500 cursor-pointer animate-fade-in hover:z-10"
            >
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500"></div>
              
              <div className="relative w-full h-full overflow-hidden rounded-3xl">
                <img
                  src={game.image}
                  alt={game.title}
                  className="w-full h-full object-cover transform group-hover:scale-125 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent group-hover:from-black/60 transition-all duration-300" />
                
                {/* Play icon on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-all duration-500 shadow-2xl">
                    <svg className="w-7 h-7 text-purple-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white font-black text-base drop-shadow-lg">{game.title}</p>
                  <p className="text-white/90 text-xs font-semibold">{game.subtitle}</p>
                </div>
                
                {game.isNew && (
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs font-black rounded-full shadow-lg border border-white/30 backdrop-blur-sm">✨ NEW</span>
                  </div>
                )}
                {game.isHot && (
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-black rounded-full shadow-lg border border-white/30 backdrop-blur-sm animate-pulse">🔥 HOT</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
