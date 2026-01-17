/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IExecuteFunctions,
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';

import { klarnaApiRequest, formatOrderLines, formatAddress, logLicensingNotice } from './GenericFunctions';
import { paymentSessionOperations, paymentSessionFields } from './descriptions/PaymentSessionDescription';
import { orderOperations, orderFields } from './descriptions/OrderDescription';
import { captureOperations, captureFields } from './descriptions/CaptureDescription';
import { refundOperations, refundFields } from './descriptions/RefundDescription';
import { hppOperations, hppFields } from './descriptions/HppDescription';
import { settlementOperations, settlementFields } from './descriptions/SettlementDescription';
import { disputeOperations, disputeFields } from './descriptions/DisputeDescription';
import { customerTokenOperations, customerTokenFields } from './descriptions/CustomerTokenDescription';
import { merchantCardOperations, merchantCardFields } from './descriptions/MerchantCardDescription';

export class Klarna implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Klarna',
		name: 'klarna',
		icon: 'file:klarna.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Klarna Buy Now Pay Later API',
		defaults: { name: 'Klarna' },
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [{ name: 'klarnaApi', required: true }],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Payment Session', value: 'paymentSession' },
					{ name: 'Order', value: 'order' },
					{ name: 'Capture', value: 'capture' },
					{ name: 'Refund', value: 'refund' },
					{ name: 'Hosted Payment Page', value: 'hpp' },
					{ name: 'Settlement', value: 'settlement' },
					{ name: 'Dispute', value: 'dispute' },
					{ name: 'Customer Token', value: 'customerToken' },
					{ name: 'Merchant Card', value: 'merchantCard' },
				],
				default: 'paymentSession',
			},
			...paymentSessionOperations, ...paymentSessionFields,
			...orderOperations, ...orderFields,
			...captureOperations, ...captureFields,
			...refundOperations, ...refundFields,
			...hppOperations, ...hppFields,
			...settlementOperations, ...settlementFields,
			...disputeOperations, ...disputeFields,
			...customerTokenOperations, ...customerTokenFields,
			...merchantCardOperations, ...merchantCardFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		logLicensingNotice(this.logger);
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: IDataObject = {};
				if (resource === 'paymentSession') responseData = await this.handlePaymentSession(i, operation);
				else if (resource === 'order') responseData = await this.handleOrder(i, operation);
				else if (resource === 'capture') responseData = await this.handleCapture(i, operation);
				else if (resource === 'refund') responseData = await this.handleRefund(i, operation);
				else if (resource === 'hpp') responseData = await this.handleHpp(i, operation);
				else if (resource === 'settlement') responseData = await this.handleSettlement(i, operation);
				else if (resource === 'dispute') responseData = await this.handleDispute(i, operation);
				else if (resource === 'customerToken') responseData = await this.handleCustomerToken(i, operation);
				else if (resource === 'merchantCard') responseData = await this.handleMerchantCard(i, operation);

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData), { itemData: { item: i } });
				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
					continue;
				}
				throw error;
			}
		}
		return [returnData];
	}

	private async handlePaymentSession(this: IExecuteFunctions, i: number, op: string): Promise<IDataObject> {
		if (op === 'create' || op === 'update') {
			const body: IDataObject = {
				purchase_country: this.getNodeParameter('purchaseCountry', i),
				purchase_currency: this.getNodeParameter('purchaseCurrency', i),
				locale: this.getNodeParameter('locale', i),
				order_amount: this.getNodeParameter('orderAmount', i),
				order_tax_amount: this.getNodeParameter('orderTaxAmount', i),
				order_lines: formatOrderLines(this.getNodeParameter('orderLines', i) as string),
			};
			const af = this.getNodeParameter('additionalFields', i) as IDataObject;
			if (af.merchantReference1) body.merchant_reference1 = af.merchantReference1;
			if (af.merchantReference2) body.merchant_reference2 = af.merchantReference2;
			if (af.billingAddress) {
				const bd = af.billingAddress as IDataObject;
				if (bd.address) body.billing_address = formatAddress(bd.address as IDataObject);
			}
			if (af.shippingAddress) {
				const sd = af.shippingAddress as IDataObject;
				if (sd.address) body.shipping_address = formatAddress(sd.address as IDataObject);
			}
			if (op === 'create') return await klarnaApiRequest.call(this, 'POST', '/payments/v1/sessions', body) as IDataObject;
			const sid = this.getNodeParameter('sessionId', i) as string;
			return await klarnaApiRequest.call(this, 'POST', `/payments/v1/sessions/${sid}`, body) as IDataObject;
		} else if (op === 'get') {
			const sid = this.getNodeParameter('sessionId', i) as string;
			return await klarnaApiRequest.call(this, 'GET', `/payments/v1/sessions/${sid}`) as IDataObject;
		} else if (op === 'createAuthorization') {
			const token = this.getNodeParameter('authorizationToken', i) as string;
			const opts = this.getNodeParameter('authorizationOptions', i) as IDataObject;
			const body: IDataObject = {};
			if (opts.autoCapture) body.auto_capture = opts.autoCapture;
			if (opts.purchaseCountry) body.purchase_country = opts.purchaseCountry;
			if (opts.purchaseCurrency) body.purchase_currency = opts.purchaseCurrency;
			if (opts.orderAmount) body.order_amount = opts.orderAmount;
			if (opts.orderTaxAmount) body.order_tax_amount = opts.orderTaxAmount;
			return await klarnaApiRequest.call(this, 'POST', `/payments/v1/authorizations/${token}/order`, body) as IDataObject;
		} else if (op === 'cancelAuthorization') {
			const token = this.getNodeParameter('authorizationToken', i) as string;
			await klarnaApiRequest.call(this, 'DELETE', `/payments/v1/authorizations/${token}`);
			return { success: true };
		}
		return {};
	}

	private async handleOrder(this: IExecuteFunctions, i: number, op: string): Promise<IDataObject> {
		const oid = this.getNodeParameter('orderId', i) as string;
		if (op === 'get') return await klarnaApiRequest.call(this, 'GET', `/ordermanagement/v1/orders/${oid}`) as IDataObject;
		if (op === 'acknowledge') { await klarnaApiRequest.call(this, 'POST', `/ordermanagement/v1/orders/${oid}/acknowledge`); return { success: true, order_id: oid }; }
		if (op === 'setMerchantReferences') {
			const body: IDataObject = {};
			const r1 = this.getNodeParameter('merchantReference1', i, '') as string;
			const r2 = this.getNodeParameter('merchantReference2', i, '') as string;
			if (r1) body.merchant_reference1 = r1;
			if (r2) body.merchant_reference2 = r2;
			await klarnaApiRequest.call(this, 'PATCH', `/ordermanagement/v1/orders/${oid}/merchant-references`, body);
			return { success: true, order_id: oid };
		}
		if (op === 'extendAuthorization') { await klarnaApiRequest.call(this, 'POST', `/ordermanagement/v1/orders/${oid}/extend-authorization-time`); return { success: true, order_id: oid }; }
		if (op === 'updateCustomerDetails') {
			const cd = this.getNodeParameter('customerDetails', i) as IDataObject;
			const body: IDataObject = {};
			if (cd.details) {
				const d = cd.details as IDataObject;
				if (d.date_of_birth) body.date_of_birth = d.date_of_birth;
				if (d.national_identification_number) body.national_identification_number = d.national_identification_number;
			}
			await klarnaApiRequest.call(this, 'PATCH', `/ordermanagement/v1/orders/${oid}/customer-details`, body);
			return { success: true, order_id: oid };
		}
		if (op === 'updateBillingAddress') {
			const ba = this.getNodeParameter('billingAddress', i) as IDataObject;
			let body: IDataObject = {};
			if (ba.address) body = formatAddress(ba.address as IDataObject);
			await klarnaApiRequest.call(this, 'PATCH', `/ordermanagement/v1/orders/${oid}/billing-address`, body);
			return { success: true, order_id: oid };
		}
		if (op === 'updateShippingAddress') {
			const sa = this.getNodeParameter('shippingAddress', i) as IDataObject;
			let body: IDataObject = {};
			if (sa.address) body = formatAddress(sa.address as IDataObject);
			await klarnaApiRequest.call(this, 'PATCH', `/ordermanagement/v1/orders/${oid}/shipping-address`, body);
			return { success: true, order_id: oid };
		}
		if (op === 'cancel') { await klarnaApiRequest.call(this, 'POST', `/ordermanagement/v1/orders/${oid}/cancel`); return { success: true, order_id: oid }; }
		if (op === 'releaseAuthorization') { await klarnaApiRequest.call(this, 'POST', `/ordermanagement/v1/orders/${oid}/release-remaining-authorization`); return { success: true, order_id: oid }; }
		return {};
	}

	private async handleCapture(this: IExecuteFunctions, i: number, op: string): Promise<IDataObject> {
		const oid = this.getNodeParameter('orderId', i) as string;
		if (op === 'create') {
			const body: IDataObject = { captured_amount: this.getNodeParameter('capturedAmount', i) };
			const opts = this.getNodeParameter('captureOptions', i) as IDataObject;
			if (opts.description) body.description = opts.description;
			if (opts.orderLines) body.order_lines = formatOrderLines(opts.orderLines as string);
			if (opts.shippingInfo) {
				const si = opts.shippingInfo as IDataObject;
				if (si.info) body.shipping_info = [si.info];
			}
			return await klarnaApiRequest.call(this, 'POST', `/ordermanagement/v1/orders/${oid}/captures`, body) as IDataObject;
		}
		const cid = this.getNodeParameter('captureId', i) as string;
		if (op === 'get') return await klarnaApiRequest.call(this, 'GET', `/ordermanagement/v1/orders/${oid}/captures/${cid}`) as IDataObject;
		if (op === 'addShippingInfo') {
			const si = this.getNodeParameter('shippingInfo', i) as IDataObject;
			const body: IDataObject = { shipping_info: [] };
			if (si.info) (body.shipping_info as IDataObject[]).push(si.info as IDataObject);
			await klarnaApiRequest.call(this, 'POST', `/ordermanagement/v1/orders/${oid}/captures/${cid}/shipping-info`, body);
			return { success: true, capture_id: cid };
		}
		if (op === 'triggerResend') { await klarnaApiRequest.call(this, 'POST', `/ordermanagement/v1/orders/${oid}/captures/${cid}/trigger-send-out`); return { success: true, capture_id: cid }; }
		return {};
	}

	private async handleRefund(this: IExecuteFunctions, i: number, op: string): Promise<IDataObject> {
		const oid = this.getNodeParameter('orderId', i) as string;
		if (op === 'create') {
			const body: IDataObject = { refunded_amount: this.getNodeParameter('refundedAmount', i) };
			const opts = this.getNodeParameter('refundOptions', i) as IDataObject;
			if (opts.description) body.description = opts.description;
			if (opts.orderLines) body.order_lines = formatOrderLines(opts.orderLines as string);
			return await klarnaApiRequest.call(this, 'POST', `/ordermanagement/v1/orders/${oid}/refunds`, body) as IDataObject;
		}
		const rid = this.getNodeParameter('refundId', i) as string;
		return await klarnaApiRequest.call(this, 'GET', `/ordermanagement/v1/orders/${oid}/refunds/${rid}`) as IDataObject;
	}

	private async handleHpp(this: IExecuteFunctions, i: number, op: string): Promise<IDataObject> {
		if (op === 'createSession') {
			const mu = this.getNodeParameter('merchantUrls', i) as IDataObject;
			const body: IDataObject = {
				payment_session_url: this.getNodeParameter('paymentSessionUrl', i),
				merchant_urls: mu.urls || {},
			};
			const opts = this.getNodeParameter('hppOptions', i) as IDataObject;
			if (opts.backgroundImageUrl || opts.logoUrl || opts.pageTitle) {
				body.options = {};
				if (opts.backgroundImageUrl) (body.options as IDataObject).background_image_url = opts.backgroundImageUrl;
				if (opts.logoUrl) (body.options as IDataObject).logo_url = opts.logoUrl;
				if (opts.pageTitle) (body.options as IDataObject).page_title = opts.pageTitle;
			}
			return await klarnaApiRequest.call(this, 'POST', '/hpp/v1/sessions', body) as IDataObject;
		}
		const sid = this.getNodeParameter('sessionId', i) as string;
		if (op === 'getSession') return await klarnaApiRequest.call(this, 'GET', `/hpp/v1/sessions/${sid}`) as IDataObject;
		if (op === 'distribute') {
			const method = this.getNodeParameter('method', i) as string;
			const template = this.getNodeParameter('template', i, 'PAY_BY_LINK') as string;
			const body: IDataObject = { method, template, contact_information: {} };
			if (method === 'email') (body.contact_information as IDataObject).email = this.getNodeParameter('email', i);
			else {
				(body.contact_information as IDataObject).phone = this.getNodeParameter('phone', i);
				(body.contact_information as IDataObject).phone_country = this.getNodeParameter('phoneCountry', i, 'US');
			}
			return await klarnaApiRequest.call(this, 'POST', `/hpp/v1/sessions/${sid}/distribution`, body) as IDataObject;
		}
		if (op === 'disable') { await klarnaApiRequest.call(this, 'DELETE', `/hpp/v1/sessions/${sid}`); return { success: true, session_id: sid }; }
		return {};
	}

	private async handleSettlement(this: IExecuteFunctions, i: number, op: string): Promise<IDataObject> {
		if (op === 'getPayouts') {
			const f = this.getNodeParameter('filters', i) as IDataObject;
			const qs: IDataObject = {};
			if (f.startDate) qs.start_date = f.startDate;
			if (f.endDate) qs.end_date = f.endDate;
			if (f.currencyCode) qs.currency_code = f.currencyCode;
			if (f.size) qs.size = f.size;
			if (f.offset) qs.offset = f.offset;
			return await klarnaApiRequest.call(this, 'GET', '/settlements/v1/payouts', {}, qs) as IDataObject;
		}
		if (op === 'getPayout') {
			const pr = this.getNodeParameter('paymentReference', i) as string;
			return await klarnaApiRequest.call(this, 'GET', `/settlements/v1/payouts/${pr}`) as IDataObject;
		}
		if (op === 'getPayoutSummary') {
			const pr = this.getNodeParameter('paymentReference', i) as string;
			return await klarnaApiRequest.call(this, 'GET', `/settlements/v1/payouts/${pr}/summary`) as IDataObject;
		}
		if (op === 'getTransactions') {
			const pr = this.getNodeParameter('paymentReference', i, '') as string;
			const f = this.getNodeParameter('transactionFilters', i) as IDataObject;
			const qs: IDataObject = {};
			if (pr) qs.payment_reference = pr;
			if (f.orderId) qs.order_id = f.orderId;
			if (f.captureId) qs.capture_id = f.captureId;
			if (f.currencyCode) qs.currency_code = f.currencyCode;
			if (f.size) qs.size = f.size;
			if (f.offset) qs.offset = f.offset;
			return await klarnaApiRequest.call(this, 'GET', '/settlements/v1/transactions', {}, qs) as IDataObject;
		}
		return {};
	}

	private async handleDispute(this: IExecuteFunctions, i: number, op: string): Promise<IDataObject> {
		if (op === 'getAll') {
			const f = this.getNodeParameter('filters', i) as IDataObject;
			const qs: IDataObject = {};
			if (f.status) qs.status = f.status;
			if (f.size) qs.size = f.size;
			if (f.offset) qs.offset = f.offset;
			return await klarnaApiRequest.call(this, 'GET', '/disputes/v1/disputes', {}, qs) as IDataObject;
		}
		const did = this.getNodeParameter('disputeId', i) as string;
		if (op === 'get') return await klarnaApiRequest.call(this, 'GET', `/disputes/v1/disputes/${did}`) as IDataObject;
		if (op === 'accept') { await klarnaApiRequest.call(this, 'POST', `/disputes/v1/disputes/${did}/accept`); return { success: true, dispute_id: did }; }
		if (op === 'addFile') {
			const body: IDataObject = {
				file_content: this.getNodeParameter('fileContent', i),
				file_name: this.getNodeParameter('fileName', i),
				content_type: this.getNodeParameter('contentType', i),
			};
			return await klarnaApiRequest.call(this, 'POST', `/disputes/v1/disputes/${did}/files`, body) as IDataObject;
		}
		if (op === 'submitResponse') {
			const body: IDataObject = { response_text: this.getNodeParameter('responseText', i) };
			await klarnaApiRequest.call(this, 'POST', `/disputes/v1/disputes/${did}/submit`, body);
			return { success: true, dispute_id: did };
		}
		return {};
	}

	private async handleCustomerToken(this: IExecuteFunctions, i: number, op: string): Promise<IDataObject> {
		const ct = this.getNodeParameter('customerToken', i) as string;
		if (op === 'get') return await klarnaApiRequest.call(this, 'GET', `/customer-token/v1/tokens/${ct}`) as IDataObject;
		if (op === 'createOrder') {
			const body: IDataObject = {
				purchase_country: this.getNodeParameter('purchaseCountry', i),
				purchase_currency: this.getNodeParameter('purchaseCurrency', i),
				locale: this.getNodeParameter('locale', i),
				order_amount: this.getNodeParameter('orderAmount', i),
				order_tax_amount: this.getNodeParameter('orderTaxAmount', i),
				order_lines: formatOrderLines(this.getNodeParameter('orderLines', i) as string),
			};
			const af = this.getNodeParameter('additionalFields', i) as IDataObject;
			if (af.autoCapture) body.auto_capture = af.autoCapture;
			if (af.merchantReference1) body.merchant_reference1 = af.merchantReference1;
			if (af.merchantReference2) body.merchant_reference2 = af.merchantReference2;
			if (af.merchantData) body.merchant_data = af.merchantData;
			return await klarnaApiRequest.call(this, 'POST', `/customer-token/v1/tokens/${ct}/order`, body) as IDataObject;
		}
		return {};
	}

	private async handleMerchantCard(this: IExecuteFunctions, i: number, op: string): Promise<IDataObject> {
		if (op === 'createSession') {
			const body: IDataObject = {
				order_id: this.getNodeParameter('orderId', i),
				purchase_currency: this.getNodeParameter('purchaseCurrency', i),
				order_amount: this.getNodeParameter('orderAmount', i),
			};
			return await klarnaApiRequest.call(this, 'POST', '/merchantcard/v3/sessions', body) as IDataObject;
		}
		const sid = this.getNodeParameter('sessionId', i) as string;
		if (op === 'getSession') return await klarnaApiRequest.call(this, 'GET', `/merchantcard/v3/sessions/${sid}`) as IDataObject;
		if (op === 'retrieveCard') return await klarnaApiRequest.call(this, 'POST', `/merchantcard/v3/sessions/${sid}/cards`) as IDataObject;
		if (op === 'settle') {
			const sa = this.getNodeParameter('settlementAmount', i, 0) as number;
			const body: IDataObject = {};
			if (sa > 0) body.settlement_amount = sa;
			return await klarnaApiRequest.call(this, 'POST', `/merchantcard/v3/sessions/${sid}/settle`, body) as IDataObject;
		}
		return {};
	}
}
