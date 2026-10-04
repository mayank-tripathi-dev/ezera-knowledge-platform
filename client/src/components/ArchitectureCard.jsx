import React, { useState, useRef } from 'react';
import { useCanvas } from '../context/CanvasContext';
import { useAuth } from '../context/AuthContext';
import { Link2, MoreHorizontal, Globe, Trash2, ExternalLink } from 'lucide-react';

export const ArchitectureCard = ({ card }) => {
  const { 
    selectedCard, 
    setSelectedCard, 
    updateCardPosition, 
    linkingSourceNodeId,
    handleNodeClickForLinking,
    deleteCard
  } = useCanvas();

  const { isArchitect, isAdmin } = useAuth();
  
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [transformStyle, setTransformStyle] = useState({});

  const cardRef = useRef(null);

  const isSelected = selectedCard?.nodeId === card.nodeId;
  const isLinkingSource = linkingSourceNodeId === card.nodeId;

  // Status Badge styling helper
  const getStatusBadgeStyle = (statusType) => {
    switch (statusType) {
      case 'production':
        return 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400';
      case 'audit':
        return 'bg-amber-50 dark:bg-amber-950/70 border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-400';
      case 'active':
        return 'bg-slate-100 dark:bg-slate-800/90 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300';
      case 'synchronized':
        return 'bg-cyan-50 dark:bg-cyan-950/70 border-cyan-200 dark:border-cyan-800/60 text-cyan-700 dark:text-cyan-400';
      case 'enforced':
        return 'bg-rose-50 dark:bg-rose-950/70 border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-400';
      default:
        return 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400';
    }
  };

  // 3D Perspective Card Tilt on Mouse Move
  const handleMouseMove = (e) => {
    if (isDragging || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -6; // max 6deg
    const rotateY = ((x - centerX) / centerX) * 6;  // max 6deg

    setTransformStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'transform 0.1s ease-out'
    });
  };

  const handleMouseLeave = () => {
    if (isDragging) return;
    setTransformStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.3s ease-out'
    });
  };

  // Dragging handlers
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Left click only
    e.stopPropagation();

    // If in linking mode, trigger linking action
    if (linkingSourceNodeId) {
      handleNodeClickForLinking(card.nodeId);
      return;
    }

    setSelectedCard(card);
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - card.position.x,
      y: e.clientY - card.position.y
    });
  };

  React.useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (!isDragging) return;
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      updateCardPosition(card.nodeId, { x: newX, y: newY });
    };

    const handleGlobalMouseUp = () => {
      if (isDragging) setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, dragOffset, card.nodeId]);

  return (
    <div
      ref={cardRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'absolute',
        left: `${card.position.x}px`,
        top: `${card.position.y}px`,
        width: `${card.dimensions?.width || 340}px`,
        cursor: isDragging ? 'grabbing' : 'grab',
        ...transformStyle
      }}
      className={`preserve-3d rounded-xl bg-white dark:bg-slate-900 border transition-all duration-150 select-none shadow-lg ${
        isLinkingSource
          ? 'ring-4 ring-[#5ABDB2] border-[#5ABDB2]'
          : isSelected
          ? 'border-[#5ABDB2] ring-2 ring-[#5ABDB2]/40 shadow-ezera-card dark:shadow-ezera-card-dark'
          : 'border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xl'
      }`}
    >
      <div className="p-4 space-y-3.5">
        {/* Card Header: Status Badge & Node Code */}
        <div className="flex items-center justify-between">
          <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border flex items-center gap-1.5 ${getStatusBadgeStyle(card.statusType)}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
            <span>{card.status}</span>
          </div>

          <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            <span>{card.nodeCode}</span>
            {(isArchitect || isAdmin) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteCard(card.nodeId);
                }}
                className="text-slate-300 dark:text-slate-600 hover:text-rose-500 transition-colors p-0.5"
                title="Delete Node"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Node Title & Description matching reference screenshot */}
        <div>
          <h3 
            onClick={(e) => {
              e.stopPropagation();
              setSelectedCard(card);
            }}
            className="font-serif font-bold text-slate-900 dark:text-white text-base leading-snug tracking-tight hover:text-[#5ABDB2] dark:hover:text-[#5ABDB2] transition-colors cursor-pointer"
          >
            {card.title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {card.description}
          </p>
        </div>

        {/* Tag Filters Pills */}
        <div className="flex flex-wrap gap-1.5">
          {card.tags && card.tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 text-[10px] font-mono bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Key Metrics Grid matching screenshot */}
        {card.metrics && card.metrics.length > 0 && (
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            {card.metrics.map((metric, idx) => (
              <div key={idx} className="space-y-0.5">
                <div className="text-[9px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {metric.label}
                </div>
                <div className={`font-mono font-bold text-xs ${
                  metric.color === 'gold' ? 'text-amber-500 dark:text-amber-400' :
                  metric.color === 'cyan' ? 'text-sky-500 dark:text-sky-400' :
                  metric.color === 'red' ? 'text-rose-500 dark:text-rose-400' :
                  'text-emerald-600 dark:text-[#5ABDB2]'
                }`}>
                  {metric.value}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Card Footer: Revision & Author */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400 dark:text-slate-500">
          <span className="truncate max-w-[200px]">{card.revision || 'Rev: 1.00'}</span>
          <div className="flex items-center space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNodeClickForLinking(card.nodeId);
              }}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-[#5ABDB2] transition-colors"
              title="Connect Spline"
            >
              <Link2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedCard(card);
              }}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              title="View Specifications"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
