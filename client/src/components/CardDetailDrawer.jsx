import React, { useState, useEffect } from 'react';
import { useCanvas } from '../context/CanvasContext';
import { useAuth } from '../context/AuthContext';
import { X, Save, Trash2, Cpu, Link2, Shield, Activity } from 'lucide-react';

export const CardDetailDrawer = () => {
  const { selectedCard, setSelectedCard, updateCard, deleteCard, connections, cards } = useCanvas();
  const { isArchitect, isAdmin } = useAuth();

  const [editForm, setEditForm] = useState({
    title: '',
    nodeCode: '',
    category: '',
    status: '',
    description: '',
    specifications: '',
    tags: ''
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (selectedCard) {
      setEditForm({
        title: selectedCard.title || '',
        nodeCode: selectedCard.nodeCode || '',
        category: selectedCard.category || 'Cloud Architecture',
        status: selectedCard.status || 'IN PRODUCTION',
        description: selectedCard.description || '',
        specifications: selectedCard.specifications || '',
        tags: selectedCard.tags ? selectedCard.tags.join(', ') : ''
      });
      setIsEditing(false);
    }
  }, [selectedCard]);

  if (!selectedCard) return null;

  const handleSave = () => {
    const formattedTags = editForm.tags
      ? editForm.tags.split(',').map(t => t.trim().startsWith('#') ? t.trim() : `#${t.trim()}`)
      : selectedCard.tags;

    updateCard(selectedCard.nodeId, {
      ...editForm,
      tags: formattedTags
    });
    setIsEditing(false);
  };

  // Find connected cards
  const connectedNodeIds = connections
    .filter(conn => conn.sourceNodeId === selectedCard.nodeId || conn.targetNodeId === selectedCard.nodeId)
    .map(conn => conn.sourceNodeId === selectedCard.nodeId ? conn.targetNodeId : conn.sourceNodeId);

  const connectedCards = cards.filter(c => connectedNodeIds.includes(c.nodeId));

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-40 flex flex-col justify-between overflow-hidden select-none transition-all">
      {/* Drawer Header */}
      <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#5ABDB2]/10 border border-[#5ABDB2]/30 text-[#5ABDB2] rounded uppercase">
            {selectedCard.nodeCode}
          </span>
          <span className="text-xs font-mono text-slate-400">
            {selectedCard.category}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {(isArchitect || isAdmin) && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-2.5 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded transition-colors"
            >
              {isEditing ? 'Cancel' : 'Edit Specs'}
            </button>
          )}
          <button
            onClick={() => setSelectedCard(null)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Drawer Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {isEditing ? (
          /* Edit Form */
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-500 font-mono mb-1">Title</label>
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-500 font-mono mb-1">Category</label>
                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-white"
                >
                  <option value="Digital Transformation">Digital Transformation</option>
                  <option value="Cloud Architecture">Cloud Architecture</option>
                  <option value="Cyber Security">Cyber Security</option>
                  <option value="Enterprise Integration">Enterprise Integration</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 font-mono mb-1">Status</label>
                <input
                  type="text"
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-500 font-mono mb-1">Description</label>
              <textarea
                rows={3}
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-mono mb-1">Tags (comma separated)</label>
              <input
                type="text"
                value={editForm.tags}
                onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-mono mb-1">Specifications (Markdown)</label>
              <textarea
                rows={8}
                value={editForm.specifications}
                onChange={(e) => setEditForm({ ...editForm, specifications: e.target.value })}
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-white font-mono"
              />
            </div>

            <button
              onClick={handleSave}
              className="w-full flex items-center justify-center space-x-2 py-2 bg-[#5ABDB2] hover:bg-[#49a89d] text-[#0B0F17] font-bold rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        ) : (
          /* View Details */
          <div className="space-y-6">
            <div>
              <h2 className="font-serif font-bold text-2xl text-slate-900 dark:text-white">
                {selectedCard.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                {selectedCard.description}
              </p>
            </div>

            {/* Metrics Display */}
            {selectedCard.metrics && selectedCard.metrics.length > 0 && (
              <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-800">
                {selectedCard.metrics.map((m, idx) => (
                  <div key={idx}>
                    <div className="text-[10px] font-mono text-slate-400 uppercase">{m.label}</div>
                    <div className="text-sm font-mono font-bold text-[#5ABDB2] mt-0.5">{m.value}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Technical Specifications Blueprint */}
            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-[#5ABDB2]" />
                Technical Specifications RFC
              </h4>
              <div className="p-4 bg-slate-900 text-slate-200 rounded-xl font-mono text-xs leading-relaxed overflow-x-auto border border-slate-800">
                <pre className="whitespace-pre-wrap">
                  {selectedCard.specifications || `# ${selectedCard.title}\n\nStandard Brainwave RFC Blueprint Architecture.`}
                </pre>
              </div>
            </div>

            {/* Connected Node Topology Dependencies */}
            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Link2 className="w-4 h-4 text-cyan-400" />
                Connected Node Topology ({connectedCards.length})
              </h4>
              <div className="space-y-2">
                {connectedCards.length === 0 ? (
                  <div className="text-xs text-slate-400 font-mono">No connected nodes. Use Link tool to connect splines.</div>
                ) : (
                  connectedCards.map(c => (
                    <div
                      key={c.nodeId}
                      onClick={() => setSelectedCard(c)}
                      className="p-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer transition-colors border border-slate-200 dark:border-slate-700/60 flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-semibold text-slate-900 dark:text-white font-serif">{c.title}</div>
                        <div className="text-[10px] font-mono text-slate-400">{c.nodeCode}</div>
                      </div>
                      <span className="text-[10px] font-mono text-[#5ABDB2] font-bold">INSPECT &rarr;</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Drawer Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between text-xs font-mono text-slate-400">
        <span>{selectedCard.revision}</span>
        {(isArchitect || isAdmin) && (
          <button
            onClick={() => deleteCard(selectedCard.nodeId)}
            className="text-rose-500 hover:text-rose-600 flex items-center space-x-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Node</span>
          </button>
        )}
      </div>
    </div>
  );
};
