import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const ExpiryManagement = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedThreshold, setSelectedThreshold] = useState(90);

  useEffect(() => {
    fetchData();
  }, [selectedThreshold]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:7006/api/analytics/expiry-alerts?daysThreshold=${selectedThreshold}`);
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching expiry data:', error);
      setLoading(false);
    }
  };

  const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#6366f1'];

  const getCriticalityColor = (days) => {
    if (days <= 30) return '#ef4444'; // Critical - Red
    if (days <= 60) return '#f59e0b'; // Warning - Orange
    if (days <= 90) return '#fbbf24'; // Attention - Yellow
    return '#10b981'; // Good - Green
  };

  const getCriticalityLabel = (days) => {
    if (days <= 30) return 'Critical';
    if (days <= 60) return 'Warning';
    if (days <= 90) return 'Attention';
    return 'Good';
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  const criticalItems = data?.alerts?.filter(item => item.daysToExpiry <= 30) || [];
  const warningItems = data?.alerts?.filter(item => item.daysToExpiry > 30 && item.daysToExpiry <= 60) || [];
  const attentionItems = data?.alerts?.filter(item => item.daysToExpiry > 60 && item.daysToExpiry <= 90) || [];

  const summaryData = [
    { name: 'Critical (≤30 days)', value: criticalItems.length, fill: '#ef4444' },
    { name: 'Warning (31-60 days)', value: warningItems.length, fill: '#f59e0b' },
    { name: 'Attention (61-90 days)', value: attentionItems.length, fill: '#fbbf24' }
  ];

  const categoryData = data?.alerts?.reduce((acc, item) => {
    const category = item.businessUnit || 'Other';
    const existing = acc.find(x => x.category === category);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ category, count: 1 });
    }
    return acc;
  }, []) || [];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Expiry Date Management</h1>
        <p className="page-subtitle">Monitor pharmaceutical product expiration dates and manage stock rotation</p>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-4" style={{ marginBottom: '24px' }}>
        <div className="kpi-card danger">
          <div className="kpi-label">Critical (≤30 days)</div>
          <div className="kpi-value">{criticalItems.length}</div>
          <div className="kpi-change negative">Immediate Action Required</div>
        </div>
        <div className="kpi-card warning">
          <div className="kpi-label">Warning (31-60 days)</div>
          <div className="kpi-value">{warningItems.length}</div>
          <div className="kpi-change">Plan Disposal/Return</div>
        </div>
        <div className="kpi-card" style={{ borderLeftColor: '#fbbf24' }}>
          <div className="kpi-label">Attention (61-90 days)</div>
          <div className="kpi-value">{attentionItems.length}</div>
          <div className="kpi-change">Monitor Closely</div>
        </div>
        <div className="kpi-card success">
          <div className="kpi-label">Total Products Tracked</div>
          <div className="kpi-value">{data?.alerts?.length || 0}</div>
          <div className="kpi-change">Within {selectedThreshold} days</div>
        </div>
      </div>

      {/* Threshold Selector */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <h3 className="card-title">Alert Threshold</h3>
          <p className="card-subtitle">Select time horizon for expiry monitoring</p>
        </div>
        <div style={{ padding: '20px', display: 'flex', gap: '12px' }}>
          {[30, 60, 90, 120, 180].map(days => (
            <button
              key={days}
              onClick={() => setSelectedThreshold(days)}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: selectedThreshold === days ? '2px solid #6366f1' : '1px solid #e5e7eb',
                background: selectedThreshold === days ? '#eff6ff' : 'white',
                color: selectedThreshold === days ? '#6366f1' : '#6b7280',
                fontWeight: selectedThreshold === days ? '600' : '500',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {days} days
            </button>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2" style={{ marginBottom: '24px' }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Expiry Risk Distribution</h3>
            <p className="card-subtitle">Products by criticality level</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={summaryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {summaryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">By Product Category</h3>
            <p className="card-subtitle">Expiring products by division</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Critical Items Table */}
      {criticalItems.length > 0 && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="card-header">
            <h3 className="card-title">Critical Items - Immediate Action Required</h3>
            <p className="card-subtitle">Products expiring within 30 days</p>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Description</th>
                <th>Category</th>
                <th>Expiry Date</th>
                <th>Days to Expiry</th>
                <th>Qty On Hand</th>
                <th>Value at Risk</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {criticalItems.slice(0, 10).map((item, index) => (
                <tr key={index}>
                  <td style={{ fontWeight: '600' }}>{item.inventoryID}</td>
                  <td>{item.description}</td>
                  <td><span className="badge info">{item.businessUnit}</span></td>
                  <td>{new Date(item.expiryDate).toLocaleDateString()}</td>
                  <td>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      background: '#fee2e2',
                      color: '#991b1b',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {item.daysToExpiry} days
                    </span>
                  </td>
                  <td>{item.qtyOnHand?.toFixed(0)}</td>
                  <td>€{((item.qtyOnHand || 0) * (item.avgCost || 0)).toFixed(2)}</td>
                  <td>
                    <span className="badge danger">Critical</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Warning Items Table */}
      {warningItems.length > 0 && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="card-header">
            <h3 className="card-title">Warning Items - Plan Disposal/Return</h3>
            <p className="card-subtitle">Products expiring in 31-60 days</p>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Description</th>
                <th>Category</th>
                <th>Expiry Date</th>
                <th>Days to Expiry</th>
                <th>Qty On Hand</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {warningItems.slice(0, 10).map((item, index) => (
                <tr key={index}>
                  <td style={{ fontWeight: '600' }}>{item.inventoryID}</td>
                  <td>{item.description}</td>
                  <td><span className="badge info">{item.businessUnit}</span></td>
                  <td>{new Date(item.expiryDate).toLocaleDateString()}</td>
                  <td>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      background: '#fed7aa',
                      color: '#92400e',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {item.daysToExpiry} days
                    </span>
                  </td>
                  <td>{item.qtyOnHand?.toFixed(0)}</td>
                  <td>
                    <span className="badge warning">Warning</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* All Expiring Products */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">All Expiring Products</h3>
          <p className="card-subtitle">Complete list of products expiring within {selectedThreshold} days</p>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Description</th>
              <th>Category</th>
              <th>Expiry Date</th>
              <th>Days to Expiry</th>
              <th>Qty On Hand</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data?.alerts?.map((item, index) => (
              <tr key={index}>
                <td style={{ fontWeight: '600' }}>{item.inventoryID}</td>
                <td>{item.description}</td>
                <td><span className="badge info">{item.businessUnit}</span></td>
                <td>{new Date(item.expiryDate).toLocaleDateString()}</td>
                <td>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    background: item.daysToExpiry <= 30 ? '#fee2e2' : item.daysToExpiry <= 60 ? '#fed7aa' : '#fef3c7',
                    color: item.daysToExpiry <= 30 ? '#991b1b' : item.daysToExpiry <= 60 ? '#92400e' : '#78350f',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {item.daysToExpiry} days
                  </span>
                </td>
                <td>{item.qtyOnHand?.toFixed(0)}</td>
                <td>
                  <span className={`badge ${item.daysToExpiry <= 30 ? 'danger' : item.daysToExpiry <= 60 ? 'warning' : ''}`} style={item.daysToExpiry > 60 ? { background: '#fef3c7', color: '#78350f' } : {}}>
                    {getCriticalityLabel(item.daysToExpiry)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpiryManagement;
