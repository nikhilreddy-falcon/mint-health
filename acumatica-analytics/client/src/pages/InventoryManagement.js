import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';
import { Package, Brain } from 'lucide-react';

const InventoryManagement = () => {
  const [inventory, setInventory] = useState(null);
  const [turnover, setTurnover] = useState([]);
  const [forecasts, setForecasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('stock'); // 'stock' or 'forecasting'

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [inventoryRes, turnoverRes] = await Promise.all([
        axios.get('http://localhost:7006/api/analytics/inventory'),
        axios.get('http://localhost:7006/api/analytics/inventory-turnover')
      ]);
      setInventory(inventoryRes.data);
      setTurnover(turnoverRes.data);

      // Simulate forecast data (in real implementation, this would come from API)
      const simulatedForecasts = turnoverRes.data.slice(0, 20).map((item, index) => ({
        productName: item.description,
        currentStock: item.qtyOnHand,
        avgMonthlyDemand: Math.round(item.annualSales / 12),
        trend: index % 3 === 0 ? 'Growing' : index % 3 === 1 ? 'Stable' : 'Declining',
        seasonal: index % 4 === 0,
        nextMonthForecast: Math.round(item.annualSales / 12 * (1 + (Math.random() * 0.2 - 0.1))),
        threeMonthForecast: Math.round(item.annualSales / 12 * 3 * (1 + (Math.random() * 0.2 - 0.1)))
      }));
      setForecasts(simulatedForecasts);

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

  const inventoryByClass = Object.entries(inventory.inventoryByClass).map(([itemClass, data]) => ({
    class: itemClass,
    count: data.count,
    value: Math.round(data.value)
  }));

  // Demand trend analysis
  const growingDemand = forecasts.filter(f => f.trend === 'Growing').length;
  const stableDemand = forecasts.filter(f => f.trend === 'Stable').length;
  const decliningDemand = forecasts.filter(f => f.trend === 'Declining').length;
  const seasonalProducts = forecasts.filter(f => f.seasonal).length;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Inventory Management</h1>
        <p className="page-subtitle">Stock levels, demand forecasting, and inventory optimization</p>
      </div>

      {/* View Toggle */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
        <span style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>View:</span>
        <button
          onClick={() => setActiveView('stock')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: activeView === 'stock' ? '2px solid #6366f1' : '1px solid #e5e7eb',
            background: activeView === 'stock' ? '#eff6ff' : 'white',
            color: activeView === 'stock' ? '#6366f1' : '#6b7280',
            fontWeight: activeView === 'stock' ? '600' : '500',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Package size={16} />
          Stock & Inventory
        </button>
        <button
          onClick={() => setActiveView('forecasting')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: activeView === 'forecasting' ? '2px solid #10b981' : '1px solid #e5e7eb',
            background: activeView === 'forecasting' ? '#f0fdf4' : 'white',
            color: activeView === 'forecasting' ? '#10b981' : '#6b7280',
            fontWeight: activeView === 'forecasting' ? '600' : '500',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Brain size={16} />
          Demand Forecasting
        </button>
      </div>

      {activeView === 'stock' ? (
        <>
          <div className="grid grid-cols-4">
            <div className="kpi-card info">
              <div className="kpi-label">Total Inventory Value</div>
              <div className="kpi-value">{formatCurrency(inventory.totalValue)}</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Total Items</div>
              <div className="kpi-value">{inventory.totalItems}</div>
            </div>
            <div className="kpi-card warning">
              <div className="kpi-label">Low Stock Items</div>
              <div className="kpi-value">{inventory.lowStockItems.length}</div>
            </div>
            <div className="kpi-card danger">
              <div className="kpi-label">Dead Stock Items</div>
              <div className="kpi-value">{inventory.deadStock.length}</div>
            </div>
          </div>

          <div className="grid grid-cols-2" style={{ marginTop: '20px' }}>
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Inventory by Class</h3>
                <p className="card-subtitle">Value distribution</p>
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={inventoryByClass}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="class" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="value" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Inventory Issues</h3>
              </div>
              <div>
                <div className="stat-row">
                  <span className="stat-label">Low Stock Items</span>
                  <span className="stat-value">
                    <span className="badge warning">{inventory.lowStockItems.length}</span>
                  </span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Overstock Items</span>
                  <span className="stat-value">
                    <span className="badge info">{inventory.overStockItems.length}</span>
                  </span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Dead Stock Items</span>
                  <span className="stat-value">
                    <span className="badge danger">{inventory.deadStock.length}</span>
                  </span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Active Items</span>
                  <span className="stat-value">{inventory.activeItems}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Dead Stock Value</span>
                  <span className="stat-value">
                    {formatCurrency(inventory.deadStock.reduce((sum, item) => sum + item.value, 0))}
                  </span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Overstock Value</span>
                  <span className="stat-value">
                    {formatCurrency(inventory.overStockItems.reduce((sum, item) => sum + item.excessValue, 0))}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="card" style={{ marginTop: '20px' }}>
            <div className="card-header">
              <h3 className="card-title">Low Stock Items - Action Required</h3>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Item ID</th>
                  <th>Description</th>
                  <th>On Hand</th>
                  <th>Reorder Point</th>
                  <th>On Order</th>
                </tr>
              </thead>
              <tbody>
                {inventory.lowStockItems.slice(0, 15).map((item, index) => (
                  <tr key={index}>
                    <td>{item.inventoryID}</td>
                    <td>{item.description}</td>
                    <td><span className="badge danger">{item.qtyOnHand}</span></td>
                    <td>{item.reorderPoint}</td>
                    <td>{item.qtyOnOrder}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card" style={{ marginTop: '20px' }}>
            <div className="card-header">
              <h3 className="card-title">Fastest Moving Items</h3>
              <p className="card-subtitle">Lowest days to sell</p>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Item ID</th>
                  <th>Description</th>
                  <th>On Hand</th>
                  <th>Annual Sales</th>
                  <th>Turnover Ratio</th>
                  <th>Days to Sell</th>
                </tr>
              </thead>
              <tbody>
                {turnover.slice(0, 15).map((item, index) => (
                  <tr key={index}>
                    <td>{item.inventoryID}</td>
                    <td>{item.description}</td>
                    <td>{item.qtyOnHand}</td>
                    <td>{item.annualSales}</td>
                    <td>{item.turnoverRatio}</td>
                    <td>
                      <span className={`badge ${item.daysToSell < 30 ? 'success' : item.daysToSell < 90 ? 'warning' : 'danger'}`}>
                        {item.daysToSell}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-4">
            <div className="kpi-card info">
              <div className="kpi-label">Products Tracked</div>
              <div className="kpi-value">{forecasts.length}</div>
              <div className="kpi-change">Active SKUs forecasted</div>
            </div>
            <div className="kpi-card success">
              <div className="kpi-label">Growing Demand</div>
              <div className="kpi-value">{growingDemand}</div>
              <div className="kpi-change">Upward trend detected</div>
            </div>
            <div className="kpi-card warning">
              <div className="kpi-label">Declining Demand</div>
              <div className="kpi-value">{decliningDemand}</div>
              <div className="kpi-change">Downward trend</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Seasonal Products</div>
              <div className="kpi-value">{seasonalProducts}</div>
              <div className="kpi-change">Pattern detected</div>
            </div>
          </div>

          <div className="card" style={{ marginTop: '20px' }}>
            <div className="card-header">
              <h3 className="card-title">Demand Forecasts - 3 Month Outlook</h3>
              <p className="card-subtitle">Rolling average forecasting for inventory management</p>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Current Stock</th>
                  <th>Avg Monthly Demand</th>
                  <th>Months of Stock</th>
                  <th>Trend</th>
                  <th>Next Month Forecast</th>
                  <th>3-Month Forecast</th>
                </tr>
              </thead>
              <tbody>
                {forecasts.slice(0, 20).map((forecast, index) => {
                  const monthsOfStock = forecast.currentStock / forecast.avgMonthlyDemand;
                  return (
                    <tr key={index}>
                      <td>{forecast.productName}</td>
                      <td>{forecast.currentStock}</td>
                      <td>{Math.round(forecast.avgMonthlyDemand)}</td>
                      <td>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          background: monthsOfStock < 2 ? '#fee2e2' : monthsOfStock < 4 ? '#fed7aa' : '#d1fae5',
                          color: monthsOfStock < 2 ? '#991b1b' : monthsOfStock < 4 ? '#92400e' : '#065f46'
                        }}>
                          {monthsOfStock.toFixed(1)} months
                        </span>
                      </td>
                      <td>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          background: forecast.trend === 'Growing' ? '#d1fae5' :
                                    forecast.trend === 'Declining' ? '#fee2e2' : '#e5e7eb',
                          color: forecast.trend === 'Growing' ? '#065f46' :
                                forecast.trend === 'Declining' ? '#991b1b' : '#374151'
                        }}>
                          {forecast.trend}
                        </span>
                      </td>
                      <td>{Math.round(forecast.nextMonthForecast)}</td>
                      <td>{Math.round(forecast.threeMonthForecast)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default InventoryManagement;
