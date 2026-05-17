import { createQueryClient } from '@/shared/lib/query-client';

describe('createQueryClient', () => {
  it('returns client with expected defaults', () => {
    const qc = createQueryClient();
    const defs = qc.getDefaultOptions().queries;
    expect(defs?.retry).toBe(1);
    expect(defs?.refetchOnWindowFocus).toBe(false);
  });
});
