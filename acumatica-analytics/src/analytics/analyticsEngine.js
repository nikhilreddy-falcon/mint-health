/**
 * Analytics Engine
 * Core analytics calculations for Acumatica ERP data
 */

const { format, subDays, startOfMonth, endOfMonth, differenceInDays, parseISO } = require('date-fns');

// ============================================
// KPI Calculations
// ============================================

function calculateKPIs(data) {
  const today = new Date();
  const thirtyDaysAgo = subDays(today, 30);

  // Revenue calculations
  const totalRevenue = data.invoices
    .filter(inv => inv.Status === 'Closed' || inv.Status === 'Open')
    .reduce((sum, inv) => sum + inv.Amount, 0);

  const recentRevenue = data.invoices
    .filter(inv => {
      const invDate = new Date(inv.Date);
      return invDate >= thirtyDaysAgo && (inv.Status === 'Closed' || inv.Status === 'Open');
    })
    .reduce((sum, inv) => sum + inv.Amount, 0);

  // Outstanding AR
  const outstandingAR = data.invoices
    .filter(inv => inv.Status === 'Open')
    .reduce((sum, inv) => sum + inv.Balance, 0);

  // Cash collected
  const cashCollected = data.payments
    .filter(pmt => pmt.Status === 'Closed')
    .reduce((sum, pmt) => sum + pmt.AppliedToDocuments, 0);

  // Active customers
  const activeCustomers = data.customers.filter(c => c.Status === 'Active').length;

  // Average order value
  const completedOrders = data.salesOrders.filter(o => o.Status === 'Completed');
  const avgOrderValue = completedOrders.length > 0
    ? completedOrders.reduce((sum, o) => sum + o.OrderTotal, 0) / completedOrders.length
    : 0;

  // Days Sales Outstanding (DSO)
  const dso = outstandingAR > 0 && recentRevenue > 0
    ? (outstandingAR / (recentRevenue / 30))
    : 0;

  // Inventory value
  const inventoryValue = data.stockItems.reduce((sum, item) => {
    return sum + (item.QtyOnHand * item.LastCost);
  }, 0);

  // Open opportunities
  const openOpportunities = data.opportunities.filter(o => o.Status === 'Open').length;
  const pipelineValue = data.opportunities
    .filter(o => o.Status === 'Open')
    .reduce((sum, o) => sum + o.Amount, 0);

  const weightedPipelineValue = data.opportunities
    .filter(o => o.Status === 'Open')
    .reduce((sum, o) => sum + (o.Amount * o.Probability / 100), 0);

  return {
    financial: {
      totalRevenue: Math.round(totalRevenue),
      revenueThisMonth: Math.round(recentRevenue),
      outstandingAR: Math.round(outstandingAR),
      cashCollected: Math.round(cashCollected),
      dso: Math.round(dso)
    },
    sales: {
      totalOrders: completedOrders.length,
      avgOrderValue: Math.round(avgOrderValue),
      activeCustomers,
      openOpportunities,
      pipelineValue: Math.round(pipelineValue),
      weightedPipelineValue: Math.round(weightedPipelineValue)
    },
    inventory: {
      totalValue: Math.round(inventoryValue),
      itemCount: data.stockItems.length,
      lowStockItems: data.stockItems.filter(i => i.QtyOnHand <= i.ReorderPoint).length
    }
  };
}

// ============================================
// Financial Metrics
// ============================================

