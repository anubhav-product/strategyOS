# StrategyOS Consulting Framework Guide

## Understanding the 9-Component Analysis

This guide explains each section of the consulting analysis framework and how it's used by StrategyOS.

---

## 1. PROBLEM DIAGNOSIS

### Purpose
Establish a clear, shared understanding of the business problem and its context.

### What It Includes

```typescript
interface ProblemDiagnosis {
  restatedProblem: string;        // Clear problem statement
  businessContext: string;         // Company situation
  problemClassification: {
    type: string;                  // Problem category
    reasoning: string;             // Why this classification
  };
  initialScope: string;            // What's in/out of scope
  stakeholders: string[];          // Key decision makers
}
```

### Example: Revenue Growth Challenge

**Restated Problem:**
> "A $10M ARR SaaS company needs to accelerate enterprise segment revenue growth from $2M to $4M within 12 months to hit Series B targets."

**Business Context:**
> "Founded in 2020, scaling SMB segment to 2,500 customers. Enterprise deals currently 15-20% of revenue. Sales team size: 8 (2 enterprise, 6 SMB). Win rate on enterprise RFQs: 25%. Average deal size: $150K."

**Classification:**
- Type: `"growth"`
- Reasoning: "Revenue target aligned with enterprise segment expansion and market opportunity"

**Scope:**
- In-scope: Enterprise sales motion, pricing, go-to-market
- Out-of-scope: product features, SMB retention

---

## 2. PROBLEM STRUCTURING

### Purpose
Break down the complex problem into MECE (Mutually Exclusive, Collectively Exhaustive) components.

### What It Includes

```typescript
interface ProblemStructuring {
  issuTree: IssueTreeNode;          // Hierarchical breakdown
  meceBuckets: string[];             // MECE categories
  keyAnalyticalQuestions: string[];  // Questions to answer
  scopeAndBoundaries: string;        // Clear boundaries
}
```

### Issue Tree Example

```
How can we grow enterprise revenue from $2M to $4M?
├─ Increase win rate on opportunities
│  ├─ Improve sales process
│  ├─ Better solution positioning
│  └─ Enhanced sales team skills
├─ Increase number of enterprise opportunities
│  ├─ Better lead generation
│  ├─ Expand market reach
│  └─ Increase marketing budget
├─ Increase average deal size
│  ├─ Upsell/cross-sell strategy
│  ├─ Multi-user adoption
│  └─ Premium product tiers
└─ Reduce sales cycle length
   ├─ Streamline process
   ├─ Better POV tools
   └─ Faster procurement
```

### MECE Buckets
1. **Demand Generation** — How many prospects?
2. **Sales Effectiveness** — How to win them? (win rate, deal size)
3. **Operational Efficiency** — How fast?

### Key Analytical Questions
- What's the addressable market within enterprise segment?
- Who are key competitors and how do they compete?
- What's our competitive advantage in enterprise sales?
- What are customer pain points we uniquely solve?

---

## 3. DEEP DIVE ANALYSIS

### Purpose
Deep analysis of market, customer, product, operations, and financial drivers.

### What It Includes

```typescript
interface DeepDiveAnalysis {
  market?: MarketAnalysis;
  customer?: CustomerAnalysis;
  product?: ProductAnalysis;
  operations?: OperationsAnalysis;
  financial?: FinancialAnalysis;
}
```

### Market Analysis

**Insight:** "Enterprise SaaS market growing 18% CAGR. Competition increasing significantly."

**Evidence:**
- TAM (Total Addressable Market): $50B globally
- SAM (Serviceable Addressable Market): $5B North America
- SOM (Serviceable Obtainable Market): $500M achievable in 3 years
- Top 5 competitors: $8-20B valuations
- Market trends: AI-native tools gaining adoption

**Implications:**
- Must differentiate on AI capabilities
- Consolidation likely — better to lead than be acquired
- Enterprise buyers scrutinizing vendor stability

### Customer Analysis

**Insight:** "Enterprise buyers prioritize security and integration; not price-sensitive."

**Segments:**
- **Financial Services:** $200K+ deals, 9-month sales cycle, needs SOC2 Type II
- **Healthcare:** $150K+ deals, 12-month cycle, needs HIPAA compliance
- **Enterprise Tech:** $100-300K deals, 6-month cycle, wants API/integration

