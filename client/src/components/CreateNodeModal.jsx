import React, { useState } from 'react';
import { useCanvas } from '../context/CanvasContext';
import { X, Plus, Sparkles } from 'lucide-react';

export const CreateNodeModal = () => {
  const { isCreateOpen, setIsCreateOpen, addCard } = useCanvas();

  const [formData, setFormData] = useState({
    title: '',
    nodeCode: '',
    category: 'Cloud Architecture',
    status: 'IN PRODUCTION',
    statusType: 'production',
    description: '',
    tags: '#Cloud, #Architecture',
    metric1Label: 'AVAILABILITY',
    metric1Value: '99.99%',
    metric2Label: 'LATENCY',
    metric2Value: '< 10ms',
    specifications: ''
  });

  if (!isCreateOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const tagsArray = formData.tags
      ? formData.tags.split(',').map(t => t.trim().startsWith('#') ? t.trim() : `#${t.trim()}`)
      : ['#Architecture'];

    const newCardData = {
      title: formData.title || 'New Architecture Component',
      nodeCode: formData.nodeCode || `ARCH // ${Math.floor(100 + Math.random() * 900)}`,
      category: formData.category,
      status: formData.status,
      statusType: formData.statusType,
      description: formData.description || 'Enterprise architecture solution topology node.',
      tags: tagsArray,
      metrics: [
        { label: formData.metric1Label || 'AVAILABILITY', value: formData.metric1Value || '99.99%', color: 'emerald' },
        { label: formData.metric2Label || 'LATENCY', value: formData.metric2Value || '< 10ms', color: 'cyan' }
      ],
      specifications: formData.specifications || `# ${formData.title}\n\nTechnical specification document for this architecture component.`,
      position: { x: 300 + Math.floor(Math.random() * 200), y: 150 + Math.floor(Math.random() * 150) }
    };

    addCard(newCardData);
    setIsCreateOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <h3 className="font-serif font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#5ABDB2]" />
              Deploy Architecture Blueprint Node
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
              Place new spatial node card onto enterprise knowledge canvas
            </p>
          </div>
          <button
            onClick={() => setIsCreateOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-slate-500 font-mono mb-1">Node Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Global Microservice API Gateway"
              className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-500 font-mono mb-1">Node Code</label>
              <input
                type="text"
                value={formData.nodeCode}
                onChange={(e) => setFormData({ ...formData, nodeCode: e.target.value })}
                placeholder="NODE // GW-990"
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-mono mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              >
                <option value="Digital Transformation">Digital Transformation</option>
                <option value="Cloud Architecture">Cloud Architecture</option>
                <option value="Cyber Security">Cyber Security</option>
                <option value="Enterprise Integration">Enterprise Integration</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-500 font-mono mb-1">Status Label</label>
              <input
                type="text"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                placeholder="IN PRODUCTION"
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-mono mb-1">Status Color Theme</label>
              <select
                value={formData.statusType}
                onChange={(e) => setFormData({ ...formData, statusType: e.target.value })}
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              >
                <option value="production">Emerald (In Production)</option>
                <option value="audit">Gold (Audit Guard Active)</option>
                <option value="active">Slate (Active-Active)</option>
                <option value="synchronized">Cyan (Synchronized)</option>
                <option value="enforced">Rose (Enforced)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-500 font-mono mb-1">Description</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enterprise solution topology description..."
              className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-slate-500 font-mono mb-1">Tags (Comma separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="#Cloud, #Kubernetes, #FinOps"
              className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div>
              <label className="block text-slate-500 font-mono mb-1">Metric 1 (Label & Value)</label>
              <div className="flex gap-1">
                <input
                  type="text"
                  value={formData.metric1Label}
                  onChange={(e) => setFormData({ ...formData, metric1Label: e.target.value })}
                  placeholder="AVAILABILITY"
                  className="w-1/2 px-2 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[11px] font-mono"
                />
                <input
                  type="text"
                  value={formData.metric1Value}
                  onChange={(e) => setFormData({ ...formData, metric1Value: e.target.value })}
                  placeholder="99.99%"
                  className="w-1/2 px-2 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[11px] font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-500 font-mono mb-1">Metric 2 (Label & Value)</label>
              <div className="flex gap-1">
                <input
                  type="text"
                  value={formData.metric2Label}
                  onChange={(e) => setFormData({ ...formData, metric2Label: e.target.value })}
                  placeholder="LATENCY"
                  className="w-1/2 px-2 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[11px] font-mono"
                />
                <input
                  type="text"
                  value={formData.metric2Value}
                  onChange={(e) => setFormData({ ...formData, metric2Value: e.target.value })}
                  placeholder="< 10ms"
                  className="w-1/2 px-2 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[11px] font-mono"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center space-x-2 py-2.5 bg-[#0B0F17] dark:bg-[#5ABDB2] text-white dark:text-[#0B0F17] font-bold rounded-xl hover:opacity-90 transition-opacity shadow-md mt-4"
          >
            <Plus className="w-4 h-4" />
            <span>Deploy Blueprint Node</span>
          </button>
        </form>
      </div>
    </div>
  );
};
