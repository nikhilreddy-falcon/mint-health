import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Area
} from 'recharts';
import { TrendingUp, TrendingDown, Package, Calendar } from 'lucide-react';

const AdvancedForecasting = () => {
  const [data, setData] = useState(null);
  const [businessUnit, setBusinessUnit] = useState('PHARMA');
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchData();
  }, [businessUnit]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:7006/api/analytics/advanced-forecasting?businessUnit=${businessUnit}&topN=20`);
      setData(response.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-MT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(value);
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  const hasData = data && data.forecasts && data.forecasts.length > 0;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Demand Forecasting</h1>
        <p className="page-subtitle">
          Rolling average forecasting for inventory management and demand planning
        </p>
      </div>

      {/* Business Unit Selector */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '10px', fontWeight: 600, fontSize: '14px', color: '#374151' }}>
          Business Unit:
        </label>
        <select
          value={businessUnit}
          onChange={(e) => setBusinessUnit(e.target.value)}
          style={{
            padding: '10px 15px',
            borderRadius: '6px',
            border: '1px solid #e5e7eb',
            fontSize: '14px',
            fontWeight: 500,
            color: '#111827'
          }}
        >
          <option value="PHARMA">Private Market - Pharmaceutical Distribution</option>
          <option value="WELLNESS">Private Market - Vitamins & Supplements</option>
          <option value="PHARMACY">Private Market - Mint Care Pharmacy</option>
          <option value="MARKET_ACCESS">Market Access - Government Tenders</option>
        </select>
      </div>

      {!hasData && (
        <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
          <h3 style={{ marginBottom: '15px', color: '#f59e0b' }}>Insufficient Historical Data</h3>
          <p style={{ color: '#6b7280', marginBottom: '10px' }}>
            Demand forecasting requires at least 3 months of sales history per product.
          </p>
          <p style={{ color: '#6b7280' }}>
            As more data is collected, forecasts will become available.
          </p>
        </div>
      )}

      {hasData && (
        <>
          {/* Summary KPIs */}
          <div className="grid grid-cols-4">
            <div className="kpi-card info">
              <div className="kpi-label">
                <Package size={18} />
                Products Tracked
              </div>
              <div className="kpi-value">{data?.summary?.totalProducts || 0}</div>
              <div className="kpi-change">Active SKUs with forecasts</div>
            </div>
            <div className="kpi-card success">
              <div className="kpi-label">
                <TrendingUp size={18} />
                Growing Demand
              </div>
              <div className="kpi-value">{data?.summary?.trendDistribution?.upward || 0}</div>
              <div className="kpi-change positive">Products with increasing demand</div>
            </div>
            <div className="kpi-card warning">
              <div className="kpi-label">
                <TrendingDown size={18} />
                Declining Demand
              </div>
              <div className="kpi-value">{data?.summary?.trendDistribution?.downward || 0}</div>
              <div className="kpi-change negative">Products needing attention</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">
                <Calendar size={18} />
                Seasonal Products
              </div>
              <div className="kpi-value">{data?.summary?.seasonalProducts || 0}</div>
              <div className="kpi-change">Detected patterns</div>
            </div>
          </div>

          {/* Demand Trend Distribution */}
          <div className="card" style={{ marginTop: '20px' }}>
            <div className="card-header">
              <h3 className="card-title">Demand Trend Analysis</h3>
              <p className="card-subtitle">Product demand trends across portfolio</p>
            </div>
            <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
              <div style={{
                padding: '24px',
                background: 'rgba(16, 185, 129, 0.1)',
                borderRadius: '12px',
                textAlign: 'center',
                border: '1px solid #d1fae5'
              }}>
                <TrendingUp size={32} style={{ color: '#10b981', margin: '0 auto 12px' }} />
                <div style={{ fontSize: '32px', fontWeight: 700, color: '#10b981' }}>
                  {data?.summary?.trendDistribution?.upward || 0}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '8px', fontWeight: 600 }}>
                  Growing Demand
                </div>
                <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                  Increase stock levels
                </div>
              </div>
              <div style={{
                padding: '24px',
                background: 'rgba(99, 102, 241, 0.1)',
                borderRadius: '12px',
                textAlign: 'center',
                border: '1px solid #e0e7ff'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  background: '#6366f1',
                  borderRadius: '50%',
                  margin: '0 auto 12px'
                }} />
                <div style={{ fontSize: '32px', fontWeight: 700, color: '#6366f1' }}>
                  {data?.summary?.trendDistribution?.stable || 0}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '8px', fontWeight: 600 }}>
                  Stable Demand
                </div>
                <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                  Maintain current levels
                </div>
              </div>
              <div style={{
                padding: '24px',
                background: 'rgba(239, 68, 68, 0.1)',
                borderRadius: '12px',
                textAlign: 'center',
                border: '1px solid #fee2e2'
              }}>
                <TrendingDown size={32} style={{ color: '#ef4444', margin: '0 auto 12px' }} />
                <div style={{ fontSize: '32px', fontWeight: 700, color: '#ef4444' }}>
                  {data?.summary?.trendDistribution?.downward || 0}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '8px', fontWeight: 600 }}>
                  Declining Demand
                </div>
                <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                  Reduce ordering
                </div>
              </div>
            </div>
          </div>

          {/* Product Forecasts Table */}
          <div className="card" style={{ marginTop: '20px' }}>
            <div className="card-header">
              <h3 className="card-title">Product Demand Forecasts</h3>
              <p className="card-subtitle">Rolling average forecasts based on historical sales data</p>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>SKU Code</th>
                  <th>Product Name</th>
                  <th>Current Stock</th>
                  <th>Monthly Average</th>
                  <th>Months of Stock</th>
                  <th>Demand Trend</th>
                  <th>Seasonal</th>
                  <th>Next 3 Months Forecast</th>
                </tr>
              </thead>
              <tbody>
                {data?.forecasts?.map((forecast, index) => (
                  <tr
                    key={index}
                    onClick={() => setSelectedProduct(forecast)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: 600 }}>
                      {forecast.skuCode}
                    </td>
                    <td>{forecast.productName}</td>
                    <td style={{ fontWeight: 600 }}>{forecast.currentStock?.toLocaleString()}</td>
                    <td>{forecast.avgMonthlyDemand?.toLocaleString()}</td>
                    <td>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 600,
                        background: forecast.currentStock / forecast.avgMonthlyDemand < 2 ? '#fee2e2' :
                                   forecast.currentStock / forecast.avgMonthlyDemand < 4 ? '#fed7aa' : '#d1fae5',
                        color: forecast.currentStock / forecast.avgMonthlyDemand < 2 ? '#991b1b' :
                               forecast.currentStock / forecast.avgMonthlyDemand < 4 ? '#92400e' : '#065f46'
                      }}>
                        {(forecast.currentStock / forecast.avgMonthlyDemand).toFixed(1)} months
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {forecast.trend.type.includes('Upward') && <TrendingUp size={16} color="#10b981" />}
                        {forecast.trend.type.includes('Downward') && <TrendingDown size={16} color="#ef4444" />}
                        <span style={{
                          color: forecast.trend.type.includes('Upward') ? '#10b981' :
                                 forecast.trend.type.includes('Downward') ? '#ef4444' : '#6b7280',
                          fontWeight: 600,
                          fontSize: '12px'
                        }}>
                          {forecast.trend.type}
                        </span>
                      </div>
                    </td>
                    <td>
                      {forecast.seasonality.detected ? (
                        <span className="badge warning">
                          Yes
                        </span>
                      ) : (
                        <span style={{ color: '#9ca3af', fontSize: '12px' }}>No</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '5px', fontSize: '12px' }}>
                        {forecast.forecastMonths?.map((month, i) => (
                          <span key={i} style={{
                            padding: '4px 8px',
                            background: '#f3f4f6',
                            borderRadius: '6px',
                            fontWeight: 600,
                            color: '#111827'
                          }}>
                            {month.forecast}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
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
          onClick={() => setSelectedProduct(null)}
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
                {selectedProduct.productName}
              </h2>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
                SKU: {selectedProduct.skuCode}
              </p>
            </div>

            {/* Current Status */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '24px' }}>
              <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>Current Stock</div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#111827' }}>
                  {selectedProduct.currentStock?.toLocaleString()}
                </div>
              </div>
              <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>Monthly Average</div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#111827' }}>
                  {selectedProduct.avgMonthlyDemand?.toLocaleString()}
                </div>
              </div>
              <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>Months of Stock</div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#111827' }}>
                  {(selectedProduct.currentStock / selectedProduct.avgMonthlyDemand).toFixed(1)}
                </div>
              </div>
            </div>

            {/* Trend & Seasonality */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: 600 }}>Demand Pattern</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div style={{
                  padding: '16px',
                  background: selectedProduct.trend.type.includes('Upward') ? 'rgba(16, 185, 129, 0.1)' :
                             selectedProduct.trend.type.includes('Downward') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: selectedProduct.trend.type.includes('Upward') ? '#d1fae5' :
                              selectedProduct.trend.type.includes('Downward') ? '#fee2e2' : '#e0e7ff'
                }}>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>Demand Trend</div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '18px',
                    fontWeight: 600,
                    color: selectedProduct.trend.type.includes('Upward') ? '#10b981' :
                           selectedProduct.trend.type.includes('Downward') ? '#ef4444' : '#6366f1'
                  }}>
                    {selectedProduct.trend.type.includes('Upward') && <TrendingUp size={20} />}
                    {selectedProduct.trend.type.includes('Downward') && <TrendingDown size={20} />}
                    {selectedProduct.trend.type}
                  </div>
                </div>
                <div style={{
                  padding: '16px',
                  background: selectedProduct.seasonality.detected ? 'rgba(139, 92, 246, 0.1)' : 'rgba(156, 163, 175, 0.1)',
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: selectedProduct.seasonality.detected ? '#ede9fe' : '#e5e7eb'
                }}>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>Seasonality</div>
                  <div style={{
                    fontSize: '18px',
                    fontWeight: 600,
                    color: selectedProduct.seasonality.detected ? '#8b5cf6' : '#9ca3af'
                  }}>
                    {selectedProduct.seasonality.detected ? 'Seasonal Pattern Detected' : 'No Seasonal Pattern'}
                  </div>
                  {selectedProduct.seasonality.detected && (
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                      Strength: {(selectedProduct.seasonality.strength * 100).toFixed(0)}%
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 3-Month Forecast */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: 600 }}>Next 3 Months Demand Forecast</h4>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', fontSize: '14px', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>Period</th>
                      <th style={{ padding: '12px', textAlign: 'right', fontWeight: 600 }}>Low Estimate</th>
                      <th style={{ padding: '12px', textAlign: 'right', fontWeight: 600 }}>Forecast</th>
                      <th style={{ padding: '12px', textAlign: 'right', fontWeight: 600 }}>High Estimate</th>
                      <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600 }}>Confidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedProduct.forecastMonths?.map((month, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '12px', fontWeight: 600 }}>Month {i + 1}</td>
                        <td style={{ padding: '12px', textAlign: 'right', color: '#6b7280' }}>
                          {month.lower}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'right', fontWeight: 700, color: '#111827' }}>
                          {month.forecast}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'right', color: '#6b7280' }}>
                          {month.upper}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '12px',
                            background: '#eff6ff',
                            color: '#1e40af',
                            fontSize: '12px',
                            fontWeight: 600
                          }}>
                            {month.confidenceLevel}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={() => setSelectedProduct(null)}
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

export default AdvancedForecasting;
