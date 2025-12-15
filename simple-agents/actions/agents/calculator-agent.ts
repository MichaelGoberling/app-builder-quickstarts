import * as restate from '@restatedev/restate-sdk';
import { AgentCard, AgentOutput } from '../../lib/types/agent-card';

interface CalculationInput {
  operation: 'add' | 'subtract' | 'multiply' | 'divide';
  numbers: number[];
}

interface CalculationResult {
  result: number;
  operation: string;
  input: number[];
}

const RESTATE_COMPONENT_NAME = process.env.RESTATE_COMPONENT_NAME || 'simple-calculatorAgent';

export default restate.object({
  name: RESTATE_COMPONENT_NAME,
  handlers: {
    async getCard(ctx: restate.ObjectContext): Promise<AgentCard> {
      return {
        name: RESTATE_COMPONENT_NAME,
        description: 'Performs basic arithmetic operations on numbers',
        capabilities: [
          'Add multiple numbers together',
          'Subtract numbers sequentially',
          'Multiply multiple numbers together',
          'Divide numbers sequentially',
        ],
        inputSchema: {
          description: 'Operation type and array of numbers to perform operation on',
          requiredFields: ['operation', 'numbers'],
          optionalFields: [],
        },
        outputSchema: {
          description: 'Result of the calculation with operation details',
          fields: ['result', 'operation', 'input'],
        },
      };
    },

    async calculate(
      ctx: restate.ObjectContext,
      input: CalculationInput
    ): Promise<AgentOutput<CalculationResult>> {
      ctx.console.info(`CalculatorAgent: Performing ${input.operation} on ${input.numbers.length} numbers`);

      try {
        if (!input.numbers || input.numbers.length === 0) {
          throw new Error('No numbers provided for calculation');
        }

        let result: number;

        switch (input.operation) {
          case 'add':
            result = input.numbers.reduce((sum, num) => sum + num, 0);
            ctx.console.info(`Addition result: ${result}`);
            break;

          case 'subtract':
            result = input.numbers.reduce((diff, num) => diff - num);
            ctx.console.info(`Subtraction result: ${result}`);
            break;

          case 'multiply':
            result = input.numbers.reduce((product, num) => product * num, 1);
            ctx.console.info(`Multiplication result: ${result}`);
            break;

          case 'divide':
            result = input.numbers.reduce((quotient, num) => {
              if (num === 0) {
                throw new Error('Division by zero');
              }
              return quotient / num;
            });
            ctx.console.info(`Division result: ${result}`);
            break;

          default:
            throw new Error(`Unknown operation: ${input.operation}`);
        }

        return {
          success: true,
          data: {
            result,
            operation: input.operation,
            input: input.numbers,
          },
        };
      } catch (error) {
        ctx.console.error('CalculatorAgent error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new restate.TerminalError(errorMessage);
      }
    },
  },
});