function calculateFinancialMetrics(data) {
  const metrics = {
    revenue: {
      total: 0,
      byMonth: {},
      growth: []
    },
    receivables: {
      total: 0,
      overdue: 0,
      current: 0
    },
    payables: {
      total: 0,
      overdue: 0
    },
    profitability: {
      grossProfit: 0,
      grossMargin: 0
    }
  };

  // Revenue analysis
  data.invoices.forEach(invoice => {
    if (invoice.Status === 'Closed' || invoice.Status === 'Open') {
      metrics.revenue.total += invoice.Amount;

      const month = format(new Date(invoice.Date), 'yyyy-MM');
      if (!metrics.revenue.byMonth[month]) {
        metrics.revenue.byMonth[month] = 0;
      }
      metrics.revenue.byMonth[month] += invoice.Amount;
    }

    // Receivables
    if (invoice.Status === 'Open') {
      metrics.receivables.total += invoice.Balance;

      const today = new Date();
      const dueDate = new Date(invoice.DueDate);
      if (dueDate < today) {
        metrics.receivables.overdue += invoice.Balance;
      } else {
        metrics.receivables.current += invoice.Balance;
      }
    }
  });

  // Calculate revenue growth
  const months = Object.keys(metrics.revenue.byMonth).sort();
  for (let i = 1; i < months.length; i++) {
    const currentMonth = months[i];
    const previousMonth = months[i - 1];
    const growth = ((metrics.revenue.byMonth[currentMonth] - metrics.revenue.byMonth[previousMonth]) / metrics.revenue.byMonth[previousMonth]) * 100;
    metrics.revenue.growth.push({
      month: currentMonth,
      growth: parseFloat(growth.toFixed(2))
    });
  }

  // Simple profitability calculation
  const totalCOGS = data.salesOrders
    .filter(o => o.Status === 'Completed')
    .reduce((sum, order) => {
      return sum + order.Details.reduce((lineSum, detail) => {
        const item = data.stockItems.find(i => i.InventoryID === detail.InventoryID);
        return lineSum + (item ? item.LastCost * detail.OrderQty : 0);
      }, 0);
    }, 0);

  metrics.profitability.grossProfit = metrics.revenue.total - totalCOGS;
  metrics.profitability.grossMargin = metrics.revenue.total > 0
    ? (metrics.profitability.grossProfit / metrics.revenue.total) * 100
    : 0;

  return metrics;
}

// ============================================
// Sales Analytics
// ============================================

function calculateSalesAnalytics(data, period = 'monthly') {
  const analytics = {
    totalSales: 0,
    orderCount: 0,
    avgOrderValue: 0,
    salesByPeriod: {},
    salesByStatus: {},
    topProducts: []
  };

  const completedOrders = data.salesOrders.filter(o => o.Status === 'Completed');

  completedOrders.forEach(order => {
    analytics.totalSales += order.OrderTotal;
    analytics.orderCount++;

    // Group by period
    let periodKey;
    const orderDate = new Date(order.Date);
    switch (period) {
      case 'daily':
        periodKey = format(orderDate, 'yyyy-MM-dd');
        break;
      case 'weekly':
        periodKey = format(orderDate, 'yyyy-ww');
        break;
      case 'yearly':
        periodKey = format(orderDate, 'yyyy');
        break;
      default: // monthly
        periodKey = format(orderDate, 'yyyy-MM');
    }

    if (!analytics.salesByPeriod[periodKey]) {
      analytics.salesByPeriod[periodKey] = { sales: 0, orders: 0 };
    }
    analytics.salesByPeriod[periodKey].sales += order.OrderTotal;
    analytics.salesByPeriod[periodKey].orders++;
  });

  analytics.avgOrderValue = analytics.orderCount > 0
    ? analytics.totalSales / analytics.orderCount
    : 0;

  // Sales by status
  data.salesOrders.forEach(order => {
    if (!analytics.salesByStatus[order.Status]) {
      analytics.salesByStatus[order.Status] = { count: 0, value: 0 };
    }
    analytics.salesByStatus[order.Status].count++;
    analytics.salesByStatus[order.Status].value += order.OrderTotal;
  });

  // Top products
  const productSales = {};
  completedOrders.forEach(order => {
    order.Details.forEach(detail => {
      if (!productSales[detail.InventoryID]) {
        productSales[detail.InventoryID] = { qty: 0, revenue: 0 };
      }
      productSales[detail.InventoryID].qty += detail.OrderQty;
      productSales[detail.InventoryID].revenue += detail.ExtendedPrice;
    });
  });

  analytics.topProducts = Object.entries(productSales)
    .map(([inventoryID, stats]) => {
      const item = data.stockItems.find(i => i.InventoryID === inventoryID);
      return {
        inventoryID,
        description: item?.Description || 'Unknown',
        qtySold: stats.qty,
        revenue: stats.revenue
      };
    })
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 20);

  return analytics;
}

