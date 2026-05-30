/**
 * StrategyOS Backend API
 * Main Express server initialization
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import PDFDocument from 'pdfkit';
import { v4 as uuidv4 } from 'uuid';
import { ConsultingEngine } from '@core/engine';
import type { BusinessProblem, ConsultingAnalysis } from '@core/types';

dotenv.config();

const app: Express = express();
const PORT = process.env.BACKEND_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const requestId = uuidv4();
  res.locals.requestId = requestId;
  console.log(`[${requestId}] ${req.method} ${req.path}`);
  next();
});

// ============================================
// API ROUTES
// ============================================

interface AnalysisRequest extends Request {
  body: BusinessProblem;
}

interface AnalysisResponse {
  success: boolean;
  analysisId: string;
  analysis: ConsultingAnalysis;
  generatedAt: string;
}

/**
 * POST /api/analysis/generate
 * Generate comprehensive consulting analysis for a business problem
 */
app.post('/api/analysis/generate', async (req: AnalysisRequest, res: Response) => {
  try {
    const problem: BusinessProblem = req.body;

    // Validation
    if (!problem.title || !problem.description) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: title, description',
      });
    }

    // Initialize consulting engine
    const engine = new ConsultingEngine(problem);

    // Generate analysis
    const analysis = await engine.generateAnalysis();

    const response: AnalysisResponse = {
      success: true,
      analysisId: uuidv4(),
      analysis,
      generatedAt: new Date().toISOString(),
    };

    res.json(response);
  } catch (error: any) {
    console.error('Analysis generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate analysis',
    });
  }
});

/**
 * GET /api/analysis/:id
 * Retrieve previously generated analysis
 */
