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
    const sectionText = (title: string, text: string) => {
      doc.fontSize(14).fillColor('#111827').text(title, { underline: true });
      doc.moveDown(0.25);
      doc.fontSize(11).fillColor('#1f2937').text(text, {
        lineGap: 4,
        indent: 4,
        paragraphGap: 4,
      });
      doc.moveDown(0.75);
    };

    const sanitizedId = analysisId || uuidv4();
    const filename = `StrategyOS-Consulting-Report-${sanitizedId}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Cache-Control', 'no-store');

    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    doc.pipe(res);

    doc.font('Helvetica-Bold').fontSize(20).text('StrategyOS Consulting Report', { align: 'center' });
    doc.moveDown(0.5);
    doc.font('Helvetica').fontSize(10).fillColor('#9ca3af').text(`Report ID: ${sanitizedId}`);
    doc.text(`Generated: ${sanitize(generatedAt || new Date().toISOString())}`);
    doc.moveDown(1);

    doc.fillColor('#0ea5e9').font('Helvetica-Bold').fontSize(14).text('Executive Growth Visual', { underline: true });
    doc.moveDown(0.3);

    const visualSummary = [
      { label: 'Market', text: analysis.deepDiveAnalysis.market?.implications ?? 'Clarified market opportunity and trial value.' },
      { label: 'Customer', text: analysis.deepDiveAnalysis.customer?.implications ?? 'Segment-specific onboarding and early success.' },
      { label: 'Product', text: analysis.deepDiveAnalysis.product?.implications ?? 'Outcome-driven trial experience and differentiation.' },
      { label: 'Operations', text: analysis.deepDiveAnalysis.operations?.implications ?? 'Repeatable governance and conversion cadence.' },
      { label: 'Finance', text: analysis.deepDiveAnalysis.financial?.implications ?? 'Improved unit economics via higher conversion.' },
    ];

    visualSummary.forEach(item => {
      doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(11).text(`${item.label}: `, { continued: true });
      doc.fillColor('#d1d5db').font('Helvetica').text(item.text, { continued: false });
      doc.moveDown(0.5);
    });

    doc.moveDown(0.4);
    const impactMetrics = [
      { label: 'Conversion growth', value: analysis.finalRecommendation.expectedImpact.businessGrowth ?? 'N/A' },
      { label: 'Revenue lift', value: analysis.finalRecommendation.expectedImpact.revenueIncrease ?? 'N/A' },
      { label: 'Retention lift', value: analysis.finalRecommendation.expectedImpact.retentionLift ?? 'N/A' },
    ];
    const metricColors = ['#06b6d4', '#3b82f6', '#a855f7'];
    impactMetrics.forEach((metric, index) => {
      doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(11).text(metric.label);
      doc.fillColor('#9ca3af').font('Helvetica').text(metric.value);
      const barY = doc.y + 3;
      const barWidth = 450;
      const fillWidth = Math.max(50, Math.min(barWidth, barWidth * 0.8));
      doc.rect(doc.x, barY, barWidth, 8).fill('#111827');
      doc.fillColor(metricColors[index]).rect(doc.x, barY, fillWidth, 8).fill();
      doc.moveDown(2);
    });

    sectionText(
      '1. Problem Diagnosis',
      `${sanitize(analysis.problemDiagnosis.restatedProblem)}\n\nBusiness context: ${sanitize(analysis.problemDiagnosis.businessContext)}\n\nStakeholders: ${analysis.problemDiagnosis.stakeholders.join(', ')}`
    );

    sectionText(
      '2. Problem Structuring',
      `MECE buckets: ${analysis.problemStructuring.meceBuckets.join(', ')}\n\nKey analytical questions:\n${analysis.problemStructuring.keyAnalyticalQuestions.join('\n')}`
    );

    const deepDive = analysis.deepDiveAnalysis;
    if (deepDive.market) {
      sectionText(
        '3.1 Market Analysis',
        `${sanitize(deepDive.market.competitiveMapping)}\nGrowth: ${sanitize(deepDive.market.growth)}\nImplications: ${sanitize(deepDive.market.implications)}`
      );
    }
    if (deepDive.customer) {
      sectionText(
        '3.2 Customer Analysis',
        `${sanitize(deepDive.customer.buyingProcess)}\nRetention: ${sanitize(deepDive.customer.retention)}\nNPS: ${sanitize(deepDive.customer.nps)}`
      );
    }
    if (deepDive.product) {
      sectionText(
        '3.3 Product Analysis',
        `${sanitize(deepDive.product.positioning)}\nProduct-market fit: ${sanitize(deepDive.product.productMarketFit)}`
      );
    }
    if (deepDive.operations) {
      sectionText(
        '3.4 Operations Analysis',
        `Process efficiencies:\n${arrayToBulletedText(deepDive.operations.processEfficiencies)}\n\nScaling challenges:\n${arrayToBulletedText(deepDive.operations.scalingChallenges)}`
      );
    }
    if (deepDive.financial) {
      sectionText(
        '3.5 Financial Analysis',
        `${sanitize(deepDive.financial.profitability)}\nUnit economics: ${sanitize(deepDive.financial.unitEconomics)}`
      );
    }

    sectionText(
      '4. Root Cause Analysis',
      `Core issue: ${sanitize(analysis.rootCauseAnalysis.coreIssue)}\nHypotheses: ${analysis.rootCauseAnalysis.hypotheses.join('; ')}`
    );

    analysis.rootCauseAnalysis.causes.forEach((cause, index) => {
      doc.font('Helvetica-Bold').fontSize(12).text(`${index + 1}. ${sanitize(cause.cause)}`);
      doc.font('Helvetica').fontSize(11).text(`Evidence: ${sanitize(cause.evidence)}`);
      doc.text(`Why it exists: ${sanitize(cause.whyItExists)}`);
      doc.text(`Priority: ${sanitize(cause.priority)}`);
      doc.moveDown(0.5);
    });

    sectionText(
      '5. Strategic Options',
      analysis.strategicOptions.map(option => `${sanitize(option.name)}: ${sanitize(option.description)}`).join('\n\n')
    );

    sectionText(
      '6. Final Recommendation',
      `${sanitize(analysis.finalRecommendation.decision)}\n\nJustification: ${sanitize(analysis.finalRecommendation.justification)}`
    );

    sectionText(
      '7. Execution Plan',
      `Phase 1: ${sanitize(analysis.executionPlan.phase1.name)}\nPhase 2: ${sanitize(analysis.executionPlan.phase2.name)}\nPhase 3: ${sanitize(analysis.executionPlan.phase3.name)}`
    );

    sectionText(
      '8. KPI Tracking System',
      `Leading indicators: ${analysis.kpiTrackingSystem.leadingIndicators
        .map(i => `${sanitize(i.name)} (${sanitize(i.target)})`)
        .join('; ')}\n\nLagging indicators: ${analysis.kpiTrackingSystem.laggingIndicators
        .map(i => `${sanitize(i.name)} (${sanitize(i.target)})`)
        .join('; ')}`
    );

    sectionText(
      '9. Risks & Mitigation',
      analysis.risksAndMitigation
        .map(r => `${sanitize(r.risk)}: ${sanitize(r.mitigationStrategy)} | Contingency: ${sanitize(r.contingencyPlan)}`)
        .join('\n\n')
    );

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
