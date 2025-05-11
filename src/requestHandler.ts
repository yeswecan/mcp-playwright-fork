import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { 
  ListResourcesRequestSchema, 
  ReadResourceRequestSchema, 
  ListToolsRequestSchema, 
  CallToolRequestSchema,
  Tool
} from "@modelcontextprotocol/sdk/types.js";
import { handleToolCall, getConsoleLogs, getScreenshots } from "./toolHandler.js";
import { SSE_SERVER_SYMBOL } from './index.js';

export function setupRequestHandlers(server: Server, tools: Tool[]) {
  // List resources handler
  server.setRequestHandler(ListResourcesRequestSchema, async () => ({
    resources: [
      {
        uri: "console://logs",
        mimeType: "text/plain",
        name: "Browser console logs",
      },
      ...Array.from(getScreenshots().keys()).map(name => ({
        uri: `screenshot://${name}`,
        mimeType: "image/png",
        name: `Screenshot: ${name}`,
      })),
    ],
  }));

  // Read resource handler
  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const uri = request.params.uri.toString();

    if (uri === "console://logs") {
      const logs = getConsoleLogs().join("\n");
      // Broadcast logs to SSE clients
      try {
        const sseServer = (server as any)[SSE_SERVER_SYMBOL];
        if (sseServer) {
          sseServer.broadcast('console_logs', { logs });
        }
      } catch (err) {
        console.error('Failed to broadcast console logs via SSE:', err);
      }
      return {
        contents: [{
          uri,
          mimeType: "text/plain",
          text: logs,
        }],
      };
    }

    if (uri.startsWith("screenshot://")) {
      const name = uri.split("://")[1];
      const screenshot = getScreenshots().get(name);
      if (screenshot) {
        // Broadcast screenshot event to SSE clients
        try {
          const sseServer = (server as any)[SSE_SERVER_SYMBOL];
          if (sseServer) {
            sseServer.broadcast('screenshot', { name, screenshot });
          }
        } catch (err) {
          console.error('Failed to broadcast screenshot via SSE:', err);
        }
        return {
          contents: [{
            uri,
            mimeType: "image/png",
            blob: screenshot,
          }],
        };
      }
    }

    throw new Error(`Resource not found: ${uri}`);
  });

  // List tools handler
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: tools,
  }));

  // Call tool handler
  server.setRequestHandler(CallToolRequestSchema, async (request) =>
    handleToolCall(request.params.name, request.params.arguments ?? {}, server)
  );
}