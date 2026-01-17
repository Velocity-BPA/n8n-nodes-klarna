/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const orderOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['order'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get order details',
				action: 'Get an order',
			},
			{
				name: 'Acknowledge',
				value: 'acknowledge',
				description: 'Acknowledge order receipt',
				action: 'Acknowledge an order',
			},
			{
				name: 'Set Merchant References',
				value: 'setMerchantReferences',
				description: 'Set merchant reference IDs',
				action: 'Set merchant references',
			},
			{
				name: 'Extend Authorization',
				value: 'extendAuthorization',
				description: 'Extend authorization time',
				action: 'Extend authorization time',
			},
			{
				name: 'Update Customer Details',
				value: 'updateCustomerDetails',
				description: 'Update customer information',
				action: 'Update customer details',
			},
			{
				name: 'Update Billing Address',
				value: 'updateBillingAddress',
				description: 'Update billing address',
				action: 'Update billing address',
			},
			{
				name: 'Update Shipping Address',
				value: 'updateShippingAddress',
				description: 'Update shipping address',
				action: 'Update shipping address',
			},
			{
				name: 'Cancel',
				value: 'cancel',
				description: 'Cancel an order',
				action: 'Cancel an order',
			},
			{
				name: 'Release Authorization',
				value: 'releaseAuthorization',
				description: 'Release remaining authorization',
				action: 'Release remaining authorization',
			},
		],
		default: 'get',
	},
];

export const orderFields: INodeProperties[] = [
	{
		displayName: 'Order ID',
		name: 'orderId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['order'],
			},
		},
		default: '',
		description: 'The Klarna order ID',
	},
	{
		displayName: 'Merchant Reference 1',
		name: 'merchantReference1',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['order'],
				operation: ['setMerchantReferences'],
			},
		},
		default: '',
		description: 'Primary merchant reference (e.g., your order ID)',
	},
	{
		displayName: 'Merchant Reference 2',
		name: 'merchantReference2',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['order'],
				operation: ['setMerchantReferences'],
			},
		},
		default: '',
		description: 'Secondary merchant reference',
	},
	{
		displayName: 'Customer Details',
		name: 'customerDetails',
		type: 'fixedCollection',
		displayOptions: {
			show: {
				resource: ['order'],
				operation: ['updateCustomerDetails'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Details',
				name: 'details',
				values: [
					{
						displayName: 'Date of Birth',
						name: 'date_of_birth',
						type: 'string',
						default: '',
						description: 'Format: YYYY-MM-DD',
					},
					{
						displayName: 'National Identification Number',
						name: 'national_identification_number',
						type: 'string',
						default: '',
					},
				],
			},
		],
	},
	{
		displayName: 'Billing Address',
		name: 'billingAddress',
		type: 'fixedCollection',
		displayOptions: {
			show: {
				resource: ['order'],
				operation: ['updateBillingAddress'],
			},
		},
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
					{ displayName: 'Street Address 2', name: 'street_address2', type: 'string', default: '' },
					{ displayName: 'Postal Code', name: 'postal_code', type: 'string', default: '' },
					{ displayName: 'City', name: 'city', type: 'string', default: '' },
					{ displayName: 'Region', name: 'region', type: 'string', default: '' },
					{
						displayName: 'Country',
						name: 'country',
						type: 'string',
						default: '',
						description: 'Two-letter country code',
					},
				],
			},
		],
	},
	{
		displayName: 'Shipping Address',
		name: 'shippingAddress',
		type: 'fixedCollection',
		displayOptions: {
			show: {
				resource: ['order'],
				operation: ['updateShippingAddress'],
			},
		},
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
					{ displayName: 'Street Address 2', name: 'street_address2', type: 'string', default: '' },
					{ displayName: 'Postal Code', name: 'postal_code', type: 'string', default: '' },
					{ displayName: 'City', name: 'city', type: 'string', default: '' },
					{ displayName: 'Region', name: 'region', type: 'string', default: '' },
					{
						displayName: 'Country',
						name: 'country',
						type: 'string',
						default: '',
						description: 'Two-letter country code',
					},
				],
			},
		],
	},
];
