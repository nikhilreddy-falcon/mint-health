const { differenceInDays, addDays, subMonths, format } = require('date-fns');

/**
 * Forecasting Engine for Mint Health
 * Implements rolling averages, months of stock calculations, expiry tracking
 */

/**
 * Calculate rolling 3-month average for demand forecasting
 */
function calculateRollingAverage(salesHistory, months = 3) {
  if (!salesHistory || salesHistory.length === 0) return 0;

  const recentMonths = salesHistory.slice(-months);
  const total = recentMonths.reduce((sum, month) => sum + month.quantity, 0);
  return Math.round(total / months);
}

/**
 * Calculate months of stock remaining
 */
function calculateMonthsOfStock(currentStock, monthlyAverage) {
  if (monthlyAverage === 0) return 999; // Effectively infinite
  return Number((currentStock / monthlyAverage).toFixed(1));
}

/**
 * Determine reorder status based on months of stock
 */
function getReorderStatus(monthsOfStock) {
  if (monthsOfStock < 2.0) return { status: 'URGENT', color: 'red', action: 'Reorder Now' };
  if (monthsOfStock < 3.0) return { status: 'WARNING', color: 'orange', action: 'Plan Reorder' };
  return { status: 'OK', color: 'green', action: 'Stock Adequate' };
}

/**
 * Calculate days to expiry and urgency level
 */
function getExpiryAlert(expiryDate) {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const daysToExpiry = differenceInDays(expiry, today);

  if (daysToExpiry < 0) {
    return { level: 'EXPIRED', color: 'black', days: daysToExpiry, action: 'Destroy/Return' };
  } else if (daysToExpiry < 30) {
    return { level: 'CRITICAL', color: 'red', days: daysToExpiry, action: 'Discount/Return Now' };
  } else if (daysToExpiry < 60) {
    return { level: 'HIGH', color: 'orange', days: daysToExpiry, action: 'Promote Sales' };
  } else if (daysToExpiry < 90) {
    return { level: 'MEDIUM', color: 'yellow', days: daysToExpiry, action: 'Monitor Closely' };
  }
  return { level: 'OK', color: 'green', days: daysToExpiry, action: 'Normal Operations' };
}

/**
 * Generate demand forecasting data for a business unit
 */
function generateDemandForecast(stockItems, salesOrders, businessUnit) {
  const today = new Date();
  const forecasts = [];

  // Filter items by business unit
  const filteredItems = stockItems.filter(item => {
    if (businessUnit === 'PHARMA') {
      return ['CARDIOVASCULAR', 'DIABETES', 'ANTIBIOTICS', 'RESPIRATORY', 'ANALGESICS'].includes(item.ItemClass);
    } else if (businessUnit === 'WELLNESS') {
      return ['VITAMINS', 'DIGESTIVE', 'SPORTS', 'SUPPLEMENTS'].includes(item.ItemClass);
    } else if (businessUnit === 'PHARMACY') {
      return ['ALLERGY', 'SKINCARE', 'BABY', 'WOMENS_HEALTH', 'MENTAL_HEALTH'].includes(item.ItemClass);
    }
    return true; // Show all if no filter
  });

  filteredItems.forEach(item => {
    // Calculate sales history (last 3 months)
    const itemOrders = salesOrders
      .filter(order => order.Details && order.Details.some(d => d.InventoryID === item.InventoryID))
      .filter(order => {
        const orderDate = new Date(order.Date);
        return differenceInDays(today, orderDate) <= 90;
      });

    // Generate monthly totals
    const month1 = Math.floor(Math.random() * 200) + 50;  // Simulated sales
    const month2 = Math.floor(Math.random() * 200) + 50;
    const month3 = Math.floor(Math.random() * 200) + 50;

    const monthlyAverage = Math.round((month1 + month2 + month3) / 3);
    const currentStock = item.QtyOnHand || Math.floor(Math.random() * 1000) + 100;
    const monthsOfStock = calculateMonthsOfStock(currentStock, monthlyAverage);
    const reorderInfo = getReorderStatus(monthsOfStock);

    // Generate expiry date (between 30 days and 2 years)
    const daysToExpiry = Math.floor(Math.random() * 700) + 30;
    const expiryDate = addDays(today, daysToExpiry);
    const expiryAlert = getExpiryAlert(expiryDate);

    // Calculate suggested order quantity
    let suggestedOrder = 0;
    if (monthsOfStock < 3.0) {
      // Order enough to reach 4-5 months stock
      suggestedOrder = Math.round((4.5 * monthlyAverage) - currentStock);
      suggestedOrder = Math.max(0, suggestedOrder);
    }

    forecasts.push({
      skuCode: item.InventoryID,
      productName: item.Description || 'Unknown Product',
      category: item.ItemClass,
      currentStock,
      month1Sales: month1,
      month2Sales: month2,
      month3Sales: month3,
      monthlyAverage,
      monthsOfStock,
      expiryDate: format(expiryDate, 'yyyy-MM-dd'),
      daysToExpiry: expiryAlert.days,
      expiryLevel: expiryAlert.level,
      expiryAction: expiryAlert.action,
      reorderStatus: reorderInfo.status,
      reorderAction: reorderInfo.action,
      suggestedOrder,
      vendorName: item.DefaultVendorID || 'Unknown Vendor'
    });
  });

  // Sort by urgency: first by reorder status, then by expiry
  forecasts.sort((a, b) => {
    const urgencyOrder = { 'URGENT': 0, 'WARNING': 1, 'OK': 2 };
    if (urgencyOrder[a.reorderStatus] !== urgencyOrder[b.reorderStatus]) {
      return urgencyOrder[a.reorderStatus] - urgencyOrder[b.reorderStatus];
    }
    return a.daysToExpiry - b.daysToExpiry;
  });

  return forecasts;
}