// ============================================
// Customer Analytics
// ============================================

function calculateCustomerAnalytics(data) {
  const analytics = {
    totalCustomers: data.customers.length,
    activeCustomers: data.customers.filter(c => c.Status === 'Active').length,
    customerLifetimeValue: {},
    topCustomers: [],
    customersByClass: {},
    churnRisk: []
  };

  // Calculate CLV and purchases
  data.customers.forEach(customer => {
    const customerOrders = data.salesOrders.filter(o => o.CustomerID === customer.CustomerID && o.Status === 'Completed');
    const customerInvoices = data.invoices.filter(i => i.CustomerID === customer.CustomerID);

    const totalRevenue = customerInvoices.reduce((sum, inv) => sum + inv.Amount, 0);
    const orderCount = customerOrders.length;
    const avgOrderValue = orderCount > 0 ? totalRevenue / orderCount : 0;

    analytics.customerLifetimeValue[customer.CustomerID] = {
      customerID: customer.CustomerID,
      customerName: customer.CustomerName,
      totalRevenue,
      orderCount,
      avgOrderValue,
      currentBalance: customer.CurrentBalance,
      overdueBalance: customer.OverdueBalance
    };

    // Customer class distribution
    if (!analytics.customersByClass[customer.CustomerClass]) {
      analytics.customersByClass[customer.CustomerClass] = 0;
    }
    analytics.customersByClass[customer.CustomerClass]++;

    // Churn risk (high overdue balance or no recent orders)
    if (customer.OverdueBalance > 5000 || (orderCount > 0 && orderCount < 2)) {
      analytics.churnRisk.push({
        customerID: customer.CustomerID,
        customerName: customer.CustomerName,
        overdueBalance: customer.OverdueBalance,
        orderCount,
        lastOrderDate: customerOrders.length > 0 ? customerOrders[customerOrders.length - 1].Date : null
      });
    }
  });

  // Top customers
  analytics.topCustomers = Object.values(analytics.customerLifetimeValue)
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 20);

  return analytics;
}

// ============================================
// Customer Segmentation (RFM Analysis)
// ============================================

function calculateCustomerSegmentation(data) {
  const today = new Date();
  const customerMetrics = {};

  // Calculate RFM metrics for each customer
  data.customers.forEach(customer => {
    const customerOrders = data.salesOrders
      .filter(o => o.CustomerID === customer.CustomerID && o.Status === 'Completed')
      .sort((a, b) => new Date(b.Date) - new Date(a.Date));

    const customerInvoices = data.invoices.filter(i => i.CustomerID === customer.CustomerID);

    const recency = customerOrders.length > 0
      ? differenceInDays(today, new Date(customerOrders[0].Date))
      : 999;

    const frequency = customerOrders.length;

    const monetary = customerInvoices.reduce((sum, inv) => sum + inv.Amount, 0);

    if (frequency > 0) {
      customerMetrics[customer.CustomerID] = {
        customerID: customer.CustomerID,
        customerName: customer.CustomerName,
        recency,
        frequency,
        monetary
      };
    }
  });

  // Calculate quartiles for scoring
  const customers = Object.values(customerMetrics);
  const recencyValues = customers.map(c => c.recency).sort((a, b) => a - b);
  const frequencyValues = customers.map(c => c.frequency).sort((a, b) => b - a);
  const monetaryValues = customers.map(c => c.monetary).sort((a, b) => b - a);

  const getQuartile = (value, values, reverse = false) => {
    const index = values.indexOf(value);
    const quartile = Math.ceil((index + 1) / values.length * 4);
    return reverse ? quartile : 5 - quartile;
  };

  // Assign RFM scores
  const segmentedCustomers = customers.map(customer => {
    const rScore = getQuartile(customer.recency, recencyValues, true);
    const fScore = getQuartile(customer.frequency, frequencyValues);
    const mScore = getQuartile(customer.monetary, monetaryValues);

    const rfmScore = rScore + fScore + mScore;

    let segment;
    if (rScore >= 4 && fScore >= 4 && mScore >= 4) {
      segment = 'Champions';
    } else if (rScore >= 3 && fScore >= 3) {
      segment = 'Loyal Customers';
    } else if (rScore >= 4 && fScore <= 2) {
      segment = 'New Customers';
    } else if (rScore <= 2 && fScore >= 3) {
      segment = 'At Risk';
    } else if (rScore <= 2 && fScore <= 2) {
      segment = 'Lost';
    } else {
      segment = 'Potential Loyalists';
    }

    return {
      ...customer,
      rScore,
      fScore,
      mScore,
      rfmScore,
      segment
    };
  });

  // Group by segment
  const segmentCounts = {};
  segmentedCustomers.forEach(customer => {
    if (!segmentCounts[customer.segment]) {
      segmentCounts[customer.segment] = { count: 0, totalValue: 0 };
    }
    segmentCounts[customer.segment].count++;
    segmentCounts[customer.segment].totalValue += customer.monetary;
  });

  return {
    customers: segmentedCustomers,
    segmentSummary: segmentCounts
  };
}

