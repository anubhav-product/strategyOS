/**
 * Analysis Routes
 * API endpoints for consulting analysis operations
 */

import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { ConsultingEngine } from '@core/engine';
import type { BusinessProblem, ConsultingAnalysis } from '@core/types';

const router = Router();

// POST /api/analysis/generate
router.post('/generate', async (req: Request, res: Response) => {
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
    console.log(`[${res.locals.requestId}] Generating analysis for: ${problem.title}`);
    const analysis = await engine.generateAnalysis();

    const response = {
      success: true,
      analysisId: uuidv4(),
      analysis,
      generatedAt: new Date().toISOString(),
    };

    res.json(response);
  } catch (error: any) {
    console.error(`[${res.locals.requestId}] Analysis error:`, error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate analysis',
    });
  }
});

// GET /api/analysis/:id
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(`[${res.locals.requestId}] Retrieving analysis: ${id}`);

    res.json({
      success: true,
      message: `Analysis retrieval for ${id} would fetch from database`,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
