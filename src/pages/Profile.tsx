import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLibrary } from '../context/LibraryContext';
import { Link } from 'react-router-dom';
import { getGameSlug } from '../data/games';
import { Trophy, Gamepad2, Clock, Edit2, Image as ImageIcon, Palette, X, Check, Star, TrendingUp, ArrowLeft, Medal, Sparkles } from 'lucide-react';
import { games as allGames } from '../data/games';

const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { library } = useLibrary();
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user?.profile.customName || '');
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [selectedAchievements, setSelectedAchievements] = useState<string[]>(user?.profile.showcaseAchievements || []);

  useEffect(() => {
    if (user) {
      setNameInput(user.profile.customName || user.name);
      setSelectedAchievements(user.profile.showcaseAchievements || []);
    }
  }, [user]);

  if (!user) return null;

  const handleSaveName = () => {
    if (nameInput.trim()) {
      updateProfile({ customName: nameInput.trim() });
      setEditingName(false);
    }
  };

  const handleAvatarSelect = (avatarUrl: string) => {
    updateProfile({ avatar: avatarUrl });
    setShowAvatarModal(false);
  };

  const handleBannerSelect = (bannerColor: string) => {
    updateProfile({ bannerColor });
    setShowBannerModal(false);
  };

  const handleAchievementToggle = (achievementId: string) => {
    const newSelection = selectedAchievements.includes(achievementId)
      ? selectedAchievements.filter(id => id !== achievementId)
      : [...selectedAchievements, achievementId].slice(0, 3);
    setSelectedAchievements(newSelection);
    updateProfile({ showcaseAchievements: newSelection });
  };

  const handleSaveAchievements = () => {
    updateProfile({ showcaseAchievements: selectedAchievements });
    setShowAchievementModal(false);
  };

  const recentGames = library
    ? Object.entries(
        library.reduce((acc: Record<string, any>, game) => {
          acc[game.gameId] = game;
          return acc;
        }, {})
      )
        .sort(([, a]: any, [, b]: any) => b.addedAt - a.addedAt)
        .slice(0, 4)
        .map(([gameId, game]: any) => {
          const gameData = allGames.find(g => g.id === parseInt(gameId));
          return gameData ? { ...gameData, playTime: game.playTime } : null;
        })
        .filter(Boolean)
    : [];

  const totalTime = library
    ? library.reduce((sum, game) => sum + game.playTime, 0)
    : 0;

  const allAchievements = [
    { id: 'first_game', title: 'Primer Juego', description: 'Juega tu primer juego', icon: '🎮' },
    { id: 'ten-minutes', title: '10 Minutos', description: 'Juega 10 minutos en un juego', icon: '🕐' },
    { id: 'one-hour', title: '1 Hora', description: 'Juega 1 hora en total', icon: '⏰' },
    { id: 'ten-hours', title: '10 Horas', description: 'Juega 10 horas en total', icon: '🔥' },
    { id: 'five-consecutive-days', title: '5 Días', description: 'Juega 5 días seguidos', icon: '📅' },
    { id: 'three-games', title: '3 Juegos', description: 'Prueba 3 juegos distintos', icon: '🎯' },
    { id: 'five-favorites', title: '5 Favoritos', description: 'Marca 5 juegos como favoritos', icon: '⭐' },
    { id: 'ten-times-same-game', title: '10 Partidas', description: 'Juega el mismo juego 10 veces', icon: '🔁' }
  ];

  const unlockedAchievements = allAchievements.filter(a => {
    return library.some((game: any) => 
      game.achievements?.some((ach: any) => ach.id === a.id && ach.unlocked)
    );
  });

  const displayedAchievements = selectedAchievements.length > 0
    ? allAchievements.filter(a => selectedAchievements.includes(a.id))
    : unlockedAchievements.slice(0, 3);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-[#060a06] text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(34,197,94,0.14),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(16,185,129,0.10),transparent_30%),radial-gradient(circle_at_50%_90%,rgba(74,222,128,0.08),transparent_26%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 pt-6 relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl border border-green-500/40 bg-black/50 px-4 py-2 text-sm font-semibold text-green-300 hover:bg-green-500/10 transition-all"
          >
            <ArrowLeft size={16} />
            Volver al inicio
          </Link>
          <Link
            to="/library"
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900/70 px-4 py-2 text-sm text-zinc-200 hover:border-green-500/50 transition-all"
          >
            <Gamepad2 size={16} />
            Ir a biblioteca
          </Link>
        </div>
      </div>

      <div 
        className="relative h-56 md:h-72 w-full bg-cover bg-center border-y border-green-500/20"
        style={{ background: user.profile.bannerColor }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#060a06] via-black/35 to-transparent" />
        <button
          onClick={() => setShowBannerModal(true)}
          className="absolute top-5 right-5 bg-black/55 hover:bg-black/75 text-white p-2.5 rounded-xl transition-all border border-green-500/30"
        >
          <Palette size={18} />
        </button>

        <div className="max-w-6xl mx-auto px-4 h-full flex items-end pb-6 relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-black/55 border border-green-500/40 px-3 py-1.5 text-xs tracking-wide text-green-300 uppercase">
            <Sparkles size={14} />
            Perfil Gamer
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-16 relative">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-6 mb-8 bg-black/45 border border-green-500/25 backdrop-blur-md rounded-2xl p-5 md:p-6 shadow-[0_8px_40px_rgba(0,0,0,0.45)]">
          <div className="relative">
            <img
              src={user.profile.avatar}
              alt="Avatar"
              className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-green-500 shadow-lg shadow-green-500/50 object-cover"
            />
            <button
              onClick={() => setShowAvatarModal(true)}
              className="absolute bottom-0 right-0 bg-green-500 hover:bg-green-600 text-black p-2.5 rounded-full transition-all"
            >
              <ImageIcon size={16} />
            </button>
          </div>

          <div className="flex-1 mt-4 md:mt-0">
            {editingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="bg-gray-800 border border-green-500 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  autoFocus
                />
                <button
                  onClick={handleSaveName}
                  className="bg-green-500 hover:bg-green-600 text-black p-2 rounded-lg"
                >
                  <Check size={20} />
                </button>
                <button
                  onClick={() => {
                    setEditingName(false);
                    setNameInput(user.profile.customName || user.name);
                  }}
                  className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <h1 className="text-3xl md:text-4xl font-black text-green-400">
                  {user.profile.customName || user.name}
                </h1>
                <button
                  onClick={() => setEditingName(true)}
                  className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-lg transition-all"
                >
                  <Edit2 size={18} />
                </button>
              </div>
            )}
            <p className="text-gray-400 mt-1">{user.email}</p>
            <p className="text-gray-500 text-sm mt-1">
              Miembro desde {new Date(user.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-gradient-to-b from-zinc-900/95 to-zinc-900/50 backdrop-blur-sm border border-green-500/30 rounded-xl p-4 text-center">
            <Clock className="mx-auto mb-2 text-green-400" size={24} />
            <p className="text-2xl font-bold text-white">{formatTime(totalTime)}</p>
            <p className="text-gray-400 text-sm">Tiempo Total</p>
          </div>
          <div className="bg-gradient-to-b from-zinc-900/95 to-zinc-900/50 backdrop-blur-sm border border-green-500/30 rounded-xl p-4 text-center">
            <Gamepad2 className="mx-auto mb-2 text-green-400" size={24} />
            <p className="text-2xl font-bold text-white">{library.length}</p>
            <p className="text-gray-400 text-sm">Juegos en Biblioteca</p>
          </div>
          <div className="bg-gradient-to-b from-zinc-900/95 to-zinc-900/50 backdrop-blur-sm border border-green-500/30 rounded-xl p-4 text-center">
            <Trophy className="mx-auto mb-2 text-green-400" size={24} />
            <p className="text-2xl font-bold text-white">{unlockedAchievements.length}</p>
            <p className="text-gray-400 text-sm">Logros Desbloqueados</p>
          </div>
          <div className="bg-gradient-to-b from-zinc-900/95 to-zinc-900/50 backdrop-blur-sm border border-green-500/30 rounded-xl p-4 text-center">
            <Star className="mx-auto mb-2 text-green-400" size={24} />
            <p className="text-2xl font-bold text-white">{library.filter((g: any) => g.isFavorite).length}</p>
            <p className="text-gray-400 text-sm">Favoritos</p>
          </div>
          <div className="bg-gradient-to-b from-zinc-900/95 to-zinc-900/50 backdrop-blur-sm border border-green-500/30 rounded-xl p-4 text-center">
            <TrendingUp className="mx-auto mb-2 text-green-400" size={24} />
            <p className="text-2xl font-bold text-white">{library.filter((g: any) => g.isCompleted).length}</p>
            <p className="text-gray-400 text-sm">Completados</p>
          </div>
        </div>

        <div className="bg-zinc-900/70 backdrop-blur-sm border border-green-500/30 rounded-xl p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-green-400 flex items-center gap-2">
              <Medal size={24} />
              Vitrina de Logros
            </h2>
            <button
              onClick={() => setShowAchievementModal(true)}
              className="bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded-lg transition-all"
            >
              Personalizar
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {displayedAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className="bg-zinc-950/70 border border-green-500/30 rounded-xl p-4 text-center hover:border-green-500 transition-all"
              >
                <div className="text-5xl mb-2">{achievement.icon}</div>
                <h3 className="font-bold text-green-400">{achievement.title}</h3>
                <p className="text-gray-400 text-sm">{achievement.description}</p>
              </div>
            ))}
            {displayedAchievements.length === 0 && (
              <p className="text-gray-500 col-span-3 text-center py-4">
                Aún no has desbloqueado logros. ¡Juega para desbloquearlos!
              </p>
            )}
          </div>
        </div>

        <div className="bg-zinc-900/70 backdrop-blur-sm border border-green-500/30 rounded-xl p-6 mb-10">
          <h2 className="text-2xl font-bold text-green-400 mb-4 flex items-center gap-2">
            <Gamepad2 size={24} />
            Juegos Recientes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {recentGames.map((game: any) => (
              <Link
                key={game.id}
                to={`/jugar/${getGameSlug(game)}`}
                className="bg-zinc-950/75 border border-green-500/30 rounded-xl overflow-hidden hover:border-green-500 transition-all group"
              >
                <img
                  src={game.image}
                  alt={game.title}
                  className="w-full h-32 object-cover group-hover:scale-110 transition-transform"
                />
                <div className="p-3">
                  <h3 className="font-bold text-white truncate">{game.title}</h3>
                  <div className="flex items-center gap-1 text-gray-400 text-sm mt-1">
                    <Clock size={14} />
                    <span>{formatTime(game.playTime)}</span>
                  </div>
                </div>
              </Link>
            ))}
            {recentGames.length === 0 && (
              <p className="text-gray-500 col-span-4 text-center py-4">
                Aún no has jugado a ningún juego. ¡Empieza tu colección!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Avatares */}
      {showAvatarModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-green-500 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-green-400">Seleccionar Avatar</h2>
              <button
                onClick={() => setShowAvatarModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zack', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Milo', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Oscar', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Iris'].map((avatar, index) => (
                <button
                  key={index}
                  onClick={() => handleAvatarSelect(avatar)}
                  className={`bg-gray-800 border-2 rounded-xl p-4 hover:border-green-500 transition-all ${user.profile.avatar === avatar ? 'border-green-500' : 'border-transparent'}`}
                >
                  <img src={avatar} alt={`Avatar ${index + 1}`} className="w-full h-24 object-contain" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Banners */}
      {showBannerModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-green-500 rounded-xl p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-green-400">Seleccionar Banner</h2>
              <button
                onClick={() => setShowBannerModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {['linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)', 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)', 'linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)', 'linear-gradient(135deg, #1a1a2e 0%, #e94560 100%)'].map((banner, index) => (
                <button
                  key={index}
                  onClick={() => handleBannerSelect(banner)}
                  className={`h-24 rounded-xl border-2 transition-all ${user.profile.bannerColor === banner ? 'border-green-500 scale-105' : 'border-transparent hover:scale-105'}`}
                  style={{ background: banner }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Logros */}
      {showAchievementModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-green-500 rounded-xl p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-green-400">Seleccionar Logros Destacados (máx. 3)</h2>
              <button
                onClick={() => setShowAchievementModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              {allAchievements.map((achievement) => {
                const isUnlocked = unlockedAchievements.some(a => a.id === achievement.id);
                return (
                  <button
                    key={achievement.id}
                    onClick={() => handleAchievementToggle(achievement.id)}
                    className={`bg-gray-800 border-2 rounded-xl p-4 text-left transition-all ${selectedAchievements.includes(achievement.id) ? 'border-green-500 bg-green-500/10' : 'border-gray-700 hover:border-green-500/50'} ${!isUnlocked ? 'opacity-50' : ''}`}
                    disabled={!isUnlocked}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{achievement.icon}</span>
                      <div>
                        <h3 className="font-bold text-white">{achievement.title}</h3>
                        <p className="text-gray-400 text-sm">{achievement.description}</p>
                      </div>
                      {selectedAchievements.includes(achievement.id) && (
                        <Check className="ml-auto text-green-500" size={20} />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            <button
              onClick={handleSaveAchievements}
              className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-3 rounded-xl transition-all"
            >
              Guardar Selección
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
