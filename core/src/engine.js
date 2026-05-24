"use strict";
/**
 * Consulting Engine Implementation
 *
 * Main orchestration of the 9-component analysis framework
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsultingEngine = void 0;
class ConsultingEngine {
    constructor(problem) {
        this.problem = problem;
    }
    async generateAnalysis() {
        // Execute analysis in sequence following consulting methodology
        const problemDiagnosis = await this.diagnoseProblme();
        const problemStructuring = await this.structureProblem(problemDiagnosis);
        const deepDiveAnalysis = await this.conductDeepDive(problemStructuring);
        const rootCauseAnalysis = await this.identifyRootCauses(deepDiveAnalysis);
        const strategicOptions = await this.developStrategicOptions(rootCauseAnalysis);
        const finalRecommendation = await this.formulateRecommendation(strategicOptions, rootCauseAnalysis);
        const executionPlan = await this.createExecutionPlan(finalRecommendation);
        const kpiTrackingSystem = await this.designKPISystem(finalRecommendation, executionPlan);
        const risksAndMitigation = await this.assessRisks(executionPlan);
        return {
            problemDiagnosis,
            problemStructuring,
            deepDiveAnalysis,
            rootCauseAnalysis,
            strategicOptions,
            finalRecommendation,
            executionPlan,
            kpiTrackingSystem,
            risksAndMitigation,
        };
    }
    async diagnoseProblme() {
        // STEP 1: Problem Diagnosis
        return {
            restatedProblem: this.problem.description,
            businessContext: this.problem.context,
            problemClassification: {
                type: this.classifyProblem(),
                reasoning: `Based on context analysis, this is classified as ${this.classifyProblem()} because:
        - Key indicators from provided description
        - Industry-specific factors
        - Firm-specific focus areas`,
            },
            initialScope: `Focus area: ${this.problem.description}. Company size: ${this.problem.companySize}. Industry: ${this.problem.industry}`,
            stakeholders: this.identifyStakeholders(),
        };
    }
    async structureProblem(diagnosis) {
        // STEP 2: Problem Structuring - MECE breakdown
        return {
            issuTree: this.buildIssueTree(),
            meceBuckets: this.createMECEBuckets(),
            keyAnalyticalQuestions: this.formulateAnalyticalQuestions(),
            scopeAndBoundaries: `
        In-Scope: Core problem areas directly related to ${diagnosis.restatedProblem}
        Out-of-Scope: Adjacent issues that require separate engagement
        Timeframe: ${this.problem.timeframe}
      `,
        };
    }
    async conductDeepDive(structuring) {
        // STEP 3: Deep Dive Analysis
        return {
            market: this.analyzeMarket(),
            customer: this.analyzeCustomer(),
            product: this.analyzeProduct(),
            operations: this.analyzeOperations(),
            financial: this.analyzeFinancial(),
        };
    }
    async identifyRootCauses(deepDive) {
        // STEP 4: Root Cause Analysis
        return {
            causes: [
                {
                    cause: 'Primary underlying issue affecting business outcomes',
                    evidence: 'Specific data supporting this cause',
                    whyItExists: 'Root reason this issue persists in organization',
                    priority: 'critical',
                    isSymptom: false,
                },
            ],
            coreIssue: 'The single most critical issue to address',
            hypotheses: ['Hypothesis 1', 'Hypothesis 2', 'Hypothesis 3'],
        };
    }
    async developStrategicOptions(rootCause) {
        // STEP 5: Strategic Options - 2-4 detailed alternatives
        return [
            {
                name: 'Option 1: Core Strategic Path',
                description: 'Description of first strategic approach',
                mechanism: 'How this option works and creates value',
                pros: ['Advantage 1', 'Advantage 2', 'Advantage 3'],
                cons: ['Constraint 1', 'Constraint 2'],
                whenToUse: 'Appropriate scenario for this option',
                requiredCapabilities: ['Capability 1', 'Capability 2'],
                investmentRequired: 'medium',
                timeToValue: '3-6 months',
            },
            {
                name: 'Option 2: Alternative Path',
                description: 'Description of second approach',
                mechanism: 'Different mechanism for value creation',
                pros: ['Advantage 1', 'Advantage 2'],
                cons: ['Constraint 1', 'Constraint 2', 'Constraint 3'],
                whenToUse: 'When first option is not viable',
                requiredCapabilities: ['Capability 1', 'Capability 2'],
                investmentRequired: 'high',
                timeToValue: '6-12 months',
            },
        ];
    }
    async formulateRecommendation(options, rootCause) {
        // STEP 6: Final Recommendation - PARTNER LEVEL
        return {
            clearDecision: 'Recommended option selection',
            decision: 'The specific path forward',
            justification: 'Why this is the right choice',
            whyThisOption: `
        This option is recommended because:
        1. Direct alignment with root causes identified
        2. Optimal risk-return profile for company stage
        3. Leverages existing capabilities and resources
        4. Fastest path to measurable business impact
      `,
            expectedImpact: {
                businessGrowth: '+15-20% YoY growth within 12 months',
                costReduction: '-10-15% operational costs through efficiency',
                retentionLift: '+8-12% customer retention improvement',
                revenueIncrease: '+$2-5M incremental revenue annually',
                marketPosition: 'Strengthen market leadership in core segment',
            },
            tradeOffs: [
                {
                    what: 'Short-term investment required',
                    why: 'To build capabilities and infrastructure',
                    acceptableRisk: true,
                },
                {
                    what: 'Organizational restructuring',
                    why: 'To align with new strategic direction',
                    acceptableRisk: true,
                },
            ],
            partnerLevelInsight: `
        This is not just an operational fix—it's a strategic repositioning 
        that fundamentally changes how the company competes. The key is 
        integrated execution across all dimensions simultaneously. We recommend 
        bold action in first 100 days to establish momentum.
      `,
            successCriteria: [
                'First leading indicator achieved within 30 days',
                'Organizational alignment confirmed in 60 days',
                'Initial revenue impact visible in 90 days',
            ],
        };
    }
    async createExecutionPlan(recommendation) {
        // STEP 7: Execution Plan - Highly Detailed Phases
        return {
            phase1: {
                name: 'Immediate Foundation (0-30 days)',
                duration: '1 month',
                actions: [
                    {
                        action: 'Establish cross-functional steering committee',
                        owner: 'CEO',
                        deadline: 'Day 5',
                        deliverable: 'Committee charter and meeting cadence',
                    },
                    {
                        action: 'Communicate strategic decision to organization',
                        owner: 'Chief Strategy Officer',
                        deadline: 'Day 7',
                        deliverable: 'All-hands presentation and FAQ document',
                    },
                    {
                        action: 'Quick win project—address lowest hanging fruit',
                        owner: 'Operations Lead',
                        deadline: 'Day 30',
                        deliverable: '10-15% improvement in targeted metric',
                    },
                ],
                milestones: ['Team alignment achieved', 'First quick win delivered', 'Resource plan finalized'],
                dependencies: [],
                successMetrics: [
                    'Organization adoption: 80%+',
                    'Quick win metric: +10%',
                    'Resource commitment: 100%',
                ],
            },
            phase2: {
                name: 'Accelerated Build (1-3 months)',
                duration: '3 months',
                actions: [
                    {
                        action: 'Launch capability-building initiative',
                        owner: 'CTO/VP Product',
                        deadline: 'Month 2',
                        deliverable: 'Revised product roadmap',
                    },
                    {
                        action: 'Implement enhanced customer feedback loops',
                        owner: 'Chief Commercial Officer',
                        deadline: 'Month 2',
                        deliverable: 'Quarterly insights report',
                    },
                    {
                        action: 'Scale quick win to full implementation',
                        owner: 'Operations Lead',
                        deadline: 'Month 3',
                        deliverable: 'Full-scale deployment',
                    },
                ],
                milestones: [
                    'Capability investments green-lit',
                    'Customer feedback system operational',
                    'Pilot expansion launched',
                ],
                dependencies: ['Phase 1 completion'],
                successMetrics: [
                    'Capability readiness: 60%',
                    'Customer engagement: +25%',
                    'Pipeline: +30%',
                ],
            },
            phase3: {
                name: 'Sustained Excellence (3-12 months)',
                duration: '9 months',
                actions: [
                    {
                        action: 'Full market expansion',
                        owner: 'SVP Sales',
                        deadline: 'Month 6',
                        deliverable: 'Market entry in 3 new segments',
                    },
                    {
                        action: 'Advanced analytics and optimization',
                        owner: 'Chief Analytics Officer',
                        deadline: 'Month 9',
                        deliverable: 'Real-time optimization dashboard',
                    },
                    {
                        action: 'Continuous strategic refinement',
                        owner: 'CEO',
                        deadline: 'Month 12',
                        deliverable: 'Strategic refresh plan',
                    },
                ],
                milestones: [
                    'Market expansion targets met',
                    'Optimization systems operational',
                    'Year 1 results celebrated',
                ],
                dependencies: ['Phase 2 completion'],
                successMetrics: [
                    'Revenue target: +$5M',
                    'Market share: +3-5%',
                    'Team retention: 95%+',
                ],
            },
            dependencies: ['Board approval', 'Budget allocation', 'Key executive commitments'],
            criticalPath: 'Phase 1 steering → Phase 2 capability build → Phase 3 market expansion',
        };
    }
    async designKPISystem(recommendation, executionPlan) {
        // STEP 8: KPI Tracking System
        return {
            leadingIndicators: [
                {
                    name: 'Weekly steering committee health check',
                    measurement: 'Action items closure rate (%)',
                    frequency: 'Weekly',
                    linkedToAction: 'Phase 1 steering committee',
                    target: '90%+',
                },
                {
                    name: 'Team capability build progress',
                    measurement: 'Training hours completed / training hours planned',
                    frequency: 'Bi-weekly',
                    linkedToAction: 'Phase 2 capability building',
                    target: '100%',
                },
                {
                    name: 'Customer feedback sentiment',
                    measurement: 'NPS score / Customer satisfaction survey',
                    frequency: 'Monthly',
                    linkedToAction: 'Phase 2 feedback loops',
                    target: '+5 NPS points vs baseline',
                },
                {
                    name: 'Sales pipeline quality',
                    measurement: 'Deal velocity score',
                    frequency: 'Weekly',
                    linkedToAction: 'Phase 3 market expansion',
                    target: '+25% vs phase 1',
                },
            ],
            laggingIndicators: [
                {
                    name: 'Total revenue growth',
                    measurement: '$M YoY growth',
                    frequency: 'Monthly',
                    linkedToAction: 'All phases',
                    target: '+15-20% YoY',
                },
                {
                    name: 'Customer retention rate',
                    measurement: 'Net retention rate (%)',
                    frequency: 'Monthly',
                    linkedToAction: 'All customer-facing initiatives',
                    target: '+8-12 percentage points',
                },
                {
                    name: 'Market share',
                    measurement: 'Share of addressable market (%)',
                    frequency: 'Quarterly',
                    linkedToAction: 'Phase 3 expansion',
                    target: '+3-5 percentage points',
                },
                {
                    name: 'Operating margin',
                    measurement: 'EBITDA margin (%)',
                    frequency: 'Monthly',
                    linkedToAction: 'Phase 2 operational efficiency',
                    target: '+5-8 percentage points',
                },
            ],
            dashboardMetrics: [
                'Weekly steering KPIs',
                'Monthly financial health',
                'Monthly customer metrics',
                'Monthly market performance',
            ],
            reviewCadence: 'Weekly steering, Monthly board update, Quarterly strategic review',
        };
    }
    async assessRisks(executionPlan) {
        // STEP 9: Risks & Mitigation
        return [
            {
                risk: 'Organizational resistance to change',
                description: 'Teams may resist new ways of working or capability requirements',
                impact: 'high',
                probability: 'likely',
                mitigationStrategy: 'Strong executive sponsorship, clear communication of why, early wins',
                contingencyPlan: 'Accelerate change management; consider leadership changes if needed',
                owner: 'Chief People Officer',
            },
            {
                risk: 'Execution velocity slower than planned',
                description: 'Competing priorities or resource constraints slow implementation',
                impact: 'high',
                probability: 'likely',
                mitigationStrategy: 'Clear prioritization; dedicated project management office',
                contingencyPlan: 'Reduce scope or extend timeline slightly',
                owner: 'Chief Operating Officer',
            },
            {
                risk: 'Market conditions deteriorate',
                description: 'Competitive response or market headwinds affect strategy viability',
                impact: 'critical',
                probability: 'possible',
                mitigationStrategy: 'Regular market monitoring; scenario planning',
                contingencyPlan: 'Prepared strategic alternatives for different market scenarios',
                owner: 'Chief Strategy Officer',
            },
            {
                risk: 'Key talent departure',
                description: 'Essential leaders leave during critical execution period',
                impact: 'high',
                probability: 'possible',
                mitigationStrategy: 'Retention bonuses; clear career progression',
                contingencyPlan: 'Succession plan for all critical roles',
                owner: 'Chief People Officer',
            },
        ];
    }
    // Helper methods for analysis components
    classifyProblem() {
        // Logic to classify problem type based on description
        const desc = this.problem.description.toLowerCase();
        if (desc.includes('grow') || desc.includes('expand'))
            return 'growth';
        if (desc.includes('retain') || desc.includes('churn'))
            return 'retention';
        if (desc.includes('cost') || desc.includes('efficiency'))
            return 'cost';
        if (desc.includes('market') || desc.includes('expand'))
            return 'market-entry';
        if (desc.includes('product') || desc.includes('feature'))
            return 'product';
        return 'operational';
    }
    identifyStakeholders() {
        return ['CEO', 'CFO', 'CTO', 'Chief Commercial Officer', 'Department Heads'];
    }
    buildIssueTree() {
        return {
            level: 0,
            question: 'How do we solve the core business problem?',
            children: [
                {
                    level: 1,
                    question: 'What are market dynamics?',
                    children: [],
                },
                {
                    level: 1,
                    question: 'What are customer needs?',
                    children: [],
                },
                {
                    level: 1,
                    question: 'What are operational constraints?',
                    children: [],
                },
            ],
        };
    }
    createMECEBuckets() {
        return [
            'Market & Competition',
            'Customer Behavior',
            'Product & Operations',
            'Financial & Resources',
        ];
    }
    formulateAnalyticalQuestions() {
        return [
            'What is the addressable market size and growth trajectory?',
            'Who are the key customer segments and what are their needs?',
            'What is our competitive positioning vs alternatives?',
            'What operational constraints limit our execution?',
            'What is the financial viability of proposed solutions?',
        ];
    }
    analyzeMarket() {
        return {
            marketSize: {
                tam: 'Total addressable market estimate',
                sam: 'Serviceable addressable market',
                som: 'Serviceable obtainable market',
            },
            growth: '15-20% CAGR based on industry trends',
            competitiveMapping: 'Competitive landscape analysis',
            trends: ['Trend 1', 'Trend 2', 'Trend 3'],
            insights: ['Insight 1', 'Insight 2'],
            evidence: 'Market research and data',
            implications: 'Impact on strategy',
        };
    }
    analyzeCustomer() {
        return {
            segments: [
                {
                    name: 'Primary Segment',
                    size: 'Market size for segment',
                    behavior: 'Purchase and usage behavior',
                    painPoints: ['Pain point 1', 'Pain point 2'],
                },
            ],
            buyingProcess: 'Typical sales cycle',
            retention: 'Current retention metrics',
            nps: 'Net Promoter Score analysis',
            insights: ['Customer insight 1', 'Customer insight 2'],
            implications: 'Product and sales implications',
        };
    }
    analyzeProduct() {
        return {
            positioning: 'Market positioning strategy',
            featureGaps: ['Gap 1', 'Gap 2'],
            uxIssues: ['Issue 1', 'Issue 2'],
            competitiveAdvantage: ['Advantage 1', 'Advantage 2'],
            productMarketFit: 'Assessment of PMF',
            insights: ['Product insight 1', 'Product insight 2'],
            implications: 'Product roadmap implications',
        };
    }
    analyzeOperations() {
        return {
            processEfficiencies: ['Efficiency 1', 'Efficiency 2'],
            bottlenecks: ['Bottleneck 1', 'Bottleneck 2'],
            costDrivers: ['Cost driver 1', 'Cost driver 2'],
            scalingChallenges: ['Challenge 1', 'Challenge 2'],
            insights: ['Ops insight 1', 'Ops insight 2'],
            implications: 'Operational improvement opportunities',
        };
    }
    analyzeFinancial() {
        return {
            revenueDrivers: ['Driver 1', 'Driver 2'],
            costStructure: ['Component 1', 'Component 2'],
            profitability: 'Current profitability analysis',
            unitEconomics: 'LTV/CAC analysis',
            keyMetrics: {
                'ARR Growth': '+25% YoY',
                'Gross Margin': '65%',
                'Burn Rate': '$500K/month',
            },
            insights: ['Financial insight 1', 'Financial insight 2'],
            implications: 'Financial strategy implications',
        };
    }
}
exports.ConsultingEngine = ConsultingEngine;
//# sourceMappingURL=engine.js.map