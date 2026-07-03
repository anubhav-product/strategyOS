import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import PDFDocument from 'pdfkit';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client';
import { ConsultingEngine } from '@core/engine';
import type { BusinessProblem, ConsultingAnalysis } from '@core/types';
import authRouter from './routes/auth';
import { optionalAuth, requireAuth, AuthRequest } from './middleware/auth';

dotenv.config();

const app: Express = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || process.env.BACKEND_PORT || 3002;

async function logActivity(req: Request, action: string, userId?: string, metadata?: object) {
  try {
    await prisma.activityLog.create({
      data: {
        userId: userId || null,
        action,
        metadata: metadata ? JSON.stringify(metadata) : null,
        ip: req.ip || req.headers['x-forwarded-for']?.toString() || null,
        userAgent: req.headers['user-agent'] || null,
      },
    });
  } catch { /* non-fatal */ }
}

app.use(cors({
  origin: process.env.FRONTEND_URL ? [process.env.FRONTEND_URL, 'http://localhost:3000'] : true,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use((req: Request, res: Response, next: NextFunction) => {
  const requestId = uuidv4();
  res.locals.requestId = requestId;
  console.log(`[${requestId}] ${req.method} ${req.path}`);
  next();
});

// Auth routes
app.use('/api/auth', authRouter);

// POST /api/analysis/generate — AI-powered, saves to DB
app.post('/api/analysis/generate', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const problem: BusinessProblem = req.body;
    if (!problem.title || !problem.description) {
      return res.status(400).json({ success: false, error: 'Missing required fields: title, description' });
    }

    const engine = new ConsultingEngine(problem);
    const analysis = await engine.generateAnalysis();
    const analysisId = uuidv4();

    // Save to DB if user is authenticated
    if (req.user?.userId) {
      await prisma.analysis.create({
        data: {
          id: analysisId,
          userId: req.user.userId,
          title: problem.title,
          industry: problem.industry || '',
          companySize: problem.companySize,
          firmStyle: problem.firmStyle,
          problemData: JSON.stringify(problem),
          analysisData: JSON.stringify(analysis),
        },
      });
    }

    logActivity(req, 'analysis_generated', req.user?.userId, { title: problem.title, firmStyle: problem.firmStyle, industry: problem.industry });
    res.json({ success: true, analysisId, analysis, generatedAt: new Date().toISOString() });
  } catch (error: any) {
    console.error('Analysis generation error:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to generate analysis' });
  }
});

// GET /api/analyses — list analyses for authenticated user
app.get('/api/analyses', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const analyses = await prisma.analysis.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        industry: true,
        companySize: true,
        firmStyle: true,
        createdAt: true,
      },
    });
    res.json({ success: true, analyses });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/analyses/:id — get single analysis
