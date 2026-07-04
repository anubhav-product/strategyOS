import Anthropic from '@anthropic-ai/sdk';
import type {
  BusinessProblem,
  ConsultingAnalysis,
} from './types';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const FIRM_STYLES: Record<string, string> = {
  mckinsey: 'McKinsey style: hypothesis-driven, MECE structure, data-intensive, rigorous logic. Lead with the answer, then prove it.',
  bcg: 'BCG style: growth-oriented, competitive positioning focus, market opportunity emphasis, bold growth hypotheses.',
  bain: 'Bain style: execution-biased, ROI clarity, change management focus, implementation excellence with measurable business impact.',
  accenture: 'Accenture style: technology-enabled transformation, digital roadmap, innovation focus, tech integration at the core.',
};

const SYSTEM_PROMPT = `You are a senior partner at a top-tier consulting firm. Generate a comprehensive, specific, and actionable consulting analysis.

CRITICAL RULES:
- Be SPECIFIC: use real numbers, percentages, dollar amounts, timeframes, job titles
- NO generic phrases like "improve efficiency" or "drive growth" — always say HOW and by HOW MUCH
- Every action must have a specific owner (job title), deadline, and deliverable
- Root causes must be evidence-based, not assumed
- Strategic options must be genuinely distinct (not variations of the same idea)
- KPI targets must be measurable (e.g. "Trial-to-paid conversion: 28% → 40% in 90 days")

Respond ONLY with a valid JSON object matching this exact structure:
{
  "problemDiagnosis": {
    "restatedProblem": "string — precise one-sentence restatement",
    "businessContext": "string — company profile, market position, key context",
    "problemClassification": {
      "type": "growth|retention|cost|market-entry|product|operational",
      "reasoning": "string — specific reasoning with evidence"
    },
    "initialScope": "string — what's in scope and out of scope with timeframe",
    "stakeholders": ["string array of specific stakeholders"]
  },
  "problemStructuring": {
    "issuTree": {
      "level": 0,
      "question": "root question",
      "children": [
        {
          "level": 1,
          "question": "sub-question",
          "children": [
            { "level": 2, "question": "specific analytical question", "children": [] }
          ]
        }
      ]
    },
    "meceBuckets": ["4 MECE bucket strings"],
    "keyAnalyticalQuestions": ["4-6 specific analytical questions"],
    "scopeAndBoundaries": "string"
  },
  "deepDiveAnalysis": {
    "market": {
      "marketSize": { "tam": "$X billion", "sam": "$X million", "som": "$X million" },
      "growth": "string — specific growth rate and drivers",
      "competitiveMapping": "string — who the real competitors are and their positioning",
      "trends": ["3-4 specific market trends"],
      "insights": ["2-3 non-obvious insights"],
      "evidence": "string — specific data points or benchmarks",
      "implications": "string — what this means for the recommendation"
    },
    "customer": {
      "segments": [
        {
          "name": "segment name",
          "size": "specific size estimate",
          "behavior": "specific behavior description",
          "painPoints": ["specific pain points"]
        }
      ],
      "buyingProcess": "string — specific buying journey",
      "retention": "string — specific retention dynamics",
      "nps": "string — NPS estimate with reasoning",
      "insights": ["2-3 customer insights"],
      "implications": "string"
    },
    "product": {
      "positioning": "string",
      "featureGaps": ["specific gaps"],
      "uxIssues": ["specific UX issues"],
      "competitiveAdvantage": ["specific advantages"],
      "productMarketFit": "string — PMF assessment with evidence",
      "insights": ["2-3 product insights"],
      "implications": "string"
    },
    "operations": {
      "processEfficiencies": ["specific inefficiencies"],
      "bottlenecks": ["specific bottlenecks"],
      "costDrivers": ["specific cost drivers"],
      "scalingChallenges": ["specific challenges"],
      "insights": ["2-3 operational insights"],
      "implications": "string"
    },
    "financial": {
      "revenueDrivers": ["specific revenue drivers"],
      "costStructure": ["specific cost items"],
      "profitability": "string — specific profitability analysis",
      "unitEconomics": "string — CAC, LTV, payback period with numbers",
      "keyMetrics": { "CAC": "string", "LTV": "string", "Payback": "string" },
      "insights": ["2-3 financial insights"],
      "implications": "string"
    }
  },
  "rootCauseAnalysis": {
    "causes": [
      {
        "cause": "string — specific root cause",
        "evidence": "string — specific evidence",
        "whyItExists": "string — structural reason",
        "priority": "critical|high|medium",
        "isSymptom": false
      }
    ],
    "coreIssue": "string — the one core issue underlying everything",
    "hypotheses": ["2-4 specific testable hypotheses"]
  },
  "strategicOptions": [
    {
      "name": "Option N: Short descriptive name",
      "description": "string — specific description",
      "mechanism": "string — exactly how value is created",
      "pros": ["specific pros"],
      "cons": ["specific cons"],
      "whenToUse": "string",
      "requiredCapabilities": ["specific capabilities"],
      "investmentRequired": "low|medium|high",
      "timeToValue": "X months"
    }
  ],
  "finalRecommendation": {
    "clearDecision": "string — one clear sentence",
    "decision": "string — option name + brief rationale",
    "justification": "string — detailed justification",
    "whyThisOption": "string — why this vs the other options (3 specific reasons)",
    "expectedImpact": {
      "businessGrowth": "string — specific % or $ growth",
      "costReduction": "string — specific cost impact",
      "retentionLift": "string — specific retention improvement",
      "revenueIncrease": "string — specific revenue number",
      "marketPosition": "string — competitive position outcome"
    },
    "tradeOffs": [
      { "what": "string", "why": "string", "acceptableRisk": true }
    ],
    "partnerLevelInsight": "string — the senior insight that changes how leadership thinks about this",
    "successCriteria": ["3-4 specific, measurable success criteria"]
  },
  "executionPlan": {
    "phase1": {
      "name": "Phase 1: Name (0-30 days)",
      "duration": "1 month",
      "actions": [
        { "action": "specific action", "owner": "Job Title", "deadline": "Day X", "deliverable": "specific output" }
      ],
      "milestones": ["specific milestones"],
      "dependencies": ["specific dependencies"],
      "successMetrics": ["specific metrics"]
    },
    "phase2": {
      "name": "Phase 2: Name (1-4 months)",
      "duration": "3 months",
      "actions": [
        { "action": "specific action", "owner": "Job Title", "deadline": "Month X", "deliverable": "specific output" }
      ],
      "milestones": ["specific milestones"],
      "dependencies": ["specific dependencies"],
      "successMetrics": ["specific metrics"]
    },
    "phase3": {
      "name": "Phase 3: Name (4-12 months)",
      "duration": "8 months",
      "actions": [
        { "action": "specific action", "owner": "Job Title", "deadline": "Month X", "deliverable": "specific output" }
      ],
      "milestones": ["specific milestones"],
      "dependencies": ["specific dependencies"],
      "successMetrics": ["specific metrics"]
    },
    "dependencies": ["cross-phase dependencies"],
    "criticalPath": "string — the critical path in one sentence"
  },
  "kpiTrackingSystem": {
    "leadingIndicators": [
      { "name": "KPI name", "measurement": "how to measure", "frequency": "Weekly|Monthly", "linkedToAction": "which action", "target": "specific target" }
    ],
    "laggingIndicators": [
      { "name": "KPI name", "measurement": "how to measure", "frequency": "Monthly|Quarterly", "linkedToAction": "which action", "target": "specific target" }
    ],
    "dashboardMetrics": ["4 dashboard metric names"],
    "reviewCadence": "string — specific review schedule"
  },
  "risksAndMitigation": [
    {
      "risk": "risk name",
      "description": "specific risk description",
      "impact": "critical|high|medium|low",
      "probability": "certain|likely|possible|unlikely",
      "mitigationStrategy": "specific mitigation",
      "contingencyPlan": "specific contingency",
      "owner": "Job Title"
    }
  ]
}`;

