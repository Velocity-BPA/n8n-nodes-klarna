/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

export interface IKlarnaCredentials {
	environment: 'playground' | 'live';
	region: 'eu' | 'na' | 'oc';
	username: string;
	password: string;
}

export interface IKlarnaOrderLine {
	type:
		| 'physical'
		| 'digital'
		| 'shipping_fee'
		| 'sales_tax'
		| 'discount'
		| 'store_credit'
		| 'gift_card'
		| 'surcharge';
	name: string;
	quantity: number;
	unit_price: number;
	tax_rate: number;
	total_amount: number;
	total_tax_amount: number;
	reference?: string;
	quantity_unit?: string;
	image_url?: string;
	product_url?: string;
	product_identifiers?: {
		category_path?: string;
		global_trade_item_number?: string;
		manufacturer_part_number?: string;
		brand?: string;
	};
}

export interface IKlarnaAddress {
	given_name?: string;
	family_name?: string;
	email?: string;
	phone?: string;
	street_address?: string;
	street_address2?: string;
	postal_code?: string;
	city?: string;
	region?: string;
	country?: string;
	organization_name?: string;
	attention?: string;
	title?: string;
}

export interface IKlarnaSession {
	session_id?: string;
	client_token?: string;
	payment_method_categories?: IKlarnaPaymentMethodCategory[];
	purchase_country: string;
	purchase_currency: string;
	locale: string;
	order_amount: number;
	order_tax_amount: number;
	order_lines: IKlarnaOrderLine[];
	billing_address?: IKlarnaAddress;
	shipping_address?: IKlarnaAddress;
	merchant_reference1?: string;
	merchant_reference2?: string;
	merchant_urls?: {
		confirmation?: string;
		notification?: string;
		push?: string;
	};
	options?: {
		color_border?: string;
		color_border_selected?: string;
		color_details?: string;
		color_text?: string;
		radius_border?: string;
	};
}

export interface IKlarnaPaymentMethodCategory {
	identifier: string;
	name: string;
	asset_urls?: {
		descriptive?: string;
		standard?: string;
	};
}

export interface IKlarnaOrder {
	order_id: string;
	status: string;
	fraud_status: string;
	purchase_country: string;
	purchase_currency: string;
	locale: string;
	order_amount: number;
	captured_amount?: number;
	refunded_amount?: number;
	remaining_authorized_amount?: number;
	order_lines: IKlarnaOrderLine[];
	billing_address: IKlarnaAddress;
	shipping_address?: IKlarnaAddress;
	created_at: string;
	expires_at: string;
	merchant_reference1?: string;
	merchant_reference2?: string;
	captures?: IKlarnaCapture[];
	refunds?: IKlarnaRefund[];
}

export interface IKlarnaCapture {
	capture_id: string;
	klarna_reference: string;
	captured_amount: number;
	captured_at: string;
	description?: string;
	order_lines?: IKlarnaOrderLine[];
	shipping_info?: IKlarnaShippingInfo[];
	billing_address?: IKlarnaAddress;
	shipping_address?: IKlarnaAddress;
}

export interface IKlarnaRefund {
	refund_id: string;
	refunded_amount: number;
	refunded_at: string;
	description?: string;
	order_lines?: IKlarnaOrderLine[];
}

export interface IKlarnaShippingInfo {
	shipping_company?: string;
	shipping_method?: string;
	tracking_number?: string;
	tracking_uri?: string;
	return_shipping_company?: string;
	return_tracking_number?: string;
	return_tracking_uri?: string;
}

export interface IKlarnaHppSession {
	session_id: string;
	session_url: string;
	qr_code_url?: string;
	distribution_url?: string;
	expires_at: string;
	status: string;
	merchant_urls: {
		success?: string;
		cancel?: string;
		back?: string;
		failure?: string;
		error?: string;
		status_update?: string;
	};
	payment_session_url: string;
}

export interface IKlarnaHppDistribution {
	contact_information: {
		email?: string;
		phone?: string;
		phone_country?: string;
	};
	method: 'email' | 'sms';
	template?: 'INSTORE_PURCHASE' | 'PAY_BY_LINK';
}

export interface IKlarnaPayout {
	payment_reference: string;
	payout_date: string;
	currency_code: string;
	merchant_settlement_type: string;
	total_sale_amount?: number;
	total_fee_amount?: number;
	total_return_amount?: number;
	total_tax_amount?: number;
	total_commission_amount?: number;
	total_charge_amount?: number;
	total_payout_amount?: number;
}

export interface IKlarnaTransaction {
	sale_date: string;
	payment_reference: string;
	capture_id?: string;
	order_id?: string;
	refund_id?: string;
	type: string;
	currency_code: string;
	capture_amount?: number;
	fee_amount?: number;
	tax_amount?: number;
	net_sale_amount?: number;
}

export interface IKlarnaDispute {
	dispute_id: string;
	order_id: string;
	status: string;
	reason_code: string;
	reason_description?: string;
	opened_at: string;
	closed_at?: string;
	deadline_at?: string;
	dispute_amount: number;
	currency_code: string;
}

export interface IKlarnaCustomerToken {
	customer_token: string;
	status: string;
	payment_method_type: string;
	description?: string;
}

export interface IKlarnaMerchantCardSession {
	session_id: string;
	status: string;
	purchase_currency: string;
	order_amount: number;
	cards?: IKlarnaVirtualCard[];
}

export interface IKlarnaVirtualCard {
	card_id: string;
	card_number: string;
	cvv: string;
	expiry_date: string;
}

export interface IKlarnaWebhookPayload {
	event_type: string;
	event_id: string;
	order_id?: string;
	timestamp: string;
	data?: Record<string, unknown>;
}
