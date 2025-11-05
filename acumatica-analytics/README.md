# Acumatica ERP Analytics Platform

A comprehensive analytics application built for Acumatica ERP customers, featuring real-time dashboards, predictive analytics, and business intelligence capabilities.

## 🎯 Overview

This application demonstrates what an analytics company can deliver to clients using Acumatica ERP. It includes:

- **Executive Dashboard** - High-level KPIs and business metrics
- **Financial Analytics** - Revenue, AR aging, profitability analysis
- **Sales Analytics** - Sales performance, pipeline, and opportunities
- **Customer Analytics** - RFM segmentation, lifetime value, churn risk
- **Inventory Analytics** - Stock levels, turnover, optimization
- **Cash Flow Forecast** - 30/60/90 day cash projections

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│         React Frontend (Port 3000)          │
│  - Interactive Dashboards                   │
│  - Real-time Visualizations (Recharts)     │
│  - Responsive Design                        │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│      Analytics API (Port 3002)              │
│  - KPI Calculations                         │
│  - RFM Segmentation                         │
│  - Predictive Analytics                     │
│  - Data Aggregation                         │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│   Simulated Acumatica API (Port 3001)       │
│  - Contract-Based REST API                  │
│  - OData-like Filtering                     │
│  - Acumatica Entity Metadata                │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│         Generated Dummy Data                │
│  - 150 Customers                            │
│  - 500 Sales Orders                         │
│  - 600 Invoices                             │
│  - 200 Stock Items                          │
│  - 300 Opportunities                        │
│  - And more...                              │
└─────────────────────────────────────────────┘
```

## 📊 Features

### 1. Executive Dashboard
- Total Revenue & Monthly Revenue
- Cash Collected & Outstanding AR
- Days Sales Outstanding (DSO)
- Inventory Value & Item Count
- Active Customers & Order Metrics
- Sales Pipeline Value
- Top Customers by Revenue

### 2. Financial Analytics
- Revenue Trend Analysis
- AR Aging Report (Current, 1-30, 31-60, 61-90, 90+ days)
- Gross Profit & Margin Calculation
- Revenue Growth Analysis

### 3. Sales Analytics
- Sales by Period (Daily/Weekly/Monthly/Yearly)
- Sales by Status Distribution
- Top Products by Revenue
- Sales Pipeline by Stage
- Opportunity Analysis

### 4. Customer Analytics
- **RFM Segmentation** (Recency, Frequency, Monetary)
  - Champions
  - Loyal Customers
  - New Customers
  - At Risk
  - Lost Customers
  - Potential Loyalists
- Customer Lifetime Value (CLV)
- Top Customers by Revenue
- Churn Risk Identification

### 5. Inventory Analytics
- Inventory Value by Class
- Low Stock Alerts
- Overstock Identification
- Dead Stock Analysis
- Inventory Turnover Ratio
- Days to Sell Calculation

### 6. Cash Flow Forecast
- 30/60/90/180 Day Projections
- Expected Inflows from AR
- Expected Outflows to Vendors
- Net Cash Flow Analysis
- Running Balance Projection

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Install root dependencies:**
```bash
cd acumatica-analytics
npm install
```

2. **Install client dependencies:**
```bash
cd client
npm install
cd ..
```

3. **Generate dummy data:**
```bash
npm run generate-data
```

This will create realistic dummy data matching Acumatica ERP metadata in `data/acumatica-data.json`.

4. **Start all services:**
```bash
npm start
```

This will start:
- Simulated Acumatica API on `http://localhost:3001`
- Analytics API on `http://localhost:3002`
- React Frontend on `http://localhost:3000`

### Alternative: Start Services Individually

```bash
# Terminal 1: Start Acumatica API
npm run start-api

# Terminal 2: Start Analytics API
npm run start-analytics

# Terminal 3: Start Frontend
npm run start-client
```

## 📁 Project Structure

