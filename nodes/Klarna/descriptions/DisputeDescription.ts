/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const disputeOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['dispute'],
			},
		},
		options: [
			{
				name: 'Get All',
				value: 'getAll',
				description: 'Get all disputes',
				action: 'Get all disputes',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a specific dispute',
				action: 'Get a dispute',
			},
			{
				name: 'Accept',
				value: 'accept',
				description: 'Accept a dispute',
				action: 'Accept a dispute',
			},
			{
				name: 'Add File',
				value: 'addFile',
				description: 'Upload a document to dispute',
				action: 'Add file to dispute',
			},
			{
				name: 'Submit Response',
				value: 'submitResponse',
				description: 'Submit dispute response',
				action: 'Submit dispute response',
			},
		],
		default: 'getAll',
	},
];

export const disputeFields: INodeProperties[] = [
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['dispute'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Open', value: 'OPEN' },
					{ name: 'Open - Action Required', value: 'OPEN_ACTION_REQUIRED' },
					{ name: 'Open - Under Review', value: 'OPEN_UNDER_REVIEW' },
					{ name: 'Closed', value: 'CLOSED' },
				],
				default: '',
				description: 'Filter by dispute status',
			},
			{ displayName: 'Size', name: 'size', type: 'number', default: 100, description: 'Number of disputes to return' },
			{ displayName: 'Offset', name: 'offset', type: 'number', default: 0, description: 'Pagination offset' },
		],
	},
	{
		displayName: 'Dispute ID',
		name: 'disputeId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['dispute'],
				operation: ['get', 'accept', 'addFile', 'submitResponse'],
			},
		},
		default: '',
		description: 'The dispute ID',
	},
	{
		displayName: 'File Content',
		name: 'fileContent',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['dispute'],
				operation: ['addFile'],
			},
		},
		default: '',
		description: 'Base64 encoded file content',
	},
	{
		displayName: 'File Name',
		name: 'fileName',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['dispute'],
				operation: ['addFile'],
			},
		},
		default: '',
		description: 'Name of the file with extension',
	},
	{
		displayName: 'Content Type',
		name: 'contentType',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['dispute'],
				operation: ['addFile'],
			},
		},
		options: [
			{ name: 'PDF', value: 'application/pdf' },
			{ name: 'JPEG', value: 'image/jpeg' },
			{ name: 'PNG', value: 'image/png' },
		],
		default: 'application/pdf',
		description: 'MIME type of the file',
	},
	{
		displayName: 'Response Text',
		name: 'responseText',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['dispute'],
				operation: ['submitResponse'],
			},
		},
		default: '',
		description: 'Your response to the dispute',
	},
];
