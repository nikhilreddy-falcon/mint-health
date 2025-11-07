/**
 * Dummy Data Generator for Acumatica ERP Analytics
 * Generates realistic data matching Acumatica metadata
 */

const faker = require('faker');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
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

// Configuration
const CONFIG = {
  customers: 150,
  vendors: 50,
  stockItems: 200,
  salesOrders: 500,
  invoices: 600,
  payments: 400,
  purchaseOrders: 200,
  opportunities: 300,
  shipments: 450,
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

const generateCustomerID = (index) => `C${String(index).padStart(6, '0')}`;
const generateVendorID = (index) => `V${String(index).padStart(5, '0')}`;
const generateInventoryID = (index) => `INV${String(index).padStart(5, '0')}`;
const generateOrderNbr = (index) => `SO${String(index).padStart(6, '0')}`;
const generateInvoiceNbr = (index) => `INV${String(index).padStart(6, '0')}`;
const generatePaymentNbr = (index) => `PMT${String(index).padStart(6, '0')}`;
const generatePONbr = (index) => `PO${String(index).padStart(6, '0')}`;
const generateShipmentNbr = (index) => `SH${String(index).padStart(6, '0')}`;
const generateBatchNbr = (index) => `GL${String(index).padStart(6, '0')}`;

// Data generators
function generateCustomers(count) {
  const customers = [];
  const customerClasses = ['WHOLESALE', 'RETAIL', 'GOVERNMENT', 'NONPROFIT'];
  const terms = ['Net 30', 'Net 45', 'Net 60', 'Due on Receipt', '2/10 Net 30'];
  const statuses = ['Active', 'Active', 'Active', 'Active', 'Inactive', 'Hold'];

  for (let i = 1; i <= count; i++) {
    const customer = new Customer({
      CustomerID: generateCustomerID(i),
      CustomerName: faker.company.companyName(),
      Status: randomChoice(statuses),
      CustomerClass: randomChoice(customerClasses),
      CreditLimit: randomFloat(5000, 100000, 0),
      CurrentBalance: randomFloat(0, 50000),
      OverdueBalance: randomFloat(0, 10000),
      UnreleasedBalance: randomFloat(0, 5000),
      MainContact: {
        DisplayName: faker.name.findName(),
        Email: faker.internet.email(),
        Phone1: faker.phone.phoneNumber(),
        Attention: faker.name.jobTitle()
      },
      BillingAddress: {
        AddressLine1: faker.address.streetAddress(),
        AddressLine2: Math.random() > 0.7 ? faker.address.secondaryAddress() : null,
        City: faker.address.city(),
        State: faker.address.stateAbbr(),
        PostalCode: faker.address.zipCode(),
        Country: 'US'
      },
      Terms: randomChoice(terms),
      CreatedDateTime: randomDate(CONFIG.startDate, new Date('2024-01-01')),
      LastModifiedDateTime: randomDate(new Date('2024-01-01'), CONFIG.endDate)
    });
    customers.push(customer);
  }
  return customers;
}

function generateVendors(count) {
  const vendors = [];
  const vendorClasses = ['SUPPLIES', 'SERVICES', 'MANUFACTURING', 'TECHNOLOGY'];
  const terms = ['Net 30', 'Net 45', 'Net 60', 'Due on Receipt'];
  const paymentMethods = ['CHECK', 'ACH', 'WIRE', 'CREDIT CARD'];

  for (let i = 1; i <= count; i++) {
    const vendor = new Vendor({
      VendorID: generateVendorID(i),
      VendorName: faker.company.companyName(),
      Status: Math.random() > 0.1 ? 'Active' : 'Inactive',
      VendorClass: randomChoice(vendorClasses),
      CreditLimit: randomFloat(10000, 500000, 0),
      Balance: randomFloat(0, 50000),
      MainContact: {
        DisplayName: faker.name.findName(),
        Email: faker.internet.email(),
        Phone1: faker.phone.phoneNumber()
      },
      RemitAddress: {
        AddressLine1: faker.address.streetAddress(),
        City: faker.address.city(),
        State: faker.address.stateAbbr(),
        PostalCode: faker.address.zipCode(),
        Country: 'US'
      },
      PaymentMethod: randomChoice(paymentMethods),
      Terms: randomChoice(terms),
      CreatedDateTime: randomDate(CONFIG.startDate, new Date('2024-01-01'))
    });
    vendors.push(vendor);
  }
  return vendors;
}

function generateStockItems(count) {
  const items = [];
  const itemClasses = ['CARDIOVASCULAR', 'DIABETES', 'ANTIBIOTICS', 'RESPIRATORY', 'ANALGESICS', 'VITAMINS', 'MEDICAL_DEVICES'];
  const statuses = ['Active', 'Active', 'Active', 'Inactive', 'NoSales'];
  const warehouses = ['MINT-WH', 'PHARMA-NORTH', 'PHARMA-SOUTH', 'CENTRAL'];

  const categories = [
    { prefix: 'CARDIO', name: 'Cardiovascular Medication' },
    { prefix: 'DIAB', name: 'Diabetes Treatment' },
    { prefix: 'ANTI', name: 'Antibiotic' },
    { prefix: 'RESP', name: 'Respiratory Medicine' },
    { prefix: 'PAIN', name: 'Pain Relief' },
    { prefix: 'VIT', name: 'Vitamin Supplement' },
    { prefix: 'DIAG', name: 'Diagnostic Device' },
    { prefix: 'MED', name: 'Medical Supply' }
  ];

  for (let i = 1; i <= count; i++) {
    const category = randomChoice(categories);
    const defaultPrice = randomFloat(10, 5000);
    const lastCost = defaultPrice * randomFloat(0.4, 0.7);
    const qtyOnHand = randomInt(0, 500);

    const item = new StockItem({
      InventoryID: generateInventoryID(i),
      Description: `${category.name} - ${faker.commerce.productName()}`,
      ItemStatus: randomChoice(statuses),
      ItemClass: randomChoice(itemClasses),
      BaseUOM: 'EACH',
      DefaultPrice: defaultPrice,
      LastCost: lastCost,
      QtyOnHand: qtyOnHand,
      QtyAvailable: Math.max(0, qtyOnHand - randomInt(0, 50)),
      QtyOnOrder: randomInt(0, 200),
      MinQty: randomInt(10, 50),
      MaxQty: randomInt(200, 1000),
      ReorderPoint: randomInt(20, 100),
      DefaultWarehouseID: randomChoice(warehouses),
      ProductManagerID: `MGR${randomInt(1, 5)}`,
      CreatedDateTime: randomDate(CONFIG.startDate, new Date('2024-06-01')),
      LastModifiedDateTime: randomDate(new Date('2024-06-01'), CONFIG.endDate)
    });
    items.push(item);
  }
  return items;
}

function generateSalesOrders(count, customers, stockItems) {
  const orders = [];
  const statuses = ['Open', 'Open', 'Completed', 'Completed', 'Completed', 'Hold', 'Cancelled'];
  const shipVias = ['GROUND', 'EXPRESS', 'OVERNIGHT', '2DAY', 'FREIGHT'];

  for (let i = 1; i <= count; i++) {
    const customer = randomChoice(customers);
    const orderDate = randomDate(CONFIG.startDate, CONFIG.endDate);
    const requestedDate = new Date(orderDate);
    requestedDate.setDate(requestedDate.getDate() + randomInt(3, 14));

    // Generate line items
    const lineCount = randomInt(1, 8);
    const details = [];
    let orderTotal = 0;

    for (let j = 1; j <= lineCount; j++) {
      const item = randomChoice(stockItems);
      const qty = randomInt(1, 20);
      const unitPrice = item.DefaultPrice * randomFloat(0.9, 1.1);
      const discountPercent = randomFloat(0, 15);
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
        TaxCategory: 'TAXABLE',
        WarehouseID: item.DefaultWarehouseID
      });
      details.push(detail);
      orderTotal += extendedPrice;
    }

    const taxTotal = orderTotal * 0.0875; // 8.75% tax

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
      Description: faker.lorem.sentence(),
      ShipVia: randomChoice(shipVias),
      CreatedDateTime: orderDate,
      LastModifiedDateTime: randomDate(orderDate, CONFIG.endDate)
    });
    orders.push(order);
  }
  return orders;
}

