import {
  API_TOOLS as ACTUAL_API_TOOLS,
  BROWSER_TOOLS as ACTUAL_BROWSER_TOOLS,
} from "../../src/tools";

// Export the actual tool arrays for proper tool detection
export const API_TOOLS = ACTUAL_API_TOOLS;
export const BROWSER_TOOLS = ACTUAL_BROWSER_TOOLS;

// Mock for virtual handleToolCall
export const mockVirtualHandleToolCall = jest
  .fn()
  .mockImplementation((name, args, server) => {
    return Promise.resolve({
      content: [{ type: "text", text: `Mocked result for ${name}` }],
      isError: false,
    });
  });

// Mock server for request handler tests
export const mockServer = {
  setRequestHandler: jest.fn(),
};

// Mock page with all required methods
export const mockPage = {
  goto: jest.fn(),
  screenshot: jest.fn().mockResolvedValue(Buffer.from("mock-screenshot")),
  $: jest.fn().mockResolvedValue(null),
  click: jest.fn(),
  fill: jest.fn(),
  selectOption: jest.fn(),
  hover: jest.fn(),
  evaluate: jest.fn().mockResolvedValue({ result: "mock-result", logs: [] }),
  waitForSelector: jest.fn(),
  setContent: jest.fn(),
  on: jest.fn(),
  frameLocator: jest.fn().mockReturnValue({
    locator: jest.fn().mockReturnValue({
      click: jest.fn(),
    }),
  }),
};

// Mock browser context
export const mockContext = {
  newPage: jest.fn().mockResolvedValue(mockPage),
};

// Mock browser
export const mockBrowser = {
  newContext: jest.fn().mockResolvedValue(mockContext),
  close: jest.fn().mockResolvedValue(undefined),
};

// Mock chromium
export const mockChromium = {
  launch: jest.fn().mockResolvedValue(mockBrowser),
};

// Mock API context
export const mockApiContext = {
  get: jest.fn().mockResolvedValue({
    json: jest.fn().mockResolvedValue({}),
    status: jest.fn().mockReturnValue(200),
  }),
  post: jest.fn().mockResolvedValue({
    json: jest.fn().mockResolvedValue({}),
    status: jest.fn().mockReturnValue(200),
  }),
  put: jest.fn().mockResolvedValue({
    json: jest.fn().mockResolvedValue({}),
    status: jest.fn().mockReturnValue(200),
  }),
  patch: jest.fn().mockResolvedValue({
    json: jest.fn().mockResolvedValue({}),
    status: jest.fn().mockReturnValue(200),
  }),
  delete: jest.fn().mockResolvedValue({
    status: jest.fn().mockReturnValue(200),
  }),
};

// Mock request
export const mockRequest = {
  newContext: jest.fn().mockResolvedValue(mockApiContext),
};

// Mock ensureBrowser function
export const mockEnsureBrowser = jest.fn(() => Promise.resolve(mockPage));

// Mock handleToolCall function with proper response format based on tool name
export const mockHandleToolCall = jest
  .fn()
  .mockImplementation((name, args, server) => {
    // Default success response
    const successResponse = {
      content: [{ type: "text", text: `Successfully executed ${name}` }],
      isError: false,
    };

    // Tool-specific responses
    switch (name) {
      case "playwright_navigate":
        return Promise.resolve({
          content: [{ type: "text", text: `Navigated to ${args.url}` }],
          isError: false,
        });
      case "playwright_screenshot":
        return Promise.resolve({
          content: [
            { type: "text", text: `Screenshot saved with name: ${args.name}` },
          ],
          isError: false,
        });
      case "playwright_click":
        return Promise.resolve({
          content: [{ type: "text", text: `Clicked: ${args.selector}` }],
          isError: false,
        });
      case "playwright_fill":
        return Promise.resolve({
          content: [
            {
              type: "text",
              text: `Filled ${args.selector} with: ${args.value}`,
            },
          ],
          isError: false,
        });
      case "playwright_select":
        return Promise.resolve({
          content: [
            {
              type: "text",
              text: `Selected ${args.selector} with: ${args.value}`,
            },
          ],
          isError: false,
        });
      case "playwright_hover":
        return Promise.resolve({
          content: [{ type: "text", text: `Hovered ${args.selector}` }],
          isError: false,
        });
      case "playwright_evaluate":
        return Promise.resolve({
          content: [{ type: "text", text: `Executed script: ${args.script}` }],
          isError: false,
        });
      case "playwright_get":
        return Promise.resolve({
          content: [
            { type: "text", text: `Performed GET Operation ${args.url}` },
            { type: "text", text: `Response: {}` },
            { type: "text", text: `Response code 200` },
          ],
          isError: false,
        });
      case "playwright_post":
        return Promise.resolve({
          content: [
            {
              type: "text",
              text: `Performed POST Operation ${
                args.url
              } with data ${JSON.stringify(args.value, null, 2)}`,
            },
            { type: "text", text: `Response: {}` },
            { type: "text", text: `Response code 200` },
          ],
          isError: false,
        });
      case "playwright_put":
        return Promise.resolve({
          content: [
            {
              type: "text",
              text: `Performed PUT Operation ${
                args.url
              } with data ${JSON.stringify(args.value, null, 2)}`,
            },
            { type: "text", text: `Response: {}` },
            { type: "text", text: `Response code 200` },
          ],
          isError: false,
        });
      case "playwright_patch":
        return Promise.resolve({
          content: [
            {
              type: "text",
              text: `Performed PATCH Operation ${
                args.url
              } with data ${JSON.stringify(args.value, null, 2)}`,
            },
            { type: "text", text: `Response: {}` },
            { type: "text", text: `Response code 200` },
          ],
          isError: false,
        });
      case "playwright_delete":
        return Promise.resolve({
          content: [
            { type: "text", text: `Performed delete Operation ${args.url}` },
            { type: "text", text: `Response code 200` },
          ],
          isError: false,
        });
      default:
        return Promise.resolve(successResponse);
    }
  });

// Mock fs module
export const mockFs = {
  existsSync: jest.fn().mockReturnValue(true),
  mkdirSync: jest.fn(),
};

// Mock path module
export const mockPath = {
  join: jest.fn().mockImplementation((...args) => args.join("/")),
  relative: jest.fn().mockImplementation((from, to) => to),
};

export const handleToolCall = mockVirtualHandleToolCall;
export const getConsoleLogs = jest.fn().mockReturnValue(["Test log"]);
export const getScreenshots = jest
  .fn()
  .mockReturnValue(new Map([["test", "base64data"]]));
