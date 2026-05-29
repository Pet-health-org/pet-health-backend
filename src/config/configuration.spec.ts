import { parseJwtExpiresInToSeconds } from './configuration';

describe('configuration', () => {
  it('parses numeric JWT expiration values as seconds', () => {
    expect(parseJwtExpiresInToSeconds('1800')).toBe(1800);
  });

  it('parses JWT expiration values with suffixes', () => {
    expect(parseJwtExpiresInToSeconds('30m')).toBe(1800);
    expect(parseJwtExpiresInToSeconds('24h')).toBe(86400);
    expect(parseJwtExpiresInToSeconds('7d')).toBe(604800);
  });

  it('falls back to 30 minutes when the value is invalid', () => {
    expect(parseJwtExpiresInToSeconds('invalid')).toBe(1800);
  });
});