**Behavior:**
- Enterprise POCs: 60 days average
- 3-5 stakeholders in decision
- RFP-driven in 70% of cases
- Existing incumbents to dislodge

**Implications:**
- Need enterprise-grade compliance
- Sales team must handle RFPs
- Product needs API-first architecture

### Product Analysis

**Positioning:** "All-in-one AI analytics platform for enterprise data teams"

**Competitive Advantage:**
- Native SQL support (vs. no-code competitors)
- Enterprise security (SOC2, HIPAA, etc.)
- 10x faster queries (proprietary engine)

**Feature Gaps (vs. competitors):**
- Missing: Advanced ML automation
- Weak: BI/dashboard capabilities
- Need: Workflow automation

**Product-Market Fit Assessment:** Moderate fit in enterprise, strong in data teams.

**Implications:**
- Address ML automation in roadmap
- Strengthen BI capabilities
- Feature completeness critical for enterprise win

### Operations Analysis

**Efficiency Areas:**
- Sales cycle time: 6 months average
- Sales team utilization: 60%
- Deal closing rate: 25%

**Bottlenecks:**
- Lead qualification: sales manually vetting
- Implementation: 8+ week deployments
- Customer success: reactive, not proactive

**Implications:**
- Invest in sales enablement tools
- Create sales playbooks for common scenarios
- Implement faster onboarding

### Financial Analysis

**Revenue Drivers:**
- Deal size impact: $200K → 20% growth
- Win rate impact: 25% → 35% = 40% growth
- Sales volume impact: 8 → 12 opportunities = 50% growth

**Unit Economics:**
- CAC (Customer Acquisition Cost): $50K
- LTV (Lifetime Value): $500K (assuming 3-year lifetime)
- CLTV ratio: 10x (healthy)

**Implications:**
- CAC payback in 3 months
- Enterprise segment profitable at current CAC
- Can justify higher sales investment

---

## 4. ROOT CAUSE ANALYSIS

### Purpose
Identify the TRUE underlying issues (not symptoms) holding back growth.

### What It Includes

```typescript
interface RootCauseAnalysis {
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
```

### Example

**Cause #1: Limited Sales Team Expertise in Enterprise Sales** ⭐ CRITICAL
- **Evidence:** 2 of 8 salespeople have enterprise deal experience. 25% win rate vs. 40% industry standard.
- **Why It Exists:** Rapid hiring from SMB talent pools. No formal enterprise sales training. Wrong incentive structure.
- **Is Symptom?** No, this is root cause.
- **Impact:** Directly reduces win rate by 15 percentage points.

**Cause #2: Weak Sales Process/Playbook**
- **Evidence:** Sales calls lack structure. No consistent discovery. No documented playbook.
- **Why It Exists:** Founder-led sales worked fine at $2M, but doesn't scale.
- **Is Symptom?** No.
- **Impact:** Lengthens sales cycle, reduces win rate.

**Cause #3: Product Gaps in Enterprise Features**
- **Evidence:** 3 of last 5 lost deals cited "lacks workflow automation"
- **Why It Exists:** Product roadmap focused on core analytics, not adjacent features.
- **Is Symptom?** Partially — symptoms of broader prioritization issues.
- **Impact:** Blocks ~20% of enterprise opportunities.

**Core Issue:** 
> "The company has built a strong product for SMBs but lacks the sales motion, team expertise, and product features to compete effectively in enterprise. Sales motion is ad-hoc founder-led approach, not scalable enterprise sales process."

---

## 5. STRATEGIC OPTIONS

### Purpose
Present 2-4 distinct strategic paths with pros/cons and implementation effort.

### What It Includes

Option includes: Name, Description, Mechanism, Pros, Cons, When to Use, Required Capabilities, Investment Level, Time to Value

### Example Options

#### Option 1: Build Enterprise Sales Engine ⭐ RECOMMENDED
**Description:** Invest heavily in enterprise sales team, training, and infrastructure.

**Mechanism:**
- Hire experienced enterprise sales leader
- Build sales playbooks for common scenarios
- Invest in sales enablement (Salesforce, training, tools)
- Implement deal desk process

**Pros:**
- Directly addresses root cause (sales expertise gap)
- Scalable to multiple enterprise segments
- Higher margins in enterprise
- Faster path to $4M target

**Cons:**
- Requires $500K+ investment in hiring/tools
- 6-month ramp for new team
- Execution risk if hiring wrong leader
- Incumbent competition with better sales teams

