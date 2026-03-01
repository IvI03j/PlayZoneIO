import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface GameAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
  progress?: number;
  target?: number;
}

interface GameInLibrary {
  gameId: number;
  addedAt: number;
  playTime: number; // en segundos
  sessionsCount: number;
  achievements: GameAchievement[];
  isFavorite: boolean;
  isCompleted: boolean;
}

interface UserProgress {
  totalPlayTime: number;
  gamesPlayed: number;
  favoriteGames: number;
  consecutiveDays: number;
  lastPlayDate: string | null;
  todayPlayTime: number;
}

interface LibraryContextType {
  library: GameInLibrary[];
  userProgress: UserProgress;
  addToLibrary: (gameId: number) => void;
  removeFromLibrary: (gameId: number) => void;
  toggleFavorite: (gameId: number) => void;
  markAsCompleted: (gameId: number) => void;
  startGameSession: (gameId: number) => () => void;
  getGameInLibrary: (gameId: number) => GameInLibrary | undefined;
  unlockAchievement: (gameId: number, achievementId: string) => void;
  updateGameAchievements: (gameId: number) => void;
  updateUserAchievements: () => void;
}

const ACHIEVEMENTS = {
  TEN_MINUTES: {
    id: 'ten-minutes',
    name: 'Principiante',
    description: 'Jugar 10 minutos',
    icon: '🕐',
    target: 600 // 10 minutos en segundos
  },
  ONE_HOUR: {
    id: 'one-hour',
    name: 'Enthusiasta',
    description: 'Jugar 1 hora',
    icon: '🕐',
    target: 3600 // 1 hora
  },
  TEN_HOURS: {
    id: 'ten-hours',
    name: 'Adicto',
    description: 'Jugar 10 horas',
    icon: '🕐',
    target: 36000 // 10 horas
  },
  FIVE_CONSECUTIVE_DAYS: {
    id: 'five-consecutive-days',
    name: 'Fiel',
    description: 'Jugar 5 días seguidos',
    icon: '🔥',
    target: 5
  },
  THREE_GAMES: {
    id: 'three-games',
    name: 'Explorador',
    description: 'Probar 3 juegos distintos',
    icon: '🎮',
    target: 3
  },
  FIVE_FAVORITES: {
    id: 'five-favorites',
    name: 'Coleccionista',
    description: 'Marcar 5 juegos como favoritos',
    icon: '⭐',
    target: 5
  },
  TEN_TIMES_SAME_GAME: {
    id: 'ten-times-same-game',
    name: 'Fiel Fan',
    description: 'Jugar el mismo juego 10 veces',
    icon: '🔁',
    target: 10
  },
  SEVEN_CONSECUTIVE_DAYS: {
    id: 'seven-consecutive-days',
    name: 'Super Usuario',
    description: 'Entrar 7 días seguidos',
    icon: '📅',
    target: 7
  }
};

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const LibraryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [library, setLibrary] = useState<GameInLibrary[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gameLibrary');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('userProgress');
      return saved ? JSON.parse(saved) : {
        totalPlayTime: 0,
        gamesPlayed: 0,
        favoriteGames: 0,
        consecutiveDays: 0,
        lastPlayDate: null,
        todayPlayTime: 0
      };
    }
    return {
      totalPlayTime: 0,
      gamesPlayed: 0,
      favoriteGames: 0,
      consecutiveDays: 0,
      lastPlayDate: null,
      todayPlayTime: 0
    };
  });

  useEffect(() => {
    localStorage.setItem('gameLibrary', JSON.stringify(library));
  }, [library]);

  useEffect(() => {
    localStorage.setItem('userProgress', JSON.stringify(userProgress));
  }, [userProgress]);

  // Update consecutive days when user plays
  useEffect(() => {
    const today = new Date().toDateString();
    if (userProgress.lastPlayDate && userProgress.lastPlayDate !== today) {
      const lastDate = new Date(userProgress.lastPlayDate);
      const currentDate = new Date(today);
      const diffTime = currentDate.getTime() - lastDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        setUserProgress(prev => ({
          ...prev,
          consecutiveDays: prev.consecutiveDays + 1,
          lastPlayDate: today
        }));
      } else if (diffDays > 1) {
        setUserProgress(prev => ({
          ...prev,
          consecutiveDays: 1,
          lastPlayDate: today
        }));
      }
    }
  }, [userProgress.totalPlayTime]);

  const createInitialAchievements = (): GameAchievement[] => {
    return Object.values(ACHIEVEMENTS).map(ach => ({
      ...ach,
      unlocked: false,
      progress: 0
    }));
  };

  const addToLibrary = (gameId: number) => {
    const existing = library.find(g => g.gameId === gameId);
    if (existing) return;

    const newGame: GameInLibrary = {
      gameId,
      addedAt: Date.now(),
      playTime: 0,
      sessionsCount: 0,
      achievements: createInitialAchievements(),
      isFavorite: false,
      isCompleted: false
    };

    setLibrary(prev => [...prev, newGame]);
  };

  const removeFromLibrary = (gameId: number) => {
    setLibrary(prev => prev.filter(g => g.gameId !== gameId));
  };

  const toggleFavorite = (gameId: number) => {
    setLibrary(prev => prev.map(g => {
      if (g.gameId === gameId) {
        const newFavorite = !g.isFavorite;
        if (newFavorite) {
          setUserProgress(p => ({ ...p, favoriteGames: p.favoriteGames + 1 }));
        } else {
          setUserProgress(p => ({ ...p, favoriteGames: Math.max(0, p.favoriteGames - 1) }));
        }
        return { ...g, isFavorite: newFavorite };
      }
      return g;
    }));
  };

  const markAsCompleted = (gameId: number) => {
    setLibrary(prev => prev.map(g =>
      g.gameId === gameId ? { ...g, isCompleted: !g.isCompleted } : g
    ));
  };

  const startGameSession = (gameId: number) => {
    const startTime = Date.now();
    
    // Solo rastrear el tiempo si el juego YA está en la biblioteca
    const gameInLibrary = library.find(g => g.gameId === gameId);
    if (!gameInLibrary) {
      // Si no está en la biblioteca, no hacer nada
      return () => {};
    }

    const today = new Date().toDateString();
    setUserProgress(prev => ({
      ...prev,
      lastPlayDate: today
    }));

    return () => {
      const endTime = Date.now();
      const duration = Math.floor((endTime - startTime) / 1000);
      
      // Solo contar la partida si jugó más de 10 minutos (600 segundos)
      const isSignificantSession = duration >= 600;
      
      setLibrary(prev => prev.map(g => {
        if (g.gameId === gameId) {
          return { 
            ...g, 
            playTime: g.playTime + duration,
            sessionsCount: g.sessionsCount + (isSignificantSession ? 1 : 0)
          };
        }
        return g;
      }));
      
      setUserProgress(prev => ({
        ...prev,
        totalPlayTime: prev.totalPlayTime + duration,
        todayPlayTime: prev.lastPlayDate === today ? prev.todayPlayTime + duration : duration
      }));
      
      // Update achievements after session
      setTimeout(() => {
        updateGameAchievements(gameId);
        updateUserAchievements();
      }, 100);
    };
  };

  const getGameInLibrary = (gameId: number) => {
    return library.find(g => g.gameId === gameId);
  };

  const unlockAchievement = (gameId: number, achievementId: string) => {
    setLibrary(prev => prev.map(g => {
      if (g.gameId === gameId) {
        return {
          ...g,
          achievements: g.achievements.map(a =>
            a.id === achievementId && !a.unlocked
              ? { ...a, unlocked: true, unlockedAt: Date.now(), progress: a.target }
              : a
          )
        };
      }
      return g;
    }));
  };

  const updateGameAchievements = (gameId: number) => {
    const game = library.find(g => g.gameId === gameId);
    if (!game) return;

    if (game.playTime >= 600 && !game.achievements.find(a => a.id === 'ten-minutes')?.unlocked) {
      unlockAchievement(gameId, 'ten-minutes');
    }
    if (game.playTime >= 3600 && !game.achievements.find(a => a.id === 'one-hour')?.unlocked) {
      unlockAchievement(gameId, 'one-hour');
    }
    if (game.playTime >= 36000 && !game.achievements.find(a => a.id === 'ten-hours')?.unlocked) {
      unlockAchievement(gameId, 'ten-hours');
    }
    if (game.sessionsCount >= 10 && !game.achievements.find(a => a.id === 'ten-times-same-game')?.unlocked) {
      unlockAchievement(gameId, 'ten-times-same-game');
    }
  };

  const updateUserAchievements = () => {
    const uniqueGames = library.length;
    const favoriteCount = library.filter(g => g.isFavorite).length;
    
    if (uniqueGames >= 3 && !library.some(g => g.achievements.find(a => a.id === 'three-games')?.unlocked)) {
      // Unlock three-games achievement for first game or all?
      // For now, unlock for all games as it's a user achievement
      library.forEach(g => {
        if (!g.achievements.find(a => a.id === 'three-games')?.unlocked) {
          unlockAchievement(g.gameId, 'three-games');
        }
      });
    }
    
    if (favoriteCount >= 5 && !library.some(g => g.achievements.find(a => a.id === 'five-favorites')?.unlocked)) {
      library.forEach(g => {
        if (!g.achievements.find(a => a.id === 'five-favorites')?.unlocked) {
          unlockAchievement(g.gameId, 'five-favorites');
        }
      });
    }
    
    if (userProgress.consecutiveDays >= 5 && !library.some(g => g.achievements.find(a => a.id === 'five-consecutive-days')?.unlocked)) {
      library.forEach(g => {
        if (!g.achievements.find(a => a.id === 'five-consecutive-days')?.unlocked) {
          unlockAchievement(g.gameId, 'five-consecutive-days');
        }
      });
    }
    
    if (userProgress.consecutiveDays >= 7 && !library.some(g => g.achievements.find(a => a.id === 'seven-consecutive-days')?.unlocked)) {
      library.forEach(g => {
        if (!g.achievements.find(a => a.id === 'seven-consecutive-days')?.unlocked) {
          unlockAchievement(g.gameId, 'seven-consecutive-days');
        }
      });
    }
  };

  return (
    <LibraryContext.Provider value={{
      library,
      userProgress,
      addToLibrary,
      removeFromLibrary,
      toggleFavorite,
      markAsCompleted,
      startGameSession,
      getGameInLibrary,
      unlockAchievement,
      updateGameAchievements,
      updateUserAchievements
    }}>
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (context === undefined) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};