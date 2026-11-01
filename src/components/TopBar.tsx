import React, { useState } from 'react';
import {
  Sparkles,
  Play,
  UploadCloud,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Edit2,
  Check,
} from 'lucide-react';
import { WorkflowStatus } from '../types/workflow';

interface TopBarProps {
  workflowName: string;
  onRename: (newName: string) => void;
  status: WorkflowStatus;
  lastSaved: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenAssist: () => void;
  onTestFlow: () => void;
  onPublishFlow: () => void;
  isTesting: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  workflowName,
  onRename,
  status,
  lastSaved,
  searchQuery,
  onSearchChange,
  onOpenAssist,
  onTestFlow,
  onPublishFlow,
  isTesting,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(workflowName);

  const handleSaveName = () => {
    if (tempName.trim()) {
      onRename(tempName.trim());
    }
    setIsEditingName(false);
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'Actif':
        return (
          <span className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Actif</span>
            <span className="text-emerald-500">·</span>
            <span className="text-emerald-600 font-normal">En ligne</span>
          </span>
        );
      case 'En attente de validation':
        return (
          <span className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-500" />
            <span>Validation requise</span>
          </span>
        );
      case 'En cours':
        return (
          <span className="flex items-center gap-1.5 text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 animate-pulse">
            <Clock className="w-3 h-3 text-blue-500" />
            <span>Exécution en cours...</span>
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50/80 px-2.5 py-0.5 rounded-full border border-amber-200/70">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="font-medium">Draft</span>
            <span className="text-amber-400">·</span>
            <span className="text-amber-600/90 font-normal">Autosaved {lastSaved}</span>
          </span>
        );
    }
  };

  return (
    <header className="h-16 px-6 bg-white border-b border-slate-200 flex items-center justify-between gap-6 shrink-0 z-20 select-none">
      {/* Zone 1: Breadcrumb and status */}
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-slate-400 text-sm font-medium">Flows</span>
        <span className="text-slate-300">/</span>

        {isEditingName ? (
          <div className="flex items-center gap-1">
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveName();
                if (e.key === 'Escape') setIsEditingName(false);
              }}
              autoFocus
              className="text-base font-semibold text-slate-900 border border-blue-400 rounded px-2 py-0.5 outline-none bg-blue-50/30"
            />
            <button
              onClick={handleSaveName}
              className="p-1 text-emerald-600 hover:text-emerald-700"
              title="Valider"
            >
              <Check className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => {
              setTempName(workflowName);
              setIsEditingName(true);
            }}
            className="group flex items-center gap-1.5 cursor-pointer"
            title="Cliquer pour renommer le workflow"
          >
            <h1 className="text-base font-bold text-slate-900 tracking-tight whitespace-nowrap">
              {workflowName}
            </h1>
            <Edit2 className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}

        <div className="ml-2 hidden sm:block">{getStatusBadge()}</div>
      </div>

      {/* Zone 2: Central Search input */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search nodes, variables, or connection"
            className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg placeholder:text-slate-400 text-slate-700 focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-mono bg-slate-200/60 px-1.5 py-0.5 rounded">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Zone 3: Collaborators & Primary Actions */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Collaborators Avatar stack matching screenshot */}
        <div className="flex items-center -space-x-1.5 mr-1 hidden lg:flex">
          <div className="w-7 h-7 rounded-full bg-slate-300 text-slate-700 text-[11px] font-semibold flex items-center justify-center ring-2 ring-white">
            ME
          </div>
          <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-[11px] font-semibold flex items-center justify-center ring-2 ring-white">
            EL
          </div>
          <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 text-[11px] font-semibold flex items-center justify-center ring-2 ring-white">
            EM
          </div>
        </div>

        {/* Generate with Assist (NEXUS AI Automatisations Agent) */}
        <button
          onClick={onOpenAssist}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-all whitespace-nowrap"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span>Generate with Assist</span>
        </button>

        {/* Test Flow */}
        <button
          onClick={onTestFlow}
          disabled={isTesting}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border rounded-lg transition-all whitespace-nowrap shadow-2xs ${
            isTesting
              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <Play className={`w-3.5 h-3.5 text-slate-600 ${isTesting ? 'animate-spin' : ''}`} />
          <span>{isTesting ? 'Test en cours...' : 'Test Flow'}</span>
        </button>

        {/* Publish Flow (solid blue matching screenshot) */}
        <button
          onClick={onPublishFlow}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm shadow-blue-500/20 transition-all whitespace-nowrap"
        >
          <UploadCloud className="w-3.5 h-3.5" />
          <span>Publish Flow</span>
        </button>
      </div>
    </header>
  );
};
