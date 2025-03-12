import {
  mockApiContext,
  setupPlaywrightMocks,
  resetAllMocks,
  createMockToolContext,
  mockServer
} from "./helpers";

// Set up all mocks
setupPlaywrightMocks();

// Import the toolHandler and DeleteRequestTool after mocking dependencies
import { handleToolCall } from "../src/toolHandler";
import { DeleteRequestTool } from "../src/tools/api/requests";
import { ToolResponse } from "../src/tools/common/types";
import { TextContent } from '@modelcontextprotocol/sdk/types.js';

describe("playwright_delete unit tests", () => {
  let deleteRequestTool: DeleteRequestTool;
  
  beforeEach(() => {
    // Reset mocks before each test
    resetAllMocks();
    
    // Create a new instance of the DeleteRequestTool
    deleteRequestTool = new DeleteRequestTool(mockServer);
  });

  it("should handle DELETE request tool directly", async () => {
    // Set up the mock
    mockApiContext.delete.mockResolvedValueOnce({
      text: jest.fn().mockResolvedValue(JSON.stringify({ success: true })),
      status: jest.fn().mockReturnValue(204),
      statusText: jest.fn().mockReturnValue("No Content")
    });
    
    // Create a mock context
    const context = createMockToolContext();

    // Call the tool directly
    const result = await deleteRequestTool.execute(
      { url: "https://api.example.com/users/123" },
      context
    );

    // Verify the result
    expect(result.isError).toBe(false);
    expect((result.content[0] as TextContent).text).toBe("DELETE request to https://api.example.com/users/123");
    expect((result.content[1] as TextContent).text).toBe("Status: 204 No Content");
    expect(mockApiContext.delete).toHaveBeenCalledWith("https://api.example.com/users/123");
  });

  it("should handle playwright_delete tool through handler", async () => {
    // Set up the mock
    mockApiContext.delete.mockResolvedValueOnce({
      text: jest.fn().mockResolvedValue(JSON.stringify({ success: true })),
      status: jest.fn().mockReturnValue(204),
      statusText: jest.fn().mockReturnValue("No Content")
    });

    // Call the tool through the handler
    const result = await handleToolCall(
      "playwright_delete",
      { url: "https://api.example.com/users/123" },
      mockServer
    );

    // Verify the result
    expect(result.isError).toBe(false);
    expect((result.content[0] as TextContent).text).toBe("DELETE request to https://api.example.com/users/123");
    expect((result.content[1] as TextContent).text).toBe("Status: 204 No Content");
    expect(mockApiContext.delete).toHaveBeenCalledWith("https://api.example.com/users/123");
  });

  it("should handle DELETE request errors", async () => {
    // Set up the mock to throw an error
    mockApiContext.delete.mockRejectedValueOnce(new Error("Network error"));
    
    // Create a mock context
    const context = createMockToolContext();

    // Call the tool directly
    const result = await deleteRequestTool.execute(
      { url: "https://api.example.com/users/123" },
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
    const result = await deleteRequestTool.execute(
      { url: "https://api.example.com/users/123" },
      context
    );

    // Verify the result
    expect(result.isError).toBe(true);
    expect((result.content[0] as TextContent).text).toBe("API context not initialized");
    expect(mockApiContext.delete).not.toHaveBeenCalled();
  });

  it("should handle response with content", async () => {
    // Set up the mock with a response that has content
    mockApiContext.delete.mockResolvedValueOnce({
      text: jest.fn().mockResolvedValue(JSON.stringify({ message: "Resource deleted successfully" })),
      status: jest.fn().mockReturnValue(200),
      statusText: jest.fn().mockReturnValue("OK")
    });
    
    // Create a mock context
    const context = createMockToolContext();

    // Call the tool directly
    const result = await deleteRequestTool.execute(
      { url: "https://api.example.com/users/123" },
      context
    );

    // Verify the result
    expect(result.isError).toBe(false);
    expect((result.content[0] as TextContent).text).toBe("DELETE request to https://api.example.com/users/123");
    expect((result.content[1] as TextContent).text).toBe("Status: 200 OK");
    expect((result.content[2] as TextContent).text).toContain("Resource deleted successfully");
  });
});
