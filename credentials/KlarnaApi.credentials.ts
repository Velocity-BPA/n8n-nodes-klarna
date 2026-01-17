/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class KlarnaApi implements ICredentialType {
	name = 'klarnaApi';
	displayName = 'Klarna API';
	documentationUrl = 'https://docs.klarna.com/api/';
	properties: INodeProperties[] = [
		{
			displayName: 'Environment',
			name: 'environment',
			type: 'options',
			options: [
				{
					name: 'Playground (Test)',
					value: 'playground',
				},
				{
					name: 'Live',
					value: 'live',
				},
			],
			default: 'playground',
			description: 'Select the Klarna environment',
		},
		{
			displayName: 'Region',
			name: 'region',
			type: 'options',
			options: [
				{
					name: 'Europe (EU)',
					value: 'eu',
				},
				{
					name: 'North America (NA)',
					value: 'na',
				},
				{
					name: 'Oceania (OC)',
					value: 'oc',
				},
			],
			default: 'eu',
			description: 'Select your Klarna region',
		},
		{
			displayName: 'API Username',
			name: 'username',
			type: 'string',
			default: '',
			required: true,
			description: 'Username from Klarna Merchant Portal (format: PK_XXXX)',
		},
		{
			displayName: 'API Password',
			name: 'password',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Password from Klarna Merchant Portal',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization:
					'=Basic {{Buffer.from($credentials.username + ":" + $credentials.password).toString("base64")}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL:
				'={{$credentials.environment === "playground" ? "https://api" + ($credentials.region === "eu" ? "" : "-" + $credentials.region) + ".playground.klarna.com" : "https://api" + ($credentials.region === "eu" ? "" : "-" + $credentials.region) + ".klarna.com"}}',
			url: '/payments/v1/sessions',
			method: 'POST',
			body: {
				purchase_country: 'US',
				purchase_currency: 'USD',
				locale: 'en-US',
				order_amount: 100,
				order_tax_amount: 0,
				order_lines: [
					{
						type: 'physical',
						name: 'Test Item',
						quantity: 1,
						unit_price: 100,
						tax_rate: 0,
						total_amount: 100,
						total_tax_amount: 0,
					},
				],
			},
		},
	};
}
