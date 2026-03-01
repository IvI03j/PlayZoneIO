import { useState } from 'react';
import { Game } from '../data/games';
import { Star, Play, Users, Sparkles } from 'lucide-react';

interface GameCardProps {
  game: Game;
  onClick: (game: Game) => void;
  featured?: boolean;
}

export function GameCard({ game, onClick, featured = false }: GameCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const isNew = parseInt(game.plays.replace(/[^0-9]/g, '')) < 10;
  const isHot = game.rating >= 4.7;
  const categoryLabel = game.category.toUpperCase();

  const categoryTone =
    game.category === 'horror'
      ? 'from-rose-500/80 to-orange-500/80'
      : game.category === 'shooter'
        ? 'from-amber-500/80 to-orange-500/80'
        : game.category === 'racing'
          ? 'from-cyan-500/80 to-blue-500/80'
          : game.category === 'io' || game.category === 'multiplayer'
            ? 'from-violet-500/80 to-fuchsia-500/80'
            : 'from-emerald-500/80 to-lime-500/80';

  if (featured) {
    return (
      <div 
        className="group relative overflow-hidden rounded-3xl cursor-pointer card-cyber h-[320px] animate-fade-in-up border border-white/10"
        onClick={() => onClick(game)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30 z-[1]" />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-[1] bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.18),transparent_45%)]" />

        {/* Background Image */}
        <div className="absolute inset-0 overflow-hidden">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-green-900/30 to-black animate-pulse" />
          )}
          <img
            src={game.gif && isHovered ? game.gif : game.image}
            alt={game.title}
            className={`w-full h-full object-cover transition-all duration-700 ${
              isHovered ? 'scale-110' : 'scale-100'
            } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Content */}
        <div className="relative z-[2] h-full flex flex-col justify-end p-6">
          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2 flex-wrap pr-4">
            <div className={`bg-gradient-to-r ${categoryTone} text-white text-[10px] font-black px-3 py-1.5 rounded-full tracking-wider`}>
              {categoryLabel}
            </div>
            {isHot && (
              <div className="flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full animate-pulse">
                <Sparkles className="w-3 h-3" />
                HOT
              </div>
            )}
            {game.url && (
              <div className="flex items-center gap-1 bg-green-500 text-black text-xs font-bold px-3 py-1.5 rounded-full">
                <Play className="w-3 h-3" />
                JUGAR
              </div>
            )}
          </div>

          {/* Title & Info */}
          <div className="transform transition-transform duration-300 group-hover:translate-y-[-8px]">
            <span className="inline-block text-green-400 text-xs font-bold tracking-wider uppercase mb-2">
              {game.category}
            </span>
            <h3 className="text-2xl font-black text-white mb-2 group-hover:text-green-300 transition-colors leading-tight">
              {game.title}
            </h3>
            <p className="text-zinc-400 text-sm line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {game.description}
            </p>

            {/* Stats */}
            <div className="flex items-center gap-4 bg-black/45 border border-white/10 rounded-xl px-3 py-2 w-fit">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-white font-bold">{game.rating}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-green-400" />
                <span className="text-zinc-300 text-sm">{game.plays}</span>
              </div>
            </div>
          </div>

          {/* Play button */}
          <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-[0_0_35px_rgba(34,197,94,0.45)] group-hover:scale-110 transition-transform">
              <Play className="w-6 h-6 text-black fill-black ml-1" />
            </div>
          </div>
        </div>

        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-green-500/50 rounded-tl-lg" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-green-500/50 rounded-br-lg" />
      </div>
    );
  }

  return (
    <div 
      className="group relative overflow-hidden rounded-2xl cursor-pointer card-cyber animate-fade-in-up border border-white/10"
      onClick={() => onClick(game)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <div className="absolute inset-0 z-[1] opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_75%_10%,rgba(255,255,255,0.2),transparent_42%)]" />
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 to-black animate-pulse" />
        )}
        <img
          src={game.gif && isHovered ? game.gif : game.image}
          alt={game.title}
          className={`w-full h-full object-cover transition-all duration-500 ${
            isHovered ? 'scale-110' : 'scale-100'
          } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent transition-opacity duration-300 ${
          isHovered ? 'opacity-90' : 'opacity-70'
        }`} />

        {/* GIF Badge */}
        {game.gif && (
          <div className={`absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold transition-all duration-300 ${
            isHovered 
              ? 'bg-green-500 text-black' 
              : 'bg-black/60 text-green-400 border border-green-500/30'
          }`}>
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            GIF
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-[2]">
          <div className={`bg-gradient-to-r ${categoryTone} text-white text-[10px] font-black px-2 py-1 rounded tracking-wider uppercase w-fit`}>
            {categoryLabel}
          </div>
          {isNew && (
            <div className="flex items-center gap-1 bg-cyan-500 text-black text-[10px] font-bold px-2 py-1 rounded">
              <Sparkles className="w-3 h-3" />
              NUEVO
            </div>
          )}
          {isHot && (
            <div className="flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold px-2 py-1 rounded">
              <Sparkles className="w-3 h-3" />
              HOT
            </div>
          )}
        </div>

        {/* Play Button Overlay */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 z-[2] ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-[0_0_35px_rgba(34,197,94,0.45)] transform transition-transform duration-300 hover:scale-110">
            <Play className="w-7 h-7 text-black fill-black ml-1" />
          </div>
        </div>

        {/* Stats on hover */}
        <div className={`absolute bottom-0 left-0 right-0 p-3 transition-all duration-300 z-[2] ${
          isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <div className="flex items-center justify-between rounded-xl bg-black/55 border border-white/10 px-3 py-2 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-white font-bold text-sm">{game.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-green-400" />
                <span className="text-zinc-300 text-xs">{game.plays}</span>
              </div>
            </div>
            {game.url && (
              <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider">Online</span>
            )}
          </div>
        </div>
      </div>

      {/* Title & Category */}
      <div className="p-4 border-t border-white/10 bg-gradient-to-b from-black/30 to-black/60">
        <h3 className="text-white font-bold text-sm mb-2 group-hover:text-green-300 transition-colors line-clamp-1">
          {game.title}
        </h3>
        <div className="flex items-center justify-between gap-3">
          <p className="text-zinc-400 text-[11px] uppercase tracking-[0.2em]">{game.category}</p>
          <div className="flex items-center gap-1 text-zinc-300 text-xs font-semibold">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            {game.rating}
          </div>
        </div>
      </div>

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-6 h-6 border-l border-t border-green-500/30 rounded-tl-lg opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-r border-b border-green-500/30 rounded-br-lg opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}
