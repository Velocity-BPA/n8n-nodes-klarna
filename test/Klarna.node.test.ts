/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { Klarna } from '../nodes/Klarna/Klarna.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('Klarna Node', () => {
  let node: Klarna;

  beforeAll(() => {
    node = new Klarna();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Klarna');
      expect(node.description.name).toBe('klarna');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 5 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(5);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(5);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('PaymentSessions Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        username: 'test-username',
        password: 'test-password',
        baseUrl: 'https://api.klarna.com',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('createSession', () => {
    it('should create a payment session successfully', async () => {
      const mockResponse = {
        session_id: 'test-session-id',
        client_token: 'test-client-token',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'createSession';
          case 'purchaseCountry': return 'US';
          case 'purchaseCurrency': return 'USD';
          case 'locale': return 'en-US';
          case 'orderAmount': return 1000;
          case 'orderLines': return '[{"name":"Test Product","quantity":1,"unit_price":1000}]';
          case 'useIdempotencyKey': return false;
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executePaymentSessionsOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.klarna.com/payments/v1/sessions',
        headers: expect.objectContaining({
          'Authorization': expect.stringMatching(/^Basic /),
          'Content-Type': 'application/json',
        }),
        json: true,
        body: {
          purchase_country: 'US',
          purchase_currency: 'USD',
          locale: 'en-US',
          order_amount: 1000,
          order_lines: [{"name":"Test Product","quantity":1,"unit_price":1000}],
        },
      });
    });

    it('should handle errors when creating session', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'createSession';
          case 'purchaseCountry': return 'US';
          case 'purchaseCurrency': return 'USD';
          case 'locale': return 'en-US';
          case 'orderAmount': return 1000;
          case 'orderLines': return '[]';
          case 'useIdempotencyKey': return false;
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const items = [{ json: {} }];
      const result = await executePaymentSessionsOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('API Error');
    });
  });

  describe('getSession', () => {
    it('should retrieve a payment session successfully', async () => {
      const mockResponse = {
        session_id: 'test-session-id',
        status: 'complete',
        order_amount: 1000,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getSession';
          case 'sessionId': return 'test-session-id';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executePaymentSessionsOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.klarna.com/payments/v1/sessions/test-session-id',
        headers: expect.objectContaining({
          'Authorization': expect.stringMatching(/^Basic /),
          'Content-Type': 'application/json',
        }),
        json: true,
      });
    });
  });

  describe('updateSession', () => {
    it('should update a payment session successfully', async () => {
      const mockResponse = {
        session_id: 'test-session-id',
        order_amount: 2000,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'updateSession';
          case 'sessionId': return 'test-session-id';
          case 'orderAmount': return 2000;
          case 'orderLines': return '[{"name":"Updated Product","quantity":1,"unit_price":2000}]';
          case 'useIdempotencyKey': return true;
          case 'idempotencyKey': return 'test-idempotency-key';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executePaymentSessionsOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.klarna.com/payments/v1/sessions/test-session-id',
        headers: expect.objectContaining({
          'Authorization': expect.stringMatching(/^Basic /),
          'Content-Type': 'application/json',
          'Klarna-Idempotency-Key': 'test-idempotency-key',
        }),
        json: true,
        body: {
          order_amount: 2000,
          order_lines: [{"name":"Updated Product","quantity":1,"unit_price":2000}],
        },
      });
    });
  });
});

describe('Orders Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        username: 'test-username',
        password: 'test-password',
        baseUrl: 'https://api.klarna.com',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  it('should create order successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'createOrder';
        case 'authorizationToken': return 'auth-token-123';
        case 'purchaseCountry': return 'US';
        case 'purchaseCurrency': return 'USD';
        case 'orderAmount': return 10000;
        case 'orderLines': return '[{"name": "Test Product", "quantity": 1, "unit_price": 10000}]';
        default: return '';
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      order_id: 'order-123',
      status: 'CREATED',
    });

    const result = await executeOrdersOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({
      order_id: 'order-123',
      status: 'CREATED',
    });
  });

  it('should get order successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getOrder';
        case 'orderId': return 'order-123';
        default: return '';
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      order_id: 'order-123',
      status: 'AUTHORIZED',
      order_amount: 10000,
    });

    const result = await executeOrdersOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({
      order_id: 'order-123',
      status: 'AUTHORIZED',
      order_amount: 10000,
    });
  });

  it('should update order authorization successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'updateOrderAuthorization';
        case 'orderId': return 'order-123';
        case 'orderAmount': return 15000;
        case 'orderLines': return '[{"name": "Updated Product", "quantity": 1, "unit_price": 15000}]';
        default: return '';
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      order_id: 'order-123',
      status: 'UPDATED',
    });

    const result = await executeOrdersOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({
      order_id: 'order-123',
      status: 'UPDATED',
    });
  });

  it('should cancel order successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'cancelOrder';
        case 'orderId': return 'order-123';
        default: return '';
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      order_id: 'order-123',
      status: 'CANCELLED',
    });

    const result = await executeOrdersOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({
      order_id: 'order-123',
      status: 'CANCELLED',
    });
  });

  it('should release authorization successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'releaseAuthorization';
        case 'orderId': return 'order-123';
        default: return '';
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      order_id: 'order-123',
      status: 'AUTHORIZATION_RELEASED',
    });

    const result = await executeOrdersOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({
      order_id: 'order-123',
      status: 'AUTHORIZATION_RELEASED',
    });
  });

  it('should handle API errors', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getOrder';
        case 'orderId': return 'invalid-order';
        default: return '';
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Order not found'));

    await expect(executeOrdersOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow();
  });

  it('should continue on fail when configured', async () => {
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getOrder';
        case 'orderId': return 'invalid-order';
        default: return '';
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Order not found'));

    const result = await executeOrdersOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({
      error: 'Order not found',
    });
  });
});

