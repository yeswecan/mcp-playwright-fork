import {
  mockPage,
  mockChromium,
  mockRequest,
  mockFs,
  mockPath,
  mockHandleToolCall,
  mockApiContext,
  mockContext,
  mockBrowser,
  mockEnsureBrowser,
  mockVirtualHandleToolCall,
} from "./mocks";

/**
 * Sets up mocks for Playwright-related modules
 */
export function setupPlaywrightMocks() {
  // Mock the playwright module
  jest.mock("playwright", () => ({
    chromium: mockChromium,
    request: mockRequest,
  }));

  // Mock the fs module
  jest.mock("node:fs", () => mockFs);

  // Mock the path module
  jest.mock("node:path", () => mockPath);
}

/**
 * Sets up mocks for the toolsHandler module for integration tests
 * This ensures the actual toolsHandler is used but with mocked dependencies
 */
export function setupToolsHandlerIntegrationMocks() {
  // Mock the ensureBrowser function to return the mock page
  jest.mock("../src/toolsHandler", () => {
    const originalModule = jest.requireActual("../src/toolsHandler");
    return {
      ...originalModule,
      ensureBrowser: mockEnsureBrowser,
    };
  });
}

/**
 * Sets up mocks for the toolsHandler module
 */
export function setupToolsHandlerMocks() {
  jest.mock("../src/toolsHandler", () => {
    return {
      handleToolCall: jest.fn(),
      getConsoleLogs: jest.fn().mockReturnValue(["Test log"]),
      getScreenshots: jest
        .fn()
        .mockReturnValue(new Map([["test", "base64data"]])),
    };
  });

  // Mock the virtual toolsHandler.js module for the requestHandler.ts file
  jest.mock(
    "../src/toolsHandler.js",
    () => {
      return {
        handleToolCall: mockHandleToolCall,
        getConsoleLogs: jest.fn().mockReturnValue(["Test log"]),
        getScreenshots: jest
          .fn()
          .mockReturnValue(new Map([["test", "base64data"]])),
      };
    },
    { virtual: true }
  );
}

/**
 * Resets all mocks before each test
 */
export function resetAllMocks() {
  jest.clearAllMocks();
}

/**
 * Sets up mocks for the requestHandler tests
 */
export function setupRequestHandlerMocks() {
  // Mock the toolsHandler module
  jest.mock("../src/toolsHandler", () => {
    return {
      handleToolCall: mockVirtualHandleToolCall,
      getConsoleLogs: jest.fn().mockReturnValue(["Test log"]),
      getScreenshots: jest
        .fn()
        .mockReturnValue(new Map([["test", "base64data"]])),
    };
  });

  // Mock the toolsHandler.js module for the requestHandler.ts file
  jest.mock("../src/toolsHandler.js", () => {
    return {
      handleToolCall: mockVirtualHandleToolCall,
      getConsoleLogs: jest.fn().mockReturnValue(["Test log"]),
      getScreenshots: jest
        .fn()
        .mockReturnValue(new Map([["test", "base64data"]])),
    };
  });
}
