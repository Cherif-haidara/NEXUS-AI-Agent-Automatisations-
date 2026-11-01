import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Zap,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  return (
    <div className="flex-1 h-[calc(100vh-4rem)] bg-slate-50 p-8 overflow-y-auto select-none">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Métriques & Performance d'Automatisation
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Indicateurs d'efficacité, temps de traitement, taux de succès et volume des garde-fous.
          </p>
        </div>

        {/* 4 KPI cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Exécutions Totales</span>
              <Zap className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-slate-900 tabular-nums">
              12,480
            </div>
            <span className="text-[11px] text-emerald-600 font-medium">
              +18.4% ce mois
            </span>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Taux de Succès</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold text-slate-900 tabular-nums">
              99.8%
            </div>
            <span className="text-[11px] text-slate-400">
              0 double exécution
            </span>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Temps Moyen</span>
              <Clock className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-slate-900 tabular-nums">
              340 ms
            </div>
            <span className="text-[11px] text-emerald-600 font-medium">
              -65ms vs modèle précédent
            </span>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Validations Humaines</span>
              <ShieldCheck className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-slate-900 tabular-nums">
              214
            </div>
            <span className="text-[11px] text-amber-600 font-medium">
              100% conformité sécurité
            </span>
          </div>
        </div>

        {/* Breakdown Table */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3">
          <h3 className="font-bold text-slate-900 text-sm">
            Performance par Nœud de Traitement
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-[11px]">
                  <th className="pb-2 font-semibold">Nœud</th>
                  <th className="pb-2 font-semibold">Type</th>
                  <th className="pb-2 font-semibold">Volume (30j)</th>
                  <th className="pb-2 font-semibold">Latence Moyenne</th>
                  <th className="pb-2 font-semibold">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-2.5 font-medium text-slate-900">Trigger (Typeform)</td>
                  <td className="py-2.5 text-slate-500">Inbound Webhook</td>
                  <td className="py-2.5 font-mono tabular-nums">12,480</td>
                  <td className="py-2.5 font-mono tabular-nums">18 ms</td>
                  <td className="py-2.5 text-emerald-600 font-semibold">Nominal</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium text-slate-900">Analyze Lead Message (Gemini)</td>
                  <td className="py-2.5 text-slate-500">AI Logic</td>
                  <td className="py-2.5 font-mono tabular-nums">12,480</td>
                  <td className="py-2.5 font-mono tabular-nums">260 ms</td>
                  <td className="py-2.5 text-emerald-600 font-semibold">Nominal</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium text-slate-900">Add to Google Sheets</td>
                  <td className="py-2.5 text-slate-500">Data Node</td>
                  <td className="py-2.5 font-mono tabular-nums">12,480</td>
                  <td className="py-2.5 font-mono tabular-nums">45 ms</td>
                  <td className="py-2.5 text-emerald-600 font-semibold">Nominal</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium text-slate-900">Send Slack Alert to #sales</td>
                  <td className="py-2.5 text-slate-500">Action Node</td>
                  <td className="py-2.5 font-mono tabular-nums">4,810</td>
                  <td className="py-2.5 font-mono tabular-nums">32 ms</td>
                  <td className="py-2.5 text-emerald-600 font-semibold">Nominal</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-medium text-slate-900">Auto Draft Sales Email</td>
                  <td className="py-2.5 text-slate-500">Action (Validé)</td>
                  <td className="py-2.5 font-mono tabular-nums">214</td>
                  <td className="py-2.5 font-mono tabular-nums">58 ms</td>
                  <td className="py-2.5 text-amber-600 font-semibold">Validé 100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
