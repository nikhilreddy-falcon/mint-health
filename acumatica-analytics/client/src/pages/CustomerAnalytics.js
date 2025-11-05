import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import API_CONFIG from '../config/api';

const CustomerAnalytics = () => {
  const [customers, setCustomers] = useState(null);
  const [segmentation, setSegmentation] = useState(null);
  const [topCustomers, setTopCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [customersRes, segmentationRes, topCustomersRes] = await Promise.all([
        axios.get(`${API_CONFIG.ANALYTICS_API}/api/analytics/customers`),
        axios.get(`${API_CONFIG.ANALYTICS_API}/api/analytics/customer-segmentation`),
        axios.get(`${API_CONFIG.ANALYTICS_API}/api/analytics/top-customers?limit=15`)
      ]);
      setCustomers(customersRes.data);
      setSegmentation(segmentationRes.data);
      setTopCustomers(topCustomersRes.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  const segmentData = Object.entries(segmentation.segmentSummary).map(([segment, data]) => ({
    name: segment,
    count: data.count,
    value: Math.round(data.totalValue)
  }));

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Customer Analytics</h1>
        <p className="page-subtitle">Customer segmentation and lifetime value analysis</p>
      </div>

      <div className="grid grid-cols-4">
        <div className="kpi-card info">
          <div className="kpi-label">Total Customers</div>
          <div className="kpi-value">{customers.totalCustomers}</div>
        </div>
        <div className="kpi-card success">
          <div className="kpi-label">Active Customers</div>
          <div className="kpi-value">{customers.activeCustomers}</div>
        </div>
        <div className="kpi-card danger">
          <div className="kpi-label">At Risk</div>
          <div className="kpi-value">{customers.churnRisk.length}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Segments</div>
          <div className="kpi-value">{Object.keys(segmentation.segmentSummary).length}</div>
        </div>
      </div>

      <div className="grid grid-cols-2" style={{ marginTop: '20px' }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Customer Segmentation (RFM)</h3>
            <p className="card-subtitle">Recency, Frequency, Monetary analysis</p>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={segmentData}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {segmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Segment Value</h3>
            <p className="card-subtitle">Total revenue by segment</p>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={segmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="value" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <div className="card-header">
          <h3 className="card-title">Top Customers by Revenue</h3>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Revenue</th>
              <th>Orders</th>
              <th>Avg Order</th>
            </tr>
          </thead>
          <tbody>
            {topCustomers.map((customer, index) => (
              <tr key={index}>
                <td>{customer.customerName}</td>
                <td>{formatCurrency(customer.revenue)}</td>
                <td>{customer.orders}</td>
                <td>{formatCurrency(customer.revenue / customer.orders)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerAnalytics;
