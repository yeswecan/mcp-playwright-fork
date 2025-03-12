import {
  mockApiContext,
  setupPlaywrightMocks,
  resetAllMocks,
  createMockToolContext,
  mockServer
} from "./helpers";

// Set up all mocks
setupPlaywrightMocks();

// Import the toolHandler and GetRequestTool after mocking dependencies
import { handleToolCall } from "../src/toolHandler";
import { GetRequestTool } from "../src/tools/api/requests";
import { ToolResponse } from "../src/tools/common/types";
import { TextContent } from '@modelcontextprotocol/sdk/types.js';

describe("playwright_get unit tests", () => {
  let getRequestTool: GetRequestTool;
  
  beforeEach(() => {
    // Reset mocks before each test
    resetAllMocks();
    
    // Create a new instance of the GetRequestTool
    getRequestTool = new GetRequestTool(mockServer);
  });

  it("should handle GET request tool directly", async () => {
    // Set up the mock
    mockApiContext.get.mockResolvedValueOnce({
      text: jest.fn().mockResolvedValue(JSON.stringify({ data: "test data" })),
      status: jest.fn().mockReturnValue(200),
      statusText: jest.fn().mockReturnValue("OK")
    });
    
    // Create a mock context
    const context = createMockToolContext();

    // Call the tool directly
    const result = await getRequestTool.execute(
      { url: "https://api.example.com/data" },
      context
    );

    // Verify the result
    expect(result.isError).toBe(false);
    expect((result.content[0] as TextContent).text).toBe("GET request to https://api.example.com/data");
    expect((result.content[1] as TextContent).text).toBe("Status: 200 OK");
    expect((result.content[2] as TextContent).text).toContain("test data");
    expect(mockApiContext.get).toHaveBeenCalledWith("https://api.example.com/data");
  });

  it("should handle playwright_get tool through handler", async () => {
    // Set up the mock
    mockApiContext.get.mockResolvedValueOnce({
      text: jest.fn().mockResolvedValue(JSON.stringify({ data: "test data" })),
      status: jest.fn().mockReturnValue(200),
      statusText: jest.fn().mockReturnValue("OK")
    });

    // Call the tool through the handler
    const result = await handleToolCall(
      "playwright_get",
      { url: "https://api.example.com/data" },
      mockServer
    );

    // Verify the result
    expect(result.isError).toBe(false);
    expect((result.content[0] as TextContent).text).toBe("GET request to https://api.example.com/data");
    expect((result.content[1] as TextContent).text).toBe("Status: 200 OK");
    expect((result.content[2] as TextContent).text).toContain("test data");
    expect(mockApiContext.get).toHaveBeenCalledWith("https://api.example.com/data");
  });

  it("should handle GET request errors", async () => {
    // Set up the mock to throw an error
    mockApiContext.get.mockRejectedValueOnce(new Error("Network error"));
    
    // Create a mock context
    const context = createMockToolContext();

    // Call the tool directly
    const result = await getRequestTool.execute(
      { url: "https://api.example.com/error" },
      context
    );

    // Verify the result
    expect(result.isError).toBe(true);
    expect((result.content[0] as TextContent).text).toContain("API operation failed: Network error");
  });

  it("should handle error when API context is not available", async () => {
    // Create a context without an API context
    const context = {
      server: mockServer
    };

    // Call the tool directly
    const result = await getRequestTool.execute(
      { url: "https://api.example.com/data" },
      context
    );

    // Verify the result
    expect(result.isError).toBe(true);
    expect((result.content[0] as TextContent).text).toBe("API context not initialized");
    expect(mockApiContext.get).not.toHaveBeenCalled();
  });

  it("should handle long response text", async () => {
    // Create a long response text
    const longText = "a".repeat(2000);
    
    // Set up the mock
    mockApiContext.get.mockResolvedValueOnce({
      text: jest.fn().mockResolvedValue(longText),
      status: jest.fn().mockReturnValue(200),
      statusText: jest.fn().mockReturnValue("OK")
    });
    
    // Create a mock context
    const context = createMockToolContext();

    // Call the tool directly
    const result = await getRequestTool.execute(
      { url: "https://api.example.com/long" },
      context
    );

    // Verify the result
    expect(result.isError).toBe(false);
    // Check that the response is truncated
    expect((result.content[2] as TextContent).text.length).toBeLessThan(longText.length);
    expect((result.content[2] as TextContent).text.endsWith("...")).toBe(true);
  });
});