export class ConsultingEngine {
  private problem: BusinessProblem;

  constructor(problem: BusinessProblem) {
    this.problem = problem;
  }

  async streamAnalysis(onChunk: (chunk: string) => void): Promise<ConsultingAnalysis> {
    const firmInstruction = FIRM_STYLES[this.problem.firmStyle] || FIRM_STYLES.mckinsey;
    const userMessage = this.buildUserMessage(firmInstruction);

    let fullText = '';
    const stream = client.messages.stream({
      model: 'claude-opus-4-8',
      max_tokens: 16000,
      messages: [{ role: 'user', content: userMessage }],
      system: SYSTEM_PROMPT,
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        fullText += event.delta.text;
        onChunk(event.delta.text);
      }
    }

    const jsonStr = extractBalancedJSON(fullText);
    if (!jsonStr) throw new Error('Claude did not return valid JSON');
    return JSON.parse(jsonStr) as ConsultingAnalysis;
  }

  private buildUserMessage(firmInstruction: string): string {
    return `Consulting firm style: ${firmInstruction}

Business Problem:
- Title: ${this.problem.title}
- Description: ${this.problem.description}
- Business Context: ${this.problem.context}
- Industry: ${this.problem.industry}
- Company Size: ${this.problem.companySize}
- Timeframe: ${this.problem.timeframe}
${this.problem.reportTemplate ? `- Report Template: ${this.problem.reportTemplate}` : ''}

Generate a complete, specific, and actionable consulting analysis for this exact problem. Every number, owner, and timeline must be specific to this business context — no generic templates.`;
  }

  async generateAnalysis(): Promise<ConsultingAnalysis> {
    const firmInstruction = FIRM_STYLES[this.problem.firmStyle] || FIRM_STYLES.mckinsey;
    const userMessage = this.buildUserMessage(firmInstruction);

    const response = await client.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 16000,
      messages: [{ role: 'user', content: userMessage }],
      system: SYSTEM_PROMPT,
    });


    const text = response.content[0].type === 'text' ? response.content[0].text : '';

    const jsonStr = extractBalancedJSON(text);
    if (!jsonStr) {
      throw new Error('Claude did not return valid JSON analysis');
    }

    return JSON.parse(jsonStr) as ConsultingAnalysis;
  }
}

function extractBalancedJSON(text: string): string | null {
  const start = text.indexOf('{');
  if (start === -1) return null;

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (escaped)            { escaped = false; continue; }
    if (ch === '\\' && inString) { escaped = true; continue; }
    if (ch === '"')         { inString = !inString; continue; }
    if (inString)           continue;
    if (ch === '{')         depth++;
    if (ch === '}')         { depth--; if (depth === 0) return text.slice(start, i + 1); }
  }

  // Truncated response — try to recover the largest valid prefix
  const partial = text.slice(start);
  try { JSON.parse(partial); return partial; } catch { /* fall through */ }
  return null;
}
