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
describe('PaymentSession Resource', () => {
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
			},
		};
	});

	describe('createSession operation', () => {
		it('should create a payment session successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createSession')
				.mockReturnValueOnce('US')
				.mockReturnValueOnce('USD')
				.mockReturnValueOnce('en-US')
				.mockReturnValueOnce(1000)
				.mockReturnValueOnce(100)
				.mockReturnValueOnce([{ name: 'Test Item', quantity: 1 }])
				.mockReturnValueOnce('');

			const mockResponse = { session_id: 'test-session-id', client_token: 'test-token' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const items = [{ json: {} }];
			const result = await executePaymentSessionOperations.call(mockExecuteFunctions, items);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					method: 'POST',
					url: 'https://api.klarna.com/payments/v1/sessions',
				})
			);
		});

		it('should handle errors when creating a payment session', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValue('createSession');
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

			const items = [{ json: {} }];
			const result = await executePaymentSessionOperations.call(mockExecuteFunctions, items);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual({ error: 'API Error' });
		});
	});

	describe('updateSession operation', () => {
		it('should update a payment session successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('updateSession')
				.mockReturnValueOnce('test-session-id')
				.mockReturnValueOnce('US')
				.mockReturnValueOnce('USD')
				.mockReturnValueOnce(1500)
				.mockReturnValueOnce([{ name: 'Updated Item', quantity: 1 }])
				.mockReturnValueOnce('');

			const mockResponse = { session_id: 'test-session-id', status: 'updated' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const items = [{ json: {} }];
			const result = await executePaymentSessionOperations.call(mockExecuteFunctions, items);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					method: 'POST',
					url: 'https://api.klarna.com/payments/v1/sessions/test-session-id',
				})
			);
		});
	});

	describe('getSession operation', () => {
		it('should retrieve a payment session successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getSession')
				.mockReturnValueOnce('test-session-id');

			const mockResponse = { session_id: 'test-session-id', status: 'complete' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const items = [{ json: {} }];
			const result = await executePaymentSessionOperations.call(mockExecuteFunctions, items);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					method: 'GET',
					url: 'https://api.klarna.com/payments/v1/sessions/test-session-id',
				})
			);
		});

		it('should handle errors when retrieving a payment session', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValue('getSession');
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Session not found'));

			const items = [{ json: {} }];
			const result = await executePaymentSessionOperations.call(mockExecuteFunctions, items);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual({ error: 'Session not found' });
		});
	});
});

describe('Order Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        username: 'test-username',
        password: 'test-password',
        baseUrl: 'https://api.klarna.com'
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

  describe('createOrder', () => {
    it('should create order successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createOrder')
        .mockReturnValueOnce('auth-token-123')
        .mockReturnValueOnce('US')
        .mockReturnValueOnce('USD')
        .mockReturnValueOnce(1000)
        .mockReturnValueOnce([{ name: 'Test Item', quantity: 1, unit_price: 1000 }])
        .mockReturnValueOnce('idempotency-123');

      const mockResponse = { order_id: 'order-123', status: 'AUTHORIZED' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: 'https://api.klarna.com/payments/v1/authorizations/auth-token-123/order',
        })
      );
    });

    it('should handle createOrder error', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createOrder')
        .mockReturnValueOnce('auth-token-123')
        .mockReturnValueOnce('US')
        .mockReturnValueOnce('USD')
        .mockReturnValueOnce(1000)
        .mockReturnValueOnce([{ name: 'Test Item' }])
        .mockReturnValueOnce('');

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('getOrder', () => {
    it('should get order successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getOrder')
        .mockReturnValueOnce('order-123');

      const mockResponse = { order_id: 'order-123', status: 'AUTHORIZED' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: 'https://api.klarna.com/ordermanagement/v1/orders/order-123',
        })
      );
    });
  });

  describe('cancelOrder', () => {
    it('should cancel order successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('cancelOrder')
        .mockReturnValueOnce('order-123')
        .mockReturnValueOnce('cancel-key-123');

      const mockResponse = { order_id: 'order-123', status: 'CANCELLED' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: 'https://api.klarna.com/ordermanagement/v1/orders/order-123/cancel',
        })
      );
    });
  });
});

