import React, { useState } from 'react';
import { FileText, Clock, Package, AlertCircle, CheckCircle, Calendar, TrendingUp } from 'lucide-react';

const MarketAccessForecasting = () => {
  const [selectedTender, setSelectedTender] = useState(null);

  // Simulated tender data based on the PDF
  const tenderData = {
    summary: {
      activeTenders: 47,
      activeSuppliers: 13,
      totalValue: 2450000,
      pendingDeliveries: 12
    },
    tenders: [
      {
        id: 'CPSU5431/25',
        reference: 'CT2347/2022',
        product: 'ELECTROLYTES & TRACE ELEMENTS ADULT INFUSION',
        supplier: 'Fresenius Kabi Italia S.r.l',
        deliveryNo: 36978,
        stockCode: 'J346',
        quantityPacks: 114,
        unitsPerPack: 20,
        totalUnits: 2280,
        pricePerPack: 112.0,
        totalValue: 12745.20,
        deliveryDue: '2025-02-15',
        status: 'Pending First Delivery',
        daysUntilDelivery: 16,
        stockAtCPSU: 450,
        monthsOfStock: 3.2
      },
      {
        id: 'CPSU5432/25',
        reference: 'CT2347/2022',
        product: 'FLUOXETINE 20MG CAPSULES',
        supplier: 'NORMON LABORATORIES SA',
        deliveryNo: 25154,
        stockCode: 'A384',
        quantityPacks: 3848,
        unitsPerPack: 60,
        totalUnits: 230880,
        pricePerPack: 45.5,
        totalValue: 175084.0,
        deliveryDue: '2024-12-24',
        status: 'Active - Monthly Deliveries',
        daysUntilDelivery: 54,
        stockAtCPSU: 15200,
        monthsOfStock: 1.8,
        subsequentDeliveries: [
          { date: '2024-12-24', packs: 3848 },
          { date: '2025-01-21', packs: 3848 },
          { date: '2025-02-18', packs: 3848 }
        ]
      },
      {
        id: 'CPSU5433/25',
        reference: 'CT2348/2022',
        product: 'AMOXICILLIN 500MG CAPSULES',
        supplier: 'Sandoz Pharmaceuticals',
        deliveryNo: 25201,
        stockCode: 'B125',
        quantityPacks: 5200,
        unitsPerPack: 24,
        totalUnits: 124800,
        pricePerPack: 18.75,
        totalValue: 97500.0,
        deliveryDue: '2025-01-10',
        status: 'Active',
        daysUntilDelivery: 40,
        stockAtCPSU: 8400,
        monthsOfStock: 2.1
      },
      {
        id: 'CPSU5434/25',
        reference: 'CT2349/2022',
        product: 'INSULIN GLARGINE 100U/ML',
        supplier: 'Sanofi-Aventis',
        deliveryNo: 25210,
        stockCode: 'D442',
        quantityPacks: 1250,
        unitsPerPack: 5,
        totalUnits: 6250,
        pricePerPack: 185.0,
        totalValue: 231250.0,
        deliveryDue: '2025-02-05',
        status: 'Active',
        daysUntilDelivery: 35,
        stockAtCPSU: 2800,
        monthsOfStock: 4.5
      }
    ]
  };

  const getStatusColor = (status) => {
    if (status.includes('Pending')) return '#f59e0b';
    if (status.includes('Active')) return '#10b981';
    if (status.includes('Overdue')) return '#ef4444';
    return '#6366f1';
  };

  const getStockLevelColor = (months) => {
    if (months < 2) return '#ef4444';
    if (months < 3) return '#f59e0b';
    return '#10b981';
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Market Access - Government Tenders</h1>
        <p className="page-subtitle">
          Active government COOs - Inventory management and tender delivery tracking
        </p>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-4">
        <div className="kpi-card info">
          <div className="kpi-label">
            <FileText size={18} />
            Active Tenders
          </div>
          <div className="kpi-value">{tenderData.summary.activeTenders}</div>
          <div className="kpi-change">Government COOs</div>
        </div>
        <div className="kpi-card success">
          <div className="kpi-label">
            <CheckCircle size={18} />
            Active Suppliers
          </div>
          <div className="kpi-value">{tenderData.summary.activeSuppliers}</div>
          <div className="kpi-change">Contracted partners</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">
            <TrendingUp size={18} />
            Total Tender Value
          </div>
          <div className="kpi-value">€{(tenderData.summary.totalValue / 1000).toFixed(0)}K</div>
          <div className="kpi-change">Annual contract value</div>
        </div>
        <div className="kpi-card warning">
          <div className="kpi-label">
            <Clock size={18} />
            Pending Deliveries
          </div>
          <div className="kpi-value">{tenderData.summary.pendingDeliveries}</div>
          <div className="kpi-change">Awaiting fulfillment</div>
        </div>
      </div>

      {/* Business Unit Info */}
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="card-header">
          <h3 className="card-title">Market Access Business Unit</h3>
          <p className="card-subtitle">Government tender specifications</p>
        </div>
        <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          <div style={{
            padding: '20px',
            background: 'rgba(99, 102, 241, 0.1)',
            borderRadius: '12px',
            border: '1px solid #e0e7ff',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#6366f1', marginBottom: '8px' }}>
              47
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280', fontWeight: 600 }}>
              Active Tenders
            </div>
            <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
              Government COOs
            </div>
          </div>
          <div style={{
            padding: '20px',
            background: 'rgba(16, 185, 129, 0.1)',
            borderRadius: '12px',
            border: '1px solid #d1fae5',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#10b981', marginBottom: '8px' }}>
              13
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280', fontWeight: 600 }}>
              Suppliers
            </div>
            <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
              Contracted partners
            </div>
          </div>
          <div style={{
            padding: '20px',
            background: 'rgba(245, 158, 11, 0.1)',
            borderRadius: '12px',
            border: '1px solid #fed7aa',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#f59e0b', marginBottom: '8px' }}>
              1
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280', fontWeight: 600 }}>
              Customer
            </div>
            <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
              Central Procurement (CPSU)
            </div>
          </div>
        </div>
      </div>

      {/* Active Tenders Table */}
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="card-header">
          <h3 className="card-title">Active Government Tenders</h3>
          <p className="card-subtitle">COO tracking and delivery schedule management</p>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>CPSU Ref</th>
              <th>Product</th>
              <th>Supplier</th>
              <th>Delivery Due</th>
              <th>Quantity</th>
              <th>Total Value</th>
              <th>Stock @ CPSU</th>
              <th>Months</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tenderData.tenders.map((tender, index) => (
              <tr
                key={index}
                onClick={() => setSelectedTender(tender)}
                style={{ cursor: 'pointer' }}
              >
                <td style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: 600 }}>
                  {tender.id}
                </td>
                <td>
                  <div style={{ fontWeight: 600, marginBottom: '2px' }}>{tender.product}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    Stock Code: {tender.stockCode}
                  </div>
                </td>
                <td style={{ fontSize: '13px' }}>{tender.supplier}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} color="#6b7280" />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '13px' }}>
                        {new Date(tender.deliveryDue).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                      <div style={{ fontSize: '11px', color: '#6b7280' }}>
                        {tender.daysUntilDelivery} days
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ fontWeight: 600 }}>{tender.quantityPacks.toLocaleString()} packs</div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>
                    {tender.totalUnits.toLocaleString()} units
                  </div>
                </td>
                <td style={{ fontWeight: 600, color: '#111827' }}>
                  €{tender.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 600 }}>{tender.stockAtCPSU.toLocaleString()}</div>
                </td>
                <td>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    background: tender.monthsOfStock < 2 ? '#fee2e2' :
                               tender.monthsOfStock < 3 ? '#fed7aa' : '#d1fae5',
                    color: tender.monthsOfStock < 2 ? '#991b1b' :
                           tender.monthsOfStock < 3 ? '#92400e' : '#065f46'
                  }}>
                    {tender.monthsOfStock.toFixed(1)}M
                  </span>
                </td>
                <td>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600,
                    background: `${getStatusColor(tender.status)}1a`,
                    color: getStatusColor(tender.status)
                  }}>
                    {tender.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tender Detail Modal */}
      {selectedTender && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={() => setSelectedTender(null)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '12px',
              maxWidth: '900px',
              width: '90%',
              maxHeight: '90vh',
              overflow: 'auto',
              padding: '30px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ marginBottom: '20px', borderBottom: '2px solid #e5e7eb', paddingBottom: '15px' }}>
              <h2 style={{ margin: 0, marginBottom: '5px', fontSize: '24px', fontWeight: 600 }}>
                {selectedTender.product}
              </h2>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
                CPSU Reference: {selectedTender.id} | Contract: {selectedTender.reference}
              </p>
            </div>

            {/* Tender Details */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '24px' }}>
              <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>Delivery Number</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#111827' }}>
                  {selectedTender.deliveryNo}
                </div>
              </div>
              <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>Stock Code</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#111827', fontFamily: 'monospace' }}>
                  {selectedTender.stockCode}
                </div>
              </div>
              <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>Supplier</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>
                  {selectedTender.supplier}
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: 600 }}>Delivery Information</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                <div style={{
                  padding: '16px',
                  background: 'rgba(99, 102, 241, 0.1)',
                  borderRadius: '8px',
                  border: '1px solid #e0e7ff'
                }}>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>Delivery Due Date</div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '18px',
                    fontWeight: 600,
                    color: '#111827'
                  }}>
                    <Calendar size={20} color="#6366f1" />
                    {new Date(selectedTender.deliveryDue).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                    {selectedTender.daysUntilDelivery} days until delivery
                  </div>
                </div>
                <div style={{
                  padding: '16px',
                  background: `${getStatusColor(selectedTender.status)}1a`,
                  borderRadius: '8px',
                  border: `1px solid ${getStatusColor(selectedTender.status)}40`
                }}>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>Tender Status</div>
                  <div style={{
                    fontSize: '18px',
                    fontWeight: 600,
                    color: getStatusColor(selectedTender.status)
                  }}>
                    {selectedTender.status}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: 600 }}>Order Quantities</h4>
              <table style={{ width: '100%', fontSize: '14px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>Metric</th>
                    <th style={{ padding: '12px', textAlign: 'right', fontWeight: 600 }}>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px' }}>Quantity in Packs</td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: 600 }}>
                      {selectedTender.quantityPacks.toLocaleString()} packs
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px' }}>Units per Pack</td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: 600 }}>
                      {selectedTender.unitsPerPack}
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px' }}>Total Units</td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: 700, color: '#6366f1' }}>
                      {selectedTender.totalUnits.toLocaleString()} units
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px' }}>Price per Pack</td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: 600 }}>
                      €{selectedTender.pricePerPack.toFixed(2)}
                    </td>
                  </tr>
                  <tr style={{ background: '#f9fafb' }}>
                    <td style={{ padding: '12px', fontWeight: 700 }}>Total Order Value</td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: 700, fontSize: '16px', color: '#10b981' }}>
                      €{selectedTender.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Inventory Status */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: 600 }}>Current Inventory @ CPSU</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>Stock on Hand</div>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: '#111827' }}>
                    {selectedTender.stockAtCPSU.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                    units available
                  </div>
                </div>
                <div style={{
                  padding: '16px',
                  background: selectedTender.monthsOfStock < 2 ? '#fee2e2' :
                             selectedTender.monthsOfStock < 3 ? '#fed7aa' : '#d1fae5',
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: selectedTender.monthsOfStock < 2 ? '#fecaca' :
                              selectedTender.monthsOfStock < 3 ? '#fdba74' : '#a7f3d0'
                }}>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>Months of Stock</div>
                  <div style={{
                    fontSize: '24px',
                    fontWeight: 700,
                    color: selectedTender.monthsOfStock < 2 ? '#991b1b' :
                           selectedTender.monthsOfStock < 3 ? '#92400e' : '#065f46'
                  }}>
                    {selectedTender.monthsOfStock.toFixed(1)}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                    {selectedTender.monthsOfStock < 2 ? 'Critical - Order Soon' :
                     selectedTender.monthsOfStock < 3 ? 'Low Stock' : 'Adequate Supply'}
                  </div>
                </div>
              </div>
            </div>

            {/* Subsequent Deliveries */}
            {selectedTender.subsequentDeliveries && (
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: 600 }}>Scheduled Deliveries</h4>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', fontSize: '14px', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>Delivery Date</th>
                        <th style={{ padding: '12px', textAlign: 'right', fontWeight: 600 }}>Quantity (Packs)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedTender.subsequentDeliveries.map((delivery, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                          <td style={{ padding: '12px' }}>
                            {new Date(delivery.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right', fontWeight: 600 }}>
                            {delivery.packs.toLocaleString()} packs
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Close button */}
            <button
              onClick={() => setSelectedTender(null)}
              style={{
                width: '100%',
                padding: '12px',
                background: '#6366f1',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.background = '#4f46e5'}
              onMouseLeave={(e) => e.target.style.background = '#6366f1'}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketAccessForecasting;
