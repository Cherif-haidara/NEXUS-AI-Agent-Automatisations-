import React, { useState } from 'react';
import {
  Play,
  Sparkles,
  Table,
  Layers,
  Bot,
  Cog,
  ChevronDown,
  ChevronUp,
  PanelLeftClose,
  PanelLeftOpen,
  Send,
  Database,
  Search,
  Plus,
} from 'lucide-react';
import { NodeType, NodeColor } from '../types/workflow';

interface ToolboxPanelProps {
  onAddNode: (type: NodeType, color: NodeColor, label: string, sublabel: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const ToolboxPanel: React.FC<ToolboxPanelProps> = ({
  onAddNode,
  isOpen,
  onToggle,
}) => {
  const [objectBlocksOpen, setObjectBlocksOpen] = useState(true);
  const [processingBlocksOpen, setProcessingBlocksOpen] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');

  if (!isOpen) {
    return (
      <div className="absolute left-16 top-16 z-10 p-2">
        <button
          onClick={onToggle}
          className="p-2 bg-white rounded-lg shadow-sm border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
          title="Ouvrir la boîte à outils (Toolbox)"
        >
          <PanelLeftOpen className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const handleDragStart = (e: React.DragEvent, type: NodeType, color: NodeColor, label: string, sublabel: string) => {
    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({ type, color, label, sublabel })
    );
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <aside className="w-64 h-[calc(100vh-4rem)] bg-white border-r border-slate-200 flex flex-col shrink-0 select-none overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-start justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">Toolbox</h2>
          <p className="text-[11px] text-slate-400 mt-0.5">Drag & drop block to edit flow.</p>
        </div>
        <button
          onClick={onToggle}
          className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          title="Réduire la boîte à outils"
        >
          <PanelLeftClose className="w-4 h-4" />
        </button>
      </div>

      <div className="p-3 space-y-5">
        {/* Section 1: Object Blocks */}
        <div>
          <button
            onClick={() => setObjectBlocksOpen(!objectBlocksOpen)}
            className="w-full flex items-center justify-between text-xs font-semibold text-slate-700 py-1 hover:text-slate-900"
          >
            <span>Object Blocks</span>
            {objectBlocksOpen ? (
              <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {objectBlocksOpen && (
            <div className="grid grid-cols-2 gap-2 mt-2">
              {/* Trigger */}
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, 'trigger', 'green', 'Trigger', 'Inbound Event')}
                onClick={() => onAddNode('trigger', 'green', 'Trigger', 'Inbound Event')}
                className="group p-3 border border-emerald-300 bg-emerald-50/40 hover:bg-emerald-50/80 hover:border-emerald-400 rounded-xl cursor-grab active:cursor-grabbing transition-all flex flex-col items-center justify-center text-center shadow-2xs hover:shadow-xs"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-100/60 flex items-center justify-center text-emerald-600 mb-1.5 group-hover:scale-105 transition-transform">
                  <Play className="w-3.5 h-3.5 fill-emerald-600" />
                </div>
                <span className="text-xs font-semibold text-emerald-800">Trigger</span>
              </div>

              {/* AI Logic */}
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, 'ai-logic', 'purple', 'AI Logic', 'Analyze & Reason')}
                onClick={() => onAddNode('ai-logic', 'purple', 'AI Logic', 'Analyze & Reason')}
                className="group p-3 border border-purple-200 bg-purple-50/40 hover:bg-purple-50/80 hover:border-purple-300 rounded-xl cursor-grab active:cursor-grabbing transition-all flex flex-col items-center justify-center text-center shadow-2xs hover:shadow-xs"
              >
                <div className="w-7 h-7 rounded-lg bg-purple-100/60 flex items-center justify-center text-purple-600 mb-1.5 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold text-purple-800">AI Logic</span>
              </div>

              {/* Data Node */}
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, 'data', 'blue', 'Data Node', 'Sheets / DB')}
                onClick={() => onAddNode('data', 'blue', 'Data Node', 'Sheets / DB')}
                className="group p-3 border border-blue-200 bg-blue-50/30 hover:bg-blue-50/70 hover:border-blue-300 rounded-xl cursor-grab active:cursor-grabbing transition-all flex flex-col items-center justify-center text-center shadow-2xs hover:shadow-xs"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-100/60 flex items-center justify-center text-blue-600 mb-1.5 group-hover:scale-105 transition-transform">
                  <Table className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold text-blue-800">Data Node</span>
              </div>

              {/* Action Node */}
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, 'action', 'slate', 'Action Node', 'Custom Action')}
                onClick={() => onAddNode('action', 'slate', 'Action Node', 'Custom Action')}
                className="group p-3 border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 rounded-xl cursor-grab active:cursor-grabbing transition-all flex flex-col items-center justify-center text-center shadow-2xs hover:shadow-xs"
              >
                <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 mb-1.5 group-hover:scale-105 transition-transform">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold text-slate-800">Action Node</span>
              </div>

