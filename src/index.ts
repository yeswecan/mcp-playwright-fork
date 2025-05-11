#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createToolDefinitions } from "./tools.js";
import { setupRequestHandlers } from "./requestHandler.js";
import { SseServer } from './sseServer.js';
import http from 'http';

export const SSE_SERVER_SYMBOL = Symbol('sseServer');

// Custom interface to allow symbol property
interface McpServerWithSSE extends Server {
  [key: symbol]: any;
}

async function runServer() {
  const server: McpServerWithSSE = new Server(
    {
      name: "executeautomation/playwright-mcp-server",
      version: "1.0.4",
    },
    {
      capabilities: {
        resources: {},
        tools: {},
      },
    }
  ) as McpServerWithSSE;

  // Create tool definitions
  const TOOLS = createToolDefinitions();

  // Setup request handlers
  setupRequestHandlers(server, TOOLS);

  // Start HTTP server for SSE only if not in test environment
  let sseServer;
  if (process.env.NODE_ENV !== 'test') {
    let httpServer;
    try {
      httpServer = http.createServer();
      sseServer = new SseServer();
      sseServer.attachToServer(httpServer);
      httpServer.listen(3001, () => {
        console.log('SSE server listening on http://localhost:3001/events');
      });
    } catch (err) {
      console.error('Failed to initialize SSE server:', err);
    }
    if (sseServer) {
      server[SSE_SERVER_SYMBOL] = sseServer;
    }
  }

  // Create transport and connect
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

runServer().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});