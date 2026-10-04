import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { CanvasProvider } from './context/CanvasContext';
import { HeaderNav } from './components/HeaderNav';
import { SidebarFilterIndex } from './components/SidebarFilterIndex';
import { SpatialCanvas } from './components/SpatialCanvas';
import { CanvasToolbar } from './components/CanvasToolbar';
import { SearchModal } from './components/SearchModal';
import { CardDetailDrawer } from './components/CardDetailDrawer';
import { AuthModal } from './components/AuthModal';
import { CreateNodeModal } from './components/CreateNodeModal';

export const AppContent = () => {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#FAFCFF] dark:bg-[#0B0F17]">
      <HeaderNav />
      <div className="flex flex-1 overflow-hidden relative">
        <SidebarFilterIndex />
        <SpatialCanvas />
      </div>
      <CanvasToolbar />
      <SearchModal />
      <CardDetailDrawer />
      <AuthModal />
      <CreateNodeModal />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CanvasProvider>
        <AppContent />
      </CanvasProvider>
    </AuthProvider>
  );
}
