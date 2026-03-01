import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserProfile {
  avatar: string;
  bannerColor: string;
  showcaseAchievements: string[];
  bio: string;
  customName: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: number;
  profile: UserProfile;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  register: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const defaultAvatars = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Zack',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Milo',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Oscar',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Iris'
];

const defaultBanners = [
  'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
  'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
  'linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)',
  'linear-gradient(135deg, #1a1a2e 0%, #e94560 100%)'
];

const defaultProfile: UserProfile = {
  avatar: defaultAvatars[0],
  bannerColor: defaultBanners[0],
  showcaseAchievements: [],
  bio: '',
  customName: ''
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        if (!parsedUser.profile) {
          parsedUser.profile = defaultProfile;
          localStorage.setItem('currentUser', JSON.stringify(parsedUser));
        }
        setUser(parsedUser);
      } catch (err) {
        console.error('Error loading user:', err);
      }
    }
    setIsLoading(false);
  }, []);

  const register = async (email: string, password: string, name: string) => {
    if (!email || !password || !name) {
      throw new Error('Por favor completa todos los campos');
    }
    if (password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }
    if (!email.includes('@')) {
      throw new Error('Email inválido');
    }

    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[email]) {
      throw new Error('Este email ya está registrado');
    }

    const newUser: User = {
      id: Math.random().toString(36).substring(7),
      email,
      name,
      createdAt: Date.now(),
      profile: { ...defaultProfile, customName: name }
    };

    users[email] = {
      password,
      user: newUser
    };
    localStorage.setItem('users', JSON.stringify(users));

    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
  };

  const login = async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error('Por favor completa todos los campos');
    }

    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const userRecord = users[email];

    if (!userRecord || userRecord.password !== password) {
      throw new Error('Email o contraseña incorrectos');
    }

    const loggedUser = userRecord.user;
    if (!loggedUser.profile) {
      loggedUser.profile = defaultProfile;
      users[email] = { ...userRecord, user: loggedUser };
      localStorage.setItem('users', JSON.stringify(users));
    }

    setUser(loggedUser);
    localStorage.setItem('currentUser', JSON.stringify(loggedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      profile: { ...user.profile, ...updates }
    };
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[user.email]) {
      users[user.email].user = updatedUser;
      localStorage.setItem('users', JSON.stringify(users));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      register,
      login,
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { defaultAvatars, defaultBanners };
