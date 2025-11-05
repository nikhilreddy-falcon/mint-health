/**
 * Generate structured monthly sales data for ML forecasting
 * Creates consistent sales patterns with trends and seasonality
 */

const fs = require('fs');
const path = require('path');

// Read existing data
const dataPath = path.join(__dirname, '../../data/acumatica-data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

/**
 * Generate monthly sales for a product over 24 months
 * Includes base demand, trend, seasonality, and noise
 */
function generateMonthlySales(product, months = 24) {
  const sales = [];
  const baseDemand = Math.floor(Math.random() * 200) + 100; // 100-300 base units
  const trend = (Math.random() - 0.5) * 10; // -5 to +5 units per month
  const hasSeasonality = Math.random() > 0.5; // 50% of products are seasonal
  const noise = 0.15; // 15% random variation

  for (let month = 0; month < months; month++) {
    let demand = baseDemand + (trend * month);

    // Add seasonality (12-month cycle)
    if (hasSeasonality) {
      const seasonalFactor = Math.sin((month / 12) * 2 * Math.PI) * 0.3; // +/- 30%
      demand = demand * (1 + seasonalFactor);
    }

    // Add random noise
    const randomFactor = 1 + (Math.random() - 0.5) * noise;
    demand = Math.max(10, Math.floor(demand * randomFactor)); // Minimum 10 units

    sales.push(demand);
  }

  return sales;
}

/**
 * Create sales orders distributed across months
 */
function createMonthlyOrders() {
  const newOrders = [];
  const startDate = new Date('2023-02-01'); // Start from Feb 2023 for 24 months
  let orderCounter = 1;

  // Select top 30 products for ML forecasting
  const forecastProducts = data.stockItems.slice(0, 30);

  forecastProducts.forEach((product, productIndex) => {
    // Generate 24 months of sales history
    const monthlySales = generateMonthlySales(product, 24);

    monthlySales.forEach((monthlyQty, monthIndex) => {
      // Create 3-5 orders per month for this product
      const ordersThisMonth = Math.floor(Math.random() * 3) + 3; // 3-5 orders
      const qtyPerOrder = Math.floor(monthlyQty / ordersThisMonth);

      for (let orderNum = 0; orderNum < ordersThisMonth; orderNum++) {
        const monthDate = new Date(startDate);
        monthDate.setMonth(startDate.getMonth() + monthIndex);

        // Random day within the month
        const day = Math.floor(Math.random() * 28) + 1;
        const orderDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);

        // Skip future dates
        if (orderDate > new Date()) continue;

        // Random customer
        const customer = data.customers[Math.floor(Math.random() * data.customers.length)];

        // Create order with this product
        const qty = qtyPerOrder + Math.floor(Math.random() * 20) - 10; // Some variation
        if (qty < 5) continue; // Skip very small orders

        const unitPrice = product.DefaultPrice * (0.85 + Math.random() * 0.1); // 85-95% of list
        const discountPercent = Math.random() * 10; // 0-10%
        const discountAmount = (unitPrice * qty * discountPercent) / 100;
        const extendedPrice = (unitPrice * qty) - discountAmount;
        const taxTotal = extendedPrice * 0.18;

        const detail = {
          LineNbr: 1,
          InventoryID: product.InventoryID,
          OrderQty: qty,
          Quantity: qty,
          UOM: 'EACH',
          UnitPrice: unitPrice,
          ExtendedPrice: extendedPrice,
          DiscountPercent: discountPercent,
          DiscountAmount: discountAmount,
          TaxCategory: 'EXEMPT',
          WarehouseID: 'MINT-WH'
        };

        const order = {
          OrderType: 'SO',
          OrderNbr: `SO${String(orderCounter).padStart(6, '0')}`,
          CustomerID: customer.CustomerID,
          CustomerOrder: `PO-${Math.floor(Math.random() * 90000) + 10000}`,
          Date: orderDate.toISOString(),
          OrderDate: orderDate.toISOString(),
          RequestedOn: orderDate.toISOString(),
          Status: 'Completed',
          OrderTotal: extendedPrice + taxTotal,
          TaxTotal: taxTotal,
          OrderQty: qty,
          Details: [detail],
          BillToAddress: customer.BillingAddress,
          ShipToAddress: customer.BillingAddress,
          Description: 'Pharmaceutical supply order',
          ShipVia: 'MINT_DELIVERY',
          CreatedDateTime: orderDate.toISOString(),
          LastModifiedDateTime: orderDate.toISOString()
        };

        newOrders.push(order);
        orderCounter++;
      }
    });
  });

  return newOrders;
}

console.log('Generating structured monthly sales data for ML forecasting...');

// Generate new orders
const newOrders = createMonthlyOrders();

console.log(`Generated ${newOrders.length} new orders with monthly structure`);

// Add to existing orders
data.salesOrders = [...data.salesOrders, ...newOrders];

console.log(`Total sales orders: ${data.salesOrders.length}`);

// Save updated data
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

console.log('✓ Data updated successfully with monthly sales patterns');
console.log('✓ ML forecasting should now work with 24 months of history');