describe('Captures Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        username: 'test-username',
        password: 'test-password',
        baseUrl: 'https://api.klarna.com',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('createCapture', () => {
    it('should create capture successfully', async () => {
      const mockResponse = {
        capture_id: 'cap_123',
        captured_amount: 10000,
        status: 'COMPLETED',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'createCapture';
          case 'orderId': return 'order_123';
          case 'capturedAmount': return 10000;
          case 'description': return 'Test capture';
          case 'orderLines': return '[]';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeCapturesOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.klarna.com/ordermanagement/v1/orders/order_123/captures',
        headers: {
          'Authorization': expect.stringContaining('Basic '),
          'Content-Type': 'application/json',
        },
        body: {
          captured_amount: 10000,
          description: 'Test capture',
          order_lines: [],
        },
        json: true,
      });
    });

    it('should handle invalid JSON in order lines', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'createCapture';
          case 'orderId': return 'order_123';
          case 'capturedAmount': return 10000;
          case 'orderLines': return 'invalid json';
          default: return '';
        }
      });

      await expect(executeCapturesOperations.call(mockExecuteFunctions, [{ json: {} }]))
        .rejects.toThrow('Invalid JSON in order_lines');
    });
  });

  describe('getCaptures', () => {
    it('should get captures successfully', async () => {
      const mockResponse = {
        captures: [
          { capture_id: 'cap_123', captured_amount: 10000 },
          { capture_id: 'cap_456', captured_amount: 5000 },
        ],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getCaptures';
          case 'orderId': return 'order_123';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeCapturesOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.klarna.com/ordermanagement/v1/orders/order_123/captures',
        headers: {
          'Authorization': expect.stringContaining('Basic '),
        },
        json: true,
      });
    });
  });

  describe('getCapture', () => {
    it('should get specific capture successfully', async () => {
      const mockResponse = {
        capture_id: 'cap_123',
        captured_amount: 10000,
        status: 'COMPLETED',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getCapture';
          case 'orderId': return 'order_123';
          case 'captureId': return 'cap_123';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeCapturesOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.klarna.com/ordermanagement/v1/orders/order_123/captures/cap_123',
        headers: {
          'Authorization': expect.stringContaining('Basic '),
        },
        json: true,
      });
    });
  });

  describe('updateCaptureShipping', () => {
    it('should update capture shipping info successfully', async () => {
      const mockResponse = {
        capture_id: 'cap_123',
        shipping_info: {
          tracking_number: 'TRK123',
        },
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'updateCaptureShipping';
          case 'orderId': return 'order_123';
          case 'captureId': return 'cap_123';
          case 'shippingInfo': return '{"tracking_number": "TRK123"}';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeCapturesOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'PATCH',
        url: 'https://api.klarna.com/ordermanagement/v1/orders/order_123/captures/cap_123/shipping-info',
        headers: {
          'Authorization': expect.stringContaining('Basic '),
          'Content-Type': 'application/json',
        },
        body: {
          tracking_number: 'TRK123',
        },
        json: true,
      });
    });

    it('should handle invalid JSON in shipping info', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'updateCaptureShipping';
          case 'orderId': return 'order_123';
          case 'captureId': return 'cap_123';
          case 'shippingInfo': return 'invalid json';
          default: return '';
        }
      });

      await expect(executeCapturesOperations.call(mockExecuteFunctions, [{ json: {} }]))
        .rejects.toThrow('Invalid JSON in shipping_info');
    });
  });

  describe('triggerSendOut', () => {
    it('should trigger send out successfully', async () => {
      const mockResponse = {
        capture_id: 'cap_123',
        status: 'TRIGGERED',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'triggerSendOut';
          case 'orderId': return 'order_123';
          case 'captureId': return 'cap_123';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeCapturesOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.klarna.com/ordermanagement/v1/orders/order_123/captures/cap_123/trigger-send-out',
        headers: {
          'Authorization': expect.stringContaining('Basic '),
          'Content-Type': 'application/json',
        },
        body: {},
        json: true,
      });
    });
  });

  describe('error handling', () => {
    it('should handle API errors', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getCapture';
          case 'orderId': return 'order_123';
          case 'captureId': return 'cap_123';
          default: return '';
        }
      });

      const apiError = new Error('API Error');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(apiError);

      await expect(executeCapturesOperations.call(mockExecuteFunctions, [{ json: {} }]))
        .rejects.toThrow('API Error');
    });

    it('should continue on fail when configured', async () => {
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getCapture';
          case 'orderId': return 'order_123';
          case 'captureId': return 'cap_123';
          default: return '';
        }
      });

      const apiError = new Error('API Error');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(apiError);

      const result = await executeCapturesOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });
});

