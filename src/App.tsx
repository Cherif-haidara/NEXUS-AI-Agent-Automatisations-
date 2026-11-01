import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { SidebarRail, ActiveTab } from './components/SidebarRail';
import { TopBar } from './components/TopBar';
import { ToolboxPanel } from './components/ToolboxPanel';
import { WorkflowCanvas } from './components/WorkflowCanvas';
import { NodeInspector } from './components/NodeInspector';
import { AssistModal } from './components/AssistModal';
import { ValidationModal } from './components/ValidationModal';
import { ExecutionReportModal } from './components/ExecutionReportModal';
import { TriggersView } from './components/TriggersView';
import { IntegrationsView } from './components/IntegrationsView';
import { AnalyticsView } from './components/AnalyticsView';
import { INITIAL_MARKETING_FLOW } from './data/initialFlow';
import {
  Workflow,
  WorkflowNode,
  NodeType,
  NodeColor,
  ExecutionReport,
  StepLog,
} from './types/workflow';

export default function App() {
  const [workflow, setWorkflow] = useState<Workflow>(INITIAL_MARKETING_FLOW);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('ai-lead-analysis');
  const [isToolboxOpen, setIsToolboxOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('canvas');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isAssistOpen, setIsAssistOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [pendingValidationNode, setPendingValidationNode] = useState<WorkflowNode | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [executionReport, setExecutionReport] = useState<ExecutionReport | null>(null);

  // Execution engine state
  const [isTesting, setIsTesting] = useState(false);
  const [activeExecutingNodeId, setActiveExecutingNodeId] = useState<string | null>(null);

  const selectedNode = workflow.nodes.find((n) => n.id === selectedNodeId) || null;

  // Rename workflow
  const handleRenameWorkflow = (newName: string) => {
    setWorkflow((prev) => ({
      ...prev,
      name: newName,
      updatedAt: 'À l’instant',
    }));
  };

  // Update node position
  const handleUpdateNodePosition = (nodeId: string, position: { x: number; y: number }) => {
    setWorkflow((prev) => ({
      ...prev,
      nodes: prev.nodes.map((node) =>
        node.id === nodeId ? { ...node, position } : node
      ),
    }));
  };

  // Update node configuration
  const handleUpdateNode = (nodeId: string, updates: Partial<WorkflowNode>) => {
    setWorkflow((prev) => ({
      ...prev,
      nodes: prev.nodes.map((node) =>
        node.id === nodeId ? { ...node, ...updates } : node
      ),
    }));
  };

  // Delete node
  const handleDeleteNode = (nodeId: string) => {
    setWorkflow((prev) => ({
      ...prev,
      nodes: prev.nodes.filter((node) => node.id !== nodeId),
      edges: prev.edges.filter((e) => e.from !== nodeId && e.to !== nodeId),
    }));
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null);
    }
  };

  // Add new node from Toolbox click or drop
  const handleAddNode = (
    type: NodeType,
    color: NodeColor,
    label: string,
    sublabel: string,
    position?: { x: number; y: number }
  ) => {
    const newNodeId = `node-${Date.now().toString(36)}`;
    const defaultPos = position || {
      x: 350 + Math.floor(Math.random() * 80),
      y: 200 + Math.floor(Math.random() * 80),
    };

    const newNode: WorkflowNode = {
      id: newNodeId,
      type,
      label,
      sublabel,
      position: defaultPos,
      color,
      status: 'idle',
      requiresValidation: label.toLowerCase().includes('email') || label.toLowerCase().includes('draft'),
      config: {
        model: 'gemini-3.8-flash',
        prompt: `Action pour le nœud ${label}`,
        outputPreview: `{\n  "status": "success",\n  "node": "${label}"\n}`,
      },
    };

    setWorkflow((prev) => ({
      ...prev,
      nodes: [...prev.nodes, newNode],
    }));
    setSelectedNodeId(newNodeId);
  };

  const handleDropNewNode = (data: any, x: number, y: number) => {
    handleAddNode(
      data.type || 'action',
      data.color || 'blue',
      data.label || 'New Block',
      data.sublabel || 'Configured Node',
      { x, y }
    );
  };

  // Connect two nodes with an edge
  const handleConnectNodes = (fromId: string, toId: string) => {
    if (fromId === toId) return;
    const existing = workflow.edges.find((e) => e.from === fromId && e.to === toId);
    if (existing) return;

    const newEdge = {
      id: `e-${Date.now().toString(36)}`,
      from: fromId,
      to: toId,
    };

    setWorkflow((prev) => ({
      ...prev,
      edges: [...prev.edges, newEdge],
    }));
  };

  // Insert Suggested Flow from Inspector
  const handleInsertSuggestedFlow = () => {
    alert('Structure Typeform → Gemini IA → Google Sheets → Slack #sales intégrée au canevas.');
  };

  // Apply workflow from AI Assist
  const handleApplyGeneratedWorkflow = (gen: Partial<Workflow>) => {
    setWorkflow((prev) => ({
      ...prev,
      name: gen.name || prev.name,
      description: gen.description || prev.description,
      summary: gen.summary || prev.summary,
      nodes: gen.nodes && gen.nodes.length > 0 ? gen.nodes : prev.nodes,
      edges: gen.edges && gen.edges.length > 0 ? gen.edges : prev.edges,
      status: 'Brouillon',
      updatedAt: 'À l’instant',
    }));
    if (gen.nodes && gen.nodes.length > 0) {
      setSelectedNodeId(gen.nodes[1]?.id || gen.nodes[0]?.id || null);
    }
  };

  // Publish flow with celebratory feedback
  const handlePublishFlow = () => {
    setWorkflow((prev) => ({
      ...prev,
      status: 'Actif',
      updatedAt: 'Publié maintenant',
    }));

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.2 },
    });
  };

  // Execution Engine (Live test of the workflow step-by-step with validation pause)
  const handleTestFlow = async () => {
    if (isTesting) return;
    setIsTesting(true);

    const logs: StepLog[] = [];
    const startTime = Date.now();

    // Reset node states
    setWorkflow((prev) => ({
      ...prev,
      status: 'En cours',
      nodes: prev.nodes.map((n) => ({ ...n, status: 'idle' })),
    }));

    const executionSequence = [
      'trigger-lead',
      'ai-lead-analysis',
      'data-google-sheets',
      'action-slack-sales',
      'action-draft-email',
      'notion-support-1',
      'action-slack-support',
      'notion-support-2',
      'system-log-completed',
    ];

    let validatedCount = 0;

    for (const nodeId of executionSequence) {
      const node = workflow.nodes.find((n) => n.id === nodeId);
      if (!node) continue;

      setActiveExecutingNodeId(nodeId);
      setWorkflow((prev) => ({
        ...prev,
        nodes: prev.nodes.map((n) =>
          n.id === nodeId ? { ...n, status: 'running' } : n
        ),
      }));

      // Check if node requires explicit human validation (Section 3 & 9)
      if (node.requiresValidation) {
        setWorkflow((prev) => ({
          ...prev,
          status: 'En attente de validation',
          nodes: prev.nodes.map((n) =>
            n.id === nodeId ? { ...n, status: 'waiting-validation' } : n
          ),
        }));

        setPendingValidationNode(node);
        setIsValidationModalOpen(true);

        // Wait for human approval via Promise
        const approved = await new Promise<boolean>((resolve) => {
          (window as any).__resolveValidation = resolve;
        });

        setIsValidationModalOpen(false);
        setPendingValidationNode(null);

        if (!approved) {
          // Interrupted by operator
          logs.push({
            nodeId: node.id,
            nodeLabel: node.label,
            timestamp: new Date().toLocaleTimeString(),
            durationMs: 80,
            status: 'failed',
            details: 'Opération interrompue par l’opérateur de sécurité (Refus explicite)',
          });

          setWorkflow((prev) => ({
            ...prev,
            status: 'Suspendu',
            nodes: prev.nodes.map((n) =>
              n.id === nodeId ? { ...n, status: 'failed' } : n
            ),
          }));
          setIsTesting(false);
          setActiveExecutingNodeId(null);
          return;
        }

        validatedCount++;
        logs.push({
          nodeId: node.id,
          nodeLabel: node.label,
          timestamp: new Date().toLocaleTimeString(),
          durationMs: 145,
          status: 'validated',
          details: `Autorisation accordée par l'opérateur pour ${node.sublabel}. Brouillon créé sans envoi incontrôlé.`,
        });
      } else {
        // Standard non-sensitive execution
        await new Promise((r) => setTimeout(r, 450));
        logs.push({
          nodeId: node.id,
          nodeLabel: node.label,
          timestamp: new Date().toLocaleTimeString(),
          durationMs: 120 + Math.floor(Math.random() * 80),
          status: 'success',
          details: `Exécution nominale de ${node.sublabel || node.label}`,
        });
      }

      setWorkflow((prev) => ({
        ...prev,
        nodes: prev.nodes.map((n) =>
          n.id === nodeId ? { ...n, status: 'success' } : n
        ),
      }));
    }

    const totalDuration = Date.now() - startTime;
    setActiveExecutingNodeId(null);
    setIsTesting(false);

    setWorkflow((prev) => ({
      ...prev,
      status: 'Terminé',
    }));

    const finalReport: ExecutionReport = {
      workflowId: workflow.id,
      workflowName: workflow.name,
      startedAt: new Date(startTime).toLocaleTimeString(),
      finishedAt: new Date().toLocaleTimeString(),
      totalDurationMs: totalDuration,
      status: 'Terminé',
      logs,
      sensitiveActionsValidated: validatedCount,
    };

    setExecutionReport(finalReport);
    setIsReportModalOpen(true);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.3 },
    });
  };

  const handleApproveValidation = () => {
    if ((window as any).__resolveValidation) {
      (window as any).__resolveValidation(true);
    }
  };

  const handleRejectValidation = () => {
    if ((window as any).__resolveValidation) {
      (window as any).__resolveValidation(false);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 font-sans antialiased">
      {/* 1. Left Navigation Rail */}
      <SidebarRail
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingValidationCount={pendingValidationNode ? 1 : 0}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        {/* 2. Top Header Bar matching screenshot */}
        <TopBar
          workflowName={workflow.name}
          onRename={handleRenameWorkflow}
          status={workflow.status}
          lastSaved={workflow.updatedAt}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenAssist={() => setIsAssistOpen(true)}
          onTestFlow={handleTestFlow}
          onPublishFlow={handlePublishFlow}
          isTesting={isTesting}
        />

        {/* 3. Middle Viewport */}
        {activeTab === 'canvas' && (
          <div className="flex-1 flex min-w-0 overflow-hidden relative">
            {/* Left Toolbox Panel */}
            <ToolboxPanel
              onAddNode={handleAddNode}
              isOpen={isToolboxOpen}
              onToggle={() => setIsToolboxOpen(!isToolboxOpen)}
            />

            {/* Central Interactive Flow Canvas */}
            <WorkflowCanvas
              nodes={workflow.nodes}
              edges={workflow.edges}
              selectedNodeId={selectedNodeId}
              onSelectNode={setSelectedNodeId}
              onUpdateNodePosition={handleUpdateNodePosition}
              onDeleteNode={handleDeleteNode}
              onDropNewNode={handleDropNewNode}
              onConnectNodes={handleConnectNodes}
              isTesting={isTesting}
              activeExecutingNodeId={activeExecutingNodeId}
            />

            {/* Right Node Inspector */}
            {selectedNode && (
              <NodeInspector
                node={selectedNode}
                onClose={() => setSelectedNodeId(null)}
                onUpdateNode={handleUpdateNode}
                onDeleteNode={handleDeleteNode}
                onInsertSuggestedFlow={handleInsertSuggestedFlow}
              />
            )}
          </div>
        )}

        {/* Alternate Tab: Triggers View (Section 5) */}
        {activeTab === 'triggers' && <TriggersView />}

        {/* Alternate Tab: Integrations View (Section 8) */}
        {activeTab === 'integrations' && <IntegrationsView />}

        {/* Alternate Tab: Analytics View */}
        {activeTab === 'analytics' && <AnalyticsView />}

        {/* Alternate Tab: Reports View (Section 4 Étape 8) */}
        {activeTab === 'reports' && (
          <div className="flex-1 p-8 overflow-y-auto">
            {executionReport ? (
              <div className="max-w-3xl mx-auto space-y-4">
                <h2 className="text-xl font-bold text-slate-900">Dernier Rapport d'Exécution</h2>
                <button
                  onClick={() => setIsReportModalOpen(true)}
                  className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg text-xs"
                >
                  Ouvrir la vue complète du rapport
                </button>
              </div>
            ) : (
              <div className="max-w-md mx-auto mt-20 text-center p-8 bg-white border border-slate-200 rounded-2xl shadow-xs">
                <p className="text-sm text-slate-600 mb-4">
                  Aucune exécution enregistrée pour le moment. Cliquez sur <strong>Test Flow</strong> pour lancer une simulation avec journal d'audit.
                </p>
                <button
                  onClick={handleTestFlow}
                  className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg text-xs"
                >
                  Lancer Test Flow
                </button>
              </div>
            )}
          </div>
        )}

        {/* Alternate Tab: Human Validations Center (Section 3 & 9) */}
        {activeTab === 'validations' && (
          <div className="flex-1 p-8 overflow-y-auto max-w-4xl mx-auto space-y-6">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Centre de Validation Humaine & Sécurité
            </h2>
            <p className="text-xs text-slate-500">
              Surveillance et approbation des actions sensibles avant déclenchement.
            </p>
            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3">
              <span className="text-xs font-semibold text-slate-700">Règles actives du système :</span>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                <li>Validation requise avant envoi d'email ou publication de contenu</li>
                <li>Validation requise avant contact prospect ou opération financière</li>
                <li>Journalisation systématique de chaque décision d'opérateur</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* 4. Assistant Modal: "Generate with Assist" (NEXUS AI System Prompt) */}
      <AssistModal
        isOpen={isAssistOpen}
        onClose={() => setIsAssistOpen(false)}
        onApplyWorkflow={handleApplyGeneratedWorkflow}
      />

      {/* 5. Human Validation Gatekeeper Modal */}
      <ValidationModal
        isOpen={isValidationModalOpen}
        pendingNode={pendingValidationNode}
        onApprove={handleApproveValidation}
        onReject={handleRejectValidation}
      />

      {/* 6. Execution Report Modal (Étape 8: Rapporter) */}
      <ExecutionReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        report={executionReport}
      />
    </div>
  );
}
