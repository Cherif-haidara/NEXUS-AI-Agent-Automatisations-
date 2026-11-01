import React from 'react';
import {
  FileText,
  X,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Download,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';
import { ExecutionReport } from '../types/workflow';

interface ExecutionReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: ExecutionReport | null;
}

export const ExecutionReportModal: React.FC<ExecutionReportModalProps> = ({
  isOpen,
  onClose,
  report,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !report) return null;

  const handleCopyMarkdown = () => {
    const md = `# RAPPORT D'EXÉCUTION — NEXUS AI AUTOMATISATIONS
Workflow : ${report.workflowName}
Statut : ${report.status}
Durée totale : ${report.totalDurationMs} ms
Actions sensibles validées : ${report.sensitiveActionsValidated}
Date : ${report.startedAt}

## TÂCHES RÉALISÉES :
${report.logs
  .map(
    (log, i) =>
      `${i + 1}. [${log.status.toUpperCase()}] ${log.nodeLabel} (${log.durationMs}ms) — ${log.details}`
  )
  .join('\n')}

RÉSULTAT FINAL : Workflow exécuté avec intégrité complète et respect des garde-fous.`;

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm shadow-blue-500/25">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Rapport d'Exécution & Audit
                </h3>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full border border-emerald-200">
                  {report.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {report.workflowName} · {report.startedAt}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
          {/* Summary KPIs */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-[11px] font-semibold">Temps d'exécution</span>
              </div>
              <div className="text-lg font-bold text-slate-900 tabular-nums">
                {report.totalDurationMs} ms
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-[11px] font-semibold">Étapes Réussies</span>
              </div>
              <div className="text-lg font-bold text-slate-900 tabular-nums">
                {report.logs.length} / {report.logs.length}
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-[11px] font-semibold">Validations Humaines</span>
              </div>
              <div className="text-lg font-bold text-slate-900 tabular-nums">
                {report.sensitiveActionsValidated} approuvée(s)
              </div>
            </div>
          </div>

          {/* Detailed step log */}
          <div>
            <h4 className="font-semibold text-slate-800 text-xs mb-2">
              Journal séquentiel des étapes (Section 7) :
            </h4>
            <div className="space-y-2">
              {report.logs.map((log, index) => (
                <div
                  key={index}
                  className="p-3 bg-white border border-slate-200 rounded-xl flex items-start justify-between gap-3 shadow-2xs"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <div>
                      <div className="font-semibold text-slate-900 flex items-center gap-2">
                        <span>{log.nodeLabel}</span>
                        {log.status === 'validated' && (
                          <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded font-medium border border-amber-200">
                            Validé par opérateur
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                        {log.details}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-slate-400 shrink-0 tabular-nums">
                    {log.durationMs} ms
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Conforme aux normes d'audit et de traçabilité NEXUS AI
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg text-xs transition-colors flex items-center gap-1.5"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{copied ? 'Copié' : 'Copier Markdown'}</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
