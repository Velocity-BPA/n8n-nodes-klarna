# n8n-nodes-klarna

> [Velocity BPA Licensing Notice]
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for **Klarna Buy Now Pay Later** payments. This package provides full access to Klarna's APIs including payment sessions, order management, captures, refunds, hosted payment pages, settlements, disputes, customer tokens, and merchant card services.

![Klarna](https://img.shields.io/badge/Klarna-FFB3C7?style=for-the-badge&logo=klarna&logoColor=black)
![n8n](https://img.shields.io/badge/n8n-EA4B71?style=for-the-badge&logo=n8n&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/license-BSL--1.1-blue?style=for-the-badge)

## Features

- **Payment Sessions** - Create, update, and authorize payment sessions
- **Order Management** - Full order lifecycle: get, acknowledge, cancel, release authorization
- **Captures** - Full and partial captures with shipping info tracking
- **Refunds** - Full and partial refund processing
- **Hosted Payment Page (HPP)** - Create sessions, distribute via email/SMS
- **Settlements** - Access payouts, transactions, and summaries
- **Disputes** - Manage disputes, upload documents, submit responses
- **Customer Tokens** - Saved payment methods and recurring charges
- **Merchant Card Service** - Virtual card generation and settlement
- **Webhook Trigger** - Handle all Klarna webhook events
- **Multi-Region Support** - Europe (EU), North America (NA), Oceania (OC)
- **Environment Support** - Playground (test) and Live environments

## Installation

### Community Nodes (Recommended)

1. Open your n8n instance
2. Go to **Settings** > **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-klarna`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-klarna
# Restart n8n
```

### Development Installation

```bash
# Clone the repository
git clone https://github.com/Velocity-BPA/n8n-nodes-klarna.git
cd n8n-nodes-klarna

# Install dependencies
npm install

# Build the project
npm run build

# Create symlink to n8n custom nodes directory
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-klarna

# Restart n8n
```

## Credentials Setup

| Field | Description |
|-------|-------------|
| **Environment** | Playground (test) or Live |
| **Region** | Europe (EU), North America (NA), or Oceania (OC) |
| **API Username** | Username from Klarna Merchant Portal (format: PK_XXXX) |
| **API Password** | Password from Klarna Merchant Portal |

### Obtaining Credentials

1. Log in to the [Klarna Merchant Portal](https://portal.klarna.com)
2. Navigate to **Settings** > **API Credentials**
3. Generate credentials for your desired environment

## Resources & Operations

### Payment Session

| Operation | Description |
|-----------|-------------|
| Create | Create a new payment session |
| Get | Get payment session details |
| Update | Update an existing session |
| Create Authorization | Authorize a payment |
| Cancel Authorization | Cancel an authorization |

### Order

| Operation | Description |
|-----------|-------------|
| Get | Get order details |
| Acknowledge | Acknowledge order receipt |
| Set Merchant References | Set reference IDs |
| Extend Authorization | Extend auth time |
| Update Customer Details | Update customer info |
| Update Billing Address | Update billing address |
| Update Shipping Address | Update shipping address |
| Cancel | Cancel an order |
| Release Authorization | Release remaining auth |

### Capture

| Operation | Description |
|-----------|-------------|
| Create | Capture a payment |
| Get | Get capture details |
| Add Shipping Info | Add tracking info |
| Trigger Resend | Resend confirmation |

### Refund

| Operation | Description |
|-----------|-------------|
| Create | Create a refund |
| Get | Get refund details |

### Hosted Payment Page

| Operation | Description |
|-----------|-------------|
| Create Session | Create HPP session |
| Get Session | Get HPP session |
| Distribute | Send via email/SMS |
| Disable | Disable session |

### Settlement

| Operation | Description |
|-----------|-------------|
| Get Payouts | List all payouts |
| Get Payout | Get specific payout |
| Get Payout Summary | Get summary |
| Get Transactions | List transactions |

### Dispute

| Operation | Description |
|-----------|-------------|
| Get All | List disputes |
| Get | Get dispute details |
| Accept | Accept a dispute |
| Add File | Upload document |
| Submit Response | Submit defense |

### Customer Token

| Operation | Description |
|-----------|-------------|
| Get | Get token details |
| Create Order | Charge saved method |

### Merchant Card

| Operation | Description |
|-----------|-------------|
| Create Session | Create VCC session |
| Get Session | Get session |
| Retrieve Card | Get virtual card |
| Settle | Settle session |

## Trigger Node

The **Klarna Trigger** node receives webhook events from Klarna.

### Supported Events

| Event | Description |
|-------|-------------|
| `order_authorized` | Payment authorized |
| `order_captured` | Payment captured |
| `order_refunded` | Refund processed |
| `order_cancelled` | Order cancelled |
| `order_expired` | Authorization expired |
| `checkout_complete` | Checkout completed |
| `customer_token_created` | Token saved |
| `dispute_created` | Dispute opened |
| `dispute_updated` | Dispute changed |
| `dispute_resolved` | Dispute closed |
| `payout_completed` | Payout completed |
| `hpp_session_completed` | HPP completed |

## Usage Examples

### Create a Payment Session

```javascript
Resource: Payment Session
Operation: Create
Purchase Country: US
Purchase Currency: USD
Locale: en-US
Order Amount: 10000  // $100.00 in minor units
Order Tax Amount: 0
Order Lines: [
  {
    "type": "physical",
    "name": "Product Name",
    "quantity": 1,
    "unit_price": 10000,
    "tax_rate": 0,
    "total_amount": 10000,
    "total_tax_amount": 0
  }
]
```

### Capture a Payment

```javascript
Resource: Capture
Operation: Create
Order ID: <your-order-id>
Captured Amount: 10000
```

### Create a Refund

```javascript
Resource: Refund
Operation: Create
Order ID: <your-order-id>
Refund Amount: 5000  // $50.00 partial refund
```

## Amount Formatting

Klarna uses **minor units** (cents) for all monetary values:

| Currency | Amount | Minor Units |
|----------|--------|-------------|
| USD | $100.00 | 10000 |
| EUR | €50.50 | 5050 |
| SEK | 999kr | 99900 |
| JPY | ¥1000 | 1000 (no decimals) |

## Order Lifecycle

```
Authorization → Acknowledge → Capture → (Optional: Refund)
                    ↓
              Cancel (before capture)
```

## Networks

| Environment | Region | Base URL |
|-------------|--------|----------|
| Playground | EU | `https://api.playground.klarna.com` |
| Playground | NA | `https://api-na.playground.klarna.com` |
| Playground | OC | `https://api-oc.playground.klarna.com` |
| Live | EU | `https://api.klarna.com` |
| Live | NA | `https://api-na.klarna.com` |
| Live | OC | `https://api-oc.klarna.com` |

## Error Handling

The node includes comprehensive error handling:

- Invalid credentials return clear authentication errors
- API errors include Klarna's correlation ID for support
- Network errors are properly caught and reported
- Input validation prevents malformed requests

## Security Best Practices

- Store credentials securely using n8n's credential system
- Use Playground environment for testing
- Verify webhook signatures in production
- Limit API credential scope where possible

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint
npm run lint

# Fix linting issues
npm run lint:fix
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
Use of this node within any SaaS, PaaS, hosted platform, managed service,
or paid automation offering requires a commercial license.

For licensing inquiries:
**licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-klarna/issues)
- **Documentation**: [Klarna API Docs](https://docs.klarna.com/)
- **Commercial Support**: licensing@velobpa.com

## Acknowledgments

- [Klarna](https://klarna.com) for their comprehensive API
- [n8n](https://n8n.io) for the workflow automation platform
