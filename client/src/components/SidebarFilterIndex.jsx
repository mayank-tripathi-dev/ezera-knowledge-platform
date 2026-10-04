import React from 'react';
import { useCanvas } from '../context/CanvasContext';
import { 
  Sliders, 
  Cloud, 
  ShieldCheck, 
  Cpu, 
  Network, 
  RotateCcw,
  Activity,
  Layers
} from 'lucide-react';

export const SidebarFilterIndex = () => {
  const { 
    activeDomain, 
    setActiveDomain, 
    meshFilters, 
    setMeshFilters,
    telemetryThreshold,
    setTelemetryThreshold,
    resetSpatialGrid,
    domainCounts
  } = useCanvas();

  const domainIcons = {
    'Digital Transformation': Cpu,
    'Cloud Architecture': Cloud,
    'Cyber Security': ShieldCheck,
    'Enterprise Integration': Network
  };

  const handleMeshToggle = (key) => {
    setMeshFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0B0F17]/95 flex flex-col justify-between p-4 h-[calc(100vh-4rem)] select-none shrink-0 transition-colors z-20">
      <div className="space-y-6">
        {/* Header matching screenshot */}
        <div>
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-slate-900 dark:text-white text-base tracking-tight flex items-center gap-2">
              <span>System Domains</span>
            </h2>
            <Sliders className="w-4 h-4 text-slate-400 cursor-pointer hover:text-slate-600 dark:hover:text-slate-200" />
          </div>
          <div className="text-[10px] font-mono tracking-widest text-slate-400 dark:text-slate-500 uppercase mt-0.5">
            ENTERPRISE FILTER INDEX
          </div>
        </div>

        {/* Category Domain List */}
        <div className="space-y-1">
          <button
            onClick={() => setActiveDomain('All')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all ${
              activeDomain === 'All'
                ? 'bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-[#5ABDB2] font-semibold border-l-2 border-[#5ABDB2]'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/60 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <Layers className="w-4 h-4 text-slate-400" />
              <span>All Domains</span>
            </div>
            <span className="font-mono text-[11px] px-1.5 py-0.5 bg-slate-200/60 dark:bg-slate-800 rounded text-slate-600 dark:text-slate-400">
              ALL
            </span>
          </button>

          {Object.entries(domainCounts).map(([domain, count]) => {
            const IconComponent = domainIcons[domain] || Cloud;
            const isSelected = activeDomain === domain;
            const formattedCount = String(count).padStart(2, '0');

            return (
              <button
                key={domain}
                onClick={() => setActiveDomain(domain)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-[#5ABDB2] font-semibold border-l-2 border-[#5ABDB2]'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/60 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <div className="flex items-center space-x-2.5 truncate">
                  <IconComponent className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#5ABDB2]' : 'text-slate-400'}`} />
                  <span className="truncate">{domain}</span>
                </div>
                <span className="font-mono text-[11px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-500 dark:text-slate-400 shrink-0">
                  {formattedCount}
                </span>
              </button>
            );
          })}
        </div>

        {/* Mesh Filtering Section */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono tracking-wider text-slate-400 dark:text-slate-500 uppercase">
              MESH FILTERING
            </span>
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-rose-500 animate-ping"></span>
              LIVE
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {/* Active Production Splines Checkbox */}
            <label className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#5ABDB2]"></span>
                <span className="text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                  Active Production Splines
                </span>
              </div>
              <input
                type="checkbox"
                checked={meshFilters.activeProduction}
                onChange={() => handleMeshToggle('activeProduction')}
                className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-[#5ABDB2] focus:ring-[#5ABDB2] accent-[#5ABDB2]"
              />
            </label>

            {/* Zero-Trust Encryption Routes Checkbox */}
            <label className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#38BDF8]"></span>
                <span className="text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                  Zero-Trust Encryption Routes
                </span>
              </div>
              <input
                type="checkbox"
                checked={meshFilters.zeroTrust}
                onChange={() => handleMeshToggle('zeroTrust')}
                className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-[#38BDF8] focus:ring-[#38BDF8] accent-[#38BDF8]"
              />
            </label>

            {/* Compliance & Governance Nodes Checkbox */}
            <label className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span>
                <span className="text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                  Compliance & Governance Nodes
                </span>
              </div>
              <input
                type="checkbox"
                checked={meshFilters.compliance}
                onChange={() => handleMeshToggle('compliance')}
                className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-[#F59E0B] focus:ring-[#F59E0B] accent-[#F59E0B]"
              />
            </label>
          </div>
        </div>

        {/* Telemetry Threshold Slider */}
        <div className="pt-2 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 dark:text-slate-400">Telemetry Threshold</span>
            <span className="font-mono text-slate-800 dark:text-slate-200 font-semibold text-[11px]">
              &lt; {telemetryThreshold}ms
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="100"
            value={telemetryThreshold}
            onChange={(e) => setTelemetryThreshold(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#5ABDB2]"
          />
        </div>

        {/* Reset Spatial Grid Button */}
        <button
          onClick={resetSpatialGrid}
          className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-xs font-medium border border-slate-200 dark:border-slate-800 hover:border-[#5ABDB2] rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          <span>Reset Spatial Grid</span>
        </button>
      </div>

      {/* Footer System Telemetry Indicator */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
        <div className="flex items-center space-x-2">
          <Activity className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-[11px]">System Telemetry</span>
        </div>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span className="font-mono text-[10px]">v4.8</span>
      </div>
    </aside>
  );
};