**When to Use:** Best if you have product-market fit and fundable runway.

**Investment Required:** High ($500K+ annually)
**Time to Value:** 6-9 months

---

#### Option 2: Product-Led Growth for Enterprise
**Description:** Build self-service, freemium model to attract enterprise users organically.

**Mechanism:**
- Rebuild product with self-service onboarding
- Create free tier for teams of 5+
- Build enterprise upgrade path
- Invest in PLG marketing

**Pros:**
- Lower CAC
- Lets product sell itself
- Faster to market
- Less dependency on sales team

**Cons:**
- Requires significant product rebuild (6-9 months)
- PLG historically weak for enterprise (trust matters)
- Freemium model may cannibalize existing growth
- Uncertain ROI

**When to Use:** Only if company has time for 6-month product pivot AND funding for parallel sales team investment.

**Investment Required:** High (product development)
**Time to Value:** 9-12 months

---

#### Option 3: Partner/Channel Strategy
**Description:** Partner with systems integrators and consultants to reach enterprise.

**Mechanism:**
- Identify 3-5 key SI partners in target verticals
- Build partner enablement program
- Offer partner margins (30-40%)
- Co-market with partners

**Pros:**
- Reduces need for large internal sales team
- Partners already have enterprise relationships
- Faster market expansion
- Lower risk (partners bear some sales cost)

**Cons:**
- Lower margins (cost of partner margins)
- Less direct customer relationship
- Slower to scale (limited partners)
- Quality control issues

**When to Use:** If you have relationships with key SIs already.

**Investment Required:** Medium ($200K marketing/enablement)
**Time to Value:** 3-4 months

---

## 6. FINAL RECOMMENDATION

### Purpose
Provide the SINGLE recommended path forward with detailed justification.

### What It Includes

```typescript
interface FinalRecommendation {
  clearDecision: string;
  decision: string;
  justification: string;
  whyThisOption: string;
  expectedImpact: {
    businessGrowth?: string;
    costReduction?: string;
    retentionLift?: string;
  };
  tradeOffs: Array<{ what: string; why: string; acceptableRisk: boolean }>;
  partnerLevelInsight: string;
  successCriteria: string[];
}
```

### Example Recommendation

**RECOMMENDATION: Build Enterprise Sales Engine (Option 1)**

**Why This Option:**

1. **Directly Addresses Root Cause:** The primary bottleneck is sales expertise and process, not product or market opportunity. Building the right sales engine removes this blocker.

2. **Aligns with Company Stage:** You're at the inflection point where founder-led sales stops working. This is the right time to professionalize.

3. **Fastest Path to Target:** Hiring an experienced enterprise VP Sales + 2-3 enterprise reps can enable $4M target within 12-15 months vs. 24+ months for other options.

4. **Defensible Competitive Advantage:** You've built a strong product. A great sales team leveraging product advantages compounds your competitive position.

5. **LTV/CAC Economics Support It:** LTV/CAC of 10x means you can spend up to $50K CAC. Enterprise hiring ROI exceeds this threshold.

**Expected Impact:**

- **Revenue Growth:** +100% YoY → $20M ARR (from $10M)
  - Specific: Enterprise segment $2M → $4M, SMB sustains $6M
  - Path: 12 enterprise deals/year at $175K average + 100+ SMB deals at $50K average

- **Market Position:** Establish as #2 player in enterprise data analytics
  - Win 3-4 key logo customers in healthcare + financial services
  - Create case studies for referenceable wins

- **Operating Leverage:** Build scalable sales model
  - 1 VP Sales manages 3-4 reps
  - Sales productivity: 10x revenue per salesperson
  - Sustainable for $50M+ scale

**Trade-offs:**

1. **Trade-off: Cash Consumption**
   - What: Burn rate increases $40K/month (salaries + tools)
   - Why: Cannot avoid if want to grow enterprise
   - Acceptable Risk: Yes — if Series B raised, can fund 18 months

2. **Trade-off: Execution Risk**
   - What: Hiring wrong VP Sales could waste 6 months
   - Why: Single hire is high-leverage role
   - Acceptable Risk: Yes — can source from strong network, get board help

3. **Trade-off: Slower SMB Growth**
   - What: Prioritizing enterprise means less SMB investment
   - Why: Company resources finite, must choose
   - Acceptable Risk: Yes — SMB segment mature, enterprise has more upside

