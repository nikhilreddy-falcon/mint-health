const { differenceInDays, parseISO, format, subMonths, addMonths } = require('date-fns');

/**
 * Advanced Forecasting Engine for Mint Health
 * Implements multiple time-series forecasting algorithms with accuracy metrics
 */

/**
 * Calculate Mean Absolute Percentage Error (MAPE)
 */
function calculateMAPE(actual, forecast) {
  if (actual.length !== forecast.length || actual.length === 0) return null;

  let sum = 0;
  let count = 0;

  for (let i = 0; i < actual.length; i++) {
    if (actual[i] !== 0) {
      sum += Math.abs((actual[i] - forecast[i]) / actual[i]);
      count++;
    }
  }

  return count > 0 ? (sum / count) * 100 : null;
}

/**
 * Calculate Mean Absolute Error (MAE)
 */
function calculateMAE(actual, forecast) {
  if (actual.length !== forecast.length || actual.length === 0) return null;

  const sum = actual.reduce((acc, val, i) => acc + Math.abs(val - forecast[i]), 0);
  return sum / actual.length;
}

/**
 * Calculate Root Mean Square Error (RMSE)
 */
function calculateRMSE(actual, forecast) {
  if (actual.length !== forecast.length || actual.length === 0) return null;

  const sumSquares = actual.reduce((acc, val, i) => acc + Math.pow(val - forecast[i], 2), 0);
  return Math.sqrt(sumSquares / actual.length);
}

/**
 * Simple Exponential Smoothing
 */
function exponentialSmoothing(data, alpha = 0.3) {
  if (data.length === 0) return [];

  const forecast = [data[0]];

  for (let i = 1; i < data.length; i++) {
    const smoothed = alpha * data[i - 1] + (1 - alpha) * forecast[i - 1];
    forecast.push(smoothed);
  }

  return forecast;
}

/**
 * Double Exponential Smoothing (Holt's method) - handles trend
 */
function doubleExponentialSmoothing(data, alpha = 0.3, beta = 0.1) {
  if (data.length < 2) return data;

  let level = data[0];
  let trend = data[1] - data[0];
  const forecast = [data[0]];

  for (let i = 1; i < data.length; i++) {
    const lastLevel = level;
    level = alpha * data[i] + (1 - alpha) * (level + trend);
    trend = beta * (level - lastLevel) + (1 - beta) * trend;
    forecast.push(lastLevel + trend);
  }

  return forecast;
}

/**
 * Triple Exponential Smoothing (Holt-Winters) - handles trend and seasonality
 */
function tripleExponentialSmoothing(data, seasonLength = 12, alpha = 0.3, beta = 0.1, gamma = 0.1) {
  if (data.length < seasonLength * 2) return data;

  // Initialize components
  let level = data[0];
  let trend = 0;
  const seasonal = [];

  // Calculate initial seasonal components
  for (let i = 0; i < seasonLength; i++) {
    seasonal[i] = data[i] / level;
  }

  const forecast = [];

  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      forecast.push(data[0]);
      continue;
    }

    const seasonalIndex = i % seasonLength;
    const lastLevel = level;

    // Update level
    level = alpha * (data[i] / seasonal[seasonalIndex]) + (1 - alpha) * (level + trend);

    // Update trend
    trend = beta * (level - lastLevel) + (1 - beta) * trend;

    // Update seasonal
    seasonal[seasonalIndex] = gamma * (data[i] / level) + (1 - gamma) * seasonal[seasonalIndex];

    // Forecast
    forecast.push((lastLevel + trend) * seasonal[seasonalIndex]);
  }

  return forecast;
}

/**
 * Linear Regression for trend detection
 */
