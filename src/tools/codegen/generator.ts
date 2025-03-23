import * as path from 'path';
import { CodegenAction, CodegenOptions, CodegenResult, CodegenSession, PlaywrightTestCase } from './types.js';

export class PlaywrightGenerator {
  private static readonly DEFAULT_OPTIONS: Required<CodegenOptions> = {
    outputPath: 'tests',
    testNamePrefix: 'MCP',
    includeComments: true,
  };

  private options: Required<CodegenOptions>;

  constructor(options: CodegenOptions = {}) {
    this.validateOptions(options);
    this.options = { ...PlaywrightGenerator.DEFAULT_OPTIONS, ...options };
  }

  private validateOptions(options: CodegenOptions): void {
    if (options.outputPath && typeof options.outputPath !== 'string') {
      throw new Error('outputPath must be a string');
    }
    if (options.testNamePrefix && typeof options.testNamePrefix !== 'string') {
      throw new Error('testNamePrefix must be a string');
    }
    if (options.includeComments !== undefined && typeof options.includeComments !== 'boolean') {
      throw new Error('includeComments must be a boolean');
    }
  }

  async generateTest(session: CodegenSession): Promise<CodegenResult> {
    if (!session || !Array.isArray(session.actions)) {
      throw new Error('Invalid session data');
    }

    const testCase = this.createTestCase(session);
    const testCode = this.generateTestCode(testCase);
    const filePath = this.getOutputFilePath(session);

    return {
      testCode,
      filePath,
      sessionId: session.id,
    };
  }

  private createTestCase(session: CodegenSession): PlaywrightTestCase {
    const testCase: PlaywrightTestCase = {
      name: `${this.options.testNamePrefix}_${new Date(session.startTime).toISOString().split('T')[0]}`,
      steps: [],
      imports: new Set(['test', 'expect']),
    };

    for (const action of session.actions) {
      const step = this.convertActionToStep(action);
      if (step) {
        testCase.steps.push(step);
      }
    }

    return testCase;
  }

  private convertActionToStep(action: CodegenAction): string | null {
    const { toolName, parameters } = action;

    switch (toolName) {
      case 'edit_file':
        return this.generateEditFileStep(parameters);
      case 'run_terminal_cmd':
        return this.generateRunCommandStep(parameters);
      case 'delete_file':
        return this.generateDeleteFileStep(parameters);
      // Add more tool conversions as needed
      default:
        return this.generateGenericStep(action);
    }
  }

  private generateEditFileStep(parameters: Record<string, unknown>): string {
    const { target_file, code_edit } = parameters;
    return `
    // Edit file: ${target_file}
    await page.evaluate(async () => {
      const content = \`${code_edit}\`;
      await writeFile('${target_file}', content);
    });`;
  }

  private generateRunCommandStep(parameters: Record<string, unknown>): string {
    const { command } = parameters;
    return `
    // Run command
    await page.evaluate(async () => {
      await executeCommand(\`${command}\`);
    });`;
  }

  private generateDeleteFileStep(parameters: Record<string, unknown>): string {
    const { target_file } = parameters;
    return `
    // Delete file
    await page.evaluate(async () => {
      await deleteFile('${target_file}');
    });`;
  }

  private generateGenericStep(action: CodegenAction): string {
    return `
    // ${action.toolName}
    await page.evaluate(async () => {
      await executeTool('${action.toolName}', ${JSON.stringify(action.parameters)});
    });`;
  }

  private generateTestCode(testCase: PlaywrightTestCase): string {
    const imports = Array.from(testCase.imports)
      .map(imp => `import { ${imp} } from '@playwright/test';`)
      .join('\n');

    return `
${imports}

test('${testCase.name}', async ({ page }) => {
  ${testCase.steps.join('\n')}
});`;
  }

  private getOutputFilePath(session: CodegenSession): string {
    if (!session.id) {
      throw new Error('Session ID is required');
    }

    const sanitizedPrefix = this.options.testNamePrefix.toLowerCase().replace(/[^a-z0-9_]/g, '_');
    const fileName = `${sanitizedPrefix}_${session.id}.spec.ts`;
    return path.resolve(this.options.outputPath, fileName);
  }
} 