import { describe, expect, it } from 'vitest';
import { formatDuration } from './dinhDangThoiGian';

describe('Định dạng thời gian', () => {
  it.each([[0, '0:00'], [67, '1:07'], [120, '2:00']] as const)('đổi %i giây thành %s', (seconds, expected) => {
    expect(formatDuration(seconds)).toBe(expected);
  });
});
