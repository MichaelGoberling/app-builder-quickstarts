import * as restate from '@restatedev/restate-sdk';
import { discoverAgents } from '../../lib/shared/agent-discovery';
import { AGENT_NAMES } from '../../lib/shared/agent-config';

interface OrchestratorInput {
  operation: 'calculate' | 'analyze';
  numbers: number[];
  calculationOperation?: 'add' | 'subtract' | 'multiply' | 'divide';
}

interface OrchestratorOutput {
  success: boolean;
  result: any;
  agentsUsed: string[];
  error?: string;
}

const RESTATE_COMPONENT_NAME = process.env.RESTATE_COMPONENT_NAME || 'simple-orchestrator';

export const orchestrator = restate.workflow({
  name: RESTATE_COMPONENT_NAME,
  handlers: {
    async run(ctx: restate.WorkflowContext, input: OrchestratorInput): Promise<OrchestratorOutput> {
      ctx.console.info('='.repeat(80));
      ctx.console.info('SIMPLE ORCHESTRATOR WORKFLOW STARTED');
      ctx.console.info('='.repeat(80));
      ctx.console.info(`Operation: ${input.operation}`);
      ctx.console.info(`Numbers: [${input.numbers.join(', ')}]`);

      const agentsUsed: string[] = [];

      try {
        // Step 1: Discover available agents
        ctx.console.info('\n[Step 1] Discovering available agents...');
        const availableAgents = await discoverAgents(ctx);
        ctx.console.info(`✓ Discovered ${availableAgents.length} agents`);
        availableAgents.forEach(agent => {
          ctx.console.info(`  - ${agent.name}: ${agent.description}`);
        });

        // Step 2: Execute based on operation type
        if (input.operation === 'calculate') {
          ctx.console.info('\n[Step 2] Performing calculation...');
          
          if (!input.calculationOperation) {
            throw new Error('calculationOperation is required for calculate operation');
          }

          const calculatorClient = ctx.objectClient<any>({ name: AGENT_NAMES.CALCULATOR }, 'default');
          const result = await calculatorClient.calculate({
            operation: input.calculationOperation,
            numbers: input.numbers,
          }) as { success: boolean; data: { result: number; operation: string; input: number[] } };

          agentsUsed.push(AGENT_NAMES.CALCULATOR);
          
          ctx.console.info(`✓ Calculation complete: ${result.data.result}`);
          
          ctx.console.info('\n' + '='.repeat(80));
          ctx.console.info('ORCHESTRATOR WORKFLOW COMPLETED SUCCESSFULLY');
          ctx.console.info('='.repeat(80));

          return {
            success: true,
            result: result.data,
            agentsUsed,
          };
        } else if (input.operation === 'analyze') {
          ctx.console.info('\n[Step 2] Performing statistical analysis...');
          ctx.console.info('(Statistics Agent will call Calculator Agent internally)');
          
          const statisticsClient = ctx.objectClient<any>({ name: AGENT_NAMES.STATISTICS }, 'default');
          const result = await statisticsClient.analyzeNumbers({
            numbers: input.numbers,
          }) as { success: boolean; data: { count: number; sum: number; mean: number; median: number; min: number; max: number; range: number } };

          agentsUsed.push(AGENT_NAMES.STATISTICS);
          agentsUsed.push(AGENT_NAMES.CALCULATOR + ' (called by Statistics Agent)');
          
          ctx.console.info('✓ Analysis complete');
          ctx.console.info(`  Count: ${result.data.count}`);
          ctx.console.info(`  Sum: ${result.data.sum}`);
          ctx.console.info(`  Mean: ${result.data.mean}`);
          ctx.console.info(`  Median: ${result.data.median}`);
          ctx.console.info(`  Min: ${result.data.min}`);
          ctx.console.info(`  Max: ${result.data.max}`);
          ctx.console.info(`  Range: ${result.data.range}`);
          
          ctx.console.info('\n' + '='.repeat(80));
          ctx.console.info('ORCHESTRATOR WORKFLOW COMPLETED SUCCESSFULLY');
          ctx.console.info('='.repeat(80));

          return {
            success: true,
            result: result.data,
            agentsUsed,
          };
        } else {
          throw new Error(`Unknown operation: ${input.operation}`);
        }
      } catch (error) {
        ctx.console.error('Orchestrator workflow failed:', error);
        return {
          success: false,
          result: null,
          agentsUsed,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    },
  },
});
