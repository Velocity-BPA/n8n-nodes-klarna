/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
	getBaseUrl,
	formatOrderLines,
	formatAddress,
	toMinorUnits,
	fromMinorUnits,
	validateRequiredFields,
} from '../../nodes/Klarna/GenericFunctions';

describe('GenericFunctions', () => {
	describe('getBaseUrl', () => {
		it('should return correct EU playground URL', () => {
			expect(getBaseUrl('playground', 'eu')).toBe('https://api.playground.klarna.com');
		});

		it('should return correct NA playground URL', () => {
			expect(getBaseUrl('playground', 'na')).toBe('https://api-na.playground.klarna.com');
		});

		it('should return correct OC playground URL', () => {
			expect(getBaseUrl('playground', 'oc')).toBe('https://api-oc.playground.klarna.com');
		});

		it('should return correct EU live URL', () => {
			expect(getBaseUrl('live', 'eu')).toBe('https://api.klarna.com');
		});

		it('should return correct NA live URL', () => {
			expect(getBaseUrl('live', 'na')).toBe('https://api-na.klarna.com');
		});

		it('should return correct OC live URL', () => {
			expect(getBaseUrl('live', 'oc')).toBe('https://api-oc.klarna.com');
		});
	});

	describe('formatOrderLines', () => {
		it('should parse valid order lines JSON', () => {
			const json = JSON.stringify([
				{
					type: 'physical',
					name: 'Test Product',
					quantity: 2,
					unit_price: 5000,
					tax_rate: 1000,
					total_amount: 10000,
					total_tax_amount: 1000,
				},
			]);

			const result = formatOrderLines(json);
			expect(result).toHaveLength(1);
			expect(result[0].name).toBe('Test Product');
			expect(result[0].quantity).toBe(2);
			expect(result[0].unit_price).toBe(5000);
		});

		it('should throw error for invalid JSON', () => {
			expect(() => formatOrderLines('invalid json')).toThrow('Invalid order lines JSON');
		});

		it('should throw error for non-array JSON', () => {
			expect(() => formatOrderLines('{"name": "test"}')).toThrow('Order lines must be an array');
		});

		it('should use default type if not provided', () => {
			const json = JSON.stringify([
				{
					name: 'Test',
					quantity: 1,
					unit_price: 100,
					total_amount: 100,
				},
			]);

			const result = formatOrderLines(json);
			expect(result[0].type).toBe('physical');
		});
	});

	describe('formatAddress', () => {
		it('should extract valid address fields', () => {
			const input = {
				given_name: 'John',
				family_name: 'Doe',
				email: 'john@example.com',
				street_address: '123 Main St',
				city: 'New York',
				country: 'US',
				invalid_field: 'should be ignored',
			};

			const result = formatAddress(input);
			expect(result.given_name).toBe('John');
			expect(result.family_name).toBe('Doe');
			expect(result.email).toBe('john@example.com');
			expect(result.street_address).toBe('123 Main St');
			expect(result.city).toBe('New York');
			expect(result.country).toBe('US');
			expect(result.invalid_field).toBeUndefined();
		});

		it('should handle empty address', () => {
			const result = formatAddress({});
			expect(Object.keys(result)).toHaveLength(0);
		});
	});

	describe('toMinorUnits', () => {
		it('should convert USD to cents', () => {
			expect(toMinorUnits(100, 'USD')).toBe(10000);
			expect(toMinorUnits(99.99, 'USD')).toBe(9999);
		});

		it('should handle JPY without decimals', () => {
			expect(toMinorUnits(1000, 'JPY')).toBe(1000);
		});

		it('should handle KRW without decimals', () => {
			expect(toMinorUnits(50000, 'KRW')).toBe(50000);
		});

		it('should round to nearest cent', () => {
			expect(toMinorUnits(10.005, 'USD')).toBe(1001);
			expect(toMinorUnits(10.004, 'USD')).toBe(1000);
		});
	});

	describe('fromMinorUnits', () => {
		it('should convert cents to USD', () => {
			expect(fromMinorUnits(10000, 'USD')).toBe(100);
			expect(fromMinorUnits(9999, 'USD')).toBe(99.99);
		});

		it('should handle JPY without conversion', () => {
			expect(fromMinorUnits(1000, 'JPY')).toBe(1000);
		});
	});

	describe('validateRequiredFields', () => {
		it('should not throw for valid data', () => {
			const data = { name: 'test', amount: 100 };
			expect(() => validateRequiredFields(data, ['name', 'amount'])).not.toThrow();
		});

		it('should throw for missing field', () => {
			const data = { name: 'test' };
			expect(() => validateRequiredFields(data, ['name', 'amount'])).toThrow(
				'Required field "amount" is missing',
			);
		});

		it('should throw for null field', () => {
			const data = { name: null };
			expect(() => validateRequiredFields(data, ['name'])).toThrow(
				'Required field "name" is missing',
			);
		});

		it('should throw for empty string field', () => {
			const data = { name: '' };
			expect(() => validateRequiredFields(data, ['name'])).toThrow(
				'Required field "name" is missing',
			);
		});
	});
});
