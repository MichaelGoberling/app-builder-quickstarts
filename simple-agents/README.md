# Simple Multi-Agent Orchestrator

A simple multi-agent orchestrator demonstrating stateful and durable agents deployed on Adobe App Builder.

Try it out: `aio app init --repo MichaelGoberling/app-builder-quickstarts/simple-agents --no-login`

## Learn More

https://github.com/user-attachments/assets/7e0c6e41-d8df-474f-8560-9e8dd3217dea

## Prerequisites

- Node.js >= 18
- `aio` CLI
- Install custom aio-cli-plugin-app
```bash 
aio plugins install https://github.com/adobe/aio-cli-plugin-app/tree/agent-workloads
```
- Install custom aio-cli-plugin-app-dev
```bash
aio plugins install https://github.com/adobe/aio-cli-plugin-app-dev/tree/agentic-workloads
```
- Generate .env with runtime namespace and credentials 
```bash
npx aio-internal-login stage
```

## Installation

```bash
npm install
```

## Build

```bash
aio app build
```

## Debugging in VS Code

You can run and debug agents using **Run and debug** in VSCode, just use the `App Builder: debug actions` target.

## Run the service locally (standalone)

```bash 
aio app dev 
```

## Deploy 

```bash 
aio app deploy 
```

## Usage Examples (local)

Call agents locally:

### Statistics Agent - Full Analysis
```bash
curl -k -X POST https://localhost:9080/api/v1/state/<namespace>/simple/statisticsAgent/test/analyzeNumbers \
     -H "Content-Type: application/json" \
     -d '{"numbers": [10, 20, 40]}'
```

This will internally call the Calculator Agent multiple times to compute sum, mean, median, and range.

> Note: Your namespace will be in your .env

Response:
```json
{"success":true,"data":{"count":5,"sum":150,"mean":30,"median":30,"min":10,"max":50,"range":40}}
```

### Accessing the Restate UI

When running locally, you can access the Restate UI for monitoring and debugging your agents:

```
http://localhost:9070/ui
```

## Usage Examples

Call agents remotely: 

### Statistics Agent - Full Analysis 

```bash 
curl -X POST https://stage.next-adobeioruntime.net/api/v1/state/<namespace>/simple/statisticsAgent/test/analyzeNumbers \
     -H "Content-Type: application/json" \
     -d '{"numbers": [10, 20, 40]}'
```

> Note: Your namespace will be in your .env

### Accessing the Restate UI

When running deployed agents, you can access the Restate UI for monitoring and debugging:

```
https://restate-ns-team-ethos651stageva6-faast-stg-pri-ctrl-b.corp.ethos651-stage-va6.ethos.adobe.net/ui/invocations
```

## Architecture

This project contains two simple agents that work together:

1. **Calculator Agent** - Performs basic arithmetic operations (add, subtract, multiply, divide)
2. **Statistics Agent** - Calculates statistical measures by calling the Calculator Agent

The Statistics Agent demonstrates inter-agent communication by calling the Calculator Agent to perform arithmetic operations needed for statistical calculations.

## Architecture

```
┌─────────────────────┐
│   Orchestrator      │
│   (Workflow)        │
└──────────┬──────────┘
           │
           ├──────────────────┐
           │                  │
           ▼                  ▼
┌──────────────────┐  ┌──────────────────┐
│ Calculator Agent │◄─┤ Statistics Agent │
│                  │  │                  │
│ - Add            │  │ - Mean           │
│ - Subtract       │  │ - Median         │
│ - Multiply       │  │ - Min/Max        │
│ - Divide         │  │ - Range          │
└──────────────────┘  └──────────────────┘
```

## Features

### Calculator Agent
- Add multiple numbers
- Subtract numbers sequentially
- Multiply multiple numbers
- Divide numbers sequentially

### Statistics Agent
- Calculate count, sum, mean, median
- Find minimum and maximum values
- Calculate range
- **Calls Calculator Agent internally** for arithmetic operations