```
acumatica-analytics/
├── src/
│   ├── models/
│   │   └── acumaticaEntities.js      # Entity models matching Acumatica metadata
│   ├── data-generation/
│   │   └── generateData.js           # Dummy data generator
│   ├── api/
│   │   └── server.js                 # Simulated Acumatica REST API
│   └── analytics/
│       ├── server.js                 # Analytics API server
│       └── analyticsEngine.js        # Core analytics calculations
├── client/
│   ├── public/
│   └── src/
│       ├── pages/
│       │   ├── Dashboard.js          # Executive dashboard
│       │   ├── FinancialAnalytics.js # Financial metrics
│       │   ├── SalesAnalytics.js     # Sales performance
│       │   ├── CustomerAnalytics.js  # Customer segmentation
│       │   ├── InventoryAnalytics.js # Inventory management
│       │   └── CashFlowForecast.js   # Cash flow projection
│       ├── App.js                    # Main application
│       └── App.css                   # Styling
├── data/
│   └── acumatica-data.json          # Generated data (created after setup)
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Acumatica API (Port 3001)

Based on Acumatica's Contract-Based REST API:

- `GET /entity/Default/22.200.001/Customer` - Get customers
- `GET /entity/Default/22.200.001/SalesOrder` - Get sales orders
- `GET /entity/Default/22.200.001/Invoice` - Get invoices
- `GET /entity/Default/22.200.001/Payment` - Get payments
- `GET /entity/Default/22.200.001/StockItem` - Get inventory items
- `GET /entity/Default/22.200.001/Vendor` - Get vendors
- `GET /entity/Default/22.200.001/Opportunity` - Get opportunities

Query parameters:
- `$top` - Limit results
- `$skip` - Skip results
- `$filter` - Filter results (e.g., `Status eq 'Active'`)

### Analytics API (Port 3002)

- `GET /api/analytics/kpis` - Get all KPIs
- `GET /api/analytics/financial` - Financial metrics
- `GET /api/analytics/sales?period=monthly` - Sales analytics
- `GET /api/analytics/customers` - Customer analytics
- `GET /api/analytics/customer-segmentation` - RFM analysis
- `GET /api/analytics/inventory` - Inventory metrics
- `GET /api/analytics/product-performance` - Product performance
- `GET /api/analytics/cashflow-forecast?days=90` - Cash flow forecast
- `GET /api/analytics/top-customers?limit=10` - Top customers
- `GET /api/analytics/ar-aging` - AR aging report
- `GET /api/analytics/sales-pipeline` - Opportunity pipeline
- `GET /api/analytics/inventory-turnover` - Inventory turnover

## 📈 Data Model

The application uses authentic Acumatica ERP entity structures from the Integration Development Guide:

### Customer
- CustomerID, CustomerName, Status
- CustomerClass, CreditLimit
- CurrentBalance, OverdueBalance
- MainContact, BillingAddress
- Terms, CreatedDateTime

### Sales Order
- OrderType, OrderNbr, CustomerID
- Date, RequestedOn, Status
- OrderTotal, TaxTotal, OrderQty
- Details (line items)
- ShipVia, Description

### Invoice
- Type, ReferenceNbr, CustomerID
- Date, DueDate, PostPeriod
- Status, Amount, Balance
- TaxTotal, Description

### Stock Item
- InventoryID, Description
- ItemStatus, ItemClass
- DefaultPrice, LastCost
- QtyOnHand, QtyAvailable
- ReorderPoint, MinQty, MaxQty

### Payment
- Type, ReferenceNbr, CustomerID
- PaymentDate, Status
- PaymentAmount, AppliedToDocuments
- PaymentMethod, CashAccount

### Opportunity
- OpportunityID, Subject, Status
- Stage, Amount, Probability
- EstimatedCloseDate
- BusinessAccountID, Owner

## 🎨 Customization

### Adding New Analytics

1. **Add calculation to analytics engine:**
```javascript
// src/analytics/analyticsEngine.js
function calculateNewMetric(data) {
  // Your calculation logic
  return result;
}
module.exports = { calculateNewMetric };
```

2. **Add API endpoint:**
```javascript
// src/analytics/server.js
app.get('/api/analytics/new-metric', (req, res) => {
  const result = calculateNewMetric(data);
  res.json(result);
});
```

3. **Create React component:**
```javascript
// client/src/pages/NewDashboard.js
// Fetch and display your analytics
```

### Modifying Data Generation

Edit `src/data-generation/generateData.js` to adjust:
- Number of records generated
- Date ranges
- Data distributions
- Entity relationships

## 🔧 Configuration

### Port Configuration

Set environment variables:
```bash
API_PORT=3001           # Acumatica API
ANALYTICS_PORT=3002     # Analytics API
# React app runs on 3000 by default
```

### Data Volume

Modify `CONFIG` in `src/data-generation/generateData.js`:
```javascript
const CONFIG = {
  customers: 150,
  vendors: 50,
  stockItems: 200,
  salesOrders: 500,
  // ... etc
};
```

## 📊 Technologies Used

### Backend
- **Express.js** - API servers
- **date-fns** - Date manipulation
- **faker** - Dummy data generation
- **lodash** - Utility functions

### Frontend
- **React** - UI framework
- **React Router** - Navigation
- **Recharts** - Data visualization
- **Axios** - HTTP client

## 🎯 Use Cases for Analytics Companies

This platform demonstrates deliverables for Acumatica ERP clients:

1. **Executive Reporting** - Real-time KPI dashboards
2. **Financial Analysis** - Revenue, profitability, cash flow
3. **Customer Intelligence** - Segmentation, CLV, churn prediction
4. **Sales Optimization** - Pipeline management, forecasting
5. **Inventory Management** - Turnover, dead stock, optimization
6. **Predictive Analytics** - Cash flow forecasting, demand planning

## 📝 Notes on Acumatica Integration

This application simulates Acumatica's API. For production:

1. Replace simulated API with real Acumatica endpoints
2. Implement OAuth 2.0 authentication
3. Handle API rate limits and pagination
4. Implement error handling and retry logic
5. Add data caching for performance
6. Use webhooks for real-time updates

### Real Acumatica API Example

```javascript
// Production configuration
const acumaticaConfig = {
  baseURL: 'https://your-instance.acumatica.com',
  version: '22.200.001',
  auth: {
    type: 'OAuth2',
    clientId: 'your-client-id',
    clientSecret: 'your-client-secret'
  }
};
```

## 🤝 Contributing

This is a demonstration project. To extend:
1. Add new analytics calculations
2. Create additional dashboards
3. Implement machine learning models
4. Add export functionality (PDF, Excel)
5. Build custom reports

## 📄 License

This is a demonstration project for educational purposes.

## 🙋 Support

For questions about:
- **Acumatica ERP**: Refer to [Acumatica Documentation](https://help.acumatica.com)
- **This Application**: Review code comments and architecture

## 🎉 Getting Started Checklist

- [ ] Install Node.js and npm
- [ ] Clone/download the project
- [ ] Run `npm install` in root directory
- [ ] Run `npm install` in client directory
- [ ] Generate dummy data with `npm run generate-data`
- [ ] Start all services with `npm start`
- [ ] Open browser to `http://localhost:3000`
- [ ] Explore the dashboards!

## 📸 Screenshots

After starting the application, you'll see:
- **Executive Dashboard** - Comprehensive KPI overview
- **Financial Analytics** - Revenue trends and AR aging
- **Sales Analytics** - Sales performance and pipeline
- **Customer Analytics** - RFM segmentation visualization
- **Inventory Analytics** - Stock optimization insights
- **Cash Flow Forecast** - Future cash position projections

---

**Built with data models from the Acumatica ERP Integration Development Guide**
