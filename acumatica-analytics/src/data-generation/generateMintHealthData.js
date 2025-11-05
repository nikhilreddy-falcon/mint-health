/**
 * Mint Health - Customized Data Generator
 * Pharmaceutical distribution company in Malta
 */

const faker = require('faker');
const fs = require('fs');
const path = require('path');
const {
  Customer,
  SalesOrder,
  SalesOrderDetail,
  Invoice,
  Payment,
  StockItem,
  PurchaseOrder,
  Vendor,
  JournalTransaction,
  Opportunity,
  Shipment
} = require('../models/acumaticaEntities');

const {
  MALTA_CUSTOMERS,
  PHARMA_PRODUCTS,
  PHARMA_SUPPLIERS,
  MALTA_REGIONS
} = require('./mintHealthData');

// Configuration for Mint Health
const CONFIG = {
  customers: 80,  // Pharmacies, clinics, hospitals in Malta
  vendors: 15,    // Pharmaceutical suppliers
  stockItems: 50, // Pharmaceutical products
  salesOrders: 600,
  invoices: 700,
  payments: 500,
  purchaseOrders: 300,
  opportunities: 50,  // New pharmacy/clinic prospects
  shipments: 550,
  journalTransactions: 100,
  startDate: new Date('2023-01-01'),
  endDate: new Date('2025-01-31')
};

// Helper functions
const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min, max, decimals = 2) => {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
};

const generateCustomerID = (index) => `CUST${String(index).padStart(5, '0')}`;
const generateVendorID = (index) => `VEND${String(index).padStart(4, '0')}`;
const generateInventoryID = (index) => `PHARM${String(index).padStart(5, '0')}`;
const generateOrderNbr = (index) => `SO${String(index).padStart(6, '0')}`;
const generateInvoiceNbr = (index) => `INV${String(index).padStart(6, '0')}`;
const generatePaymentNbr = (index) => `PMT${String(index).padStart(6, '0')}`;
const generatePONbr = (index) => `PO${String(index).padStart(6, '0')}`;
const generateShipmentNbr = (index) => `SHIP${String(index).padStart(6, '0')}`;
const generateBatchNbr = (index) => `GL${String(index).padStart(6, '0')}`;

// Generate Customers (Malta pharmacies, clinics, hospitals)
function generateCustomers(count) {
  const customers = [];
  const customerClasses = ['RETAIL_PHARMACY', 'HOSPITAL', 'CLINIC', 'DISTRIBUTOR'];
  const statuses = ['Active', 'Active', 'Active', 'Active', 'Inactive'];

  // First add the real Malta customers
  MALTA_CUSTOMERS.forEach((maltaCustomer, i) => {
    const customer = new Customer({
      CustomerID: generateCustomerID(i + 1),
      CustomerName: maltaCustomer.name,
      Status: 'Active',
      CustomerClass: maltaCustomer.type === 'HOSPITAL' ? 'HOSPITAL' :
                    maltaCustomer.type === 'CLINIC' ? 'CLINIC' : 'RETAIL_PHARMACY',
      CreditLimit: maltaCustomer.type === 'HOSPITAL' ? randomFloat(100000, 500000, 0) :
                   maltaCustomer.type === 'CLINIC' ? randomFloat(30000, 100000, 0) :
                   randomFloat(10000, 50000, 0),
      CurrentBalance: randomFloat(0, 20000),
      OverdueBalance: randomFloat(0, 5000),
      UnreleasedBalance: randomFloat(0, 2000),
      MainContact: {
        DisplayName: faker.name.findName(),
        Email: faker.internet.email(),
        Phone1: `+356 ${randomInt(2000, 9999)} ${randomInt(1000, 9999)}`,
        Attention: 'Pharmacy Manager'
      },
      BillingAddress: {
        AddressLine1: faker.address.streetAddress(),
        AddressLine2: null,
        City: maltaCustomer.location,
        State: 'Malta',
        PostalCode: `MLT ${randomInt(1000, 9999)}`,
        Country: 'MT'
      },
      Terms: 'Net 30',
      CreatedDateTime: randomDate(CONFIG.startDate, new Date('2023-06-01')),
      LastModifiedDateTime: randomDate(new Date('2024-01-01'), CONFIG.endDate)
    });
    customers.push(customer);
  });

  // Generate additional customers to reach count
  for (let i = MALTA_CUSTOMERS.length; i < count; i++) {
    const customerClass = randomChoice(customerClasses);
    const location = randomChoice(MALTA_REGIONS);

    const customer = new Customer({
      CustomerID: generateCustomerID(i + 1),
      CustomerName: `${randomChoice(['Central', 'St.', 'City', 'Community', 'Village', 'Health'])} ${randomChoice(['Pharmacy', 'Medical Centre', 'Clinic', 'Healthcare'])} - ${location}`,
      Status: randomChoice(statuses),
      CustomerClass: customerClass,
      CreditLimit: customerClass === 'HOSPITAL' ? randomFloat(100000, 500000, 0) :
                   customerClass === 'CLINIC' ? randomFloat(30000, 100000, 0) :
                   randomFloat(10000, 50000, 0),
      CurrentBalance: randomFloat(0, 20000),
      OverdueBalance: randomFloat(0, 5000),
      UnreleasedBalance: randomFloat(0, 2000),
      MainContact: {
        DisplayName: faker.name.findName(),
        Email: faker.internet.email(),
        Phone1: `+356 ${randomInt(2000, 9999)} ${randomInt(1000, 9999)}`,
        Attention: customerClass === 'HOSPITAL' ? 'Procurement Manager' : 'Pharmacy Manager'
      },
      BillingAddress: {
        AddressLine1: faker.address.streetAddress(),
        AddressLine2: null,
        City: location,
        State: 'Malta',
        PostalCode: `MLT ${randomInt(1000, 9999)}`,
        Country: 'MT'
      },
      Terms: customerClass === 'HOSPITAL' ? 'Net 60' : 'Net 30',
      CreatedDateTime: randomDate(CONFIG.startDate, new Date('2024-01-01')),
      LastModifiedDateTime: randomDate(new Date('2024-01-01'), CONFIG.endDate)
    });
    customers.push(customer);
  }

  return customers;
}

