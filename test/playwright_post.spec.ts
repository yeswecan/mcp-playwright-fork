import {
  mockApiContext,
  setupPlaywrightMocks,
  resetAllMocks,
  createMockToolContext,
  mockServer
} from "./helpers";

// Set up all mocks
setupPlaywrightMocks();

// Import the toolHandler and PostRequestTool after mocking dependencies
import { handleToolCall } from "../src/toolHandler";
import { PostRequestTool } from "../src/tools/api/requests";
import { ToolResponse } from "../src/tools/common/types";
import { TextContent } from '@modelcontextprotocol/sdk/types.js';

describe("playwright_post unit tests", () => {
  let postRequestTool: PostRequestTool;
  
  beforeEach(() => {
    // Reset mocks before each test
    resetAllMocks();
    
    // Create a new instance of the PostRequestTool
    postRequestTool = new PostRequestTool(mockServer);
  });

  it("should handle POST request tool directly", async () => {
    // Set up the mock
    mockApiContext.post.mockResolvedValueOnce({
      text: jest.fn().mockResolvedValue(JSON.stringify({ success: true })),
      status: jest.fn().mockReturnValue(201),
      statusText: jest.fn().mockReturnValue("Created")
    });
    
    // Create a mock context
    const context = createMockToolContext();
    const postData = { name: "Test User", email: "test@example.com" };

    // Call the tool directly
    const result = await postRequestTool.execute(
      { 
        url: "https://api.example.com/users", 
        value: JSON.stringify(postData) 
      },
      context
    );

    // Verify the result
    expect(result.isError).toBe(false);
    expect((result.content[0] as TextContent).text).toBe("POST request to https://api.example.com/users");
    expect((result.content[1] as TextContent).text).toBe("Status: 201 Created");
    expect((result.content[2] as TextContent).text).toContain("success");
    expect(mockApiContext.post).toHaveBeenCalledWith(
      "https://api.example.com/users", 
      { data: JSON.stringify(postData) }
    );
  });

  it("should handle playwright_post tool through handler", async () => {
    // Set up the mock
    mockApiContext.post.mockResolvedValueOnce({
      text: jest.fn().mockResolvedValue(JSON.stringify({ success: true })),
      status: jest.fn().mockReturnValue(201),
      statusText: jest.fn().mockReturnValue("Created")
    });

    const postData = { name: "Test User", email: "test@example.com" };

    // Call the tool through the handler
    const result = await handleToolCall(
      "playwright_post",
      { 
        url: "https://api.example.com/users", 
        value: JSON.stringify(postData) 
      },
      mockServer
    );

    // Verify the result
    expect(result.isError).toBe(false);
    expect((result.content[0] as TextContent).text).toBe("POST request to https://api.example.com/users");
    expect((result.content[1] as TextContent).text).toBe("Status: 201 Created");
    expect((result.content[2] as TextContent).text).toContain("success");
    expect(mockApiContext.post).toHaveBeenCalledWith(
      "https://api.example.com/users", 
      { data: JSON.stringify(postData) }
    );
  });

  it("should handle POST request errors", async () => {
    // Set up the mock to throw an error
    mockApiContext.post.mockRejectedValueOnce(new Error("Network error"));
    
    // Create a mock context
    const context = createMockToolContext();
    const postData = { name: "Test User", email: "test@example.com" };

    // Call the tool directly
    const result = await postRequestTool.execute(
      { 
        url: "https://api.example.com/users", 
        value: JSON.stringify(postData) 
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

    const postData = { name: "Test User", email: "test@example.com" };

    // Call the tool directly
    const result = await postRequestTool.execute(
      { 
        url: "https://api.example.com/users", 
        value: JSON.stringify(postData) 
      },
      context
    );

    // Verify the result
    expect(result.isError).toBe(true);
    expect((result.content[0] as TextContent).text).toBe("API context not initialized");
    expect(mockApiContext.post).not.toHaveBeenCalled();
  });

  it("should handle invalid JSON in value parameter", async () => {
    // Create a mock context
    const context = createMockToolContext();
    
    // Call the tool directly with invalid JSON
    const result = await postRequestTool.execute(
      { 
        url: "https://api.example.com/users", 
        value: "{invalid json" 
      },
      context
    );

    // Verify the result
    expect(result.isError).toBe(true);
    expect((result.content[0] as TextContent).text).toContain("Failed to parse request body");
    expect(mockApiContext.post).not.toHaveBeenCalled();
  });

  it("should handle long response text", async () => {
    // Create a long response text
    const longText = "a".repeat(2000);
    
    // Set up the mock
    mockApiContext.post.mockResolvedValueOnce({
      text: jest.fn().mockResolvedValue(longText),
      status: jest.fn().mockReturnValue(201),
      statusText: jest.fn().mockReturnValue("Created")
    });
    
    // Create a mock context
    const context = createMockToolContext();
    const postData = { name: "Test User", email: "test@example.com" };

    // Call the tool directly
    const result = await postRequestTool.execute(
      { 
        url: "https://api.example.com/users", 
        value: JSON.stringify(postData) 
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
