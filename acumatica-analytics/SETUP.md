# Quick Setup Guide

## 🚀 5-Minute Setup

### Step 1: Install Dependencies (2 minutes)

```bash
# In the root directory
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### Step 2: Generate Data (30 seconds)

```bash
npm run generate-data
```

This creates realistic Acumatica ERP data:
- 150 Customers
- 500 Sales Orders
- 600 Invoices
- 400 Payments
- 200 Stock Items
- 300 Opportunities
- And more...

### Step 3: Start the Application (30 seconds)

```bash
npm start
```

This starts all three services:
1. Acumatica API (http://localhost:3001)
2. Analytics API (http://localhost:3002)
3. React Frontend (http://localhost:3000)

### Step 4: Explore! (2 minutes)

Open your browser to `http://localhost:3000`

Navigate through:
1. **Executive Dashboard** - See KPIs and business metrics
2. **Financial Analytics** - View revenue trends and AR aging
3. **Sales Analytics** - Analyze sales performance
4. **Customer Analytics** - Explore RFM segmentation
5. **Inventory Analytics** - Check stock levels
6. **Cash Flow Forecast** - Project future cash position

---

## 📋 System Requirements

- **Node.js**: v14 or higher
- **npm**: v6 or higher
- **RAM**: 2GB minimum
- **Disk Space**: 500MB

---

## 🔧 Troubleshooting

### Port Already in Use

If you see "Port 3000 already in use":

```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Data Not Loading

1. Check if data file exists: `data/acumatica-data.json`
2. If missing, run: `npm run generate-data`
3. Restart the servers

### API Connection Errors

1. Verify all services are running:
   - http://localhost:3001/health (Acumatica API)
   - http://localhost:3002/health (Analytics API)
   - http://localhost:3000 (Frontend)

2. Check console for error messages
3. Restart with `npm start`

### Dependencies Issues

```bash
# Clean install
rm -rf node_modules client/node_modules
npm install
cd client && npm install
```

---

## 🎯 Testing Individual Components

### Test Acumatica API

```bash
npm run start-api

# In another terminal
curl http://localhost:3001/health
curl http://localhost:3001/entity/Default/22.200.001/Customer?$top=5
```

### Test Analytics API

```bash
npm run start-analytics

# In another terminal
curl http://localhost:3002/health
curl http://localhost:3002/api/analytics/kpis
```

### Test Frontend Only

```bash
cd client
npm start
```

---

## 📊 Sample API Calls

### Get Customers
```bash
curl "http://localhost:3001/entity/Default/22.200.001/Customer?$top=10"
```

### Get Sales Orders
```bash
curl "http://localhost:3001/entity/Default/22.200.001/SalesOrder?$filter=Status eq 'Completed'"
```

### Get Analytics KPIs
```bash
curl "http://localhost:3002/api/analytics/kpis"
```

### Get Customer Segmentation
```bash
curl "http://localhost:3002/api/analytics/customer-segmentation"
```

---

## 🎨 Customization

### Change Data Volume

Edit `src/data-generation/generateData.js`:

```javascript
const CONFIG = {
  customers: 150,      // Change to desired number
  salesOrders: 500,    // Increase for more data
  invoices: 600,
  // ... etc
};
```

Then regenerate: `npm run generate-data`

### Change Date Range

```javascript
const CONFIG = {
  startDate: new Date('2023-01-01'),
  endDate: new Date('2025-01-31')
};
```

### Add New Entities

1. Define model in `src/models/acumaticaEntities.js`
2. Add generator in `src/data-generation/generateData.js`
3. Add API endpoints in `src/api/server.js`
4. Create analytics in `src/analytics/analyticsEngine.js`

---

## 💡 Tips

1. **First Time Users**: Start with the Executive Dashboard to get an overview
2. **Data Exploration**: Use browser DevTools Network tab to see API calls
3. **Performance**: More data = slower initial load. Start with default amounts
4. **Learning**: Check the code comments for implementation details

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Data file created: `data/acumatica-data.json`
- [ ] Acumatica API responds: http://localhost:3001/health
- [ ] Analytics API responds: http://localhost:3002/health
- [ ] Frontend loads: http://localhost:3000
- [ ] Dashboard shows data (not loading spinner)
- [ ] All 6 menu items work
- [ ] Charts render correctly

---

## 🆘 Still Having Issues?

1. Check Node.js version: `node --version` (should be v14+)
2. Check npm version: `npm --version` (should be v6+)
3. Look for error messages in terminal
4. Check browser console for frontend errors
5. Ensure no other apps are using ports 3000-3002

---

## 🎉 You're Ready!

The application is now running. Explore the analytics capabilities and see what insights you can derive from the Acumatica ERP data!
