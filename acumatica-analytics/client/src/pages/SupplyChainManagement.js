import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Building2, FileText, Calendar, Clock, Package as PackageIcon, AlertCircle, CheckCircle } from 'lucide-react';

const SupplyChainManagement = () => {
  const [supplierData, setSupplierData] = useState(null);
  const [tenderData, setTenderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('suppliers'); // 'suppliers' or 'tenders'
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [selectedTender, setSelectedTender] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [supplierRes] = await Promise.all([
        axios.get('http://localhost:3002/api/analytics/supplier-scorecards')
      ]);
      setSupplierData(supplierRes.data);

      // Simulated tender data
      setTenderData({
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
            monthsOfStock: 3.2,
            subsequentDeliveries: [
              { date: '2024-12-24', packs: 3848 },
              { date: '2025-01-21', packs: 3848 },
              { date: '2025-02-18', packs: 3848 }
            ]
          },
          {
            id: 'CPSU5432/25',
            reference: 'CT2348/2022',
            product: 'GLUCOSE 5% INFUSION SOLUTION',
            supplier: 'B. Braun Medical Ltd',
            deliveryNo: 36979,
            stockCode: 'J347',
            quantityPacks: 200,
            unitsPerPack: 10,
            totalUnits: 2000,
            pricePerPack: 45.50,
            totalValue: 9100.00,
            deliveryDue: '2025-02-20',
            status: 'Active - Monthly Deliveries',
            daysUntilDelivery: 21,
            stockAtCPSU: 850,
            monthsOfStock: 5.1,
            subsequentDeliveries: [
              { date: '2025-03-20', packs: 200 },
              { date: '2025-04-20', packs: 200 }
            ]
          }
        ]
      });

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-MT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(value);
  };

  const getRatingColor = (rating) => {
    const colors = {
      'Excellent': '#10b981',
      'Good': '#6366f1',
      'Satisfactory': '#f59e0b',
      'Needs Improvement': '#f97316',
      'Poor': '#ef4444'
    };
    return colors[rating] || '#6b7280';
  };

  const getStockLevelColor = (months) => {
    if (months < 2) return '#ef4444';
    if (months < 3) return '#f59e0b';
    return '#10b981';
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Supply Chain Management</h1>
        <p className="page-subtitle">Supplier performance, government tenders, and procurement tracking</p>
      </div>

      {/* View Toggle */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
        <span style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>View:</span>
        <button
          onClick={() => setActiveView('suppliers')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: activeView === 'suppliers' ? '2px solid #6366f1' : '1px solid #e5e7eb',
            background: activeView === 'suppliers' ? '#eff6ff' : 'white',
            color: activeView === 'suppliers' ? '#6366f1' : '#6b7280',
            fontWeight: activeView === 'suppliers' ? '600' : '500',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Building2 size={16} />
          Supplier Performance
        </button>
        <button
          onClick={() => setActiveView('tenders')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: activeView === 'tenders' ? '2px solid #10b981' : '1px solid #e5e7eb',
            background: activeView === 'tenders' ? '#f0fdf4' : 'white',
            color: activeView === 'tenders' ? '#10b981' : '#6b7280',
            fontWeight: activeView === 'tenders' ? '600' : '500',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <FileText size={16} />
          Market Access Tenders
        </button>
      </div>

      {activeView === 'suppliers' ? (
        <>
          <div className="grid grid-cols-4">
            <div className="kpi-card info">
              <div className="kpi-label">Total Suppliers</div>
              <div className="kpi-value">{supplierData?.summary?.totalSuppliers || 0}</div>
              <div className="kpi-change">Active pharmaceutical suppliers</div>
            </div>
            <div className="kpi-card success">
              <div className="kpi-label">Excellent Performers</div>
              <div className="kpi-value">{supplierData?.summary?.excellentSuppliers || 0}</div>
              <div className="kpi-change">Score 90+ (top tier)</div>
            </div>
            <div className="kpi-card warning">
              <div className="kpi-label">Avg On-Time Delivery</div>
              <div className="kpi-value">{supplierData?.summary?.avgOnTimeDelivery?.toFixed(1) || 0}%</div>
              <div className="kpi-change">Target: 95%</div>
            </div>
            <div className="kpi-card danger">
              <div className="kpi-label">High Risk Suppliers</div>
              <div className="kpi-value">{supplierData?.summary?.atRiskSuppliers || 0}</div>
              <div className="kpi-change">Require attention</div>
            </div>
          </div>

          <div className="grid grid-cols-2" style={{ marginTop: '20px' }}>
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Top 5 Performing Suppliers</h3>
                <p className="card-subtitle">Highest overall performance scores</p>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Supplier</th>
                    <th>Score</th>
                    <th>On-Time %</th>
                    <th>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {supplierData?.topPerformers?.map((supplier, index) => (
                    <tr key={index}>
                      <td style={{ fontWeight: 600, fontSize: '16px' }}>{index + 1}</td>
                      <td>{supplier.vendorName}</td>
                      <td>
                        <span className="badge success">{supplier.overallScore}</span>
                      </td>
                      <td>{supplier.onTimeDeliveryRate?.toFixed(1)}%</td>
                      <td>
                        <span style={{ color: getRatingColor(supplier.rating), fontWeight: 600 }}>
                          {supplier.rating}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Bottom 5 Performing Suppliers</h3>
                <p className="card-subtitle">Lowest overall performance scores - action required</p>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Supplier</th>
                    <th>Score</th>
                    <th>On-Time %</th>
                    <th>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {supplierData?.bottomPerformers?.map((supplier, index) => (
                    <tr key={index} style={{ background: '#fef2f2' }}>
                      <td style={{ fontWeight: 600, fontSize: '16px' }}>{supplierData?.scorecards?.length - index}</td>
                      <td>{supplier.vendorName}</td>
                      <td>
                        <span className="badge danger">{supplier.overallScore}</span>
                      </td>
                      <td>{supplier.onTimeDeliveryRate?.toFixed(1)}%</td>
                      <td>
                        <span style={{ color: getRatingColor(supplier.rating), fontWeight: 600 }}>
                          {supplier.rating}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card" style={{ marginTop: '20px' }}>
            <div className="card-header">
              <h3 className="card-title">Supplier Performance Comparison (Top 10)</h3>
              <p className="card-subtitle">Multi-dimensional scorecard comparison</p>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={supplierData?.comparison || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="supplier" angle={-45} textAnchor="end" height={100} />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="onTimeDelivery" fill="#6366f1" name="On-Time Delivery %" />
                <Bar dataKey="quality" fill="#10b981" name="Quality Score" />
                <Bar dataKey="price" fill="#f59e0b" name="Price Competitiveness" />
                <Bar dataKey="overall" fill="#8b5cf6" name="Overall Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-4">
            <div className="kpi-card info">
              <div className="kpi-label">Active Tenders</div>
              <div className="kpi-value">{tenderData.summary.activeTenders}</div>
              <div className="kpi-change">Government COOs</div>
            </div>
            <div className="kpi-card success">
              <div className="kpi-label">Active Suppliers</div>
              <div className="kpi-value">{tenderData.summary.activeSuppliers}</div>
              <div className="kpi-change">Market Access partners</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Total Value</div>
              <div className="kpi-value">{formatCurrency(tenderData.summary.totalValue)}</div>
              <div className="kpi-change">Active tender value</div>
            </div>
            <div className="kpi-card warning">
              <div className="kpi-label">Pending Deliveries</div>
              <div className="kpi-value">{tenderData.summary.pendingDeliveries}</div>
              <div className="kpi-change">First deliveries due</div>
            </div>
          </div>

          <div className="card" style={{ marginTop: '20px' }}>
            <div className="card-header">
              <h3 className="card-title">Business Unit Overview</h3>
              <p className="card-subtitle">Market Access - Government Tenders</p>
            </div>
            <div style={{ padding: '20px', background: '#f9fafb', borderRadius: '8px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Active Tenders</div>
                <div style={{ fontSize: '24px', fontWeight: 600, color: '#111827' }}>{tenderData.summary.activeTenders}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Active Suppliers</div>
                <div style={{ fontSize: '24px', fontWeight: 600, color: '#111827' }}>{tenderData.summary.activeSuppliers}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Customer</div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#111827' }}>CPSU (Central Procurement)</div>
              </div>
            </div>
          </div>

          <div className="card" style={{ marginTop: '20px' }}>
            <div className="card-header">
              <h3 className="card-title">Active Government Tenders</h3>
              <p className="card-subtitle">COO tracking and delivery management</p>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>COO Reference</th>
                  <th>Product</th>
                  <th>Supplier</th>
                  <th>Delivery Due</th>
                  <th>Status</th>
                  <th>Stock @ CPSU</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tenderData.tenders.map((tender, index) => (
                  <tr key={index}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{tender.id}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>{tender.reference}</div>
                    </td>
                    <td>{tender.product}</td>
                    <td>{tender.supplier}</td>
                    <td>
                      <div>{tender.deliveryDue}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>{tender.daysUntilDelivery} days</div>
                    </td>
                    <td>
                      <span className={`badge ${tender.status.includes('Pending') ? 'warning' : 'success'}`}>
                        {tender.status}
                      </span>
                    </td>
                    <td>
                      <div>{tender.stockAtCPSU} units</div>
                      <div style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: getStockLevelColor(tender.monthsOfStock)
                      }}>
                        {tender.monthsOfStock.toFixed(1)} months
                      </div>
                    </td>
                    <td>
                      <button
                        onClick={() => setSelectedTender(tender)}
                        style={{
                          padding: '4px 12px',
                          borderRadius: '6px',
                          border: '1px solid #e5e7eb',
                          background: 'white',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        View Details
                      </button>
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
                background: 'rgba(0,0,0,0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '20px'
              }}
              onClick={() => setSelectedTender(null)}
            >
              <div
                className="card"
                style={{
                  maxWidth: '900px',
                  width: '100%',
                  maxHeight: '85vh',
                  overflow: 'auto',
                  position: 'relative',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="card-header" style={{ position: 'sticky', top: 0, background: 'white', zIndex: 10, borderBottom: '1px solid #e5e7eb', paddingRight: '50px' }}>
                  <h3 className="card-title">{selectedTender.id} - Tender Details</h3>
                  <p className="card-subtitle">Government tender delivery and stock information</p>
                  <button
                    style={{
                      position: 'absolute',
                      top: '20px',
                      right: '20px',
                      width: '32px',
                      height: '32px',
                      background: '#f3f4f6',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '20px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s',
                      color: '#6b7280',
                      fontWeight: 'bold'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#ef4444';
                      e.target.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = '#f3f4f6';
                      e.target.style.color = '#6b7280';
                    }}
                    onClick={() => setSelectedTender(null)}
                  >
                    ×
                  </button>
                </div>
                <div style={{ padding: '20px' }}>
                  <div className="grid grid-cols-2" style={{ gap: '15px', marginBottom: '20px' }}>
                    <div>
                      <strong>Product:</strong> {selectedTender.product}
                    </div>
                    <div>
                      <strong>Supplier:</strong> {selectedTender.supplier}
                    </div>
                    <div>
                      <strong>COO Reference:</strong> {selectedTender.reference}
                    </div>
                    <div>
                      <strong>Delivery No:</strong> {selectedTender.deliveryNo}
                    </div>
                    <div>
                      <strong>Stock Code:</strong> {selectedTender.stockCode}
                    </div>
                    <div>
                      <strong>Status:</strong> {selectedTender.status}
                    </div>
                  </div>

                  <h4 style={{ marginTop: '20px', marginBottom: '10px' }}>Delivery Details</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                    <div style={{ padding: '10px', background: '#f9fafb', borderRadius: '6px' }}>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>Quantity (Packs)</div>
                      <div style={{ fontSize: '20px', fontWeight: 600 }}>{selectedTender.quantityPacks}</div>
                    </div>
                    <div style={{ padding: '10px', background: '#f9fafb', borderRadius: '6px' }}>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>Units per Pack</div>
                      <div style={{ fontSize: '20px', fontWeight: 600 }}>{selectedTender.unitsPerPack}</div>
                    </div>
                    <div style={{ padding: '10px', background: '#f9fafb', borderRadius: '6px' }}>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>Total Units</div>
                      <div style={{ fontSize: '20px', fontWeight: 600 }}>{selectedTender.totalUnits}</div>
                    </div>
                    <div style={{ padding: '10px', background: '#f9fafb', borderRadius: '6px' }}>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>Total Value</div>
                      <div style={{ fontSize: '20px', fontWeight: 600 }}>{formatCurrency(selectedTender.totalValue)}</div>
                    </div>
                  </div>

                  <h4 style={{ marginTop: '20px', marginBottom: '10px' }}>Stock @ CPSU</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                    <div style={{ padding: '10px', background: '#f9fafb', borderRadius: '6px' }}>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>Current Stock</div>
                      <div style={{ fontSize: '20px', fontWeight: 600 }}>{selectedTender.stockAtCPSU} units</div>
                    </div>
                    <div style={{ padding: '10px', background: '#f9fafb', borderRadius: '6px' }}>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>Months of Stock</div>
                      <div style={{ fontSize: '20px', fontWeight: 600, color: getStockLevelColor(selectedTender.monthsOfStock) }}>
                        {selectedTender.monthsOfStock.toFixed(1)} months
                      </div>
                    </div>
                  </div>

                  <h4 style={{ marginTop: '20px', marginBottom: '10px' }}>Subsequent Deliveries</h4>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Delivery Date</th>
                        <th>Quantity (Packs)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedTender.subsequentDeliveries.map((delivery, i) => (
                        <tr key={i}>
                          <td>{delivery.date}</td>
                          <td>{delivery.packs}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SupplyChainManagement;
