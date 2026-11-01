import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Send,
  Loader2,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Layers,
  Zap,
  Cpu,
} from 'lucide-react';
import { Workflow } from '../types/workflow';

interface AssistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyWorkflow: (generatedFlow: Partial<Workflow>) => void;
}

export const AssistModal: React.FC<AssistModalProps> = ({
  isOpen,
  onClose,
  onApplyWorkflow,
}) => {
  if (!isOpen) return null;

  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const presets = [
    {
      title: 'Marketing Lead Manager',
      prompt:
        'Qualifier les leads entrants d’un formulaire Typeform, analyser le message avec l’IA pour déterminer la catégorie et score commercial, ajouter dans Google Sheets, envoyer une alerte Slack #sales et préparer un brouillon Gmail avec validation humaine.',
    },
    {
      title: 'Génération de Contenu & Validation Éditoriale',
      prompt:
        'Automatiser la veille concurrentielle, résumer les actualités clés avec Gemini, rédiger une ébauche de post LinkedIn, soumettre pour validation humaine obligatoire avant publication.',
    },
    {
      title: 'Gestion des Factures & Archivage',
      prompt:
        'À la réception d’une facture par email, extraire le montant et le fournisseur avec l’IA, enregistrer dans Notion et notifier la comptabilité sur Slack.',
    },
    {
      title: 'Triage Support Client & Escalade',
      prompt:
        'Analyser le sentiment et l’urgence d’un ticket support client, router les tickets critiques directement vers l’équipe astreinte Slack et mettre à jour le CRM.',
    },
  ];

  const handleGenerate = async (queryText?: string) => {
    const textToSend = queryText || prompt;
    if (!textToSend.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToSend }),
      });

      if (!res.ok) {
        throw new Error(`Erreur serveur (${res.status})`);
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      console.error('Assist error:', err);
      setError(err.message || 'Impossible de joindre l’Agent Automatisations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (!result) return;
    onApplyWorkflow({
      name: result.name || 'Workflow Généré',
      description: result.description || '',
      summary: result.summary || '',
      nodes: result.nodes || [],
      edges: result.edges || [],
      status: 'Brouillon',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50/50 via-purple-50/30 to-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-sm shadow-purple-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  Agent AUTOMATISATIONS — NEXUS AI
                </h2>
                <span className="text-[11px] font-semibold text-purple-700 bg-purple-100/70 px-2 py-0.5 rounded-full border border-purple-200">
                  Orchestrateur Intelligent
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Conception semi-autonome de workflows, triggers, conditions et garde-fous de validation.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Presets */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-2">
              Modèles rapides recommandés :
            </label>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPrompt(preset.prompt);
                    handleGenerate(preset.prompt);
                  }}
                  className="p-3 text-left bg-slate-50 hover:bg-blue-50/60 border border-slate-200 hover:border-blue-300 rounded-xl transition-all group"
                >
                  <div className="font-semibold text-slate-800 group-hover:text-blue-700 flex items-center justify-between">
                    <span>{preset.title}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {preset.prompt}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Input Box */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
              <span>Décrivez votre besoin d'automatisation :</span>
              <span className="text-[11px] text-slate-400">
                L'agent respecte les 8 étapes de la méthodologie NEXUS AI
              </span>
            </label>
            <div className="relative">
              <textarea
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Exemple: Lorsqu'un nouveau prospect remplit notre formulaire de contact, analyser la demande avec Gemini 3.8 Flash, créer une opportunité dans Notion, alerter Slack et générer un brouillon d'email sous validation..."
                className="w-full p-3 pr-24 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs leading-relaxed focus:outline-none focus:border-purple-400 focus:bg-white resize-none shadow-2xs"
              />
              <button
                onClick={() => handleGenerate()}
                disabled={isLoading || !prompt.trim()}
                className="absolute right-2.5 bottom-3.5 py-1.5 px-3 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1.5 text-xs"
              >
                {isLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>Générer</span>
              </button>
            </div>
          </div>

          {/* Error display */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs">
              {error}
            </div>
          )}

          {/* Generated Result Preview (Formatted according to Section 11 of System Prompt) */}
          {result && (
            <div className="space-y-4 pt-4 border-t border-slate-200 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-slate-900 text-sm">
                    {result.name || 'Workflow Généré'}
                  </span>
                  <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    {result.nodes?.length || 0} nœuds · {result.edges?.length || 0} connexions
                  </span>
                </div>

                <button
                  onClick={handleApply}
                  className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/25 transition-all flex items-center gap-1.5 text-xs"
                >
                  <Layers className="w-4 h-4" />
                  <span>Appliquer au Canvas</span>
                </button>
              </div>

              {/* Structured Presentation (Format Section 11) */}
              <div className="p-4 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] leading-relaxed overflow-x-auto max-h-72 border border-slate-800 shadow-inner">
                <pre className="whitespace-pre-wrap">{result.summary}</pre>
              </div>

              {/* Safety notice (Section 3) */}
              <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl flex items-start gap-2 text-amber-900 text-[11px]">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Mode semi-autonome :</strong> Les actions sensibles (envoi d'email, publication, contact prospect) incluent des garde-fous avec demande d'approbation explicite avant toute exécution.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
