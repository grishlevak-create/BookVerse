import { cn } from './cn';

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('a', 'b')).toBe('a b');
  });

  it('resolves tailwind conflicts via tailwind-merge', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });
});
