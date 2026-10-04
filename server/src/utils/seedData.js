const initialCards = [
  {
    nodeId: 'node-cld-801',
    nodeCode: 'NODE // CLD-801',
    title: 'Cloud Migration Core Topology',
    category: 'Digital Transformation',
    status: 'IN PRODUCTION',
    statusType: 'production',
    description: 'Multi-region sovereign hybrid cloud failover topology featuring automated Kubernetes cluster synchronization.',
    tags: ['#Cloud', '#Kubernetes', '#FinOps'],
    metrics: [
      { label: 'AVAILABILITY', value: '99.995%', color: 'emerald' },
      { label: 'MONTHLY BURN', value: '-18.4%', color: 'emerald' }
    ],
    revision: 'Rev: 2.14 • Dr. Aris Thorne',
    author: 'Dr. Aris Thorne',
    position: { x: 80, y: 160 },
    dimensions: { width: 340, height: 290 },
    type: 'card',
    specifications: `# Cloud Migration Core Topology (CLD-801)

## Architecture Overview
This blueprint defines Ezera Tech's core multi-region hybrid cloud migration pattern designed for enterprise resilience and financial optimization.

### Key Highlights
- **Multi-Region Failover**: Automated active-passive failover with automated DNS health-checks under 5 seconds.
- **Kubernetes Cluster Sync**: Cluster-API driven gitops deployment with ArgoCD.
- **FinOps Telemetry**: Dynamic node scaling based on real-time traffic demand.

### RFC Compliance
- RFC-8802: Sovereign Data Residence Framework
- RFC-9104: Multi-Cloud Network Interconnect Standard`
  },
  {
    nodeId: 'node-aigov-9',
    nodeCode: 'AIGOV // 9',
    title: 'Autonomous AI Governance & ML Pipeline',
    category: 'Cloud Architecture',
    status: 'AUDIT GUARD ACTIVE',
    statusType: 'audit',
    description: 'Model validation telemetry, algorithmic alignment benchmarks, and cryptographic audit trails for enterprise workflows.',
    tags: ['#Governance', '#DataMesh', '#Pipeline'],
    metrics: [
      { label: 'MODEL DRIFT', value: '0.02% Δ', color: 'emerald' },
      { label: 'AUDIT STATUS', value: '100% Pass', color: 'gold' }
    ],
    revision: 'Rev: 1.09 • Dr. K. Chen',
    author: 'Dr. K. Chen',
    position: { x: 450, y: 260 },
    dimensions: { width: 340, height: 290 },
    type: 'card',
    specifications: `# Autonomous AI Governance & ML Pipeline (AIGOV // 9)

## Overview
Enterprise governance framework for machine learning lifecycles, model validation telemetry, and immutable audit logs.

### Key Capabilities
- **Algorithmic Alignment**: Continuous evaluation against safety benchmarks.
- **Cryptographic Audit Trail**: Ledger-backed execution signatures for all model inferences.
- **Data Mesh Integration**: Zero-trust data lineage tracing across enterprise pipelines.`
  },
  {
    nodeId: 'node-edge-r67',
    nodeCode: 'EDGE // R-67',
    title: 'Edge Compute Mesh & Resiliency Matrix',
    category: 'Enterprise Integration',
    status: 'ACTIVE-ACTIVE',
    statusType: 'active',
    description: 'Sub-millisecond localized inference clusters deployed across 48 sovereign edge locations globally.',
    tags: ['#Edge', '#MultiRegion', '#ActiveActive'],
    metrics: [
      { label: 'GLOBAL POPS', value: '48 Active', color: 'cyan' },
      { label: 'EDGE RTT', value: '0.8 ms', color: 'emerald' }
    ],
    revision: 'Rev: 4.11 • S. Larsson',
    author: 'S. Larsson',
    position: { x: 820, y: 300 },
    dimensions: { width: 340, height: 290 },
    type: 'card',
    specifications: `# Edge Compute Mesh & Resiliency Matrix (EDGE // R-67)

## Overview
Ultra-low-latency edge computing fabric for real-time mission critical transactions.

### Key Metrics
- Global Points of Presence (POPs): 48 Locations
- Latency (RTT): < 0.8 ms localized response times
- Active-Active Failover: Zero packet loss connection migration`
  },
  {
    nodeId: 'node-evt-462',
    nodeCode: 'FABRIC // EVT-462',
    title: 'Omnichannel Data Fabric Engine',
    category: 'Enterprise Integration',
    status: 'SYNCHRONIZED',
    statusType: 'synchronized',
    description: 'Distributed event streaming mesh linking enterprise legacy ERPs to cloud-native real-time datastores.',
    tags: ['#EventDriven', '#Kafka', '#DataMesh'],
    metrics: [
      { label: 'THROUGHPUT', value: '2.4 M/sec', color: 'cyan' },
      { label: 'LATENCY', value: '< 4ms', color: 'emerald' }
    ],
    revision: 'Rev: 3.02 • M. Vance',
    author: 'M. Vance',
    position: { x: 830, y: -20 },
    dimensions: { width: 340, height: 280 },
    type: 'card',
    specifications: `# Omnichannel Data Fabric Engine (EVT-462)

## Overview
Distributed event-driven architecture enabling sub-millisecond synchronization across enterprise core databases.`
  },
  {
    nodeId: 'node-sec-904',
    nodeCode: 'SEC // ZT-904',
    title: 'Zero-Trust IAM & Micro-Segmentation',
    category: 'Cyber Security',
    status: 'ENFORCED',
    statusType: 'enforced',
    description: 'Cryptographic identity verification for inter-service communication with dynamic mTLS certificate rotation.',
    tags: ['#CyberSecurity', '#ZeroTrust', '#IAM'],
    metrics: [
      { label: 'THREAT SCORE', value: '0.0 / 10', color: 'emerald' },
      { label: 'POLICY ROTATION', value: '15 min', color: 'gold' }
    ],
    revision: 'Rev: 5.10 • E. Rostova',
    author: 'E. Rostova',
    position: { x: 440, y: -90 },
    dimensions: { width: 340, height: 280 },
    type: 'card',
    specifications: `# Zero-Trust IAM & Micro-Segmentation (SEC // ZT-904)

## Security Specification
Strict identity-based micro-segmentation with automatic certificate authority rotation and granular perimeter rules.`
  }
];