function linearRegression(data) {
  const n = data.length;
  if (n < 2) return { slope: 0, intercept: data[0] || 0, predictions: data };

  const xValues = Array.from({ length: n }, (_, i) => i);
  const yValues = data;

  const sumX = xValues.reduce((a, b) => a + b, 0);
  const sumY = yValues.reduce((a, b) => a + b, 0);
  const sumXY = xValues.reduce((acc, x, i) => acc + x * yValues[i], 0);
  const sumXX = xValues.reduce((acc, x) => acc + x * x, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  const predictions = xValues.map(x => slope * x + intercept);

  return { slope, intercept, predictions };
}

/**
 * Detect seasonality in time series data
 */
function detectSeasonality(data, seasonLength = 12) {
  if (data.length < seasonLength * 2) {
    return { hasSeasonality: false, strength: 0, pattern: [] };
  }

  // Calculate seasonal indices
  const seasonalSums = Array(seasonLength).fill(0);
  const seasonalCounts = Array(seasonLength).fill(0);

  data.forEach((value, index) => {
    const seasonIndex = index % seasonLength;
    seasonalSums[seasonIndex] += value;
    seasonalCounts[seasonIndex]++;
  });

  const seasonalAverages = seasonalSums.map((sum, i) =>
    seasonalCounts[i] > 0 ? sum / seasonalCounts[i] : 0
  );

  const overallAverage = data.reduce((a, b) => a + b, 0) / data.length;
  const seasonalIndices = seasonalAverages.map(avg => avg / overallAverage);

  // Calculate strength of seasonality (coefficient of variation)
  const variance = seasonalIndices.reduce((acc, val) =>
    acc + Math.pow(val - 1, 2), 0
  ) / seasonLength;
  const strength = Math.sqrt(variance);

  return {
    hasSeasonality: strength > 0.1,
    strength: Math.round(strength * 100) / 100,
    pattern: seasonalIndices.map(idx => Math.round(idx * 100) / 100)
  };
}

/**
 * Detect trend in time series data
 */
function detectTrend(data) {
  const regression = linearRegression(data);
  const slope = regression.slope;

  let trendType = 'Stable';
  let trendStrength = Math.abs(slope);

  if (slope > 0.05) {
    trendType = slope > 0.15 ? 'Strong Upward' : 'Upward';
  } else if (slope < -0.05) {
    trendType = slope < -0.15 ? 'Strong Downward' : 'Downward';
  }

  return {
    type: trendType,
    slope: Math.round(slope * 1000) / 1000,
    strength: Math.round(trendStrength * 1000) / 1000
  };
}

/**
 * Generate confidence intervals for forecasts
 */
function calculateConfidenceIntervals(forecast, actual, confidenceLevel = 0.95) {
  const residuals = actual.map((val, i) => val - forecast[i]);
  const stdDev = Math.sqrt(
    residuals.reduce((acc, val) => acc + val * val, 0) / residuals.length
  );

  // Z-scores for confidence levels
  const zScores = {
    0.90: 1.645,
    0.95: 1.96,
    0.99: 2.576
  };

  const zScore = zScores[confidenceLevel] || 1.96;
  const margin = zScore * stdDev;

  return forecast.map(val => ({
    forecast: Math.round(val),
    lower: Math.max(0, Math.round(val - margin)),
    upper: Math.round(val + margin),
    confidenceLevel: confidenceLevel * 100
  }));
}

/**
 * Generate advanced forecasts for product with multiple algorithms
 */
function generateAdvancedProductForecast(productData, salesHistory, options = {}) {
  const {
    forecastHorizon = 3, // months ahead
    seasonLength = 12,
    includeConfidenceIntervals = true
  } = options;

  // Extract historical quantities
  const historicalData = salesHistory.map(s => s.quantity);

  if (historicalData.length < 6) {
    // Not enough data for advanced forecasting
    return {
      productName: productData.ProductName,
      skuCode: productData.InventoryID,
      error: 'Insufficient historical data (minimum 6 months required)',
      simpleAverage: Math.round(
        historicalData.reduce((a, b) => a + b, 0) / historicalData.length
      )
    };
  }

  // Apply different forecasting methods
  const simpleES = exponentialSmoothing(historicalData, 0.3);
  const doubleES = doubleExponentialSmoothing(historicalData, 0.3, 0.1);
  const tripleES = tripleExponentialSmoothing(historicalData, seasonLength, 0.3, 0.1, 0.1);
  const linearReg = linearRegression(historicalData);

  // Calculate accuracy metrics for each method (on historical data)
  const accuracyMetrics = {
    simpleExponential: {
      mape: calculateMAPE(historicalData, simpleES),
      mae: calculateMAE(historicalData, simpleES),
      rmse: calculateRMSE(historicalData, simpleES)
    },
    doubleExponential: {
      mape: calculateMAPE(historicalData, doubleES),
      mae: calculateMAE(historicalData, doubleES),
      rmse: calculateRMSE(historicalData, doubleES)
    },
    tripleExponential: {
      mape: calculateMAPE(historicalData, tripleES),
      mae: calculateMAE(historicalData, tripleES),
      rmse: calculateRMSE(historicalData, tripleES)
    },
    linearRegression: {
      mape: calculateMAPE(historicalData, linearReg.predictions),
      mae: calculateMAE(historicalData, linearReg.predictions),
      rmse: calculateRMSE(historicalData, linearReg.predictions)
    }
  };

  // Select best model based on lowest MAPE
  let bestModel = 'simpleExponential';
  let lowestMAPE = accuracyMetrics.simpleExponential.mape;

  Object.entries(accuracyMetrics).forEach(([model, metrics]) => {
    if (metrics.mape !== null && metrics.mape < lowestMAPE) {
      lowestMAPE = metrics.mape;
      bestModel = model;
    }
  });

  // Generate future forecasts using best model
  let futureForecast;
  const lastValue = historicalData[historicalData.length - 1];
  const lastESValue = simpleES[simpleES.length - 1];
  const lastDESValue = doubleES[doubleES.length - 1];

  if (bestModel === 'simpleExponential') {
    futureForecast = Array(forecastHorizon).fill(lastESValue);
  } else if (bestModel === 'doubleExponential') {
    const trend = lastDESValue - doubleES[doubleES.length - 2];
    futureForecast = Array.from({ length: forecastHorizon }, (_, i) =>
      lastDESValue + trend * (i + 1)
    );
  } else if (bestModel === 'tripleExponential') {
    const lastSeasonalIndex = (historicalData.length - 1) % seasonLength;
    futureForecast = Array.from({ length: forecastHorizon }, (_, i) => {
      const seasonIndex = (lastSeasonalIndex + i + 1) % seasonLength;
      return tripleES[tripleES.length - 1] * (1 + (seasonIndex / seasonLength - 0.5) * 0.2);
    });
  } else { // linearRegression
    const nextX = historicalData.length;
    futureForecast = Array.from({ length: forecastHorizon }, (_, i) =>
      linearReg.slope * (nextX + i) + linearReg.intercept
    );
  }

  // Detect seasonality and trend
  const seasonality = detectSeasonality(historicalData, seasonLength);
  const trend = detectTrend(historicalData);

  // Calculate confidence intervals
  let forecastWithCI = futureForecast.map(val => ({
    forecast: Math.max(0, Math.round(val)),
    lower: Math.max(0, Math.round(val * 0.85)),
    upper: Math.round(val * 1.15),
    confidenceLevel: 95
  }));

  if (includeConfidenceIntervals && bestModel !== 'simpleExponential') {
    const testForecast = bestModel === 'doubleExponential' ? doubleES :
                         bestModel === 'tripleExponential' ? tripleES :
                         linearReg.predictions;
    forecastWithCI = calculateConfidenceIntervals(testForecast, historicalData, 0.95)
      .slice(-forecastHorizon);
  }

  return {
    productName: productData.ProductName,
    skuCode: productData.InventoryID,
    currentStock: productData.QtyOnHand || 0,

    // Best model selection
    bestModel: bestModel,
    modelAccuracy: {
      mape: Math.round(lowestMAPE * 10) / 10,
      mae: Math.round(accuracyMetrics[bestModel].mae * 10) / 10,
      rmse: Math.round(accuracyMetrics[bestModel].rmse * 10) / 10,
      accuracyGrade: lowestMAPE < 10 ? 'Excellent' :
                     lowestMAPE < 20 ? 'Good' :
                     lowestMAPE < 30 ? 'Fair' : 'Poor'
    },

    // All model accuracies for comparison
    allModels: Object.fromEntries(
      Object.entries(accuracyMetrics).map(([model, metrics]) => [
        model,
        {
          mape: Math.round(metrics.mape * 10) / 10,
          mae: Math.round(metrics.mae * 10) / 10,
          rmse: Math.round(metrics.rmse * 10) / 10
        }
      ])
    ),

    // Seasonality analysis
    seasonality: {
      detected: seasonality.hasSeasonality,
      strength: seasonality.strength,
      pattern: seasonality.pattern
    },

    // Trend analysis
    trend: trend,

    // Forecasts with confidence intervals
    forecastMonths: forecastWithCI,

    // Simple metrics
    avgMonthlyDemand: Math.round(historicalData.reduce((a, b) => a + b, 0) / historicalData.length),
    monthsOfStock: productData.QtyOnHand ?
      Math.round((productData.QtyOnHand / (historicalData.reduce((a, b) => a + b, 0) / historicalData.length)) * 10) / 10 : 0,

    // Historical data for charting
    historicalData: historicalData.slice(-12).map((qty, i) => ({
      month: format(subMonths(new Date(), 12 - i), 'MMM yyyy'),
      actual: qty
    }))
  };
}

/**
 * Generate advanced forecasts for all products
 */
function generateAdvancedForecasts(stockItems, salesOrders, options = {}) {
  const { businessUnit, topN = 20 } = options;

  // Group sales by product and month
  const salesByProduct = {};

  salesOrders.forEach(order => {
    // Filter by business unit if specified (skip if not matching)
    // For now, we'll process all orders since they're all pharmaceutical orders
    // if (businessUnit && order.OrderType && order.OrderType !== businessUnit) return;

    const orderDate = new Date(order.OrderDate || order.Date);
    const monthKey = format(orderDate, 'yyyy-MM');

    order.Details?.forEach(detail => {
      if (!salesByProduct[detail.InventoryID]) {
        salesByProduct[detail.InventoryID] = {};
      }
      if (!salesByProduct[detail.InventoryID][monthKey]) {
        salesByProduct[detail.InventoryID][monthKey] = 0;
      }
      // Use Quantity or OrderQty field
      const qty = detail.Quantity || detail.OrderQty || 0;
      salesByProduct[detail.InventoryID][monthKey] += qty;
    });
  });

  // Generate forecasts for each product
  const forecasts = [];

  Object.entries(salesByProduct).forEach(([inventoryID, monthlySales]) => {
    const product = stockItems.find(item => item.InventoryID === inventoryID);
    if (!product) return;

    // Convert monthly sales to array sorted by date
    const salesHistory = Object.entries(monthlySales)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([month, quantity]) => ({ month, quantity }));

    if (salesHistory.length >= 6) {
      const forecast = generateAdvancedProductForecast(product, salesHistory, options);
      if (!forecast.error) {
        forecasts.push(forecast);
      }
    }
  });

  // Sort by model accuracy (lowest MAPE)
  forecasts.sort((a, b) => a.modelAccuracy.mape - b.modelAccuracy.mape);

  return forecasts.slice(0, topN);
}

