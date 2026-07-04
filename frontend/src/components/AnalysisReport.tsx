/**
 * Analysis Display Components
 * 9-Section Consulting Report Display
 */

import React from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { ChevronDown, ChevronUp, TrendingUp, AlertTriangle, Target, Zap, ShieldCheck, ClipboardList, Sparkles, BookOpen, RefreshCw } from 'lucide-react';
import type { ConsultingAnalysis, KPITrackingSystem, ProblemStructuring, RiskMitigation, StrategicOption, ExecutionPlan, FinalRecommendation } from '@core/types';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45 },
  },
};

interface AnalysisReportProps {
  analysis: ConsultingAnalysis;
  analysisId?: string;
  generatedAt?: string;
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4">
      <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">{subtitle || 'Executive summary'}</p>
      <h3 className="text-2xl font-semibold text-white mt-2">{title}</h3>
    </div>
  );
}

function ValueCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-slate-950/80 border border-slate-800 p-5 transition-all duration-300 hover:border-cyan-400/50 hover:bg-slate-900/90 shadow-lg shadow-slate-950/10">
      <p className="text-slate-400 text-sm">{label}</p>
      <p className="text-white font-semibold mt-3 leading-relaxed">{value}</p>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[2rem] bg-slate-950/85 border border-slate-800 p-6 shadow-[0_30px_70px_rgba(15,23,42,0.4)]">
      <p className="text-slate-400 uppercase tracking-[0.18em] text-xs mb-4">{title}</p>
      {children}
    </div>
  );
}

function SectionLabel({ text }: { text: string }) {
  return <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-cyan-300">{text}</span>;
}

