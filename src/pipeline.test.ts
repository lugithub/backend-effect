import { describe, it, expect } from 'vitest';
import { test } from './pipeline';

describe('math', () => {
  it('adds numbers', () => {
    return test().then(a => expect(a).toBe(43));
  });
});
