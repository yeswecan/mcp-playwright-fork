#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createToolDefinitions } from "./tools.js";
import { setupRequestHandlers } from "./requestHandler.js";
import { SseServer } from './sseServer.js';
import http from 'http';

export const SSE_SERVER_SYMBOL = Symbol('sseServer');

async function runServer() {
  const server = new Server(
    {
      name: "executeautomation/playwright-mcp-server",
      version: "1.0.3",
    },
    {
      capabilities: {
        resources: {},
        tools: {},
      },
    }
  );

  // Create tool definitions
  const TOOLS = createToolDefinitions();

  // Setup request handlers
  setupRequestHandlers(server, TOOLS);

  // Start HTTP server for SSE
  const httpServer = http.createServer();
  const sseServer = new SseServer();
  sseServer.attachToServer(httpServer);
  httpServer.listen(3001, () => {
    console.log('SSE server listening on http://localhost:3001/events');
  });

  // Attach sseServer to MCP server for use in handlers
  (server as any)[SSE_SERVER_SYMBOL] = sseServer;

  // Create transport and connect
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

runServer().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});