function ReportNavigator() {
  const sections = [
    { label: 'Problem Diagnosis', anchor: '#problem-diagnosis', page: '2' },
    { label: 'Problem Structuring', anchor: '#problem-structuring', page: '4' },
    { label: 'Deep Dive Analysis', anchor: '#deep-dive', page: '6' },
    { label: 'Root Cause Analysis', anchor: '#root-cause', page: '9' },
    { label: 'Strategic Options', anchor: '#strategic-options', page: '11' },
    { label: 'Final Recommendation', anchor: '#final-recommendation', page: '14' },
    { label: 'Step-by-step Approach', anchor: '#approach', page: '16' },
    { label: 'Execution Plan', anchor: '#execution-plan', page: '18' },
    { label: 'KPI Tracking System', anchor: '#kpi-tracking', page: '22' },
    { label: 'Risks & Mitigation', anchor: '#risks-mitigation', page: '24' },
    { label: 'Closing Summary', anchor: '#closing-summary', page: '26' },
  ];

  return (
    <div className="rounded-[2rem] border border-slate-800/70 bg-slate-950/85 p-5 shadow-[0_25px_60px_rgba(15,23,42,0.3)]">
      <p className="text-slate-400 uppercase tracking-[0.35em] text-xs mb-4">Report navigation</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {sections.map(section => (
          <a
            key={section.anchor}
            href={section.anchor}
            className="rounded-3xl border border-slate-800/70 bg-slate-900/80 px-4 py-3 text-sm text-slate-200 transition-colors hover:border-cyan-400/60 hover:bg-slate-900"
          >
            <div className="flex items-center justify-between gap-4">
              <span>{section.label}</span>
              <span className="text-slate-500 text-xs">{section.page}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

function InsightTile({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-3xl bg-slate-900/70 border border-slate-800 p-5 shadow-lg shadow-slate-950/10 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/70">
      <p className="text-slate-300 text-xs uppercase tracking-[0.35em] mb-3">{title}</p>
      <p className="text-white font-semibold leading-7">{description}</p>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc list-inside text-slate-300 space-y-2">
      {items.map((item, index) => (
        <li key={index} className="leading-relaxed">{item}</li>
      ))}
    </ul>
  );
}

function GrowthMetricBar({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="rounded-3xl bg-slate-950/80 border border-slate-800 p-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-slate-300 text-sm font-medium">{label}</p>
        <p className="text-white text-sm font-semibold">{value}</p>
      </div>
      <div className="mt-4 h-2 rounded-full bg-slate-800 overflow-hidden">
        <div className={`h-full rounded-full ${accent}`} style={{ width: '80%' }} />
      </div>
    </div>
  );
}

function StrategyImpactCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-slate-950/80 border border-slate-800 p-5 shadow-slate-950/10">
      <p className="text-slate-400 text-xs uppercase tracking-[0.18em] mb-2">{label}</p>
      <p className="text-white font-semibold leading-7">{value}</p>
    </div>
  );
}

function MetricBadge({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="rounded-3xl bg-slate-900/80 border border-slate-700 p-4 flex items-center justify-between gap-4">
      <div>
        <p className="text-slate-400 text-xs uppercase tracking-[0.35em]">{label}</p>
        <p className="mt-2 text-white font-semibold leading-6">{value}</p>
      </div>
      <div className={`h-3 w-16 rounded-full ${accent}`} />
    </div>
  );
}

function StepCard({ step, title, detail }: { step: string; title: string; detail: string }) {
  return (
    <div className="rounded-3xl bg-slate-950/85 border border-slate-800 p-5 shadow-lg shadow-slate-950/10 transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center gap-3 mb-4">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-300 font-semibold">{step}</span>
        <p className="text-white font-semibold">{title}</p>
      </div>
      <p className="text-slate-300 leading-relaxed">{detail}</p>
    </div>
  );
}

function TableOfContentsItem({ page, label, anchor }: { page: string; label: string; anchor: string }) {
  return (
    <a href={anchor} className="flex items-center justify-between rounded-3xl border border-slate-800/70 bg-slate-900/80 p-4 text-slate-200 transition-colors hover:border-cyan-400/60 hover:bg-slate-900">
      <span>{label}</span>
      <span className="text-slate-500 text-sm">{page}</span>
    </a>
  );
}

function renderIssueTree(node: ProblemStructuring['issuTree']) {
  return (
    <div className="space-y-4">
      <div className="text-slate-200 font-semibold">{node.question}</div>
      <div className="pl-5 border-l border-slate-700/60 space-y-3">
        {node.children.map((child, idx) => (
          <div key={idx}>
            <div className="text-slate-300 font-medium">• {child.question}</div>
            {child.children.length > 0 && (
              <div className="pl-5 border-l border-slate-700/50 space-y-2 mt-3">
                {child.children.map((sub, subIdx) => (
                  <div key={subIdx} className="text-slate-400">• {sub.question}</div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function renderPhase(phase: ExecutionPlan['phase1'] | ExecutionPlan['phase2'] | ExecutionPlan['phase3']) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 200, damping: 18 }}
      className="rounded-3xl bg-slate-950/80 border border-slate-800 p-5 shadow-lg shadow-slate-950/10"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-slate-400 text-sm">{phase.duration}</p>
          <p className="text-white text-xl font-semibold mt-2">{phase.name}</p>
        </div>
      </div>
      <div className="mt-5 space-y-4">
        {phase.actions.map((action, index) => (
          <div key={index} className="rounded-3xl bg-slate-900/80 border border-slate-800 p-4 transition-all duration-300 hover:border-cyan-500/40 hover:bg-slate-900">
            <p className="text-white font-semibold">{action.action}</p>
            <p className="text-slate-400 text-sm mt-2">Owner: {action.owner} · Deadline: {action.deadline}</p>
            <p className="text-slate-300 mt-3">{action.deliverable}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function parseTargetValue(target: string) {
  const raw = target.replace(/[^0-9]/g, '');
  return raw ? Math.min(100, Number(raw)) : 0;
}

function renderKPIs(kpiTrackingSystem: KPITrackingSystem) {
  const chartData = kpiTrackingSystem.leadingIndicators.map((indicator, index) => ({
    name: indicator.name,
    value: parseTargetValue(indicator.target),
    fill: ['#38bdf8', '#60a5fa', '#8b5cf6', '#22c55e'][index % 4],
  }));

  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
      <motion.div whileHover={{ scale: 1.01 }} className="rounded-[2rem] bg-slate-950/85 border border-slate-800 p-6 shadow-[0_30px_70px_rgba(15,23,42,0.4)]">
        <div className="flex flex-wrap gap-4 mb-6">
          {kpiTrackingSystem.leadingIndicators.map((indicator, index) => (
            <MetricBadge
              key={index}
              label={indicator.name}
              value={indicator.target}
              accent={['bg-cyan-400', 'bg-blue-400', 'bg-violet-400', 'bg-emerald-400'][index % 4]}
            />
          ))}
        </div>
        <div className="rounded-3xl bg-slate-900/80 p-4 border border-slate-700/70">
          <p className="text-slate-400 text-sm mb-4">Leading indicators progress</p>
          <div className="space-y-4">
            {chartData.map((indicator, index) => (
              <div key={indicator.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span>{indicator.name}</span>
                  <span>{indicator.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className={`h-full rounded-full ${indicator.fill}`} style={{ width: `${indicator.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
      <ChartCard title="KPI focus areas">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={42} outerRadius={90} paddingAngle={4}>
                {chartData.map(entry => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip wrapperStyle={{ backgroundColor: '#0f172a', borderRadius: 12, border: 'none' }} contentStyle={{ backgroundColor: '#111827', borderRadius: 12 }} />
              <Legend verticalAlign="bottom" wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  );
}

function renderRiskDistribution(risks: RiskMitigation[]) {
  const chartData = risks.map((risk, index) => ({
    name: risk.risk,
    value: index === 0 ? 45 : index === 1 ? 30 : index === 2 ? 15 : 10,
    fill: ['#f87171', '#facc15', '#38bdf8', '#a78bfa'][index % 4],
  }));

  return (
    <ChartCard title="Risk distribution">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={88} paddingAngle={4}>
              {chartData.map(entry => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip wrapperStyle={{ backgroundColor: '#0f172a', borderRadius: 12, border: 'none' }} contentStyle={{ backgroundColor: '#111827', borderRadius: 12 }} />
            <Legend verticalAlign="bottom" wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

function renderRisks(risks: RiskMitigation[]) {
  return (
    <div className="space-y-4">
      {risks.map((risk, index) => (
        <div key={index} className="rounded-3xl bg-slate-900/80 border border-slate-800 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <p className="text-white font-semibold text-lg">{risk.risk}</p>
            <span className="text-slate-400 uppercase tracking-[0.18em] text-xs">{risk.probability}</span>
          </div>
          <p className="text-slate-300 mt-3">{risk.description}</p>
          <p className="text-slate-400 text-sm mt-3">Mitigation: {risk.mitigationStrategy}</p>
          <p className="text-slate-400 text-sm">Contingency: {risk.contingencyPlan}</p>
          <p className="text-slate-400 text-sm mt-2">Owner: {risk.owner}</p>
        </div>
      ))}
    </div>
  );
}

function renderStrategicOptions(options: StrategicOption[]) {
  return (
    <div className="space-y-5">
      {options.map((option, index) => (
        <div key={index} className="rounded-3xl bg-slate-950/80 border border-slate-800 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-slate-400 text-sm uppercase tracking-[0.18em]">Option {index + 1}</p>
              <p className="text-white text-2xl font-semibold mt-2">{option.name}</p>
            </div>
            <div className="text-right">
              <p className="text-slate-400 text-sm">Time to value</p>
              <p className="text-white font-semibold">{option.timeToValue}</p>
            </div>
          </div>
          <p className="text-slate-300 mt-4">{option.description}</p>
          <div className="grid gap-4 lg:grid-cols-2 mt-4">
            <div>
              <p className="text-slate-400 text-sm mb-3">Pros</p>
              <BulletList items={option.pros} />
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-3">Cons</p>
              <BulletList items={option.cons} />
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <ValueCard label="When to use" value={option.whenToUse} />
            <ValueCard label="Required capabilities" value={option.requiredCapabilities.join(', ')} />
          </div>
        </div>
      ))}
    </div>
  );
}

function AnalysisReport({ analysis: initialAnalysis, analysisId, generatedAt }: AnalysisReportProps) {
  const [downloading, setDownloading] = React.useState(false);
  const [analysis, setAnalysis] = React.useState(initialAnalysis);
  const [regenerating, setRegenerating] = React.useState<string | null>(null);

  const regenerateSection = async (section: string) => {
    const token = localStorage.getItem('strategyos_token');
    if (!analysisId || !token) {
      toast.error('Sign in and save an analysis to regenerate sections');
      return;
    }
    setRegenerating(section);
    try {
      const res = await axios.post(`/api/analyses/${analysisId}/regenerate-section`, { section }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setAnalysis(prev => ({ ...prev, [section]: res.data.data }));
        toast.success('Section regenerated!');
      }
    } catch { toast.error('Could not regenerate section'); }
    finally { setRegenerating(null); }
  };

  const RegenerateBtn = ({ section }: { section: string }) => {
    if (!analysisId) return null;
    return (
      <button onClick={() => regenerateSection(section)} disabled={regenerating === section}
        title={`Regenerate ${section}`}
        className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-700 text-slate-400 hover:border-cyan-500 hover:text-cyan-400 transition-all disabled:opacity-50">
        {regenerating === section ? (
          <><span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" /> Regenerating...</>
        ) : (
          <><RefreshCw size={11} /> Regenerate</>
        )}
      </button>
    );
  };

  const executiveSummary = [
    {
      label: 'Primary recommendation',
      value: analysis.finalRecommendation.decision,
    },
    {
      label: 'Expected KPI lift',
      value: `${analysis.finalRecommendation.expectedImpact.businessGrowth ?? 'N/A'}`,
    },
    {
      label: 'Top strategic focus',
      value: analysis.problemDiagnosis.problemClassification.type.replace('-', ' '),
    },
    {
      label: 'Highest risk area',
      value: analysis.risksAndMitigation[0]?.risk ?? 'Risk managed',
    },
  ];

  const insightHighlights = [
    {
      title: 'Biggest Opportunity',
      description: analysis.problemDiagnosis.problemClassification.reasoning,
    },
    {
      title: 'Urgent Priority',
      description: analysis.executionPlan.criticalPath,
    },
    {
      title: 'Boardroom Insight',
      description: analysis.finalRecommendation.partnerLevelInsight,
    },
  ];

  const sectionSummary = [
    {
      label: 'Total sections',
      value: '9 consulting modules',
    },
    {
      label: 'Primary outcome',
      value: analysis.finalRecommendation.decision,
    },
    {
      label: 'Strategic lens',
      value: analysis.problemDiagnosis.problemClassification.type.replace('-', ' '),
    },
  ];

  const deepDiveChartData = [
    {
      name: 'Market',
      value: analysis.deepDiveAnalysis.market?.insights.length ?? 1,
      fill: '#38bdf8',
    },
    {
      name: 'Customer',
      value: analysis.deepDiveAnalysis.customer?.insights.length ?? 1,
      fill: '#60a5fa',
    },
    {
      name: 'Product',
      value: analysis.deepDiveAnalysis.product?.insights.length ?? 1,
      fill: '#8b5cf6',
    },
    {
      name: 'Operations',
      value: analysis.deepDiveAnalysis.operations?.insights.length ?? 1,
      fill: '#22c55e',
    },
    {
      name: 'Financial',
      value: analysis.deepDiveAnalysis.financial?.insights.length ?? 1,
      fill: '#f472b6',
    },
  ];

  const consultingFramework = [
    {
      label: 'Situation',
      value: analysis.problemDiagnosis.restatedProblem,
    },
    {
      label: 'Complication',
      value: analysis.rootCauseAnalysis.coreIssue,
    },
    {
      label: 'Resolution',
      value: analysis.finalRecommendation.decision,
    },
    {
      label: 'Impact',
      value: Object.entries(analysis.finalRecommendation.expectedImpact)
        .map(([name, value]) => `${name}: ${value}`)
        .join(' · '),
    },
  ];

  const impactChartData = [
    {
      name: 'Conversion',
      value: parseTargetValue(analysis.finalRecommendation.expectedImpact.businessGrowth ?? '0'),
    },
    {
      name: 'Revenue',
      value: parseTargetValue(analysis.finalRecommendation.expectedImpact.revenueIncrease ?? '0'),
    },
    {
      name: 'Retention',
      value: parseTargetValue(analysis.finalRecommendation.expectedImpact.retentionLift ?? '0'),
    },
    {
      name: 'Market',
      value: parseTargetValue(analysis.finalRecommendation.expectedImpact.marketPosition ?? '0'),
    },
  ];

  const impactColors = ['#38bdf8', '#60a5fa', '#a78bfa', '#f472b6'];

  const kpiChartData = analysis.kpiTrackingSystem.leadingIndicators.map((indicator, index) => ({
    name: indicator.name,
    value: parseTargetValue(indicator.target),
    fill: ['#38bdf8', '#60a5fa', '#8b5cf6', '#22c55e'][index % 4],
  }));

  const growthThemes = [
    {
      label: 'Market Signal',
      value: analysis.deepDiveAnalysis.market?.implications ?? 'Clear trial market value',
    },
    {
      label: 'Customer Focus',
      value: analysis.deepDiveAnalysis.customer?.implications ?? 'Segment-specific trial momentum',
    },
    {
      label: 'Product Leverage',
      value: analysis.deepDiveAnalysis.product?.implications ?? 'Playbook-driven activation',
    },
    {
      label: 'Operational Engine',
      value: analysis.deepDiveAnalysis.operations?.implications ?? 'Repeatable conversion cadence',
    },
    {
      label: 'Financial Return',
      value: analysis.deepDiveAnalysis.financial?.implications ?? 'Stronger unit economics',
    },
  ];

  const reportContents = [
    { label: '1. Problem Diagnosis', anchor: '#problem-diagnosis', page: '2' },
    { label: '2. Problem Structuring', anchor: '#problem-structuring', page: '4' },
    { label: '3. Deep Dive Analysis', anchor: '#deep-dive', page: '6' },
    { label: '4. Root Cause Analysis', anchor: '#root-cause', page: '9' },
    { label: '5. Strategic Options', anchor: '#strategic-options', page: '11' },
    { label: '6. Final Recommendation', anchor: '#final-recommendation', page: '14' },
    { label: '7. Step-by-step Approach', anchor: '#approach', page: '16' },
    { label: '8. Execution Plan', anchor: '#execution-plan', page: '18' },
    { label: '9. KPI Tracking System', anchor: '#kpi-tracking', page: '22' },
    { label: '10. Risks & Mitigation', anchor: '#risks-mitigation', page: '24' },
    { label: '11. Closing Summary', anchor: '#closing-summary', page: '26' },
  ];

  const approachSteps = [
    {
      step: '01',
      title: 'Define and frame the problem',
      detail: analysis.problemDiagnosis.restatedProblem,
    },
    {
      step: '02',
      title: 'Structure the issue with MECE clarity',
      detail: analysis.problemStructuring.keyAnalyticalQuestions.join(' · '),
    },
    {
      step: '03',
      title: 'Analyze the business drivers',
      detail: 'Deep dive across market, customer, product, operations and finance to validate the root cause.',
    },
    {
      step: '04',
      title: 'Recommend the highest-impact strategy',
      detail: analysis.finalRecommendation.justification,
    },
    {
      step: '05',
      title: 'Turn the recommendation into execution',
      detail: analysis.executionPlan.criticalPath,
    },
  ];

  const closingHighlights = [
    {
      label: 'Final decision',
      value: analysis.finalRecommendation.clearDecision || analysis.finalRecommendation.decision,
    },
    {
      label: 'Key next step',
      value: analysis.executionPlan.dependencies.length > 0 ? analysis.executionPlan.dependencies[0] : 'Begin with the governance and KPI cadence.',
    },
    {
      label: 'Board-ready summary',
      value: analysis.finalRecommendation.partnerLevelInsight,
    },
  ];

  const tradeOffSummary = analysis.finalRecommendation.tradeOffs.map(tradeoff => `• ${tradeoff.what}: ${tradeoff.why}`);

  const executionBarData = [
    { label: 'Phase 1', value: analysis.executionPlan.phase1.milestones.length || 2, fill: '#38bdf8' },
    { label: 'Phase 2', value: analysis.executionPlan.phase2.milestones.length || 2, fill: '#60a5fa' },
    { label: 'Phase 3', value: analysis.executionPlan.phase3.milestones.length || 2, fill: '#8b5cf6' },
  ];

  const executionDependencies = analysis.executionPlan.dependencies.length > 0 ? analysis.executionPlan.dependencies : ['Align leadership, define metrics, launch phase 1.'];

  const executionSuccessMetrics = [
    ...analysis.executionPlan.phase1.successMetrics,
    ...analysis.executionPlan.phase2.successMetrics,
    ...analysis.executionPlan.phase3.successMetrics,
  ];

  const executionStepCount = approachSteps.length;

  const closingAgenda = [
    'Review recommendation and expected impact',
    'Agree on execution ownership and timeline',
    'Confirm KPI governance and reporting rhythm',
    'Validate risk mitigation and contingency triggers',
  ];

  const executionBenefits = [
    analysis.finalRecommendation.whyThisOption,
    `Revenue impact: ${analysis.finalRecommendation.expectedImpact.revenueIncrease ?? 'N/A'}`,
    `Retention lift: ${analysis.finalRecommendation.expectedImpact.retentionLift ?? 'N/A'}`,
    `Cost reduction: ${analysis.finalRecommendation.expectedImpact.costReduction ?? 'N/A'}`,
  ].filter(Boolean) as string[];

  const successOutlook = [
    'Convert clarity into measurable growth outcomes',
    'Move from diagnosis to action in a structured, low-risk sequence',
    'Give leadership a single source of truth for execution and review',
  ];

  const executionTimelineData = executionBarData;

  const [pptxLoading, setPptxLoading] = React.useState(false);

  const downloadAnalysisReport = async () => {
    try {
      setDownloading(true);
      const response = await axios.post('/api/export/pdf', { analysisId, analysis, generatedAt }, { responseType: 'blob', timeout: 60000 });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `StrategyOS-Report-${analysisId ?? 'report'}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('PDF downloaded!');
    } catch {
      toast.error('Unable to download PDF.');
    } finally {
      setDownloading(false);
    }
  };

  const downloadPptx = async () => {
    setPptxLoading(true);
    try {
      const res = await axios.post('/api/export/pptx', { analysis, title: analysis.finalRecommendation.clearDecision }, { responseType: 'blob' });
      const url = URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `StrategyOS-${(analysis.finalRecommendation.clearDecision || 'Report').replace(/\s+/g, '-').slice(0, 40)}.pptx`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('PowerPoint downloaded!');
    } catch {
      toast.error('Could not export PowerPoint.');
    } finally {
      setPptxLoading(false);
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Report header with export actions */}
      <motion.div variants={itemVariants} className="rounded-[2rem] border border-slate-800/70 bg-gradient-to-br from-slate-950 to-slate-900/90 p-8 md:p-10 shadow-[0_30px_80px_rgba(15,23,42,0.55)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">StrategyOS · Executive Report</p>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              {analysis.finalRecommendation.clearDecision || 'Partner-level consulting analysis'}
            </h1>
            <p className="mt-3 text-slate-400 leading-relaxed">
              {analysis.problemDiagnosis.restatedProblem}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Generated {generatedAt ? new Date(generatedAt).toLocaleString() : 'just now'}
              {analysisId ? ` · ID: ${analysisId.slice(0, 8)}` : ''}
            </p>
          </div>
          {/* Export buttons */}
          <div className="flex flex-row lg:flex-col gap-3 flex-shrink-0">
            <button onClick={downloadAnalysisReport} disabled={downloading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white hover:border-slate-600 transition-all text-sm font-medium disabled:opacity-50 whitespace-nowrap">
              {downloading
                ? <><span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> Exporting…</>
                : <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> Download PDF</>}
            </button>
            <button onClick={downloadPptx} disabled={pptxLoading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600/80 to-blue-600/80 border border-purple-500/30 text-white hover:from-purple-600 hover:to-blue-600 hover:shadow-lg hover:shadow-purple-500/20 transition-all text-sm font-medium disabled:opacity-50 whitespace-nowrap">
              {pptxLoading
                ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Exporting…</>
                : <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" /></svg> Export PPTX</>}
            </button>
          </div>
        </div>
      </motion.div>

      <motion.section variants={itemVariants} className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
          <div className="rounded-[2rem] border border-slate-800/70 bg-slate-950/85 p-6 shadow-[0_30px_70px_rgba(15,23,42,0.25)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-slate-400 uppercase tracking-[0.35em] text-xs">Report overview</p>
                <h2 className="mt-3 text-3xl font-semibold text-white">What this report delivers</h2>
              </div>
              <div className="rounded-3xl bg-cyan-500/10 px-4 py-2 text-cyan-300 text-sm uppercase tracking-[0.35em]">Board ready</div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <ValueCard label="Primary outcome" value={analysis.finalRecommendation.decision} />
              <ValueCard label="Focus area" value={analysis.problemDiagnosis.problemClassification.type.replace('-', ' ')} />
            </div>
            <div className="mt-6 rounded-3xl bg-slate-900/80 border border-slate-800 p-5">
              <p className="text-slate-400 text-xs uppercase tracking-[0.35em] mb-3">How to use this report</p>
              <BulletList items={[
                'Read the diagnosis to confirm the business problem.',
                'Use the structured analysis to align leadership on the root cause.',
                'Review the recommendation with trade-offs, execution, and KPI governance.',
                'Take the closing summary into the next leadership decision meeting.',
              ]} />
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-800/70 bg-slate-950/85 p-6 shadow-[0_30px_70px_rgba(15,23,42,0.25)]">
            <p className="text-slate-400 uppercase tracking-[0.35em] text-xs">Table of contents</p>
            <div className="mt-4 space-y-3">
              {reportContents.map(item => (
                <TableOfContentsItem key={item.anchor} page={item.page} label={item.label} anchor={item.anchor} />
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section variants={itemVariants} className="grid gap-4 xl:grid-cols-4">
        {executiveSummary.map(item => (
          <ValueCard key={item.label} label={item.label} value={item.value} />
        ))}
      </motion.section>

      <motion.section variants={itemVariants} className="grid gap-4 lg:grid-cols-3">
        {insightHighlights.map(insight => (
          <InsightTile key={insight.title} title={insight.title} description={insight.description} />
        ))}
      </motion.section>

      <motion.section variants={itemVariants} className="space-y-8">
        <SectionHeader title="Executive Consulting Story" subtitle="Structured for stakeholders" />
        <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-800/70 bg-slate-950/85 p-6 shadow-[0_30px_70px_rgba(15,23,42,0.35)]">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="max-w-3xl">
                  <p className="text-slate-400 uppercase tracking-[0.35em] text-xs">The consulting narrative</p>
                  <h2 className="mt-3 text-3xl font-semibold text-white">From insight to decision, in a premium board-ready structure.</h2>
                  <p className="mt-4 text-slate-400 leading-relaxed">
                    This report is designed to align leadership around the most important business problem, the root cause, the recommended strategic path, and the execution plan that makes it real.
                  </p>
                </div>
                <div className="rounded-3xl bg-slate-900/80 p-5 border border-slate-700/70">
                  <p className="text-slate-400 text-xs uppercase tracking-[0.3em]">Recommendation</p>
                  <p className="mt-3 text-white font-semibold">{analysis.finalRecommendation.decision}</p>
                </div>
              </div>
              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                <ValueCard label="Situation" value={analysis.problemDiagnosis.restatedProblem} />
                <ValueCard label="Root cause" value={analysis.rootCauseAnalysis.coreIssue} />
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <ChartCard title="Strategic impact profile">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={impactChartData} margin={{ left: -20, right: 0, top: 10, bottom: 10 }}>
                      <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <Tooltip wrapperStyle={{ backgroundColor: '#0f172a', borderRadius: 12, border: 'none' }} contentStyle={{ backgroundColor: '#111827', borderRadius: 12 }} cursor={{ fill: 'rgba(56,189,248,0.1)' }} />
                      <Bar dataKey="value" radius={[12, 12, 0, 0]}>
                        {impactChartData.map((entry, index) => (
                          <Cell key={entry.name} fill={impactColors[index % impactColors.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>
              <ChartCard title="KPI focus areas">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={kpiChartData} dataKey="value" nameKey="name" innerRadius={42} outerRadius={90} paddingAngle={4}>
                        {kpiChartData.map(entry => (
                          <Cell key={entry.name} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip wrapperStyle={{ backgroundColor: '#0f172a', borderRadius: 12, border: 'none' }} contentStyle={{ backgroundColor: '#111827', borderRadius: 12 }} />
                      <Legend verticalAlign="bottom" wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>
            </div>
          </div>

          <div className="rounded-[2rem] border border-cyan-400/15 bg-slate-950/85 p-6 shadow-[0_25px_60px_rgba(15,23,42,0.25)]">
            <p className="text-cyan-300 uppercase tracking-[0.35em] text-xs mb-4">Consulting structure</p>
            <div className="space-y-4">
              {consultingFramework.map(item => (
                <div key={item.label} className="rounded-3xl bg-slate-900/80 border border-slate-800/70 p-5">
                  <p className="text-slate-400 text-xs uppercase tracking-[0.3em] mb-2">{item.label}</p>
                  <p className="text-white leading-7">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-3xl bg-slate-900/80 border border-slate-800/70 p-5">
              <p className="text-slate-400 uppercase tracking-[0.35em] text-xs mb-3">Recommendation essence</p>
              <BulletList items={analysis.finalRecommendation.successCriteria} />
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section variants={itemVariants} className="space-y-4" id="problem-diagnosis">
        <SectionHeader title="1. Problem Diagnosis" subtitle="Strategic framing" />
        <div className="grid gap-4 lg:grid-cols-3">
          <ValueCard label="Restated problem" value={analysis.problemDiagnosis.restatedProblem} />
          <ValueCard label="Business context" value={analysis.problemDiagnosis.businessContext} />
          <ValueCard label="Stakeholders" value={analysis.problemDiagnosis.stakeholders.join(', ')} />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <ValueCard label="Classification" value={analysis.problemDiagnosis.problemClassification.type.replace('-', ' ')} />
          <ValueCard label="Rationale" value={analysis.problemDiagnosis.problemClassification.reasoning} />
        </div>
      </motion.section>

      <motion.section variants={itemVariants} className="space-y-4" id="problem-structuring">
        <SectionHeader title="2. Problem Structuring" subtitle="MECE framework" />
        {renderIssueTree(analysis.problemStructuring.issuTree)}
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl bg-slate-950/80 border border-slate-800 p-5">
            <p className="text-slate-400 text-sm mb-4">MECE buckets</p>
            <BulletList items={analysis.problemStructuring.meceBuckets} />
          </div>
          <div className="rounded-3xl bg-slate-950/80 border border-slate-800 p-5">
            <p className="text-slate-400 text-sm mb-4">Key analytical questions</p>
            <BulletList items={analysis.problemStructuring.keyAnalyticalQuestions} />
          </div>
        </div>
        <ValueCard label="Scope & boundaries" value={analysis.problemStructuring.scopeAndBoundaries.trim()} />
      </motion.section>

      <motion.section variants={itemVariants} className="space-y-4" id="deep-dive">
        <SectionHeader title="3. Deep Dive Analysis" subtitle="Market, customer, product, operations, finance" />
        <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <div className="rounded-3xl bg-slate-950/80 border border-slate-800 p-6 space-y-4">
              <div>
                <p className="text-slate-400 text-sm mb-2">Market</p>
                <p className="text-white font-semibold">{analysis.deepDiveAnalysis.market?.growth}</p>
                <p className="text-slate-300 mt-2">{analysis.deepDiveAnalysis.market?.competitiveMapping}</p>
                <p className="text-slate-400 mt-3">Implication: {analysis.deepDiveAnalysis.market?.implications}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-2">Customer</p>
                <p className="text-white font-semibold">{analysis.deepDiveAnalysis.customer?.buyingProcess}</p>
                <p className="text-slate-300 mt-2">Retention: {analysis.deepDiveAnalysis.customer?.retention}</p>
                <p className="text-slate-400 mt-3">NPS analysis: {analysis.deepDiveAnalysis.customer?.nps}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-2">Product</p>
                <p className="text-white font-semibold">{analysis.deepDiveAnalysis.product?.positioning}</p>
                <p className="text-slate-300 mt-2">PMF assessment: {analysis.deepDiveAnalysis.product?.productMarketFit}</p>
              </div>
            </div>
            <div className="rounded-3xl bg-slate-950/80 border border-slate-800 p-6 space-y-4">
              <div>
                <p className="text-slate-400 text-sm mb-2">Operations</p>
                <p className="text-white font-semibold">{analysis.deepDiveAnalysis.operations?.implications}</p>
                <p className="text-slate-300 mt-2">Process focus: {analysis.deepDiveAnalysis.operations?.processEfficiencies.join(', ')}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-2">Financial</p>
                <p className="text-white font-semibold">{analysis.deepDiveAnalysis.financial?.profitability}</p>
                <p className="text-slate-300 mt-2">Unit economics: {analysis.deepDiveAnalysis.financial?.unitEconomics}</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <ChartCard title="Deep dive insight weight">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={deepDiveChartData} margin={{ left: -20, right: 0, top: 10, bottom: 10 }}>
                    <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip wrapperStyle={{ backgroundColor: '#0f172a', borderRadius: 12, border: 'none' }} contentStyle={{ backgroundColor: '#111827', borderRadius: 12 }} cursor={{ fill: 'rgba(56,189,248,0.1)' }} />
                    <Bar dataKey="value" radius={[12, 12, 0, 0]}>
                      {deepDiveChartData.map(entry => (
                        <Cell key={entry.name} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
            <ChartCard title="Deep dive section contribution">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={deepDiveChartData} dataKey="value" nameKey="name" innerRadius={42} outerRadius={90} paddingAngle={4}>
                      {deepDiveChartData.map(entry => (
                        <Cell key={entry.name} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip wrapperStyle={{ backgroundColor: '#0f172a', borderRadius: 12, border: 'none' }} contentStyle={{ backgroundColor: '#111827', borderRadius: 12 }} />
                    <Legend verticalAlign="bottom" wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>
        </div>
      </motion.section>

      <motion.section variants={itemVariants} className="space-y-4" id="root-cause">
        <div className="flex items-center"><SectionHeader title="4. Root Cause Analysis" subtitle="Core issues and evidence" /><RegenerateBtn section="rootCauseAnalysis" /></div>
        <ValueCard label="Core issue" value={analysis.rootCauseAnalysis.coreIssue} />
        <div className="space-y-4">
          {analysis.rootCauseAnalysis.causes.map((cause, index) => (
            <div key={index} className="rounded-3xl bg-slate-900/80 border border-slate-800 p-5">
              <p className="text-white font-semibold">{cause.cause}</p>
              <p className="text-slate-400 text-sm mt-3">Evidence: {cause.evidence}</p>
              <p className="text-slate-400 text-sm">Why it exists: {cause.whyItExists}</p>
              <p className="text-slate-400 text-sm mt-2">Priority: {cause.priority}</p>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section variants={itemVariants} className="space-y-4" id="strategic-options">
        <div className="flex items-center"><SectionHeader title="5. Strategic Options" subtitle="High-level strategic choices" /><RegenerateBtn section="strategicOptions" /></div>
        {renderStrategicOptions(analysis.strategicOptions)}
      </motion.section>

      <motion.section variants={itemVariants} className="space-y-4" id="final-recommendation">
        <div className="flex items-center"><SectionHeader title="6. Final Recommendation" subtitle="Recommended path and expected impact" /><RegenerateBtn section="finalRecommendation" /></div>
        <div className="grid gap-4 lg:grid-cols-2">
          <ValueCard label="Recommendation" value={analysis.finalRecommendation.decision} />
          <ValueCard label="Expected impact" value={Object.entries(analysis.finalRecommendation.expectedImpact)
            .map(([name, value]) => `${name}: ${value}`)
            .join(' · ')}
          />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <ValueCard label="Justification" value={analysis.finalRecommendation.justification.trim()} />
          <ValueCard label="Partner insight" value={analysis.finalRecommendation.partnerLevelInsight.trim()} />
        </div>
        <div className="rounded-3xl bg-slate-950/80 border border-slate-800 p-6">
          <p className="text-slate-400 uppercase tracking-[0.18em] text-xs mb-4">How this recommendation solves the problem</p>
          <BulletList items={[
            `Market: ${analysis.deepDiveAnalysis.market?.implications ?? 'Clarifies market opportunity and customer demand.'}`,
            `Customer: ${analysis.deepDiveAnalysis.customer?.implications ?? 'Aligns onboarding to segment-specific expectations.'}`,
            `Product: ${analysis.deepDiveAnalysis.product?.implications ?? 'Makes the trial experience clearly differentiated and outcome-driven.'}`,
            `Operations: ${analysis.deepDiveAnalysis.operations?.implications ?? 'Builds repeatable execution and governance around conversion.'}`,
            `Finance: ${analysis.deepDiveAnalysis.financial?.implications ?? 'Improves unit economics by converting more trials at lower cost.'}`,
          ]} />
        </div>
        <div>
          <p className="text-slate-400 mb-3">Success criteria</p>
          <BulletList items={analysis.finalRecommendation.successCriteria} />
        </div>
        <div className="rounded-3xl bg-slate-900/70 border border-slate-800 p-6">
          <p className="text-slate-400 uppercase tracking-[0.18em] text-xs mb-3">Execution benefits</p>
          <BulletList items={executionBenefits} />
        </div>
      </motion.section>

      <motion.section variants={itemVariants} className="space-y-4" id="approach">
        <SectionHeader title="7. Step-by-step Approach" subtitle="How the recommendation becomes a reliable path" />
        <div className="grid gap-4 lg:grid-cols-3">
          {approachSteps.map(step => (
            <StepCard key={step.step} step={step.step} title={step.title} detail={step.detail} />
          ))}
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <ChartCard title="Execution readiness score">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={executionTimelineData} margin={{ left: -20, right: 0, top: 10, bottom: 10 }}>
                  <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip wrapperStyle={{ backgroundColor: '#0f172a', borderRadius: 12, border: 'none' }} contentStyle={{ backgroundColor: '#111827', borderRadius: 12 }} cursor={{ fill: 'rgba(56,189,248,0.1)' }} />
                  <Bar dataKey="value" radius={[12, 12, 0, 0]}>
                    {executionTimelineData.map(entry => (
                      <Cell key={entry.label} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <div className="rounded-[2rem] bg-slate-950/85 border border-slate-800 p-6 shadow-[0_30px_70px_rgba(15,23,42,0.25)]">
            <p className="text-slate-400 uppercase tracking-[0.35em] text-xs mb-3">Trade-offs summary</p>
            <BulletList items={tradeOffSummary} />
          </div>
        </div>
      </motion.section>

      <motion.section variants={itemVariants} className="space-y-4" id="execution-plan">
        <SectionHeader title="7. Execution Plan" subtitle="Phased delivery and ownership" />
        <div className="space-y-4">
          {renderPhase(analysis.executionPlan.phase1)}
          {renderPhase(analysis.executionPlan.phase2)}
          {renderPhase(analysis.executionPlan.phase3)}
        </div>
        <ValueCard label="Critical path" value={analysis.executionPlan.criticalPath} />
      </motion.section>

      <motion.section variants={itemVariants} className="space-y-4" id="kpi-tracking">
        <SectionHeader title="8. KPI Tracking System" subtitle="What to monitor and how often" />
        {renderKPIs(analysis.kpiTrackingSystem)}
        <ValueCard label="Review cadence" value={analysis.kpiTrackingSystem.reviewCadence} />
      </motion.section>

      <motion.section variants={itemVariants} className="space-y-4" id="risks-mitigation">
        <SectionHeader title="9. Risks & Mitigation" subtitle="Risk register with ownership" />
        <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          {renderRiskDistribution(analysis.risksAndMitigation)}
          <div className="space-y-4">
            {renderRisks(analysis.risksAndMitigation)}
          </div>
        </div>
      </motion.section>

      <motion.section variants={itemVariants} className="space-y-6" id="closing-summary">
        <SectionHeader title="Closing Summary" subtitle="Final page: alignment, next steps, and success metrics" />
        <div className="grid gap-4 lg:grid-cols-3">
          {closingHighlights.map((item, index) => (
            <ValueCard key={index} label={item.label} value={item.value} />
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-[2rem] bg-slate-950/85 border border-slate-800 p-6 shadow-[0_30px_70px_rgba(15,23,42,0.25)]">
            <p className="text-slate-400 uppercase tracking-[0.35em] text-xs mb-3">What success looks like</p>
            <BulletList items={successOutlook} />
          </div>
          <div className="rounded-[2rem] bg-slate-950/85 border border-slate-800 p-6 shadow-[0_30px_70px_rgba(15,23,42,0.25)]">
            <p className="text-slate-400 uppercase tracking-[0.35em] text-xs mb-3">Next decision forum</p>
            <BulletList items={closingAgenda} />
          </div>
        </div>
        <div className="rounded-[2rem] bg-slate-900/80 border border-slate-800 p-6">
          <p className="text-slate-400 text-xs uppercase tracking-[0.35em] mb-3">Report checkpoint</p>
          <p className="text-white leading-7">
            This final page is designed to close the loop: make the recommendation simple, highlight the key risks, and ensure the leadership team can move directly into execution with confidence.
          </p>
        </div>
      </motion.section>

      <motion.div variants={itemVariants} className="flex flex-col gap-4 md:flex-row">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={downloadAnalysisReport}
          disabled={downloading}
          className="flex-1 rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-500 py-4 text-white font-semibold shadow-lg shadow-cyan-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {downloading ? 'Preparing PDF…' : 'Export as PDF'}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 rounded-3xl bg-slate-700 py-4 text-white font-semibold hover:bg-slate-600"
        >
          Share with Team
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

export default AnalysisReport;