app.get('/api/analysis/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // In production, fetch from database
    res.json({
      success: true,
      message: `Retrieval for analysis ${id} would be implemented with database`,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/execution/track
 * Track execution metrics and progress
 */
app.post('/api/execution/track', (req: Request, res: Response) => {
  try {
    const { analysisId, phase, metrics } = req.body;

    res.json({
      success: true,
      message: 'Execution tracking recorded',
      trackingId: uuidv4(),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

/**
 * POST /api/export/pdf
 * Export analysis as PDF report
 */
app.post('/api/export/pdf', (req: Request, res: Response) => {
  try {
    const { analysisId, analysis, generatedAt } = req.body as {
      analysisId?: string;
      analysis?: ConsultingAnalysis;
      generatedAt?: string;
    };

    if (!analysis) {
      return res.status(400).json({
        success: false,
        error: 'Missing analysis payload for PDF export.',
      });
    }

    const sanitize = (value?: string) => (value ? value.trim() : 'Not provided.');
    const arrayToBulletedText = (items: string[] = []) => (items.length ? items.map(item => `• ${item}`).join('\n') : 'Not provided.');

    const sanitizedId = analysisId || uuidv4();
    const filename = `StrategyOS-Consulting-Report-${sanitizedId}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Cache-Control', 'no-store');

    const doc = new PDFDocument({ margin: 40, size: 'A4', bufferPages: true });
    doc.pipe(res);

    const pageWidth = doc.page.width - 80;
    const drawSectionHeader = (title: string) => {
      doc.moveDown(0.5);
      doc.fillColor('#0ea5e9').font('Helvetica-Bold').fontSize(16).text(title);
      doc.moveDown(0.25);
    };

    const drawBodyText = (text: string) => {
      doc.fillColor('#323f4b').font('Helvetica').fontSize(11).text(text, {
        lineGap: 4,
        indent: 4,
        paragraphGap: 6,
      });
    };

    const drawBulletedList = (items: string[]) => {
      items.forEach(item => {
        doc.circle(doc.x + 4, doc.y + 5, 2).fill('#0ea5e9');
        doc.fillColor('#1f2937').font('Helvetica').fontSize(11).text(`  ${item}`, {
          continued: false,
          lineGap: 4,
          indent: 8,
          paragraphGap: 4,
        });
      });
    };

    const addPageFooter = () => {
      const range = doc.bufferedPageRange();
      for (let i = 0; i < range.count; i += 1) {
        doc.switchToPage(i);
        const bottom = doc.page.height - 40;
        doc.font('Helvetica').fontSize(9).fillColor('#94a3b8');
        doc.text(`StrategyOS | Page ${i + 1} of ${range.count}`, 40, bottom, {
          align: 'center',
          width: pageWidth,
        });
      }
    };

    const coverTitle = analysis.problemDiagnosis.restatedProblem || 'StrategyOS Consulting Engagement';

    // Title Page
    doc.fillColor('#020617').rect(0, 0, doc.page.width, doc.page.height).fill();
    doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(36).text('StrategyOS', { align: 'center' });
    doc.moveDown(0.5);
    doc.font('Helvetica').fontSize(12).fillColor('#38bdf8').text('Premium Strategic Analysis Suite', { align: 'center' });
    doc.moveDown(2);
    doc.fillColor('#f8fafc').font('Helvetica-Bold').fontSize(26).text('Executive Consulting Report', {
      align: 'center',
      width: pageWidth,
    });
    doc.moveDown(1.5);
    doc.font('Helvetica').fontSize(14).fillColor('#cbd5e1').text(`Report Title: ${sanitize(coverTitle)}`, { align: 'center' });
    doc.moveDown(0.5);
    doc.text(`Generated: ${sanitize(generatedAt || new Date().toISOString())}`, { align: 'center' });
    doc.text(`Report ID: ${sanitizedId}`, { align: 'center' });
    doc.moveDown(2);
    doc.fontSize(11).fillColor('#94a3b8').text('This document presents a structured, board-ready analysis for leadership decision making, designed to combine problem diagnosis, strategic recommendation, execution planning, KPI governance, and risk oversight.', {
      align: 'center',
      width: pageWidth - 80,
      lineGap: 5,
    });
    doc.addPage();

    // Index Page
    doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(20).text('Table of Contents', { align: 'left' });
    doc.moveDown(1);
    const contents = [
      { title: 'Executive Snapshot', page: 3 },
      { title: 'Problem Diagnosis', page: 4 },
      { title: 'Problem Structuring', page: 5 },
      { title: 'Deep Dive Analysis', page: 6 },
      { title: 'Root Cause Analysis', page: 8 },
      { title: 'Strategic Options', page: 10 },
      { title: 'Final Recommendation', page: 12 },
      { title: 'Execution Plan', page: 14 },
      { title: 'KPI Tracking System', page: 16 },
      { title: 'Risks & Mitigation', page: 18 },
      { title: 'Closing Summary', page: 20 },
      { title: 'Thank You', page: 21 },
    ];
    contents.forEach(item => {
      doc.font('Helvetica-Bold').fontSize(11).fillColor('#0f172a').text(item.title, { continued: true });
      doc.font('Helvetica').text(` ................................................ ${item.page}`, {
        align: 'right',
      });
    });
    doc.addPage();

    // Executive Snapshot
    doc.fillColor('#0ea5e9').font('Helvetica-Bold').fontSize(20).text('Executive Snapshot');
    doc.moveDown(0.3);
    doc.font('Helvetica').fontSize(11).fillColor('#333f52').text('A concise view of the most critical findings, recommendation, and impact hypotheses for leadership.', {
      width: pageWidth,
      lineGap: 5,
    });
    doc.moveDown(1);

    const snapshotItems = [
      { label: 'Core business challenge', value: sanitize(analysis.problemDiagnosis.restatedProblem) },
      { label: 'Recommended strategy', value: sanitize(analysis.finalRecommendation.decision) },
      { label: 'Impact hypothesis', value: `${sanitize(analysis.finalRecommendation.expectedImpact.businessGrowth ?? 'N/A')} growth, ${sanitize(analysis.finalRecommendation.expectedImpact.revenueIncrease ?? 'N/A')} revenue` },
      { label: 'Key execution focus', value: sanitize(analysis.executionPlan.criticalPath) },
    ];
    snapshotItems.forEach(item => {
      doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(11).text(item.label);
      doc.fillColor('#475569').font('Helvetica').fontSize(11).text(item.value, { lineGap: 4, paragraphGap: 8 });
    });

    doc.moveDown(0.5);
    doc.fillColor('#0ea5e9').font('Helvetica-Bold').fontSize(14).text('Why this matters', { underline: true });
    doc.moveDown(0.25);
    drawBodyText('This analysis is built to align leadership around the core opportunity, surface the root issue, and put forward a confident recommendation that can be executed with governance, KPIs, and risk decisions.');
    doc.addPage();

    // Problem Diagnosis
    drawSectionHeader('1. Problem Diagnosis');
    drawBodyText(`${sanitize(analysis.problemDiagnosis.restatedProblem)}

Business context: ${sanitize(analysis.problemDiagnosis.businessContext)}

Stakeholders: ${analysis.problemDiagnosis.stakeholders.join(', ')}`);
    drawSectionHeader('Diagnosis summary');
    drawBodyText(`Problem classification: ${sanitize(analysis.problemDiagnosis.problemClassification.type.replace('-', ' '))}
Reasoning: ${sanitize(analysis.problemDiagnosis.problemClassification.reasoning)}`);
    doc.addPage();

    // Problem Structuring
    drawSectionHeader('2. Problem Structuring');
    drawBodyText('This section uses a MECE structure to ensure the problem is segmented cleanly and analysis is focused on the most impactful causes.');
    drawSectionHeader('MECE buckets');
    drawBulletedList(analysis.problemStructuring.meceBuckets);
    drawSectionHeader('Key analytical questions');
    drawBulletedList(analysis.problemStructuring.keyAnalyticalQuestions);
    doc.moveDown(0.5);
    drawBodyText(`Scope & boundaries: ${sanitize(analysis.problemStructuring.scopeAndBoundaries)}`);
    doc.addPage();

    // Deep Dive Analysis
    drawSectionHeader('3. Deep Dive Analysis');
    const deepDive = analysis.deepDiveAnalysis;
    if (deepDive.market) {
      drawSectionHeader('3.1 Market');
      drawBodyText(`Growth: ${sanitize(deepDive.market.growth)}\nCompetitive mapping: ${sanitize(deepDive.market.competitiveMapping)}\nImplications: ${sanitize(deepDive.market.implications)}`);
    }
    if (deepDive.customer) {
      drawSectionHeader('3.2 Customer');
      drawBodyText(`Buying process: ${sanitize(deepDive.customer.buyingProcess)}\nRetention: ${sanitize(deepDive.customer.retention)}\nNPS: ${sanitize(deepDive.customer.nps)}\nImplications: ${sanitize(deepDive.customer.implications)}`);
    }
    if (deepDive.product) {
      drawSectionHeader('3.3 Product');
      drawBodyText(`Positioning: ${sanitize(deepDive.product.positioning)}\nPMF: ${sanitize(deepDive.product.productMarketFit)}\nImplications: ${sanitize(deepDive.product.implications)}`);
    }
    if (deepDive.operations) {
      drawSectionHeader('3.4 Operations');
      drawBodyText(`Process efficiencies: ${arrayToBulletedText(deepDive.operations.processEfficiencies)}\nScaling challenges: ${arrayToBulletedText(deepDive.operations.scalingChallenges)}\nImplications: ${sanitize(deepDive.operations.implications)}`);
    }
    if (deepDive.financial) {
      drawSectionHeader('3.5 Financial');
      drawBodyText(`Profitability: ${sanitize(deepDive.financial.profitability)}\nUnit economics: ${sanitize(deepDive.financial.unitEconomics)}\nImplications: ${sanitize(deepDive.financial.implications)}`);
    }
    doc.addPage();

    // Root Cause Analysis
    drawSectionHeader('4. Root Cause Analysis');
    drawBodyText(`Core issue: ${sanitize(analysis.rootCauseAnalysis.coreIssue)}\nHypotheses: ${analysis.rootCauseAnalysis.hypotheses.join('; ')}`);
    analysis.rootCauseAnalysis.causes.forEach((cause, index) => {
      doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(12).text(`Cause ${index + 1}: ${sanitize(cause.cause)}`);
      drawBodyText(`Evidence: ${sanitize(cause.evidence)}\nWhy it exists: ${sanitize(cause.whyItExists)}\nPriority: ${sanitize(cause.priority)}`);
    });
    doc.addPage();

    // Strategic Options
    drawSectionHeader('5. Strategic Options');
    analysis.strategicOptions.forEach((option, index) => {
      doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(13).text(`${index + 1}. ${sanitize(option.name)}`);
      drawBodyText(`${sanitize(option.description)}\nMechanism: ${sanitize(option.mechanism)}\nWhen to use: ${sanitize(option.whenToUse)}\nRequired capabilities: ${sanitize(option.requiredCapabilities.join(', '))}`);
      drawBodyText(`Pros:\n${arrayToBulletedText(option.pros)}\nCons:\n${arrayToBulletedText(option.cons)}`);
    });
    doc.addPage();

    // Final Recommendation
    drawSectionHeader('6. Final Recommendation');
    drawBodyText(`${sanitize(analysis.finalRecommendation.decision)}\n\nJustification: ${sanitize(analysis.finalRecommendation.justification)}\n\nWhy this option: ${sanitize(analysis.finalRecommendation.whyThisOption)}`);
    drawBodyText(`Partner-level insight: ${sanitize(analysis.finalRecommendation.partnerLevelInsight)}`);
    drawSectionHeader('Success criteria');
    drawBulletedList(analysis.finalRecommendation.successCriteria);
    drawSectionHeader('Trade-offs');
    analysis.finalRecommendation.tradeOffs.forEach(tradeoff => {
      drawBodyText(`• ${sanitize(tradeoff.what)} — ${sanitize(tradeoff.why)} (${tradeoff.acceptableRisk ? 'Acceptable' : 'High'} risk)`);
    });
    doc.addPage();

    // Execution Plan
    drawSectionHeader('7. Execution Plan');
    [analysis.executionPlan.phase1, analysis.executionPlan.phase2, analysis.executionPlan.phase3].forEach(phase => {
      doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(13).text(`${sanitize(phase.name)} — ${sanitize(phase.duration)}`);
      drawBodyText(`Milestones:\n${arrayToBulletedText(phase.milestones)}\nDependencies:\n${arrayToBulletedText(phase.dependencies)}\nSuccess metrics:\n${arrayToBulletedText(phase.successMetrics)}`);
    });
    drawBodyText(`Critical path: ${sanitize(analysis.executionPlan.criticalPath)}`);
    drawBodyText(`Dependencies: ${arrayToBulletedText(analysis.executionPlan.dependencies)}`);
    doc.addPage();

    // KPI Tracking System
    drawSectionHeader('8. KPI Tracking System');
    drawBodyText('This KPI system is designed to keep the team accountable to the recommendation and to surface early performance signals.');
    drawSectionHeader('Leading Indicators');
    analysis.kpiTrackingSystem.leadingIndicators.forEach(indicator => {
      drawBodyText(`${sanitize(indicator.name)} — Target: ${sanitize(indicator.target)} | Frequency: ${sanitize(indicator.frequency)} | Linked to: ${sanitize(indicator.linkedToAction)}`);
    });
    drawSectionHeader('Lagging Indicators');
    analysis.kpiTrackingSystem.laggingIndicators.forEach(indicator => {
      drawBodyText(`${sanitize(indicator.name)} — Target: ${sanitize(indicator.target)} | Frequency: ${sanitize(indicator.frequency)} | Linked to: ${sanitize(indicator.linkedToAction)}`);
    });
    drawBodyText(`Dashboard metrics: ${sanitize(analysis.kpiTrackingSystem.dashboardMetrics.join(', '))}`);
    drawBodyText(`Review cadence: ${sanitize(analysis.kpiTrackingSystem.reviewCadence)}`);
    doc.addPage();

    // Risks & Mitigation
    drawSectionHeader('9. Risks & Mitigation');
    analysis.risksAndMitigation.forEach((risk, index) => {
      doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(12).text(`${index + 1}. ${sanitize(risk.risk)}`);
      drawBodyText(`Impact: ${sanitize(risk.impact)} | Probability: ${sanitize(risk.probability)}\nMitigation: ${sanitize(risk.mitigationStrategy)}\nContingency: ${sanitize(risk.contingencyPlan)}\nOwner: ${sanitize(risk.owner)}`);
    });
    doc.addPage();

    // Thank You Page
    doc.fillColor('#020617').rect(0, 0, doc.page.width, doc.page.height).fill();
    doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(28).text('Thank You', {
      align: 'center',
    });
    doc.moveDown(1);
    doc.font('Helvetica').fontSize(12).fillColor('#94a3b8').text('We appreciate the opportunity to deliver this strategic analysis. Use this report to align leadership, drive execution, and track outcomes with confidence.', {
      align: 'center',
      width: pageWidth,
      lineGap: 5,
    });
    doc.moveDown(2);
    doc.font('Helvetica-Bold').fontSize(14).fillColor('#38bdf8').text('StrategyOS', { align: 'center' });
    doc.font('Helvetica').fontSize(11).fillColor('#cbd5e1').text('www.strategyos.ai', { align: 'center' });

    addPageFooter();
    doc.end();
  } catch (error: any) {
    console.error('PDF export error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate PDF report.',
    });
  }
});

/**
 * GET /api/templates
 * Get available consulting templates by firm type
 */
app.get('/api/templates', (req: Request, res: Response) => {
  const templates = {
    mckinsey: {
      name: 'McKinsey Style',
      description: 'Hypothesis-driven, structured analysis',
      components: [
        'Problem diagnosis',
        'MECE-based structuring',
        'Data-intensive deep dive',
      ],
    },
    bcg: {
      name: 'BCG Growth Focused',
      description: 'Growth strategy and competitive positioning',
      components: ['Growth hypothesis', 'Market opportunity', 'Execution roadmap'],
    },
    bain: {
      name: 'Bain Execution Focused',
      description: 'Implementation excellence and ROI clarity',
      components: ['Business impact', 'Implementation plan', 'Change management'],
    },
    accenture: {
      name: 'Accenture Tech Transformation',
      description: 'Technology and digital transformation focus',
      components: ['Tech assessment', 'Digital roadmap', 'Transformation governance'],
    },
  };

  res.json({
    success: true,
    templates,
  });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    requestId: res.locals.requestId,
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path,
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║       StrategyOS Backend Running       ║
║          Port: ${PORT}                     ║
║       Environment: ${process.env.NODE_ENV || 'development'}      ║
╚════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export default app;
