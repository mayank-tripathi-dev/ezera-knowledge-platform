import React from 'react';
import { useCanvas } from '../context/CanvasContext';
import { useAuth } from '../context/AuthContext';
import { 
  Search, 
  Download, 
  Plus, 
  Sun, 
  Moon, 
  User, 
  LogOut, 
  SlidersHorizontal,
  Bell,
  Grid
} from 'lucide-react';

export const HeaderNav = () => {
  const { 
    setIsSearchOpen, 
    setIsAuthOpen, 
    setIsCreateOpen, 
    isDarkMode, 
    toggleDarkMode,
    cards
  } = useCanvas();

  const { user, logout, isArchitect } = useAuth();

  const exportArchitectureMatrix = () => {
    const exportData = {
      platform: 'Brainwave Enterprise Knowledge Platform',
      version: '4.8.0',
      exportedAt: new Date().toISOString(),
      nodesCount: cards.length,
      architectureNodes: cards
    };
    const jsonStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `brainwave-architecture-matrix-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-[#0B0F17]/90 backdrop-blur-md px-4 flex items-center justify-between z-30 sticky top-0 transition-colors">
      {/* Left Logo Section matching exact screenshot */}
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-lg bg-[#0B0F17] dark:bg-slate-900 border border-[#5ABDB2]/40 flex items-center justify-center shadow-sm">
          <span className="font-serif font-bold text-xl text-[#5ABDB2]">B</span>
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-serif font-bold text-lg leading-none tracking-tight text-slate-900 dark:text-white">
              Brainwave
            </span>
            <span className="text-xs font-sans uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Architecture
            </span>
          </div>
          <div className="flex items-center space-x-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5ABDB2] animate-pulse"></span>
            <span className="text-[10px] font-mono uppercase text-slate-400 dark:text-slate-500 tracking-wider">
              SYSTEM ACTIVE // NODE GRID SYNCHRONIZED
            </span>
          </div>
        </div>
      </div>

      {/* Top Nav Tabs */}
      <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 border-x border-slate-100 dark:border-slate-800/80 px-4">
        {['Architecture', 'Solutions', 'Knowledge Grid', 'Intelligence', 'Governance'].map((tab, idx) => (
          <button
            key={tab}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              idx === 0
                ? 'bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-[#5ABDB2] shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900/50'
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* Search & Actions matching UI controls */}
      <div className="flex items-center space-x-2.5">
        {/* Search Bar matching screenshot */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-xs text-slate-500 dark:text-slate-400 hover:border-[#5ABDB2]/50 transition-all w-52 lg:w-64"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="truncate flex-1 text-left">Search architecture nodes, RFCs...</span>
          <kbd className="px-1.5 py-0.5 text-[10px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-400 font-mono">
            ⌘K
          </kbd>
        </button>

        {/* View Switchers */}
        <div className="hidden lg:flex items-center space-x-1 text-slate-400 border-r border-slate-200 dark:border-slate-800 pr-2">
          <button className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200">
            <Grid className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200">
            <SlidersHorizontal className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200">
            <Bell className="w-4 h-4" />
          </button>
        </div>

        {/* Export Matrix */}
        <button
          onClick={exportArchitectureMatrix}
          className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-all"
        >
          <Download className="w-3.5 h-3.5 text-[#5ABDB2]" />
          <span className="hidden sm:inline">Export Matrix</span>
        </button>

        {/* Deploy Blueprint CTA Button */}
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-md bg-[#0B0F17] dark:bg-[#5ABDB2] text-white dark:text-[#0B0F17] hover:bg-slate-800 dark:hover:bg-[#49a89d] transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Deploy Blueprint</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          title="Toggle Dark / Light Theme"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* User Auth Info */}
        {user ? (
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            <div className="flex items-center space-x-1.5">
              <div className="w-7 h-7 rounded-full bg-[#5ABDB2]/20 border border-[#5ABDB2] text-[#5ABDB2] flex items-center justify-center font-bold text-xs">
                {user.name ? user.name.charAt(0) : 'U'}
              </div>
              <div className="hidden xl:block text-left">
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[100px]">
                  {user.name}
                </div>
                <span className="text-[10px] uppercase font-mono px-1 py-0.2 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-[#5ABDB2] rounded">
                  {user.role}
                </span>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-1 text-slate-400 hover:text-red-500 rounded transition-all"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsAuthOpen(true)}
            className="flex items-center space-x-1 px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:text-[#5ABDB2]"
          >
            <User className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};
