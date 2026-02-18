
import { SecurityLayer } from './types';

export const SECURITY_LAYERS: SecurityLayer[] = [
  { id: 1, name: "Network Perimeter", status: 'active', description: "Real-time traffic inspection and DDoS protection." },
  { id: 2, name: "Node Consensus", status: 'active', description: "Validation of decentralized node synchronization." },
  { id: 3, name: "Smart Contract Audit", status: 'active', description: "Continuous logic scanning and vulnerability detection." },
  { id: 4, name: "Cryptographic Hashing", status: 'active', description: "Sha-256 integrity checks for all incoming blocks." },
  { id: 5, name: "Cold Storage Protocol", status: 'active', description: "Air-gapped transaction signing for reserve assets." },
  { id: 6, name: "Multi-Sig Verification", status: 'active', description: "3-of-5 authorized signature requirement." },
  { id: 7, name: "Neural Threat Analysis", status: 'active', description: "Pattern matching for anomalous wallet behaviors." },
  { id: 8, name: "Zero-Knowledge Proofs", status: 'active', description: "Privacy-preserving identity and balance validation." },
  { id: 9, name: "Liquidity Sentinel", status: 'active', description: "Monitoring for flash-loan attacks and slippage." },
  { id: 10, name: "Decentralized ID", status: 'active', description: "Sovereign credential verification." },
  { id: 11, name: "Governance Bridge", status: 'active', description: "Security of cross-chain proposal routing." },
  { id: 12, name: "AI Sentinel", status: 'active', description: "The central autonomous decision engine." }
];

export const INITIAL_ALERTS = [
  { id: '1', timestamp: '14:23:01', severity: 'low', message: 'Unknown IP attempted port scan.', layer: 'Network Perimeter' },
  { id: '2', timestamp: '14:24:55', severity: 'medium', message: 'High slippage detected in Pool V3.', layer: 'Liquidity Sentinel' },
];