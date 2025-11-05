import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import API_CONFIG from '../config/api';

const ForecastingDashboard = () => {
  const [forecasts, setForecasts] = useState(null);
  const [tenders, setTenders] = useState(null);
  const [businessUnit, setBusinessUnit] = useState('PHARMA');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [businessUnit]);

  const fetchData = async () => {
    try {
      const [forecastRes, tenderRes] = await Promise.all([
        axios.get(`${API_CONFIG.ANALYTICS_API}/api/analytics/forecasting?businessUnit=${businessUnit}`),
        axios.get(`${API_CONFIG.ANALYTICS_API}/api/analytics/tenders`)
      ]);
      setForecasts(forecastRes.data);
      setTenders(tenderRes.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-MT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(value);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-MT');
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Demand Forecasting & Inventory Management</h1>
        <p className="page-subtitle">AI-powered forecasting based on historical sales data and government tender tracking</p>
      </div>

      {/* Business Unit Selector */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '10px', fontWeight: 600 }}>Business Unit:</label>
        <select
          value={businessUnit}
          onChange={(e) => setBusinessUnit(e.target.value)}
          style={{
            padding: '10px 15px',
            borderRadius: '6px',
            border: '1px solid #e5e7eb',
            fontSize: '14px',
            fontWeight: 500
          }}
        >
          <option value="PHARMA">PHARMA - Pharmaceutical Distribution</option>
          <option value="WELLNESS">WELLNESS - Vitamins & Supplements</option>
          <option value="PHARMACY">PHARMACY - Mint Care Pharmacy Operations</option>
        </select>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-4">
        <div className="kpi-card info">
          <div className="kpi-label">Total SKUs Tracked</div>
          <div className="kpi-value">{forecasts?.summary?.totalSKUs || 0}</div>
          <div className="kpi-change">Across all business units</div>
        </div>
        <div className="kpi-card warning">
          <div className="kpi-label">Items Need Reorder</div>
          <div className="kpi-value">{forecasts?.summary?.needsReorder || 0}</div>
          <div className="kpi-change">Below safety stock</div>
        </div>
        <div className="kpi-card danger">
          <div className="kpi-label">Expiring Soon (60 days)</div>
          <div className="kpi-value">{forecasts?.summary?.expiringSoon || 0}</div>
          <div className="kpi-change">Action required</div>
        </div>
        <div className="kpi-card success">
          <div className="kpi-label">Active Government Tenders</div>
          <div className="kpi-value">{forecasts?.summary?.activeTenders || 47}</div>
          <div className="kpi-change">Tracking CPSU contracts</div>
        </div>
      </div>

      {businessUnit === 'PHARMA' && (
        <>
          {/* PHARMA Forecasting */}
          <div className="card" style={{ marginTop: '20px' }}>
            <div className="card-header">
              <h3 className="card-title">PHARMA - Pharmaceutical Distribution Forecast</h3>
              <p className="card-subtitle">Demand forecast for prescription & OTC medications - Rolling 3-month average</p>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>SKU Code</th>
                  <th>Product</th>
                  <th>Current Stock</th>
                  <th>Monthly Avg</th>
                  <th>Months of Stock</th>
                  <th>Expiry Date</th>
                  <th>Reorder Status</th>
                  <th>Suggested Order</th>
                </tr>
              </thead>
              <tbody>
                {forecasts?.forecasts?.slice(0, 15).map((item, index) => (
                  <tr key={index}>
                    <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>{item.skuCode}</td>
                    <td>{item.productName}</td>
                    <td>{item.currentStock}</td>
                    <td>{item.monthlyAverage}</td>
                    <td>
                      <span className={`badge ${item.monthsOfStock < 2 ? 'danger' : item.monthsOfStock < 3 ? 'warning' : 'success'}`}>
                        {item.monthsOfStock.toFixed(1)}
                      </span>
                    </td>
                    <td style={{ fontSize: '13px' }}>{formatDate(item.expiryDate)}</td>
                    <td>
                      {item.needsReorder ? (
                        <span className="badge danger">Reorder Now</span>
                      ) : (
                        <span className="badge success">OK</span>
                      )}
                    </td>
                    <td style={{ fontWeight: 600 }}>{item.suggestedOrder} units</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Consumption Trend */}
          <div className="card" style={{ marginTop: '20px' }}>
            <div className="card-header">
              <h3 className="card-title">Sales Trend - Top Products</h3>
              <p className="card-subtitle">Monthly units sold for key products</p>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={forecasts?.trendData || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="product1" stroke="#6366f1" strokeWidth={2} name="Atorvastatin 20mg" />
                <Line type="monotone" dataKey="product2" stroke="#10b981" strokeWidth={2} name="Metformin 500mg" />
                <Line type="monotone" dataKey="product3" stroke="#f59e0b" strokeWidth={2} name="Amoxicillin 500mg" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {businessUnit === 'MARKET_ACCESS' && (
        <>
          {/* Government Tender Tracking */}
          <div className="card" style={{ marginTop: '20px' }}>
            <div className="card-header">
              <h3 className="card-title">Market Access - Active Government Tenders (COOs)</h3>
              <p className="card-subtitle">Central Procurement & Supplies Unit (CPSU) confirmed orders tracking</p>
            </div>
            <div style={{ marginBottom: '15px', padding: '15px', background: '#f0f9ff', borderRadius: '6px', border: '1px solid #bae6fd' }}>
              <strong>Data Source:</strong> Acumatica ERP + CPSU Stock Reports | <strong>Customer:</strong> Ministry for Health Malta
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>COO Reference</th>
                  <th>Product</th>
                  <th>Tender Qty</th>
                  <th>Delivered</th>
                  <th>Remaining</th>
                  <th>Next Delivery</th>
                  <th>CPSU Stock</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {(Array.isArray(tenders) ? tenders : []).slice(0, 15).map((tender, index) => (
                  <tr key={index}>
                    <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>{tender.cooReference}</td>
                    <td>{tender.productName}</td>
                    <td>{tender.tenderQuantity?.toLocaleString()}</td>
                    <td>{tender.delivered?.toLocaleString()}</td>
                    <td style={{ fontWeight: 600 }}>{tender.remaining?.toLocaleString()}</td>
                    <td>{formatDate(tender.nextDeliveryDate)}</td>
                    <td>{tender.cpsuStock}</td>
                    <td>
                      <span className={`badge ${tender.status === 'On Track' ? 'success' : tender.status === 'Delayed' ? 'danger' : 'warning'}`}>
                        {tender.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tender Performance Chart */}
          <div className="card" style={{ marginTop: '20px' }}>
            <div className="card-header">
              <h3 className="card-title">Tender Fulfillment Progress</h3>
              <p className="card-subtitle">% of tender quantity delivered by product</p>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={tenders?.tenderProgress || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="product" angle={-45} textAnchor="end" height={120} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="percentDelivered" fill="#10b981" name="% Delivered" />
                <Bar dataKey="percentRemaining" fill="#f59e0b" name="% Remaining" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {businessUnit === 'LIFE_SCIENCES' && (
        <>
          {/* Life Sciences - Equipment Orders */}
          <div className="card" style={{ marginTop: '20px' }}>
            <div className="card-header">
              <h3 className="card-title">Life Sciences - Pharmaceutical Equipment</h3>
              <p className="card-subtitle">Direct orders to 22 specialized customers</p>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Equipment Type</th>
                  <th>Customer</th>
                  <th>Order Date</th>
                  <th>Delivery Date</th>
                  <th>Order Value</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {forecasts?.lifeSciencesOrders?.map((order, index) => (
                  <tr key={index}>
                    <td>{order.equipmentType}</td>
                    <td>{order.customerName}</td>
                    <td>{formatDate(order.orderDate)}</td>
                    <td>{formatDate(order.deliveryDate)}</td>
                    <td>{formatCurrency(order.orderValue)}</td>
                    <td>
                      <span className={`badge ${order.status === 'Delivered' ? 'success' : order.status === 'In Transit' ? 'info' : 'warning'}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Expiry Alert Section */}
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="card-header">
          <h3 className="card-title">Expiry Date Alerts</h3>
          <p className="card-subtitle">Products expiring within next 90 days - immediate action required</p>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>SKU Code</th>
              <th>Product</th>
              <th>Batch</th>
              <th>Current Stock</th>
              <th>Expiry Date</th>
              <th>Days to Expiry</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {forecasts?.forecasts?.filter(item => item.daysToExpiry < 90).slice(0, 10).map((item, index) => (
              <tr key={index} style={{ background: item.daysToExpiry < 30 ? '#fef2f2' : item.daysToExpiry < 60 ? '#fef3c7' : 'transparent' }}>
                <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>{item.skuCode}</td>
                <td>{item.productName}</td>
                <td>BATCH-{Math.floor(Math.random() * 9000) + 1000}</td>
                <td>{item.currentStock}</td>
                <td style={{ fontWeight: 600 }}>{formatDate(item.expiryDate)}</td>
                <td>
                  <span className={`badge ${item.daysToExpiry < 30 ? 'danger' : item.daysToExpiry < 60 ? 'warning' : 'info'}`}>
                    {item.daysToExpiry} days
                  </span>
                </td>
                <td>
                  {item.daysToExpiry < 30 ? (
                    <span style={{ color: '#dc2626', fontWeight: 600 }}>Discount/Return</span>
                  ) : item.daysToExpiry < 60 ? (
                    <span style={{ color: '#f59e0b', fontWeight: 600 }}>Promote Sales</span>
                  ) : (
                    <span style={{ color: '#6b7280' }}>Monitor</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Purchase Order Recommendations */}
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="card-header">
          <h3 className="card-title">Recommended Purchase Orders</h3>
          <p className="card-subtitle">Based on current stock levels, consumption rate, and lead times</p>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Priority</th>
              <th>Supplier</th>
              <th>Products</th>
              <th>Total Units</th>
              <th>Est. Cost</th>
              <th>Lead Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {forecasts?.recommendations?.map((rec, index) => (
              <tr key={index}>
                <td>
                  <span className={`badge ${rec.priority === 'URGENT' ? 'danger' : rec.priority === 'HIGH' ? 'warning' : 'info'}`}>
                    {rec.priority}
                  </span>
                </td>
                <td>{rec.vendorName}</td>
                <td>{rec.productCount} items</td>
                <td>{rec.totalUnits?.toLocaleString()}</td>
                <td>{formatCurrency(rec.estimatedCost)}</td>
                <td>{rec.leadTimeDays} days</td>
                <td>
                  <button
                    style={{
                      padding: '6px 12px',
                      background: '#6366f1',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}
                    onClick={() => alert('Generate PO functionality would be integrated with Acumatica ERP')}
                  >
                    Generate PO
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ForecastingDashboard;