// ============================================
// Inventory Analytics
// ============================================

function calculateInventoryAnalytics(data) {
  const analytics = {
    totalValue: 0,
    totalItems: data.stockItems.length,
    activeItems: 0,
    lowStockItems: [],
    overStockItems: [],
    deadStock: [],
    inventoryByClass: {}
  };

  data.stockItems.forEach(item => {
    const itemValue = item.QtyOnHand * item.LastCost;
    analytics.totalValue += itemValue;

    if (item.ItemStatus === 'Active') {
      analytics.activeItems++;
    }

    // Low stock
    if (item.QtyOnHand <= item.ReorderPoint && item.ItemStatus === 'Active') {
      analytics.lowStockItems.push({
        inventoryID: item.InventoryID,
        description: item.Description,
        qtyOnHand: item.QtyOnHand,
        reorderPoint: item.ReorderPoint,
        qtyOnOrder: item.QtyOnOrder
      });
    }

    // Overstock
    if (item.QtyOnHand > item.MaxQty) {
      analytics.overStockItems.push({
        inventoryID: item.InventoryID,
        description: item.Description,
        qtyOnHand: item.QtyOnHand,
        maxQty: item.MaxQty,
        excessQty: item.QtyOnHand - item.MaxQty,
        excessValue: (item.QtyOnHand - item.MaxQty) * item.LastCost
      });
    }

    // Dead stock (no sales in orders)
    const soldInOrders = data.salesOrders.some(order =>
      order.Details.some(detail => detail.InventoryID === item.InventoryID)
    );
    if (!soldInOrders && item.QtyOnHand > 0) {
      analytics.deadStock.push({
        inventoryID: item.InventoryID,
        description: item.Description,
        qtyOnHand: item.QtyOnHand,
        value: itemValue
      });
    }

    // By class
    if (!analytics.inventoryByClass[item.ItemClass]) {
      analytics.inventoryByClass[item.ItemClass] = { count: 0, value: 0 };
    }
    analytics.inventoryByClass[item.ItemClass].count++;
    analytics.inventoryByClass[item.ItemClass].value += itemValue;
  });

  return analytics;
}

// ============================================
// Product Performance
// ============================================

