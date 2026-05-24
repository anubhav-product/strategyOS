"use strict";
/**
 * StrategyOS Backend API
 * Main Express server initialization
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const uuid_1 = require("uuid");
const engine_1 = require("@core/engine");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.BACKEND_PORT || 3001;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ limit: '10mb', extended: true }));
// Request logging middleware
app.use((req, res, next) => {
    const requestId = (0, uuid_1.v4)();
    res.locals.requestId = requestId;
    console.log(`[${requestId}] ${req.method} ${req.path}`);
    next();
});
/**
 * POST /api/analysis/generate
 * Generate comprehensive consulting analysis for a business problem
 */
app.post('/api/analysis/generate', async (req, res) => {
    try {
        const problem = req.body;
        // Validation
        if (!problem.title || !problem.description) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: title, description',
            });
        }
        // Initialize consulting engine
        const engine = new engine_1.ConsultingEngine(problem);
        // Generate analysis
        const analysis = await engine.generateAnalysis();
        const response = {
            success: true,
            analysisId: (0, uuid_1.v4)(),
            analysis,
            generatedAt: new Date().toISOString(),
        };
        res.json(response);
    }
    catch (error) {
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
app.get('/api/analysis/:id', (req, res) => {
    try {
        const { id } = req.params;
        // In production, fetch from database
        res.json({
            success: true,
            message: `Retrieval for analysis ${id} would be implemented with database`,
        });
    }
    catch (error) {
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
app.post('/api/execution/track', (req, res) => {
    try {
        const { analysisId, phase, metrics } = req.body;
        res.json({
            success: true,
            message: 'Execution tracking recorded',
            trackingId: (0, uuid_1.v4)(),
        });
    }
    catch (error) {
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
app.get('/api/health', (req, res) => {
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
app.post('/api/export/pdf', (req, res) => {
    try {
        const { analysisId, analysis } = req.body;
        if (!analysis) {
            return res.status(400).json({
                success: false,
                error: 'Missing analysis payload for PDF export.',
            });
        }
        const sanitizedId = analysisId || (0, uuid_1.v4)();
        const filename = `StrategyOS-Consulting-Report-${sanitizedId}.pdf`;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        const doc = new pdfkit_1.default({ margin: 40, size: 'A4' });
        doc.pipe(res);
        doc.fontSize(20).text('StrategyOS Consulting Report', { align: 'center' });
        doc.moveDown(0.5);
        doc.fontSize(10).text(`Report ID: ${sanitizedId}`);
        doc.text(`Generated: ${new Date().toISOString()}`);
        doc.moveDown(1);
        const writeSection = (title, text) => {
            doc.fontSize(14).fillColor('#111827').text(title, { underline: true });
            doc.moveDown(0.25);
            doc.fontSize(11).fillColor('#1f2937').text(text, { lineGap: 4 });
            doc.moveDown(0.75);
        };
        const writeList = (items) => {
            items.forEach(item => {
                doc.fontSize(11).text(`• ${item}`, { indent: 12, lineGap: 2 });
            });
            doc.moveDown(0.5);
        };
        writeSection('1. Problem Diagnosis', `${analysis.problemDiagnosis.restatedProblem}\n\nBusiness context: ${analysis.problemDiagnosis.businessContext}`);
        writeSection('2. Problem Structuring', `MECE buckets: ${analysis.problemStructuring.meceBuckets.join(', ')}\n\nKey analytical questions:\n${analysis.problemStructuring.keyAnalyticalQuestions.join('\n')}`);
        const deepDive = analysis.deepDiveAnalysis;
        if (deepDive.market) {
            writeSection('3.1 Market Analysis', `${deepDive.market.competitiveMapping}\nGrowth: ${deepDive.market.growth}\nImplications: ${deepDive.market.implications}`);
        }
        if (deepDive.customer) {
            writeSection('3.2 Customer Analysis', `${deepDive.customer.buyingProcess}\nRetention: ${deepDive.customer.retention}\nNPS: ${deepDive.customer.nps}`);
        }
        if (deepDive.product) {
            writeSection('3.3 Product Analysis', `${deepDive.product.positioning}\nProduct-market fit: ${deepDive.product.productMarketFit}`);
        }
        if (deepDive.operations) {
            writeSection('3.4 Operations Analysis', `${deepDive.operations.processEfficiencies.join('; ')}\nScaling challenges: ${deepDive.operations.scalingChallenges.join('; ')}`);
        }
        if (deepDive.financial) {
            writeSection('3.5 Financial Analysis', `${deepDive.financial.profitability}\nUnit economics: ${deepDive.financial.unitEconomics}`);
        }
        writeSection('4. Root Cause Analysis', `Core issue: ${analysis.rootCauseAnalysis.coreIssue}\nHypotheses: ${analysis.rootCauseAnalysis.hypotheses.join('; ')}`);
        analysis.rootCauseAnalysis.causes.forEach((cause, index) => {
            doc.fontSize(12).text(`${index + 1}. ${cause.cause}`, { underline: true });
            doc.fontSize(11).text(`Evidence: ${cause.evidence}`);
            doc.text(`Why it exists: ${cause.whyItExists}`);
            doc.text(`Priority: ${cause.priority}`);
            doc.moveDown(0.5);
        });
        writeSection('5. Strategic Options', analysis.strategicOptions.map(option => `${option.name}: ${option.description}`).join('\n\n'));
        writeSection('6. Final Recommendation', `${analysis.finalRecommendation.decision}\n\nJustification: ${analysis.finalRecommendation.justification}`);
        writeSection('7. Execution Plan', `Phase 1: ${analysis.executionPlan.phase1.name}\nPhase 2: ${analysis.executionPlan.phase2.name}\nPhase 3: ${analysis.executionPlan.phase3.name}`);
        writeSection('8. KPI Tracking System', `Leading indicators: ${analysis.kpiTrackingSystem.leadingIndicators.map(i => `${i.name} (${i.target})`).join('; ')}\nLagging indicators: ${analysis.kpiTrackingSystem.laggingIndicators.map(i => `${i.name} (${i.target})`).join('; ')}`);
        writeSection('9. Risks & Mitigation', analysis.risksAndMitigation.map(r => `${r.risk}: ${r.mitigationStrategy} | Contingency: ${r.contingencyPlan}`).join('\n\n'));
        doc.end();
    }
    catch (error) {
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
app.get('/api/templates', (req, res) => {
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
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        requestId: res.locals.requestId,
    });
});
// 404 handler
app.use((req, res) => {
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
exports.default = app;
//# sourceMappingURL=index.js.map