app.get('/api/analyses/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const record = await prisma.analysis.findFirst({
      where: { id: req.params.id, userId: req.user!.userId },
    });
    if (!record) return res.status(404).json({ success: false, error: 'Analysis not found' });
    res.json({
      success: true,
      analysisId: record.id,
      analysis: JSON.parse(record.analysisData),
      problem: JSON.parse(record.problemData),
      generatedAt: record.createdAt.toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/analyses/:id/share — generate share link
app.post('/api/analyses/:id/share', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const record = await prisma.analysis.findFirst({
      where: { id: req.params.id, userId: req.user!.userId },
    });
    if (!record) return res.status(404).json({ success: false, error: 'Not found' });

    const token = record.shareToken || uuidv4().replace(/-/g, '').slice(0, 16);
    await prisma.analysis.update({
      where: { id: record.id },
      data: { isPublic: true, shareToken: token },
    });
    logActivity(req, 'analysis_shared', req.user?.userId, { analysisId: record.id });
    res.json({ success: true, shareToken: token });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/s/:token — public shared analysis (no auth)
app.get('/api/s/:token', async (req: Request, res: Response) => {
  try {
    const record = await prisma.analysis.findFirst({
      where: { shareToken: req.params.token, isPublic: true },
    });
    if (!record) return res.status(404).json({ success: false, error: 'Shared analysis not found' });
    res.json({
      success: true,
      analysisId: record.id,
      analysis: JSON.parse(record.analysisData),
      problem: JSON.parse(record.problemData),
      generatedAt: record.createdAt.toISOString(),
      isShared: true,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/health
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ success: true, status: 'healthy', timestamp: new Date().toISOString(), environment: process.env.NODE_ENV || 'development' });
});

// GET /api/templates
app.get('/api/templates', (_req: Request, res: Response) => {
  res.json({
    success: true,
    templates: {
      mckinsey: { name: 'McKinsey Style', description: 'Hypothesis-driven, structured analysis' },
      bcg: { name: 'BCG Growth Focused', description: 'Growth strategy and competitive positioning' },
      bain: { name: 'Bain Execution Focused', description: 'Implementation excellence and ROI clarity' },
      accenture: { name: 'Accenture Tech Transformation', description: 'Technology and digital transformation focus' },
    },
  });
});

// POST /api/execution/track
app.post('/api/execution/track', (_req: Request, res: Response) => {
  res.json({ success: true, message: 'Execution tracking recorded', trackingId: uuidv4() });
});

// POST /api/export/pdf — high-quality PDF export
app.post('/api/export/pdf', (req: Request, res: Response) => {
  try {
    const { analysisId, analysis, generatedAt } = req.body as {
      analysisId?: string;
      analysis?: ConsultingAnalysis;
      generatedAt?: string;
    };

    if (!analysis) {
      return res.status(400).json({ success: false, error: 'Missing analysis payload for PDF export.' });
    }

    const sanitize = (value?: string) => (value ? value.trim() : 'Not provided.');
    const arrayToBulletedText = (items: string[] = []) =>
      items.length ? items.map(item => `• ${item}`).join('\n') : 'Not provided.';

    const sanitizedId = analysisId || uuidv4();
    const filename = `StrategyOS-Consulting-Report-${sanitizedId}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Cache-Control', 'no-store');

    const doc = new PDFDocument({ margin: 50, size: 'A4', bufferPages: true });
    doc.pipe(res);

    const pageWidth = doc.page.width - 100;
    const DARK_BG = '#0f172a';
    const ACCENT = '#0ea5e9';
    const TEXT_PRIMARY = '#f8fafc';
    const TEXT_SECONDARY = '#94a3b8';
    const CARD_BG = '#1e293b';

    const drawPageHeader = (title: string) => {
      doc.fillColor(CARD_BG).rect(0, 0, doc.page.width, 40).fill();
      doc.fillColor(TEXT_SECONDARY).font('Helvetica').fontSize(8).text('StrategyOS', 50, 14, { continued: true });
      doc.fillColor(TEXT_SECONDARY).text(` — ${title}`, { align: 'left' });
      doc.fillColor(ACCENT).rect(0, 40, doc.page.width, 2).fill();
      doc.y = 60;
    };

    const drawSectionHeader = (title: string) => {
      doc.moveDown(0.5);
      doc.fillColor(ACCENT).rect(50, doc.y, 4, 20).fill();
      doc.fillColor(ACCENT).font('Helvetica-Bold').fontSize(15).text(title, 62, doc.y - 2);
      doc.fillColor(ACCENT).rect(50, doc.y + 2, pageWidth, 1).fill();
      doc.moveDown(0.4);
    };

    const drawSubHeader = (title: string) => {
      doc.fillColor('#38bdf8').font('Helvetica-Bold').fontSize(12).text(title);
      doc.moveDown(0.2);
    };

    const drawBodyText = (text: string) => {
      doc.fillColor('#cbd5e1').font('Helvetica').fontSize(10).text(text, { lineGap: 5, indent: 4, paragraphGap: 6 });
    };

    const drawBulletedList = (items: string[]) => {
      items.forEach(item => {
        const y = doc.y;
        doc.fillColor(ACCENT).circle(58, y + 5, 2).fill();
        doc.fillColor('#cbd5e1').font('Helvetica').fontSize(10).text(`  ${item}`, 66, y, { lineGap: 4, paragraphGap: 4 });
      });
    };

    const drawCard = (label: string, value: string) => {
      const startY = doc.y;
      doc.fillColor(CARD_BG).roundedRect(50, startY, pageWidth, 50).fill();
      doc.fillColor(TEXT_SECONDARY).font('Helvetica').fontSize(8).text(label.toUpperCase(), 60, startY + 8);
      doc.fillColor(TEXT_PRIMARY).font('Helvetica-Bold').fontSize(10).text(value, 60, startY + 20, { width: pageWidth - 20 });
      doc.y = startY + 60;
    };

    const addPageFooter = () => {
      const range = doc.bufferedPageRange();
      for (let i = 0; i < range.count; i++) {
        doc.switchToPage(i);
        const bottom = doc.page.height - 30;
        doc.fillColor(CARD_BG).rect(0, bottom - 10, doc.page.width, 40).fill();
        doc.font('Helvetica').fontSize(8).fillColor(TEXT_SECONDARY);
        doc.text(`StrategyOS Consulting Report   |   Page ${i + 1} of ${range.count}   |   Confidential`, 50, bottom, {
          align: 'center',
          width: pageWidth,
        });
      }
    };

    const coverTitle = analysis.problemDiagnosis.restatedProblem || 'StrategyOS Consulting Engagement';

    // ── Cover Page ──
    doc.fillColor(DARK_BG).rect(0, 0, doc.page.width, doc.page.height).fill();
    doc.fillColor(ACCENT).rect(0, 0, 6, doc.page.height).fill();
    doc.moveDown(4);
    doc.fillColor(TEXT_SECONDARY).font('Helvetica').fontSize(11).text('CONFIDENTIAL — EXECUTIVE CONSULTING REPORT', { align: 'center' });
    doc.moveDown(1);
    doc.fillColor(TEXT_PRIMARY).font('Helvetica-Bold').fontSize(38).text('StrategyOS', { align: 'center' });
    doc.moveDown(0.5);
    doc.fillColor(ACCENT).font('Helvetica').fontSize(13).text('Premium Strategic Analysis', { align: 'center' });
    doc.moveDown(3);
    doc.fillColor(TEXT_PRIMARY).font('Helvetica-Bold').fontSize(20).text(sanitize(coverTitle), { align: 'center', width: pageWidth });
    doc.moveDown(2);
    doc.fillColor(TEXT_SECONDARY).font('Helvetica').fontSize(11).text(`Generated: ${sanitize(generatedAt ? new Date(generatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : new Date().toLocaleDateString())}`, { align: 'center' });
    doc.text(`Report ID: ${sanitizedId}`, { align: 'center' });
    doc.moveDown(1);
    doc.fillColor('#334155').font('Helvetica').fontSize(10).text(
      'This report presents a structured strategic analysis including problem diagnosis, deep-dive insights, strategic options, final recommendation, execution plan, KPI governance, and risk management.',
      { align: 'center', width: pageWidth - 80, lineGap: 5 }
    );
    doc.addPage();

    // ── Executive Snapshot ──
    doc.fillColor(DARK_BG).rect(0, 0, doc.page.width, doc.page.height).fill();
    drawPageHeader('Executive Snapshot');
    drawSectionHeader('Executive Snapshot');
    [
      { label: 'Core Challenge', value: sanitize(analysis.problemDiagnosis.restatedProblem) },
      { label: 'Recommendation', value: sanitize(analysis.finalRecommendation.decision) },
      { label: 'Revenue Impact', value: sanitize(analysis.finalRecommendation.expectedImpact.revenueIncrease) },
      { label: 'Critical Path', value: sanitize(analysis.executionPlan.criticalPath) },
    ].forEach(item => drawCard(item.label, item.value));
    doc.moveDown(1);
    drawSubHeader('Partner Insight');
    drawBodyText(sanitize(analysis.finalRecommendation.partnerLevelInsight));
    doc.addPage();

    // ── Problem Diagnosis ──
    doc.fillColor(DARK_BG).rect(0, 0, doc.page.width, doc.page.height).fill();
    drawPageHeader('Problem Diagnosis');
    drawSectionHeader('1. Problem Diagnosis');
    drawSubHeader('Restated Problem');
    drawBodyText(sanitize(analysis.problemDiagnosis.restatedProblem));
    drawSubHeader('Business Context');
    drawBodyText(sanitize(analysis.problemDiagnosis.businessContext));
    drawSubHeader('Classification');
    drawBodyText(`Type: ${sanitize(analysis.problemDiagnosis.problemClassification.type)}\nReasoning: ${sanitize(analysis.problemDiagnosis.problemClassification.reasoning)}`);
    drawSubHeader('Stakeholders');
    drawBulletedList(analysis.problemDiagnosis.stakeholders);
    doc.addPage();

    // ── Problem Structuring ──
    doc.fillColor(DARK_BG).rect(0, 0, doc.page.width, doc.page.height).fill();
    drawPageHeader('Problem Structuring');
    drawSectionHeader('2. Problem Structuring');
    drawSubHeader('MECE Buckets');
    drawBulletedList(analysis.problemStructuring.meceBuckets);
    drawSubHeader('Key Analytical Questions');
    drawBulletedList(analysis.problemStructuring.keyAnalyticalQuestions);
    drawSubHeader('Scope & Boundaries');
    drawBodyText(sanitize(analysis.problemStructuring.scopeAndBoundaries));
    doc.addPage();

    // ── Deep Dive ──
    doc.fillColor(DARK_BG).rect(0, 0, doc.page.width, doc.page.height).fill();
    drawPageHeader('Deep Dive Analysis');
    drawSectionHeader('3. Deep Dive Analysis');
    if (analysis.deepDiveAnalysis.market) {
      drawSubHeader('Market');
      drawBodyText(`TAM: ${analysis.deepDiveAnalysis.market.marketSize.tam}  |  SAM: ${analysis.deepDiveAnalysis.market.marketSize.sam}  |  SOM: ${analysis.deepDiveAnalysis.market.marketSize.som}`);
      drawBodyText(sanitize(analysis.deepDiveAnalysis.market.growth));
      drawBodyText(`Implication: ${sanitize(analysis.deepDiveAnalysis.market.implications)}`);
    }
    if (analysis.deepDiveAnalysis.customer) {
      drawSubHeader('Customer');
      drawBodyText(sanitize(analysis.deepDiveAnalysis.customer.buyingProcess));
      drawBodyText(`Retention: ${sanitize(analysis.deepDiveAnalysis.customer.retention)}`);
    }
    if (analysis.deepDiveAnalysis.product) {
      drawSubHeader('Product');
      drawBodyText(sanitize(analysis.deepDiveAnalysis.product.positioning));
      drawBodyText(`PMF: ${sanitize(analysis.deepDiveAnalysis.product.productMarketFit)}`);
    }
    if (analysis.deepDiveAnalysis.financial) {
      drawSubHeader('Financial');
      drawBodyText(`CAC: ${analysis.deepDiveAnalysis.financial.keyMetrics.CAC}  |  LTV: ${analysis.deepDiveAnalysis.financial.keyMetrics.LTV}  |  Payback: ${analysis.deepDiveAnalysis.financial.keyMetrics.Payback}`);
      drawBodyText(sanitize(analysis.deepDiveAnalysis.financial.unitEconomics));
    }
    doc.addPage();

    // ── Root Cause ──
    doc.fillColor(DARK_BG).rect(0, 0, doc.page.width, doc.page.height).fill();
    drawPageHeader('Root Cause Analysis');
    drawSectionHeader('4. Root Cause Analysis');
    drawSubHeader('Core Issue');
    drawBodyText(sanitize(analysis.rootCauseAnalysis.coreIssue));
    analysis.rootCauseAnalysis.causes.forEach((cause, i) => {
      drawSubHeader(`Cause ${i + 1}: ${sanitize(cause.cause)} [${cause.priority.toUpperCase()}]`);
      drawBodyText(`Evidence: ${sanitize(cause.evidence)}`);
      drawBodyText(`Root origin: ${sanitize(cause.whyItExists)}`);
    });
    drawSubHeader('Hypotheses');
    drawBulletedList(analysis.rootCauseAnalysis.hypotheses);
    doc.addPage();

    // ── Strategic Options ──
    doc.fillColor(DARK_BG).rect(0, 0, doc.page.width, doc.page.height).fill();
    drawPageHeader('Strategic Options');
    drawSectionHeader('5. Strategic Options');
    analysis.strategicOptions.forEach((opt, i) => {
      drawSubHeader(`${i + 1}. ${sanitize(opt.name)} — ${opt.timeToValue}`);
      drawBodyText(sanitize(opt.description));
      drawBodyText(`Mechanism: ${sanitize(opt.mechanism)}`);
      drawBodyText(`Pros:\n${arrayToBulletedText(opt.pros)}`);
      drawBodyText(`Cons:\n${arrayToBulletedText(opt.cons)}`);
      doc.moveDown(0.5);
    });
    doc.addPage();

    // ── Final Recommendation ──
    doc.fillColor(DARK_BG).rect(0, 0, doc.page.width, doc.page.height).fill();
    drawPageHeader('Final Recommendation');
    drawSectionHeader('6. Final Recommendation');
    drawCard('Decision', sanitize(analysis.finalRecommendation.clearDecision));
    drawSubHeader('Justification');
    drawBodyText(sanitize(analysis.finalRecommendation.justification));
    drawSubHeader('Expected Impact');
    drawBulletedList(Object.entries(analysis.finalRecommendation.expectedImpact).map(([k, v]) => `${k}: ${v}`));
    drawSubHeader('Success Criteria');
    drawBulletedList(analysis.finalRecommendation.successCriteria);
    drawSubHeader('Trade-offs');
    analysis.finalRecommendation.tradeOffs.forEach(t => drawBodyText(`• ${t.what}: ${t.why} (${t.acceptableRisk ? 'Acceptable' : 'High'} risk)`));
    doc.addPage();

    // ── Execution Plan ──
    doc.fillColor(DARK_BG).rect(0, 0, doc.page.width, doc.page.height).fill();
    drawPageHeader('Execution Plan');
    drawSectionHeader('7. Execution Plan');
    [analysis.executionPlan.phase1, analysis.executionPlan.phase2, analysis.executionPlan.phase3].forEach(phase => {
      drawSubHeader(`${sanitize(phase.name)} (${sanitize(phase.duration)})`);
      phase.actions.forEach(a => drawBodyText(`→ ${a.action}\n   Owner: ${a.owner}  |  Deadline: ${a.deadline}\n   Deliverable: ${a.deliverable}`));
      doc.moveDown(0.4);
    });
    drawBodyText(`Critical Path: ${sanitize(analysis.executionPlan.criticalPath)}`);
    doc.addPage();

    // ── KPI System ──
    doc.fillColor(DARK_BG).rect(0, 0, doc.page.width, doc.page.height).fill();
    drawPageHeader('KPI Tracking System');
    drawSectionHeader('8. KPI Tracking System');
    drawSubHeader('Leading Indicators');
    analysis.kpiTrackingSystem.leadingIndicators.forEach(k =>
      drawBodyText(`${k.name}: Target ${k.target} | ${k.frequency} | Linked to: ${k.linkedToAction}`)
    );
    drawSubHeader('Lagging Indicators');
    analysis.kpiTrackingSystem.laggingIndicators.forEach(k =>
      drawBodyText(`${k.name}: Target ${k.target} | ${k.frequency} | Linked to: ${k.linkedToAction}`)
    );
    drawBodyText(`Review cadence: ${sanitize(analysis.kpiTrackingSystem.reviewCadence)}`);
    doc.addPage();

    // ── Risks ──
    doc.fillColor(DARK_BG).rect(0, 0, doc.page.width, doc.page.height).fill();
    drawPageHeader('Risks & Mitigation');
    drawSectionHeader('9. Risks & Mitigation');
    analysis.risksAndMitigation.forEach((risk, i) => {
      drawSubHeader(`${i + 1}. ${sanitize(risk.risk)} [${risk.impact.toUpperCase()} — ${risk.probability}]`);
      drawBodyText(sanitize(risk.description));
      drawBodyText(`Mitigation: ${sanitize(risk.mitigationStrategy)}`);
      drawBodyText(`Contingency: ${sanitize(risk.contingencyPlan)}`);
      drawBodyText(`Owner: ${sanitize(risk.owner)}`);
    });
    doc.addPage();

    // ── Closing ──
    doc.fillColor(DARK_BG).rect(0, 0, doc.page.width, doc.page.height).fill();
    doc.fillColor(ACCENT).rect(0, 0, 6, doc.page.height).fill();
    doc.moveDown(5);
    doc.fillColor(TEXT_PRIMARY).font('Helvetica-Bold').fontSize(28).text('Ready to Execute', { align: 'center' });
    doc.moveDown(1);
    doc.fillColor(TEXT_SECONDARY).font('Helvetica').fontSize(12).text(
      'Use this report to align leadership, drive execution, and track outcomes with confidence.',
      { align: 'center', width: pageWidth, lineGap: 6 }
    );
    doc.moveDown(2);
    doc.fillColor(ACCENT).font('Helvetica-Bold').fontSize(14).text('StrategyOS', { align: 'center' });
    doc.fillColor(TEXT_SECONDARY).font('Helvetica').fontSize(11).text('strategyos.ai', { align: 'center' });

    addPageFooter();
    doc.end();
  } catch (error: any) {
    console.error('PDF export error:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to generate PDF report.' });
  }
});

// Error handling
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, error: 'Internal server error', requestId: res.locals.requestId });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, error: 'Endpoint not found', path: req.path });
});

const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║       StrategyOS Backend Running       ║
║          Port: ${PORT}                     ║
║       Environment: ${process.env.NODE_ENV || 'development'}      ║
╚════════════════════════════════════════╝
  `);
});

process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});

export default app;
