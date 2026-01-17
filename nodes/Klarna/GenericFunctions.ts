/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	ILoadOptionsFunctions,
	IWebhookFunctions,
	JsonObject,
	Logger,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

// Track if licensing notice has been logged this session
let licensingNoticeLogged = false;

/**
 * Logs the Velocity BPA licensing notice once per node load.
 * Non-blocking, informational only. No telemetry or enforcement.
 */
export function logLicensingNotice(logger: Logger): void {
	if (licensingNoticeLogged) {
		return;
	}

	logger.warn(`[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.
`);

	licensingNoticeLogged = true;
}

/**
 * Returns the appropriate base URL for Klarna API based on environment and region.
 */
export function getBaseUrl(environment: string, region: string): string {
	const regionPrefix = region === 'eu' ? '' : `-${region}`;
	const envPrefix = environment === 'playground' ? 'playground.' : '';
	return `https://api${regionPrefix}.${envPrefix}klarna.com`;
}

/**
 * Makes an authenticated request to the Klarna API.
 */
export async function klarnaApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions | IWebhookFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
): Promise<IDataObject | IDataObject[]> {
	const credentials = await this.getCredentials('klarnaApi');
	const baseUrl = getBaseUrl(credentials.environment as string, credentials.region as string);

	const options: IHttpRequestOptions = {
		method,
		url: `${baseUrl}${endpoint}`,
		headers: {
			'Content-Type': 'application/json',
		},
		body,
		qs,
		json: true,
	};

	if (method === 'GET' || method === 'DELETE') {
		delete options.body;
	}

	if (Object.keys(qs).length === 0) {
		delete options.qs;
	}

	try {
		const response = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'klarnaApi',
			options,
		);
		return response as IDataObject;
	} catch (error) {
		const errorData = error as { message?: string; description?: string };
		throw new NodeApiError(this.getNode(), error as JsonObject, {
			message: errorData.message || 'Klarna API request failed',
			description: errorData.description,
		});
	}
}

/**
 * Makes paginated requests to fetch all items from Klarna API.
 */
export async function klarnaApiRequestAllItems(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
	propertyName: string,
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];
	let responseData: IDataObject;
	qs.size = qs.size || 100;
	qs.offset = 0;

	do {
		responseData = (await klarnaApiRequest.call(this, method, endpoint, body, qs)) as IDataObject;
		const items = responseData[propertyName] as IDataObject[];
		if (items) {
			returnData.push(...items);
		}
		qs.offset = (qs.offset as number) + (qs.size as number);
	} while (
		responseData[propertyName] &&
		(responseData[propertyName] as IDataObject[]).length === qs.size
	);

	return returnData;
}

/**
 * Parses and validates order lines JSON input.
 */
export function formatOrderLines(orderLinesJson: string): IDataObject[] {
	try {
		const parsed = JSON.parse(orderLinesJson);
		if (!Array.isArray(parsed)) {
			throw new Error('Order lines must be an array');
		}
		return parsed.map((line: IDataObject) => ({
			type: line.type || 'physical',
			name: line.name,
			quantity: Number(line.quantity),
			unit_price: Number(line.unit_price),
			tax_rate: Number(line.tax_rate || 0),
			total_amount: Number(line.total_amount),
			total_tax_amount: Number(line.total_tax_amount || 0),
			reference: line.reference,
			image_url: line.image_url,
			product_url: line.product_url,
		}));
	} catch (error) {
		throw new Error(`Invalid order lines JSON: ${(error as Error).message}`);
	}
}

/**
 * Formats address data for Klarna API requests.
 */
export function formatAddress(addressData: IDataObject): IDataObject {
	const address: IDataObject = {};
	const fields = [
		'given_name',
		'family_name',
		'email',
		'phone',
		'street_address',
		'street_address2',
		'postal_code',
		'city',
		'region',
		'country',
		'organization_name',
		'attention',
		'title',
	];

	for (const field of fields) {
		if (addressData[field]) {
			address[field] = addressData[field];
		}
	}

	return address;
}

/**
 * Converts a decimal amount to minor units (cents).
 */
export function toMinorUnits(amount: number, currency: string): number {
	const noDecimalCurrencies = ['JPY', 'KRW', 'VND', 'ISK', 'HUF'];
	if (noDecimalCurrencies.includes(currency.toUpperCase())) {
		return Math.round(amount);
	}
	return Math.round(amount * 100);
}

/**
 * Converts minor units (cents) to decimal amount.
 */
export function fromMinorUnits(amount: number, currency: string): number {
	const noDecimalCurrencies = ['JPY', 'KRW', 'VND', 'ISK', 'HUF'];
	if (noDecimalCurrencies.includes(currency.toUpperCase())) {
		return amount;
	}
	return amount / 100;
}

/**
 * Validates that required fields are present in the data object.
 */
export function validateRequiredFields(data: IDataObject, requiredFields: string[]): void {
	for (const field of requiredFields) {
		if (data[field] === undefined || data[field] === null || data[field] === '') {
			throw new Error(`Required field "${field}" is missing`);
		}
	}
}
