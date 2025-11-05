import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, ZAxis } from 'recharts';

const SupplierManagement = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3002/api/analytics/supplier-scorecards');
      setData(response.data);
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

  const getRiskColor = (risk) => {
    const colors = {
      'Low': '#10b981',
      'Medium': '#f59e0b',
      'High': '#ef4444'
    };
    return colors[risk] || '#6b7280';
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Supplier Performance Management</h1>
        <p className="page-subtitle">Comprehensive supplier scorecards and performance analytics for pharmaceutical suppliers</p>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-4">
        <div className="kpi-card info">
          <div className="kpi-label">Total Suppliers</div>
          <div className="kpi-value">{data?.summary?.totalSuppliers || 0}</div>
          <div className="kpi-change">Active pharmaceutical suppliers</div>
        </div>
        <div className="kpi-card success">
          <div className="kpi-label">Excellent Performers</div>
          <div className="kpi-value">{data?.summary?.excellentSuppliers || 0}</div>
          <div className="kpi-change">Score 90+ (top tier)</div>
        </div>
        <div className="kpi-card warning">
          <div className="kpi-label">Avg On-Time Delivery</div>
          <div className="kpi-value">{data?.summary?.avgOnTimeDelivery?.toFixed(1) || 0}%</div>
          <div className="kpi-change">Target: 95%</div>
        </div>
        <div className="kpi-card danger">
          <div className="kpi-label">High Risk Suppliers</div>
          <div className="kpi-value">{data?.summary?.atRiskSuppliers || 0}</div>
          <div className="kpi-change">Require attention</div>
        </div>
      </div>

      {/* Top & Bottom Performers */}
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
              {data?.topPerformers?.map((supplier, index) => (
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
              {data?.bottomPerformers?.map((supplier, index) => (
                <tr key={index} style={{ background: '#fef2f2' }}>
                  <td style={{ fontWeight: 600, fontSize: '16px' }}>{data?.scorecards?.length - index}</td>
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

      {/* Supplier Comparison Chart */}
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="card-header">
          <h3 className="card-title">Supplier Performance Comparison (Top 10)</h3>
          <p className="card-subtitle">Multi-dimensional scorecard comparison</p>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data?.comparison || []}>
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

      {/* Spend Concentration Analysis */}
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="card-header">
          <h3 className="card-title">Spend Concentration Analysis</h3>
          <p className="card-subtitle">Supplier spend distribution and dependency risk</p>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Supplier</th>
              <th>Total Spend</th>
              <th>% of Total</th>
              <th>Performance Score</th>
              <th>Risk Assessment</th>
            </tr>
          </thead>
          <tbody>
            {data?.spendConcentration?.map((item, index) => (
              <tr key={index}>
                <td>{item.vendorName}</td>
                <td>{formatCurrency(item.spend)}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{
                      width: '100px',
                      height: '20px',
                      background: '#e5e7eb',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      marginRight: '10px'
                    }}>
                      <div style={{
                        width: `${item.percentage}%`,
                        height: '100%',
                        background: item.percentage > 20 ? '#ef4444' : item.percentage > 10 ? '#f59e0b' : '#6366f1',
                        transition: 'width 0.3s'
                      }} />
                    </div>
                    <span style={{ fontWeight: 600 }}>{item.percentage}%</span>
                  </div>
                </td>
                <td>
                  <span className={`badge ${item.overallScore >= 85 ? 'success' : item.overallScore >= 70 ? 'warning' : 'danger'}`}>
                    {item.overallScore}
                  </span>
                </td>
                <td>
                  {item.percentage > 20 ? (
                    <span style={{ color: '#ef4444', fontWeight: 600 }}>High Dependency</span>
                  ) : item.percentage > 10 ? (
                    <span style={{ color: '#f59e0b', fontWeight: 600 }}>Moderate</span>
                  ) : (
                    <span style={{ color: '#10b981', fontWeight: 600 }}>Diversified</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Complete Supplier Scorecards */}
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="card-header">
          <h3 className="card-title">Supplier Scorecards - All Suppliers</h3>
          <p className="card-subtitle">Comprehensive performance metrics for {data?.scorecards?.length || 0} pharmaceutical suppliers</p>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Supplier</th>
                <th>Location</th>
                <th>Overall Score</th>
                <th>On-Time Delivery</th>
                <th>Quality</th>
                <th>Price</th>
                <th>Responsiveness</th>
                <th>Compliance</th>
                <th>Total Orders</th>
                <th>Total Spend</th>
                <th>Risk Level</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {data?.scorecards?.map((supplier, index) => (
                <tr key={index} style={{ cursor: 'pointer' }} onClick={() => setSelectedSupplier(supplier)}>
                  <td style={{ fontWeight: 600 }}>{supplier.vendorName}</td>
                  <td>{supplier.location}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{
                        width: '60px',
                        height: '8px',
                        background: '#e5e7eb',
                        borderRadius: '4px',
                        marginRight: '8px'
                      }}>
                        <div style={{
                          width: `${supplier.overallScore}%`,
                          height: '100%',
                          background: supplier.overallScore >= 85 ? '#10b981' : supplier.overallScore >= 70 ? '#f59e0b' : '#ef4444',
                          borderRadius: '4px'
                        }} />
                      </div>
                      <span style={{ fontWeight: 600 }}>{supplier.overallScore}</span>
                    </div>
                  </td>
                  <td>{supplier.onTimeDeliveryRate?.toFixed(1)}%</td>
                  <td>{supplier.qualityScore?.toFixed(1)}</td>
                  <td>{supplier.priceScore?.toFixed(1)}</td>
                  <td>{supplier.responsivenessScore?.toFixed(1)}</td>
                  <td>{supplier.complianceScore?.toFixed(1)}</td>
                  <td>{supplier.totalOrders}</td>
                  <td>{formatCurrency(supplier.totalSpend)}</td>
                  <td>
                    <span className={`badge ${supplier.riskLevel === 'Low' ? 'success' : supplier.riskLevel === 'Medium' ? 'warning' : 'danger'}`}>
                      {supplier.riskLevel}
                    </span>
                  </td>
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

      {/* Selected Supplier Details Modal */}
      {selectedSupplier && (
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
          onClick={() => setSelectedSupplier(null)}
        >
          <div
            className="card"
            style={{ maxWidth: '800px', maxHeight: '80vh', overflow: 'auto', margin: '20px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="card-header">
              <h3 className="card-title">{selectedSupplier.vendorName} - Detailed Scorecard</h3>
              <button
                style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  background: 'transparent',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer'
                }}
                onClick={() => setSelectedSupplier(null)}
              >
                ×
              </button>
            </div>
            <div style={{ padding: '20px' }}>
              <div className="grid grid-cols-2" style={{ gap: '15px', marginBottom: '20px' }}>
                <div>
                  <strong>Location:</strong> {selectedSupplier.location}
                </div>
                <div>
                  <strong>Contact:</strong> {selectedSupplier.contactName}
                </div>
                <div>
                  <strong>Email:</strong> {selectedSupplier.email}
                </div>
                <div>
                  <strong>Payment Terms:</strong> {selectedSupplier.paymentTerms}
                </div>
                <div>
                  <strong>Total Orders:</strong> {selectedSupplier.totalOrders} ({selectedSupplier.completedOrders} completed)
                </div>
                <div>
                  <strong>Total Spend:</strong> {formatCurrency(selectedSupplier.totalSpend)}
                </div>
              </div>

              <h4 style={{ marginTop: '20px', marginBottom: '10px' }}>Performance Scores</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                {[
                  { label: 'Overall Score', value: selectedSupplier.overallScore, color: getRatingColor(selectedSupplier.rating) },
                  { label: 'On-Time Delivery', value: selectedSupplier.onTimeDeliveryRate, color: '#6366f1' },
                  { label: 'Quality Score', value: selectedSupplier.qualityScore, color: '#10b981' },
                  { label: 'Price Competitiveness', value: selectedSupplier.priceScore, color: '#f59e0b' },
                  { label: 'Responsiveness', value: selectedSupplier.responsivenessScore, color: '#8b5cf6' },
                  { label: 'GDP Compliance', value: selectedSupplier.complianceScore, color: '#06b6d4' }
                ].map((metric, i) => (
                  <div key={i} style={{ padding: '10px', background: '#f9fafb', borderRadius: '6px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>{metric.label}</div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ fontSize: '24px', fontWeight: 600, color: metric.color, marginRight: '10px' }}>
                        {metric.value?.toFixed(1)}
                      </div>
                      <div style={{ flex: 1, height: '8px', background: '#e5e7eb', borderRadius: '4px' }}>
                        <div style={{
                          width: `${metric.value}%`,
                          height: '100%',
                          background: metric.color,
                          borderRadius: '4px'
                        }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <h4 style={{ marginTop: '20px', marginBottom: '10px' }}>Operational Metrics</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <div style={{ padding: '10px', background: '#f9fafb', borderRadius: '6px' }}>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>Avg Delivery Time</div>
                  <div style={{ fontSize: '20px', fontWeight: 600 }}>{selectedSupplier.avgDeliveryTime} days</div>
                </div>
                <div style={{ padding: '10px', background: '#f9fafb', borderRadius: '6px' }}>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>Defect Rate</div>
                  <div style={{ fontSize: '20px', fontWeight: 600 }}>{selectedSupplier.defectRate}%</div>
                </div>
                <div style={{ padding: '10px', background: '#f9fafb', borderRadius: '6px' }}>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>Price Variance</div>
                  <div style={{ fontSize: '20px', fontWeight: 600, color: selectedSupplier.priceVariance > 0 ? '#ef4444' : '#10b981' }}>
                    {selectedSupplier.priceVariance > 0 ? '+' : ''}{selectedSupplier.priceVariance}%
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '20px', padding: '15px', background: '#f0f9ff', borderRadius: '6px', border: '1px solid #bae6fd' }}>
                <strong>Risk Assessment:</strong> {selectedSupplier.riskLevel} Risk
                <br />
                <strong>Overall Rating:</strong> <span style={{ color: getRatingColor(selectedSupplier.rating) }}>{selectedSupplier.rating}</span>
                <br />
                <strong>Trend:</strong> {selectedSupplier.scoreChange > 0 ? '📈' : selectedSupplier.scoreChange < 0 ? '📉' : '➡️'}
                {selectedSupplier.scoreChange > 0 ? '+' : ''}{selectedSupplier.scoreChange} points vs last period
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierManagement;
