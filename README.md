# n8n-nodes-klarna

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

This n8n community node integrates with Klarna's payment platform, providing access to 5 core resources for managing payment sessions, orders, captures, refunds, and settlements. Automate your Klarna payment workflows with comprehensive support for the complete payment lifecycle from session creation to settlement reconciliation.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Klarna API](https://img.shields.io/badge/Klarna-API-FF69B4)
![Payments](https://img.shields.io/badge/Payments-Integration-green)
![E-commerce](https://img.shields.io/badge/E--commerce-Ready-orange)

## Features

- **Payment Session Management** - Create, update, and manage Klarna payment sessions for checkout flows
- **Order Processing** - Handle order creation, authorization, and lifecycle management
- **Capture Operations** - Process full and partial captures for authorized orders
- **Refund Handling** - Execute refunds with support for partial amounts and reason codes
- **Settlement Tracking** - Monitor and reconcile settlement reports and transaction data
- **Comprehensive Error Handling** - Built-in retry logic and detailed error messages
- **Flexible Authentication** - Secure API key-based authentication with environment support
- **Production Ready** - Full type safety and validation for reliable payment processing

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-klarna`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-klarna
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-klarna.git
cd n8n-nodes-klarna
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-klarna
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your Klarna API key from the merchant portal | Yes |
| Environment | Production or Sandbox environment | Yes |
| Region | API region (EU, NA, OC) | Yes |

## Resources & Operations

### 1. Payment Session

| Operation | Description |
|-----------|-------------|
| Create | Create a new payment session for checkout |
| Get | Retrieve payment session details |
| Update | Update payment session information |
| Delete | Cancel and remove a payment session |

### 2. Order

| Operation | Description |
|-----------|-------------|
| Create | Create a new order from payment session |
| Get | Retrieve order details and status |
| Update | Modify order information |
| Cancel | Cancel an existing order |
| Extend Authorization | Extend order authorization period |

### 3. Capture

| Operation | Description |
|-----------|-------------|
| Create | Capture funds for an authorized order |
| Get | Retrieve capture details |
| Get All | List all captures for an order |
| Update | Update capture information |

### 4. Refund

| Operation | Description |
|-----------|-------------|
| Create | Issue a refund for captured funds |
| Get | Retrieve refund details |
| Get All | List all refunds for an order |

### 5. Settlement

| Operation | Description |
|-----------|-------------|
| Get Report | Retrieve settlement report |
| Get Transactions | List settlement transactions |
| Get Payouts | Retrieve payout information |

## Usage Examples

```javascript
// Create a payment session
{
  "purchase_country": "US",
  "purchase_currency": "USD",
  "locale": "en-US",
  "order_amount": 2500,
  "order_tax_amount": 250,
  "order_lines": [
    {
      "name": "Gaming Laptop",
      "quantity": 1,
      "unit_price": 2500,
      "tax_rate": 1000,
      "total_amount": 2500,
      "total_tax_amount": 250
    }
  ]
}
```

```javascript
// Capture an order
{
  "order_id": "order_12345",
  "captured_amount": 2500,
  "description": "Full order capture",
  "order_lines": [
    {
      "name": "Gaming Laptop",
      "quantity": 1,
      "unit_price": 2500,
      "total_amount": 2500
    }
  ]
}
```

```javascript
// Process a refund
{
  "order_id": "order_12345",
  "refunded_amount": 500,
  "description": "Partial refund - shipping cost",
  "order_lines": [
    {
      "name": "Shipping refund",
      "quantity": 1,
      "unit_price": 500,
      "total_amount": 500
    }
  ]
}
```

```javascript
// Get settlement report
{
  "settlement_date": "2024-01-15",
  "currency": "USD",
  "payment_method": "card"
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| 401 Unauthorized | Invalid API credentials | Verify API key and environment settings |
| 404 Not Found | Resource does not exist | Check order ID, session ID, or resource identifier |
| 400 Bad Request | Invalid request parameters | Validate required fields and data formats |
| 409 Conflict | Resource state conflict | Check order status before performing operations |
| 422 Unprocessable Entity | Business logic validation failed | Review order amounts, currency, and line items |
| 429 Too Many Requests | Rate limit exceeded | Implement request throttling and retry logic |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-klarna/issues)
- **Klarna API Documentation**: [developers.klarna.com](https://developers.klarna.com)
- **Klarna Developer Community**: [Klarna Developer Portal](https://developers.klarna.com/community)