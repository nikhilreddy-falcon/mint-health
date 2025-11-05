import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import API_CONFIG from '../config/api';

const CashFlowForecast = () => {
  const [forecast, setForecast] = useState([]);
  const [days, setDays] = useState(90);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [days]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_CONFIG.ANALYTICS_API}/api/analytics/cashflow-forecast?days=${days}`);
      setForecast(res.data);
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

  const totalInflows = forecast.reduce((sum, day) => sum + day.inflows, 0);
  const totalOutflows = forecast.reduce((sum, day) => sum + day.outflows, 0);
  const netCashFlow = totalInflows - totalOutflows;
  const endingBalance = forecast.length > 0 ? forecast[forecast.length - 1].balance : 0;

  // Sample data for display (every 7 days)
  const sampledData = forecast.filter((_, index) => index % 7 === 0);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Cash Flow Forecast</h1>
        <p className="page-subtitle">Projected cash inflows and outflows</p>
      </div>

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
    </div>
  );
};

export default CashFlowForecast;
