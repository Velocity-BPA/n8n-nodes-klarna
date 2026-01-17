/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const captureOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['capture'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Capture a payment',
				action: 'Create a capture',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get capture details',
				action: 'Get a capture',
			},
			{
				name: 'Add Shipping Info',
				value: 'addShippingInfo',
				description: 'Add shipping information to capture',
				action: 'Add shipping info',
			},
			{
				name: 'Trigger Resend',
				value: 'triggerResend',
				description: 'Resend customer confirmation',
				action: 'Trigger resend',
			},
		],
		default: 'create',
	},
];

export const captureFields: INodeProperties[] = [
	{
		displayName: 'Order ID',
		name: 'orderId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['capture'],
			},
		},
		default: '',
		description: 'The Klarna order ID',
	},
	{
		displayName: 'Captured Amount (Minor Units)',
		name: 'capturedAmount',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['capture'],
				operation: ['create'],
			},
		},
		default: 0,
		description: 'Amount to capture in minor units (cents). Example: 10000 = $100.00.',
	},
	{
		displayName: 'Capture Options',
		name: 'captureOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['capture'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description for this capture',
			},
			{
				displayName: 'Order Lines (JSON)',
				name: 'orderLines',
				type: 'json',
				default: '',
				description: 'Order lines being captured (JSON array)',
			},
			{
				displayName: 'Shipping Info',
				name: 'shippingInfo',
				type: 'fixedCollection',
				default: {},
				options: [
					{
						displayName: 'Info',
						name: 'info',
						values: [
							{ displayName: 'Shipping Company', name: 'shipping_company', type: 'string', default: '' },
							{ displayName: 'Shipping Method', name: 'shipping_method', type: 'string', default: '' },
							{ displayName: 'Tracking Number', name: 'tracking_number', type: 'string', default: '' },
							{ displayName: 'Tracking URI', name: 'tracking_uri', type: 'string', default: '' },
						],
					},
				],
			},
		],
	},
	{
		displayName: 'Capture ID',
		name: 'captureId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['capture'],
				operation: ['get', 'addShippingInfo', 'triggerResend'],
			},
		},
		default: '',
		description: 'The capture ID',
	},
	{
		displayName: 'Shipping Info',
		name: 'shippingInfo',
		type: 'fixedCollection',
		displayOptions: {
			show: {
				resource: ['capture'],
				operation: ['addShippingInfo'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Info',
				name: 'info',
				values: [
					{
						displayName: 'Shipping Company',
						name: 'shipping_company',
						type: 'string',
						default: '',
						description: 'Name of the shipping carrier',
					},
					{
						displayName: 'Shipping Method',
						name: 'shipping_method',
						type: 'string',
						default: '',
						description: 'Shipping method (e.g., Express, Standard)',
					},
					{
						displayName: 'Tracking Number',
						name: 'tracking_number',
						type: 'string',
						default: '',
						description: 'Package tracking number',
					},
					{
						displayName: 'Tracking URI',
						name: 'tracking_uri',
						type: 'string',
						default: '',
						description: 'URL to track the shipment',
					},
					{
						displayName: 'Return Shipping Company',
						name: 'return_shipping_company',
						type: 'string',
						default: '',
						description: 'Return shipping carrier',
					},
					{
						displayName: 'Return Tracking Number',
						name: 'return_tracking_number',
						type: 'string',
						default: '',
						description: 'Return package tracking number',
					},
					{
						displayName: 'Return Tracking URI',
						name: 'return_tracking_uri',
						type: 'string',
						default: '',
						description: 'URL to track return shipment',
					},
				],
			},
		],
	},
];
