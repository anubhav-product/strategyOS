import type { BusinessProblem, ConsultingAnalysis } from './types';
export declare class ConsultingEngine {
    private problem;
    constructor(problem: BusinessProblem);
    generateAnalysis(): Promise<ConsultingAnalysis>;
}
//# sourceMappingURL=engine.d.ts.map