**Partner-Level Insight:**

> This is a classic inflection point decision. You've built product-market fit. Now the question is: do you want to be a big company, or remain small? The answer determines everything. If you commit to enterprise, you need to commit FULLY — not half-heartedly. Hire the best VP Sales you can afford, give them equity and autonomy, and let them build the motion. Don't try to maintain founder-led SMB sales at same time. Pick one, lead it. We recommend enterprise because your product advantages (SQL, security, speed) are most valuable there, your unit economics support it, and your timing is right. In 18 months, you'll have a $20-30M ARR company with a scalable enterprise engine. That's a real business.

**Success Criteria:**

✅ VP Sales hired and ramped within 60 days
✅ Sales playbook documented by day 90
✅ First enterprise deal closed by day 120
✅ 4-6 pipeline deals by month 6
✅ First $1M quarter revenue by month 12

---

## 7. EXECUTION PLAN

### Purpose
Convert recommendation into concrete, phased execution roadmap.

### Phase 1: Immediate (0-30 days) — Foundation

| Action | Owner | Deadline | Deliverable |
|--------|-------|----------|------------|
| Secure board sponsorship for enterprise pivot | CEO | Day 5 | Board memo approving hiring spend |
| Launch VP Sales search | CEO/Board | Day 5 | Recruiting firm engaged, job description |
| Define enterprise sales playbook (v1) | Founder | Day 20 | 5-page playbook document |
| Conduct customer interviews with top 5 accounts | CEO | Day 25 | Insights on buying process, feature needs |
| Allocate budget for sales tools (Salesforce, HubSpot) | CFO | Day 30 | Budget approved, procurement started |

**Milestones:**
- Recruiting started
- Playbook drafted
- Customer insights gathered

---

### Phase 2: Acceleration (1-3 months) — Building

| Action | Owner | Deadline | Deliverable |
|--------|-------|----------|------------|
| Onboard VP Sales and set team | CEO | Month 1.5 | VP Sales in seat, comp plan defined |
| Build sales support infrastructure | VP Sales | Month 2 | Salesforce configured, materials ready |
| Launch pilot with 3 target accounts | VP Sales | Month 2.5 | POC agreements signed |
| Implement deal desk for >$100K deals | Finance | Month 2 | Process documented, trained |
| Hire first 2 enterprise account executives | VP Sales | Month 3 | 2 AEs onboarded, training complete |

**Milestones:**
- VP Sales hired
- Sales infrastructure live
- First deals in pipeline

---

### Phase 3: Scale (3-12 months) — Execution

| Action | Owner | Deadline | Deliverable |
|--------|-------|----------|------------|
| Close first 2-3 enterprise customers | VP Sales | Month 6 | $300-500K revenue, referenceable customers |
| Hire next 2 enterprise reps | VP Sales | Month 6 | Total of 4 AEs |
| Establish customer success team | VP CS | Month 9 | Dedicated CSM per customer |
| Build case studies and marketing assets | Marketing | Month 9 | 3-5 case studies, reference program |
| Plan Series B fundraising | CEO | Month 12 | Series B targeting launched |

**Milestones:**
- $2M enterprise annual run rate achieved
- 4-5 named accounts in pipeline
- Series B preparation underway

---

## 8. KPI TRACKING SYSTEM

### Purpose
Define how success is measured and tracked against plan.

### Leading Indicators (Weekly/Bi-weekly)

These are early signals that execution is working:

| KPI | Measurement | Target | Frequency |
|-----|------------|--------|-----------|
| Sales Pipeline Qualified | $ of qualified opportunities | $3-5M | Weekly |
| Deal Progression | % of deals moving to next stage on schedule | 80%+ | Weekly |
| Sales Team Activity | Calls, proposals, meetings per rep | 20+ calls/week | Weekly |
| Customer Feedback Score | NPS and satisfaction on qualification | +70% NPS | Bi-weekly |
| Sales Playbook Adoption | % of reps using playbook materials | 100% | Bi-weekly |

**What Do They Mean?**
- If pipeline is $5M+: Suggests adequate lead generation
- If 80%+ deals progress: Suggests effective sales process
- If NPS is 70+: Suggests product is strong for segment

---

### Lagging Indicators (Monthly/Quarterly)

These are final outcomes measuring business impact:

| KPI | Measurement | Target | Frequency |
|-----|------------|--------|-----------|
| Enterprise Revenue | Monthly recurring revenue from enterprise | $167K/month (annualized $2M) | Monthly |
| Deal Velocity | Average sales cycle | 6 months or less | Monthly |
| Win Rate | % of qualified opportunities won | 35%+ | Monthly |
| Average Deal Size | Revenue per closed deal | $175K+ | Monthly |
| Customer Retention | % of customers renewing | 90%+ | Quarterly |

**What Do They Mean?**
- If enterprise revenue is $167K/month: On track to $2M goal
- If deal cycle is 6 months: Process working efficiently
- If win rate is 35%+: Competitive positioning strong

---

## 9. RISKS & MITIGATION

### Purpose
Identify potential blockers and mitigation plans.

### Risk #1: Wrong VP Sales Hire ⭐ CRITICAL

**Description:** VP Sales hire doesn't fit culture or lacks experience with product like ours.

**Impact:** 6+ month delay, team demoralization, need to start search over.

**Probability:** Likely (high-stakes hiring)

**Mitigation Strategy:**
- Board-sourced candidates only (proven in similar roles)
- 3 reference calls + background check
- 2-week trial period with key team
- Competitive analysis and market-verified experience

**Contingency Plan:**
- If VP Sales underperforms in 90 days, replace immediately
- Bring in interim VP Sales from consulting firm while searching
- Engage external executive recruiter

**Owner:** CEO + Board

---

### Risk #2: Slow Team Onboarding

**Description:** New AE hires take 6+ months to ramp, delaying revenue impact.

**Impact:** Revenue target missed by 3-6 months.

**Probability:** Likely

**Mitigation Strategy:**
- VP Sales owns onboarding and playbook quality
- Pair new AEs with founder for first 30 days
- Create AE onboarding curriculum (2 weeks)
- Weekly 1-on-1s with VP Sales to track progress

**Contingency Plan:**
- If ramp slower than expected, hire senior AE with zero-ramp experience
- Hire dedicated sales enablement manager
- Consider sales development rep (SDR) to support AEs

**Owner:** VP Sales

---

### Risk #3: Market Shifts / New Competitor

**Description:** Major competitor launches better product, or market downturn reduces enterprise spending.

**Impact:** Deal sizes shrink, win rates fall, target becomes unachievable.

**Probability:** Possible

**Mitigation Strategy:**
- Monthly competitive monitoring
- Win/loss analysis on every deal
- Quarterly strategy reviews to adjust positioning
- Financial reserves for extended sales cycle

**Contingency Plan:**
- If deal environment deteriorates, extend timeline to 18-24 months
- Pivot to land-and-expand (smaller initial deals, grow within account)
- Double down on product differentiation in marketing

**Owner:** CEO + Product

---

## Consulting Framework Philosophy

### Why This Approach Works

1. **Structured:** Takes messy business problem and creates clean logic
2. **Specific:** No generic statements — grounded in data and analysis
3. **Actionable:** Each section contains specific next steps
4. **Aligned:** All stakeholders understand decision and roadmap
5. **Measurable:** KPIs allow tracking progress against plan

### Common Traps to Avoid

❌ **Generic recommendations:** "Improve sales" → Too vague
✅ **Specific recommendations:** "Hire VP Sales with $5M+ ARR scaling experience" → Actionable

❌ **Missing execution:** "Figure out how to do it" → No accountability
✅ **Clear execution:** "VP Sales hired by Month 1.5, 2 AEs hired by Month 3" → Clear milestones

❌ **One option only:** "This is what you should do" → Limits thinking
✅ **Multiple options:** "3 paths forward, here's why we recommend path 1" → Better decision making

---

## Using This Guide

This framework is embedded in StrategyOS. Every analysis you generate follows this 9-component structure:

1. **Start with diagnosis** — Make sure everyone agrees on the problem
2. **Structure rigorously** — Break into MECE components
3. **Analyze deeply** — Ground insights in data
4. **Find root causes** — Don't settle for symptoms
5. **Present options** — Show alternatives and trade-offs
6. **Recommend decisively** — Pick one path and justify it
7. **Execute systematically** — 3 phases with clear ownership
8. **Track relentlessly** — Know if you're winning
9. **Manage risks** — Anticipate and mitigate obstacles

This is consulting-grade thinking. Use it.
