// Get namespace from environment (set by runtime or aio app dev)
const NAMESPACE = process.env.AIO_RUNTIME_NAMESPACE || process.env.__OW_NAMESPACE || 'local';

export const AGENT_NAMES = {
  CALCULATOR: `${NAMESPACE}-simple-calculatorAgent`,
  STATISTICS: `${NAMESPACE}-simple-statisticsAgent`,
  ORCHESTRATOR: `${NAMESPACE}-simple-orchestrator`,
} as const;

export const KNOWN_AGENTS = [
  AGENT_NAMES.CALCULATOR,
  AGENT_NAMES.STATISTICS,
] as const;

export type AgentName = typeof AGENT_NAMES[keyof typeof AGENT_NAMES];