const initialConnections = [
  {
    connectionId: 'conn-1',
    sourceNodeId: 'node-cld-801',
    targetNodeId: 'node-aigov-9',
    type: 'Active Production',
    label: 'Telemetry Stream',
    status: 'Continuous'
  },
  {
    connectionId: 'conn-2',
    sourceNodeId: 'node-aigov-9',
    targetNodeId: 'node-edge-r67',
    type: 'Active Production',
    label: 'Model Inference',
    status: 'Continuous'
  },
  {
    connectionId: 'conn-3',
    sourceNodeId: 'node-sec-904',
    targetNodeId: 'node-cld-801',
    type: 'Zero-Trust Encryption',
    label: 'mTLS Tunnel',
    status: 'Encrypted'
  },
  {
    connectionId: 'conn-4',
    sourceNodeId: 'node-evt-462',
    targetNodeId: 'node-edge-r67',
    type: 'Compliance & Governance',
    label: 'Event Mesh',
    status: 'Audited'
  }
];

const initialBoard = {
  boardId: 'global-hyper-mesh',
  name: 'Architecting Enterprise Digital Knowledge',
  topologyLayer: 'Layer: L3 - Global Hyper-Mesh',
  subtitle: 'Spatial canvas for international technology consulting architecture, enterprise solution topology, and cloud governance frameworks.',
  telemetryThreshold: 15,
  activeMeshFilters: {
    productionSplines: true,
    zeroTrustRoutes: true,
    complianceNodes: true
  },
  zoom: 1.0,
  pan: { x: 0, y: 0 }
};

module.exports = {
  initialCards,
  initialConnections,
  initialBoard
};
