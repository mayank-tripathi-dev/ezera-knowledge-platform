import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const CanvasContext = createContext();

export const CanvasProvider = ({ children }) => {
  const [cards, setCards] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & State matching UI reference image
  const [activeDomain, setActiveDomain] = useState('All'); // All, Digital Transformation, Cloud Architecture, Cyber Security, Enterprise Integration
  const [activeCategoryPill, setActiveCategoryPill] = useState('All Architecture (14)');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mesh Filters matching UI image
  const [meshFilters, setMeshFilters] = useState({
    activeProduction: true,
    zeroTrust: true,
    compliance: true
  });
  
  const [telemetryThreshold, setTelemetryThreshold] = useState(15);
  
  // Pan & Zoom
  const [zoom, setZoom] = useState(1.0);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  // Inspector & Modal Controls
  const [selectedCard, setSelectedCard] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  
  // Link connection tool mode
  const [linkingSourceNodeId, setLinkingSourceNodeId] = useState(null);

  // Theme Mode (Light by default matching screenshot, toggleable to dark onyx)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('ezera_theme') === 'dark';
  });

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      localStorage.setItem('ezera_theme', next ? 'dark' : 'light');
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Load initial data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [fetchedCards, fetchedConns] = await Promise.all([
        api.getCards(),
        api.getConnections()
      ]);
      setCards(fetchedCards || []);
      setConnections(fetchedConns || []);
    } catch (err) {
      console.warn('Backend API connection offline, using fallback cards state:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Spatial Card Actions
  const updateCardPosition = async (nodeId, position) => {
    setCards(prev => prev.map(c => c.nodeId === nodeId ? { ...c, position } : c));
    try {
      await api.updateCardPosition(nodeId, position);
    } catch (err) {
      console.warn('Position update persisted locally');
    }
  };

  const addCard = async (cardData) => {
    try {
      const newCard = await api.createCard(cardData);
      setCards(prev => [...prev, newCard]);
      return newCard;
    } catch (err) {
      // Local fallback
      const fallback = {
        nodeId: 'node-' + Date.now(),
        nodeCode: `NODE // ${Math.floor(100 + Math.random() * 900)}`,
        title: cardData.title || 'New Architecture Node',
        category: cardData.category || 'Cloud Architecture',
        status: cardData.status || 'IN PRODUCTION',
        statusType: 'production',
        description: cardData.description || 'Enterprise architecture topology module.',
        tags: cardData.tags || ['#Cloud', '#Architecture'],
        metrics: cardData.metrics || [{ label: 'AVAILABILITY', value: '99.99%', color: 'emerald' }],
        revision: 'Rev: 1.00 • Dr. Aris Thorne',
        author: 'Dr. Aris Thorne',
        position: cardData.position || { x: 300, y: 200 },
        dimensions: { width: 340, height: 280 }
      };
      setCards(prev => [...prev, fallback]);
      return fallback;
    }
  };

  const updateCard = async (nodeId, updates) => {
    setCards(prev => prev.map(c => c.nodeId === nodeId ? { ...c, ...updates } : c));
    if (selectedCard && selectedCard.nodeId === nodeId) {
      setSelectedCard(prev => ({ ...prev, ...updates }));
    }
    try {
      await api.updateCard(nodeId, updates);
    } catch (err) {
      console.warn('Card update stored locally');
    }
  };

  const deleteCard = async (nodeId) => {
    setCards(prev => prev.filter(c => c.nodeId !== nodeId));
    setConnections(prev => prev.filter(conn => conn.sourceNodeId !== nodeId && conn.targetNodeId !== nodeId));
    if (selectedCard && selectedCard.nodeId === nodeId) setSelectedCard(null);
    try {
      await api.deleteCard(nodeId);
    } catch (err) {
      console.warn('Delete persisted locally');
    }
  };

  const autoArrange = async () => {
    try {
      const res = await api.autoArrange();
      if (res && res.cards) {
        setCards(res.cards);
      }
    } catch (err) {
      // Fallback local arrange below header
      const cols = 3;
      const rearranged = cards.map((c, i) => ({
        ...c,
        position: { x: 60 + (i % cols) * 400, y: 320 + Math.floor(i / cols) * 350 }
      }));
      setCards(rearranged);
    }
  };

  const resetSpatialGrid = async () => {
    try {
      const res = await api.resetGrid();
      if (res) {
        setCards(res);
        setZoom(1.0);
        setPan({ x: 0, y: 0 });
      }
    } catch (err) {
      console.warn('Reset grid locally');
    }
  };

  // Connection Linking Actions
  const handleNodeClickForLinking = async (targetNodeId) => {
    if (!linkingSourceNodeId) {
      setLinkingSourceNodeId(targetNodeId);
      return;
    }

    if (linkingSourceNodeId === targetNodeId) {
      setLinkingSourceNodeId(null);
      return;
    }

    const connData = {
      sourceNodeId: linkingSourceNodeId,
      targetNodeId,
      type: 'Active Production',
      label: 'Telemetry Spline'
    };

    try {
      const newConn = await api.createConnection(connData);
      setConnections(prev => [...prev, newConn]);
    } catch (err) {
      const fallbackConn = {
        connectionId: 'conn-' + Date.now(),
        ...connData,
        status: 'Active'
      };
      setConnections(prev => [...prev, fallbackConn]);
    } finally {
      setLinkingSourceNodeId(null);
    }
  };

  // Domain Counts
  const domainCounts = {
    'Digital Transformation': cards.filter(c => c.category === 'Digital Transformation').length,
    'Cloud Architecture': cards.filter(c => c.category === 'Cloud Architecture').length,
    'Cyber Security': cards.filter(c => c.category === 'Cyber Security').length,
    'Enterprise Integration': cards.filter(c => c.category === 'Enterprise Integration').length
  };

  // Filtered Cards
  const filteredCards = cards.filter(c => {
    if (activeDomain !== 'All' && c.category !== activeDomain) return false;
    if (activeCategoryPill.startsWith('Cloud') && c.category !== 'Cloud Architecture' && c.category !== 'Digital Transformation') return false;
    if (activeCategoryPill.startsWith('Cyber') && c.category !== 'Cyber Security') return false;
    if (activeCategoryPill.startsWith('Enterprise') && c.category !== 'Enterprise Integration') return false;
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchDesc = c.description.toLowerCase().includes(q);
      const matchCode = c.nodeCode.toLowerCase().includes(q);
      const matchTags = c.tags && c.tags.some(t => t.toLowerCase().includes(q));
      return matchTitle || matchDesc || matchCode || matchTags;
    }
    return true;
  });

  const value = {
    cards,
    filteredCards,
    connections,
    loading,
    activeDomain,
    setActiveDomain,
    activeCategoryPill,
    setActiveCategoryPill,
    searchQuery,
    setSearchQuery,
    meshFilters,
    setMeshFilters,
    telemetryThreshold,
    setTelemetryThreshold,
    zoom,
    setZoom,
    pan,
    setPan,
    selectedCard,
    setSelectedCard,
    isSearchOpen,
    setIsSearchOpen,
    isAuthOpen,
    setIsAuthOpen,
    isCreateOpen,
    setIsCreateOpen,
    linkingSourceNodeId,
    setLinkingSourceNodeId,
    handleNodeClickForLinking,
    updateCardPosition,
    addCard,
    updateCard,
    deleteCard,
    autoArrange,
    resetSpatialGrid,
    domainCounts,
    isDarkMode,
    toggleDarkMode
  };

  return <CanvasContext.Provider value={value}>{children}</CanvasContext.Provider>;
};

export const useCanvas = () => useContext(CanvasContext);
