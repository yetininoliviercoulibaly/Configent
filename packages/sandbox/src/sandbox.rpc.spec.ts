import { SandboxService } from './sandbox.service';

describe('SandboxService RPC', () => {
  let sandbox: SandboxService;

  beforeEach(() => {
    sandbox = new SandboxService();
  });

  describe('Basic RPC Calls', () => {
    it('should call Host RPC method and return result', async () => {
      const result = await sandbox.run('rpc.add(1, 2)', {
        rpc: {
          add: (a: number, b: number) => a + b,
        },
      });
      expect(result.result).toBe(3);
    });

    it('should handle string arguments correctly', async () => {
      const result = await sandbox.run('rpc.greet("World")', {
        rpc: {
          greet: (name: string) => `Hello ${name}`,
        },
      });
      expect(result.result).toBe('Hello World');
    });

    it('should handle multiple RPC methods', async () => {
      const result = await sandbox.run(`
        const sum = rpc.add(10, 5);
        const product = rpc.multiply(sum, 2);
        product;
      `, {
        rpc: {
          add: (a: number, b: number) => a + b,
          multiply: (a: number, b: number) => a * b,
        },
      });
      expect(result.result).toBe(30);
    });
  });

  describe('Object Marshalling', () => {
    it('should pass and return objects correctly', async () => {
      const result = await sandbox.run(`
        const r = rpc.echo({ key: "value", num: 42 });
        r;
      `, {
        rpc: {
          echo: (obj: any) => obj,
        },
      });
      expect(result.result).toEqual({ key: 'value', num: 42 });
    });

    it('should pass arrays correctly', async () => {
      const result = await sandbox.run('rpc.sum([1, 2, 3, 4])', {
        rpc: {
          sum: (arr: number[]) => arr.reduce((a, b) => a + b, 0),
        },
      });
      expect(result.result).toBe(10);
    });
  });

  describe('Error Handling', () => {
    it('should throw when calling non-existent RPC method', async () => {
      await expect(
        sandbox.run('rpc.nonExistent()', { rpc: {} })
      ).rejects.toThrow();
    });

    it('should propagate Host errors to sandbox', async () => {
      await expect(
        sandbox.run('rpc.throwError()', {
          rpc: {
            throwError: () => {
              throw new Error('Host error');
            },
          },
        })
      ).rejects.toThrow('Host error');
    });
  });

  describe('Without RPC', () => {
    it('should work normally when no RPC is provided', async () => {
      const result = await sandbox.run('1 + 1');
      expect(result.result).toBe(2);
    });

    it('should throw when trying to use rpc without providing handlers', async () => {
      await expect(sandbox.run('rpc.add(1, 2)')).rejects.toThrow();
    });
  });
});
