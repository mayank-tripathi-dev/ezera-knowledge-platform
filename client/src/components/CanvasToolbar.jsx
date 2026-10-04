import React from 'react';
import { useCanvas } from '../context/CanvasContext';
import { 
  FileText, 
  Link2, 
  Image as ImageIcon, 
  Grid, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  Minimize2
} from 'lucide-react';

export const CanvasToolbar = () => {
  const { 
    zoom, 
    setZoom, 
    autoArrange, 
    setIsCreateOpen, 
    linkingSourceNodeId, 
    setLinkingSourceNodeId 
  } = useCanvas();

  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 select-none">
      <div className="bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-1.5 flex items-center space-x-1 backdrop-blur-lg">
        {/* + Note Button */}
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center space-x-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-[#5ABDB2] dark:hover:text-[#5ABDB2] hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl transition-all"
        >
          <FileText className="w-3.5 h-3.5 text-rose-500" />
          <span>+ Note</span>
        </button>

        {/* Link Button */}
        <button
          onClick={() => {
            if (linkingSourceNodeId) {
              setLinkingSourceNodeId(null);
            } else {
              alert('Connection mode enabled: Click any node to select source, then click target node to create Bezier spline connection!');
            }
          }}
          className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-medium rounded-xl transition-all ${
            linkingSourceNodeId
              ? 'bg-[#5ABDB2] text-white font-bold animate-pulse shadow-md'
              : 'text-slate-700 dark:text-slate-200 hover:text-[#5ABDB2] hover:bg-slate-100 dark:hover:bg-slate-800/80'
          }`}
        >
          <Link2 className="w-3.5 h-3.5 text-cyan-500" />
          <span>Link</span>
        </button>

        {/* Image Button */}
        <button
          onClick={() => {
            setIsCreateOpen(true);
          }}
          className="flex items-center space-x-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-[#5ABDB2] hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl transition-all"
        >
          <ImageIcon className="w-3.5 h-3.5 text-purple-500" />
          <span>Image</span>
        </button>

        <div className="w-px h-5 bg-slate-200 dark:bg-slate-800 mx-1"></div>

        {/* Auto-Arrange Button */}
        <button
          onClick={autoArrange}
          className="flex items-center space-x-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-[#5ABDB2] hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl transition-all"
        >
          <Grid className="w-3.5 h-3.5 text-emerald-500" />
          <span>Auto-Arrange</span>
        </button>

        <div className="w-px h-5 bg-slate-200 dark:bg-slate-800 mx-1"></div>

        {/* Zoom Controls */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setZoom(prev => Math.max(prev - 0.1, 0.4))}
            className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          
          <button
            onClick={() => setZoom(1.0)}
            className="px-2 py-1 text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 hover:text-[#5ABDB2] transition-colors"
          >
            {Math.round(zoom * 100)}%
          </button>

          <button
            onClick={() => setZoom(prev => Math.min(prev + 0.1, 2.5))}
            className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="w-px h-5 bg-slate-200 dark:bg-slate-800 mx-1"></div>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          className="flex items-center space-x-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-[#5ABDB2] hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl transition-all"
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          <span>Fullscreen</span>
        </button>
      </div>
    </div>
  );
};