function calculateProductPerformance(data) {
  const productStats = {};

  // Aggregate sales data
  data.salesOrders.forEach(order => {
    if (order.Status === 'Completed') {
      order.Details.forEach(detail => {
        if (!productStats[detail.InventoryID]) {
          productStats[detail.InventoryID] = {
            qtySold: 0,
            revenue: 0,
            orderCount: 0,
            avgPrice: 0
          };
        }
        productStats[detail.InventoryID].qtySold += detail.OrderQty;
        productStats[detail.InventoryID].revenue += detail.ExtendedPrice;
        productStats[detail.InventoryID].orderCount++;
      });
    }
  });

  // Combine with inventory data
  const performance = Object.entries(productStats).map(([inventoryID, stats]) => {
    const item = data.stockItems.find(i => i.InventoryID === inventoryID);
    if (!item) return null;

    const avgPrice = stats.qtySold > 0 ? stats.revenue / stats.qtySold : 0;
    const profitMargin = item.DefaultPrice > 0 ? ((item.DefaultPrice - item.LastCost) / item.DefaultPrice) * 100 : 0;

    return {
      inventoryID,
      description: item.Description,
      qtySold: stats.qtySold,
      revenue: stats.revenue,
      orderCount: stats.orderCount,
      avgPrice,
      currentStock: item.QtyOnHand,
      profitMargin,
      itemClass: item.ItemClass,
      status: item.ItemStatus
    };
  }).filter(p => p !== null);

  return performance.sort((a, b) => b.revenue - a.revenue);
}

// ============================================
// Cash Flow Forecast
// ============================================

function calculateCashFlowForecast(data, days = 90) {
  const today = new Date();
  const forecast = [];

  for (let i = 0; i <= days; i++) {
    const forecastDate = subDays(today, -i);
    const dateStr = format(forecastDate, 'yyyy-MM-dd');

    // Expected cash inflows (invoices due)
    const inflows = data.invoices
      .filter(inv => {
        const dueDate = new Date(inv.DueDate);
        return inv.Status === 'Open' && format(dueDate, 'yyyy-MM-dd') === dateStr;
      })
      .reduce((sum, inv) => sum + inv.Balance, 0);

    // Expected cash outflows (vendor payments)
    const outflows = data.vendors.reduce((sum, vendor) => {
      // Simplified: assume some percentage of balance due
      return sum + (vendor.Balance * 0.01); // 1% per day
    }, 0);

    forecast.push({
      date: dateStr,
      inflows: Math.round(inflows),
      outflows: Math.round(outflows),
      netCashFlow: Math.round(inflows - outflows)
    });
  }

  // Calculate running balance
  let runningBalance = 100000; // Starting cash balance (assumed)
  forecast.forEach(day => {
    runningBalance += day.netCashFlow;
    day.balance = Math.round(runningBalance);
  });

  return forecast;
}

// ============================================
// Trend Analysis
// ============================================

function calculateTrendAnalysis(data, metric = 'revenue', period = 'monthly') {
  const trends = {};

  switch (metric) {
    case 'revenue':
      data.invoices.forEach(invoice => {
        const date = new Date(invoice.Date);
        const key = format(date, period === 'monthly' ? 'yyyy-MM' : 'yyyy-ww');
        if (!trends[key]) trends[key] = 0;
        trends[key] += invoice.Amount;
      });
      break;

    case 'orders':
      data.salesOrders.forEach(order => {
        if (order.Status === 'Completed') {
          const date = new Date(order.Date);
          const key = format(date, period === 'monthly' ? 'yyyy-MM' : 'yyyy-ww');
          if (!trends[key]) trends[key] = 0;
          trends[key]++;
        }
      });
      break;

    case 'customers':
      data.customers.forEach(customer => {
        const date = new Date(customer.CreatedDateTime);
        const key = format(date, period === 'monthly' ? 'yyyy-MM' : 'yyyy-ww');
        if (!trends[key]) trends[key] = 0;
        trends[key]++;
      });
      break;
  }

  return Object.entries(trends)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([period, value]) => ({ period, value }));
}

module.exports = {
  calculateKPIs,
  calculateFinancialMetrics,
  calculateSalesAnalytics,
  calculateCustomerAnalytics,
  calculateCustomerSegmentation,
  calculateInventoryAnalytics,
  calculateProductPerformance,
  calculateCashFlowForecast,
  calculateTrendAnalysis
};
