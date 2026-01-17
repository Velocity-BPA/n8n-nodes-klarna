# Push to GitHub

```bash
# Extract and navigate
unzip n8n-nodes-klarna.zip
cd n8n-nodes-klarna

# Initialize and push
git init
git add .
git commit -m "Initial commit: n8n Klarna BNPL community node

Features:
- Payment Sessions: Create, get, update, authorize, cancel
- Orders: Get, acknowledge, cancel, release authorization
- Captures: Full/partial capture, shipping info, resend
- Refunds: Full/partial refund processing
- Hosted Payment Page: Sessions, email/SMS distribution
- Settlements: Payouts, transactions, summaries
- Disputes: List, accept, upload documents, submit response
- Customer Tokens: Saved payment methods, recurring charges
- Merchant Card Service: Virtual card generation, settlement
- Trigger: All Klarna webhook events
- Multi-region: EU, NA, OC support
- Environments: Playground and Live"

git remote add origin https://github.com/Velocity-BPA/n8n-nodes-klarna.git
git branch -M main
git push -u origin main
```
