export type NodeType = 'trigger' | 'ai-logic' | 'data' | 'action' | 'ai' | 'system';

export type NodeColor = 'green' | 'purple' | 'blue' | 'orange' | 'emerald' | 'blue-outline' | 'slate';

export interface WorkflowNode {
  id: string;
  type: NodeType;
  label: string;
  sublabel: string;
  position: { x: number; y: number };
  color: NodeColor;
  status: 'idle' | 'running' | 'waiting-validation' | 'success' | 'failed';
  requiresValidation?: boolean;
  config?: {
    model?: string;
    prompt?: string;
    outputPreview?: string;
    spreadsheetId?: string;
    sheetName?: string;
    action?: string;
    channel?: string;
    template?: string;
    recipient?: string;
    subject?: string;
    database?: string;
    source?: string;
    eventType?: string;
    endpoint?: string;
    level?: string;
    logExecutionMetrics?: boolean;
    [key: string]: any;
  };
}

export interface WorkflowEdge {
  id: string;
  from: string;
  to: string;
  label?: string;
}

export type WorkflowStatus =
  | 'Brouillon'
  | 'En attente de validation'
  | 'Actif'
  | 'En cours'
  | 'Suspendu'
  | 'Terminé'
  | 'Échoué'
  | 'Archivé';

export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: WorkflowStatus;
  updatedAt: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  summary?: string;
}

export interface StepLog {
  nodeId: string;
  nodeLabel: string;
  timestamp: string;
  durationMs: number;
  status: 'success' | 'validated' | 'failed' | 'skipped';
  details: string;
}

export interface ExecutionReport {
  workflowId: string;
  workflowName: string;
  startedAt: string;
  finishedAt: string;
  totalDurationMs: number;
  status: 'Terminé' | 'Échoué' | 'Interrompu';
  logs: StepLog[];
  sensitiveActionsValidated: number;
}
