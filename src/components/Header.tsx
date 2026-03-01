import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Gamepad2, Menu, X, Home, Grid3X3, Trophy, Users, Zap, BookOpen, LogOut, UserCircle, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNavigate: (page: 'home' | 'categories' | 'popular' | 'new' | 'multiplayer') => void;
  currentPage: string;
}

export function Header({ searchQuery, onSearchChange, onNavigate, currentPage }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'home', label: 'Inicio', icon: Home, router: false },
    { id: 'categories', label: 'Categorias', icon: Grid3X3, router: false },
    { id: 'popular', label: 'Populares', icon: Trophy, router: false },
    { id: 'new', label: 'Nuevos', icon: Zap, router: false },
    { id: 'multiplayer', label: 'Multijugador', icon: Users, router: false },
    { id: 'library', label: 'Biblioteca', icon: BookOpen, router: true, path: '/library' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-zinc-950/95 backdrop-blur-xl border-b border-green-500/20 shadow-lg shadow-black/50">
      {/* Main Header Row */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 md:h-20">

          {/* LEFT: Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
            onClick={() => navigate('/')}
          >
            <div className="relative">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20 group-hover:shadow-green-500/40 transition-shadow">
                <Gamepad2 className="w-6 h-6 md:w-7 md:h-7 text-black" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
                GAME<span className="text-green-500">.IO</span>
              </h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest -mt-1">Juegos Online</p>
            </div>
          </div>

          {/* CENTER: Search Bar */}
          <div className="flex-1 flex justify-center px-6 md:px-10 lg:px-16">
            <div className={`relative w-full max-w-lg transition-all duration-300 ${isSearchFocused ? 'max-w-xl' : ''}`}>
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                isSearchFocused ? 'text-green-400' : 'text-zinc-500'
              }`} />
              <input
                type="text"
                placeholder="Buscar juegos..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full pl-12 pr-4 py-2.5 bg-black/60 border border-zinc-700/80 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all hidden md:block"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white hidden md:block"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* RIGHT: Auth Buttons - Fixed to the right */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-800/80 border border-zinc-700/60 hover:border-green-500/40 hover:bg-zinc-800 transition-all group"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden shadow-md shadow-green-500/20">
                    <img 
                      src={user.profile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-semibold text-sm text-zinc-300 group-hover:text-white hidden sm:block max-w-[100px] truncate">{user.profile?.customName || user.name}</span>
                  <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform hidden sm:block ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-zinc-900 rounded-xl shadow-2xl border border-zinc-700/60 z-50 overflow-hidden animate-fade-in">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-zinc-800">
                      <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                      <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <button
                        onClick={() => {
                          navigate('/library');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors flex items-center gap-3"
                      >
                        <BookOpen className="w-4 h-4 text-green-500" />
                        Mi Biblioteca
                      </button>
                      <button
                        onClick={() => {
                          navigate('/profile');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors flex items-center gap-3"
                      >
                        <UserCircle className="w-4 h-4 text-blue-400" />
                        Mi Perfil
                      </button>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-zinc-800 py-1">
                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                          navigate('/');
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors flex items-center gap-3"
                      >
                        <LogOut className="w-4 h-4" />
                        Cerrar Sesion
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => navigate('/login')}
                  className="px-5 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700/60 hover:bg-zinc-700 hover:border-zinc-600 text-white text-xs font-bold uppercase tracking-wider transition-all"
                >
                  Iniciar Sesion
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-black text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-green-500/20 hover:shadow-green-500/40"
                >
                  Registrarse
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors ml-2"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Bar - Second Row */}
      <div className="hidden lg:block border-t border-zinc-800/60 bg-zinc-950/50">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.router
                ? location.pathname === item.path
                : currentPage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.router && item.path) {
                      navigate(item.path);
                    } else {
                      onNavigate(item.id as 'home' | 'categories' | 'popular' | 'new' | 'multiplayer');
                    }
                  }}
                  className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border border-green-500/40 shadow-[0_0_16px_rgba(34,197,94,0.18)]'
                      : 'text-zinc-400 border border-transparent hover:text-white hover:bg-white/5 hover:border-zinc-700/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                  {isActive && <span className="absolute left-3 right-3 -bottom-1 h-0.5 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full" />}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-zinc-950/98 backdrop-blur-xl border-t border-zinc-800/60 animate-fade-in">
          <div className="px-4 py-4 space-y-4">
            {/* Mobile Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="text"
                placeholder="Buscar juegos..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-black/60 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-green-500/50"
              />
            </div>

            {/* Mobile Nav Items */}
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.router
                  ? location.pathname === item.path
                  : currentPage === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.router && item.path) {
                        navigate(item.path);
                      } else {
                        onNavigate(item.id as 'home' | 'categories' | 'popular' | 'new' | 'multiplayer');
                      }
                      setIsMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Mobile Auth Buttons */}
            {!user && (
              <div className="flex gap-2 pt-2 border-t border-zinc-800">
                <button
                  onClick={() => {
                    navigate('/login');
                    setIsMenuOpen(false);
                  }}
                  className="flex-1 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-sm font-bold uppercase tracking-wider hover:bg-zinc-700 transition-all"
                >
                  Iniciar Sesion
                </button>
                <button
                  onClick={() => {
                    navigate('/register');
                    setIsMenuOpen(false);
                  }}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-black text-sm font-bold uppercase tracking-wider hover:from-green-400 hover:to-emerald-500 transition-all"
                >
                  Registrarse
                </button>
              </div>
            )}

            {/* Mobile User Info */}
            {user && (
              <div className="pt-2 border-t border-zinc-800 space-y-2">
                <div className="flex items-center gap-3 px-2 py-2">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img 
                      src={user.profile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{user.profile?.customName || user.name}</p>
                    <p className="text-xs text-zinc-500">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                    navigate('/');
                  }}
                  className="w-full py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold uppercase tracking-wider hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar Sesion
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