/**
 * Get aggregated forecasting summary
 */
function getAdvancedForecastingSummary(forecasts) {
  if (forecasts.length === 0) {
    return {
      totalProducts: 0,
      avgAccuracy: 0,
      excellentForecasts: 0,
      goodForecasts: 0,
      needsImprovement: 0
    };
  }

  const avgMAPE = forecasts.reduce((sum, f) => sum + f.modelAccuracy.mape, 0) / forecasts.length;

  return {
    totalProducts: forecasts.length,
    avgAccuracy: Math.round((100 - avgMAPE) * 10) / 10,
    avgMAPE: Math.round(avgMAPE * 10) / 10,
    excellentForecasts: forecasts.filter(f => f.modelAccuracy.mape < 10).length,
    goodForecasts: forecasts.filter(f => f.modelAccuracy.mape >= 10 && f.modelAccuracy.mape < 20).length,
    fairForecasts: forecasts.filter(f => f.modelAccuracy.mape >= 20 && f.modelAccuracy.mape < 30).length,
    needsImprovement: forecasts.filter(f => f.modelAccuracy.mape >= 30).length,

    // Model distribution
    modelUsage: {
      simpleExponential: forecasts.filter(f => f.bestModel === 'simpleExponential').length,
      doubleExponential: forecasts.filter(f => f.bestModel === 'doubleExponential').length,
      tripleExponential: forecasts.filter(f => f.bestModel === 'tripleExponential').length,
      linearRegression: forecasts.filter(f => f.bestModel === 'linearRegression').length
    },

    // Trend analysis
    trendDistribution: {
      upward: forecasts.filter(f => f.trend.type.includes('Upward')).length,
      downward: forecasts.filter(f => f.trend.type.includes('Downward')).length,
      stable: forecasts.filter(f => f.trend.type === 'Stable').length
    },

    // Seasonality
    seasonalProducts: forecasts.filter(f => f.seasonality.detected).length
  };
}

module.exports = {
  generateAdvancedForecasts,
  generateAdvancedProductForecast,
  getAdvancedForecastingSummary,
  calculateMAPE,
  calculateMAE,
  calculateRMSE,
  detectSeasonality,
  detectTrend
};
