/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-klarna/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class Klarna implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Klarna',
    name: 'klarna',
    icon: 'file:klarna.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Klarna API',
    defaults: {
      name: 'Klarna',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'klarnaApi',
        required: true,
      },
    ],
    properties: [
      // Resource selector
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'PaymentSessions',
            value: 'paymentSessions',
          },
          {
            name: 'Orders',
            value: 'orders',
          },
          {
            name: 'Captures',
            value: 'captures',
          },
          {
            name: 'Refunds',
            value: 'refunds',
          },
          {
            name: 'Settlements',
            value: 'settlements',
          }
        ],
        default: 'paymentSessions',
      },
      // Operation dropdowns per resource
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['paymentSessions'],
    },
  },
  options: [
    {
      name: 'Create Session',
      value: 'createSession',
      description: 'Create a new payment session',
      action: 'Create a payment session',
    },
    {
      name: 'Get Session',
      value: 'getSession',
      description: 'Retrieve payment session details',
      action: 'Get a payment session',
    },
    {
      name: 'Update Session',
      value: 'updateSession',
      description: 'Update existing payment session',
      action: 'Update a payment session',
    },
  ],
  default: 'createSession',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['orders'],
    },
  },
  options: [
    {
      name: 'Create Order',
      value: 'createOrder',
      description: 'Create order from authorized payment',
      action: 'Create order',
    },
    {
      name: 'Get Order',
      value: 'getOrder',
      description: 'Retrieve order details',
      action: 'Get order',
    },
    {
      name: 'Update Order Authorization',
      value: 'updateOrderAuthorization',
      description: 'Update order authorization',
      action: 'Update order authorization',
    },
    {
      name: 'Cancel Order',
      value: 'cancelOrder',
      description: 'Cancel an order',
      action: 'Cancel order',
    },
    {
      name: 'Release Authorization',
      value: 'releaseAuthorization',
      description: 'Release remaining authorization',
      action: 'Release authorization',
    },
  ],
  default: 'createOrder',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['captures'],
    },
  },
  options: [
    {
      name: 'Create Capture',
      value: 'createCapture',
      description: 'Capture payment for order',
      action: 'Create capture',
    },
    {
      name: 'Get Captures',
      value: 'getCaptures',
      description: 'List all captures for order',
      action: 'Get captures',
    },
    {
      name: 'Get Capture',
      value: 'getCapture',
      description: 'Get specific capture details',
      action: 'Get capture',
    },
    {
      name: 'Update Capture Shipping',
      value: 'updateCaptureShipping',
      description: 'Update shipping info for capture',
      action: 'Update capture shipping',
    },
    {
      name: 'Trigger Send Out',
      value: 'triggerSendOut',
      description: 'Trigger customer communication',
      action: 'Trigger send out',
    },
  ],
  default: 'createCapture',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['refunds'],
    },
  },
  options: [
    {
      name: 'Create Refund',
      value: 'createRefund',
      description: 'Create refund for order',
      action: 'Create refund for order',
    },
    {
      name: 'Get Refunds',
      value: 'getRefunds',
      description: 'List all refunds for order',
      action: 'Get refunds for order',
    },
    {
      name: 'Get Refund',
      value: 'getRefund',
      description: 'Get specific refund details',
      action: 'Get specific refund details',
    },
  ],
  default: 'createRefund',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['settlements'],
    },
  },
  options: [
    {
      name: 'Get Settlement Reports',
      value: 'getSettlementReports',
      description: 'List settlement reports',
      action: 'Get settlement reports',
    },
    {
      name: 'Get Settlement Report',
      value: 'getSettlementReport',
      description: 'Get specific settlement report',
      action: 'Get settlement report',
    },
    {
      name: 'Get Settlement PDF',
      value: 'getSettlementPdf',
      description: 'Download settlement report as PDF',
      action: 'Get settlement PDF',
    },
    {
      name: 'Get Transactions',
      value: 'getTransactions',
      description: 'List settlement transactions',
      action: 'Get transactions',
    },
    {
      name: 'Get Payouts',
      value: 'getPayouts',
      description: 'List payouts',
      action: 'Get payouts',
    },
  ],
  default: 'getSettlementReports',
},
      // Parameter definitions
{
  displayName: 'Purchase Country',
  name: 'purchaseCountry',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['paymentSessions'],
      operation: ['createSession'],
    },
  },
  default: '',
  description: 'The purchase country (ISO 3166 alpha-2)',
},
{
  displayName: 'Purchase Currency',
  name: 'purchaseCurrency',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['paymentSessions'],
      operation: ['createSession'],
    },
  },
  default: '',
  description: 'The purchase currency (ISO 4217)',
},
{
  displayName: 'Locale',
  name: 'locale',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['paymentSessions'],
      operation: ['createSession'],
    },
  },
  default: '',
  description: 'The locale for the checkout (e.g., en-US)',
},
{
  displayName: 'Order Amount',
  name: 'orderAmount',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['paymentSessions'],
      operation: ['createSession', 'updateSession'],
    },
  },
  default: 0,
  description: 'Total amount of the order including tax and discounts',
},
{
  displayName: 'Order Lines',
  name: 'orderLines',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['paymentSessions'],
      operation: ['createSession', 'updateSession'],
    },
  },
  default: '[]',
  description: 'Array of order line objects containing product information',
},
{
  displayName: 'Session ID',
  name: 'sessionId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['paymentSessions'],
      operation: ['getSession', 'updateSession'],
    },
  },
  default: '',
  description: 'The payment session ID',
},
{
  displayName: 'Use Idempotency Key',
  name: 'useIdempotencyKey',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['paymentSessions'],
      operation: ['createSession', 'updateSession'],
    },
  },
  default: false,
  description: 'Whether to use an idempotency key to prevent duplicate requests',
},
{
  displayName: 'Idempotency Key',
  name: 'idempotencyKey',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['paymentSessions'],
      operation: ['createSession', 'updateSession'],
      useIdempotencyKey: [true],
    },
  },
  default: '',
  description: 'Unique key to prevent duplicate requests',
},
{
  displayName: 'Authorization Token',
  name: 'authorizationToken',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['orders'],
      operation: ['createOrder'],
    },
  },
  default: '',
  description: 'The authorization token from the payment session',
},
{
  displayName: 'Purchase Country',
  name: 'purchaseCountry',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['orders'],
      operation: ['createOrder'],
    },
  },
  default: '',
  description: 'ISO 3166 alpha-2 purchase country code',
},
{
  displayName: 'Purchase Currency',
  name: 'purchaseCurrency',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['orders'],
      operation: ['createOrder'],
    },
  },
  default: '',
  description: 'ISO 4217 purchase currency code',
},
{
  displayName: 'Order Amount',
  name: 'orderAmount',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['orders'],
      operation: ['createOrder', 'updateOrderAuthorization'],
    },
  },
  default: 0,
  description: 'Total amount of the order in minor units',
},
{
  displayName: 'Order Lines',
  name: 'orderLines',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['orders'],
      operation: ['createOrder', 'updateOrderAuthorization'],
    },
  },
  default: '[]',
  description: 'Array of order line items',
},
{
  displayName: 'Order ID',
  name: 'orderId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['orders'],
      operation: ['getOrder', 'updateOrderAuthorization', 'cancelOrder', 'releaseAuthorization'],
    },
  },
  default: '',
  description: 'The unique identifier of the order',
},
{
  displayName: 'Order ID',
  name: 'orderId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['captures'],
      operation: ['createCapture', 'getCaptures', 'getCapture', 'updateCaptureShipping', 'triggerSendOut'],
    },
  },
  default: '',
  description: 'The order ID',
},
{
  displayName: 'Captured Amount',
  name: 'capturedAmount',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['captures'],
      operation: ['createCapture'],
    },
  },
  default: 0,
  description: 'Amount to capture in minor units (e.g., cents)',
},
{
  displayName: 'Description',
  name: 'description',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['captures'],
      operation: ['createCapture'],
    },
  },
  default: '',
  description: 'Description of the capture',
},
{
  displayName: 'Order Lines',
  name: 'orderLines',
  type: 'json',
  displayOptions: {
    show: {
      resource: ['captures'],
      operation: ['createCapture'],
    },
  },
  default: '[]',
  description: 'Order lines to capture as JSON array',
},
{
  displayName: 'Capture ID',
  name: 'captureId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['captures'],
      operation: ['getCapture', 'updateCaptureShipping', 'triggerSendOut'],
    },
  },
  default: '',
  description: 'The capture ID',
},
{
  displayName: 'Shipping Info',
  name: 'shippingInfo',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['captures'],
      operation: ['updateCaptureShipping'],
    },
  },
  default: '{}',
  description: 'Shipping information as JSON object',
},
{
  displayName: 'Order ID',
  name: 'orderId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['refunds'],
      operation: ['createRefund', 'getRefunds', 'getRefund'],
    },
  },
  default: '',
  description: 'The ID of the order',
},
{
  displayName: 'Refund ID',
  name: 'refundId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['refunds'],
      operation: ['getRefund'],
    },
  },
  default: '',
  description: 'The ID of the refund',
},
{
  displayName: 'Refunded Amount',
  name: 'refundedAmount',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['refunds'],
      operation: ['createRefund'],
    },
  },
  default: 0,
  description: 'The amount to refund in minor units (e.g., cents)',
},
{
  displayName: 'Description',
  name: 'description',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['refunds'],
      operation: ['createRefund'],
    },
  },
  default: '',
  description: 'Description of the refund',
},
{
  displayName: 'Order Lines',
  name: 'orderLines',
  type: 'json',
  required: false,
  displayOptions: {
    show: {
      resource: ['refunds'],
      operation: ['createRefund'],
    },
  },
  default: '[]',
  description: 'Array of order line objects to refund. JSON format.',
},
{
  displayName: 'Start Date',
  name: 'startDate',
  type: 'dateTime',
  required: false,
  displayOptions: {
    show: {
      resource: ['settlements'],
      operation: ['getSettlementReports', 'getTransactions', 'getPayouts'],
    },
  },
  default: '',
  description: 'Start date for the settlement reports (YYYY-MM-DD format)',
},
{
  displayName: 'End Date',
  name: 'endDate',
  type: 'dateTime',
  required: false,
  displayOptions: {
    show: {
      resource: ['settlements'],
      operation: ['getSettlementReports', 'getTransactions', 'getPayouts'],
    },
  },
  default: '',
  description: 'End date for the settlement reports (YYYY-MM-DD format)',
},
{
  displayName: 'Currency Code',
  name: 'currencyCode',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['settlements'],
      operation: ['getSettlementReports', 'getTransactions', 'getPayouts'],
    },
  },
  default: '',
  placeholder: 'USD',
  description: 'Filter by currency code (e.g., USD, EUR, SEK)',
},
{
  displayName: 'Settlement ID',
  name: 'settlementId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['settlements'],
      operation: ['getSettlementReport', 'getSettlementPdf'],
    },
  },
  default: '',
  description: 'The ID of the settlement report',
},
{
  displayName: 'Order ID',
  name: 'orderId',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['settlements'],
      operation: ['getTransactions'],
    },
  },
  default: '',
  description: 'Filter transactions by order ID',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'paymentSessions':
        return [await executePaymentSessionsOperations.call(this, items)];
      case 'orders':
        return [await executeOrdersOperations.call(this, items)];
      case 'captures':
        return [await executeCapturesOperations.call(this, items)];
      case 'refunds':
        return [await executeRefundsOperations.call(this, items)];
      case 'settlements':
        return [await executeSettlementsOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executePaymentSessionsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('klarnaApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'createSession': {
          const purchaseCountry = this.getNodeParameter('purchaseCountry', i) as string;
          const purchaseCurrency = this.getNodeParameter('purchaseCurrency', i) as string;
          const locale = this.getNodeParameter('locale', i) as string;
          const orderAmount = this.getNodeParameter('orderAmount', i) as number;
          const orderLines = this.getNodeParameter('orderLines', i) as any;
          const useIdempotencyKey = this.getNodeParameter('useIdempotencyKey', i) as boolean;
          
          const body: any = {
            purchase_country: purchaseCountry,
            purchase_currency: purchaseCurrency,
            locale: locale,
            order_amount: orderAmount,
            order_lines: typeof orderLines === 'string' ? JSON.parse(orderLines) : orderLines,
          };

          const headers: any = {
            'Authorization': `Basic ${Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64')}`,
            'Content-Type': 'application/json',
          };

          if (useIdempotencyKey) {
            const idempotencyKey = this.getNodeParameter('idempotencyKey', i) as string;
            headers['Klarna-Idempotency-Key'] = idempotencyKey;
          }

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/payments/v1/sessions`,
            headers: headers,
            json: true,
            body: body,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getSession': {
          const sessionId = this.getNodeParameter('sessionId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/payments/v1/sessions/${sessionId}`,
            headers: {
              'Authorization': `Basic ${Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64')}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateSession': {
          const sessionId = this.getNodeParameter('sessionId', i) as string;
          const orderAmount = this.getNodeParameter('orderAmount', i) as number;
          const orderLines = this.getNodeParameter('orderLines', i) as any;
          const useIdempotencyKey = this.getNodeParameter('useIdempotencyKey', i) as boolean;

          const body: any = {
            order_amount: orderAmount,
            order_lines: typeof orderLines === 'string' ? JSON.parse(orderLines) : orderLines,
          };

          const headers: any = {
            'Authorization': `Basic ${Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64')}`,
            'Content-Type': 'application/json',
          };

          if (useIdempotencyKey) {
            const idempotencyKey = this.getNodeParameter('idempotencyKey', i) as string;
            headers['Klarna-Idempotency-Key'] = idempotencyKey;
          }

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/payments/v1/sessions/${sessionId}`,
            headers: headers,
            json: true,
            body: body,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ 
          json: { error: error.message }, 
          pairedItem: { item: i } 
        });
      } else {
        throw new NodeApiError(this.getNode(), error);
      }
    }
  }

  return returnData;
}

async function executeOrdersOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('klarnaApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'createOrder': {
          const authorizationToken = this.getNodeParameter('authorizationToken', i) as string;
          const purchaseCountry = this.getNodeParameter('purchaseCountry', i) as string;
          const purchaseCurrency = this.getNodeParameter('purchaseCurrency', i) as string;
          const orderAmount = this.getNodeParameter('orderAmount', i) as number;
          const orderLines = this.getNodeParameter('orderLines', i) as any;

          const body: any = {
            purchase_country: purchaseCountry,
            purchase_currency: purchaseCurrency,
            order_amount: orderAmount,
            order_lines: typeof orderLines === 'string' ? JSON.parse(orderLines) : orderLines,
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/payments/v1/authorizations/${authorizationToken}/order`,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Basic ${Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64')}`,
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getOrder': {
          const orderId = this.getNodeParameter('orderId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/ordermanagement/v1/orders/${orderId}`,
            headers: {
              Authorization: `Basic ${Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64')}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateOrderAuthorization': {
          const orderId = this.getNodeParameter('orderId', i) as string;
          const orderAmount = this.getNodeParameter('orderAmount', i) as number;
          const orderLines = this.getNodeParameter('orderLines', i) as any;

          const body: any = {
            order_amount: orderAmount,
            order_lines: typeof orderLines === 'string' ? JSON.parse(orderLines) : orderLines,
          };

          const options: any = {
            method: 'PATCH',
            url: `${credentials.baseUrl}/ordermanagement/v1/orders/${orderId}/authorization`,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Basic ${Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64')}`,
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'cancelOrder': {
          const orderId = this.getNodeParameter('orderId', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/ordermanagement/v1/orders/${orderId}/cancel`,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Basic ${Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64')}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'releaseAuthorization': {
          const orderId = this.getNodeParameter('orderId', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/ordermanagement/v1/orders/${orderId}/release-remaining-authorization`,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Basic ${Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64')}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ 
          json: { error: error.message }, 
          pairedItem: { item: i } 
        });
      } else {
        throw new NodeApiError(this.getNode(), error);
      }
    }
  }

  return returnData;
}

async function executeCapturesOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('klarnaApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'createCapture': {
          const orderId = this.getNodeParameter('orderId', i) as string;
          const capturedAmount = this.getNodeParameter('capturedAmount', i) as number;
          const description = this.getNodeParameter('description', i) as string;
          const orderLines = this.getNodeParameter('orderLines', i) as string;

          const body: any = {
            captured_amount: capturedAmount,
          };

          if (description) {
            body.description = description;
          }

          if (orderLines) {
            try {
              body.order_lines = JSON.parse(orderLines);
            } catch (parseError: any) {
              throw new NodeOperationError(this.getNode(), `Invalid JSON in order_lines: ${parseError.message}`);
            }
          }

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/ordermanagement/v1/orders/${orderId}/captures`,
            headers: {
              'Authorization': `Basic ${Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64')}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getCaptures': {
          const orderId = this.getNodeParameter('orderId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/ordermanagement/v1/orders/${orderId}/captures`,
            headers: {
              'Authorization': `Basic ${Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64')}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getCapture': {
          const orderId = this.getNodeParameter('orderId', i) as string;
          const captureId = this.getNodeParameter('captureId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/ordermanagement/v1/orders/${orderId}/captures/${captureId}`,
            headers: {
              'Authorization': `Basic ${Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64')}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateCaptureShipping': {
          const orderId = this.getNodeParameter('orderId', i) as string;
          const captureId = this.getNodeParameter('captureId', i) as string;
          const shippingInfo = this.getNodeParameter('shippingInfo', i) as string;

          let parsedShippingInfo: any;
          try {
            parsedShippingInfo = JSON.parse(shippingInfo);
          } catch (parseError: any) {
            throw new NodeOperationError(this.getNode(), `Invalid JSON in shipping_info: ${parseError.message}`);
          }

          const options: any = {
            method: 'PATCH',
            url: `${credentials.baseUrl}/ordermanagement/v1/orders/${orderId}/captures/${captureId}/shipping-info`,
            headers: {
              'Authorization': `Basic ${Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64')}`,
              'Content-Type': 'application/json',
            },
            body: parsedShippingInfo,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'triggerSendOut': {
          const orderId = this.getNodeParameter('orderId', i) as string;
          const captureId = this.getNodeParameter('captureId', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/ordermanagement/v1/orders/${orderId}/captures/${captureId}/trigger-send-out`,
            headers: {
              'Authorization': `Basic ${Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64')}`,
              'Content-Type': 'application/json',
            },
            body: {},
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        if (error.cause?.response?.status) {
          throw new NodeApiError(this.getNode(), error);
        }
        throw new NodeOperationError(this.getNode(), error.message);
      }
    }
  }

  return returnData;
}

async function executeRefundsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('klarnaApi') as any;

  const baseUrl = credentials.baseUrl || 'https://api.klarna.com';

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'createRefund': {
          const orderId = this.getNodeParameter('orderId', i) as string;
          const refundedAmount = this.getNodeParameter('refundedAmount', i) as number;
          const description = this.getNodeParameter('description', i) as string;
          const orderLinesParam = this.getNodeParameter('orderLines', i) as string;
          
          let orderLines: any[] = [];
          if (orderLinesParam && orderLinesParam.trim() !== '[]' && orderLinesParam.trim() !== '') {
            try {
              orderLines = JSON.parse(orderLinesParam);
            } catch (parseError: any) {
              throw new NodeOperationError(this.getNode(), `Invalid JSON format for order lines: ${parseError.message}`);
            }
          }

          const body: any = {
            refunded_amount: refundedAmount,
          };

          if (description) {
            body.description = description;
          }

          if (orderLines.length > 0) {
            body.order_lines = orderLines;
          }

          const options: any = {
            method: 'POST',
            url: `${baseUrl}/ordermanagement/v1/orders/${orderId}/refunds`,
            headers: {
              'Authorization': `Basic ${Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64')}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getRefunds': {
          const orderId = this.getNodeParameter('orderId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${baseUrl}/ordermanagement/v1/orders/${orderId}/refunds`,
            headers: {
              'Authorization': `Basic ${Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64')}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getRefund': {
          const orderId = this.getNodeParameter('orderId', i) as string;
          const refundId = this.getNodeParameter('refundId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${baseUrl}/ordermanagement/v1/orders/${orderId}/refunds/${refundId}`,
            headers: {
              'Authorization': `Basic ${Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64')}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ 
          json: { error: error.message }, 
          pairedItem: { item: i } 
        });
      } else {
        if (error.httpCode) {
          throw new NodeApiError(this.getNode(), error);
        } else {
          throw new NodeOperationError(this.getNode(), error.message);
        }
      }
    }
  }

  return returnData;
}

async function executeSettlementsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('klarnaApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      const baseUrl = credentials.baseUrl || 'https://api.klarna.com';
      const auth = Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64');
      
      const baseOptions: any = {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
        json: true,
      };

      switch (operation) {
        case 'getSettlementReports': {
          const params: any = {};
          
          const startDate = this.getNodeParameter('startDate', i) as string;
          if (startDate) {
            params.start_date = new Date(startDate).toISOString().split('T')[0];
          }
          
          const endDate = this.getNodeParameter('endDate', i) as string;
          if (endDate) {
            params.end_date = new Date(endDate).toISOString().split('T')[0];
          }
          
          const currencyCode = this.getNodeParameter('currencyCode', i) as string;
          if (currencyCode) {
            params.currency_code = currencyCode;
          }

          const queryString = Object.keys(params).length > 0 
            ? '?' + new URLSearchParams(params).toString() 
            : '';

          const options: any = {
            ...baseOptions,
            method: 'GET',
            url: `${baseUrl}/settlements/v1/reports${queryString}`,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getSettlementReport': {
          const settlementId = this.getNodeParameter('settlementId', i) as string;
          
          const options: any = {
            ...baseOptions,
            method: 'GET',
            url: `${baseUrl}/settlements/v1/reports/${settlementId}`,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getSettlementPdf': {
          const settlementId = this.getNodeParameter('settlementId', i) as string;
          
          const options: any = {
            ...baseOptions,
            method: 'GET',
            url: `${baseUrl}/settlements/v1/reports/${settlementId}.pdf`,
            headers: {
              'Authorization': `Basic ${auth}`,
              'Accept': 'application/pdf',
            },
            json: false,
            encoding: null,
          };

          const pdfBuffer = await this.helpers.httpRequest(options) as any;
          result = {
            settlementId,
            pdf: pdfBuffer.toString('base64'),
            contentType: 'application/pdf',
          };
          break;
        }

        case 'getTransactions': {
          const params: any = {};
          
          const startDate = this.getNodeParameter('startDate', i) as string;
          if (startDate) {
            params.start_date = new Date(startDate).toISOString().split('T')[0];
          }
          
          const endDate = this.getNodeParameter('endDate', i) as string;
          if (endDate) {
            params.end_date = new Date(endDate).toISOString().split('T')[0];
          }
          
          const orderId = this.getNodeParameter('orderId', i) as string;
          if (orderId) {
            params.order_id = orderId;
          }
          
          const currencyCode = this.getNodeParameter('currencyCode', i) as string;
          if (currencyCode) {
            params.currency_code = currencyCode;
          }

          const queryString = Object.keys(params).length > 0 
            ? '?' + new URLSearchParams(params).toString() 
            : '';

          const options: any = {
            ...baseOptions,
            method: 'GET',
            url: `${baseUrl}/settlements/v1/transactions${queryString}`,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getPayouts': {
          const params: any = {};
          
          const startDate = this.getNodeParameter('startDate', i) as string;
          if (startDate) {
            params.start_date = new Date(startDate).toISOString().split('T')[0];
          }
          
          const endDate = this.getNodeParameter('endDate', i) as string;
          if (endDate) {
            params.end_date = new Date(endDate).toISOString().split('T')[0];
          }
          
          const currencyCode = this.getNodeParameter('currencyCode', i) as string;
          if (currencyCode) {
            params.currency_code = currencyCode;
          }

          const queryString = Object.keys(params).length > 0 
            ? '?' + new URLSearchParams(params).toString() 
            : '';

          const options: any = {
            ...baseOptions,
            method: 'GET',
            url: `${baseUrl}/settlements/v1/payouts${queryString}`,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        if (error.httpCode) {
          throw new NodeApiError(this.getNode(), error);
        }
        throw new NodeOperationError(this.getNode(), error.message);
      }
    }
  }

  return returnData;
}
