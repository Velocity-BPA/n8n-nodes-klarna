/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const refundOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['refund'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a refund',
				action: 'Create a refund',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get refund details',
				action: 'Get a refund',
			},
		],
		default: 'create',
	},
];

export const refundFields: INodeProperties[] = [
	{
		displayName: 'Order ID',
		name: 'orderId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['refund'],
			},
		},
		default: '',
		description: 'The Klarna order ID',
	},
	{
		displayName: 'Refund Amount (Minor Units)',
		name: 'refundedAmount',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['refund'],
				operation: ['create'],
			},
		},
		default: 0,
		description: 'Amount to refund in minor units (cents). Example: 5000 = $50.00.',
	},
	{
		displayName: 'Refund Options',
		name: 'refundOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['refund'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Reason or description for the refund',
			},
			{
				displayName: 'Order Lines (JSON)',
				name: 'orderLines',
				type: 'json',
				default: '',
				description: 'Order lines being refunded (JSON array)',
			},
		],
	},
	{
		displayName: 'Refund ID',
		name: 'refundId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['refund'],
				operation: ['get'],
			},
		},
		default: '',
		description: 'The refund ID',
	},
];
