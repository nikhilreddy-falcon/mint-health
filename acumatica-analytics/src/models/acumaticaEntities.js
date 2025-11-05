/**
 * Acumatica ERP Entity Models
 * Based on Acumatica Integration Development Guide metadata
 */

// Customer Entity (based on Contract-Based API)
class Customer {
  constructor(data = {}) {
    this.CustomerID = data.CustomerID || null;
    this.CustomerName = data.CustomerName || null;
    this.Status = data.Status || 'Active'; // Active, Inactive, Hold
    this.CustomerClass = data.CustomerClass || null;
    this.CreditLimit = data.CreditLimit || 0;
    this.CurrentBalance = data.CurrentBalance || 0;
    this.OverdueBalance = data.OverdueBalance || 0;
    this.UnreleasedBalance = data.UnreleasedBalance || 0;
    this.MainContact = {
      DisplayName: data.MainContact?.DisplayName || null,
      Email: data.MainContact?.Email || null,
      Phone1: data.MainContact?.Phone1 || null,
      Attention: data.MainContact?.Attention || null
    };
    this.BillingAddress = {
      AddressLine1: data.BillingAddress?.AddressLine1 || null,
      AddressLine2: data.BillingAddress?.AddressLine2 || null,
      City: data.BillingAddress?.City || null,
      State: data.BillingAddress?.State || null,
      PostalCode: data.BillingAddress?.PostalCode || null,
      Country: data.BillingAddress?.Country || 'US'
    };
    this.Terms = data.Terms || 'Net 30';
    this.CreatedDateTime = data.CreatedDateTime || new Date();
    this.LastModifiedDateTime = data.LastModifiedDateTime || new Date();
    this.rowNumber = data.rowNumber || null;
    this.note = data.note || null;
  }
}

// Sales Order Entity
class SalesOrder {
  constructor(data = {}) {
    this.OrderType = data.OrderType || 'SO'; // SO = Sales Order
    this.OrderNbr = data.OrderNbr || null;
    this.CustomerID = data.CustomerID || null;
    this.CustomerOrder = data.CustomerOrder || null;
    this.Date = data.Date || new Date();
    this.RequestedOn = data.RequestedOn || new Date();
    this.Status = data.Status || 'Open'; // Open, Hold, CreditHold, Completed, Cancelled
    this.OrderTotal = data.OrderTotal || 0;
    this.TaxTotal = data.TaxTotal || 0;
    this.OrderQty = data.OrderQty || 0;
    this.Details = data.Details || []; // Line items
    this.BillToAddress = data.BillToAddress || {};
    this.ShipToAddress = data.ShipToAddress || {};
    this.Description = data.Description || null;
    this.ShipVia = data.ShipVia || null;
    this.CreatedDateTime = data.CreatedDateTime || new Date();
    this.LastModifiedDateTime = data.LastModifiedDateTime || new Date();
  }
}

// Sales Order Detail (Line Item)
class SalesOrderDetail {
  constructor(data = {}) {
    this.LineNbr = data.LineNbr || null;
    this.InventoryID = data.InventoryID || null;
    this.OrderQty = data.OrderQty || 0;
    this.UOM = data.UOM || 'EACH';
    this.UnitPrice = data.UnitPrice || 0;
    this.ExtendedPrice = data.ExtendedPrice || 0;
    this.DiscountPercent = data.DiscountPercent || 0;
    this.DiscountAmount = data.DiscountAmount || 0;
    this.TaxCategory = data.TaxCategory || null;
    this.WarehouseID = data.WarehouseID || null;
  }
}

// Invoice Entity
class Invoice {
  constructor(data = {}) {
    this.Type = data.Type || 'Invoice'; // Invoice, Credit Memo, Debit Memo
    this.ReferenceNbr = data.ReferenceNbr || null;
    this.CustomerID = data.CustomerID || null;
    this.Date = data.Date || new Date();
    this.DueDate = data.DueDate || new Date();
    this.PostPeriod = data.PostPeriod || null;
    this.Status = data.Status || 'Open'; // Hold, Balanced, Open, Closed
    this.Amount = data.Amount || 0;
    this.Balance = data.Balance || 0;
    this.TaxTotal = data.TaxTotal || 0;
    this.Description = data.Description || null;
    this.CustomerOrder = data.CustomerOrder || null;
    this.Details = data.Details || [];
    this.CreatedDateTime = data.CreatedDateTime || new Date();
    this.LastModifiedDateTime = data.LastModifiedDateTime || new Date();
  }
}

// Payment Entity
class Payment {
  constructor(data = {}) {
    this.Type = data.Type || 'Payment'; // Payment, Prepayment, Refund
    this.ReferenceNbr = data.ReferenceNbr || null;
    this.CustomerID = data.CustomerID || null;
    this.ApplicationDate = data.ApplicationDate || new Date();
    this.PaymentDate = data.PaymentDate || new Date();
    this.Status = data.Status || 'Open'; // Hold, Balanced, Open, Closed
    this.PaymentAmount = data.PaymentAmount || 0;
    this.AppliedToDocuments = data.AppliedToDocuments || 0;
    this.UnappliedBalance = data.UnappliedBalance || 0;
    this.PaymentMethod = data.PaymentMethod || null;
    this.CashAccount = data.CashAccount || null;
    this.PaymentRef = data.PaymentRef || null;
    this.ApplicationHistory = data.ApplicationHistory || [];
    this.CreatedDateTime = data.CreatedDateTime || new Date();
  }
}

