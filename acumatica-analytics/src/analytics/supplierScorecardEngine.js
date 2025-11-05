const { differenceInDays, parseISO } = require('date-fns');

/**
 * Supplier Scorecard Engine for Mint Health
 * Tracks supplier performance metrics: on-time delivery, quality, pricing, responsiveness
 */

/**
 * Calculate supplier performance scorecards
 */
function generateSupplierScorecards(purchaseOrders, vendors, receipts = []) {
  const today = new Date();
  const scorecards = [];

  vendors.forEach(vendor => {
    // Get all POs for this vendor
    const vendorPOs = purchaseOrders.filter(po => po.VendorID === vendor.VendorID);

    if (vendorPOs.length === 0) {
      return; // Skip vendors with no orders
    }

    // Calculate metrics
    const totalOrders = vendorPOs.length;
    const completedOrders = vendorPOs.filter(po => po.Status === 'Closed' || po.Status === 'Completed').length;

    // On-time delivery calculation
    let onTimeCount = 0;
    let lateCount = 0;
    let totalDeliveryDays = 0;
    let deliveredCount = 0;

    vendorPOs.forEach(po => {
      if (po.Status === 'Closed' || po.Status === 'Completed') {
        const promisedDate = new Date(po.PromisedDate || po.OrderDate);
        // Simulate actual delivery date (for demo purposes)
        const actualDeliveryDays = Math.floor(Math.random() * 20) - 5; // -5 to +15 days variance
        const actualDeliveryDate = new Date(promisedDate);
        actualDeliveryDate.setDate(actualDeliveryDate.getDate() + actualDeliveryDays);

        const daysLate = differenceInDays(actualDeliveryDate, promisedDate);
        totalDeliveryDays += Math.abs(actualDeliveryDays);
        deliveredCount++;

        if (daysLate <= 0) {
          onTimeCount++;
        } else {
          lateCount++;
        }
      }
    });

    const onTimeDeliveryRate = deliveredCount > 0 ? (onTimeCount / deliveredCount) * 100 : 0;
    const avgDeliveryTime = deliveredCount > 0 ? Math.round(totalDeliveryDays / deliveredCount) : 0;

    // Quality metrics (simulated for demo)
    const totalItemsOrdered = vendorPOs.reduce((sum, po) => sum + (po.OrderTotal || 0), 0);
    const defectRate = Math.random() * 3; // 0-3% defect rate
    const qualityScore = Math.max(0, 100 - (defectRate * 10));

    // Price competitiveness (simulated)
    const priceVariance = (Math.random() * 10) - 5; // -5% to +5% vs market
    const priceScore = Math.max(0, Math.min(100, 100 - Math.abs(priceVariance * 5)));

    // Responsiveness (simulated - based on order lead time)
    const avgLeadTime = parseInt(vendor.Terms?.replace(/\D/g, '') || 30);
    const responsivenessScore = Math.max(0, 100 - (avgLeadTime - 14) * 2);

    // Compliance score (GDP/regulatory compliance)
    const complianceScore = 90 + Math.random() * 10; // 90-100% for pharmaceutical suppliers

    // Overall weighted score
    const overallScore = (
      onTimeDeliveryRate * 0.30 +
      qualityScore * 0.25 +
      priceScore * 0.20 +
      responsivenessScore * 0.15 +
      complianceScore * 0.10
    );

    // Performance rating
    let rating = 'Poor';
    if (overallScore >= 90) rating = 'Excellent';
    else if (overallScore >= 80) rating = 'Good';
    else if (overallScore >= 70) rating = 'Satisfactory';
    else if (overallScore >= 60) rating = 'Needs Improvement';

    // Risk assessment
    let riskLevel = 'Low';
    if (onTimeDeliveryRate < 70 || qualityScore < 70) riskLevel = 'High';
    else if (onTimeDeliveryRate < 85 || qualityScore < 85) riskLevel = 'Medium';

    scorecards.push({
      vendorID: vendor.VendorID,
      vendorName: vendor.VendorName,
      location: vendor.MainContact?.Address?.Country || 'Unknown',

      // Order metrics
      totalOrders,
      completedOrders,
      activeOrders: totalOrders - completedOrders,
      totalSpend: Math.round(totalItemsOrdered),

      // Performance scores (0-100)
      onTimeDeliveryRate: Math.round(onTimeDeliveryRate * 10) / 10,
      qualityScore: Math.round(qualityScore * 10) / 10,
      priceScore: Math.round(priceScore * 10) / 10,
      responsivenessScore: Math.round(responsivenessScore * 10) / 10,
      complianceScore: Math.round(complianceScore * 10) / 10,
      overallScore: Math.round(overallScore * 10) / 10,

      // Detailed metrics
      avgDeliveryTime: avgDeliveryTime + avgLeadTime,
      defectRate: Math.round(defectRate * 10) / 10,
      priceVariance: Math.round(priceVariance * 10) / 10,
      leadTime: avgLeadTime,

      // Ratings
      rating,
      riskLevel,

      // Trends (simulated)
      scoreChange: Math.round((Math.random() * 10 - 5) * 10) / 10, // -5 to +5 points

      // Contact info
      contactName: vendor.MainContact?.DisplayName || 'N/A',
      email: vendor.MainContact?.Email || 'N/A',
      paymentTerms: vendor.Terms || 'Net 30'
    });
  });

  // Sort by overall score descending
  scorecards.sort((a, b) => b.overallScore - a.overallScore);

  return scorecards;
}

