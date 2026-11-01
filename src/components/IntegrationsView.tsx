import React from 'react';
import {
  LayoutGrid,
  CheckCircle2,
  Table,
  Send,
  Mail,
  Database,
  Globe,
  Plus,
} from 'lucide-react';

export const IntegrationsView: React.FC = () => {
  const integrations = [
    {
      name: 'Google Sheets',
      category: 'Base de données & Tableurs',
      description: 'Ajout de lignes, extraction de données et synchronisation bidirectionnelle.',
      status: 'Connecté',
      account: 'ops@nexus-enterprise.io',
      icon: Table,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
    {
      name: 'Slack',
      category: 'Messagerie & Alertes',
      description: 'Notifications de canaux (#sales, #support), alertes urgentes et messages directs.',
      status: 'Connecté',
      account: 'NEXUS Workspace (Enterprise Grid)',
      icon: Send,
      color: 'text-orange-600 bg-orange-50 border-orange-200',
    },
    {
      name: 'Gmail',
      category: 'Email & Communication',
      description: 'Préparation automatique de brouillons commerciaux et envoi sous validation explicite.',
      status: 'Connecté',
      account: 'sales@nexus-enterprise.io',
      icon: Mail,
      color: 'text-red-600 bg-red-50 border-red-200',
    },
    {
      name: 'Notion',
      category: 'CRM & Connaissances',
      description: 'Gestion de bases de données CRM, fiches prospects et escalades support.',
      status: 'Connecté',
      account: 'NEXUS Internal Wiki & CRM',
      icon: Database,
      color: 'text-slate-800 bg-slate-100 border-slate-200',
    },
    {
      name: 'Typeform / Webhooks',
      category: 'Capture & Inbound',
      description: 'Réception sécurisée des formulaires prospects et événements temps réel.',
      status: 'Connecté',
      account: 'Form ID: #tf-marketing-99',
      icon: Globe,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
    },
    {
      name: 'Stripe & Opérations Financières',
      category: 'Finances & Facturation',
      description: 'Vérification de souscriptions (action sensible soumise à confirmation stricte).',
      status: 'Sécurisé',
      account: 'NEXUS Billing Prod',
      icon: LayoutGrid,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    },
  ];

  return (
    <div className="flex-1 h-[calc(100vh-4rem)] bg-slate-50 p-8 overflow-y-auto select-none">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <LayoutGrid className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Intégrations & Outils Métier Connectés
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Section 8 : Connecteurs opérationnels réels pour le Marketing, la Création de contenu et les Données.
            </p>
          </div>

          <button
            onClick={() => alert('Sélectionnez un nouveau connecteur dans le catalogue NEXUS AI.')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Connecter un Outil</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {integrations.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${item.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{item.name}</h3>
                      <span className="text-[11px] text-slate-400">{item.category}</span>
                    </div>
                  </div>

                  <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {item.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.description}
                </p>

                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 font-mono truncate">
                  Compte : {item.account}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