// Generate Vendors (Pharmaceutical suppliers)
function generateVendors(count) {
  const vendors = [];

  PHARMA_SUPPLIERS.forEach((supplier, i) => {
    const vendor = new Vendor({
      VendorID: generateVendorID(i + 1),
      VendorName: supplier.name,
      Status: 'Active',
      VendorClass: 'PHARMA_SUPPLIER',
      CreditLimit: 0,
      Balance: randomFloat(0, 100000),
      MainContact: {
        DisplayName: faker.name.findName(),
        Email: faker.internet.email(),
        Phone1: faker.phone.phoneNumber()
      },
      RemitAddress: {
        AddressLine1: faker.address.streetAddress(),
        City: faker.address.city(),
        State: supplier.country,
        PostalCode: faker.address.zipCode(),
        Country: supplier.country === 'Malta' ? 'MT' : 'EU'
      },
      PaymentMethod: 'WIRE',
      Terms: supplier.terms,
      CreatedDateTime: randomDate(CONFIG.startDate, new Date('2023-03-01'))
    });
    vendors.push(vendor);
  });

  return vendors;
}

// Generate Stock Items (Pharmaceutical products)
function generateStockItems(count) {
  const items = [];

  PHARMA_PRODUCTS.slice(0, count).forEach((product, i) => {
    const item = new StockItem({
      InventoryID: generateInventoryID(i + 1),
      Description: product.name,
      ItemStatus: 'Active',
      ItemClass: product.category,
      BaseUOM: 'EACH',
      DefaultPrice: product.price * randomFloat(1.5, 2.5), // Retail markup
      LastCost: product.price, // Wholesale cost
      QtyOnHand: randomInt(50, 500),
      QtyAvailable: randomInt(30, 450),
      QtyOnOrder: randomInt(0, 200),
      MinQty: randomInt(20, 50),
      MaxQty: randomInt(300, 800),
      ReorderPoint: randomInt(40, 100),
      DefaultWarehouseID: 'MINT-WH',
      ProductManagerID: 'PM001',
      CreatedDateTime: randomDate(CONFIG.startDate, new Date('2024-01-01')),
      LastModifiedDateTime: randomDate(new Date('2024-01-01'), CONFIG.endDate)
    });
    items.push(item);
  });

  return items;
}

