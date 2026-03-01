import { categories } from '../data/games';
import { cn } from '../lib/utils';

interface CategoryBarProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryBar({ activeCategory, onCategoryChange }: CategoryBarProps) {
  return (
    <div className="w-full overflow-x-auto scrollbar-hide py-2">
      <div className="flex gap-3 px-1 min-w-max">
        {categories.map((category, index) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              'group relative flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 border backdrop-blur-sm',
              activeCategory === category.id
                ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-black border-green-300 shadow-lg shadow-green-500/30'
                : 'bg-black/35 text-zinc-300 border-zinc-700/80 hover:border-green-500/40 hover:text-green-300 hover:bg-green-500/10'
            )}
            style={{ animationDelay: `${index * 30}ms` }}
          >
            {activeCategory === category.id && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-black/80 border border-green-300" />
            )}
            <span className="text-lg">{category.icon}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
