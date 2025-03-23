import { ActionRecorder } from '../tools/codegen/recorder';
import { PlaywrightGenerator } from '../tools/codegen/generator';
import { handleToolCall } from '../toolHandler';
import * as fs from 'fs/promises';
import * as path from 'path';

interface StartSessionResult {
  sessionId: string;
}

interface EndSessionResult {
  filePath: string;
  testCode: string;
}

interface ClearSessionResult {
  success: boolean;
}

interface ToolResponse {
  content: {
    type: 'text' | 'image' | 'resource';
    text?: string;
    data?: string;
    mimeType?: string;
    resource?: {
      text: string;
      uri: string;
      mimeType?: string;
    };
  }[];
  isError: boolean;
}

function parseJsonResponse<T>(response: unknown): T {
  if (!response || typeof response !== 'object' || !('content' in response)) {
    throw new Error('Invalid response format');
  }

  const content = (response as { content: unknown[] }).content;
  if (!Array.isArray(content) || content.length === 0) {
    throw new Error('Invalid response content');
  }

  const textContent = content.find(c => 
    typeof c === 'object' && 
    c !== null && 
    'type' in c && 
    c.type === 'text' && 
    'text' in c && 
    typeof c.text === 'string'
  );

  if (!textContent || !('text' in textContent)) {
    throw new Error('No text content found in response');
  }

  return JSON.parse((textContent as { text: string }).text) as T;
}

describe('Code Generation', () => {
  const testOutputDir = path.join(__dirname, '../../tests/generated');
  
  beforeAll(async () => {
    // Ensure test output directory exists
    await fs.mkdir(testOutputDir, { recursive: true });
  });

  afterEach(async () => {
    // Clean up test files
    try {
      const files = await fs.readdir(testOutputDir);
      await Promise.all(
        files.map(file => fs.unlink(path.join(testOutputDir, file)))
      );
    } catch (error) {
      console.error('Error cleaning up test files:', error);
    }
  });

  it('should record tool actions and generate Playwright test', async () => {
    // Start recording session
    const startResult = await handleToolCall('start_codegen_session', {
      options: {
        outputPath: testOutputDir,
        testNamePrefix: 'TestMCP',
      }
    }, {});

    const { sessionId } = parseJsonResponse<StartSessionResult>(startResult);
    expect(sessionId).toBeDefined();

    // Simulate some tool actions
    await handleToolCall('playwright_goto', {
      url: 'https://example.com'
    }, {});

    await handleToolCall('playwright_click', {
      selector: '#submit-button'
    }, {});

    await handleToolCall('playwright_fill', {
      selector: '#search-input',
      value: 'test query'
    }, {});

    // End recording session and generate test
    const endResult = await handleToolCall('end_codegen_session', {
      sessionId
    }, {});

    const { filePath, testCode } = parseJsonResponse<EndSessionResult>(endResult);
    expect(filePath).toBeDefined();
    expect(testCode).toContain('import { test, expect } from \'@playwright/test\'');
    expect(testCode).toContain('await page.goto(\'https://example.com\')');
    expect(testCode).toContain('await page.click(\'#submit-button\')');
    expect(testCode).toContain('await page.fill(\'#search-input\', \'test query\')');

    // Verify file was created
    const fileExists = await fs.access(filePath)
      .then(() => true)
      .catch(() => false);
    expect(fileExists).toBe(true);
  });

  it('should handle invalid session IDs', async () => {
    const invalidSessionId = 'invalid-session-id';

    const result = await handleToolCall('end_codegen_session', {
      sessionId: invalidSessionId
    }, {});

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('not found');
  });

  it('should allow retrieving session information', async () => {
    // Start recording session
    const startResult = await handleToolCall('start_codegen_session', {}, {});
    const { sessionId } = parseJsonResponse<StartSessionResult>(startResult);

    // Simulate a tool action
    await handleToolCall('playwright_goto', {
      url: 'https://example.com'
    }, {});

    // Get session information
    const getResult = await handleToolCall('get_codegen_session', {
      sessionId
    }, {});

    const session = parseJsonResponse<{ id: string; actions: any[] }>(getResult);
    expect(session.id).toBe(sessionId);
    expect(session.actions).toHaveLength(1);
    expect(session.actions[0].toolName).toBe('playwright_goto');
  });

  it('should allow clearing sessions', async () => {
    // Start recording session
    const startResult = await handleToolCall('start_codegen_session', {}, {});
    const { sessionId } = parseJsonResponse<StartSessionResult>(startResult);

    // Clear session
    const clearResult = await handleToolCall('clear_codegen_session', {
      sessionId
    }, {});

    expect(parseJsonResponse<ClearSessionResult>(clearResult).success).toBe(true);

    // Verify session is cleared
    const getResult = await handleToolCall('get_codegen_session', {
      sessionId
    }, {});

    expect(getResult.isError).toBe(true);
  });
}); 