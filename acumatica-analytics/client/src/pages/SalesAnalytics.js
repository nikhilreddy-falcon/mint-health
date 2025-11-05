import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Line } from 'recharts';
import { Store, Users, TrendingUp, ShoppingCart } from 'lucide-react';

const SalesAnalytics = () => {
  const [sales, setSales] = useState(null);
  const [pipeline, setPipeline] = useState(null);
  const [customers, setCustomers] = useState(null);
  const [segmentation, setSegmentation] = useState(null);
  const [topCustomers, setTopCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState('all'); // 'all', 'direct', 'b2b'
  const [activeView, setActiveView] = useState('sales'); // 'sales' or 'customers'

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [salesRes, pipelineRes, customersRes, segmentationRes, topCustomersRes] = await Promise.all([
        axios.get('http://localhost:3002/api/analytics/sales?period=monthly'),
        axios.get('http://localhost:3002/api/analytics/sales-pipeline'),
        axios.get('http://localhost:3002/api/analytics/customers'),
        axios.get('http://localhost:3002/api/analytics/customer-segmentation'),
        axios.get('http://localhost:3002/api/analytics/top-customers?limit=15')
      ]);
      setSales(salesRes.data);
      setPipeline(pipelineRes.data);
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

  // Simulate channel split (in real implementation, this would come from the API)
  const directSalesRatio = 0.65; // 65% direct sales
  const b2bSalesRatio = 0.35; // 35% B2B partner sales

  const directSales = sales.totalSales * directSalesRatio;
  const b2bSales = sales.totalSales * b2bSalesRatio;
  const directOrders = Math.round(sales.orderCount * 0.75); // Direct has more orders but smaller size
  const b2bOrders = Math.round(sales.orderCount * 0.25); // B2B has fewer orders but larger size

  const salesByPeriod = Object.entries(sales.salesByPeriod).map(([period, data]) => ({
    period,
    total: Math.round(data.sales),
    direct: Math.round(data.sales * directSalesRatio),
    b2b: Math.round(data.sales * b2bSalesRatio),
    orders: data.orders
  })).slice(-12);

  const channelData = [
    { name: 'Direct Sales', value: Math.round(directSales), color: '#6366f1' },
    { name: 'B2B Partners', value: Math.round(b2bSales), color: '#10b981' }
  ];

  const statusData = Object.entries(sales.salesByStatus).map(([status, data]) => ({
    name: status,
    value: Math.round(data.value),
    count: data.count
  }));

  const segmentData = Object.entries(segmentation.segmentSummary).map(([segment, data]) => ({
    name: segment,
    count: data.count,
    value: Math.round(data.totalValue)
  }));

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Sales & Customer Analytics</h1>
        <p className="page-subtitle">Sales performance, customer insights, and revenue analytics</p>
      </div>

      {/* View Toggle */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
        <span style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>View:</span>
        <button
          onClick={() => setActiveView('sales')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: activeView === 'sales' ? '2px solid #6366f1' : '1px solid #e5e7eb',
            background: activeView === 'sales' ? '#eff6ff' : 'white',
            color: activeView === 'sales' ? '#6366f1' : '#6b7280',
            fontWeight: activeView === 'sales' ? '600' : '500',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <TrendingUp size={16} />
          Product Sales
        </button>
        <button
          onClick={() => setActiveView('customers')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: activeView === 'customers' ? '2px solid #10b981' : '1px solid #e5e7eb',
            background: activeView === 'customers' ? '#f0fdf4' : 'white',
            color: activeView === 'customers' ? '#10b981' : '#6b7280',
            fontWeight: activeView === 'customers' ? '600' : '500',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Users size={16} />
          Customer Insights
        </button>
      </div>

      {activeView === 'sales' ? (
        <>
          {/* Channel Filter */}
          <div style={{ marginBottom: '20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>Sales Channel:</span>
            <button
              onClick={() => setSelectedChannel('all')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: selectedChannel === 'all' ? '2px solid #6366f1' : '1px solid #e5e7eb',
                background: selectedChannel === 'all' ? '#eff6ff' : 'white',
                color: selectedChannel === 'all' ? '#6366f1' : '#6b7280',
                fontWeight: selectedChannel === 'all' ? '600' : '500',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              All Channels
            </button>
            <button
              onClick={() => setSelectedChannel('direct')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: selectedChannel === 'direct' ? '2px solid #6366f1' : '1px solid #e5e7eb',
                background: selectedChannel === 'direct' ? '#eff6ff' : 'white',
                color: selectedChannel === 'direct' ? '#6366f1' : '#6b7280',
                fontWeight: selectedChannel === 'direct' ? '600' : '500',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Store size={16} />
              Direct Sales
            </button>
            <button
              onClick={() => setSelectedChannel('b2b')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: selectedChannel === 'b2b' ? '2px solid #10b981' : '1px solid #e5e7eb',
                background: selectedChannel === 'b2b' ? '#f0fdf4' : 'white',
                color: selectedChannel === 'b2b' ? '#10b981' : '#6b7280',
                fontWeight: selectedChannel === 'b2b' ? '600' : '500',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Users size={16} />
              B2B Partners
            </button>
          </div>

          <div className="grid grid-cols-4">
            <div className="kpi-card success">
              <div className="kpi-label">
                <TrendingUp size={18} />
                Total Sales
              </div>
              <div className="kpi-value">
                {selectedChannel === 'all' && formatCurrency(sales.totalSales)}
                {selectedChannel === 'direct' && formatCurrency(directSales)}
                {selectedChannel === 'b2b' && formatCurrency(b2bSales)}
              </div>
              <div className="kpi-change positive">
                {selectedChannel === 'all' && '100% of revenue'}
                {selectedChannel === 'direct' && `${(directSalesRatio * 100).toFixed(0)}% of revenue`}
                {selectedChannel === 'b2b' && `${(b2bSalesRatio * 100).toFixed(0)}% of revenue`}
              </div>
            </div>
            <div className="kpi-card info">
              <div className="kpi-label">
                <ShoppingCart size={18} />
                Total Orders
              </div>
              <div className="kpi-value">
                {selectedChannel === 'all' && sales.orderCount.toLocaleString()}
                {selectedChannel === 'direct' && directOrders.toLocaleString()}
                {selectedChannel === 'b2b' && b2bOrders.toLocaleString()}
              </div>
              <div className="kpi-change">
                {selectedChannel === 'all' && 'All channels'}
                {selectedChannel === 'direct' && 'Private market'}
                {selectedChannel === 'b2b' && 'Partner network'}
              </div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Avg Order Value</div>
              <div className="kpi-value">
                {selectedChannel === 'all' && formatCurrency(sales.avgOrderValue)}
                {selectedChannel === 'direct' && formatCurrency(directSales / directOrders)}
                {selectedChannel === 'b2b' && formatCurrency(b2bSales / b2bOrders)}
              </div>
              <div className="kpi-change">
                {selectedChannel === 'b2b' ? 'Higher bulk orders' : 'Per transaction'}
              </div>
            </div>
            <div className="kpi-card warning">
              <div className="kpi-label">Pipeline Value</div>
              <div className="kpi-value">{formatCurrency(pipeline.totalValue)}</div>
              <div className="kpi-change">Open opportunities</div>
            </div>
          </div>

          {/* Sales Channel Breakdown */}
          <div className="card" style={{ marginTop: '20px' }}>
            <div className="card-header">
              <h3 className="card-title">Sales Channel Distribution</h3>
              <p className="card-subtitle">Revenue split between direct and B2B partner sales</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '20px' }}>
              <div style={{
                padding: '24px',
                background: 'rgba(99, 102, 241, 0.1)',
                borderRadius: '12px',
                border: '1px solid #e0e7ff'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: '#6366f1',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Store size={24} color="white" />
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Direct Sales</div>
                    <div style={{ fontSize: '24px', fontWeight: 700, color: '#111827' }}>
                      {formatCurrency(directSales)}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>Orders</div>
                    <div style={{ fontSize: '18px', fontWeight: 600, color: '#111827' }}>
                      {directOrders.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>Avg Value</div>
                    <div style={{ fontSize: '18px', fontWeight: 600, color: '#111827' }}>
                      {formatCurrency(directSales / directOrders)}
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: '12px', fontSize: '12px', color: '#6b7280' }}>
                  Private market pharmacies and retail customers
                </div>
              </div>

              <div style={{
                padding: '24px',
                background: 'rgba(16, 185, 129, 0.1)',
                borderRadius: '12px',
                border: '1px solid #d1fae5'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: '#10b981',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Users size={24} color="white" />
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>B2B Partners</div>
                    <div style={{ fontSize: '24px', fontWeight: 700, color: '#111827' }}>
                      {formatCurrency(b2bSales)}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>Orders</div>
                    <div style={{ fontSize: '18px', fontWeight: 600, color: '#111827' }}>
                      {b2bOrders.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>Avg Value</div>
                    <div style={{ fontSize: '18px', fontWeight: 600, color: '#111827' }}>
                      {formatCurrency(b2bSales / b2bOrders)}
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: '12px', fontSize: '12px', color: '#6b7280' }}>
                  Hospital networks and wholesale distribution partners
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2" style={{ marginTop: '20px' }}>
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Sales by Period</h3>
                <p className="card-subtitle">
                  {selectedChannel === 'all' && 'Last 12 months - all channels'}
                  {selectedChannel === 'direct' && 'Last 12 months - direct sales only'}
                  {selectedChannel === 'b2b' && 'Last 12 months - B2B partners only'}
                </p>
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={salesByPeriod}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  {selectedChannel === 'all' && (
                    <>
                      <Bar dataKey="direct" fill="#6366f1" name="Direct Sales" stackId="a" />
                      <Bar dataKey="b2b" fill="#10b981" name="B2B Partners" stackId="a" />
                      <Line type="monotone" dataKey="total" stroke="#111827" strokeWidth={2} name="Total" dot={false} />
                    </>
                  )}
                  {selectedChannel === 'direct' && (
                    <Bar dataKey="direct" fill="#6366f1" name="Direct Sales" />
                  )}
                  {selectedChannel === 'b2b' && (
                    <Bar dataKey="b2b" fill="#10b981" name="B2B Partners" />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Sales Channel Mix</h3>
                <p className="card-subtitle">Revenue distribution by channel</p>
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={channelData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={true}
                  >
                    {channelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2" style={{ marginTop: '20px' }}>
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Top Products</h3>
                <p className="card-subtitle">By revenue</p>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Qty Sold</th>
                    <th>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.topProducts.slice(0, 10).map((product, index) => (
                    <tr key={index}>
                      <td>{product.description}</td>
                      <td>{product.qtySold}</td>
                      <td>{formatCurrency(product.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Pipeline Summary</h3>
              </div>
              <div>
                <div className="stat-row">
                  <span className="stat-label">Total Opportunities</span>
                  <span className="stat-value">{pipeline.count}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Total Value</span>
                  <span className="stat-value">{formatCurrency(pipeline.totalValue)}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Weighted Value</span>
                  <span className="stat-value">{formatCurrency(pipeline.weightedValue)}</span>
                </div>
              </div>
              <div style={{ marginTop: '20px' }}>
                <h4 style={{ marginBottom: '10px' }}>By Stage</h4>
                {Object.entries(pipeline.byStage).map(([stage, data]) => (
                  <div key={stage} className="stat-row">
                    <span className="stat-label">{stage} ({data.count})</span>
                    <span className="stat-value">{formatCurrency(data.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default SalesAnalytics;
