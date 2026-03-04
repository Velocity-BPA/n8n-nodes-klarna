import {
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
					name: 'Playground',
					value: 'playground',
				},
				{
					name: 'Production',
					value: 'production',
				},
			],
			default: 'playground',
			description: 'The Klarna environment to use',
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.klarna.com',
			description: 'The base URL for Klarna API requests',
			required: true,
		},
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			default: '',
			required: true,
			description: 'Your Klarna API username',
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Your Klarna API password',
		},
	];
}