describe('Refunds Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        username: 'test-username',
        password: 'test-password',
        baseUrl: 'https://api.klarna.com',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('createRefund', () => {
    it('should create refund successfully', async () => {
      const mockResponse = {
        refund_id: 'refund_123',
        refunded_amount: 5000,
        description: 'Test refund',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'createRefund';
          case 'orderId': return 'order_123';
          case 'refundedAmount': return 5000;
          case 'description': return 'Test refund';
          case 'orderLines': return '[]';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeRefundsOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.klarna.com/ordermanagement/v1/orders/order_123/refunds',
        headers: {
          'Authorization': expect.stringContaining('Basic'),
          'Content-Type': 'application/json',
        },
        body: {
          refunded_amount: 5000,
          description: 'Test refund',
        },
        json: true,
      });
    });

    it('should handle error when creating refund', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'createRefund';
          case 'orderId': return 'order_123';
          case 'refundedAmount': return 5000;
          case 'description': return 'Test refund';
          case 'orderLines': return '[]';
          default: return undefined;
        }
      });

      const error = new Error('API Error');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);

      const items = [{ json: {} }];

      await expect(executeRefundsOperations.call(mockExecuteFunctions, items))
        .rejects.toThrow('API Error');
    });
  });

  describe('getRefunds', () => {
    it('should get refunds successfully', async () => {
      const mockResponse = {
        refunds: [
          { refund_id: 'refund_123', refunded_amount: 5000 },
          { refund_id: 'refund_456', refunded_amount: 3000 },
        ],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getRefunds';
          case 'orderId': return 'order_123';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeRefundsOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.klarna.com/ordermanagement/v1/orders/order_123/refunds',
        headers: {
          'Authorization': expect.stringContaining('Basic'),
        },
        json: true,
      });
    });
  });

  describe('getRefund', () => {
    it('should get specific refund successfully', async () => {
      const mockResponse = {
        refund_id: 'refund_123',
        refunded_amount: 5000,
        description: 'Test refund',
        refunded_at: '2023-01-01T00:00:00Z',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getRefund';
          case 'orderId': return 'order_123';
          case 'refundId': return 'refund_123';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeRefundsOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.klarna.com/ordermanagement/v1/orders/order_123/refunds/refund_123',
        headers: {
          'Authorization': expect.stringContaining('Basic'),
        },
        json: true,
      });
    });
  });
});

describe('Settlements Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        username: 'test-username',
        password: 'test-password',
        baseUrl: 'https://api.klarna.com',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('getSettlementReports', () => {
    it('should get settlement reports successfully', async () => {
      const mockResponse = {
        settlement_reports: [
          {
            settlement_id: 'SETTLEMENT123',
            currency: 'USD',
            payout_date: '2023-01-15',
            total_amount: 1500000,
          },
        ],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getSettlementReports';
          case 'startDate': return '2023-01-01';
          case 'endDate': return '2023-01-31';
          case 'currencyCode': return 'USD';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeSettlementsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.klarna.com/settlements/v1/reports?start_date=2023-01-01&end_date=2023-01-31&currency_code=USD',
        headers: {
          'Authorization': expect.stringContaining('Basic '),
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    it('should handle errors when getting settlement reports', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getSettlementReports';
        return undefined;
      });

      const error = new Error('API Error');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);

      await expect(
        executeSettlementsOperations.call(mockExecuteFunctions, [{ json: {} }]),
      ).rejects.toThrow('API Error');
    });
  });

  describe('getSettlementReport', () => {
    it('should get specific settlement report successfully', async () => {
      const mockResponse = {
        settlement_id: 'SETTLEMENT123',
        currency: 'USD',
        payout_date: '2023-01-15',
        transactions: [],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getSettlementReport';
          case 'settlementId': return 'SETTLEMENT123';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeSettlementsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.klarna.com/settlements/v1/reports/SETTLEMENT123',
        headers: {
          'Authorization': expect.stringContaining('Basic '),
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });
  });

  describe('getTransactions', () => {
    it('should get settlement transactions successfully', async () => {
      const mockResponse = {
        transactions: [
          {
            transaction_id: 'TXN123',
            order_id: 'ORDER456',
            amount: 100000,
            currency: 'USD',
          },
        ],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getTransactions';
          case 'orderId': return 'ORDER456';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeSettlementsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.klarna.com/settlements/v1/transactions?order_id=ORDER456',
        headers: {
          'Authorization': expect.stringContaining('Basic '),
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });
  });

  describe('getPayouts', () => {
    it('should get payouts successfully', async () => {
      const mockResponse = {
        payouts: [
          {
            payout_id: 'PAYOUT123',
            currency: 'USD',
            amount: 5000000,
            payout_date: '2023-01-15',
          },
        ],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getPayouts';
          case 'currencyCode': return 'USD';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeSettlementsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });
});
});
