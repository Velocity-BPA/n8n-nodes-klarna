/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const hppOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['hpp'],
			},
		},
		options: [
			{
				name: 'Create Session',
				value: 'createSession',
				description: 'Create a Hosted Payment Page session',
				action: 'Create HPP session',
			},
			{
				name: 'Get Session',
				value: 'getSession',
				description: 'Get HPP session details',
				action: 'Get HPP session',
			},
			{
				name: 'Distribute',
				value: 'distribute',
				description: 'Send HPP link via email or SMS',
				action: 'Distribute HPP session',
			},
			{
				name: 'Disable',
				value: 'disable',
				description: 'Disable an HPP session',
				action: 'Disable HPP session',
			},
		],
		default: 'createSession',
	},
];

export const hppFields: INodeProperties[] = [
	{
		displayName: 'Payment Session URL',
		name: 'paymentSessionUrl',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['hpp'],
				operation: ['createSession'],
			},
		},
		default: '',
		description: 'URL of the Klarna payment session to use for HPP',
	},
	{
		displayName: 'Merchant URLs',
		name: 'merchantUrls',
		type: 'fixedCollection',
		required: true,
		displayOptions: {
			show: {
				resource: ['hpp'],
				operation: ['createSession'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'URLs',
				name: 'urls',
				values: [
					{ displayName: 'Success URL', name: 'success', type: 'string', default: '', description: 'URL to redirect on successful payment' },
					{ displayName: 'Cancel URL', name: 'cancel', type: 'string', default: '', description: 'URL to redirect on cancel' },
					{ displayName: 'Back URL', name: 'back', type: 'string', default: '', description: 'URL for back button' },
					{ displayName: 'Failure URL', name: 'failure', type: 'string', default: '', description: 'URL to redirect on failure' },
					{ displayName: 'Error URL', name: 'error', type: 'string', default: '', description: 'URL to redirect on error' },
					{ displayName: 'Status Update URL', name: 'status_update', type: 'string', default: '', description: 'Webhook URL for status updates' },
				],
			},
		],
	},
	{
		displayName: 'HPP Options',
		name: 'hppOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['hpp'],
				operation: ['createSession'],
			},
		},
		options: [
			{ displayName: 'Background Image URL', name: 'backgroundImageUrl', type: 'string', default: '', description: 'Custom background image for HPP' },
			{ displayName: 'Logo URL', name: 'logoUrl', type: 'string', default: '', description: 'Custom logo URL' },
			{ displayName: 'Page Title', name: 'pageTitle', type: 'string', default: '', description: 'Custom page title' },
		],
	},
	{
		displayName: 'Session ID',
		name: 'sessionId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['hpp'],
				operation: ['getSession', 'distribute', 'disable'],
			},
		},
		default: '',
		description: 'The HPP session ID',
	},
	{
		displayName: 'Distribution Method',
		name: 'method',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['hpp'],
				operation: ['distribute'],
			},
		},
		options: [
			{ name: 'Email', value: 'email' },
			{ name: 'SMS', value: 'sms' },
		],
		default: 'email',
		description: 'How to send the HPP link',
	},
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['hpp'],
				operation: ['distribute'],
				method: ['email'],
			},
		},
		default: '',
		description: 'Customer email address',
	},
	{
		displayName: 'Phone Number',
		name: 'phone',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['hpp'],
				operation: ['distribute'],
				method: ['sms'],
			},
		},
		default: '',
		description: 'Customer phone number (E.164 format)',
	},
	{
		displayName: 'Phone Country',
		name: 'phoneCountry',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['hpp'],
				operation: ['distribute'],
				method: ['sms'],
			},
		},
		default: 'US',
		description: 'Two-letter country code for phone number',
	},
	{
		displayName: 'Template',
		name: 'template',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['hpp'],
				operation: ['distribute'],
			},
		},
		options: [
			{ name: 'Instore Purchase', value: 'INSTORE_PURCHASE' },
			{ name: 'Pay By Link', value: 'PAY_BY_LINK' },
		],
		default: 'PAY_BY_LINK',
		description: 'Email/SMS template to use',
	},
];
