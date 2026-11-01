import { Workflow } from '../types/workflow';

export const INITIAL_MARKETING_FLOW: Workflow = {
  id: 'flow-marketing-lead-manager',
  name: 'Marketing Lead Manager',
  description: 'Qualification intelligente des prospects entrants avec classification par IA et alertes multi-canaux sécurisées.',
  status: 'Brouillon',
  updatedAt: '2m ago',
  summary: `NOM DU WORKFLOW : Marketing Lead Manager
OBJECTIF : Classifier instantanément les prospects entrants (Typeform), router vers Google Sheets et Notion, notifier l'équipe #sales sur Slack et préparer un brouillon d'email commercial sous validation humaine.
DÉCLENCHEUR : Formulaire Typeform entrant (événement webhook lead.submitted)
CONDITIONS : Classification IA du prospect ('sales', 'support', 'general') avec calcul de score d'intention.
ÉTAPES :
1. Réception du prospect via le déclencheur
2. Analyse du message et classification par IA (gemini-3.8-flash)
3. Enregistrement des données brutes dans Google Sheets
4. Alerte temps réel sur Slack canal #sales
5. Préparation automatique d'un brouillon Gmail pour l'équipe commerciale
6. Synchronisation de la fiche contact dans Notion DB
7. Journalisation de conformité et audit de complétion
OUTILS NÉCESSAIRES : Typeform, Gemini 3.8 Flash, Google Sheets, Slack, Gmail, Notion
DONNÉES UTILISÉES : Nom du contact, email, entreprise, message du lead, score d'intention calculé
VALIDATIONS REQUISES : Validation humaine explicite requise avant l'envoi de l'email commercial
RÉSULTAT ATTENDU : Temps de prise en charge réduit de 4 heures à moins de 2 minutes
GESTION DES ERREURS : En cas de défaillance réseau, mise en file d'attente sécurisée avec 3 tentatives automatiques
STATUT : Brouillon`,
  nodes: [
    {
      id: 'trigger-lead',
      type: 'trigger',
      label: 'Trigger',
      sublabel: 'Inbound Webhook',
      position: { x: 440, y: 60 },
      color: 'green',
      status: 'idle',
      config: {
        source: 'Typeform Form',
        eventType: 'lead.submitted',
        endpoint: 'https://api.nexus-ai.io/v1/hooks/tf-99',
      },
    },
    {
      id: 'ai-lead-analysis',
      type: 'ai-logic',
      label: 'AI Logic',
      sublabel: 'Analyze Lead Message',
      position: { x: 405, y: 175 },
      color: 'purple',
      status: 'idle',
      config: {
        model: 'gemini-3.8-flash',
        prompt: `Summarize the message and detect if it's sales, support, or general. Return JSON with fields: 'type', 'score', and 'summary'.`,
        outputPreview: `{\n  "type": "sales",\n  "score": 8.9,\n  "summary": "Interested in enterprise plan for team expansion."\n}`,
      },
    },
    {
      id: 'data-google-sheets',
      type: 'data',
      label: 'Data',
      sublabel: 'Add to Google Sheets',
      position: { x: 140, y: 320 },
      color: 'blue',
      status: 'idle',
      config: {
        spreadsheetId: 'Prospects_Enterprise_2026',
        sheetName: 'Inbound_Leads',
        action: 'append_row',
      },
    },
    {
      id: 'action-slack-sales',
      type: 'action',
      label: 'Send Slack Alert to #sales',
      sublabel: 'Support from {{Name}} -> {{Agent}}',
      position: { x: 380, y: 320 },
      color: 'orange',
      status: 'idle',
      config: {
        channel: '#sales',
        template: 'Nouveau prospect chaud qualifié: {{Name}} - Score {{score}}',
      },
    },
    {
      id: 'action-draft-email',
      type: 'action',
      label: 'Auto Draft Sales Email',
      sublabel: 'Gmail Drafts',
      position: { x: 670, y: 320 },
      color: 'emerald',
      status: 'idle',
      requiresValidation: true,
      config: {
        action: 'create_draft',
        recipient: 'prospect@enterprise.com',
        subject: 'NEXUS AI — Suite à votre demande de démo',
        template: 'Bonjour {{Name}},\n\nMerci pour votre intérêt pour la formule entreprise...',
      },
    },
    {
      id: 'notion-support-1',
      type: 'data',
      label: 'Add to Notion',
      sublabel: 'Add to Google Sheets',
      position: { x: 140, y: 470 },
      color: 'blue',
      status: 'idle',
      config: {
        database: 'Clients & Prospects DB',
      },
    },
    {
      id: 'action-slack-support',
      type: 'action',
      label: 'Notify Support in Slack',
      sublabel: 'Support from {{Name}} -> {{Agent}}',
      position: { x: 380, y: 470 },
      color: 'orange',
      status: 'idle',
      config: {
        channel: '#support-triage',
        template: 'Notification de suivi pour {{Name}}',
      },
    },
    {
      id: 'notion-support-2',
      type: 'data',
      label: 'Add to Notion',
      sublabel: 'Support DB',
      position: { x: 670, y: 470 },
      color: 'emerald',
      status: 'idle',
      config: {
        database: 'Support Escalations',
      },
    },
    {
      id: 'system-log-completed',
      type: 'system',
      label: 'Log Completed',
      sublabel: 'Execution Audit & Telemetry',
      position: { x: 420, y: 620 },
      color: 'blue-outline',
      status: 'idle',
      config: {
        level: 'AUDIT',
        logExecutionMetrics: true,
      },
    },
  ],
  edges: [
    { id: 'e1', from: 'trigger-lead', to: 'ai-lead-analysis' },
    { id: 'e2', from: 'ai-lead-analysis', to: 'data-google-sheets' },
    { id: 'e3', from: 'ai-lead-analysis', to: 'action-slack-sales' },
    { id: 'e4', from: 'ai-lead-analysis', to: 'action-draft-email' },
    { id: 'e5', from: 'data-google-sheets', to: 'notion-support-1' },
    { id: 'e6', from: 'action-slack-sales', to: 'action-slack-support' },
    { id: 'e7', from: 'action-draft-email', to: 'notion-support-2' },
    { id: 'e8', from: 'notion-support-1', to: 'system-log-completed' },
    { id: 'e9', from: 'action-slack-support', to: 'system-log-completed' },
    { id: 'e10', from: 'notion-support-2', to: 'system-log-completed' },
  ],
};
