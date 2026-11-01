import React from 'react';
import {
  Network,
  Zap,
  LayoutGrid,
  BarChart3,
  Users,
  Settings,
  Link2,
  ShieldCheck,
  FileText,
} from 'lucide-react';

export type ActiveTab = 'canvas' | 'triggers' | 'integrations' | 'analytics' | 'validations' | 'reports';

interface SidebarRailProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  pendingValidationCount: number;
}

export const SidebarRail: React.FC<SidebarRailProps> = ({
  activeTab,
  setActiveTab,
  pendingValidationCount,
}) => {
  return (
    <aside className="w-16 h-screen bg-white border-r border-slate-200 flex flex-col items-center py-4 justify-between shrink-0 select-none z-30 shadow-[1px_0_4px_rgba(0,0,0,0.02)]">
      {/* Top Logo & Primary Navigation */}
      <div className="flex flex-col items-center gap-6 w-full">
        {/* NEXUS Brand Icon (matches screenshot blue squircle with white circle) */}
        <div 
          className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/25 cursor-pointer hover:bg-blue-700 transition-colors"
          title="NEXUS AI — Agent Automatisations"
          onClick={() => setActiveTab('canvas')}
        >
          <div className="w-3.5 h-3.5 rounded-full bg-white ring-4 ring-blue-400/50" />
        </div>

        {/* Navigation Rail Buttons */}
        <nav className="flex flex-col items-center gap-2 w-full px-2">
          {/* Workflows / Canvas */}
          <button
            onClick={() => setActiveTab('canvas')}
            title="Workflows Canvas (Canevas d'orchestration)"
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
              activeTab === 'canvas'
                ? 'bg-blue-50 text-blue-600 font-semibold shadow-xs'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <Network className="w-5 h-5" />
          </button>

          {/* Triggers / Déclencheurs */}
          <button
            onClick={() => setActiveTab('triggers')}
            title="Déclencheurs (Triggers & Webhooks)"
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
              activeTab === 'triggers'
                ? 'bg-blue-50 text-blue-600 font-semibold shadow-xs'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <Zap className="w-5 h-5" />
          </button>

          {/* Integrations */}
          <button
            onClick={() => setActiveTab('integrations')}
            title="Intégrations & Outils (Slack, Google Sheets, Notion, Gmail)"
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
              activeTab === 'integrations'
                ? 'bg-blue-50 text-blue-600 font-semibold shadow-xs'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <LayoutGrid className="w-5 h-5" />
          </button>

          {/* Execution Reports */}
          <button
            onClick={() => setActiveTab('reports')}
            title="Rapports d'exécution & Audit"
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
              activeTab === 'reports'
                ? 'bg-blue-50 text-blue-600 font-semibold shadow-xs'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-5 h-5" />
          </button>

          {/* Metrics & Analytics */}
          <button
            onClick={() => setActiveTab('analytics')}
            title="Analyses & Métriques"
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
              activeTab === 'analytics'
                ? 'bg-blue-50 text-blue-600 font-semibold shadow-xs'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
          </button>

          {/* Security & Human Validations */}
          <button
            onClick={() => setActiveTab('validations')}
            title="Validations Humaines & Sécurité"
            className={`relative w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
              activeTab === 'validations'
                ? 'bg-amber-50 text-amber-700 font-semibold shadow-xs'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
            {pendingValidationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                {pendingValidationCount}
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* Bottom Settings & User Avatar matching screenshot */}
      <div className="flex flex-col items-center gap-3 w-full">
        <button
          title="Paramètres du système"
          className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>

        <button
          title="Connexions API & Webhooks"
          className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <Link2 className="w-5 h-5" />
        </button>

        {/* User profile avatar matching screenshot bottom-left */}
        <div className="relative mt-2">
          <div className="w-9 h-9 rounded-full ring-2 ring-slate-200 overflow-hidden bg-slate-200 flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="Opérateur NEXUS"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // styled fallback in case offline
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <span className="text-xs font-semibold text-slate-700">NX</span>
          </div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
        </div>
      </div>
    </aside>
  );
};
