import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Mail, Lock, User, Loader } from 'lucide-react';

export function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contrasenas no coinciden');
      return;
    }

    setIsLoading(true);

    try {
      await register(email, password, name);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrarse');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] grid-pattern flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/10 to-transparent pointer-events-none" />
      <div className="absolute top-20 left-20 w-96 h-96 bg-green-500/10 rounded-full blur-3xl opacity-20 pointer-events-none" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl opacity-20 pointer-events-none" />

      <button
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 flex items-center gap-2 text-zinc-400 hover:text-green-400 transition-colors group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Volver</span>
      </button>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/20 mb-6">
            <span className="text-3xl">🎮</span>
          </div>
          <h1 className="text-4xl font-black text-white mb-2">
            GAME<span className="text-green-500">.IO</span>
          </h1>
          <p className="text-zinc-500 uppercase tracking-wider text-sm">Crea tu cuenta para empezar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 mb-8">
          <div>
            <label className="block text-white font-bold text-sm mb-3 uppercase tracking-wider">Nombre</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-black/40 border border-green-500/20 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                placeholder="Tu nombre"
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label className="block text-white font-bold text-sm mb-3 uppercase tracking-wider">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-black/40 border border-green-500/20 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                placeholder="tu@email.com"
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label className="block text-white font-bold text-sm mb-3 uppercase tracking-wider">Contrasena</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-black/40 border border-green-500/20 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                placeholder="Minimo 6 caracteres"
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label className="block text-white font-bold text-sm mb-3 uppercase tracking-wider">Confirmar Contrasena</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-black/40 border border-green-500/20 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                placeholder="Repetir contrasena"
                disabled={isLoading}
              />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-black font-black py-4 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-green-500/20 hover:scale-105 active:scale-95 uppercase tracking-wider text-sm flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Creando cuenta...</span>
              </>
            ) : (
              <span>Crear Cuenta</span>
            )}
          </button>
        </form>

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-800" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-[#050505] text-zinc-600 font-medium">Ya tienes cuenta?</span>
          </div>
        </div>

        <Link
          to="/login"
          className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-4 rounded-xl transition-all duration-200 border border-zinc-700 hover:border-green-500/50 text-center uppercase tracking-wider text-sm block"
        >
          Iniciar Sesion
        </Link>

        <div className="mt-8 p-4 bg-green-500/5 border border-green-500/20 rounded-xl">
          <ul className="text-zinc-500 text-sm space-y-2">
            <li>✓ Acceso a tu biblioteca personal</li>
            <li>✓ Sincroniza tu progreso de juegos</li>
            <li>✓ Desbloquea logros y trofeos</li>
            <li>✓ Totalmente gratuito</li>
          </ul>
        </div>
      </div>
    </div>
  );
}