function generateInvoices(count, customers, salesOrders) {
  const invoices = [];
  const types = ['Invoice', 'Invoice', 'Invoice', 'Credit Memo'];
  const statuses = ['Open', 'Open', 'Open', 'Closed', 'Closed', 'Hold'];

  for (let i = 1; i <= count; i++) {
    const customer = randomChoice(customers);
    const invoiceDate = randomDate(CONFIG.startDate, CONFIG.endDate);
    const dueDate = new Date(invoiceDate);

    // Parse terms to calculate due date
    const termsMatch = customer.Terms.match(/Net (\d+)/);
    const days = termsMatch ? parseInt(termsMatch[1]) : 30;
    dueDate.setDate(dueDate.getDate() + days);

    const amount = randomFloat(100, 50000);
    const taxTotal = amount * 0.0875;
    const totalAmount = amount + taxTotal;
    const status = randomChoice(statuses);
    const balance = status === 'Closed' ? 0 : randomFloat(0, totalAmount);

    const invoice = new Invoice({
      Type: randomChoice(types),
      ReferenceNbr: generateInvoiceNbr(i),
      CustomerID: customer.CustomerID,
      Date: invoiceDate,
      DueDate: dueDate,
      PostPeriod: `${invoiceDate.getFullYear()}${String(invoiceDate.getMonth() + 1).padStart(2, '0')}`,
      Status: status,
      Amount: totalAmount,
      Balance: balance,
      TaxTotal: taxTotal,
      Description: faker.lorem.sentence(),
      CustomerOrder: i <= salesOrders.length ? salesOrders[i - 1].CustomerOrder : null,
      Details: [],
      CreatedDateTime: invoiceDate,
      LastModifiedDateTime: randomDate(invoiceDate, CONFIG.endDate)
    });
    invoices.push(invoice);
  }
  return invoices;
}