// Generate Sales Orders
function generateSalesOrders(count, customers, stockItems) {
  const orders = [];
  const statuses = ['Open', 'Open', 'Completed', 'Completed', 'Completed', 'Completed', 'Hold', 'Cancelled'];
  const shipVias = ['MINT_DELIVERY', 'EXPRESS', 'CUSTOMER_PICKUP'];

  for (let i = 1; i <= count; i++) {
    const customer = randomChoice(customers.filter(c => c.Status === 'Active'));
    const orderDate = randomDate(CONFIG.startDate, CONFIG.endDate);
    const requestedDate = new Date(orderDate);
    requestedDate.setDate(requestedDate.getDate() + randomInt(1, 7));

    const lineCount = randomInt(3, 15); // Pharmacies order multiple items
    const details = [];
    let orderTotal = 0;

    for (let j = 1; j <= lineCount; j++) {
      const item = randomChoice(stockItems);
      const qty = randomInt(10, 100); // Bulk orders for pharmacies
      const unitPrice = item.DefaultPrice * randomFloat(0.85, 0.95); // Volume discount
      const discountPercent = randomFloat(5, 15);
      const discountAmount = (unitPrice * qty * discountPercent) / 100;
      const extendedPrice = (unitPrice * qty) - discountAmount;

      const detail = new SalesOrderDetail({
        LineNbr: j,
        InventoryID: item.InventoryID,
        OrderQty: qty,
        UOM: 'EACH',
        UnitPrice: unitPrice,
        ExtendedPrice: extendedPrice,
        DiscountPercent: discountPercent,
        DiscountAmount: discountAmount,
        TaxCategory: 'EXEMPT', // Pharmaceuticals often tax-exempt
        WarehouseID: 'MINT-WH'
      });
      details.push(detail);
      orderTotal += extendedPrice;
    }

    const taxTotal = orderTotal * 0.18; // Malta VAT 18%

    const order = new SalesOrder({
      OrderType: 'SO',
      OrderNbr: generateOrderNbr(i),
      CustomerID: customer.CustomerID,
      CustomerOrder: `PO-${randomInt(10000, 99999)}`,
      Date: orderDate,
      RequestedOn: requestedDate,
      Status: randomChoice(statuses),
      OrderTotal: orderTotal + taxTotal,
      TaxTotal: taxTotal,
      OrderQty: details.reduce((sum, d) => sum + d.OrderQty, 0),
      Details: details,
      BillToAddress: customer.BillingAddress,
      ShipToAddress: customer.BillingAddress,
      Description: `Pharmaceutical supply order`,
      ShipVia: randomChoice(shipVias),
      CreatedDateTime: orderDate,
      LastModifiedDateTime: randomDate(orderDate, CONFIG.endDate)
    });
    orders.push(order);
  }

  return orders;
}

// Similar functions for invoices, payments, etc. (abbreviated for space)
function generateInvoices(count, customers) {
  const invoices = [];
  const statuses = ['Open', 'Open', 'Closed', 'Closed', 'Closed'];

  for (let i = 1; i <= count; i++) {
    const customer = randomChoice(customers);
    const invoiceDate = randomDate(CONFIG.startDate, CONFIG.endDate);
    const dueDate = new Date(invoiceDate);
    const days = customer.Terms === 'Net 60' ? 60 : 30;
    dueDate.setDate(dueDate.getDate() + days);

    const amount = randomFloat(500, 15000);
    const taxTotal = amount * 0.18;
    const totalAmount = amount + taxTotal;
    const status = randomChoice(statuses);
    const balance = status === 'Closed' ? 0 : randomFloat(0, totalAmount);

    const invoice = new Invoice({
      Type: 'Invoice',
      ReferenceNbr: generateInvoiceNbr(i),
      CustomerID: customer.CustomerID,
      Date: invoiceDate,
      DueDate: dueDate,
      PostPeriod: `${invoiceDate.getFullYear()}${String(invoiceDate.getMonth() + 1).padStart(2, '0')}`,
      Status: status,
      Amount: totalAmount,
      Balance: balance,
      TaxTotal: taxTotal,
      Description: `Pharmaceutical supply invoice`,
      CustomerOrder: null,
      Details: [],
      CreatedDateTime: invoiceDate,
      LastModifiedDateTime: randomDate(invoiceDate, CONFIG.endDate)
    });
    invoices.push(invoice);
  }

  return invoices;
}

