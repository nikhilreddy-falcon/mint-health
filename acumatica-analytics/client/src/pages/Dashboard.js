import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import API_CONFIG from '../config/api';

const Dashboard = () => {
  const [kpis, setKpis] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [pipelineData, setPipelineData] = useState(null);
  const [topCustomers, setTopCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [kpisRes, salesRes, pipelineRes, customersRes] = await Promise.all([
        axios.get(`${API_CONFIG.ANALYTICS_API}/api/analytics/kpis`),
        axios.get(`${API_CONFIG.ANALYTICS_API}/api/analytics/sales?period=monthly`),
        axios.get(`${API_CONFIG.ANALYTICS_API}/api/analytics/sales-pipeline`),
        axios.get(`${API_CONFIG.ANALYTICS_API}/api/analytics/top-customers?limit=5`)
      ]);

      setKpis(kpisRes.data);

      // Transform sales data for chart
      const salesByPeriod = Object.entries(salesRes.data.salesByPeriod).map(([period, data]) => ({
        period,
        sales: Math.round(data.sales),
        orders: data.orders
      }));
      setSalesData(salesByPeriod);

      setPipelineData(pipelineRes.data);
      setTopCustomers(customersRes.data);

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return <div className="error">Error loading dashboard: {error}</div>;
  }

  // Prepare pipeline chart data
  const pipelineChartData = pipelineData ? Object.entries(pipelineData.byStage).map(([stage, data]) => ({
    name: stage,
    value: Math.round(data.amount),
    count: data.count
  })) : [];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Executive Dashboard</h1>
        <p className="page-subtitle">Real-time overview of key business metrics from Acumatica ERP</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4">
        <div className="kpi-card info">
          <div className="kpi-label">💰 Total Revenue</div>
          <div className="kpi-value">{formatCurrency(kpis.financial.totalRevenue)}</div>
          <div className="kpi-change positive">This Month: {formatCurrency(kpis.financial.revenueThisMonth)}</div>
        </div>

        <div className="kpi-card success">
          <div className="kpi-label">💵 Cash Collected</div>
          <div className="kpi-value">{formatCurrency(kpis.financial.cashCollected)}</div>
          <div className="kpi-change">From payments</div>
        </div>

        <div className="kpi-card warning">
          <div className="kpi-label">📋 Outstanding AR</div>
          <div className="kpi-value">{formatCurrency(kpis.financial.outstandingAR)}</div>
          <div className="kpi-change">DSO: {kpis.financial.dso} days</div>
        </div>

        <div className="kpi-card info">
          <div className="kpi-label">📦 Inventory Value</div>
          <div className="kpi-value">{formatCurrency(kpis.inventory.totalValue)}</div>
          <div className="kpi-change">{kpis.inventory.itemCount} items</div>
        </div>
      </div>

      {/* Sales Metrics */}
      <div className="grid grid-cols-4" style={{ marginTop: '20px' }}>
        <div className="kpi-card">
          <div className="kpi-label">📊 Total Orders</div>
          <div className="kpi-value">{kpis.sales.totalOrders.toLocaleString()}</div>
          <div className="kpi-change">Completed</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">💳 Avg Order Value</div>
          <div className="kpi-value">{formatCurrency(kpis.sales.avgOrderValue)}</div>
          <div className="kpi-change">Per order</div>
        </div>

        <div className="kpi-card success">
          <div className="kpi-label">👥 Active Customers</div>
          <div className="kpi-value">{kpis.sales.activeCustomers}</div>
          <div className="kpi-change">Currently active</div>
        </div>

        <div className="kpi-card info">
          <div className="kpi-label">🎯 Pipeline Value</div>
          <div className="kpi-value">{formatCurrency(kpis.sales.weightedPipelineValue)}</div>
          <div className="kpi-change">{kpis.sales.openOpportunities} opportunities</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2" style={{ marginTop: '20px' }}>
        {/* Sales Trend */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Sales Trend</h3>
            <p className="card-subtitle">Monthly sales revenue</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Area type="monotone" dataKey="sales" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Sales Pipeline by Stage */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Sales Pipeline by Stage</h3>
            <p className="card-subtitle">Opportunity distribution</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pipelineChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="value" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-2" style={{ marginTop: '20px' }}>
        {/* Top Customers */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Top Customers by Revenue</h3>
            <p className="card-subtitle">Highest revenue contributors</p>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Revenue</th>
                <th>Orders</th>
              </tr>
            </thead>
            <tbody>
              {topCustomers.map((customer, index) => (
                <tr key={index}>
                  <td>{customer.customerName}</td>
                  <td>{formatCurrency(customer.revenue)}</td>
                  <td>{customer.orders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Inventory Alerts */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Key Metrics Summary</h3>
            <p className="card-subtitle">Important operational indicators</p>
          </div>
          <div>
            <div className="stat-row">
              <span className="stat-label">Low Stock Items</span>
              <span className="stat-value">
                <span className="badge warning">{kpis.inventory.lowStockItems}</span>
              </span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Active Stock Items</span>
              <span className="stat-value">{kpis.inventory.itemCount}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Days Sales Outstanding</span>
              <span className="stat-value">{kpis.financial.dso} days</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Open Opportunities</span>
              <span className="stat-value">{kpis.sales.openOpportunities}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Pipeline Value (Weighted)</span>
              <span className="stat-value">{formatCurrency(kpis.sales.weightedPipelineValue)}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Pipeline Value (Total)</span>
              <span className="stat-value">{formatCurrency(kpis.sales.pipelineValue)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
