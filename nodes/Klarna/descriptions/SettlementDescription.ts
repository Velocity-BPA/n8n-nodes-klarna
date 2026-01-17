/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const settlementOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['settlement'],
			},
		},
		options: [
			{
				name: 'Get Payouts',
				value: 'getPayouts',
				description: 'List all payouts',
				action: 'Get payouts',
			},
			{
				name: 'Get Payout',
				value: 'getPayout',
				description: 'Get a specific payout',
				action: 'Get a payout',
			},
			{
				name: 'Get Payout Summary',
				value: 'getPayoutSummary',
				description: 'Get payout summary by currency',
				action: 'Get payout summary',
			},
			{
				name: 'Get Transactions',
				value: 'getTransactions',
				description: 'List settlement transactions',
				action: 'Get transactions',
			},
		],
		default: 'getPayouts',
	},
];

export const settlementFields: INodeProperties[] = [
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['settlement'],
				operation: ['getPayouts'],
			},
		},
		options: [
			{ displayName: 'Start Date', name: 'startDate', type: 'dateTime', default: '', description: 'Filter payouts from this date' },
			{ displayName: 'End Date', name: 'endDate', type: 'dateTime', default: '', description: 'Filter payouts until this date' },
			{ displayName: 'Currency Code', name: 'currencyCode', type: 'string', default: '', description: 'Three-letter currency code filter' },
			{ displayName: 'Size', name: 'size', type: 'number', default: 100, description: 'Number of payouts to return' },
			{ displayName: 'Offset', name: 'offset', type: 'number', default: 0, description: 'Pagination offset' },
		],
	},
	{
		displayName: 'Payment Reference',
		name: 'paymentReference',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['settlement'],
				operation: ['getPayout', 'getPayoutSummary'],
			},
		},
		default: '',
		description: 'The payout payment reference',
	},
	{
		displayName: 'Payment Reference',
		name: 'paymentReference',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['settlement'],
				operation: ['getTransactions'],
			},
		},
		default: '',
		description: 'Filter by payment reference',
	},
	{
		displayName: 'Transaction Filters',
		name: 'transactionFilters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['settlement'],
				operation: ['getTransactions'],
			},
		},
		options: [
			{ displayName: 'Order ID', name: 'orderId', type: 'string', default: '', description: 'Filter by order ID' },
			{ displayName: 'Capture ID', name: 'captureId', type: 'string', default: '', description: 'Filter by capture ID' },
			{ displayName: 'Currency Code', name: 'currencyCode', type: 'string', default: '', description: 'Three-letter currency code filter' },
			{ displayName: 'Size', name: 'size', type: 'number', default: 100, description: 'Number of transactions to return' },
			{ displayName: 'Offset', name: 'offset', type: 'number', default: 0, description: 'Pagination offset' },
		],
	},
];
