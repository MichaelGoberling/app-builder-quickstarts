import * as restate from '@restatedev/restate-sdk';
import { AgentCard, AgentOutput } from '../../lib/types/agent-card';
import { AGENT_NAMES } from '../../lib/shared/agent-config';

interface StatisticsInput {
  numbers: number[];
}

interface StatisticsResult {
  count: number;
  sum: number;
  mean: number;
  median: number;
  min: number;
  max: number;
  range: number;
}

const RESTATE_COMPONENT_NAME = process.env.RESTATE_COMPONENT_NAME || 'simple-statisticsAgent';

export default restate.object({
  name: RESTATE_COMPONENT_NAME,
  handlers: {
    async getCard(ctx: restate.ObjectContext): Promise<AgentCard> {
      return {
        name: RESTATE_COMPONENT_NAME,
        description: 'Calculates statistical measures from a list of numbers',
        capabilities: [
          'Calculate mean (average)',
          'Find median value',
          'Determine min and max values',
          'Calculate range',
          'Uses Calculator Agent for arithmetic operations',
        ],
        inputSchema: {
          description: 'Array of numbers to analyze',
          requiredFields: ['numbers'],
          optionalFields: [],
        },
        outputSchema: {
          description: 'Statistical measures including mean, median, min, max, and range',
          fields: ['count', 'sum', 'mean', 'median', 'min', 'max', 'range'],
        },
      };
    },

    async analyzeNumbers(
      ctx: restate.ObjectContext,
      input: StatisticsInput
    ): Promise<AgentOutput<StatisticsResult>> {
      ctx.console.info(`StatisticsAgent: Analyzing ${input.numbers.length} numbers`);

      try {
        if (!input.numbers || input.numbers.length === 0) {
          throw new Error('No numbers provided for analysis');
        }

        const count = input.numbers.length;

        // Call Calculator Agent to get the sum
        ctx.console.info('Calling Calculator Agent to sum numbers...');
        const calculatorClient = ctx.objectClient<any>({ name: AGENT_NAMES.CALCULATOR }, 'default');
        const sumResult = (await calculatorClient.calculate({
          operation: 'add',
          numbers: input.numbers,
        })) as AgentOutput<{ result: number }>;

        if (!sumResult.success) {
          throw new Error('Failed to calculate sum');
        }

        const sum = sumResult.data.result;
        
        // Calculate mean using Calculator Agent
        ctx.console.info('Calling Calculator Agent to calculate mean...');
        const meanResult = (await calculatorClient.calculate({
          operation: 'divide',
          numbers: [sum, count],
        })) as AgentOutput<{ result: number }>;

        if (!meanResult.success) {
          throw new Error('Failed to calculate mean');
        }

        const mean = meanResult.data.result;

        // Calculate median (locally, as it's more complex)
        const sortedNumbers = [...input.numbers].sort((a, b) => a - b);
        let median: number;
        const midpoint = Math.floor(count / 2);
        
        if (count % 2 === 0) {
          // For even count, calculate average of two middle numbers using Calculator
          ctx.console.info('Calculating median for even count using Calculator Agent...');
          const medianSumResult = (await calculatorClient.calculate({
            operation: 'add',
            numbers: [sortedNumbers[midpoint - 1], sortedNumbers[midpoint]],
          })) as AgentOutput<{ result: number }>;
          
          const medianDivResult = (await calculatorClient.calculate({
            operation: 'divide',
            numbers: [medianSumResult.data.result, 2],
          })) as AgentOutput<{ result: number }>;
          
          median = medianDivResult.data.result;
        } else {
          median = sortedNumbers[midpoint];
        }

        // Find min and max (done locally as these are simple comparisons)
        const min = Math.min(...input.numbers);
        const max = Math.max(...input.numbers);

        // Calculate range using Calculator Agent
        ctx.console.info('Calling Calculator Agent to calculate range...');
        const rangeResult = (await calculatorClient.calculate({
          operation: 'subtract',
          numbers: [max, min],
        })) as AgentOutput<{ result: number }>;

        const range = rangeResult.data.result;

        const result: StatisticsResult = {
          count,
          sum,
          mean,
          median,
          min,
          max,
          range,
        };

        ctx.console.info(`Analysis complete: mean=${mean}, median=${median}, range=${range}`);

        return {
          success: true,
          data: result,
        };
      } catch (error) {
        ctx.console.error('StatisticsAgent error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new restate.TerminalError(errorMessage);
      }
    },
  },
});

