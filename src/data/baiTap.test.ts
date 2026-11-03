import { describe, expect, it } from 'vitest';
import { generateExercises } from './baiTap';

describe('Dữ liệu bài tập', () => {
  const exercises = generateExercises(10000);
  it('sinh đủ 10.000 bài tập', () => expect(exercises).toHaveLength(10000));
  it('không có mã bài tập trùng nhau', () => expect(new Set(exercises.map((exercise) => exercise.id)).size).toBe(10000));
  it('mọi thời lượng đều từ 30 đến 120 giây', () => {
    expect(exercises.every((exercise) => exercise.duration >= 30 && exercise.duration <= 120)).toBe(true);
  });
  it('sinh cùng dữ liệu trong mỗi lần gọi', () => expect(generateExercises(3)).toEqual(exercises.slice(0, 3)));
});
