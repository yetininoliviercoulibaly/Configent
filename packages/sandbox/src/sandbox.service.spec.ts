import { SandboxService } from './sandbox.service';

describe('SandboxService', () => {
  let sandbox: SandboxService;

  beforeEach(() => {
    sandbox = new SandboxService();
  });

  describe('Isolation', () => {
    it('should not access process.env', async () => {
      const code = `
        if (typeof process !== 'undefined') {
          process.env;
        } else {
          undefined;
        }
      `;
      const { result } = await sandbox.run(code);
      expect(result).toBeUndefined();
    });

    it('should not have access to require', async () => {
      const code = `typeof require`;
      const { result } = await sandbox.run(code);
      expect(result).toBe('undefined');
    });
  });

  describe('Execution', () => {
    it('should return result of simple calculation', async () => {
      const { result } = await sandbox.run('1 + 1');
      expect(result).toBe(2);
    });

    it('should capture console logs', async () => {
      const code = `console.log("Hello", "World"); "Done";`;
      const { result, logs } = await sandbox.run(code);
      expect(result).toBe('Done');
      expect(logs).toContain('Hello World');
    });
  });

  describe('Security Limits', () => {
    it('should timeout infinite loops', async () => {
      const code = `while(true) {}`;
      await expect(sandbox.run(code, { timeout: 100 })).rejects.toThrow();
    }, 1000);

    // Note: Memory limit tests are flaky in small isolates and tricky to trigger reliably 
    // without crashing the whole process if not handled well by isolated-vm.
    // We will attempt a large allocation.
    it('should enforce memory limits', async () => {
      const code = `
        const arr = [];
        while(true) {
          arr.push("leak".repeat(1000));
        }
      `;
      // High timeout, strict memory
      await expect(sandbox.run(code, { memoryLimit: 8, timeout: 2000 })).rejects.toThrow();
    });
  });
});
