import {
  mockChromium,
  mockRequest,
  mockFs,
  mockPath,
  mockEnsureBrowser,
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
  jest.mock("../../src/toolsHandler", () => {
    const originalModule = jest.requireActual("../../src/toolsHandler");
    return {
      ...originalModule,
      ensureBrowser: mockEnsureBrowser,
    };
  });
}

/**
 * Resets all mocks before each test
 */
export function resetAllMocks() {
  jest.clearAllMocks();
}
