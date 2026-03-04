# n8n-nodes-klarna

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

This n8n community node provides comprehensive integration with Klarna's payment platform, offering 5 core resources for managing payment sessions, orders, captures, refunds, and settlements. Build automated workflows for e-commerce payment processing, order management, and financial reconciliation with Klarna's powerful payment APIs.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Klarna API](https://img.shields.io/badge/Klarna-API%20v1-ff6900)
![Payments](https://img.shields.io/badge/Payments-Ready-success)
![E-commerce](https://img.shields.io/badge/E--commerce-Integration-orange)

## Features

- **Payment Session Management** - Create and manage Klarna payment sessions for checkout flows
- **Order Processing** - Handle order creation, updates, and lifecycle management
- **Payment Capture** - Process partial and full payment captures for authorized orders
- **Refund Operations** - Execute full and partial refunds with detailed tracking
- **Settlement Tracking** - Monitor and retrieve settlement reports and transaction details
- **Real-time Webhooks** - Handle Klarna webhook events for automated workflow triggers
- **Multi-region Support** - Compatible with Klarna's global payment infrastructure
- **Comprehensive Error Handling** - Robust error management with detailed response codes

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
| API Username | Your Klarna API username (merchant ID) | ✅ |
| API Password | Your Klarna API password/token | ✅ |
| Environment | Select Playground (testing) or Production | ✅ |
| Region | API region (Europe, North America, Oceania) | ✅ |

## Resources & Operations

### 1. Payment Sessions

| Operation | Description |
|-----------|-------------|
| Create | Create a new payment session for checkout |
| Read | Retrieve payment session details |
| Update | Update existing payment session |
| Delete | Cancel/delete a payment session |

### 2. Orders

| Operation | Description |
|-----------|-------------|
| Create | Create a new order from payment session |
| Read | Retrieve order details and status |
| Update Customer Details | Update customer information for order |
| Update Merchant References | Update merchant reference data |
| Acknowledge | Acknowledge order receipt |
| Cancel | Cancel an existing order |
| Extend Authorization | Extend order authorization period |
| Update Authorization | Update authorization amount |
| Get All | List all orders with filters |

### 3. Captures

| Operation | Description |
|-----------|-------------|
| Create | Capture payment for an order (full or partial) |
| Read | Retrieve capture details |
| Update Billing Address | Update billing address for capture |
| Update Customer Details | Update customer information for capture |
| Add Shipping Info | Add shipping information to capture |
| Resend Confirmation | Resend capture confirmation to customer |
| Get All | List all captures for an order |

### 4. Refunds

| Operation | Description |
|-----------|-------------|
| Create | Create a refund for captured amount |
| Read | Retrieve refund details and status |
| Get All | List all refunds for an order |

### 5. Settlements

| Operation | Description |
|-----------|-------------|
| Get All | Retrieve settlement reports |
| Get Transactions | Get settlement transaction details |
| Get Summary | Get settlement summary by date range |
| Get CSV Report | Download settlement data as CSV |
| Get PDF Report | Download settlement report as PDF |

## Usage Examples

```javascript
// Create a payment session
{
  "purchase_country": "US",
  "purchase_currency": "USD",
  "locale": "en-US",
  "order_amount": 5000,
  "order_tax_amount": 500,
  "order_lines": [
    {
      "type": "physical",
      "reference": "19-402-USA",
      "name": "Red T-Shirt",
      "quantity": 1,
      "unit_price": 5000,
      "tax_rate": 1000,
      "total_amount": 5000,
      "total_discount_amount": 0,
      "total_tax_amount": 500
    }
  ]
}
```

```javascript
// Create an order from session
{
  "purchase_country": "US",
  "purchase_currency": "USD",
  "locale": "en-US",
  "order_amount": 5000,
  "order_tax_amount": 500,
  "merchant_urls": {
    "confirmation": "https://example.com/confirmation",
    "notification": "https://example.com/notification"
  }
}
```

```javascript
// Capture payment
{
  "captured_amount": 5000,
  "description": "Full capture for order #12345",
  "order_lines": [
    {
      "type": "physical",
      "reference": "19-402-USA",
      "name": "Red T-Shirt",
      "quantity": 1,
      "unit_price": 5000,
      "total_amount": 5000
    }
  ]
}
```

```javascript
// Process refund
{
  "refunded_amount": 2500,
  "description": "Partial refund - item returned",
  "order_lines": [
    {
      "type": "physical",
      "reference": "19-402-USA",
      "name": "Red T-Shirt",
      "quantity": 1,
      "unit_price": 2500,
      "total_amount": 2500
    }
  ]
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| 401 Unauthorized | Invalid API credentials | Verify username/password and environment settings |
| 400 Bad Request | Invalid request parameters | Check required fields and data format |
| 404 Not Found | Resource not found | Verify order ID, session ID, or other identifiers |
| 403 Forbidden | Insufficient permissions | Check API user permissions and merchant configuration |
| 409 Conflict | Resource state conflict | Verify order status before attempting operations |
| 422 Unprocessable Entity | Validation errors | Review field requirements and data constraints |

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
- **Klarna API Documentation**: [Klarna Developer Portal](https://developers.klarna.com/)
- **Klarna Community**: [Klarna Developer Community](https://developers.klarna.com/community/)