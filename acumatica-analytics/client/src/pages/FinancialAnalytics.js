import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, Wallet } from 'lucide-react';

const FinancialAnalytics = () => {
  const [financial, setFinancial] = useState(null);
  const [arAging, setArAging] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('overview'); // 'overview' or 'cashflow'
  const [days, setDays] = useState(90);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (activeView === 'cashflow') {
      fetchCashFlowData();
    }
  }, [activeView, days]);

  const fetchData = async () => {
    try {
      const [financialRes, arAgingRes] = await Promise.all([
        axios.get('http://localhost:3002/api/analytics/financial'),
        axios.get('http://localhost:3002/api/analytics/ar-aging')
      ]);
      setFinancial(financialRes.data);
      setArAging(arAgingRes.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchCashFlowData = async () => {
    try {
      const res = await axios.get(`http://localhost:3002/api/analytics/cashflow-forecast?days=${days}`);
      setForecast(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  const revenueData = Object.entries(financial.revenue.byMonth).map(([month, revenue]) => ({
    month,
    revenue: Math.round(revenue)
  }));

  const arAgingData = [
    { name: 'Current', amount: arAging.current.amount, count: arAging.current.count },
    { name: '1-30 Days', amount: arAging.days1_30.amount, count: arAging.days1_30.count },
    { name: '31-60 Days', amount: arAging.days31_60.amount, count: arAging.days31_60.count },
    { name: '61-90 Days', amount: arAging.days61_90.amount, count: arAging.days61_90.count },
    { name: '90+ Days', amount: arAging.days90Plus.amount, count: arAging.days90Plus.count }
  ];

  const totalInflows = forecast.reduce((sum, day) => sum + day.inflows, 0);
  const totalOutflows = forecast.reduce((sum, day) => sum + day.outflows, 0);
  const netCashFlow = totalInflows - totalOutflows;
  const endingBalance = forecast.length > 0 ? forecast[forecast.length - 1].balance : 0;
  const sampledData = forecast.filter((_, index) => index % 7 === 0);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Financial Analytics</h1>
        <p className="page-subtitle">Revenue, receivables, cash flow, and profitability metrics</p>
      </div>

      {/* View Toggle */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
        <span style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>View:</span>
        <button
          onClick={() => setActiveView('overview')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: activeView === 'overview' ? '2px solid #6366f1' : '1px solid #e5e7eb',
            background: activeView === 'overview' ? '#eff6ff' : 'white',
            color: activeView === 'overview' ? '#6366f1' : '#6b7280',
            fontWeight: activeView === 'overview' ? '600' : '500',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <DollarSign size={16} />
          Financial Overview
        </button>
        <button
          onClick={() => setActiveView('cashflow')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: activeView === 'cashflow' ? '2px solid #10b981' : '1px solid #e5e7eb',
            background: activeView === 'cashflow' ? '#f0fdf4' : 'white',
            color: activeView === 'cashflow' ? '#10b981' : '#6b7280',
            fontWeight: activeView === 'cashflow' ? '600' : '500',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Wallet size={16} />
          Cash Flow Forecast
        </button>
      </div>

      {activeView === 'overview' ? (
        <>
          <div className="grid grid-cols-4">
            <div className="kpi-card info">
              <div className="kpi-label">Total Revenue</div>
              <div className="kpi-value">{formatCurrency(financial.revenue.total)}</div>
            </div>
            <div className="kpi-card warning">
              <div className="kpi-label">Total AR</div>
              <div className="kpi-value">{formatCurrency(financial.receivables.total)}</div>
            </div>
            <div className="kpi-card danger">
              <div className="kpi-label">Overdue AR</div>
              <div className="kpi-value">{formatCurrency(financial.receivables.overdue)}</div>
            </div>
            <div className="kpi-card success">
              <div className="kpi-label">Gross Margin</div>
              <div className="kpi-value">{financial.profitability.grossMargin.toFixed(1)}%</div>
            </div>
          </div>

          <div className="grid grid-cols-2" style={{ marginTop: '20px' }}>
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Revenue Trend</h3>
                <p className="card-subtitle">Monthly revenue performance</p>
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="card-title">AR Aging</h3>
                <p className="card-subtitle">Accounts receivable aging analysis</p>
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={arAgingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="amount" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card" style={{ marginTop: '20px' }}>
            <div className="card-header">
              <h3 className="card-title">AR Aging Detail</h3>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Aging Bucket</th>
                  <th>Invoice Count</th>
                  <th>Total Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Current</td>
                  <td>{arAging.current.count}</td>
                  <td>{formatCurrency(arAging.current.amount)}</td>
                </tr>
                <tr>
                  <td>1-30 Days</td>
                  <td>{arAging.days1_30.count}</td>
                  <td>{formatCurrency(arAging.days1_30.amount)}</td>
                </tr>
                <tr>
                  <td>31-60 Days</td>
                  <td>{arAging.days31_60.count}</td>
                  <td>{formatCurrency(arAging.days31_60.amount)}</td>
                </tr>
                <tr>
                  <td>61-90 Days</td>
                  <td>{arAging.days61_90.count}</td>
                  <td>{formatCurrency(arAging.days61_90.amount)}</td>
                </tr>
                <tr>
                  <td>90+ Days</td>
                  <td>{arAging.days90Plus.count}</td>
                  <td>{formatCurrency(arAging.days90Plus.amount)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ marginRight: '10px', fontWeight: 500 }}>Forecast Period:</label>
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #e5e7eb',
                fontSize: '14px'
              }}
            >
              <option value={30}>30 Days</option>
              <option value={60}>60 Days</option>
              <option value={90}>90 Days</option>
              <option value={180}>180 Days</option>
            </select>
          </div>

          <div className="grid grid-cols-4">
            <div className="kpi-card success">
              <div className="kpi-label">Total Inflows</div>
              <div className="kpi-value">{formatCurrency(totalInflows)}</div>
              <div className="kpi-change">Next {days} days</div>
            </div>
            <div className="kpi-card danger">
              <div className="kpi-label">Total Outflows</div>
              <div className="kpi-value">{formatCurrency(totalOutflows)}</div>
              <div className="kpi-change">Next {days} days</div>
            </div>
            <div className="kpi-card info">
              <div className="kpi-label">Net Cash Flow</div>
              <div className="kpi-value">{formatCurrency(netCashFlow)}</div>
              <div className={`kpi-change ${netCashFlow >= 0 ? 'positive' : 'negative'}`}>
                {netCashFlow >= 0 ? 'Positive' : 'Negative'}
              </div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Ending Balance</div>
              <div className="kpi-value">{formatCurrency(endingBalance)}</div>
              <div className="kpi-change">Projected</div>
            </div>
          </div>

          <div className="card" style={{ marginTop: '20px' }}>
            <div className="card-header">
              <h3 className="card-title">Cash Flow Projection</h3>
              <p className="card-subtitle">Daily inflows, outflows, and balance</p>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={sampledData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Line type="monotone" dataKey="inflows" stroke="#10b981" strokeWidth={2} name="Inflows" />
                <Line type="monotone" dataKey="outflows" stroke="#ef4444" strokeWidth={2} name="Outflows" />
                <Line type="monotone" dataKey="balance" stroke="#6366f1" strokeWidth={2} name="Balance" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card" style={{ marginTop: '20px' }}>
            <div className="card-header">
              <h3 className="card-title">Net Cash Flow by Week</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={sampledData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Area type="monotone" dataKey="netCashFlow" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="card" style={{ marginTop: '20px' }}>
            <div className="card-header">
              <h3 className="card-title">Weekly Forecast Detail</h3>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Inflows</th>
                  <th>Outflows</th>
                  <th>Net Cash Flow</th>
                  <th>Balance</th>
                </tr>
              </thead>
              <tbody>
                {sampledData.map((day, index) => (
                  <tr key={index}>
                    <td>{day.date}</td>
                    <td style={{ color: '#10b981' }}>{formatCurrency(day.inflows)}</td>
                    <td style={{ color: '#ef4444' }}>{formatCurrency(day.outflows)}</td>
                    <td style={{ color: day.netCashFlow >= 0 ? '#10b981' : '#ef4444' }}>
                      {formatCurrency(day.netCashFlow)}
                    </td>
                    <td><strong>{formatCurrency(day.balance)}</strong></td>
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

export default FinancialAnalytics;
