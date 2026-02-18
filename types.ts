export type VoiceName = 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr' | 'Echo' | 'Nova' | 'Orion';

export type AgentSpecialty = 'Infrastructure' | 'QuantumDefense' | 'Hashrate' | 'Consensus' | 'Vision2030' | 'Security' | 'Architect';

export interface AiAgent {
  id: number;
  specialty: AgentSpecialty;
  status: 'active' | 'processing' | 'standby';
  latency: number;
}

export interface SecurityLayer {
  id: number;
  name: string;
  status: 'active' | 'warning' | 'alert';
  description: string;
}

export interface SecurityAlert {
  id: string;
  timestamp: string;
  severity: 'high' | 'medium' | 'low' | 'institutional';
  message: string;
  layer: string;
  type?: 'security' | 'whale' | 'movement' | 'sell' | 'buy' | 'whale_deposit' | 'whale_withdrawal' | 'cex_alert' | 'institutional_buy' | 'institutional_sell';
  from?: string;
  to?: string;
  amount?: string;
  direction?: 'buy' | 'sell' | 'transfer';
  targetExchange?: string;
}

export interface TranscriptionItem {
  role: 'user' | 'sentinel';
  text: string;
  timestamp: number;
}

export interface AlertFilters {
  high: boolean;
  medium: boolean;
  low: boolean;
  institutional: boolean;
}

export interface Vulnerability {
  layer: number;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  category: 'Cryptographic' | 'Infrastructure' | 'Neural' | 'Consensus';
  title: string;
  description: string;
  mitigation: string;
}

export interface SentinelTask {
  id: string;
  title: string;
  layer: number;
  priority: 'Critical' | 'High' | 'Medium' | 'Standard';
  status: 'PENDING' | 'EXECUTING' | 'SECURED';
  timestamp: string;
}