              {/* AI Node */}
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, 'ai', 'purple', 'AI Node', 'Model Agent')}
                onClick={() => onAddNode('ai', 'purple', 'AI Node', 'Model Agent')}
                className="group p-3 border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 rounded-xl cursor-grab active:cursor-grabbing transition-all flex flex-col items-center justify-center text-center shadow-2xs hover:shadow-xs"
              >
                <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 mb-1.5 group-hover:scale-105 transition-transform">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-medium text-slate-700">AI Node</span>
              </div>

              {/* System Node */}
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, 'system', 'blue-outline', 'System Node', 'Audit & State')}
                onClick={() => onAddNode('system', 'blue-outline', 'System Node', 'Audit & State')}
                className="group p-3 border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 rounded-xl cursor-grab active:cursor-grabbing transition-all flex flex-col items-center justify-center text-center shadow-2xs hover:shadow-xs"
              >
                <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 mb-1.5 group-hover:scale-105 transition-transform">
                  <Cog className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-medium text-slate-700">System Node</span>
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Processing Blocks */}
        <div>
          <button
            onClick={() => setProcessingBlocksOpen(!processingBlocksOpen)}
            className="w-full flex items-center justify-between text-xs font-semibold text-slate-700 py-1 hover:text-slate-900"
          >
            <span>Processing Blocks</span>
            {processingBlocksOpen ? (
              <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {processingBlocksOpen && (
            <div className="grid grid-cols-2 gap-2 mt-2">
              {/* Analyze */}
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, 'ai-logic', 'purple', 'Analyze', 'Classification')}
                onClick={() => onAddNode('ai-logic', 'purple', 'Analyze', 'Classification')}
                className="group p-3 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl cursor-grab transition-all flex flex-col items-center justify-center text-center shadow-2xs"
              >
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-700 mb-1.5">
                  <Play className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-medium text-slate-700">Analyze</span>
              </div>

              {/* Send */}
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, 'action', 'orange', 'Send', 'Notification & Alert')}
                onClick={() => onAddNode('action', 'orange', 'Send', 'Notification & Alert')}
                className="group p-3 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl cursor-grab transition-all flex flex-col items-center justify-center text-center shadow-2xs"
              >
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-700 mb-1.5">
                  <Send className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-medium text-slate-700">Send</span>
              </div>

              {/* Update */}
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, 'data', 'blue', 'Update', 'Database Sync')}
                onClick={() => onAddNode('data', 'blue', 'Update', 'Database Sync')}
                className="group p-3 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl cursor-grab transition-all flex flex-col items-center justify-center text-center shadow-2xs"
              >
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-700 mb-1.5">
                  <Database className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-medium text-slate-700">Update</span>
              </div>
            </div>
          )}
        </div>

        {/* Section 3: Intégrations rapides */}
        <div className="pt-2 border-t border-slate-100">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
            Connecteurs Prêts
          </span>
          <div className="space-y-1.5">
            <button
              onClick={() => onAddNode('action', 'orange', 'Send Slack Alert', 'Support from {{Name}} -> {{Agent}}')}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200/80 hover:bg-slate-50 flex items-center justify-between text-xs text-slate-700 transition-colors"
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-400" />
                Slack Alert
              </span>
              <Plus className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => onAddNode('action', 'emerald', 'Auto Draft Sales Email', 'Gmail Drafts')}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200/80 hover:bg-slate-50 flex items-center justify-between text-xs text-slate-700 transition-colors"
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Gmail Draft (Validé)
              </span>
              <Plus className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => onAddNode('data', 'blue', 'Add to Notion', 'Support DB')}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200/80 hover:bg-slate-50 flex items-center justify-between text-xs text-slate-700 transition-colors"
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                Notion Sync
              </span>
              <Plus className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
