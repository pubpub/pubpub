import { isHoneypotFilled } from '../honeypot';

describe('isHoneypotFilled', () => {
	it('returns false for null and undefined', () => {
		expect(isHoneypotFilled(null)).toBe(false);
		expect(isHoneypotFilled(undefined)).toBe(false);
	});

	it('returns false for an empty string', () => {
		expect(isHoneypotFilled('')).toBe(false);
	});

	it('returns false for a whitespace-only string', () => {
		expect(isHoneypotFilled('   ')).toBe(false);
		expect(isHoneypotFilled('\t\n')).toBe(false);
	});

	it('returns true for a non-empty string', () => {
		expect(isHoneypotFilled('bot-value')).toBe(true);
		expect(isHoneypotFilled('a')).toBe(true);
	});

	it('returns true for non-string truthy values', () => {
		expect(isHoneypotFilled(42)).toBe(true);
		expect(isHoneypotFilled(true)).toBe(true);
		expect(isHoneypotFilled({})).toBe(true);
	});
});
