/**
 * Analytics Server
 * Processes Acumatica data and provides analytics endpoints
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const {
  calculateFinancialMetrics,
  calculateSalesAnalytics,
  calculateCustomerAnalytics,
  calculateInventoryAnalytics,
  calculateCashFlowForecast,
  calculateKPIs,
  calculateTrendAnalysis,
  calculateCustomerSegmentation,
  calculateProductPerformance
} = require('./analyticsEngine');

const {
  generateDemandForecast,
  generateTenderTracking,
  generatePurchaseRecommendations,
  getForecastingSummary
} = require('./forecastingEngine');

const {
  generateSupplierScorecards,
  getSupplierPerformanceSummary,
  getSupplierComparisonData,
  getSupplierRiskMatrix,
  getTopBottomPerformers,
  calculateSpendConcentration
} = require('./supplierScorecardEngine');

const {
  generateAdvancedForecasts,
  getAdvancedForecastingSummary
} = require('./advancedForecastingEngine');

const app = express();
// CHANGED PORT FROM 3002 TO 7006 (matches hardcoded client URLs!)
const PORT = process.env.ANALYTICS_PORT || 7006;

// Middleware
// ADDED CORS configuration for localhost and server IP
app.use(cors({
  origin: [
    'http://localhost:4000',           // Frontend on localhost
    'http://91.203.132.74:4000'        // Frontend on server
  ]
}));
app.use(bodyParser.json());

// Load data
let data = {};
const dataPath = path.join(__dirname, '../../data/acumatica-data.json');

function loadData() {
  if (fs.existsSync(dataPath)) {
    const rawData = fs.readFileSync(dataPath, 'utf8');
    data = JSON.parse(rawData);
    console.log('✓ Analytics data loaded successfully');
  } else {
    console.error('❌ Data file not found. Please run: npm run generate-data');
    process.exit(1);
  }
}

loadData();

// Logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ============================================
// Analytics Endpoints
// ============================================

// Executive Dashboard KPIs
app.get('/api/analytics/kpis', (req, res) => {
  try {
    const kpis = calculateKPIs(data);
    res.json(kpis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Financial Metrics
app.get('/api/analytics/financial', (req, res) => {
  try {
    const metrics = calculateFinancialMetrics(data);
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sales Analytics
app.get('/api/analytics/sales', (req, res) => {
  try {
    const { period } = req.query; // daily, weekly, monthly, yearly
    const analytics = calculateSalesAnalytics(data, period || 'monthly');
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Customer Analytics
app.get('/api/analytics/customers', (req, res) => {
  try {
    const analytics = calculateCustomerAnalytics(data);
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Customer Segmentation (RFM Analysis)
app.get('/api/analytics/customer-segmentation', (req, res) => {
  try {
    const segmentation = calculateCustomerSegmentation(data);
    res.json(segmentation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Inventory Analytics
app.get('/api/analytics/inventory', (req, res) => {
  try {
    const analytics = calculateInventoryAnalytics(data);
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Product Performance
app.get('/api/analytics/product-performance', (req, res) => {
  try {
    const performance = calculateProductPerformance(data);
    res.json(performance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cash Flow Forecast
app.get('/api/analytics/cashflow-forecast', (req, res) => {
  try {
    const { days } = req.query;
    const forecast = calculateCashFlowForecast(data, parseInt(days) || 90);
    res.json(forecast);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Trend Analysis
app.get('/api/analytics/trends', (req, res) => {
  try {
    const { metric, period } = req.query;
    const trends = calculateTrendAnalysis(data, metric, period);
    res.json(trends);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Top Customers by Revenue
app.get('/api/analytics/top-customers', (req, res) => {
  try {
    const { limit } = req.query;
    const customerRevenue = {};

    data.invoices.forEach(invoice => {
      if (invoice.Status === 'Closed' || invoice.Status === 'Open') {
        if (!customerRevenue[invoice.CustomerID]) {
          customerRevenue[invoice.CustomerID] = 0;
        }
        customerRevenue[invoice.CustomerID] += invoice.Amount;
      }
    });

    const topCustomers = Object.entries(customerRevenue)
      .map(([customerId, revenue]) => {
        const customer = data.customers.find(c => c.CustomerID === customerId);
        return {
          customerId,
          customerName: customer?.CustomerName || 'Unknown',
          revenue,
          orders: data.salesOrders.filter(o => o.CustomerID === customerId && o.Status === 'Completed').length
        };
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, parseInt(limit) || 10);

    res.json(topCustomers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// AR Aging Report
app.get('/api/analytics/ar-aging', (req, res) => {
  try {
    const today = new Date();
    const aging = {
      current: { count: 0, amount: 0 },
      days1_30: { count: 0, amount: 0 },
      days31_60: { count: 0, amount: 0 },
      days61_90: { count: 0, amount: 0 },
      days90Plus: { count: 0, amount: 0 }
    };

    data.invoices.forEach(invoice => {
      if (invoice.Status === 'Open' && invoice.Balance > 0) {
        const dueDate = new Date(invoice.DueDate);
        const daysOverdue = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));

        if (daysOverdue <= 0) {
          aging.current.count++;
          aging.current.amount += invoice.Balance;
        } else if (daysOverdue <= 30) {
          aging.days1_30.count++;
          aging.days1_30.amount += invoice.Balance;
        } else if (daysOverdue <= 60) {
          aging.days31_60.count++;
          aging.days31_60.amount += invoice.Balance;
        } else if (daysOverdue <= 90) {
          aging.days61_90.count++;
          aging.days61_90.amount += invoice.Balance;
        } else {
          aging.days90Plus.count++;
          aging.days90Plus.amount += invoice.Balance;
        }
      }
    });

    res.json(aging);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sales Pipeline (Opportunities)
app.get('/api/analytics/sales-pipeline', (req, res) => {
  try {
    const pipeline = {
      byStage: {},
      byStatus: {},
      totalValue: 0,
      weightedValue: 0,
      count: 0
    };

    data.opportunities.forEach(opp => {
      // By stage
      if (!pipeline.byStage[opp.Stage]) {
        pipeline.byStage[opp.Stage] = { count: 0, amount: 0, weightedAmount: 0 };
      }
      pipeline.byStage[opp.Stage].count++;
      pipeline.byStage[opp.Stage].amount += opp.Amount;
      pipeline.byStage[opp.Stage].weightedAmount += opp.Amount * (opp.Probability / 100);

      // By status
      if (!pipeline.byStatus[opp.Status]) {
        pipeline.byStatus[opp.Status] = { count: 0, amount: 0 };
      }
      pipeline.byStatus[opp.Status].count++;
      pipeline.byStatus[opp.Status].amount += opp.Amount;

      // Totals
      pipeline.totalValue += opp.Amount;
      pipeline.weightedValue += opp.Amount * (opp.Probability / 100);
      pipeline.count++;
    });

    res.json(pipeline);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Inventory Turnover
app.get('/api/analytics/inventory-turnover', (req, res) => {
  try {
    const turnoverData = data.stockItems.map(item => {
      // Calculate annual sales for this item
      let annualSales = 0;
      data.salesOrders.forEach(order => {
        if (order.Status === 'Completed') {
          order.Details.forEach(detail => {
            if (detail.InventoryID === item.InventoryID) {
              annualSales += detail.OrderQty;
            }
          });
        }
      });

      const avgInventory = item.QtyOnHand || 1;
      const turnoverRatio = avgInventory > 0 ? annualSales / avgInventory : 0;
      const daysToSell = turnoverRatio > 0 ? 365 / turnoverRatio : 999;

      return {
        inventoryID: item.InventoryID,
        description: item.Description,
        qtyOnHand: item.QtyOnHand,
        annualSales,
        turnoverRatio: parseFloat(turnoverRatio.toFixed(2)),
        daysToSell: Math.round(daysToSell),
        value: item.QtyOnHand * item.LastCost,
        status: item.ItemStatus
      };
    }).sort((a, b) => a.daysToSell - b.daysToSell);

    res.json(turnoverData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// Forecasting & Demand Planning Endpoints
// ============================================

// Demand Forecasting by Business Unit
app.get('/api/analytics/forecasting', (req, res) => {
  try {
    const { businessUnit } = req.query;
    const forecasts = generateDemandForecast(data.stockItems, data.salesOrders, businessUnit);
    const tenders = generateTenderTracking();
    const recommendations = generatePurchaseRecommendations(forecasts);
    const summary = getForecastingSummary(forecasts, tenders);

    res.json({
      summary,
      forecasts,
      recommendations
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Government Tender Tracking
app.get('/api/analytics/tenders', (req, res) => {
  try {
    const tenders = generateTenderTracking();
    res.json(tenders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Purchase Order Recommendations
app.get('/api/analytics/purchase-recommendations', (req, res) => {
  try {
    const { businessUnit } = req.query;
    const forecasts = generateDemandForecast(data.stockItems, data.salesOrders, businessUnit);
    const recommendations = generatePurchaseRecommendations(forecasts);
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Expiry Alerts
app.get('/api/analytics/expiry-alerts', (req, res) => {
  try {
    const { daysThreshold, businessUnit } = req.query;
    const threshold = parseInt(daysThreshold) || 60;
    const forecasts = generateDemandForecast(data.stockItems, data.salesOrders, businessUnit);

    const expiryAlerts = forecasts
      .filter(f => f.daysToExpiry <= threshold)
      .sort((a, b) => a.daysToExpiry - b.daysToExpiry);

    res.json({
      threshold,
      count: expiryAlerts.length,
      alerts: expiryAlerts
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// Advanced ML-Powered Forecasting Endpoints
// ============================================

// Advanced Forecasting with ML Algorithms
app.get('/api/analytics/advanced-forecasting', (req, res) => {
  try {
    const { businessUnit, topN, forecastHorizon } = req.query;

    const options = {
      businessUnit: businessUnit || 'PHARMA',
      topN: parseInt(topN) || 20,
      forecastHorizon: parseInt(forecastHorizon) || 3,
      seasonLength: 12,
      includeConfidenceIntervals: true
    };

    const forecasts = generateAdvancedForecasts(data.stockItems, data.salesOrders, options);
    const summary = getAdvancedForecastingSummary(forecasts);

    res.json({
      summary,
      forecasts,
      options
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Individual Product Advanced Forecast
app.get('/api/analytics/advanced-forecast/:inventoryId', (req, res) => {
  try {
    const { inventoryId } = req.params;
    const { forecastHorizon } = req.query;

    const product = data.stockItems.find(item => item.InventoryID === inventoryId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Build sales history for this product
    const salesByMonth = {};
    data.salesOrders.forEach(order => {
      const orderDate = new Date(order.OrderDate);
      const monthKey = orderDate.toISOString().substring(0, 7); // YYYY-MM

      order.Details?.forEach(detail => {
        if (detail.InventoryID === inventoryId) {
          if (!salesByMonth[monthKey]) {
            salesByMonth[monthKey] = 0;
          }
          salesByMonth[monthKey] += detail.Quantity || 0;
        }
      });
    });

    const salesHistory = Object.entries(salesByMonth)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([month, quantity]) => ({ month, quantity }));

    if (salesHistory.length < 6) {
      return res.status(400).json({
        error: 'Insufficient historical data',
        message: 'At least 6 months of sales history required for advanced forecasting',
        availableMonths: salesHistory.length
      });
    }

    const { generateAdvancedProductForecast } = require('./advancedForecastingEngine');
    const forecast = generateAdvancedProductForecast(product, salesHistory, {
      forecastHorizon: parseInt(forecastHorizon) || 3,
      seasonLength: 12,
      includeConfidenceIntervals: true
    });

    res.json(forecast);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Forecast Accuracy Comparison
app.get('/api/analytics/forecast-accuracy', (req, res) => {
  try {
    const { businessUnit } = req.query;

    const forecasts = generateAdvancedForecasts(data.stockItems, data.salesOrders, {
      businessUnit: businessUnit || 'PHARMA',
      topN: 50
    });

    const accuracyReport = {
      overallAccuracy: 0,
      byModel: {},
      byAccuracyGrade: {
        Excellent: { count: 0, avgMAPE: 0 },
        Good: { count: 0, avgMAPE: 0 },
        Fair: { count: 0, avgMAPE: 0 },
        Poor: { count: 0, avgMAPE: 0 }
      },
      topPerformers: [],
      needsImprovement: []
    };

    // Calculate overall accuracy
    const totalMAPE = forecasts.reduce((sum, f) => sum + f.modelAccuracy.mape, 0);
    accuracyReport.overallAccuracy = Math.round((100 - (totalMAPE / forecasts.length)) * 10) / 10;

    // Group by model
    forecasts.forEach(f => {
      const model = f.bestModel;
      if (!accuracyReport.byModel[model]) {
        accuracyReport.byModel[model] = { count: 0, totalMAPE: 0, avgMAPE: 0 };
      }
      accuracyReport.byModel[model].count++;
      accuracyReport.byModel[model].totalMAPE += f.modelAccuracy.mape;
    });

    // Calculate average MAPE per model
    Object.keys(accuracyReport.byModel).forEach(model => {
      const data = accuracyReport.byModel[model];
      data.avgMAPE = Math.round((data.totalMAPE / data.count) * 10) / 10;
      delete data.totalMAPE;
    });

    // Group by accuracy grade
    forecasts.forEach(f => {
      const grade = f.modelAccuracy.accuracyGrade;
      accuracyReport.byAccuracyGrade[grade].count++;
      accuracyReport.byAccuracyGrade[grade].avgMAPE += f.modelAccuracy.mape;
    });

    Object.keys(accuracyReport.byAccuracyGrade).forEach(grade => {
      const data = accuracyReport.byAccuracyGrade[grade];
      if (data.count > 0) {
        data.avgMAPE = Math.round((data.avgMAPE / data.count) * 10) / 10;
      }
    });

    // Top performers (lowest MAPE)
    accuracyReport.topPerformers = forecasts
      .slice(0, 10)
      .map(f => ({
        productName: f.productName,
        skuCode: f.skuCode,
        mape: f.modelAccuracy.mape,
        model: f.bestModel,
        grade: f.modelAccuracy.accuracyGrade
      }));

    // Needs improvement (highest MAPE)
    accuracyReport.needsImprovement = forecasts
      .filter(f => f.modelAccuracy.mape >= 30)
      .slice(0, 10)
      .map(f => ({
        productName: f.productName,
        skuCode: f.skuCode,
        mape: f.modelAccuracy.mape,
        model: f.bestModel,
        grade: f.modelAccuracy.accuracyGrade
      }));

    res.json(accuracyReport);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// Supplier Scorecard Endpoints
// ============================================

// Supplier Scorecards
app.get('/api/analytics/supplier-scorecards', (req, res) => {
  try {
    const scorecards = generateSupplierScorecards(data.purchaseOrders, data.vendors);
    const summary = getSupplierPerformanceSummary(scorecards);
    const comparison = getSupplierComparisonData(scorecards);
    const riskMatrix = getSupplierRiskMatrix(scorecards);
    const performers = getTopBottomPerformers(scorecards);
    const spendConcentration = calculateSpendConcentration(scorecards);

    res.json({
      summary,
      scorecards,
      comparison,
      riskMatrix,
      topPerformers: performers.topPerformers,
      bottomPerformers: performers.bottomPerformers,
      spendConcentration: spendConcentration.slice(0, 10)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Individual Supplier Scorecard
app.get('/api/analytics/supplier-scorecard/:vendorId', (req, res) => {
  try {
    const { vendorId } = req.params;
    const scorecards = generateSupplierScorecards(data.purchaseOrders, data.vendors);
    const scorecard = scorecards.find(sc => sc.vendorID === vendorId);

    if (!scorecard) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    res.json(scorecard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Supplier Performance Trends (simulated historical data)
app.get('/api/analytics/supplier-trends/:vendorId', (req, res) => {
  try {
    const { vendorId } = req.params;
    const vendor = data.vendors.find(v => v.VendorID === vendorId);

    if (!vendor) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    // Generate 12 months of historical performance data
    const trends = [];
    const baseScore = 75 + Math.random() * 15;

    for (let i = 11; i >= 0; i--) {
      const month = new Date();
      month.setMonth(month.getMonth() - i);
      const monthName = month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

      const variance = (Math.random() - 0.5) * 10;
      const score = Math.min(100, Math.max(50, baseScore + variance));

      trends.push({
        month: monthName,
        overallScore: Math.round(score * 10) / 10,
        onTimeDelivery: Math.round((score + (Math.random() - 0.5) * 5) * 10) / 10,
        quality: Math.round((score + (Math.random() - 0.5) * 5) * 10) / 10,
        price: Math.round((score + (Math.random() - 0.5) * 5) * 10) / 10
      });
    }

    res.json({
      vendorName: vendor.VendorName,
      trends
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    dataLoaded: Object.keys(data).length > 0
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Mint Health Analytics API',
    version: '2.0.0',
    endpoints: {
      kpis: '/api/analytics/kpis',
      financial: '/api/analytics/financial',
      sales: '/api/analytics/sales',
      customers: '/api/analytics/customers',
      customerSegmentation: '/api/analytics/customer-segmentation',
      inventory: '/api/analytics/inventory',
      productPerformance: '/api/analytics/product-performance',
      cashflowForecast: '/api/analytics/cashflow-forecast',
      trends: '/api/analytics/trends',
      topCustomers: '/api/analytics/top-customers',
      arAging: '/api/analytics/ar-aging',
      salesPipeline: '/api/analytics/sales-pipeline',
      inventoryTurnover: '/api/analytics/inventory-turnover',
      forecasting: '/api/analytics/forecasting?businessUnit={PHARMA|WELLNESS|PHARMACY}',
      tenders: '/api/analytics/tenders',
      purchaseRecommendations: '/api/analytics/purchase-recommendations',
      expiryAlerts: '/api/analytics/expiry-alerts?daysThreshold=60',
      advancedForecasting: '/api/analytics/advanced-forecasting?businessUnit={PHARMA|WELLNESS|PHARMACY}&topN=20',
      advancedForecast: '/api/analytics/advanced-forecast/:inventoryId?forecastHorizon=3',
      forecastAccuracy: '/api/analytics/forecast-accuracy?businessUnit=PHARMA',
      supplierScorecards: '/api/analytics/supplier-scorecards',
      supplierScorecard: '/api/analytics/supplier-scorecard/:vendorId',
      supplierTrends: '/api/analytics/supplier-trends/:vendorId'
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
  console.log(`\n📊 Mint Health Analytics API running on port ${PORT}`);
  console.log(`📈 API Documentation: http://localhost:${PORT}`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/health\n`);
});

module.exports = app;
