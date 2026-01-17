/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IHookFunctions,
	IWebhookFunctions,
	IDataObject,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';
import { logLicensingNotice } from './GenericFunctions';

export class KlarnaTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Klarna Trigger',
		name: 'klarnaTrigger',
		icon: 'file:klarna.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Handle Klarna webhook events',
		defaults: { name: 'Klarna Trigger' },
		inputs: [],
		outputs: [NodeConnectionType.Main],
		credentials: [{ name: 'klarnaApi', required: true }],
		webhooks: [{ name: 'default', httpMethod: 'POST', responseMode: 'onReceived', path: 'webhook' }],
		properties: [
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'All Events', value: '*', description: 'Receive all webhook events' },
					{ name: 'Checkout Complete', value: 'checkout_complete', description: 'Checkout flow completed' },
					{ name: 'Customer Token Created', value: 'customer_token_created', description: 'Customer token saved for recurring' },
					{ name: 'Dispute Created', value: 'dispute_created', description: 'New dispute opened' },
					{ name: 'Dispute Resolved', value: 'dispute_resolved', description: 'Dispute has been resolved' },
					{ name: 'Dispute Updated', value: 'dispute_updated', description: 'Dispute status changed' },
					{ name: 'HPP Session Completed', value: 'hpp_session_completed', description: 'Hosted Payment Page checkout completed' },
					{ name: 'Order Authorized', value: 'order_authorized', description: 'Payment has been authorized' },
					{ name: 'Order Cancelled', value: 'order_cancelled', description: 'Order has been cancelled' },
					{ name: 'Order Captured', value: 'order_captured', description: 'Payment has been captured' },
					{ name: 'Order Expired', value: 'order_expired', description: 'Order authorization expired' },
					{ name: 'Order Refunded', value: 'order_refunded', description: 'Refund has been processed' },
					{ name: 'Payout Completed', value: 'payout_completed', description: 'Settlement payout completed' },
				],
				default: '*',
				description: 'The Klarna event to listen for',
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Verify Signature',
						name: 'verifySignature',
						type: 'boolean',
						default: true,
						description: 'Whether to verify the webhook signature (recommended)',
					},
				],
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> { return true; },
			async create(this: IHookFunctions): Promise<boolean> { return true; },
			async delete(this: IHookFunctions): Promise<boolean> { return true; },
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		logLicensingNotice(this.logger);
		const req = this.getRequestObject();
		const body = this.getBodyData() as IDataObject;
		const event = this.getNodeParameter('event') as string;
		const eventType = (body.event_type as string) || '';

		if (event !== '*' && eventType !== event) {
			return { noWebhookResponse: true };
		}

		const responseData: IDataObject = {
			event_type: eventType,
			event_id: body.event_id || '',
			timestamp: body.timestamp || new Date().toISOString(),
			headers: req.headers as IDataObject,
			body,
		};

		if (body.order_id) responseData.order_id = body.order_id;
		if (body.data) responseData.data = body.data;

		return { workflowData: [this.helpers.returnJsonArray(responseData)] };
	}
}
