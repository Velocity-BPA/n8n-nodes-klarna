/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const merchantCardOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['merchantCard'],
			},
		},
		options: [
			{
				name: 'Create Session',
				value: 'createSession',
				description: 'Create a merchant card session',
				action: 'Create merchant card session',
			},
			{
				name: 'Get Session',
				value: 'getSession',
				description: 'Get merchant card session details',
				action: 'Get merchant card session',
			},
			{
				name: 'Retrieve Card',
				value: 'retrieveCard',
				description: 'Retrieve virtual card details',
				action: 'Retrieve virtual card',
			},
			{
				name: 'Settle',
				value: 'settle',
				description: 'Settle a merchant card session',
				action: 'Settle merchant card session',
			},
		],
		default: 'createSession',
	},
];

export const merchantCardFields: INodeProperties[] = [
	{
		displayName: 'Order ID',
		name: 'orderId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['merchantCard'],
				operation: ['createSession'],
			},
		},
		default: '',
		description: 'The Klarna order ID',
	},
	{
		displayName: 'Purchase Currency',
		name: 'purchaseCurrency',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['merchantCard'],
				operation: ['createSession'],
			},
		},
		default: 'USD',
		description: 'Three-letter currency code',
	},
	{
		displayName: 'Order Amount (Minor Units)',
		name: 'orderAmount',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['merchantCard'],
				operation: ['createSession'],
			},
		},
		default: 0,
		description: 'Total amount in minor units for the virtual card',
	},
	{
		displayName: 'Session ID',
		name: 'sessionId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['merchantCard'],
				operation: ['getSession', 'retrieveCard', 'settle'],
			},
		},
		default: '',
		description: 'The merchant card session ID',
	},
	{
		displayName: 'Settlement Amount (Minor Units)',
		name: 'settlementAmount',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['merchantCard'],
				operation: ['settle'],
			},
		},
		default: 0,
		description: 'Amount to settle in minor units (optional, defaults to full amount)',
	},
];