// Stock Item (Inventory)
class StockItem {
  constructor(data = {}) {
    this.InventoryID = data.InventoryID || null;
    this.Description = data.Description || null;
    this.ItemStatus = data.ItemStatus || 'Active'; // Active, Inactive, NoSales, NoPurchases
    this.ItemClass = data.ItemClass || null;
    this.BaseUOM = data.BaseUOM || 'EACH';
    this.DefaultPrice = data.DefaultPrice || 0;
    this.LastCost = data.LastCost || 0;
    this.QtyOnHand = data.QtyOnHand || 0;
    this.QtyAvailable = data.QtyAvailable || 0;
    this.QtyOnOrder = data.QtyOnOrder || 0;
    this.MinQty = data.MinQty || 0;
    this.MaxQty = data.MaxQty || 0;
    this.ReorderPoint = data.ReorderPoint || 0;
    this.DefaultWarehouseID = data.DefaultWarehouseID || null;
    this.ProductManagerID = data.ProductManagerID || null;
    this.CreatedDateTime = data.CreatedDateTime || new Date();
    this.LastModifiedDateTime = data.LastModifiedDateTime || new Date();
  }
}

// Purchase Order Entity
class PurchaseOrder {
  constructor(data = {}) {
    this.OrderType = data.OrderType || 'Normal'; // Normal, DropShip, Blanket
    this.OrderNbr = data.OrderNbr || null;
    this.VendorID = data.VendorID || null;
    this.Date = data.Date || new Date();
    this.PromisedOn = data.PromisedOn || null;
    this.Status = data.Status || 'Open'; // Hold, Open, Completed, Closed, Cancelled
    this.OrderTotal = data.OrderTotal || 0;
    this.TaxTotal = data.TaxTotal || 0;
    this.Details = data.Details || [];
    this.Description = data.Description || null;
    this.VendorRef = data.VendorRef || null;
    this.CreatedDateTime = data.CreatedDateTime || new Date();
  }
}

// Vendor Entity
class Vendor {
  constructor(data = {}) {
    this.VendorID = data.VendorID || null;
    this.VendorName = data.VendorName || null;
    this.Status = data.Status || 'Active';
    this.VendorClass = data.VendorClass || null;
    this.CreditLimit = data.CreditLimit || 0;
    this.Balance = data.Balance || 0;
    this.MainContact = {
      DisplayName: data.MainContact?.DisplayName || null,
      Email: data.MainContact?.Email || null,
      Phone1: data.MainContact?.Phone1 || null
    };
    this.RemitAddress = data.RemitAddress || {};
    this.PaymentMethod = data.PaymentMethod || null;
    this.Terms = data.Terms || 'Net 30';
    this.CreatedDateTime = data.CreatedDateTime || new Date();
  }
}

// Journal Transaction
class JournalTransaction {
  constructor(data = {}) {
    this.BatchNbr = data.BatchNbr || null;
    this.TransactionDate = data.TransactionDate || new Date();
    this.PostPeriod = data.PostPeriod || null;
    this.Status = data.Status || 'Balanced'; // Hold, Balanced, Posted, Released
    this.Description = data.Description || null;
    this.CurrencyID = data.CurrencyID || 'USD';
    this.ControlTotal = data.ControlTotal || 0;
    this.DebitTotal = data.DebitTotal || 0;
    this.CreditTotal = data.CreditTotal || 0;
    this.Details = data.Details || [];
    this.CreatedDateTime = data.CreatedDateTime || new Date();
  }
}

// Opportunity (CRM)
class Opportunity {
  constructor(data = {}) {
    this.OpportunityID = data.OpportunityID || null;
    this.Subject = data.Subject || null;
    this.Status = data.Status || 'Open'; // Open, Won, Lost
    this.Stage = data.Stage || 'Prospect'; // Prospect, Qualification, Needs Analysis, Proposal, Negotiation, Closed
    this.BusinessAccountID = data.BusinessAccountID || null;
    this.ContactID = data.ContactID || null;
    this.Owner = data.Owner || null;
    this.EstimatedCloseDate = data.EstimatedCloseDate || null;
    this.Amount = data.Amount || 0;
    this.Probability = data.Probability || 0;
    this.Source = data.Source || null; // Web, Phone, Email, Referral, etc.
    this.CreatedDateTime = data.CreatedDateTime || new Date();
    this.LastModifiedDateTime = data.LastModifiedDateTime || new Date();
  }
}

// Shipment Entity
class Shipment {
  constructor(data = {}) {
    this.ShipmentNbr = data.ShipmentNbr || null;
    this.Type = data.Type || 'Shipment'; // Shipment, Transfer, Receipt
    this.CustomerID = data.CustomerID || null;
    this.ShipmentDate = data.ShipmentDate || new Date();
    this.Status = data.Status || 'Open'; // Open, Confirmed, Shipped, Invoiced
    this.WarehouseID = data.WarehouseID || null;
    this.ShipVia = data.ShipVia || null;
    this.PackageCount = data.PackageCount || 0;
    this.PackageWeight = data.PackageWeight || 0;
    this.TrackingNbr = data.TrackingNbr || null;
    this.Details = data.Details || [];
    this.CreatedDateTime = data.CreatedDateTime || new Date();
  }
}

module.exports = {
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
};
