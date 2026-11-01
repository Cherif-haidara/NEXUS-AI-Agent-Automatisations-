import React, { useRef, useState } from 'react';
import {
  Play,
  Sparkles,
  Table,
  Send,
  Mail,
  CheckCircle2,
  Database,
  MoreHorizontal,
  ShieldAlert,
  Loader2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  MousePointer,
  Hand,
  MessageSquare,
  Plus,
  Trash2,
} from 'lucide-react';
import { WorkflowNode, WorkflowEdge, NodeType } from '../types/workflow';

interface WorkflowCanvasProps {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string | null) => void;
  onUpdateNodePosition: (nodeId: string, position: { x: number; y: number }) => void;
  onDeleteNode?: (nodeId: string) => void;
  onDropNewNode: (nodeData: any, x: number, y: number) => void;
  onConnectNodes: (fromId: string, toId: string) => void;
  isTesting: boolean;
  activeExecutingNodeId: string | null;
}

export const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({
  nodes,
  edges,
  selectedNodeId,
  onSelectNode,
  onUpdateNodePosition,
  onDeleteNode,
  onDropNewNode,
  onConnectNodes,
  isTesting,
  activeExecutingNodeId,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [toolMode, setToolMode] = useState<'select' | 'pan' | 'comment'>('select');

  // Dragging node state
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Connecting node state
  const [connectingFromId, setConnectingFromId] = useState<string | null>(null);

  // Handle Canvas Drag & Drop from Toolbox
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const dataStr = e.dataTransfer.getData('application/json');
    if (!dataStr) return;

    try {
      const data = JSON.parse(dataStr);
      const rawX = (e.clientX - rect.left - pan.x) / zoom;
      const rawY = (e.clientY - rect.top - pan.y) / zoom;
      onDropNewNode(data, Math.round(rawX), Math.round(rawY));
    } catch (err) {
      console.error('Failed to parse dropped node', err);
    }
  };

  // Node Dragging Start
  const handleNodeMouseDown = (e: React.MouseEvent, node: WorkflowNode) => {
    if (toolMode === 'pan') return;
    e.stopPropagation();
    onSelectNode(node.id);

    setDraggingNodeId(node.id);
    setDragOffset({
      x: e.clientX / zoom - node.position.x,
      y: e.clientY / zoom - node.position.y,
    });
  };

  // Canvas Mouse Move (both for panning and node dragging)
  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingNodeId) {
      const newX = Math.max(20, Math.round(e.clientX / zoom - dragOffset.x));
      const newY = Math.max(20, Math.round(e.clientY / zoom - dragOffset.y));
      onUpdateNodePosition(draggingNodeId, { x: newX, y: newY });
    } else if (isPanning && toolMode === 'pan') {
      setPan({
        x: pan.x + (e.clientX - panStart.x),
        y: pan.y + (e.clientY - panStart.y),
      });
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setDraggingNodeId(null);
    setIsPanning(false);
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (toolMode === 'pan' || e.button === 1 || e.altKey) {
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
    } else {
      onSelectNode(null);
      setConnectingFromId(null);
    }
  };

  // Node dimension approximations for connector lines
  const getNodeDimensions = (type: NodeType) => {
    if (type === 'trigger') return { w: 110, h: 42 };
    if (type === 'system') return { w: 180, h: 46 };
    return { w: 230, h: 68 };
  };

  // Render SVG Bezier curve connecting lines
  const renderEdges = () => {
    return edges.map((edge) => {
      const sourceNode = nodes.find((n) => n.id === edge.from);
      const targetNode = nodes.find((n) => n.id === edge.to);
      if (!sourceNode || !targetNode) return null;

      const sourceDim = getNodeDimensions(sourceNode.type);
      const targetDim = getNodeDimensions(targetNode.type);

      const startX = sourceNode.position.x + sourceDim.w / 2;
      const startY = sourceNode.position.y + sourceDim.h;
      const endX = targetNode.position.x + targetDim.w / 2;
      const endY = targetNode.position.y;

      const deltaY = Math.max(40, (endY - startY) * 0.55);
      const pathData = `M ${startX} ${startY} C ${startX} ${startY + deltaY}, ${endX} ${endY - deltaY}, ${endX} ${endY}`;

      const isEdgeActive =
        isTesting &&
        (sourceNode.id === activeExecutingNodeId ||
          (sourceNode.status === 'success' && targetNode.status === 'running'));

      return (
        <g key={edge.id} className="transition-all duration-300">
          {/* Base connector line */}
          <path
            d={pathData}
            fill="none"
            stroke={isEdgeActive ? '#6366f1' : '#94a3b8'}
            strokeWidth={isEdgeActive ? 3 : 2}
            strokeDasharray={isEdgeActive ? '6,6' : 'none'}
            className={isEdgeActive ? 'animate-pulse' : ''}
            opacity={isEdgeActive ? 0.95 : 0.65}
          />

          {/* Animated energy bead during test run */}
          {isEdgeActive && (
            <circle r="4" fill="#4f46e5">
              <animateMotion
                path={pathData}
                dur="1.2s"
                repeatCount="indefinite"
              />
            </circle>
          )}

          {/* Small terminal dot at target node */}
          <circle cx={endX} cy={endY} r="3" fill="#64748b" />
        </g>
      );
    });
  };

  // Render individual Node card with exact styling from screenshot
  const renderNode = (node: WorkflowNode) => {
    const isSelected = selectedNodeId === node.id;
    const isExecuting = activeExecutingNodeId === node.id;

    // 1. TRIGGER NODE (Green pill matching screenshot)
    if (node.type === 'trigger') {
      return (
        <div
          key={node.id}
          style={{
            transform: `translate(${node.position.x}px, ${node.position.y}px)`,
          }}
          onMouseDown={(e) => handleNodeMouseDown(e, node)}
          className={`absolute cursor-pointer transition-shadow rounded-full select-none ${
            isSelected
              ? 'ring-3 ring-blue-500/80 shadow-md'
              : 'hover:shadow-sm'
          }`}
        >
          <div className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-full flex items-center gap-2 shadow-xs border border-emerald-500">
            <Play className="w-3.5 h-3.5 fill-white text-white" />
            <span className="text-xs font-bold tracking-wide">Trigger</span>
            {node.status === 'running' && (
              <Loader2 className="w-3 h-3 animate-spin text-white" />
            )}
            {node.status === 'success' && (
              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
            )}
          </div>
          {/* Bottom Connector Handle */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              setConnectingFromId(node.id);
            }}
            className="w-2.5 h-2.5 rounded-full bg-emerald-600 border border-white absolute -bottom-1.5 left-1/2 -translate-x-1/2 hover:scale-150 transition-transform cursor-crosshair"
            title="Connecter à un autre nœud"
          />
        </div>
      );
    }

    // 2. SYSTEM LOG COMPLETED NODE (Outlined blue card matching screenshot bottom)
    if (node.type === 'system' && node.label.includes('Completed')) {
      return (
        <div
          key={node.id}
          style={{
            transform: `translate(${node.position.x}px, ${node.position.y}px)`,
          }}
          onMouseDown={(e) => handleNodeMouseDown(e, node)}
          className={`absolute cursor-pointer transition-shadow rounded-xl select-none ${
            isSelected
              ? 'ring-3 ring-blue-500/80 shadow-md'
              : 'hover:shadow-sm'
          }`}
        >
          <div className="bg-blue-50/70 border border-blue-400 text-blue-700 px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-2xs hover:bg-blue-50 transition-colors">
            <CheckCircle2 className="w-4 h-4 text-blue-600 fill-blue-100" />
            <span className="text-xs font-bold">{node.label}</span>
          </div>
          {/* Top Connector Handle */}
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 border border-white absolute -top-1.5 left-1/2 -translate-x-1/2" />
        </div>
      );
    }

    // 3. STANDARD WORKFLOW NODES (AI Logic, Data, Slack Alert, Email Draft, Notion DB)
    const getNodeTheme = () => {
      switch (node.color) {
        case 'purple':
          return {
            border: 'border-purple-200 hover:border-purple-300',
            bg: 'bg-white',
            headerBg: 'bg-purple-50/50',
            iconBg: 'bg-purple-100 text-purple-600',
            tagColor: 'text-purple-700',
            Icon: Sparkles,
          };
        case 'orange':
          return {
            border: 'border-orange-200 hover:border-orange-300',
            bg: 'bg-white',
            headerBg: 'bg-orange-50/40',
            iconBg: 'bg-orange-100 text-orange-600',
            tagColor: 'text-orange-700',
            Icon: Send,
          };
        case 'emerald':
          return {
            border: 'border-emerald-200 hover:border-emerald-300',
            bg: 'bg-white',
            headerBg: 'bg-emerald-50/40',
            iconBg: 'bg-emerald-100 text-emerald-600',
            tagColor: 'text-emerald-700',
            Icon: Mail,
          };
        case 'blue':
        default:
          return {
            border: 'border-blue-200 hover:border-blue-300',
            bg: 'bg-white',
            headerBg: 'bg-blue-50/40',
            iconBg: 'bg-blue-100 text-blue-600',
            tagColor: 'text-blue-700',
            Icon: Table,
          };
      }
    };

    const theme = getNodeTheme();
    const NodeIcon = theme.Icon;

    return (
      <div
        key={node.id}
        style={{
          transform: `translate(${node.position.x}px, ${node.position.y}px)`,
          width: '230px',
        }}
        onMouseDown={(e) => handleNodeMouseDown(e, node)}
        className={`absolute rounded-xl border ${theme.border} ${theme.bg} shadow-xs cursor-pointer transition-all select-none group ${
          isSelected
            ? 'ring-2 ring-blue-500 shadow-md'
            : 'hover:shadow-sm'
        } ${isExecuting ? 'ring-2 ring-indigo-500 shadow-indigo-100' : ''}`}
      >
        {/* Top Connector Handle */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            if (connectingFromId && connectingFromId !== node.id) {
              onConnectNodes(connectingFromId, node.id);
              setConnectingFromId(null);
            }
          }}
          className="w-2.5 h-2.5 rounded-full bg-slate-300 border border-white absolute -top-1.5 left-1/2 -translate-x-1/2 hover:scale-150 hover:bg-blue-600 transition-all cursor-crosshair"
          title="Connecter à ce nœud"
        />

        {/* Card Content matching screenshot */}
        <div className="p-3">
          {/* Header row: Icon, Category tag, Menu */}
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-md ${theme.iconBg} flex items-center justify-center shrink-0`}
              >
                <NodeIcon className="w-3.5 h-3.5" />
              </div>
              <span className={`text-[11px] font-semibold ${theme.tagColor}`}>
                {node.type === 'ai-logic' ? 'AI Logic' : node.label.startsWith('Send') ? 'Action' : 'Data'}
              </span>
            </div>

            <div className="flex items-center gap-1">
              {node.requiresValidation && (
                <span
                  title="Validation explicite requise avant exécution"
                  className="p-0.5 rounded text-amber-600 hover:bg-amber-50"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                </span>
              )}
              {node.status === 'running' && (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
              )}
              {node.status === 'waiting-validation' && (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              )}
              {node.status === 'success' && (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectNode(node.id);
                }}
                className="text-slate-400 hover:text-slate-600 p-0.5 rounded"
              >
                <MoreHorizontal className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Title & Subtitle */}
          <div>
            <div className="text-xs font-semibold text-slate-800 tracking-tight truncate">
              {node.label}
            </div>
            <div className="text-[11px] text-slate-400 truncate mt-0.5">
              {node.sublabel}
            </div>
          </div>
        </div>

        {/* Bottom Connector Handle */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            setConnectingFromId(node.id);
          }}
          className={`w-2.5 h-2.5 rounded-full border border-white absolute -bottom-1.5 left-1/2 -translate-x-1/2 hover:scale-150 transition-all cursor-crosshair ${
            connectingFromId === node.id ? 'bg-blue-600 ring-2 ring-blue-300' : 'bg-slate-300 hover:bg-blue-600'
          }`}
          title="Tirer une connexion vers un autre nœud"
        />
      </div>
    );
  };

  return (
    <div
      ref={canvasRef}
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="flex-1 h-[calc(100vh-4rem)] relative bg-[#F8FAFC] canvas-grid-pattern overflow-hidden cursor-default select-none"
    >
      {/* Pan & Zoom Transformer Layer */}
      <div
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
          width: '100%',
          height: '100%',
        }}
        className="absolute inset-0 pointer-events-auto"
      >
        {/* SVG Connector Edges */}
        <svg
          className="absolute inset-0 w-[3000px] h-[3000px] pointer-events-none"
          style={{ overflow: 'visible' }}
        >
          {renderEdges()}
        </svg>

        {/* Workflow Nodes */}
        {nodes.map((node) => renderNode(node))}
      </div>

      {/* Floating Canvas Footer Controls matching screenshot bottom */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 px-3 py-1.5 bg-white/95 backdrop-blur-sm border border-slate-200/90 rounded-xl shadow-sm text-slate-600 select-none">
        {/* Zoom selector */}
        <div className="flex items-center gap-1 px-2 border-r border-slate-200">
          <button
            onClick={() => setZoom((z) => Math.max(0.4, Number((z - 0.1).toFixed(1))))}
            className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-800"
            title="Dézoomer"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs font-semibold tabular-nums text-slate-700 min-w-10 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(2.0, Number((z + 0.1).toFixed(1))))}
            className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-800"
            title="Zoomer"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tools: Pointer / Hand / Comment / Add */}
        <button
          onClick={() => setToolMode('select')}
          className={`p-1.5 rounded-lg transition-colors ${
            toolMode === 'select'
              ? 'bg-slate-100 text-blue-600 font-semibold'
              : 'hover:bg-slate-100 text-slate-500'
          }`}
          title="Mode sélection"
        >
          <MousePointer className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setToolMode('pan')}
          className={`p-1.5 rounded-lg transition-colors ${
            toolMode === 'pan'
              ? 'bg-slate-100 text-blue-600 font-semibold'
              : 'hover:bg-slate-100 text-slate-500'
          }`}
          title="Mode navigation / panoramique"
        >
          <Hand className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setToolMode('comment')}
          className={`p-1.5 rounded-lg transition-colors ${
            toolMode === 'comment'
              ? 'bg-slate-100 text-blue-600 font-semibold'
              : 'hover:bg-slate-100 text-slate-500'
          }`}
          title="Ajouter un commentaire ou note"
        >
          <MessageSquare className="w-3.5 h-3.5" />
        </button>

        <div className="w-[1px] h-4 bg-slate-200 mx-1" />

        <button
          onClick={() => {
            setPan({ x: 0, y: 0 });
            setZoom(1);
          }}
          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800"
          title="Réinitialiser la vue (100% centré)"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
