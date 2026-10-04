import React, { useState, useRef, useEffect } from 'react';
import { useCanvas } from '../context/CanvasContext';
import { ArchitectureCard } from './ArchitectureCard';
import { Sparkles, Layers } from 'lucide-react';

export const SpatialCanvas = () => {
  const { 
    filteredCards, 
    connections, 
    zoom, 
    setZoom, 
    pan, 
    setPan, 
    activeCategoryPill, 
    setActiveCategoryPill,
    meshFilters,
    isDarkMode
  } = useCanvas();

  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [spotlightPos, setSpotlightPos] = useState({ x: -500, y: -500 });
  
  const containerRef = useRef(null);

  // Mouse pan handlers for the spatial canvas surface
  const handleMouseDown = (e) => {
    if (e.target.closest('.preserve-3d')) return; // Ignore if clicking a card directly
    setIsPanning(true);
    setStartPan({
      x: e.clientX - pan.x,
      y: e.clientY - pan.y
    });
  };

  const handleMouseMove = (e) => {
    // Update cursor spotlight position
    setSpotlightPos({ x: e.clientX, y: e.clientY });

    if (!isPanning) return;
    setPan({
      x: e.clientX - startPan.x,
      y: e.clientY - startPan.y
    });
  };

  const handleMouseUp = () => {
    if (isPanning) setIsPanning(false);
  };

  // Scroll wheel zoom handler
  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    const newZoom = Math.min(Math.max(zoom * zoomFactor, 0.4), 2.5);
    setZoom(newZoom);
  };

  // Calculate SVG Cubic Bezier Curve between two node cards
  const calculateBezierCurve = (sourceCard, targetCard) => {
    if (!sourceCard || !targetCard) return null;

    const srcX = sourceCard.position.x + (sourceCard.dimensions?.width || 340);
    const srcY = sourceCard.position.y + 140; // Card vertical mid-point

    const tgtX = targetCard.position.x;
    const tgtY = targetCard.position.y + 140;

    const dx = Math.abs(tgtX - srcX) * 0.5;

    return `M ${srcX} ${srcY} C ${srcX + Math.max(dx, 80)} ${srcY}, ${tgtX - Math.max(dx, 80)} ${tgtY}, ${tgtX} ${tgtY}`;
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      className={`relative flex-1 h-[calc(100vh-4rem)] overflow-hidden select-none cursor-grab active:cursor-grabbing ${
        isDarkMode ? 'spatial-grid-bg-dark' : 'spatial-grid-bg-light'
      }`}
    >
      {/* Ezera Teal Cursor Tracking Spotlight Glow */}
      <div 
        className="cursor-spotlight hidden lg:block"
        style={{
          transform: `translate3d(${spotlightPos.x}px, ${spotlightPos.y}px, 0px)`
        }}
      />

      {/* Main Canvas Workspace Container with Pan & Zoom Transform */}
      <div
        className="absolute inset-0 origin-top-left transition-transform duration-75 ease-out"
        style={{
          transform: `translate3d(${pan.x}px, ${pan.y}px, 0px) scale(${zoom})`
        }}
      >
        {/* Header Overlay matching the UI screenshot */}
        <div className="absolute top-6 left-8 max-w-2xl z-10 space-y-3 pointer-events-auto">
          {/* Topology Badge */}
          <div className="flex items-center space-x-3 text-xs font-mono">
            <span className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-700/80 text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              ENTERPRISE KNOWLEDGE GRAPH
            </span>
            <span className="text-slate-400 dark:text-slate-500">•</span>
            <span className="text-slate-600 dark:text-slate-400 font-medium">
              Topology Layer: L3 - Global Hyper-Mesh
            </span>
          </div>

          {/* Main Title */}
          <h1 className="font-serif font-bold text-3xl md:text-4xl text-slate-900 dark:text-white tracking-tight leading-tight">
            Architecting Enterprise Digital Knowledge
          </h1>

          {/* Subtitle */}
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
            Spatial canvas for international technology consulting architecture, enterprise solution topology, and cloud governance frameworks.
          </p>

          {/* Category Filter Pills matching screenshot */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {[
              { name: 'All Architecture (14)', count: 14 },
              { name: 'Cloud Transformation (5)', count: 5 },
              { name: 'Cyber Resilience (3)', count: 3 },
              { name: 'Enterprise Integration (6)', count: 6 }
            ].map(pill => (
              <button
                key={pill.name}
                onClick={() => setActiveCategoryPill(pill.name)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeCategoryPill === pill.name
                    ? 'bg-slate-900 dark:bg-[#5ABDB2] text-white dark:text-[#0B0F17] font-semibold shadow-md'
                    : 'bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {pill.name}
              </button>
            ))}
          </div>
        </div>

        {/* SVG Bezier Spline Overlay */}
        <svg className="absolute inset-0 w-[5000px] h-[5000px] pointer-events-none z-0">
          {connections.map((conn) => {
            const sourceCard = filteredCards.find(c => c.nodeId === conn.sourceNodeId);
            const targetCard = filteredCards.find(c => c.nodeId === conn.targetNodeId);

            // Filter check
            if (conn.type === 'Active Production' && !meshFilters.activeProduction) return null;
            if (conn.type === 'Zero-Trust Encryption' && !meshFilters.zeroTrust) return null;
            if (conn.type === 'Compliance & Governance' && !meshFilters.compliance) return null;

            const pathD = calculateBezierCurve(sourceCard, targetCard);
            if (!pathD) return null;

            const splineColor = 
              conn.type === 'Zero-Trust Encryption' ? '#38BDF8' :
              conn.type === 'Compliance & Governance' ? '#F59E0B' : '#5ABDB2';

            return (
              <g key={conn.connectionId}>
                {/* Outer Glow */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={splineColor}
                  strokeWidth="6"
                  strokeOpacity="0.15"
                  strokeLinecap="round"
                />
                {/* Main Curve Spline */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={splineColor}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className={conn.type === 'Active Production' ? 'spline-flow-active' : ''}
                />
                {/* Connection Label Pill */}
                {sourceCard && targetCard && (
                  <g transform={`translate(${
                    (sourceCard.position.x + targetCard.position.x) / 2 + 170
                  }, ${
                    (sourceCard.position.y + targetCard.position.y) / 2 + 140
                  })`}>
                    <rect
                      x="-35"
                      y="-10"
                      width="70"
                      height="20"
                      rx="10"
                      fill={isDarkMode ? '#0F172A' : '#FFFFFF'}
                      stroke={splineColor}
                      strokeWidth="1"
                    />
                    <text
                      x="0"
                      y="3"
                      textAnchor="middle"
                      fill={splineColor}
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {conn.label || 'LINK'}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Spatial Architecture Cards */}
        <div className="absolute inset-0 pointer-events-auto">
          {filteredCards.map((card) => (
            <ArchitectureCard key={card.nodeId} card={card} />
          ))}
        </div>
      </div>
    </div>
  );
};
