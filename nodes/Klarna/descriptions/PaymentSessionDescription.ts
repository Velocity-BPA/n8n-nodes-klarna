/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const paymentSessionOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['paymentSession'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new payment session',
				action: 'Create a payment session',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get payment session details',
				action: 'Get a payment session',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an existing payment session',
				action: 'Update a payment session',
			},
			{
				name: 'Create Authorization',
				value: 'createAuthorization',
				description: 'Create a payment authorization',
				action: 'Create a payment authorization',
			},
			{
				name: 'Cancel Authorization',
				value: 'cancelAuthorization',
				description: 'Cancel a payment authorization',
				action: 'Cancel a payment authorization',
			},
		],
		default: 'create',
	},
];

export const paymentSessionFields: INodeProperties[] = [
	{
		displayName: 'Purchase Country',
		name: 'purchaseCountry',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['paymentSession'],
				operation: ['create', 'update'],
			},
		},
		default: 'US',
		description: 'Two-letter country code (ISO 3166-1 alpha-2)',
	},
	{
		displayName: 'Purchase Currency',
		name: 'purchaseCurrency',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['paymentSession'],
				operation: ['create', 'update'],
			},
		},
		default: 'USD',
		description: 'Three-letter currency code (ISO 4217)',
	},
	{
		displayName: 'Locale',
		name: 'locale',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['paymentSession'],
				operation: ['create', 'update'],
			},
		},
		default: 'en-US',
		description: 'Locale for the payment session (e.g., en-US, de-DE)',
	},
	{
		displayName: 'Order Amount (Minor Units)',
		name: 'orderAmount',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['paymentSession'],
				operation: ['create', 'update'],
			},
		},
		default: 0,
		description: 'Total order amount in minor units (cents). Example: 10000 = $100.00.',
	},
	{
		displayName: 'Order Tax Amount (Minor Units)',
		name: 'orderTaxAmount',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['paymentSession'],
				operation: ['create', 'update'],
			},
		},
		default: 0,
		description: 'Total tax amount in minor units (cents)',
	},
	{
		displayName: 'Order Lines (JSON)',
		name: 'orderLines',
		type: 'json',
		required: true,
		displayOptions: {
			show: {
				resource: ['paymentSession'],
				operation: ['create', 'update'],
			},
		},
		default:
			'[\n  {\n    "type": "physical",\n    "name": "Product Name",\n    "quantity": 1,\n    "unit_price": 10000,\n    "tax_rate": 0,\n    "total_amount": 10000,\n    "total_tax_amount": 0\n  }\n]',
		description: 'Array of order line items in JSON format',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['paymentSession'],
				operation: ['create', 'update'],
			},
		},
		options: [
			{
				displayName: 'Merchant Reference 1',
				name: 'merchantReference1',
				type: 'string',
				default: '',
				description: 'Primary merchant reference (e.g., order ID)',
			},
			{
				displayName: 'Merchant Reference 2',
				name: 'merchantReference2',
				type: 'string',
				default: '',
				description: 'Secondary merchant reference',
			},
			{
				displayName: 'Billing Address',
				name: 'billingAddress',
				type: 'fixedCollection',
				default: {},
				options: [
					{
						displayName: 'Address',
						name: 'address',
						values: [
							{ displayName: 'Given Name', name: 'given_name', type: 'string', default: '' },
							{ displayName: 'Family Name', name: 'family_name', type: 'string', default: '' },
							{ displayName: 'Email', name: 'email', type: 'string', default: '' },
							{ displayName: 'Phone', name: 'phone', type: 'string', default: '' },
							{ displayName: 'Street Address', name: 'street_address', type: 'string', default: '' },
							{ displayName: 'Postal Code', name: 'postal_code', type: 'string', default: '' },
							{ displayName: 'City', name: 'city', type: 'string', default: '' },
							{ displayName: 'Region', name: 'region', type: 'string', default: '' },
							{ displayName: 'Country', name: 'country', type: 'string', default: '' },
						],
					},
				],
			},
			{
				displayName: 'Shipping Address',
				name: 'shippingAddress',
				type: 'fixedCollection',
				default: {},
				options: [
					{
						displayName: 'Address',
						name: 'address',
						values: [
							{ displayName: 'Given Name', name: 'given_name', type: 'string', default: '' },
							{ displayName: 'Family Name', name: 'family_name', type: 'string', default: '' },
							{ displayName: 'Email', name: 'email', type: 'string', default: '' },
							{ displayName: 'Phone', name: 'phone', type: 'string', default: '' },
							{ displayName: 'Street Address', name: 'street_address', type: 'string', default: '' },
							{ displayName: 'Postal Code', name: 'postal_code', type: 'string', default: '' },
							{ displayName: 'City', name: 'city', type: 'string', default: '' },
							{ displayName: 'Region', name: 'region', type: 'string', default: '' },
							{ displayName: 'Country', name: 'country', type: 'string', default: '' },
						],
					},
				],
			},
		],
	},
	{
		displayName: 'Session ID',
		name: 'sessionId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['paymentSession'],
				operation: ['get', 'update'],
			},
		},
		default: '',
		description: 'The payment session ID',
	},
	{
		displayName: 'Authorization Token',
		name: 'authorizationToken',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['paymentSession'],
				operation: ['createAuthorization', 'cancelAuthorization'],
			},
		},
		default: '',
		description: 'The authorization token from the Klarna widget',
	},
	{
		displayName: 'Authorization Options',
		name: 'authorizationOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['paymentSession'],
				operation: ['createAuthorization'],
			},
		},
		options: [
			{
				displayName: 'Auto Capture',
				name: 'autoCapture',
				type: 'boolean',
				default: false,
				description: 'Whether to automatically capture the payment after authorization',
			},
			{
				displayName: 'Purchase Country',
				name: 'purchaseCountry',
				type: 'string',
				default: '',
				description: 'Two-letter country code',
			},
			{
				displayName: 'Purchase Currency',
				name: 'purchaseCurrency',
				type: 'string',
				default: '',
				description: 'Three-letter currency code',
			},
			{
				displayName: 'Order Amount',
				name: 'orderAmount',
				type: 'number',
				default: 0,
				description: 'Total order amount in minor units',
			},
			{
				displayName: 'Order Tax Amount',
				name: 'orderTaxAmount',
				type: 'number',
				default: 0,
				description: 'Total tax amount in minor units',
			},
		],
	},
];
