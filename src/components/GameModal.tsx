import { useEffect, useRef, useState } from 'react';
import { Game } from '../data/games';

interface GameModalProps {
  game: Game | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function GameModal({ game, isOpen, onClose }: GameModalProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          onClose();
        }
      }
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.addEventListener('fullscreenchange', handleFullscreenChange);
      document.body.style.overflow = 'hidden';
      setIsLoading(true);
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Error toggling fullscreen:', err);
    }
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  if (!isOpen || !game) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/95 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div 
        ref={containerRef}
        className={`relative w-full h-full flex flex-col bg-gray-900 ${isFullscreen ? '' : 'max-w-[95vw] max-h-[95vh] rounded-xl overflow-hidden'}`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-3 bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700 ${isFullscreen ? 'absolute top-0 left-0 right-0 z-10 bg-opacity-90' : ''}`}>
          <div className="flex items-center gap-3">
            <img 
              src={game.image} 
              alt={game.title}
              className="w-10 h-10 rounded-lg object-cover"
            />
            <div>
              <h2 className="text-white font-bold text-lg">{game.title}</h2>
              <p className="text-gray-400 text-sm">{game.category}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="p-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors flex items-center gap-2"
              title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
            >
              {isFullscreen ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9L4 4m0 0v4m0-4h4m6 0l5-5m0 0v4m0-4h-4m-6 16l-5 5m0 0v-4m0 4h4m6 0l5 5m0 0v-4m0 4h-4" />
                  </svg>
                  <span className="hidden sm:inline">Salir</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  <span className="hidden sm:inline">Pantalla Completa</span>
                </>
              )}
            </button>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="hidden sm:inline">Cerrar</span>
            </button>
          </div>
        </div>

        {/* Game Container */}
        <div className={`flex-1 relative bg-black ${isFullscreen ? 'pt-14' : ''}`}>
          {/* Loading Spinner */}
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 z-10">
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-white text-lg">Cargando {game.title}...</p>
              <p className="text-gray-400 text-sm mt-2">Esto puede tardar unos segundos</p>
            </div>
          )}
          
          {/* Game Iframe */}
          {game.url && (
            <iframe
              ref={iframeRef}
              src={game.url}
              title={game.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen; gamepad"
              allowFullScreen
              onLoad={handleIframeLoad}
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-pointer-lock"
            />
          )}
        </div>

        {/* Footer with controls info */}
        <div className={`p-2 bg-gray-800 border-t border-gray-700 flex items-center justify-between text-sm ${isFullscreen ? 'absolute bottom-0 left-0 right-0 bg-opacity-90' : ''}`}>
          <div className="text-gray-400 flex items-center gap-4">
            <span>⌨️ ESC para cerrar</span>
            <span>🖱️ F11 para pantalla completa del navegador</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-400">⭐ {game.rating}</span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-400">👁 {game.plays} jugadas</span>
          </div>
        </div>
      </div>
    </div>
  );
}
