import { BrowserRouter, Routes, Route, useParams, useNavigate, Navigate } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { CategoryBar } from './components/CategoryBar';
import { GameGrid } from './components/GameGrid';
import { GameCard } from './components/GameCard';
import { GameDetail } from './pages/GameDetail';
import { LibraryPage } from './pages/LibraryPage';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { LibraryProvider } from './context/LibraryContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { games, categories, getGamesByCategory, Game, getGameSlug, getGameBySlug } from './data/games';
import Profile from './pages/Profile';
import { Gamepad2, Sparkles, Trophy, Users, Zap, ChevronRight, Star } from 'lucide-react';

// Componente para la página de inicio
function HomePage({ 
  onGameClick 
}: { 
  onGameClick: (game: Game) => void 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [listPage, setListPage] = useState(1);
  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 16;

  const filteredGames = useMemo(() => {
    let result = games;
    
    if (currentPage === 'popular') {
      result = result.filter(g => g.rating >= 4.6).sort((a, b) => b.rating - a.rating);
    } else if (currentPage === 'new') {
      result = result.filter(g => parseInt(g.plays.replace(/[^0-9]/g, '')) < 15);
    } else if (currentPage === 'multiplayer') {
      result = result.filter(g => g.category === 'io' || g.tags.includes('multijugador'));
    } else if (selectedCategory !== 'all') {
      result = getGamesByCategory(selectedCategory);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(game => 
        game.title.toLowerCase().includes(query) ||
        game.description.toLowerCase().includes(query) ||
        game.category.toLowerCase().includes(query) ||
        game.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    return result;
  }, [searchQuery, selectedCategory, currentPage]);

  const featuredGames = useMemo(() => {
    return games.filter(g => g.rating >= 4.7 && g.url).slice(0, 3);
  }, []);

  const hotGames = useMemo(() => {
    return games.filter(g => g.rating >= 4.7).slice(0, 8);
  }, []);

  const newGames = useMemo(() => {
    return games.filter(g => parseInt(g.plays.replace(/[^0-9]/g, '')) < 15).slice(0, 4);
  }, []);

  useEffect(() => {
    setListPage(1);
  }, [currentPage, selectedCategory, searchQuery]);

  const shouldPaginateMenus = !searchQuery && ['categories', 'popular', 'new', 'multiplayer'].includes(currentPage);
  const totalPages = Math.max(1, Math.ceil(filteredGames.length / ITEMS_PER_PAGE));
  const paginatedGames = useMemo(() => {
    if (!shouldPaginateMenus) return filteredGames;
    const start = (listPage - 1) * ITEMS_PER_PAGE;
    return filteredGames.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredGames, listPage, shouldPaginateMenus]);

  const goToListPage = (nextPage: number) => {
    setListPage(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pageVisuals = {
    categories: {
      title: 'Catalogo por Categorias',
      subtitle: 'Explora estilos de juego, encuentra tus favoritos y descubre joyas ocultas.',
      accent: 'from-emerald-500/30 via-green-500/20 to-cyan-500/20',
      chip: 'Categorias Activas',
    },
    popular: {
      title: 'Juegos Populares',
      subtitle: 'Los juegos con mayor actividad y mejor valoracion de la comunidad.',
      accent: 'from-orange-500/30 via-red-500/20 to-pink-500/20',
      chip: 'Top de la Semana',
    },
    new: {
      title: 'Nuevos Lanzamientos',
      subtitle: 'Recien llegados al portal para que seas de los primeros en jugarlos.',
      accent: 'from-cyan-500/30 via-blue-500/20 to-indigo-500/20',
      chip: 'Recien Agregados',
    },
    multiplayer: {
      title: 'Multijugador Online',
      subtitle: 'Compite en tiempo real, sube de nivel y reta a jugadores de todo el mundo.',
      accent: 'from-violet-500/30 via-fuchsia-500/20 to-blue-500/20',
      chip: 'Juego Competitivo',
    },
  } as const;

  const handleNavigate = (page: 'home' | 'categories' | 'popular' | 'new' | 'multiplayer') => {
    setCurrentPage(page);
    setSelectedCategory('all');
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#050505] grid-pattern">
      <Header 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNavigate={handleNavigate}
        currentPage={currentPage}
      />

      {currentPage === 'home' && !searchQuery && (
        <section className="relative py-12 md:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-green-900/10 to-transparent" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full text-green-400 text-sm font-medium mb-6">
                  <Sparkles className="w-4 h-4" />
                  <span>+1000 Juegos Gratis</span>
                </div>
                
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
                  JUEGA{' '}
                  <span className="text-gradient-green">ONLINE</span>
                  <br />
                  SIN LÍMITES
                </h1>
                
                <p className="text-xl text-zinc-400 mb-8 max-w-lg mx-auto lg:mx-0">
                  Los mejores juegos .io y de navegador en un solo lugar. 
                  ¡Sin descargas, sin registro, juega ahora!
                </p>
                
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                  <button 
                    onClick={() => handleNavigate('popular')}
                    className="btn-cyber text-black font-bold px-8 py-4 rounded-xl flex items-center gap-2"
                  >
                    <Gamepad2 className="w-5 h-5" />
                    Explorar Juegos
                  </button>
                  <button 
                    onClick={() => handleNavigate('multiplayer')}
                    className="px-8 py-4 rounded-xl border border-zinc-700 text-white font-medium hover:bg-white/5 hover:border-green-500/50 transition-all flex items-center gap-2"
                  >
                    <Users className="w-5 h-5" />
                    Multijugador
                  </button>
                </div>

                <div className="flex flex-wrap gap-8 mt-12 justify-center lg:justify-start">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                      <Gamepad2 className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">{games.length}+</p>
                      <p className="text-sm text-zinc-500">Juegos</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                      <Users className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">500M+</p>
                      <p className="text-sm text-zinc-500">Jugadores</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                      <Star className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">4.8</p>
                      <p className="text-sm text-zinc-500">Rating</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="hidden lg:block">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-green-500/20 to-cyan-500/20 rounded-3xl blur-2xl" />
                  {featuredGames[0] && (
                    <div 
                      className="relative card-cyber rounded-2xl overflow-hidden cursor-pointer group"
                      onClick={() => navigate(`/game/${featuredGames[0].id}`)}
                    >
                      <div className="aspect-[16/10] relative">
                        <img 
                          src={featuredGames[0].image}
                          alt={featuredGames[0].title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                        
                        <div className="absolute top-4 left-4 flex gap-2">
                          <span className="px-3 py-1 bg-green-500 text-black text-xs font-bold rounded-full">
                            DESTACADO
                          </span>
                        </div>
                        
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <h3 className="text-3xl font-bold text-white mb-2">
                            {featuredGames[0].title}
                          </h3>
                          <p className="text-zinc-300 mb-4">{featuredGames[0].description}</p>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                              <span className="text-white font-bold text-lg">{featuredGames[0].rating}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-5 h-5 text-green-400" />
                              <span className="text-zinc-300">{featuredGames[0].plays}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {currentPage === 'categories' && (
        <div className="mx-4 sm:mx-6 lg:mx-8 mt-8">
          <div className="relative overflow-hidden rounded-3xl border border-green-500/20 bg-gradient-to-br from-zinc-900/90 to-black/90 p-5 md:p-7">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.15),transparent_45%)]" />
            <div className="relative flex flex-col gap-4 md:gap-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-green-400/80 mb-2">Navegacion Inteligente</p>
                  <h2 className="text-2xl md:text-3xl font-black text-white">Filtra por Categoria</h2>
                  <p className="text-zinc-400 mt-2 text-sm md:text-base">Selecciona una categoria para ver una lista curada y jugar al instante.</p>
                </div>
                <div className="hidden md:flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-green-300 text-sm font-semibold">
                  <Sparkles className="w-4 h-4" />
                  Recomendado
                </div>
              </div>

              <CategoryBar 
                activeCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {currentPage === 'home' && !searchQuery ? (
          <div className="space-y-24">
            {/* Populares - Estilo Horizontal con Hover Scale */}
            <section className="relative">
              <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500 to-transparent rounded-full hidden md:block" />
              <div className="flex items-center justify-between mb-8 pl-0 md:pl-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.3)] ring-1 ring-white/20">
                    <Zap className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-white tracking-tight">Juegos Populares</h2>
                    <p className="text-zinc-400 font-medium">Los más jugados esta semana</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleNavigate('popular')}
                  className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-orange-400 hover:bg-orange-500 hover:text-white transition-all duration-300"
                >
                  <span className="font-bold">Ver todos</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
                {hotGames.map((game) => (
                  <div key={game.id} className="transform hover:-translate-y-2 transition-transform duration-300">
                    <GameCard 
                      game={game}
                      onClick={onGameClick}
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Destacados - Diseño Premium Moderno */}
            {featuredGames.length > 0 && (
              <section className="relative py-12">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 via-pink-900/5 to-transparent rounded-[3rem] -z-10" />
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.3)] ring-1 ring-white/20">
                    <Trophy className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-white tracking-tight">Destacados</h2>
                    <p className="text-zinc-400 font-medium">Los mejores juegos seleccionados</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                  {featuredGames.map((game, index) => (
                    <div key={game.id} className={`relative group ${index === 0 ? 'md:col-span-1' : ''}`}>
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur opacity-20 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                      <GameCard 
                        game={game}
                        onClick={onGameClick}
                        featured
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Nuevos Lanzamientos - Grid con Efecto Glow */}
            <section className="relative">
              <div className="absolute -right-4 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 to-transparent rounded-full hidden md:block" />
              <div className="flex items-center justify-between mb-8 pr-0 md:pr-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.3)] ring-1 ring-white/20">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-white tracking-tight">Nuevos Lanzamientos</h2>
                    <p className="text-zinc-400 font-medium">Juegos añadidos recientemente</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleNavigate('new')}
                  className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-cyan-400 hover:bg-cyan-500 hover:text-white transition-all duration-300"
                >
                  <span className="font-bold">Ver todos</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              <GameGrid 
                games={newGames}
                onGameClick={onGameClick}
                columns={4}
              />
            </section>

            {/* Footer de Sección - Exploración Completa */}
            <section className="pt-12 border-t border-white/5">
              <div className="bg-gradient-to-br from-zinc-900 to-black p-8 md:p-12 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 blur-[100px] -mr-32 -mt-32 group-hover:bg-green-500/20 transition-colors duration-700" />
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div>
                    <h2 className="text-4xl font-black text-white mb-4">¿Buscas algo más?</h2>
                    <p className="text-xl text-zinc-400 max-w-xl">
                      Explora nuestro catálogo completo con cientos de títulos de todos los géneros.
                    </p>
                  </div>
                  <button 
                    onClick={() => handleNavigate('categories')}
                    className="btn-cyber text-black font-bold px-10 py-5 rounded-2xl flex items-center gap-3 text-lg shadow-[0_0_30px_rgba(34,197,94,0.3)]"
                  >
                    <Gamepad2 className="w-6 h-6" />
                    Ver Catálogo Completo
                  </button>
                </div>
              </div>
            </section>
          </div>
        ) : (
          <div className="space-y-8">
            {!searchQuery && currentPage !== 'home' && currentPage in pageVisuals && (
              <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/70 p-6 md:p-8">
                <div className={`absolute inset-0 bg-gradient-to-r ${pageVisuals[currentPage as keyof typeof pageVisuals].accent}`} />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:28px_28px] opacity-20" />

                <div className="relative grid md:grid-cols-[1fr_auto] gap-6 items-center">
                  <div>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-white/90 font-semibold">
                      <Zap className="w-3.5 h-3.5" />
                      {pageVisuals[currentPage as keyof typeof pageVisuals].chip}
                    </span>
                    <h2 className="mt-4 text-3xl md:text-4xl font-black text-white tracking-tight">
                      {pageVisuals[currentPage as keyof typeof pageVisuals].title}
                    </h2>
                    <p className="mt-2 text-zinc-200/90 max-w-3xl">
                      {pageVisuals[currentPage as keyof typeof pageVisuals].subtitle}
                    </p>
                  </div>

                  <div className="flex md:flex-col gap-3">
                    <div className="rounded-2xl bg-black/45 border border-white/10 px-5 py-3 min-w-[150px]">
                      <p className="text-zinc-400 text-xs uppercase tracking-widest">Resultados</p>
                      <p className="text-white text-2xl font-black">{filteredGames.length}</p>
                    </div>
                    <div className="rounded-2xl bg-black/45 border border-white/10 px-5 py-3 min-w-[150px]">
                      <p className="text-zinc-400 text-xs uppercase tracking-widest">Estado</p>
                      <p className="text-green-300 text-lg font-bold">Activo</p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            <GameGrid 
              games={paginatedGames}
              title={searchQuery 
                ? `Resultados para "${searchQuery}"`
                : currentPage === 'popular' 
                  ? 'Juegos Populares'
                  : currentPage === 'new'
                    ? 'Nuevos Lanzamientos'
                    : currentPage === 'multiplayer'
                      ? 'Multijugador Online'
                      : selectedCategory === 'all'
                        ? 'Todos los Juegos'
                        : categories.find(c => c.id === selectedCategory)?.name
              }
              subtitle={filteredGames.length > 0 
                ? shouldPaginateMenus
                  ? `${filteredGames.length} juegos encontrados - Pagina ${listPage} de ${totalPages}`
                  : `${filteredGames.length} juegos encontrados`
                : 'No se encontraron juegos'
              }
              onGameClick={onGameClick}
              columns={4}
            />

            {shouldPaginateMenus && totalPages > 1 && (
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => goToListPage(Math.max(1, listPage - 1))}
                  disabled={listPage === 1}
                  className="px-5 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Anterior
                </button>

                <span className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-300 text-sm font-semibold">
                  Pagina {listPage} / {totalPages}
                </span>

                <button
                  onClick={() => goToListPage(Math.min(totalPages, listPage + 1))}
                  disabled={listPage === totalPages}
                  className="px-5 py-2.5 rounded-xl border border-green-500/40 bg-green-500/10 text-green-300 hover:bg-green-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Siguiente pagina
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="border-t border-zinc-800/50 bg-black/50 backdrop-blur-sm mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <Gamepad2 className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-xl font-black text-white">
                  GAME<span className="text-green-500">.IO</span>
                </h3>
              </div>
              <p className="text-zinc-500 text-sm">
                La mejor colección de juegos .io y de navegador. 
                Juega gratis desde cualquier dispositivo.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Categorías</h4>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li><button onClick={() => {setSelectedCategory('io'); setCurrentPage('home');}} className="hover:text-green-400 transition-colors">Juegos .io</button></li>
                <li><button onClick={() => {setSelectedCategory('shooter'); setCurrentPage('home');}} className="hover:text-green-400 transition-colors">Disparos</button></li>
                <li><button onClick={() => {setSelectedCategory('racing'); setCurrentPage('home');}} className="hover:text-green-400 transition-colors">Carreras</button></li>
                <li><button onClick={() => {setSelectedCategory('puzzle'); setCurrentPage('home');}} className="hover:text-green-400 transition-colors">Puzzle</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Links</h4>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li><button onClick={() => handleNavigate('popular')} className="hover:text-green-400 transition-colors">Populares</button></li>
                <li><button onClick={() => handleNavigate('new')} className="hover:text-green-400 transition-colors">Nuevos</button></li>
                <li><button onClick={() => handleNavigate('multiplayer')} className="hover:text-green-400 transition-colors">Multijugador</button></li>
                <li><button onClick={() => navigate('/library')} className="hover:text-green-400 transition-colors">Biblioteca</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li><span className="hover:text-green-400 transition-colors cursor-pointer">Términos de Uso</span></li>
                <li><span className="hover:text-green-400 transition-colors cursor-pointer">Privacidad</span></li>
                <li><span className="hover:text-green-400 transition-colors cursor-pointer">Cookies</span></li>
                <li><span className="hover:text-green-400 transition-colors cursor-pointer">Contacto</span></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-zinc-600 text-sm">
              © 2025 Game.io - Todos los derechos reservados
            </p>
            <div className="flex items-center gap-4">
              <span className="text-zinc-600 text-sm">Hecho con</span>
              <span className="text-green-500">♥</span>
              <span className="text-zinc-600 text-sm">para gamers</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Componente wrapper para GameDetail que obtiene el ID de la URL
function GameDetailWrapper() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const game = slug ? getGameBySlug(slug) : null;

  if (!game) {
    return <Navigate to="/" replace />;
  }

  return (
    <GameDetail 
      game={game} 
      onBack={() => navigate(-1)}
      onGameClick={(g) => navigate(`/game/${getGameSlug(g)}`)}
    />
  );
}

// Componente principal App con Router
function App() {
  const navigate = useNavigate();

  const handleGameClick = (game: Game) => {
    navigate(`/jugar/${getGameSlug(game)}`);
  };

  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<HomePage onGameClick={handleGameClick} />} />
      <Route path="/jugar/:slug" element={<GameDetailWrapper />} />
      <Route 
        path="/library" 
        element={
          isAuthenticated ? <LibraryPage /> : <Navigate to="/login" replace />
        } 
      />
      <Route 
        path="/profile" 
        element={
          isAuthenticated ? <Profile /> : <Navigate to="/login" replace />
        } 
      />
    </Routes>
  );
}

// App envuelta en BrowserRouter y AuthProvider
function AppWithRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LibraryProvider>
          <App />
        </LibraryProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default AppWithRouter;
