export interface AgentCard {
  name: string;
  description: string;
  capabilities: string[];
  inputSchema: {
    description: string;
    requiredFields: string[];
    optionalFields: string[];
  };
  outputSchema: {
    description: string;
    fields: string[];
  };
}

export interface AgentOutput<T> {
  success: boolean;
  data: T;
  error?: string;
}