function generatePayments(count, customers) {
  const payments = [];
  const statuses = ['Closed', 'Closed', 'Closed', 'Open'];
  const methods = ['BANK_TRANSFER', 'CHEQUE', 'CREDIT_CARD'];

  for (let i = 1; i <= count; i++) {
    const customer = randomChoice(customers);
    const paymentDate = randomDate(CONFIG.startDate, CONFIG.endDate);
    const paymentAmount = randomFloat(500, 25000);
    const status = randomChoice(statuses);
    const appliedAmount = status === 'Closed' ? paymentAmount : randomFloat(0, paymentAmount);

    const payment = new Payment({
      Type: 'Payment',
      ReferenceNbr: generatePaymentNbr(i),
      CustomerID: customer.CustomerID,
      ApplicationDate: paymentDate,
      PaymentDate: paymentDate,
      Status: status,
      PaymentAmount: paymentAmount,
      AppliedToDocuments: appliedAmount,
      UnappliedBalance: paymentAmount - appliedAmount,
      PaymentMethod: randomChoice(methods),
      CashAccount: '10200',
      PaymentRef: `REF-${randomInt(1000, 9999)}`,
      ApplicationHistory: [],
      CreatedDateTime: paymentDate
    });
    payments.push(payment);
  }

  return payments;
}

function generatePurchaseOrders(count, vendors, stockItems) {
  const orders = [];
  const statuses = ['Open', 'Completed', 'Completed', 'Completed'];

  for (let i = 1; i <= count; i++) {
    const vendor = randomChoice(vendors);
    const poDate = randomDate(CONFIG.startDate, CONFIG.endDate);
    const promisedDate = new Date(poDate);
    promisedDate.setDate(promisedDate.getDate() + randomInt(14, 45));

    const orderTotal = randomFloat(10000, 100000);
    const taxTotal = 0; // B2B transactions often tax-exempt

    const po = new PurchaseOrder({
      OrderType: 'Normal',
      OrderNbr: generatePONbr(i),
      VendorID: vendor.VendorID,
      Date: poDate,
      PromisedOn: promisedDate,
      Status: randomChoice(statuses),
      OrderTotal: orderTotal,
      TaxTotal: taxTotal,
      Details: [],
      Description: `Pharmaceutical stock order`,
      VendorRef: `VPO-${randomInt(10000, 99999)}`,
      CreatedDateTime: poDate
    });
    orders.push(po);
  }

  return orders;
}

function generateOpportunities(count, customers) {
  const opportunities = [];
  const statuses = ['Open', 'Open', 'Open', 'Won', 'Lost'];
  const stages = ['Prospect', 'Qualification', 'Needs Analysis', 'Proposal', 'Negotiation', 'Closed'];
  const sources = ['Referral', 'Website', 'Trade Show', 'Cold Call'];

  for (let i = 1; i <= count; i++) {
    const createdDate = randomDate(CONFIG.startDate, CONFIG.endDate);
    const closeDate = new Date(createdDate);
    closeDate.setDate(closeDate.getDate() + randomInt(30, 180));

    const status = randomChoice(statuses);
    const stage = status === 'Won' || status === 'Lost' ? 'Closed' : randomChoice(stages);
    const probability = stage === 'Prospect' ? randomInt(10, 20) :
                       stage === 'Qualification' ? randomInt(20, 40) :
                       stage === 'Needs Analysis' ? randomInt(40, 60) :
                       stage === 'Proposal' ? randomInt(60, 80) :
                       stage === 'Negotiation' ? randomInt(80, 95) :
                       status === 'Won' ? 100 : 0;

    const opportunity = new Opportunity({
      OpportunityID: `OPP-${String(i).padStart(5, '0')}`,
      Subject: `New pharmacy supply contract - ${randomChoice(MALTA_REGIONS)}`,
      Status: status,
      Stage: stage,
      BusinessAccountID: randomChoice(customers).CustomerID,
      ContactID: faker.name.findName(),
      Owner: `SALES${randomInt(1, 5)}`,
      EstimatedCloseDate: closeDate,
      Amount: randomFloat(20000, 200000),
      Probability: probability,
      Source: randomChoice(sources),
      CreatedDateTime: createdDate,
      LastModifiedDateTime: randomDate(createdDate, CONFIG.endDate)
    });
    opportunities.push(opportunity);
  }

  return opportunities;
}

