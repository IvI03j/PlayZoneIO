export function StatsBar() {
  const stats = [
    { icon: '🎮', value: '5,000+', label: 'Juegos' },
    { icon: '👥', value: '10M+', label: 'Jugadores' },
    { icon: '🌍', value: '150+', label: 'Países' },
    { icon: '⭐', value: '4.8', label: 'Valoración' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 my-10">
      {stats.map((stat, index) => (
        <div
          key={index}
          style={{
            animationDelay: `${index * 100}ms`
          }}
          className="group relative glass-dark rounded-3xl p-6 md:p-8 text-center border border-white/10 hover:border-purple-500/50 transition-all duration-500 card-hover animate-scale-in overflow-hidden"
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/20 group-hover:to-pink-600/20 transition-all duration-500 rounded-3xl"></div>
          
          {/* Animated border glow */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500 -z-10"></div>
          
          <div className="relative z-10">
            <div className="text-4xl md:text-5xl mb-3 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 filter drop-shadow-lg">
              {stat.icon}
            </div>
            <div className="text-3xl md:text-4xl font-black text-white mb-1 group-hover:text-gradient transition-all duration-300">
              {stat.value}
            </div>
            <div className="text-white/60 text-sm font-bold uppercase tracking-wider">
              {stat.label}
            </div>
          </div>
          
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 animate-shimmer"></div>
        </div>
      ))}
    </div>
  );
}
