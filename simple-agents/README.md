# Simple Multi-Agent Orchestrator

A simple multi-agent orchestrator demonstrating stateful and durable agents deployed on Runtime.

Try it out: `aio app init --repo MichaelGoberling/appbuilder-quickstarts/simple-agents`

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
- Set up .env 
```
AIO_runtime_auth= # required
AIO_runtime_namespace= # required
AIO_RUNTIME_APIHOST=https://stage.next-adobeioruntime.net # DO NOT CHANGE. Agents are only availble at this api host
```

## Installation

```bash
cd multi-agent-orchestrator-simple
npm install
```

## Build

```bash
aio app build
```

## Run the service locally

```bash 
aio app dev 
```

Note: Can debug using **Run and debug** in VSCode using the `App Builder: debug actions` target.

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

Response:
```json
{"success":true,"data":{"count":5,"sum":150,"mean":30,"median":30,"min":10,"max":50,"range":40}}
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