function generatePayments(count, customers, invoices) {
  const payments = [];
  const types = ['Payment', 'Payment', 'Prepayment', 'Refund'];
  const statuses = ['Open', 'Balanced', 'Closed', 'Closed'];
  const methods = ['CHECK', 'ACH', 'CREDIT CARD', 'WIRE', 'CASH'];

  for (let i = 1; i <= count; i++) {
    const customer = randomChoice(customers);
    const paymentDate = randomDate(CONFIG.startDate, CONFIG.endDate);
    const paymentAmount = randomFloat(100, 25000);
    const status = randomChoice(statuses);
    const appliedAmount = status === 'Closed' ? paymentAmount : randomFloat(0, paymentAmount);

    const payment = new Payment({
      Type: randomChoice(types),
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
      PaymentRef: `CHK-${randomInt(1000, 9999)}`,
      ApplicationHistory: [],
      CreatedDateTime: paymentDate
    });
    payments.push(payment);
  }
  return payments;
}

function generatePurchaseOrders(count, vendors, stockItems) {
  const orders = [];
  const types = ['Normal', 'Normal', 'Normal', 'DropShip', 'Blanket'];
  const statuses = ['Open', 'Open', 'Completed', 'Completed', 'Closed', 'Cancelled'];

  for (let i = 1; i <= count; i++) {
    const vendor = randomChoice(vendors);
    const poDate = randomDate(CONFIG.startDate, CONFIG.endDate);
    const promisedDate = new Date(poDate);
    promisedDate.setDate(promisedDate.getDate() + randomInt(7, 30));

    const lineCount = randomInt(1, 10);
    let orderTotal = 0;

    for (let j = 0; j < lineCount; j++) {
      const item = randomChoice(stockItems);
      const qty = randomInt(10, 100);
      const unitCost = item.LastCost * randomFloat(0.95, 1.05);
      orderTotal += qty * unitCost;
    }

    const taxTotal = orderTotal * 0.0875;

    const po = new PurchaseOrder({
      OrderType: randomChoice(types),
      OrderNbr: generatePONbr(i),
      VendorID: vendor.VendorID,
      Date: poDate,
      PromisedOn: promisedDate,
      Status: randomChoice(statuses),
      OrderTotal: orderTotal + taxTotal,
      TaxTotal: taxTotal,
      Details: [],
      Description: faker.lorem.sentence(),
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
  const sources = ['Web', 'Phone', 'Email', 'Referral', 'Partner', 'Trade Show', 'Advertisement'];

  for (let i = 1; i <= count; i++) {
    const customer = randomChoice(customers);
    const createdDate = randomDate(CONFIG.startDate, CONFIG.endDate);
    const closeDate = new Date(createdDate);
    closeDate.setDate(closeDate.getDate() + randomInt(30, 180));

    const status = randomChoice(statuses);
    const stage = status === 'Won' || status === 'Lost' ? 'Closed' : randomChoice(stages);

    let probability = 0;
    switch (stage) {
      case 'Prospect': probability = randomInt(10, 20); break;
      case 'Qualification': probability = randomInt(20, 40); break;
      case 'Needs Analysis': probability = randomInt(40, 60); break;
      case 'Proposal': probability = randomInt(60, 80); break;
      case 'Negotiation': probability = randomInt(80, 95); break;
      case 'Closed': probability = status === 'Won' ? 100 : 0; break;
    }

    const opportunity = new Opportunity({
      OpportunityID: `OPP-${String(i).padStart(6, '0')}`,
      Subject: faker.company.catchPhrase(),
      Status: status,
      Stage: stage,
      BusinessAccountID: customer.CustomerID,
      ContactID: customer.MainContact.DisplayName,
      Owner: `SALES${randomInt(1, 10)}`,
      EstimatedCloseDate: closeDate,
      Amount: randomFloat(5000, 500000),
      Probability: probability,
      Source: randomChoice(sources),
      CreatedDateTime: createdDate,
      LastModifiedDateTime: randomDate(createdDate, CONFIG.endDate)
    });
    opportunities.push(opportunity);
  }
  return opportunities;
}

function generateShipments(count, customers, salesOrders) {
  const shipments = [];
  const statuses = ['Open', 'Confirmed', 'Shipped', 'Shipped', 'Invoiced'];
  const carriers = ['UPS', 'FEDEX', 'USPS', 'DHL', 'FREIGHT'];
  const warehouses = ['MAIN', 'WEST', 'EAST', 'SOUTH'];

  for (let i = 1; i <= count; i++) {
    const customer = randomChoice(customers);
    const shipDate = randomDate(CONFIG.startDate, CONFIG.endDate);
    const status = randomChoice(statuses);

    const shipment = new Shipment({
      ShipmentNbr: generateShipmentNbr(i),
      Type: 'Shipment',
      CustomerID: customer.CustomerID,
      ShipmentDate: shipDate,
      Status: status,
      WarehouseID: randomChoice(warehouses),
      ShipVia: randomChoice(carriers),
      PackageCount: randomInt(1, 10),
      PackageWeight: randomFloat(1, 500, 1),
      TrackingNbr: `1Z${Math.random().toString(36).substring(2, 18).toUpperCase()}`,
      Details: [],
      CreatedDateTime: shipDate
    });
    shipments.push(shipment);
  }
  return shipments;
}

function generateJournalTransactions(count) {
  const transactions = [];
  const statuses = ['Hold', 'Balanced', 'Posted', 'Released'];
  const accounts = ['10100', '10200', '40100', '50100', '60100', '12100', '20100'];

  for (let i = 1; i <= count; i++) {
    const transDate = randomDate(CONFIG.startDate, CONFIG.endDate);
    const amount = randomFloat(1000, 100000);

    const transaction = new JournalTransaction({
      BatchNbr: generateBatchNbr(i),
      TransactionDate: transDate,
      PostPeriod: `${transDate.getFullYear()}${String(transDate.getMonth() + 1).padStart(2, '0')}`,
      Status: randomChoice(statuses),
      Description: faker.lorem.sentence(),
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
  console.log('Generating Acumatica ERP dummy data...\n');

  console.log('Generating Customers...');
  const customers = generateCustomers(CONFIG.customers);

  console.log('Generating Vendors...');
  const vendors = generateVendors(CONFIG.vendors);

  console.log('Generating Stock Items...');
  const stockItems = generateStockItems(CONFIG.stockItems);

  console.log('Generating Sales Orders...');
  const salesOrders = generateSalesOrders(CONFIG.salesOrders, customers, stockItems);

  console.log('Generating Invoices...');
  const invoices = generateInvoices(CONFIG.invoices, customers, salesOrders);

  console.log('Generating Payments...');
  const payments = generatePayments(CONFIG.payments, customers, invoices);

  console.log('Generating Purchase Orders...');
  const purchaseOrders = generatePurchaseOrders(CONFIG.purchaseOrders, vendors, stockItems);

  console.log('Generating Opportunities...');
  const opportunities = generateOpportunities(CONFIG.opportunities, customers);

  console.log('Generating Shipments...');
  const shipments = generateShipments(CONFIG.shipments, customers, salesOrders);

  console.log('Generating Journal Transactions...');
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

  console.log(`\n✓ Data generation complete!`);
  console.log(`✓ Generated ${Object.keys(data.metadata.counts).reduce((sum, key) => sum + data.metadata.counts[key], 0)} total records`);
  console.log(`✓ Data saved to: ${outputPath}\n`);

  return data;
}

// Run if called directly
if (require.main === module) {
  generateAllData();
}

module.exports = { generateAllData };