describe('Capture Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        username: 'test-username',
        password: 'test-password',
        baseUrl: 'https://api.klarna.com'
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

  describe('createCapture operation', () => {
    it('should create a capture successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createCapture')
        .mockReturnValueOnce('order123')
        .mockReturnValueOnce(5000)
        .mockReturnValueOnce('Test capture')
        .mockReturnValueOnce('[]')
        .mockReturnValueOnce('idempotency-key-123');

      const mockResponse = { capture_id: 'capture123', status: 'captured' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeCaptureOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.klarna.com/ordermanagement/v1/orders/order123/captures',
        headers: {
          'Authorization': expect.stringContaining('Basic '),
          'Content-Type': 'application/json',
          'Idempotency-Key': 'idempotency-key-123',
        },
        body: {
          captured_amount: 5000,
          description: 'Test capture',
          order_lines: [],
        },
        json: true,
      });

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 },
      }]);
    });

    it('should handle createCapture errors', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createCapture')
        .mockReturnValueOnce('order123')
        .mockReturnValueOnce(5000)
        .mockReturnValueOnce('')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('');

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeCaptureOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: { error: 'API Error' },
        pairedItem: { item: 0 },
      }]);
    });
  });

  describe('getAllCaptures operation', () => {
    it('should get all captures successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAllCaptures')
        .mockReturnValueOnce('order123');

      const mockResponse = { captures: [{ capture_id: 'capture123' }] };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeCaptureOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.klarna.com/ordermanagement/v1/orders/order123/captures',
        headers: {
          'Authorization': expect.stringContaining('Basic '),
        },
        json: true,
      });

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 },
      }]);
    });
  });

  describe('getCapture operation', () => {
    it('should get a specific capture successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getCapture')
        .mockReturnValueOnce('order123')
        .mockReturnValueOnce('capture456');

      const mockResponse = { capture_id: 'capture456', status: 'captured' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeCaptureOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.klarna.com/ordermanagement/v1/orders/order123/captures/capture456',
        headers: {
          'Authorization': expect.stringContaining('Basic '),
        },
        json: true,
      });

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 },
      }]);
    });
  });

  describe('triggerSendOut operation', () => {
    it('should trigger send out successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('triggerSendOut')
        .mockReturnValueOnce('order123')
        .mockReturnValueOnce('capture456');

      const mockResponse = { success: true };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeCaptureOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'PATCH',
        url: 'https://api.klarna.com/ordermanagement/v1/orders/order123/captures/capture456/trigger-send-out',
        headers: {
          'Authorization': expect.stringContaining('Basic '),
          'Content-Type': 'application/json',
        },
        json: true,
      });

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 },
      }]);
    });
  });
});

describe('Refund Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				username: 'test-user',
				password: 'test-pass',
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
		it('should create a refund successfully', async () => {
			const mockResponse = { refund_id: 'ref_123', refunded_amount: 1000 };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createRefund')
				.mockReturnValueOnce('order_123')
				.mockReturnValueOnce(1000)
				.mockReturnValueOnce('Test refund')
				.mockReturnValueOnce('[]')
				.mockReturnValueOnce('');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeRefundOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.klarna.com/ordermanagement/v1/orders/order_123/refunds',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': expect.stringContaining('Basic '),
				},
				body: {
					refunded_amount: 1000,
					description: 'Test refund',
					order_lines: [],
				},
				json: true,
			});
			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});

		it('should handle errors when creating refund', async () => {
			const mockError = new Error('API Error');
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createRefund')
				.mockReturnValueOnce('order_123')
				.mockReturnValueOnce(1000)
				.mockReturnValueOnce('')
				.mockReturnValueOnce('[]')
				.mockReturnValueOnce('');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockError);
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeRefundOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
		});
	});

	describe('getAllRefunds', () => {
		it('should get all refunds successfully', async () => {
			const mockResponse = { refunds: [{ refund_id: 'ref_123' }] };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAllRefunds')
				.mockReturnValueOnce('order_123');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeRefundOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.klarna.com/ordermanagement/v1/orders/order_123/refunds',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': expect.stringContaining('Basic '),
				},
				json: true,
			});
			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('getRefund', () => {
		it('should get specific refund successfully', async () => {
			const mockResponse = { refund_id: 'ref_123', refunded_amount: 1000 };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getRefund')
				.mockReturnValueOnce('order_123')
				.mockReturnValueOnce('ref_123');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeRefundOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.klarna.com/ordermanagement/v1/orders/order_123/refunds/ref_123',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': expect.stringContaining('Basic '),
				},
				json: true,
			});
			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});
});

describe('Settlement Resource', () => {
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
			},
		};
	});

	describe('getAllSettlements', () => {
		it('should get all settlements successfully', async () => {
			const mockResponse = { settlements: [{ id: 'settlement_1' }] };
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getAllSettlements');
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('ref123');
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('order123');
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('2023-01-01');
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('2023-12-31');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeSettlementOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.klarna.com/settlements/v1/reports',
				auth: { username: 'test-username', password: 'test-password' },
				qs: {
					payment_reference: 'ref123',
					order_id: 'order123',
					start_date: '2023-01-01',
					end_date: '2023-12-31',
				},
				json: true,
			});
			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});

		it('should handle errors when getting all settlements', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getAllSettlements');
			mockExecuteFunctions.getNodeParameter.mockReturnValue('');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeSettlementOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
		});
	});

	describe('getSettlement', () => {
		it('should get a specific settlement successfully', async () => {
			const mockResponse = { id: 'settlement_123' };
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getSettlement');
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('settlement_123');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeSettlementOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.klarna.com/settlements/v1/reports/settlement_123',
				auth: { username: 'test-username', password: 'test-password' },
				json: true,
			});
			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('getSettlementPdf', () => {
		it('should get settlement PDF successfully', async () => {
			const mockPdfBuffer = Buffer.from('PDF content');
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getSettlementPdf');
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('settlement_123');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockPdfBuffer);

			const result = await executeSettlementOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.klarna.com/settlements/v1/reports/settlement_123.pdf',
				auth: { username: 'test-username', password: 'test-password' },
				encoding: null,
			});
			expect(result[0].json).toMatchObject({
				settlementId: 'settlement_123',
				contentType: 'application/pdf',
			});
		});
	});

	describe('getSettlementTransactions', () => {
		it('should get settlement transactions successfully', async () => {
			const mockResponse = { transactions: [{ id: 'txn_1' }] };
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getSettlementTransactions');
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('settlement_123');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeSettlementOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.klarna.com/settlements/v1/reports/settlement_123/transactions',
				auth: { username: 'test-username', password: 'test-password' },
				json: true,
			});
			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});
});
});
