import { afterEach, describe, expect, it, vi } from 'vitest';
import { withLogger } from './ghiNhatKy';

describe('Middleware ghi nhật ký', () => {
  afterEach(() => { vi.unstubAllEnvs(); vi.restoreAllMocks(); });

  const reducer = (state: number, action: { type: 'increment'; amount: number }) => state + action.amount;

  it('ở DEV ghi tên action và state trước sau, giữ đúng kết quả reducer', () => {
    vi.stubEnv('DEV', true);
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    expect(withLogger(reducer)(2, { type: 'increment', amount: 3 })).toBe(5);
    expect(log).toHaveBeenCalledWith('increment', { before: 2, after: 5 });
  });

  it('ngoài DEV không ghi log và vẫn trả kết quả reducer', () => {
    vi.stubEnv('DEV', false);
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    expect(withLogger(reducer)(2, { type: 'increment', amount: 3 })).toBe(5);
    expect(log).not.toHaveBeenCalled();
  });
});