/**
 * Get supplier performance summary
 */
function getSupplierPerformanceSummary(scorecards) {
  if (scorecards.length === 0) {
    return {
      totalSuppliers: 0,
      excellentSuppliers: 0,
      atRiskSuppliers: 0,
      avgOnTimeDelivery: 0,
      avgQualityScore: 0,
      avgOverallScore: 0
    };
  }

  const excellentSuppliers = scorecards.filter(s => s.rating === 'Excellent').length;
  const atRiskSuppliers = scorecards.filter(s => s.riskLevel === 'High').length;

  const avgOnTimeDelivery = scorecards.reduce((sum, s) => sum + s.onTimeDeliveryRate, 0) / scorecards.length;
  const avgQualityScore = scorecards.reduce((sum, s) => sum + s.qualityScore, 0) / scorecards.length;
  const avgOverallScore = scorecards.reduce((sum, s) => sum + s.overallScore, 0) / scorecards.length;
  const totalSpend = scorecards.reduce((sum, s) => sum + s.totalSpend, 0);

  return {
    totalSuppliers: scorecards.length,
    excellentSuppliers,
    goodSuppliers: scorecards.filter(s => s.rating === 'Good').length,
    satisfactorySuppliers: scorecards.filter(s => s.rating === 'Satisfactory').length,
    atRiskSuppliers,
    avgOnTimeDelivery: Math.round(avgOnTimeDelivery * 10) / 10,
    avgQualityScore: Math.round(avgQualityScore * 10) / 10,
    avgOverallScore: Math.round(avgOverallScore * 10) / 10,
    totalSpend: Math.round(totalSpend)
  };
}

/**
 * Get supplier comparison data for charts
 */
function getSupplierComparisonData(scorecards) {
  return scorecards.slice(0, 10).map(sc => ({
    supplier: sc.vendorName.length > 20 ? sc.vendorName.substring(0, 17) + '...' : sc.vendorName,
    onTimeDelivery: sc.onTimeDeliveryRate,
    quality: sc.qualityScore,
    price: sc.priceScore,
    overall: sc.overallScore
  }));
}

/**
 * Get supplier risk matrix data
 */
function getSupplierRiskMatrix(scorecards) {
  return scorecards.map(sc => ({
    supplier: sc.vendorName,
    spend: sc.totalSpend,
    performance: sc.overallScore,
    risk: sc.riskLevel,
    quadrant: categorizeSupplier(sc.totalSpend, sc.overallScore, scorecards)
  }));
}

/**
 * Categorize supplier into strategic quadrant
 */
function categorizeSupplier(spend, performance, allScorecards) {
  const avgSpend = allScorecards.reduce((sum, s) => sum + s.totalSpend, 0) / allScorecards.length;
  const avgPerformance = allScorecards.reduce((sum, s) => sum + s.overallScore, 0) / allScorecards.length;

  if (spend >= avgSpend && performance >= avgPerformance) {
    return 'Strategic Partners'; // High spend, high performance
  } else if (spend >= avgSpend && performance < avgPerformance) {
    return 'Performance Risk'; // High spend, low performance - CONCERN
  } else if (spend < avgSpend && performance >= avgPerformance) {
    return 'Potential Growth'; // Low spend, high performance - OPPORTUNITY
  } else {
    return 'Tactical'; // Low spend, low performance
  }
}

/**
 * Get top/bottom performers
 */
function getTopBottomPerformers(scorecards) {
  const sorted = [...scorecards].sort((a, b) => b.overallScore - a.overallScore);

  return {
    topPerformers: sorted.slice(0, 5),
    bottomPerformers: sorted.slice(-5).reverse()
  };
}

/**
 * Calculate spend concentration (risk of dependency)
 */
function calculateSpendConcentration(scorecards) {
  const totalSpend = scorecards.reduce((sum, s) => sum + s.totalSpend, 0);

  return scorecards.map(sc => ({
    vendorName: sc.vendorName,
    spend: sc.totalSpend,
    percentage: Math.round((sc.totalSpend / totalSpend) * 1000) / 10,
    overallScore: sc.overallScore
  })).sort((a, b) => b.percentage - a.percentage);
}

module.exports = {
  generateSupplierScorecards,
  getSupplierPerformanceSummary,
  getSupplierComparisonData,
  getSupplierRiskMatrix,
  getTopBottomPerformers,
  calculateSpendConcentration
};
