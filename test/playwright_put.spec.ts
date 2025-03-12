import {
  mockApiContext,
  setupPlaywrightMocks,
  resetAllMocks,
  createMockToolContext,
  mockServer
} from "./helpers";

// Set up all mocks
setupPlaywrightMocks();

// Import the toolHandler and PutRequestTool after mocking dependencies
import { handleToolCall } from "../src/toolHandler";
import { PutRequestTool } from "../src/tools/api/requests";
import { ToolResponse } from "../src/tools/common/types";
import { TextContent } from '@modelcontextprotocol/sdk/types.js';

describe("playwright_put unit tests", () => {
  let putRequestTool: PutRequestTool;
  
  beforeEach(() => {
    // Reset mocks before each test
    resetAllMocks();
    
    // Create a new instance of the PutRequestTool
    putRequestTool = new PutRequestTool(mockServer);
  });

  it("should handle PUT request tool directly", async () => {
    // Set up the mock
    mockApiContext.put.mockResolvedValueOnce({
      text: jest.fn().mockResolvedValue(JSON.stringify({ success: true })),
      status: jest.fn().mockReturnValue(200),
      statusText: jest.fn().mockReturnValue("OK")
    });
    
    // Create a mock context
    const context = createMockToolContext();
    const putData = { id: 123, name: "Updated User", email: "updated@example.com" };

    // Call the tool directly
    const result = await putRequestTool.execute(
      { 
        url: "https://api.example.com/users/123", 
        value: JSON.stringify(putData) 
      },
      context
    );

    // Verify the result
    expect(result.isError).toBe(false);
    expect((result.content[0] as TextContent).text).toBe("PUT request to https://api.example.com/users/123");
    expect((result.content[1] as TextContent).text).toBe("Status: 200 OK");
    expect((result.content[2] as TextContent).text).toContain("success");
    expect(mockApiContext.put).toHaveBeenCalledWith(
      "https://api.example.com/users/123", 
      { data: putData }
    );
  });

  it("should handle playwright_put tool through handler", async () => {
    // Set up the mock
    mockApiContext.put.mockResolvedValueOnce({
      text: jest.fn().mockResolvedValue(JSON.stringify({ success: true })),
      status: jest.fn().mockReturnValue(200),
      statusText: jest.fn().mockReturnValue("OK")
    });

    const putData = { id: 123, name: "Updated User", email: "updated@example.com" };

    // Call the tool through the handler
    const result = await handleToolCall(
      "playwright_put",
      { 
        url: "https://api.example.com/users/123", 
        value: JSON.stringify(putData) 
      },
      mockServer
    );

    // Verify the result
    expect(result.isError).toBe(false);
    expect((result.content[0] as TextContent).text).toBe("PUT request to https://api.example.com/users/123");
    expect((result.content[1] as TextContent).text).toBe("Status: 200 OK");
    expect((result.content[2] as TextContent).text).toContain("success");
    expect(mockApiContext.put).toHaveBeenCalledWith(
      "https://api.example.com/users/123", 
      { data: putData }
    );
  });

  it("should handle PUT request errors", async () => {
    // Set up the mock to throw an error
    mockApiContext.put.mockRejectedValueOnce(new Error("Network error"));
    
    // Create a mock context
    const context = createMockToolContext();
    const putData = { id: 123, name: "Updated User", email: "updated@example.com" };

    // Call the tool directly
    const result = await putRequestTool.execute(
      { 
        url: "https://api.example.com/users/123", 
        value: JSON.stringify(putData) 
      },
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

    const putData = { id: 123, name: "Updated User", email: "updated@example.com" };

    // Call the tool directly
    const result = await putRequestTool.execute(
      { 
        url: "https://api.example.com/users/123", 
        value: JSON.stringify(putData) 
      },
      context
    );

    // Verify the result
    expect(result.isError).toBe(true);
    expect((result.content[0] as TextContent).text).toBe("API context not initialized");
    expect(mockApiContext.put).not.toHaveBeenCalled();
  });

  it("should handle invalid JSON in value parameter", async () => {
    // Create a mock context
    const context = createMockToolContext();
    
    // Call the tool directly with invalid JSON
    const result = await putRequestTool.execute(
      { 
        url: "https://api.example.com/users/123", 
        value: "{invalid json" 
      },
      context
    );

    // Verify the result
    expect(result.isError).toBe(true);
    expect((result.content[0] as TextContent).text).toContain("Failed to parse request body");
    expect(mockApiContext.put).not.toHaveBeenCalled();
  });

  it("should handle long response text", async () => {
    // Create a long response text
    const longText = "a".repeat(2000);
    
    // Set up the mock
    mockApiContext.put.mockResolvedValueOnce({
      text: jest.fn().mockResolvedValue(longText),
      status: jest.fn().mockReturnValue(200),
      statusText: jest.fn().mockReturnValue("OK")
    });
    
    // Create a mock context
    const context = createMockToolContext();
    const putData = { id: 123, name: "Updated User", email: "updated@example.com" };

    // Call the tool directly
    const result = await putRequestTool.execute(
      { 
        url: "https://api.example.com/users/123", 
        value: JSON.stringify(putData) 
      },
      context
    );

    // Verify the result
    expect(result.isError).toBe(false);
    // Check that the response is truncated
    expect((result.content[2] as TextContent).text.length).toBeLessThan(longText.length);
    expect((result.content[2] as TextContent).text.endsWith("...")).toBe(true);
  });
});
