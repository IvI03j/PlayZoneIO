import { useState, useEffect, useRef } from 'react';
import { Game, getRelatedGames, getGameSlug } from '../data/games';
import { 
  Star, Users, Calendar, Gamepad2, ChevronLeft, Maximize2, 
  Clock, Trophy, Target, Shield, Zap, Monitor
} from 'lucide-react';
import { GameCard } from '../components/GameCard';
import { useLibrary } from '../context/LibraryContext';

interface GameDetailProps {
  game: Game;
  onBack: () => void;
  onGameClick: (game: Game) => void;
}

export function GameDetail({ game, onBack, onGameClick }: GameDetailProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'info' | 'controls' | 'screenshots'>('info');
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const relatedGames = getRelatedGames(game, 4);
  const { getGameInLibrary, toggleFavorite, addToLibrary, startGameSession } = useLibrary();
  const libraryItem = getGameInLibrary(game.id);

  // Forzar scroll arriba al montar el componente o cambiar de juego
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
  }, [game.id]);

  // Solo rastrear tiempo de juego si el juego está en la biblioteca
  useEffect(() => {
    if (libraryItem) {
      const endSession = startGameSession(game.id);
      return () => {
        endSession();
      };
    }
  }, [game.id, startGameSession, libraryItem]);

  const handleAddToLibrary = () => {
    addToLibrary(game.id);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (gameContainerRef.current) {
        gameContainerRef.current.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable full-screen mode: ${err.message}`);
        });
      }
    } else {
      document.exitFullscreen();
    }
  };

  const toggleTheaterMode = () => {
    setIsTheaterMode(!isTheaterMode);
    if (!isTheaterMode) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    // Bloqueo de scroll con la rueda del ratón cuando está en pantalla completa o el juego está activo
    const handleWheel = (e: WheelEvent) => {
      if (isFullscreen) {
        e.preventDefault();
      }
    };

    // Bloqueo de teclas de navegación (espacio, flechas, etc.) en pantalla completa
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFullscreen && ['ArrowUp', 'ArrowDown', ' ', 'PageUp', 'PageDown', 'Home', 'End'].includes(e.key)) {
        e.preventDefault();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    // Lock body scroll if in theater mode and at the top
    if (isTheaterMode || isFullscreen) {
      document.body.style.overflow = isFullscreen ? 'hidden' : 'auto';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isFullscreen, isTheaterMode]);

  return (
    <div className={`min-h-screen bg-[#050505] ${isFullscreen ? 'overflow-hidden' : ''}`}>
      {/* Navigation Bar */}
      <div className={`sticky top-0 z-40 glass-dark border-b border-green-500/20 transition-all duration-300 ${isTheaterMode ? '-translate-y-full opacity-0 h-0 overflow-hidden' : 'h-16'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-zinc-400 hover:text-green-400 transition-colors group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Volver</span>
          </button>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={toggleTheaterMode}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isTheaterMode ? 'bg-green-500 text-black' : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300'}`}
              title="Modo Cine"
            >
              <Monitor className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">Modo Cine</span>
            </button>
            <button
              onClick={toggleFullscreen}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 transition-colors"
              title="Pantalla Completa"
            >
              <Maximize2 className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">Pantalla Completa</span>
            </button>
          </div>
        </div>
      </div>

      {/* Exit Theater Mode Button (Only visible when in theater mode) */}
      {isTheaterMode && !isFullscreen && (
        <button
          onClick={toggleTheaterMode}
          className="fixed top-4 right-4 z-50 p-3 bg-green-500 text-black rounded-full shadow-lg shadow-green-500/20 hover:scale-110 transition-transform animate-bounce"
          title="Salir de Modo Cine"
        >
          <ChevronLeft className="w-6 h-6 rotate-90" />
        </button>
      )}

      {/* Game Container */}
      <div 
        ref={gameContainerRef}
        className={`bg-black border-b border-green-500/20 relative ${isFullscreen ? 'w-screen h-screen z-50' : isTheaterMode ? 'w-full h-[85vh] z-30' : ''}`}
        onClick={() => {
          // Help games request pointer lock on first user interaction
          const iframe = gameContainerRef.current?.querySelector('iframe');
          iframe?.focus();
        }}
      >
        <div className={`relative transition-all duration-300 ${isFullscreen ? 'h-full w-full' : isTheaterMode ? 'h-full w-full' : 'h-[60vh] min-h-[400px] max-h-[700px]'}`}>
          {game.url ? (
            <>
              {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black">
                  <div className="w-16 h-16 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin mb-4" />
                  <p className="text-zinc-400 animate-pulse">Cargando juego...</p>
                </div>
              )}
              <iframe
                src={game.url}
                title={game.title}
                className={`w-full h-full ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-fullscreen allow-pointer-lock"
                allow="fullscreen; autoplay; gamepad; pointer-lock"
                onLoad={() => setIsLoading(false)}
              />
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-zinc-900 to-black">
              <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
                <Gamepad2 className="w-12 h-12 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Juego no disponible</h3>
              <p className="text-zinc-400">Este juego no se puede jugar en el navegador</p>
            </div>
          )}
          
          {/* Game overlay info */}
          <div className="absolute top-4 left-4 glass px-4 py-2 rounded-lg">
            <h1 className="text-white font-bold text-lg">{game.title}</h1>
            <p className="text-green-400 text-sm">{game.category}</p>
          </div>
        </div>
      </div>

      {/* Game Info Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & Quick Stats */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-white mb-3">
                  {game.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-3 py-1 bg-green-500/10 border border-green-500/30 text-green-400 rounded-full text-sm font-medium">
                    {game.category}
                  </span>
                  {game.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-zinc-900 text-zinc-400 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-6 glass px-6 py-3 rounded-2xl">
                <div className="text-center">
                  <div className="flex items-center gap-1 justify-center mb-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="text-2xl font-bold text-white">{game.rating}</span>
                  </div>
                  <span className="text-xs text-zinc-500 uppercase tracking-wider">Rating</span>
                </div>
                <div className="w-px h-10 bg-zinc-800" />
                <div className="text-center">
                  <div className="flex items-center gap-1 justify-center mb-1">
                    <Users className="w-5 h-5 text-green-400" />
                    <span className="text-2xl font-bold text-white">{game.plays}</span>
                  </div>
                  <span className="text-xs text-zinc-500 uppercase tracking-wider">Jugadas</span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-zinc-800">
              {(['info', 'controls', 'screenshots'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 text-sm font-medium capitalize transition-colors relative ${
                    activeTab === tab 
                      ? 'text-green-400' 
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {tab === 'info' ? 'Información' : tab === 'controls' ? 'Controles' : 'Capturas'}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500" />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[200px]">
              {activeTab === 'info' && (
                <div className="space-y-6 animate-fade-in">
                  <p className="text-lg text-zinc-300 leading-relaxed">
                    {game.longDescription}
                  </p>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    {game.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
                        <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                          <Zap className="w-4 h-4 text-green-400" />
                        </div>
                        <span className="text-zinc-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 glass rounded-xl text-center">
                      <Calendar className="w-5 h-5 text-green-400 mx-auto mb-2" />
                      <p className="text-white font-medium">{game.releaseDate}</p>
                      <p className="text-xs text-zinc-500">Lanzamiento</p>
                    </div>
                    <div className="p-4 glass rounded-xl text-center">
                      <Gamepad2 className="w-5 h-5 text-green-400 mx-auto mb-2" />
                      <p className="text-white font-medium">{game.developer}</p>
                      <p className="text-xs text-zinc-500">Desarrollador</p>
                    </div>
                    <div className="p-4 glass rounded-xl text-center">
                      <Monitor className="w-5 h-5 text-green-400 mx-auto mb-2" />
                      <p className="text-white font-medium">Navegador</p>
                      <p className="text-xs text-zinc-500">Plataforma</p>
                    </div>
                    <div className="p-4 glass rounded-xl text-center">
                      <Trophy className="w-5 h-5 text-green-400 mx-auto mb-2" />
                      <p className="text-white font-medium">Gratis</p>
                      <p className="text-xs text-zinc-500">Precio</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'controls' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="p-6 glass rounded-2xl">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-green-400" />
                      Controles del Juego
                    </h3>
                    <div className="space-y-3">
                      {game.controls.split('|').map((control, idx) => {
                        const [key, action] = control.split(':');
                        return (
                          <div key={idx} className="flex items-center justify-between p-3 bg-black/40 rounded-lg">
                            <kbd className="px-3 py-1.5 bg-zinc-800 text-green-400 rounded font-mono text-sm border border-zinc-700">
                              {key.trim()}
                            </kbd>
                            <span className="text-zinc-300">{action.trim()}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="p-6 glass rounded-2xl">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-green-400" />
                      Consejos Pro
                    </h3>
                    <ul className="space-y-2 text-zinc-300">
                      <li className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">•</span>
                        Practica los controles en el modo tutorial antes de jugar online
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">•</span>
                        Usa el chat para coordinar con tu equipo
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">•</span>
                        Explora el mapa para encontrar ventajas estratégicas
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">•</span>
                        Ajusta la sensibilidad del ratón en configuración
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'screenshots' && (
                <div className="grid sm:grid-cols-2 gap-4 animate-fade-in">
                  {game.screenshots.map((screenshot, idx) => (
                    <div key={idx} className="aspect-video rounded-xl overflow-hidden border border-zinc-800 group cursor-pointer">
                      <img 
                        src={screenshot} 
                        alt={`${game.title} screenshot ${idx + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Library Actions */}
            {!libraryItem && (
              <button 
                onClick={handleAddToLibrary}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 text-lg transition-colors"
              >
                <Gamepad2 className="w-6 h-6" />
                AGREGAR A BIBLIOTECA
              </button>
            )}

            {libraryItem && (
              <div className="space-y-3">
                <button 
                  onClick={() => toggleFavorite(game.id)}
                  className={`w-full font-bold py-4 rounded-xl flex items-center justify-center gap-3 text-lg transition-colors ${libraryItem.isFavorite ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-zinc-700 hover:bg-zinc-600 text-zinc-300'}`}
                >
                  <Star className="w-6 h-6" fill={libraryItem.isFavorite ? 'currentColor' : 'none'} />
                  {libraryItem.isFavorite ? 'QUITAR DE FAVORITOS' : 'AÑADIR A FAVORITOS'}
                </button>
                
                {/* Play Time Info */}
                <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
                  <p className="text-zinc-400 text-sm mb-1">Tiempo total jugado</p>
                  <p className="text-2xl font-bold text-emerald-400">
                    {Math.floor(libraryItem.playTime / 60)} min {Math.floor((libraryItem.playTime % 60))} s
                  </p>
                </div>
              </div>
            )}

            {/* Fullscreen Button */}
            {game.url && (
              <button 
                onClick={toggleFullscreen}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 text-lg transition-colors shadow-lg shadow-emerald-500/20"
              >
                <Maximize2 className="w-6 h-6" />
                JUGAR EN PANTALLA COMPLETA
              </button>
            )}

            {/* Game Stats */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Estadísticas</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Dificultad</span>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className={`w-2 h-2 rounded-full ${i <= 3 ? 'bg-green-400' : 'bg-zinc-700'}`} />
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Duración</span>
                  <span className="text-white flex items-center gap-1">
                    <Clock className="w-4 h-4 text-green-400" />
                    10-30 min
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Jugadores</span>
                  <span className="text-white flex items-center gap-1">
                    <Users className="w-4 h-4 text-green-400" />
                    Online
                  </span>
                </div>
              </div>
              
              {/* Library Stats if available */}
              {libraryItem && (
                <div className="mt-6 pt-6 border-t border-zinc-800">
                  <h4 className="text-sm font-medium text-zinc-400 mb-3">Tu Progreso</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-zinc-500 mb-1">Tiempo Jugado</p>
                      <p className="text-lg font-bold text-emerald-400">
                        {Math.floor(libraryItem.playTime / 60)} min {libraryItem.playTime % 60} s
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 mb-1">Partidas Jugadas</p>
                      <p className="text-lg font-bold text-amber-400">{libraryItem.sessionsCount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 mb-1">Logros</p>
                      <p className="text-lg font-bold text-cyan-400">
                        {libraryItem.achievements.filter(a => a.unlocked).length}/{libraryItem.achievements.length}
                      </p>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${(libraryItem.achievements.filter(a => a.unlocked).length / libraryItem.achievements.length) * 100}%` }} 
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Related Games Preview */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">También te puede gustar</h3>
              <div className="space-y-3">
                {relatedGames.slice(0, 3).map(relatedGame => (
                  <button
                    key={relatedGame.id}
                    onClick={() => onGameClick(relatedGame)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group text-left"
                  >
                    <img 
                      src={relatedGame.image} 
                      alt={relatedGame.title}
                      className="w-16 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate group-hover:text-green-400 transition-colors">
                        {relatedGame.title}
                      </p>
                      <p className="text-zinc-500 text-sm">{relatedGame.category}</p>
                    </div>
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Games Section */}
      {relatedGames.length > 0 && (
        <div className="border-t border-zinc-800 bg-black/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-2xl font-bold text-white mb-2">
              Juegos <span className="text-gradient-green">Similares</span>
            </h2>
            <p className="text-zinc-400 mb-8">Basado en tus preferencias</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedGames.map((relatedGame, index) => (
                <div 
                  key={relatedGame.id}
                  style={{ animationDelay: `${index * 100}ms` }}
                  className="animate-fade-in-up"
                >
                  <GameCard 
                    game={relatedGame}
                    onClick={onGameClick}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
