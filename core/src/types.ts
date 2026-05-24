/**
 * Core Consulting Engine
 * 
 * This module implements the structured consulting analysis framework
 * following McKinsey/BCG/Bain principles with 9-component deep analysis
 */

export interface BusinessProblem {
  title: string;
  description: string;
  context: string;
  industry: string;
  companySize: 'startup' | 'scale-up' | 'mid-market' | 'enterprise';
  firmStyle: 'mckinsey' | 'bcg' | 'bain' | 'accenture';
  reportTemplate?: 'conversion-led' | 'growth-strategy' | 'execution-excellence' | 'tech-enabled';
  timeframe: string;
}

export interface ConsultingAnalysis {
  problemDiagnosis: ProblemDiagnosis;
  problemStructuring: ProblemStructuring;
  deepDiveAnalysis: DeepDiveAnalysis;
  rootCauseAnalysis: RootCauseAnalysis;
  strategicOptions: StrategicOption[];
  finalRecommendation: FinalRecommendation;
  executionPlan: ExecutionPlan;
  kpiTrackingSystem: KPITrackingSystem;
  risksAndMitigation: RiskMitigation[];
}

export interface ProblemDiagnosis {
  restatedProblem: string;
  businessContext: string;
  problemClassification: {
    type: 'growth' | 'retention' | 'cost' | 'market-entry' | 'product' | 'operational';
    reasoning: string;
  };
  initialScope: string;
  stakeholders: string[];
}

export interface ProblemStructuring {
  issuTree: IssueTreeNode;
  meceBuckets: string[];
  keyAnalyticalQuestions: string[];
  scopeAndBoundaries: string;
}

export interface IssueTreeNode {
  level: number;
  question: string;
  children: IssueTreeNode[];
}

export interface DeepDiveAnalysis {
  market?: MarketAnalysis;
  customer?: CustomerAnalysis;
  product?: ProductAnalysis;
  operations?: OperationsAnalysis;
  financial?: FinancialAnalysis;
}

export interface MarketAnalysis {
  marketSize: {
    tam: string;
    sam: string;
    som: string;
  };
  growth: string;
  competitiveMapping: string;
  trends: string[];
  insights: string[];
  evidence: string;
  implications: string;
}

export interface CustomerAnalysis {
  segments: {
    name: string;
    size: string;
    behavior: string;
    painPoints: string[];
  }[];
  buyingProcess: string;
  retention: string;
  nps: string;
  insights: string[];
  implications: string;
}

export interface ProductAnalysis {
  positioning: string;
  featureGaps: string[];
  uxIssues: string[];
  competitiveAdvantage: string[];
  productMarketFit: string;
  insights: string[];
  implications: string;
}

export interface OperationsAnalysis {
  processEfficiencies: string[];
  bottlenecks: string[];
  costDrivers: string[];
  scalingChallenges: string[];
  insights: string[];
  implications: string;
}

export interface FinancialAnalysis {
  revenueDrivers: string[];
  costStructure: string[];
  profitability: string;
  unitEconomics: string;
  keyMetrics: Record<string, string>;
  insights: string[];
  implications: string;
}

export interface RootCauseAnalysis {
  causes: {
    cause: string;
    evidence: string;
    whyItExists: string;
    priority: 'critical' | 'high' | 'medium';
    isSymptom: boolean;
  }[];
  coreIssue: string;
  hypotheses: string[];
}

export interface StrategicOption {
  name: string;
  description: string;
  mechanism: string;
  pros: string[];
  cons: string[];
  whenToUse: string;
  requiredCapabilities: string[];
  investmentRequired: 'low' | 'medium' | 'high';
  timeToValue: string;
}

export interface FinalRecommendation {
  clearDecision: string;
  decision: string;
  justification: string;
  whyThisOption: string;
  expectedImpact: {
    businessGrowth?: string;
    costReduction?: string;
    retentionLift?: string;
    revenueIncrease?: string;
    marketPosition?: string;
  };
  tradeOffs: {
    what: string;
    why: string;
    acceptableRisk: boolean;
  }[];
  partnerLevelInsight: string;
  successCriteria: string[];
}

export interface ExecutionPlan {
  phase1: Phase;
  phase2: Phase;
  phase3: Phase;
  dependencies: string[];
  criticalPath: string;
}

export interface Phase {
  name: string;
  duration: string;
  actions: {
    action: string;
    owner: string;
    deadline: string;
    deliverable: string;
  }[];
  milestones: string[];
  dependencies: string[];
  successMetrics: string[];
}

export interface KPITrackingSystem {
  leadingIndicators: {
    name: string;
    measurement: string;
    frequency: string;
    linkedToAction: string;
    target: string;
  }[];
  laggingIndicators: {
    name: string;
    measurement: string;
    frequency: string;
    linkedToAction: string;
    target: string;
  }[];
  dashboardMetrics: string[];
  reviewCadence: string;
}

export interface RiskMitigation {
  risk: string;
  description: string;
  impact: 'critical' | 'high' | 'medium' | 'low';
  probability: 'certain' | 'likely' | 'possible' | 'unlikely';
  mitigationStrategy: string;
  contingencyPlan: string;
  owner: string;
}
