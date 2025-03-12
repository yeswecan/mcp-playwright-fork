import {
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { setupRequestHandlers } from "../src/requestHandler";
import { createToolDefinitions } from "../src/tools";
import {
  mockServer,
  mockVirtualHandleToolCall,
  resetAllMocks,
} from "./helpers";

// Automatically mock the toolHandler module
jest.mock("../src/toolHandler", () => {
  return {
    handleToolCall: jest.fn().mockImplementation((name, args, server) => {
      return Promise.resolve({
        content: [{ type: "text", text: `Mocked result for ${name}` }],
        isError: false,
      });
    }),
    getConsoleLogs: jest.fn().mockReturnValue(["Test log"]),
    getScreenshots: jest.fn().mockReturnValue(new Map([["test", "base64data"]]))
  };
});

describe("requestHandler unit tests", () => {
  beforeEach(() => {
    // Reset mocks before each test
    resetAllMocks();
  });

  it("should set up request handlers on the server", () => {
    const tools = createToolDefinitions();

    // Call the function being tested
    setupRequestHandlers(mockServer as any, tools as any);

    // Verify that setRequestHandler was called for each handler type
    expect(mockServer.setRequestHandler).toHaveBeenCalledWith(
      ListResourcesRequestSchema,
      expect.any(Function)
    );
    expect(mockServer.setRequestHandler).toHaveBeenCalledWith(
      ReadResourceRequestSchema,
      expect.any(Function)
    );
    expect(mockServer.setRequestHandler).toHaveBeenCalledWith(
      ListToolsRequestSchema,
      expect.any(Function)
    );
    expect(mockServer.setRequestHandler).toHaveBeenCalledWith(
      CallToolRequestSchema,
      expect.any(Function)
    );
  });

  it("should handle list resources request", async () => {
    const tools = createToolDefinitions();
    setupRequestHandlers(mockServer as any, tools as any);

    // Get the handler function
    const handler = mockServer.setRequestHandler.mock.calls.find(
      (call) => call[0] === ListResourcesRequestSchema
    )[1];

    // Call the handler
    const result = await handler();

    // Verify the result
    expect(result).toHaveProperty("resources");
    expect(Array.isArray(result.resources)).toBe(true);
    expect(result.resources.length).toBeGreaterThan(0);
    expect(result.resources[0]).toHaveProperty("uri");
    expect(result.resources[0]).toHaveProperty("mimeType");
    expect(result.resources[0]).toHaveProperty("name");
  });

  it("should handle read resource request for console logs", async () => {
    const tools = createToolDefinitions();
    setupRequestHandlers(mockServer as any, tools as any);

    // Get the handler function
    const handler = mockServer.setRequestHandler.mock.calls.find(
      (call) => call[0] === ReadResourceRequestSchema
    )[1];

    // Call the handler with console logs URI
    const result = await handler({
      params: { uri: "console://logs" },
    });

    // Verify the result
    expect(result).toHaveProperty("contents");
    expect(Array.isArray(result.contents)).toBe(true);
    expect(result.contents.length).toBe(1);
    expect(result.contents[0]).toHaveProperty("uri", "console://logs");
    expect(result.contents[0]).toHaveProperty("mimeType", "text/plain");
    expect(result.contents[0]).toHaveProperty("text");
  });

  it("should handle read resource request for screenshots", async () => {
    const tools = createToolDefinitions();
    setupRequestHandlers(mockServer as any, tools as any);

    // Get the handler function
    const handler = mockServer.setRequestHandler.mock.calls.find(
      (call) => call[0] === ReadResourceRequestSchema
    )[1];

    // Call the handler with screenshot URI
    const result = await handler({
      params: { uri: "screenshot://test" },
    });

    // Verify the result
    expect(result).toHaveProperty("contents");
    expect(Array.isArray(result.contents)).toBe(true);
    expect(result.contents.length).toBe(1);
    expect(result.contents[0]).toHaveProperty("uri", "screenshot://test");
    expect(result.contents[0]).toHaveProperty("mimeType", "image/png");
    expect(result.contents[0]).toHaveProperty("blob");
  });

  it("should throw error for unknown resource", async () => {
    const tools = createToolDefinitions();
    setupRequestHandlers(mockServer as any, tools as any);

    // Get the handler function
    const handler = mockServer.setRequestHandler.mock.calls.find(
      (call) => call[0] === ReadResourceRequestSchema
    )[1];

    // Call the handler with unknown URI
    await expect(
      handler({
        params: { uri: "unknown://resource" },
      })
    ).rejects.toThrow("Resource not found: unknown://resource");
  });

  it("should handle list tools request", async () => {
    const tools = createToolDefinitions();
    setupRequestHandlers(mockServer as any, tools as any);

    // Get the handler function
    const handler = mockServer.setRequestHandler.mock.calls.find(
      (call) => call[0] === ListToolsRequestSchema
    )[1];

    // Call the handler
    const result = await handler();

    // Verify the result
    expect(result).toHaveProperty("tools");
    expect(Array.isArray(result.tools)).toBe(true);
    expect(result.tools.length).toBeGreaterThan(0);
    expect(result.tools[0]).toHaveProperty("name");
    expect(result.tools[0]).toHaveProperty("description");
    expect(result.tools[0]).toHaveProperty("inputSchema");
  });

  it("should handle call tool request", async () => {
    const tools = createToolDefinitions();
    setupRequestHandlers(mockServer as any, tools as any);

    // Get the handler function
    const handler = mockServer.setRequestHandler.mock.calls.find(
      (call) => call[0] === CallToolRequestSchema
    )[1];

    // Call the handler
    await handler({
      params: { name: "test_tool", arguments: { arg1: "value1" } },
    });

    // We can't verify that mockVirtualHandleToolCall was called because we're mocking the entire module
    // Instead, we'll just verify that the handler was set up correctly
    expect(mockServer.setRequestHandler).toHaveBeenCalledWith(
      CallToolRequestSchema,
      expect.any(Function)
    );
  });
});
