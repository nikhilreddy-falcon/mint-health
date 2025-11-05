/**
 * Simulated Acumatica ERP REST API
 * Based on Contract-Based API from Integration Development Guide
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.API_PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Load data
let data = {};
const dataPath = path.join(__dirname, '../../data/acumatica-data.json');

function loadData() {
  if (fs.existsSync(dataPath)) {
    const rawData = fs.readFileSync(dataPath, 'utf8');
    data = JSON.parse(rawData);
    console.log('✓ Data loaded successfully');
    console.log(`  - ${data.customers?.length || 0} customers`);
    console.log(`  - ${data.salesOrders?.length || 0} sales orders`);
    console.log(`  - ${data.invoices?.length || 0} invoices`);
  } else {
    console.error('❌ Data file not found. Please run: npm run generate-data');
    process.exit(1);
  }
}

loadData();

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ============================================
// Authentication Endpoints (Simulated)
// ============================================

app.post('/entity/auth/login', (req, res) => {
  const { name, password, company } = req.body;

  // Simulate authentication
  res.json({
    access_token: 'simulated-token-' + Date.now(),
    token_type: 'Bearer',
    expires_in: 3600,
    refresh_token: 'simulated-refresh-token-' + Date.now()
  });
});

app.post('/entity/auth/logout', (req, res) => {
  res.json({ success: true });
});

// ============================================
// Customer Endpoints
// ============================================

app.get('/entity/Default/:version/Customer', (req, res) => {
  const { $top, $skip, $filter, $expand, $select } = req.query;

  let result = [...data.customers];

  // Apply filtering
  if ($filter) {
    // Simple filter implementation
    const filterMatch = $filter.match(/(\w+)\s+eq\s+'([^']+)'/);
    if (filterMatch) {
      const [, field, value] = filterMatch;
      result = result.filter(item => item[field] === value);
    }
  }

  // Apply pagination
  const skip = parseInt($skip) || 0;
  const top = parseInt($top) || 100;
  result = result.slice(skip, skip + top);

  res.json(result);
});

app.get('/entity/Default/:version/Customer/:id', (req, res) => {
  const customer = data.customers.find(c => c.CustomerID === req.params.id);
  if (customer) {
    res.json(customer);
  } else {
    res.status(404).json({ error: 'Customer not found' });
  }
});

app.put('/entity/Default/:version/Customer', (req, res) => {
  const newCustomer = req.body;
  newCustomer.rowNumber = data.customers.length + 1;
  newCustomer.CreatedDateTime = new Date().toISOString();
  newCustomer.LastModifiedDateTime = new Date().toISOString();
  data.customers.push(newCustomer);
  res.status(201).json(newCustomer);
});

// ============================================
// Sales Order Endpoints
// ============================================

app.get('/entity/Default/:version/SalesOrder', (req, res) => {
  const { $top, $skip, $filter, $expand } = req.query;

  let result = [...data.salesOrders];

  if ($filter) {
    const filterMatch = $filter.match(/(\w+)\s+eq\s+'([^']+)'/);
    if (filterMatch) {
      const [, field, value] = filterMatch;
      result = result.filter(item => item[field] === value);
    }
  }

  const skip = parseInt($skip) || 0;
  const top = parseInt($top) || 100;
  result = result.slice(skip, skip + top);

  res.json(result);
});

app.get('/entity/Default/:version/SalesOrder/:orderType/:orderNbr', (req, res) => {
  const order = data.salesOrders.find(
    o => o.OrderType === req.params.orderType && o.OrderNbr === req.params.orderNbr
  );
  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ error: 'Sales Order not found' });
  }
});

app.put('/entity/Default/:version/SalesOrder', (req, res) => {
  const newOrder = req.body;
  newOrder.CreatedDateTime = new Date().toISOString();
  newOrder.LastModifiedDateTime = new Date().toISOString();
  data.salesOrders.push(newOrder);
  res.status(201).json(newOrder);
});

// ============================================
// Invoice Endpoints
// ============================================

app.get('/entity/Default/:version/Invoice', (req, res) => {
  const { $top, $skip, $filter } = req.query;

  let result = [...data.invoices];

  if ($filter) {
    const filterMatch = $filter.match(/(\w+)\s+eq\s+'([^']+)'/);
    if (filterMatch) {
      const [, field, value] = filterMatch;
      result = result.filter(item => item[field] === value);
    }
  }

  const skip = parseInt($skip) || 0;
  const top = parseInt($top) || 100;
  result = result.slice(skip, skip + top);

  res.json(result);
});

app.get('/entity/Default/:version/Invoice/:type/:refNbr', (req, res) => {
  const invoice = data.invoices.find(
    i => i.Type === req.params.type && i.ReferenceNbr === req.params.refNbr
  );
  if (invoice) {
    res.json(invoice);
  } else {
    res.status(404).json({ error: 'Invoice not found' });
  }
});

// ============================================
// Payment Endpoints
// ============================================

app.get('/entity/Default/:version/Payment', (req, res) => {
  const { $top, $skip, $filter } = req.query;

  let result = [...data.payments];

  if ($filter) {
    const filterMatch = $filter.match(/(\w+)\s+eq\s+'([^']+)'/);
    if (filterMatch) {
      const [, field, value] = filterMatch;
      result = result.filter(item => item[field] === value);
    }
  }

  const skip = parseInt($skip) || 0;
  const top = parseInt($top) || 100;
  result = result.slice(skip, skip + top);

  res.json(result);
});

// ============================================
// Stock Item Endpoints
// ============================================

app.get('/entity/Default/:version/StockItem', (req, res) => {
  const { $top, $skip, $filter } = req.query;

  let result = [...data.stockItems];

  if ($filter) {
    const filterMatch = $filter.match(/(\w+)\s+eq\s+'([^']+)'/);
    if (filterMatch) {
      const [, field, value] = filterMatch;
      result = result.filter(item => item[field] === value);
    }
  }

  const skip = parseInt($skip) || 0;
  const top = parseInt($top) || 100;
  result = result.slice(skip, skip + top);

  res.json(result);
});

app.get('/entity/Default/:version/StockItem/:id', (req, res) => {
  const item = data.stockItems.find(i => i.InventoryID === req.params.id);
  if (item) {
    res.json(item);
  } else {
    res.status(404).json({ error: 'Stock Item not found' });
  }
});

// ============================================
// Vendor Endpoints
// ============================================

app.get('/entity/Default/:version/Vendor', (req, res) => {
  const { $top, $skip } = req.query;

  let result = [...data.vendors];

  const skip = parseInt($skip) || 0;
  const top = parseInt($top) || 100;
  result = result.slice(skip, skip + top);

  res.json(result);
});

// ============================================
// Purchase Order Endpoints
// ============================================

app.get('/entity/Default/:version/PurchaseOrder', (req, res) => {
  const { $top, $skip } = req.query;

  let result = [...data.purchaseOrders];

  const skip = parseInt($skip) || 0;
  const top = parseInt($top) || 100;
  result = result.slice(skip, skip + top);

  res.json(result);
});

// ============================================
// Opportunity Endpoints
// ============================================

app.get('/entity/Default/:version/Opportunity', (req, res) => {
  const { $top, $skip, $filter } = req.query;

  let result = [...data.opportunities];

  if ($filter) {
    const filterMatch = $filter.match(/(\w+)\s+eq\s+'([^']+)'/);
    if (filterMatch) {
      const [, field, value] = filterMatch;
      result = result.filter(item => item[field] === value);
    }
  }

  const skip = parseInt($skip) || 0;
  const top = parseInt($top) || 100;
  result = result.slice(skip, skip + top);

  res.json(result);
});

// ============================================
// Shipment Endpoints
// ============================================

app.get('/entity/Default/:version/Shipment', (req, res) => {
  const { $top, $skip } = req.query;

  let result = [...data.shipments];

  const skip = parseInt($skip) || 0;
  const top = parseInt($top) || 100;
  result = result.slice(skip, skip + top);

  res.json(result);
});

// ============================================
// Journal Transaction Endpoints
// ============================================

app.get('/entity/Default/:version/JournalTransaction', (req, res) => {
  const { $top, $skip } = req.query;

  let result = [...data.journalTransactions];

  const skip = parseInt($skip) || 0;
  const top = parseInt($top) || 100;
  result = result.slice(skip, skip + top);

  res.json(result);
});

// ============================================
// Generic Inquiry Endpoint (Simulated)
// ============================================

app.get('/entity/Default/:version/GenericInquiry/:inquiryName', (req, res) => {
  const { inquiryName } = req.params;

  // Simulate different generic inquiries
  switch (inquiryName) {
    case 'CustomerSalesSummary':
      res.json(calculateCustomerSalesSummary());
      break;
    case 'InventoryValuation':
      res.json(calculateInventoryValuation());
      break;
    default:
      res.status(404).json({ error: 'Generic Inquiry not found' });
  }
});

// Helper functions for generic inquiries
function calculateCustomerSalesSummary() {
  const summary = {};

  data.salesOrders.forEach(order => {
    if (!summary[order.CustomerID]) {
      summary[order.CustomerID] = {
        CustomerID: order.CustomerID,
        TotalOrders: 0,
        TotalAmount: 0
      };
    }
    if (order.Status === 'Completed') {
      summary[order.CustomerID].TotalOrders++;
      summary[order.CustomerID].TotalAmount += order.OrderTotal;
    }
  });

  return Object.values(summary);
}

function calculateInventoryValuation() {
  return data.stockItems.map(item => ({
    InventoryID: item.InventoryID,
    Description: item.Description,
    QtyOnHand: item.QtyOnHand,
    LastCost: item.LastCost,
    TotalValue: item.QtyOnHand * item.LastCost
  }));
}

// ============================================
// Health Check
// ============================================

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    dataLoaded: Object.keys(data).length > 0
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Acumatica ERP Simulated API',
    version: '1.0.0',
    endpoints: {
      customers: '/entity/Default/22.200.001/Customer',
      salesOrders: '/entity/Default/22.200.001/SalesOrder',
      invoices: '/entity/Default/22.200.001/Invoice',
      payments: '/entity/Default/22.200.001/Payment',
      stockItems: '/entity/Default/22.200.001/StockItem',
      vendors: '/entity/Default/22.200.001/Vendor',
      purchaseOrders: '/entity/Default/22.200.001/PurchaseOrder',
      opportunities: '/entity/Default/22.200.001/Opportunity',
      shipments: '/entity/Default/22.200.001/Shipment',
      journalTransactions: '/entity/Default/22.200.001/JournalTransaction'
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Acumatica ERP Simulated API running on port ${PORT}`);
  console.log(`📊 API Documentation: http://localhost:${PORT}`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/health\n`);
});

module.exports = app;
