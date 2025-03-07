import { mockChromium, mockRequest, mockFs, mockPath } from "./mocks";

export const mockPlaywright = () => ({
  chromium: mockChromium,
  request: mockRequest,
});

export const mockNodeModules = () => ({
  fs: mockFs,
  path: mockPath,
});
