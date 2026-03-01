import { GameCard } from './GameCard';
import { Game } from '../data/games';

interface GameGridProps {
  games: Game[];
  title?: string;
  subtitle?: string;
  onGameClick: (game: Game) => void;
  featured?: boolean;
  columns?: 3 | 4 | 5;
}

export function GameGrid({ 
  games, 
  title, 
  subtitle,
  onGameClick, 
  featured = false,
  columns = 4 
}: GameGridProps) {
  const gridCols = {
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'
  };

  if (games.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-500/10 flex items-center justify-center">
          <span className="text-4xl">🔍</span>
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">
          No se encontraron juegos
        </h3>
        <p className="text-zinc-400 max-w-md mx-auto">
          Intenta con otra búsqueda o selecciona una categoría diferente
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {(title || subtitle) && (
        <div className="flex items-end justify-between">
          <div>
            {title && (
              <h2 className="text-3xl font-bold text-white mb-2">
                <span className="text-gradient-green">{title}</span>
              </h2>
            )}
            {subtitle && (
              <p className="text-zinc-400">{subtitle}</p>
            )}
          </div>
          <div className="hidden md:block text-sm text-zinc-500">
            Mostrando {games.length} juegos
          </div>
        </div>
      )}

      <div className={`grid ${gridCols[columns]} gap-6`}>
        {games.map((game, index) => (
          <div 
            key={game.id}
            style={{ animationDelay: `${index * 50}ms` }}
            className="animate-fade-in-up"
          >
            <GameCard 
              game={game}
              onClick={onGameClick}
              featured={featured}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
