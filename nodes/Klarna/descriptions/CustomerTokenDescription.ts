/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const customerTokenOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['customerToken'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get customer token details',
				action: 'Get customer token',
			},
			{
				name: 'Create Order',
				value: 'createOrder',
				description: 'Create order from saved payment method',
				action: 'Create order from token',
			},
		],
		default: 'get',
	},
];

export const customerTokenFields: INodeProperties[] = [
	{
		displayName: 'Customer Token',
		name: 'customerToken',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['customerToken'],
			},
		},
		default: '',
		description: 'The customer token (saved payment method)',
	},
	{
		displayName: 'Purchase Country',
		name: 'purchaseCountry',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['customerToken'],
				operation: ['createOrder'],
			},
		},
		default: 'US',
		description: 'Two-letter country code',
	},
	{
		displayName: 'Purchase Currency',
		name: 'purchaseCurrency',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['customerToken'],
				operation: ['createOrder'],
			},
		},
		default: 'USD',
		description: 'Three-letter currency code',
	},
	{
		displayName: 'Locale',
		name: 'locale',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['customerToken'],
				operation: ['createOrder'],
			},
		},
		default: 'en-US',
		description: 'Locale for the order',
	},
	{
		displayName: 'Order Amount (Minor Units)',
		name: 'orderAmount',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['customerToken'],
				operation: ['createOrder'],
			},
		},
		default: 0,
		description: 'Total order amount in minor units (cents)',
	},
	{
		displayName: 'Order Tax Amount (Minor Units)',
		name: 'orderTaxAmount',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['customerToken'],
				operation: ['createOrder'],
			},
		},
		default: 0,
		description: 'Total tax amount in minor units',
	},
	{
		displayName: 'Order Lines (JSON)',
		name: 'orderLines',
		type: 'json',
		required: true,
		displayOptions: {
			show: {
				resource: ['customerToken'],
				operation: ['createOrder'],
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
				resource: ['customerToken'],
				operation: ['createOrder'],
			},
		},
		options: [
			{
				displayName: 'Auto Capture',
				name: 'autoCapture',
				type: 'boolean',
				default: false,
				description: 'Whether to automatically capture the payment',
			},
			{
				displayName: 'Merchant Reference 1',
				name: 'merchantReference1',
				type: 'string',
				default: '',
				description: 'Primary merchant reference',
			},
			{
				displayName: 'Merchant Reference 2',
				name: 'merchantReference2',
				type: 'string',
				default: '',
				description: 'Secondary merchant reference',
			},
			{
				displayName: 'Merchant Data',
				name: 'merchantData',
				type: 'string',
				default: '',
				description: 'Custom merchant data (max 6000 characters)',
			},
		],
	},
];
