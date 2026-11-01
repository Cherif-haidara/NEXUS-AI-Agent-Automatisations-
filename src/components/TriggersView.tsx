import React from 'react';
import {
  Zap,
  Globe,
  Clock,
  Play,
  Sliders,
  CheckCircle2,
  Copy,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export const TriggersView: React.FC = () => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const triggersList = [
    {
      id: 'trig-1',
      category: 'WEBHOOK',
      name: 'Inbound Webhook (Typeform Leads)',
      description: 'Déclenché immédiatement à chaque soumission valide sur le formulaire de contact commercial.',
      endpoint: 'https://api.nexus-ai.io/v1/hooks/tf-marketing-99',
      status: 'Opérationnel',
      executionsToday: 142,
      lastTriggered: 'Il y a 3 minutes',
    },
    {
      id: 'trig-2',
      category: 'PROGRAMMÉ',
      name: 'Synchronisation Quotidienne Notion / Sheets',
      description: 'Exécution programmée chaque matin à 08:00 CET pour aligner les fiches prospects.',
      schedule: 'Tous les jours à 08:00 (Europe/Paris)',
      status: 'Actif',
      executionsToday: 1,
      lastTriggered: 'Aujourd’hui à 08:00',
    },
    {
      id: 'trig-3',
      category: 'CONDITIONNEL',
      name: 'Score Prospect Élevé (> 8.5)',
      description: 'Déclenche immédiatement une alerte d’astreinte Slack #sales dès détection d’un compte entreprise.',
      condition: 'lead.score >= 8.5 && lead.budget >= 10000',
      status: 'Actif',
      executionsToday: 28,
      lastTriggered: 'Il y a 18 minutes',
    },
    {
      id: 'trig-4',
      category: 'MANUEL',
      name: 'Déclenchement Opérateur NEXUS',
      description: 'Permet à un administrateur d’exécuter le workflow à la demande avec un jeu de données de test.',
      status: 'Prêt',
      executionsToday: 6,
      lastTriggered: 'Il y a 1 heure',
    },
  ];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-1 h-[calc(100vh-4rem)] bg-slate-50 p-8 overflow-y-auto select-none">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Zap className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Gestion des Déclencheurs (Triggers)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Section 5 du système : Maîtrise des catégories Manuel, Programmé, Événementiel, Webhook et Conditionnel.
            </p>
          </div>
        </div>

        {/* Triggers cards */}
        <div className="grid grid-cols-1 gap-4">
          {triggersList.map((trig) => (
            <div
              key={trig.id}
              className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {trig.category}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm">{trig.name}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {trig.status}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {trig.description}
              </p>

              {trig.endpoint && (
                <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700">
                  <span className="truncate mr-2">{trig.endpoint}</span>
                  <button
                    onClick={() => handleCopy(trig.endpoint!, trig.id)}
                    className="p-1 text-slate-400 hover:text-slate-800 transition-colors shrink-0"
                    title="Copier l'URL Webhook"
                  >
                    {copiedId === trig.id ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              )}

              {trig.schedule && (
                <div className="p-2.5 bg-blue-50/50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{trig.schedule}</span>
                </div>
              )}

              {trig.condition && (
                <div className="p-2.5 bg-amber-50/50 border border-amber-200 rounded-xl text-xs font-mono text-amber-900 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{trig.condition}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                <span>Dernier déclenchement : {trig.lastTriggered}</span>
                <span className="font-semibold text-slate-600 tabular-nums">
                  {trig.executionsToday} exécutions aujourd'hui
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
