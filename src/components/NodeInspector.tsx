import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Info,
  Copy,
  Check,
  Play,
  Wand2,
  BookmarkPlus,
  ArrowRight,
  ShieldAlert,
  Loader2,
  Trash2,
} from 'lucide-react';
import { WorkflowNode } from '../types/workflow';

interface NodeInspectorProps {
  node: WorkflowNode | null;
  onClose: () => void;
  onUpdateNode: (nodeId: string, updates: Partial<WorkflowNode>) => void;
  onDeleteNode: (nodeId: string) => void;
  onInsertSuggestedFlow: () => void;
}

export const NodeInspector: React.FC<NodeInspectorProps> = ({
  node,
  onClose,
  onUpdateNode,
  onDeleteNode,
  onInsertSuggestedFlow,
}) => {
  if (!node) return null;

  const [copied, setCopied] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testOutput, setTestOutput] = useState<string | null>(null);

  const handleCopy = () => {
    const textToCopy =
      testOutput ||
      node.config?.outputPreview ||
      `{\n  "type": "sales",\n  "score": 8.9,\n  "summary": "Interested in enterprise plan for team expansion."\n}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOptimizePrompt = async () => {
    setIsOptimizing(true);
    try {
      const res = await fetch('/api/optimize-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPrompt:
            node.config?.prompt ||
            "Summarize the message and detect if it's sales, support, or general.",
          nodeLabel: node.label,
        }),
      });
      const data = await res.json();
      if (data.optimizedPrompt) {
        onUpdateNode(node.id, {
          config: {
            ...node.config,
            prompt: data.optimizedPrompt,
          },
        });
      }
    } catch (err) {
      console.error('Failed to optimize prompt', err);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleTestNode = async () => {
    setIsTesting(true);
    try {
      const res = await fetch('/api/test-node', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          node,
          sampleInput: {
            name: 'Alexandre Roy',
            company: 'TechCorp EMEA',
            email: 'a.roy@techcorp.eu',
            message:
              'Bonjour, nous évaluons NEXUS AI pour automatiser nos workflows commerciaux et de support. Pouvez-vous nous contacter pour un devis grand compte ?',
          },
        }),
      });
      const data = await res.json();
      if (data.output) {
        setTestOutput(data.output);
      }
    } catch (err) {
      console.error('Failed to test node', err);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <aside className="w-84 h-[calc(100vh-4rem)] bg-white border-l border-slate-200 flex flex-col shrink-0 select-none overflow-y-auto shadow-[-2px_0_10px_rgba(0,0,0,0.03)] z-20">
      {/* Header matching screenshot */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            {node.label}
          </h2>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onDeleteNode(node.id)}
            className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Supprimer ce nœud"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
            title="Fermer le panneau"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4 text-xs">
        {/* Model Selection */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="font-semibold text-slate-700">Model</label>
            <span
              title="Modèle d'IA utilisé pour l'analyse du message"
              className="text-slate-400 hover:text-slate-600 cursor-help"
            >
              <Info className="w-3.5 h-3.5" />
            </span>
          </div>
          <select
            value={node.config?.model || 'gemini-3.8-flash'}
            onChange={(e) =>
              onUpdateNode(node.id, {
                config: { ...node.config, model: e.target.value },
              })
            }
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
          >
            <option value="gemini-3.8-flash">gemini-3.8-flash (Recommandé)</option>
            <option value="gemini-4-argon">gemini-4-argon (Raisonnement avancé)</option>
            <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite</option>
            <option value="GPT-4o-mini">GPT-4o-mini</option>
          </select>
        </div>

        {/* Prompt */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="font-semibold text-slate-700">Prompt</label>
            <span className="text-[10px] text-slate-400">Instruct</span>
          </div>
          <textarea
            rows={4}
            value={
              node.config?.prompt ||
              "Summarize the message and detect if it's sales, support, or general. Return JSON with fields: 'type', 'score', and 'summary'."
            }
            onChange={(e) =>
              onUpdateNode(node.id, {
                config: { ...node.config, prompt: e.target.value },
              })
            }
            placeholder="Décrivez les instructions pour ce nœud..."
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs leading-relaxed focus:outline-none focus:border-blue-500 focus:bg-white resize-none transition-colors"
          />
          <p className="text-[11px] text-slate-400 mt-1 leading-normal">
            AI will classify this message as sales, support, or general and return a structured JSON object.
          </p>
        </div>

        {/* Human Validation Switch (Strictly required by Section 3 & 9 of system prompt) */}
        <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-xl space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              <span className="font-semibold text-amber-900 text-xs">
                Validation Humaine Explicite
              </span>
            </div>
            <input
              type="checkbox"
              checked={node.requiresValidation || false}
              onChange={(e) =>
                onUpdateNode(node.id, {
                  requiresValidation: e.target.checked,
                })
              }
              className="w-4 h-4 text-amber-600 rounded border-amber-300 focus:ring-amber-500 cursor-pointer"
            />
          </div>
          <p className="text-[10px] text-amber-800 leading-tight">
            Exige l'approbation d'un opérateur avant toute action sensible (email, prospect, financier, suppression).
          </p>
        </div>

        {/* Output Preview */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="font-semibold text-slate-700">Output Preview</label>
            <button
              onClick={handleCopy}
              className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors flex items-center gap-1"
              title="Copier le JSON"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
          <div className="relative p-3 bg-slate-900 text-emerald-400 rounded-lg font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800 shadow-inner">
            <pre>
              {testOutput ||
                node.config?.outputPreview ||
                `{\n  "type": "sales",\n  "score": 8.9,\n  "summary": "Interested in enterprise plan for team expansion."\n}`}
            </pre>
          </div>
        </div>

        {/* Action Buttons matching screenshot */}
        <div className="space-y-2 pt-1">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleTestNode}
              disabled={isTesting}
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-lg shadow-xs transition-colors"
            >
              {isTesting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-white" />
              )}
              <span>{isTesting ? 'Test...' : 'Test Node'}</span>
            </button>

            <button
              onClick={handleOptimizePrompt}
              disabled={isOptimizing}
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-xs transition-colors"
            >
              {isOptimizing ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Wand2 className="w-3.5 h-3.5" />
              )}
              <span>{isOptimizing ? 'Optimisation...' : 'Optimize'}</span>
            </button>
          </div>

          <button
            onClick={() => {
              alert('Nœud enregistré comme modèle dans votre bibliothèque NEXUS.');
            }}
            className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <BookmarkPlus className="w-3.5 h-3.5" />
            <span>Save as Template</span>
          </button>
        </div>

        {/* Suggested Flow Section matching screenshot */}
        <div className="pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-slate-800 text-xs">Suggested Flow</span>
            <span className="text-[10px] text-slate-400">Nexus Auto</span>
          </div>

          <div className="p-3 bg-white border border-dashed border-emerald-300 rounded-xl space-y-2">
            <p className="text-[11px] font-mono text-emerald-700 leading-relaxed font-medium">
              Typeform → Analyze Lead Message (AI) → Add to Google Sheets → Send Slack Alert → Auto Draft Email.
            </p>
            <p className="text-[10px] text-slate-400 leading-normal">
              Insert this structure into your canvas or adjust steps to fit your workflow.
            </p>
            <button
              onClick={onInsertSuggestedFlow}
              className="w-full py-1.5 px-3 border border-emerald-600/70 text-emerald-700 hover:bg-emerald-50 font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 text-xs"
            >
              <span>Insert to Canvas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
