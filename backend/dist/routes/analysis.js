"use strict";
/**
 * Analysis Routes
 * API endpoints for consulting analysis operations
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uuid_1 = require("uuid");
const engine_1 = require("@core/engine");
const router = (0, express_1.Router)();
// POST /api/analysis/generate
router.post('/generate', async (req, res) => {
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
        console.log(`[${res.locals.requestId}] Generating analysis for: ${problem.title}`);
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
        console.error(`[${res.locals.requestId}] Analysis error:`, error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to generate analysis',
        });
    }
});
// GET /api/analysis/:id
router.get('/:id', (req, res) => {
    try {
        const { id } = req.params;
        console.log(`[${res.locals.requestId}] Retrieving analysis: ${id}`);
        res.json({
            success: true,
            message: `Analysis retrieval for ${id} would fetch from database`,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});
exports.default = router;
//# sourceMappingURL=analysis.js.map