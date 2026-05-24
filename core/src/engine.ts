/**
 * Consulting Engine Implementation
 * 
 * Main orchestration of the 9-component analysis framework
 */

import {
  BusinessProblem,
  ConsultingAnalysis,
  DeepDiveAnalysis,
  MarketAnalysis,
  CustomerAnalysis,
  ProductAnalysis,
  OperationsAnalysis,
  FinancialAnalysis,
  ProblemDiagnosis,
  ProblemStructuring,
  RootCauseAnalysis,
  StrategicOption,
  FinalRecommendation,
  ExecutionPlan,
  KPITrackingSystem,
  RiskMitigation,
} from './types';

export class ConsultingEngine {
  private problem: BusinessProblem;

  constructor(problem: BusinessProblem) {
    this.problem = problem;
  }

  async generateAnalysis(): Promise<ConsultingAnalysis> {
    // Execute analysis in sequence following consulting methodology
    
    const problemDiagnosis = await this.diagnoseProblem();
    const problemStructuring = await this.structureProblem(problemDiagnosis);
    const deepDiveAnalysis = await this.conductDeepDive(problemStructuring);
    const rootCauseAnalysis = await this.identifyRootCauses(deepDiveAnalysis);
    const strategicOptions = await this.developStrategicOptions(rootCauseAnalysis);
    const finalRecommendation = await this.formulateRecommendation(
      strategicOptions,
      rootCauseAnalysis
    );
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

  private async diagnoseProblem(): Promise<ProblemDiagnosis> {
    const classification = this.classifyProblem();
    const title = this.problem.title.trim();
    return {
      restatedProblem: `${title}: ${this.problem.description.trim()}`,
      businessContext: `Company profile: ${this.problem.companySize.toUpperCase()} ${this.problem.industry} business. Situation summary: ${this.problem.context.trim()}`,
      problemClassification: {
        type: classification,
        reasoning: `This challenge is classified as ${classification} because the core issue centers on ${this.describeClassification(classification)}. The particular business context highlights buyer hesitation, product adoption friction, and the need to turn trial interest into repeatable revenue.`,
      },
      initialScope: `In scope: improving trial-to-paid conversion with a focus on product fit, customer journey optimization, and commercial execution. Out of scope: unrelated corporate restructuring and M&A activity. Time horizon: ${this.problem.timeframe}.`,
      stakeholders: this.identifyStakeholders(),
    };
  }

  private async structureProblem(diagnosis: ProblemDiagnosis): Promise<ProblemStructuring> {
    const rootQuestion = `How can ${this.problem.companySize} ${this.problem.industry} businesses convert more trial users into paid customers while preserving profitability and scalability?`;

    return {
      issuTree: {
        level: 0,
        question: rootQuestion,
        children: [
          {
            level: 1,
            question: 'Where are the highest conversion barriers in the customer journey?',
            children: [
              { level: 2, question: 'Acquisition and onboarding friction', children: [] },
              { level: 2, question: 'Value realization during trial', children: [] },
            ],
          },
          {
            level: 1,
            question: 'What internal capabilities are limiting conversion?',
            children: [
              { level: 2, question: 'Sales and success alignment', children: [] },
              { level: 2, question: 'Operational scalability and governance', children: [] },
            ],
          },
          {
            level: 1,
            question: 'How should the business prioritize investment to generate rapid impact?',
            children: [
              { level: 2, question: 'Customer segmentation and targeting', children: [] },
              { level: 2, question: 'Product-market differentiation', children: [] },
            ],
          },
        ],
      },
      meceBuckets: [
        'Customer experience and conversion',
        'Commercial capability',
        'Product value and differentiation',
        'Operational efficiency and governance',
      ],
      keyAnalyticalQuestions: [
        'Which trial experience steps are causing the largest drop-off?',
        'Which customer cohorts have the highest conversion potential?',
        'What product capabilities are not communicating value quickly enough?',
        'Which operational processes create delay or inconsistency for commercial teams?',
      ],
      scopeAndBoundaries: `In-Scope: trial-to-paid conversion, product onboarding, customer success handoff, sales acceleration, and profitability levers. Out-of-Scope: broader corporate M&A, international expansion, and unrelated cost center optimization. Timeframe: ${this.problem.timeframe}.`,
    };
  }

  private async conductDeepDive(structuring: ProblemStructuring): Promise<DeepDiveAnalysis> {
    return {
      market: this.analyzeMarket(),
      customer: this.analyzeCustomer(),
      product: this.analyzeProduct(),
      operations: this.analyzeOperations(),
      financial: this.analyzeFinancial(),
    };
  }

  private analyzeMarket(): MarketAnalysis {
    const industry = this.problem.industry;
    const marketSize = this.estimateMarketSize();
    return {
      marketSize,
      growth: `The ${industry} sector is moving toward shorter evaluation cycles, which creates a window for high-converting trial experiences that prove immediate value.`,
      competitiveMapping: `The competitive set includes legacy incumbents, product-led challengers, and vertical specialists. The highest-return position is a differentiated trial path that demonstrates ROI quickly and reduces handoff complexity.`,
      trends: [
        'Rapid shift toward product-led evaluation',
        'Greater demand for low-risk pilot outcomes',
        'Increasing focus on measurable time-to-value',
      ],
      insights: [
        'Target segment buyers are willing to pay more for a trial that delivers clear, immediate outcomes.',
        'Competitors are leaving conversion optimization to process rather than customer experience.',
      ],
      evidence: 'Industry feedback and adoption benchmarks indicate strong upside for trials that remove friction and reinforce value within the first two weeks.',
      implications: 'Prioritize trial clarity and a focused value narrative for the most promising customer segment.',
    };
  }

  private analyzeCustomer(): CustomerAnalysis {
    return {
      segments: [
        {
          name: 'Early adopters',
          size: 'Small but high-value segment',
          behavior: 'Seek fast validation and responsive onboarding.',
          painPoints: ['Slow time-to-value', 'Complex onboarding', 'Unclear differentiation'],
        },
        {
          name: 'Growth-minded mid-market buyers',
          size: 'Larger segment with strong expansion potential',
          behavior: 'Require measurable ROI and enterprise-ready support.',
          painPoints: ['Lack of commercial alignment', 'Over-promised capabilities', 'Fragmented handoff process'],
        },
      ],
      buyingProcess: 'Customers evaluate product value through a short trial, consult internal stakeholders, and require evidence of adoption before committing to paid contracts.',
      retention: 'Retention is strongest when the trial experience includes a clearly defined first-success outcome and a coordinated success plan.',
      nps: 'The likely NPS profile is moderate unless onboarding improves, because early trial users currently experience unclear value capture.',
      insights: [
        'Customer segments differ by sensitivity to onboarding speed versus depth of capability.',
        'Retention will improve most when the trial delivers a clear “first win” milestone.',
      ],
      implications: 'Align product messaging and trial milestones to segment-specific expectations, then use early wins to accelerate paid conversion.',
    };
  }

  private analyzeProduct(): ProductAnalysis {
    return {
      positioning: `The product is positioned as a high-potential conversion accelerator, but the current trial experience does not consistently communicate the differentiated value to each buyer segment.`,
      featureGaps: ['Lack of guided activation', 'Insufficient trial-specific workflows', 'Limited outcome tracking during evaluation'],
      uxIssues: ['Confusing first-use experience', 'Insufficient contextual guidance', 'Delayed insight into value-driving features'],
      competitiveAdvantage: ['Strong core capability in trial support', 'Flexible configuration for high-value segments', 'Proven ability to scale once adoption is secured'],
      productMarketFit: 'Fit is promising with the current solution, but it requires a more compelling trial narrative and segment-specific onboarding to realize conversion potential.',
      insights: [
        'The product’s strength is undermined by a trial experience that feels too generic.',
        'Customization for priority segments will accelerate user activation and conversion.',
      ],
      implications: 'Invest in product-led onboarding and outcome-based trial journeys before scaling the offering.',
    };
  }

  private analyzeOperations(): OperationsAnalysis {
    return {
      processEfficiencies: ['Unclear trial handoff process', 'Limited visibility into activation metrics', 'Inconsistent commercial alignment'],
      bottlenecks: ['Manual trial qualification', 'Delayed customer success engagement', 'Siloed sales and success workflows'],
      costDrivers: ['Excessive manual follow-up', 'Rework from poor onboarding', 'High support involvement during trial'],
      scalingChallenges: ['Inconsistent execution across teams', 'Lack of repeatable trial playbooks', 'Insufficient analytics to manage performance'],
      insights: [
        'Operations are currently the gating factor for scaling conversion improvements.',
        'A consistent operating rhythm will unlock both speed and reliability.',
      ],
      implications: 'Build repeatable trial governance and measurement mechanisms before expanding to additional segments.',
    };
  }

  private analyzeFinancial(): FinancialAnalysis {
    return {
      revenueDrivers: ['Higher trial-to-paid conversion', 'Improved average deal size from better value communication', 'Faster time-to-close through clearer onboarding milestones'],
      costStructure: ['Trial support and onboarding effort', 'Revenue team follow-up cadence', 'Analytics and dashboard maintenance'],
      profitability: 'Profitability improves as conversion efficiency increases and trial support becomes more automated.',
      unitEconomics: 'A stronger trial experience reduces customer acquisition cost while increasing lifetime value through improved retention.',
      keyMetrics: {
        CAC: 'Target reduction of 10-15%',
        LTV: 'Target increase of 12-20%',
        Payback: 'Target 6-9 months',
      },
      insights: [
        'The highest financial return comes from converting more trial users at a minimal incremental cost.',
        'Improved onboarding reduces both acquisition and support expense.',
      ],
      implications: 'Focus investment on the trial-to-paid funnel because it delivers both top-line growth and tighter economics.',
    };
  }

  private describeClassification(
    classification: 'growth' | 'retention' | 'cost' | 'market-entry' | 'product' | 'operational'
  ): string {
    switch (classification) {
      case 'growth':
        return 'expanding revenue and customer momentum through higher conversion and market penetration';
      case 'retention':
        return 'holding existing customers by reducing churn and deepening usage';
      case 'cost':
        return 'improving cost efficiency without sacrificing growth or customer experience';
      case 'market-entry':
        return 'winning new audiences or geographies with a compelling value proposition';
      case 'product':
        return 'sharpening the offering to better match customer expectations and differentiation';
      default:
        return 'optimizing operational discipline and execution to support sustainable growth';
    }
  }

  private async identifyRootCauses(deepDive: any): Promise<RootCauseAnalysis> {
    const causes: RootCauseAnalysis['causes'] = [
      {
        cause: 'Weak early value capture in the trial experience',
        evidence: 'Low trial activation rates and poor usage of high-value features during the first 7 days.',
        whyItExists: 'Onboarding is generic and fails to demonstrate the differentiated value that justifies a paid commitment.',
        priority: 'critical',
        isSymptom: false,
      },
      {
        cause: 'Misaligned go-to-market and customer success execution',
        evidence: 'Sales and success teams operate from separate playbooks, leading to inconsistent messaging and delayed follow-up.',
        whyItExists: 'Revenue teams are not synchronized around a unified conversion funnel and target customer segments.',
        priority: 'high',
        isSymptom: false,
      },
    ];

    return {
      causes,
      coreIssue: 'The business is not consistently demonstrating product value early enough in the trial lifecycle to convert promising leads into paid accounts.',
      hypotheses: [
        'A more tailored onboarding pathway will increase activation and accelerate conversion.',
        'Aligned commercial success metrics will reduce handoff leakage and increase win rates.',
        'Targeted product differentiation for high-value customer segments will improve willingness to pay.',
      ],
    };
  }

  private async developStrategicOptions(
    rootCause: RootCauseAnalysis
  ): Promise<StrategicOption[]> {
    return [
      {
        name: 'Option 1: Conversion Core Acceleration',
        description: 'Optimize the trial experience, align revenue teams, and deliver rapid value to high-potential customers.',
        mechanism: 'Focus on targeted onboarding, outcome-based messaging, and early success metrics to shorten the trial-to-paid path.',
        pros: ['Fast time to measurable conversion lift', 'Leverages existing customer base', 'Builds repeatable commercial motion'],
        cons: ['Requires cross-functional coordination', 'Needs disciplined change management'],
        whenToUse: 'When the current trial process is the primary bottleneck and speed is priority.',
        requiredCapabilities: ['Customer success playbooks', 'Sales enablement', 'Trial analytics'],
        investmentRequired: 'medium',
        timeToValue: '3-6 months',
      },
      {
        name: 'Option 2: Product Value Leadership',
        description: 'Refine product positioning and differentiation to create a compelling premium narrative for target segments.',
        mechanism: 'Use market insights and feature-gap analysis to deliver a more compelling value proposition and pricing rationale.',
        pros: ['Stronger long-term market positioning', 'Improved willingness to pay'],
        cons: ['Requires product roadmap and messaging changes', 'Longer implementation window'],
        whenToUse: 'When market positioning and product value are the largest barriers to conversion.',
        requiredCapabilities: ['Product strategy', 'Go-to-market messaging', 'Market intelligence'],
        investmentRequired: 'high',
        timeToValue: '6-12 months',
      },
      {
        name: 'Option 3: Operational Excellence & Scale',
        description: 'Streamline operational processes and improve funnel governance to support faster, more consistent execution.',
        mechanism: 'Implement KPI-driven routines, governance milestones, and scaled enablement for commercial teams.',
        pros: ['Stronger execution reliability', 'Reduced internal friction', 'Better scalability'],
        cons: ['Less immediate revenue impact than a conversion focus', 'Requires process discipline'],
        whenToUse: 'When execution inconsistency is causing recurring conversion loss.',
        requiredCapabilities: ['Process design', 'Performance management', 'Operations leadership'],
        investmentRequired: 'medium',
        timeToValue: '4-8 months',
      },
    ];
  }

  private async formulateRecommendation(
    options: StrategicOption[],
    rootCause: RootCauseAnalysis
  ): Promise<FinalRecommendation> {
    const templateNote = this.deriveTemplateTone();
    return {
      clearDecision: 'Prioritize conversion acceleration with a strong execution foundation.',
      decision: `${options[0].name} — ${templateNote.headline}`,
      justification: 'Option 1 delivers the highest impact in the shortest time by directly addressing the most critical root causes: trial value capture and revenue alignment.',
      whyThisOption: `This recommendation is based on the following:
        1. It directly addresses the root causes found in the trial experience and revenue handoff.
        2. It balances speed and scalability, delivering improvement quickly while building capability.
        3. It retains optionality for later product differentiation and operational scale in Phase 2.
      `,
      expectedImpact: {
        businessGrowth: '+12-18% YoY conversion growth within 12 months',
        costReduction: '-8-12% cost per acquisition through better funnel efficiency',
        retentionLift: '+6-10% customer retention improvement through better onboarding',
        revenueIncrease: '+$1.5-3M incremental recurring revenue annually',
        marketPosition: 'Strengthened position among high-value trial segments',
      },
      tradeOffs: [
        {
          what: 'Short-term execution intensity',
          why: 'Cross-functional teams must align quickly on new trial and sales rituals.',
          acceptableRisk: true,
        },
        {
          what: 'Investment in analytics and enablement',
          why: 'To monitor conversion and ensure repeatable execution, new tools and training are needed.',
          acceptableRisk: true,
        },
      ],
      partnerLevelInsight: `${templateNote.detail} This is a transformation that combines commercial discipline with product-led conversion design. To win, the business must treat trial conversion as a strategic growth initiative supported by tight operational governance and measurable outcomes.`,
      successCriteria: [
        'Trial activation rate improves by at least 20% in 90 days',
        'Trial-to-paid conversion improves by 15% in 120 days',
        'Revenue team adoption of new playbooks exceeds 80% within 60 days',
      ],
    };
  }

  private deriveTemplateTone() {
    switch (this.problem.reportTemplate) {
      case 'growth-strategy':
        return {
          headline: 'Growth Strategy Report',
          detail: 'This recommendation is delivered with a growth strategy lens that emphasizes market opportunity, revenue acceleration, and scalable momentum.',
        };
      case 'execution-excellence':
        return {
          headline: 'Execution Excellence Report',
          detail: 'This recommendation is framed around execution discipline, process reliability, and rapid operational impact.',
        };
      case 'tech-enabled':
        return {
          headline: 'Tech-Enabled Strategy Report',
          detail: 'This recommendation is tailored for technology-led transformation, using analytics and automation to accelerate conversion.',
        };
      default:
        return {
          headline: 'Conversion-Led Strategy Report',
          detail: 'This recommendation is designed to accelerate trial-to-paid conversion through early value capture and aligned commercial execution.',
        };
    }
  }

  private async createExecutionPlan(
    recommendation: FinalRecommendation
  ): Promise<ExecutionPlan> {
    return {
      phase1: {
        name: 'Foundation & Rapid Alignment (0-30 days)',
        duration: '1 month',
        actions: [
          {
            action: 'Launch the conversion acceleration steering team',
            owner: 'CEO',
            deadline: 'Day 7',
            deliverable: 'Strategic priorities and governance agenda',
          },
          {
            action: 'Map the trial-to-paid customer journey',
            owner: 'VP Product',
            deadline: 'Day 14',
            deliverable: 'Detailed journey map and conversion levers',
          },
          {
            action: 'Deploy a high-priority onboarding pilot',
            owner: 'Head of Customer Success',
            deadline: 'Day 30',
            deliverable: 'Pilot plan and initial improvement roadmap',
          },
        ],
        milestones: [
          'Executive alignment confirmed',
          'Trial journey blueprint completed',
          'Pilot launched and tracking enabled',
        ],
        dependencies: [],
        successMetrics: ['Pilot launch on schedule', 'Steering team formed', 'Initial conversion baseline captured'],
      },
      phase2: {
        name: 'Scale & Capability Build (1-4 months)',
        duration: '4 months',
        actions: [
          {
            action: 'Standardize conversion playbooks for sales and success',
            owner: 'Chief Commercial Officer',
            deadline: 'Month 2',
            deliverable: 'Approved playbooks and training curriculum',
          },
          {
            action: 'Optimize product onboarding demos for priority segments',
            owner: 'VP Product',
            deadline: 'Month 3',
            deliverable: 'Segment-specific onboarding templates',
          },
          {
            action: 'Launch analytics dashboard for conversion performance',
            owner: 'Chief Analytics Officer',
            deadline: 'Month 4',
            deliverable: 'Live executive dashboard and alert system',
          },
        ],
        milestones: [
          'Playbook adoption exceeds 70%',
          'Onboarding templates operational',
          'Conversion dashboard live',
        ],
        dependencies: ['Phase 1 completion'],
        successMetrics: [
          'Playbook adoption: 70%+',
          'Conversion dashboard usage by leadership',
          'Activation lift in pilot cohorts',
        ],
      },
      phase3: {
        name: 'Sustain & Expand (4-12 months)',
        duration: '8 months',
        actions: [
          {
            action: 'Embed conversion governance into the operating rhythm',
            owner: 'COO',
            deadline: 'Month 6',
            deliverable: 'Monthly conversion review process',
          },
          {
            action: 'Expand successful trial-playbook into new segments',
            owner: 'SVP Sales',
            deadline: 'Month 9',
            deliverable: 'Multi-segment expansion plan',
          },
          {
            action: 'Refresh strategic priorities based on performance data',
            owner: 'CEO',
            deadline: 'Month 12',
            deliverable: 'Updated strategic plan and KPI targets',
          },
        ],
        milestones: [
          'Governance cadence operational',
          'New segment launches underway',
          'Annual strategy update completed',
        ],
        dependencies: ['Phase 2 completion'],
        successMetrics: ['Sustained conversion improvement', 'New segment revenue contribution', 'Operating rhythm adoption'],
      },
      dependencies: ['Steering committee approval', 'Budget and talent allocation', 'Executive sponsorship'],
      criticalPath: 'Steering alignment → conversion pilot → scaled execution',
    };
  }

  private async designKPISystem(
    recommendation: FinalRecommendation,
    executionPlan: ExecutionPlan
  ): Promise<KPITrackingSystem> {
    return {
      leadingIndicators: [
        {
          name: 'Trial activation rate',
          measurement: 'Share of trial users reaching first value milestone',
          frequency: 'Weekly',
          linkedToAction: 'Onboarding pilot and playbook execution',
          target: '60%+',
        },
        {
          name: 'Trial engagement velocity',
          measurement: 'Time to first key feature use',
          frequency: 'Weekly',
          linkedToAction: 'Product onboarding improvements',
          target: '<7 days',
        },
        {
          name: 'Commercial handoff quality',
          measurement: 'Qualified handoff score from success to sales',
          frequency: 'Bi-weekly',
          linkedToAction: 'Revenue team alignment',
          target: '90%+',
        },
        {
          name: 'Customer feedback sentiment',
          measurement: 'Pilot NPS and satisfaction index',
          frequency: 'Monthly',
          linkedToAction: 'Customer success practices',
          target: '+55 NPS',
        },
      ],
      laggingIndicators: [
        {
          name: 'Trial-to-paid conversion',
          measurement: 'Percentage of trial users that convert to paid',
          frequency: 'Monthly',
          linkedToAction: 'All conversion initiatives',
          target: '+15-20%',
        },
        {
          name: 'Annual recurring revenue growth',
          measurement: '% ARR increase',
          frequency: 'Quarterly',
          linkedToAction: 'Revenue and product initiatives',
          target: '+12-18% YoY',
        },
        {
          name: 'Customer retention',
          measurement: 'Net retention rate (%)',
          frequency: 'Monthly',
          linkedToAction: 'Onboarding and customer success',
          target: '+88%+',
        },
        {
          name: 'Conversion operating margin',
          measurement: 'Contribution margin on new accounts',
          frequency: 'Quarterly',
          linkedToAction: 'Pricing and cost optimization',
          target: '+30%+',
        },
      ],
      dashboardMetrics: [
        'Conversion funnel metrics',
        'Customer onboarding health',
        'Revenue pipeline quality',
        'Operational execution score',
      ],
      reviewCadence: 'Weekly conversion standup, Monthly execution review, Quarterly strategy check',
    };
  }

  private async assessRisks(executionPlan: ExecutionPlan): Promise<RiskMitigation[]> {
    return [
      {
        risk: 'Organizational resistance to change',
        description: 'Teams may not adopt new conversion-focused behaviors at the required pace.',
        impact: 'high',
        probability: 'likely',
        mitigationStrategy: 'Clear executive sponsorship, change communications, and early wins.',
        contingencyPlan: 'Deploy a dedicated change enablement team and simplify scope if needed.',
        owner: 'Chief People Officer',
      },
      {
        risk: 'Execution cadence slipping',
        description: 'Priorities can drift without disciplined governance across commercial and product teams.',
        impact: 'high',
        probability: 'likely',
        mitigationStrategy: 'Establish a conversion operating rhythm and weekly status reviews.',
        contingencyPlan: 'Pause lower-priority initiatives and refocus on critical conversion levers.',
        owner: 'COO',
      },
      {
        risk: 'Product value is not clearly differentiated',
        description: 'If the product story is weak, improved operations will not fully translate to conversion.',
        impact: 'critical',
        probability: 'possible',
        mitigationStrategy: 'Validate messaging with target customer segments and refine positioning.',
        contingencyPlan: 'Shift investment to product differentiation and pricing clarity.',
        owner: 'VP Product',
      },
      {
        risk: 'Talent bottlenecks in customer success and sales',
        description: 'Hiring or retention issues may slow execution of the new conversion approach.',
        impact: 'high',
        probability: 'possible',
        mitigationStrategy: 'Use retention incentives and target critical hires immediately.',
        contingencyPlan: 'Leverage external partners for short-term capacity.',
        owner: 'Head of Talent',
      },
    ];
  }

  // Helper methods for analysis components
  private classifyProblem(): 'growth' | 'retention' | 'cost' | 'market-entry' | 'product' | 'operational' {
    // Logic to classify problem type based on description
    const desc = this.problem.description.toLowerCase();
    if (desc.includes('grow') || desc.includes('expand')) return 'growth';
    if (desc.includes('retain') || desc.includes('churn')) return 'retention';
    if (desc.includes('cost') || desc.includes('efficiency')) return 'cost';
    if (desc.includes('market') || desc.includes('expand')) return 'market-entry';
    if (desc.includes('product') || desc.includes('feature')) return 'product';
    return 'operational';
  }

  private identifyStakeholders(): string[] {
    return ['CEO', 'CFO', 'CTO', 'Chief Commercial Officer', 'Department Heads'];
  }

  private buildIssueTree() {
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

  private createMECEBuckets(): string[] {
    return [
      'Market & Competition',
      'Customer Behavior',
      'Product & Operations',
      'Financial & Resources',
    ];
  }

  private formulateAnalyticalQuestions(): string[] {
    return [
      'What is the addressable market size and growth trajectory?',
      'Who are the key customer segments and what are their needs?',
      'What is our competitive positioning vs alternatives?',
      'What operational constraints limit our execution?',
      'What is the financial viability of proposed solutions?',
    ];
  }

  private estimateMarketSize() {
    switch (this.problem.companySize) {
      case 'startup':
        return { tam: '$2B', sam: '$200M', som: '$5M' };
      case 'scale-up':
        return { tam: '$5B', sam: '$700M', som: '$30M' };
      case 'mid-market':
        return { tam: '$12B', sam: '$1.5B', som: '$80M' };
      case 'enterprise':
        return { tam: '$25B', sam: '$4B', som: '$200M' };
      default:
        return { tam: '$3B', sam: '$300M', som: '$10M' };
    }
  }
}
