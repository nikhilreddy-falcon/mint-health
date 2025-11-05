import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const InventoryAnalytics = () => {
  const [inventory, setInventory] = useState(null);
  const [turnover, setTurnover] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [inventoryRes, turnoverRes] = await Promise.all([
        axios.get('http://localhost:3002/api/analytics/inventory'),
        axios.get('http://localhost:3002/api/analytics/inventory-turnover')
      ]);
      setInventory(inventoryRes.data);
      setTurnover(turnoverRes.data);
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

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Inventory Analytics</h1>
        <p className="page-subtitle">Stock levels, turnover, and inventory optimization</p>
      </div>

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
    </div>
  );
};

export default InventoryAnalytics;
