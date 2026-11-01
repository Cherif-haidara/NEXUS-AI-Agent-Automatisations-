import React from 'react';
import { ShieldAlert, CheckCircle2, XCircle, AlertTriangle, Lock } from 'lucide-react';
import { WorkflowNode } from '../types/workflow';

interface ValidationModalProps {
  isOpen: boolean;
  pendingNode: WorkflowNode | null;
  onApprove: () => void;
  onReject: () => void;
}

export const ValidationModal: React.FC<ValidationModalProps> = ({
  isOpen,
  pendingNode,
  onApprove,
  onReject,
}) => {
  if (!isOpen || !pendingNode) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
      <div className="bg-white rounded-2xl shadow-2xl border border-amber-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Amber Safety Banner */}
        <div className="p-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">
                Validation Explicite Requise
              </h3>
              <p className="text-[11px] text-amber-100">
                Protocole de sécurité — Agent AUTOMATISATIONS NEXUS AI
              </p>
            </div>
          </div>
          <Lock className="w-4 h-4 text-amber-200" />
        </div>

        {/* Body content */}
        <div className="p-6 space-y-4 text-xs">
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
            <span className="font-semibold text-amber-900 block">
              Action Sensible Détectée :
            </span>
            <div className="text-slate-800 font-medium text-sm flex items-center gap-1.5">
              <span>{pendingNode.label}</span>
              <span className="text-slate-400 font-normal">({pendingNode.sublabel})</span>
            </div>
          </div>

          {/* Action details & payload inspect */}
          <div className="space-y-2">
            <span className="font-semibold text-slate-700 block">
              Détails de l'opération en attente :
            </span>
            <div className="bg-slate-900 text-slate-200 p-3.5 rounded-xl font-mono text-[11px] space-y-1.5 leading-relaxed border border-slate-800">
              <div className="text-emerald-400">
                // Service Cible : {pendingNode.sublabel || 'Service Externe'}
              </div>
              <div>Type d'opération : Création de brouillon / Contact prospect</div>
              <div>
                Destinataire : {pendingNode.config?.recipient || 'prospect@enterprise.com'}
              </div>
              <div>
                Objet : {pendingNode.config?.subject || 'Suite à votre demande de démo NEXUS AI'}
              </div>
              <div className="text-slate-400 pt-1 text-[10px]">
                Statut : En attente d'autorisation de l'opérateur
              </div>
            </div>
          </div>

          {/* System prompt rule reference */}
          <div className="flex items-start gap-2 text-slate-500 text-[11px] leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Conformément à la section 3 du système NEXUS AI, une demande de workflow ne constitue pas une autorisation automatique d'exécuter des actions irréversibles ou de contacter des tiers.
            </span>
          </div>
        </div>

        {/* Footer Decision Buttons */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
          <button
            onClick={onReject}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <XCircle className="w-4 h-4 text-slate-500" />
            <span>Refuser / Interrompre</span>
          </button>

          <button
            onClick={onApprove}
            className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/25 transition-all flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Approuver l'opération</span>
          </button>
        </div>
      </div>
    </div>
  );
};
