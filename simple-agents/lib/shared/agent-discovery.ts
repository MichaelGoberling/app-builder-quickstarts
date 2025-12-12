import * as restate from '@restatedev/restate-sdk';
import { AgentCard } from '../types/agent-card';
import { KNOWN_AGENTS } from './agent-config';

export async function discoverAgents(ctx: restate.Context | restate.WorkflowContext): Promise<AgentCard[]> {
  ctx.console.info('Starting agent discovery...');
  
  const discoveredCards: AgentCard[] = [];

  for (const agentName of KNOWN_AGENTS) {
    try {
      ctx.console.info(`Discovering agent: ${agentName}`);
      
      const client = ctx.objectClient<any>({ name: agentName }, 'default');
      const card = await client.getCard() as AgentCard;
      
      discoveredCards.push(card);
      ctx.console.info(`✓ Discovered ${agentName}: ${card.description}`);
    } catch (error) {
      ctx.console.warn(`✗ Failed to discover ${agentName}:`, error);
    }
  }

  ctx.console.info(`Discovery complete. Found ${discoveredCards.length} agents.`);
  return discoveredCards;
}