function generateShipments(count, customers) {
  const shipments = [];
  const statuses = ['Shipped', 'Shipped', 'Invoiced', 'Confirmed'];

  for (let i = 1; i <= count; i++) {
    const customer = randomChoice(customers);
    const shipDate = randomDate(CONFIG.startDate, CONFIG.endDate);

    const shipment = new Shipment({
      ShipmentNbr: generateShipmentNbr(i),
      Type: 'Shipment',
      CustomerID: customer.CustomerID,
      ShipmentDate: shipDate,
      Status: randomChoice(statuses),
      WarehouseID: 'MINT-WH',
      ShipVia: 'MINT_DELIVERY',
      PackageCount: randomInt(1, 5),
      PackageWeight: randomFloat(5, 50, 1),
      TrackingNbr: `MINT${randomInt(100000, 999999)}`,
      Details: [],
      CreatedDateTime: shipDate
    });
    shipments.push(shipment);
  }

  return shipments;
}

function generateJournalTransactions(count) {
  const transactions = [];
  const statuses = ['Released', 'Released', 'Posted'];

  for (let i = 1; i <= count; i++) {
    const transDate = randomDate(CONFIG.startDate, CONFIG.endDate);
    const amount = randomFloat(1000, 50000);

    const transaction = new JournalTransaction({
      BatchNbr: generateBatchNbr(i),
      TransactionDate: transDate,
      PostPeriod: `${transDate.getFullYear()}${String(transDate.getMonth() + 1).padStart(2, '0')}`,
      Status: randomChoice(statuses),
      Description: 'Monthly pharma operations entry',
      CurrencyID: 'EUR',
      ControlTotal: amount,
      DebitTotal: amount,
      CreditTotal: amount,
      Details: [],
      CreatedDateTime: transDate
    });
    transactions.push(transaction);
  }

  return transactions;
}

// Main generation function
function generateAllData() {
  console.log('🏥 Generating Mint Health Pharmaceutical Data...\n');

  console.log('📋 Generating Customers (Malta pharmacies, clinics, hospitals)...');
  const customers = generateCustomers(CONFIG.customers);

  console.log('🏭 Generating Vendors (Pharmaceutical suppliers)...');
  const vendors = generateVendors(CONFIG.vendors);

  console.log('💊 Generating Stock Items (Pharmaceutical products)...');
  const stockItems = generateStockItems(CONFIG.stockItems);

  console.log('📦 Generating Sales Orders...');
  const salesOrders = generateSalesOrders(CONFIG.salesOrders, customers, stockItems);

  console.log('📄 Generating Invoices...');
  const invoices = generateInvoices(CONFIG.invoices, customers);

  console.log('💰 Generating Payments...');
  const payments = generatePayments(CONFIG.payments, customers);

  console.log('🛒 Generating Purchase Orders...');
  const purchaseOrders = generatePurchaseOrders(CONFIG.purchaseOrders, vendors, stockItems);

  console.log('🎯 Generating Opportunities...');
  const opportunities = generateOpportunities(CONFIG.opportunities, customers);

  console.log('🚚 Generating Shipments...');
  const shipments = generateShipments(CONFIG.shipments, customers);

  console.log('📊 Generating Journal Transactions...');
  const journalTransactions = generateJournalTransactions(CONFIG.journalTransactions);

  const data = {
    customers,
    vendors,
    stockItems,
    salesOrders,
    invoices,
    payments,
    purchaseOrders,
    opportunities,
    shipments,
    journalTransactions,
    metadata: {
      companyName: 'Mint Health Malta',
      industry: 'Pharmaceutical Distribution & Wellness',
      generatedAt: new Date().toISOString(),
      config: CONFIG,
      counts: {
        customers: customers.length,
        vendors: vendors.length,
        stockItems: stockItems.length,
        salesOrders: salesOrders.length,
        invoices: invoices.length,
        payments: payments.length,
        purchaseOrders: purchaseOrders.length,
        opportunities: opportunities.length,
        shipments: shipments.length,
        journalTransactions: journalTransactions.length
      }
    }
  };

  // Save to file
  const outputDir = path.join(__dirname, '../../data');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, 'acumatica-data.json');
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));

  console.log(`\n✅ Mint Health data generation complete!`);
  console.log(`📊 Generated ${Object.keys(data.metadata.counts).reduce((sum, key) => sum + data.metadata.counts[key], 0)} total records`);
  console.log(`💾 Data saved to: ${outputPath}\n`);

  return data;
}

// Run if called directly
if (require.main === module) {
  generateAllData();
}

module.exports = { generateAllData };
