import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLibrary } from '../context/LibraryContext';
import { getGameById, getGameSlug } from '../data/games';
import { Search, Clock, Star, CheckCircle, Play, ArrowUpDown, Grid, List, X, Calendar, Trophy, ArrowLeft, Trash2, BookOpen } from 'lucide-react';

type SortType = 'most-played' | 'recent' | 'a-z';
type FilterType = 'all' | 'completed' | 'in-progress' | 'favorites';

export const LibraryPage: React.FC = () => {
  const navigate = useNavigate();
  const { library, userProgress, toggleFavorite, markAsCompleted, removeFromLibrary } = useLibrary();
  const [sortBy, setSortBy] = useState<SortType>('most-played');
  const [filterBy, setFilterBy] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedGame, setSelectedGame] = useState<number | null>(null);

  const filteredAndSortedLibrary = useMemo(() => {
    let result = [...library];

    if (searchQuery) {
      result = result.filter(item => {
        const game = getGameById(item.gameId);
        return game?.title.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }

    if (filterBy === 'completed') {
      result = result.filter(item => item.isCompleted);
    } else if (filterBy === 'in-progress') {
      result = result.filter(item => !item.isCompleted && item.playTime > 0);
    } else if (filterBy === 'favorites') {
      result = result.filter(item => item.isFavorite);
    }

    result.sort((a, b) => {
      if (sortBy === 'most-played') return b.playTime - a.playTime;
      if (sortBy === 'recent') return b.addedAt - a.addedAt;
      if (sortBy === 'a-z') {
        const gameA = getGameById(a.gameId);
        const gameB = getGameById(b.gameId);
        return (gameA?.title || '').localeCompare(gameB?.title || '');
      }
      return 0;
    });

    return result;
  }, [library, searchQuery, sortBy, filterBy]);

  const formatPlayTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const totals = useMemo(() => {
    return {
      unlocked: library.reduce((t, i) => t + i.achievements.filter(a => a.unlocked).length, 0),
      total: library.reduce((t, i) => t + i.achievements.length, 0)
    };
  }, [library]);

  if (library.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0f0d] text-white pt-24 pb-12">
        <div className="container mx-auto px-4 text-center">
          <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
            <BookOpen size={48} className="text-emerald-500" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Tu Biblioteca está Vacía</h1>
          <p className="text-gray-400 max-w-md mx-auto mb-8">Parece que aún no has jugado a nada. ¡Explora nuestra colección y empieza tu aventura!</p>
          <button onClick={() => navigate('/')} className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-black font-bold px-8 py-4 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/20">
            <ArrowLeft size={20} />
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f0d] text-white pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Navigation & Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <button onClick={() => navigate('/')} className="inline-flex items-center gap-2 text-emerald-500 hover:text-emerald-400 transition-colors mb-4 group">
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span>Volver a la tienda</span>
            </button>
            <h1 className="text-5xl font-black tracking-tighter uppercase italic flex items-center gap-4">
              Biblioteca
              <span className="text-xl not-italic font-medium text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                {library.length}
              </span>
            </h1>
          </div>

          {/* Stats Bar Integrated */}
          <div className="flex flex-wrap gap-4">
            <div className="bg-[#111814] border border-white/5 rounded-2xl px-6 py-4 flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-xl">
                <Clock size={24} className="text-emerald-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Tiempo Total</p>
                <p className="text-xl font-black">{formatPlayTime(userProgress.totalPlayTime)}</p>
              </div>
            </div>
            <div className="bg-[#111814] border border-white/5 rounded-2xl px-6 py-4 flex items-center gap-4">
              <div className="p-3 bg-amber-500/10 rounded-xl">
                <Trophy size={24} className="text-amber-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Logros</p>
                <p className="text-xl font-black">{totals.unlocked} / {totals.total}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-[#111814] border border-white/5 rounded-3xl p-6 mb-10 shadow-2xl">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" />
              <input
                type="text"
                placeholder="BUSCAR EN TUS JUEGOS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all uppercase font-bold text-sm tracking-widest"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              {[
                { id: 'all', label: 'Todos', icon: List },
                { id: 'in-progress', label: 'Jugando', icon: Play },
                { id: 'completed', label: 'Terminados', icon: CheckCircle },
                { id: 'favorites', label: 'Favoritos', icon: Star }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilterBy(f.id as FilterType)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all border ${
                    filterBy === f.id 
                    ? 'bg-emerald-500 text-black border-emerald-500 shadow-lg shadow-emerald-500/20 scale-105' 
                    : 'bg-black/40 text-gray-400 border-white/10 hover:border-emerald-500/50 hover:text-emerald-500'
                  }`}
                >
                  <f.icon size={16} />
                  {f.label}
                </button>
              ))}
            </div>

            <div className="h-10 w-[1px] bg-white/5 hidden lg:block" />

            {/* Sort & View */}
            <div className="flex items-center gap-4 w-full lg:w-auto">
              <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-2xl px-4 py-2 flex-1 lg:flex-none">
                <ArrowUpDown size={18} className="text-emerald-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortType)}
                  className="bg-transparent text-white font-bold text-xs uppercase tracking-widest focus:outline-none appearance-none pr-8 cursor-pointer"
                >
                  <option value="most-played">Más Jugado</option>
                  <option value="recent">Reciente</option>
                  <option value="a-z">A-Z</option>
                </select>
              </div>

              <div className="flex p-1 bg-black/40 border border-white/10 rounded-xl">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-emerald-500 text-black' : 'text-gray-500 hover:text-emerald-500'}`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-emerald-500 text-black' : 'text-gray-500 hover:text-emerald-500'}`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {filteredAndSortedLibrary.length === 0 ? (
          <div className="text-center py-24 bg-[#111814] border border-white/5 rounded-3xl border-dashed">
            <Search size={64} className="mx-auto text-gray-700 mb-6" />
            <h3 className="text-2xl font-bold mb-2">Sin resultados</h3>
            <p className="text-gray-500 uppercase tracking-widest text-sm">No encontramos ningún juego que coincida</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8' : 'space-y-4'}>
            {filteredAndSortedLibrary.map((item) => {
              const game = getGameById(item.gameId);
              if (!game) return null;
              const unlocked = item.achievements.filter(a => a.unlocked).length;
              const progress = (unlocked / item.achievements.length) * 100;

              return viewMode === 'grid' ? (
                <div key={item.gameId} className="group relative flex flex-col bg-[#111814] border border-white/5 rounded-2xl overflow-hidden hover:border-emerald-500/30 transition-all duration-500 hover:translate-y-[-4px]">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img src={game.image} alt={game.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111814] via-transparent to-transparent opacity-60" />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                      <button onClick={() => setSelectedGame(item.gameId)} className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform">
                        <List size={20} />
                      </button>
                      <button onClick={() => navigate(`/jugar/${getGameSlug(game)}`)} className="p-4 bg-emerald-500 text-black rounded-full hover:scale-110 transition-transform">
                        <Play size={24} fill="currentColor" />
                      </button>
                    </div>

                    {item.isFavorite && <div className="absolute top-3 left-3 bg-amber-500 text-black p-1.5 rounded-lg shadow-lg"><Star size={14} fill="currentColor" /></div>}
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-black text-lg leading-none uppercase italic group-hover:text-emerald-500 transition-colors truncate">{game.title}</h3>
                      <button onClick={(e) => { e.stopPropagation(); toggleFavorite(item.gameId); }} className={`${item.isFavorite ? 'text-amber-500' : 'text-gray-600 hover:text-amber-500'} transition-colors`}>
                        <Star size={18} fill={item.isFavorite ? 'currentColor' : 'none'} />
                      </button>
                    </div>

                    <div className="mt-auto space-y-4">
                      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <Clock size={12} className="text-emerald-500" />
                          {formatPlayTime(item.playTime)}
                        </div>
                        <div className="text-emerald-500">
                          {unlocked}/{item.achievements.length} LOGROS
                        </div>
                      </div>

                      <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-1000"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div key={item.gameId} className="flex flex-col md:flex-row items-center gap-6 bg-[#111814] border border-white/5 p-4 rounded-2xl hover:border-emerald-500/30 transition-all group">
                  <div className="relative w-full md:w-48 aspect-[16/9] rounded-xl overflow-hidden shrink-0">
                    <img src={game.image} alt={game.title} className="w-full h-full object-cover" />
                    <button onClick={() => navigate(`/jugar/${getGameSlug(game)}`)} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Play size={32} fill="currentColor" className="text-emerald-500" />
                    </button>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-black uppercase italic mb-1 group-hover:text-emerald-500 transition-colors">{game.title}</h3>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs font-bold uppercase tracking-widest text-gray-500">
                      <span className="flex items-center gap-1.5"><Clock size={14} className="text-emerald-500" />{formatPlayTime(item.playTime)}</span>
                      <span className="flex items-center gap-1.5"><Trophy size={14} className="text-amber-500" />{unlocked} de {item.achievements.length} logros</span>
                      <span className="flex items-center gap-1.5"><Calendar size={14} className="text-gray-400" />{formatDate(item.addedAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <button onClick={() => setSelectedGame(item.gameId)} className="flex-1 md:flex-none p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                      <List size={20} />
                    </button>
                    <button onClick={() => navigate(`/jugar/${getGameSlug(game)}`)} className="flex-1 md:flex-none bg-emerald-500 hover:bg-emerald-600 text-black font-black px-8 py-4 rounded-xl transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2">
                      <Play size={16} fill="currentColor" />
                      Jugar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Improved Modal Detail (Steam style) */}
        {selectedGame !== null && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[60] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
            <div className="bg-[#111814] rounded-[2rem] max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-white/10 shadow-[0_0_50px_rgba(16,185,129,0.1)] relative">
              {(() => {
                const game = getGameById(selectedGame);
                const lib = library.find(i => i.gameId === selectedGame);
                if (!game || !lib) return null;
                const unlocked = lib.achievements.filter(a => a.unlocked).length;

                return (
                  <div className="flex flex-col">
                    {/* Modal Banner */}
                    <div className="relative h-80 md:h-[450px]">
                      <img src={game.image} alt={game.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111814] via-[#111814]/40 to-transparent" />
                      <button onClick={() => setSelectedGame(null)} className="absolute top-6 right-6 p-3 bg-black/40 hover:bg-black/60 rounded-full text-white transition-all hover:rotate-90">
                        <X size={24} />
                      </button>
                      <div className="absolute bottom-10 left-10 right-10">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                          <div>
                            <span className="inline-block bg-emerald-500 text-black font-black text-[10px] uppercase tracking-[0.2em] px-3 py-1 rounded-md mb-4">{game.category}</span>
                            <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-white mb-2">{game.title}</h2>
                            <div className="flex flex-wrap gap-6 text-sm font-bold uppercase tracking-widest text-gray-300">
                              <div className="flex items-center gap-2"><Clock size={18} className="text-emerald-500" /> {formatPlayTime(lib.playTime)} JUGADOS</div>
                              <div className="flex items-center gap-2"><Trophy size={18} className="text-amber-500" /> {unlocked} LOGROS</div>
                              <div className="flex items-center gap-2 text-gray-500"><Calendar size={18} /> AGREGADO EL {formatDate(lib.addedAt)}</div>
                            </div>
                          </div>
                          <button onClick={() => { setSelectedGame(null); navigate(`/jugar/${getGameSlug(game)}`); }} className="bg-emerald-500 hover:bg-emerald-600 text-black font-black px-10 py-5 rounded-2xl transition-all uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/20 hover:scale-105 active:scale-95">
                            <Play size={20} fill="currentColor" />
                            Iniciar Juego
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="p-10 grid grid-cols-1 lg:grid-cols-3 gap-12">
                      <div className="lg:col-span-2 space-y-12">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          <div className="bg-black/20 border border-white/5 rounded-2xl p-6 text-center">
                            <p className="text-3xl font-black text-emerald-500 mb-1">{lib.sessionsCount}</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Sesiones (+10m)</p>
                          </div>
                          <div className="bg-black/20 border border-white/5 rounded-2xl p-6 text-center">
                            <p className="text-3xl font-black text-amber-500 mb-1">{unlocked}</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Logros Obtenidos</p>
                          </div>
                          <div className="bg-black/20 border border-white/5 rounded-2xl p-6 text-center">
                            <p className="text-3xl font-black text-white mb-1">{lib.isCompleted ? 'SÍ' : 'NO'}</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Completado</p>
                          </div>
                        </div>

                        {/* Achievements Grid */}
                        <div>
                          <h3 className="text-2xl font-black uppercase italic mb-6 flex items-center gap-3">
                            <Trophy size={24} className="text-amber-500" />
                            Logros del Juego
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {lib.achievements.map((ach) => (
                              <div key={ach.id} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${ach.unlocked ? 'bg-emerald-500/10 border-emerald-500/30 shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]' : 'bg-black/20 border-white/5 opacity-50 grayscale'}`}>
                                <div className="text-4xl bg-black/40 w-16 h-16 rounded-xl flex items-center justify-center shrink-0 border border-white/10">{ach.icon}</div>
                                <div>
                                  <h4 className="font-black uppercase italic text-sm mb-1">{ach.name}</h4>
                                  <p className="text-xs text-gray-400 font-medium leading-tight mb-2">{ach.description}</p>
                                  {ach.unlocked && <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">{formatDate(ach.unlockedAt!)}</span>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Sidebar */}
                      <div className="space-y-8">
                        <div>
                          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 mb-4">Información</h4>
                          <div className="bg-black/20 border border-white/5 rounded-2xl p-6 space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-gray-500">CATEGORÍA</span>
                              <span className="text-xs font-black text-white">{game.category}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-gray-500">FECHA AGREGADO</span>
                              <span className="text-xs font-black text-white">{formatDate(lib.addedAt)}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 mb-4">Gestión</h4>
                          <div className="space-y-3">
                            <button onClick={() => toggleFavorite(selectedGame)} className={`w-full p-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 border ${lib.isFavorite ? 'bg-amber-500 text-black border-amber-500' : 'bg-black/20 text-gray-400 border-white/10 hover:border-amber-500/50 hover:text-amber-500'}`}>
                              <Star size={16} fill={lib.isFavorite ? 'currentColor' : 'none'} />
                              {lib.isFavorite ? 'En Favoritos' : 'Añadir a Favoritos'}
                            </button>
                            <button onClick={() => markAsCompleted(selectedGame)} className={`w-full p-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 border ${lib.isCompleted ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30' : 'bg-black/20 text-gray-400 border-white/10 hover:border-emerald-500/50'}`}>
                              <CheckCircle size={16} />
                              {lib.isCompleted ? 'Completado' : 'Marcar Completado'}
                            </button>
                            <button onClick={() => { if(confirm('¿Seguro que quieres eliminar este juego de tu biblioteca? Perderás el progreso.')) { removeFromLibrary(selectedGame); setSelectedGame(null); } }} className="w-full p-4 rounded-xl font-black text-xs uppercase tracking-widest text-red-500 border border-red-500/20 hover:bg-red-500/10 transition-all flex items-center justify-center gap-3">
                              <Trash2 size={16} />
                              Eliminar Juego
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