/**
 * Generate government tender tracking data
 */
function generateTenderTracking() {
  const today = new Date();
  const tenders = [];

  // Generate 47 sample COOs (Confirmations of Order)
  const cooReferences = [
    'CPSU5431/25', 'CT2347/2022', 'CPSU6012/24', 'CT1892/2023', 'CPSU5789/25',
    'CT2156/2024', 'CPSU4923/24', 'CT3401/2023', 'CPSU6234/25', 'CT2789/2024'
  ];

  const products = [
    'Propofol 1% MCT 50ml',
    'Fluoxetine 20mg Capsule',
    'Electrolytes & Trace Elements Infusion',
    'Atorvastatin 20mg Tablets',
    'Metformin 500mg Tablets',
    'Amoxicillin 500mg Capsules',
    'Insulin Glargine 100 units/ml',
    'Salbutamol Inhaler 100mcg',
    'Paracetamol 500mg Tablets',
    'Omeprazole 20mg Capsules'
  ];

  const suppliers = [
    'Fresenius Kabi', 'Normon', 'Pfizer Europe', 'AstraZeneca UK',
    'Novartis Pharma', 'GSK Malta', 'Sanofi Italy'
  ];

  for (let i = 0; i < 47; i++) {
    const cooRef = cooReferences[i % cooReferences.length] + (i > 9 ? `-${i}` : '');
    const product = products[Math.floor(Math.random() * products.length)];
    const supplier = suppliers[Math.floor(Math.random() * suppliers.length)];

    const tenderQuantity = Math.floor(Math.random() * 50000) + 5000;
    const deliveredPercent = Math.random() * 0.8 + 0.1; // 10% to 90%
    const delivered = Math.floor(tenderQuantity * deliveredPercent);
    const remaining = tenderQuantity - delivered;

    // Next delivery in 7-60 days
    const daysToDelivery = Math.floor(Math.random() * 54) + 7;
    const nextDelivery = format(addDays(today, daysToDelivery), 'yyyy-MM-dd');

    // CPSU stock (government warehouse)
    const cpsuStock = Math.floor(Math.random() * 10000) + 500;

    // Determine status
    let status = 'On Track';
    if (deliveredPercent < 0.3 && daysToDelivery < 14) {
      status = 'At Risk';
    } else if (deliveredPercent < 0.5 && daysToDelivery < 7) {
      status = 'Delayed';
    }

    tenders.push({
      cooReference: cooRef,
      productName: product,
      supplierName: supplier,
      tenderQuantity,
      delivered,
      remaining,
      percentComplete: Math.round(deliveredPercent * 100),
      nextDeliveryDate: nextDelivery,
      daysToDelivery,
      cpsuStock,
      status
    });
  }

  return tenders;
}

/**
 * Generate purchase order recommendations based on forecasting
 */
function generatePurchaseRecommendations(forecasts) {
  // Group by vendor
  const vendorMap = {};

  forecasts
    .filter(f => f.suggestedOrder > 0)
    .forEach(forecast => {
      const vendor = forecast.vendorName;
      if (!vendorMap[vendor]) {
        vendorMap[vendor] = {
          vendorName: vendor,
          products: [],
          totalUnits: 0,
          estimatedCost: 0,
          priority: 'MEDIUM'
        };
      }

      vendorMap[vendor].products.push({
        sku: forecast.skuCode,
        name: forecast.productName,
        quantity: forecast.suggestedOrder
      });
      vendorMap[vendor].totalUnits += forecast.suggestedOrder;
      vendorMap[vendor].estimatedCost += forecast.suggestedOrder * (Math.random() * 50 + 10);

      // Set priority based on urgency
      if (forecast.reorderStatus === 'URGENT') {
        vendorMap[vendor].priority = 'URGENT';
      } else if (forecast.reorderStatus === 'WARNING' && vendorMap[vendor].priority !== 'URGENT') {
        vendorMap[vendor].priority = 'HIGH';
      }
    });

  const recommendations = Object.values(vendorMap).map(rec => ({
    ...rec,
    productCount: rec.products.length,
    estimatedCost: Math.round(rec.estimatedCost),
    leadTimeDays: Math.floor(Math.random() * 30) + 14 // 14-44 days
  }));

  // Sort by priority
  const priorityOrder = { 'URGENT': 0, 'HIGH': 1, 'MEDIUM': 2 };
  recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return recommendations;
}

/**
 * Get forecasting summary statistics
 */
function getForecastingSummary(forecasts, tenders) {
  const needsReorder = forecasts.filter(f => f.reorderStatus === 'URGENT' || f.reorderStatus === 'WARNING').length;
  const expiringSoon = forecasts.filter(f => f.daysToExpiry < 60).length;
  const activeTenders = tenders.length;
  const tendersAtRisk = tenders.filter(t => t.status === 'At Risk' || t.status === 'Delayed').length;

  return {
    totalSKUs: forecasts.length,
    needsReorder,
    expiringSoon,
    activeTenders,
    tendersAtRisk
  };
}

module.exports = {
  calculateRollingAverage,
  calculateMonthsOfStock,
  getReorderStatus,
  getExpiryAlert,
  generateDemandForecast,
  generateTenderTracking,
  generatePurchaseRecommendations,
  getForecastingSummary
};
