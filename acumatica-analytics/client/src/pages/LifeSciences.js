import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Microscope, Wrench, ShieldCheck } from 'lucide-react';

const LifeSciences = () => {
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('sales'); // 'sales', 'service', 'compliance'
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 500);
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  // Simulated Life Sciences data
  const summary = {
    totalRevenue: 3850000,
    activeCustomers: 22,
    activeSuppliers: 22,
    equipmentSold: 145,
    serviceContracts: 98,
    warrantyActive: 112,
    complianceCertifications: 156
  };

  const equipmentCategories = [
    { name: 'Laboratory Equipment', value: 1580000, units: 45, color: '#6366f1' },
    { name: 'Diagnostic Devices', value: 1120000, units: 38, color: '#10b981' },
    { name: 'Sterilization Equipment', value: 680000, units: 32, color: '#f59e0b' },
    { name: 'Storage Systems', value: 470000, units: 30, color: '#8b5cf6' }
  ];

  const salesByMonth = [
    { month: 'Jan', revenue: 285000, units: 11 },
    { month: 'Feb', revenue: 312000, units: 13 },
    { month: 'Mar', revenue: 298000, units: 12 },
    { month: 'Apr', revenue: 335000, units: 14 },
    { month: 'May', revenue: 318000, units: 12 },
    { month: 'Jun', revenue: 345000, units: 15 }
  ];

  const topCustomers = [
    { name: 'Mater Dei Hospital', revenue: 485000, orders: 12, equipment: 'Lab Equipment, Diagnostics' },
    { name: 'St. James Hospital', revenue: 378000, orders: 9, equipment: 'Sterilization, Storage' },
    { name: 'Gozo General Hospital', revenue: 325000, orders: 8, equipment: 'Lab Equipment' },
    { name: 'Karin Grech Hospital', revenue: 298000, orders: 7, equipment: 'Diagnostics, Storage' },
    { name: 'Boffa Hospital', revenue: 265000, orders: 6, equipment: 'Sterilization' },
    { name: 'Private Clinic Network', revenue: 412000, orders: 15, equipment: 'Diagnostics' }
  ];

  const serviceContracts = [
    { customer: 'Mater Dei Hospital', equipment: 'Autoclave System AS-500', contract: 'Annual Maintenance', status: 'Active', nextService: '2025-03-15', value: 12500 },
    { customer: 'St. James Hospital', equipment: 'Blood Analyzer BA-200', contract: 'Full Service', status: 'Active', nextService: '2025-02-28', value: 8900 },
    { customer: 'Gozo General Hospital', equipment: 'Centrifuge C-3000', contract: 'Warranty Extension', status: 'Active', nextService: '2025-04-10', value: 6500 },
    { customer: 'Karin Grech Hospital', equipment: 'Microscope M-450', contract: 'Annual Maintenance', status: 'Renewal Due', nextService: '2025-02-05', value: 4200 },
    { customer: 'Boffa Hospital', equipment: 'Sterilizer ST-700', contract: 'Full Service', status: 'Active', nextService: '2025-03-22', value: 9800 }
  ];

  const complianceCerts = [
    { equipment: 'Autoclave System AS-500', certification: 'ISO 13485', issueDate: '2024-06-15', expiryDate: '2026-06-15', status: 'Valid' },
    { equipment: 'Blood Analyzer BA-200', certification: 'CE Mark', issueDate: '2024-03-10', expiryDate: '2027-03-10', status: 'Valid' },
    { equipment: 'Centrifuge C-3000', certification: 'FDA 510(k)', issueDate: '2023-11-20', expiryDate: '2025-11-20', status: 'Valid' },
    { equipment: 'Microscope M-450', certification: 'ISO 13485', issueDate: '2024-01-05', expiryDate: '2026-01-05', status: 'Valid' },
    { equipment: 'Sterilizer ST-700', certification: 'CE Mark', issueDate: '2023-08-15', expiryDate: '2025-02-15', status: 'Expiring Soon' }
  ];

  const equipmentDetails = [
    {
      id: 'EQ-2024-001',
      name: 'Autoclave System AS-500',
      category: 'Sterilization Equipment',
      customer: 'Mater Dei Hospital',
      purchaseDate: '2024-01-15',
      warrantyExpiry: '2027-01-15',
      serialNumber: 'AS500-2024-MT-001',
      value: 45000,
      supplier: 'Tuttnauer Europe',
      serviceContract: 'Annual Maintenance - €12,500/year',
      nextService: '2025-03-15',
      certifications: ['ISO 13485', 'CE Mark'],
      status: 'Active'
    }
  ];

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Life Sciences</h1>
        <p className="page-subtitle">Pharmaceutical equipment sales, service contracts, and compliance management</p>
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
          <Microscope size={16} />
          Equipment Sales
        </button>
        <button
          onClick={() => setActiveView('service')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: activeView === 'service' ? '2px solid #10b981' : '1px solid #e5e7eb',
            background: activeView === 'service' ? '#f0fdf4' : 'white',
            color: activeView === 'service' ? '#10b981' : '#6b7280',
            fontWeight: activeView === 'service' ? '600' : '500',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Wrench size={16} />
          Service & Maintenance
        </button>
        <button
          onClick={() => setActiveView('compliance')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: activeView === 'compliance' ? '2px solid #f59e0b' : '1px solid #e5e7eb',
            background: activeView === 'compliance' ? '#fffbeb' : 'white',
            color: activeView === 'compliance' ? '#f59e0b' : '#6b7280',
            fontWeight: activeView === 'compliance' ? '600' : '500',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <ShieldCheck size={16} />
          Compliance & Certifications
        </button>
      </div>

      {activeView === 'sales' ? (
        <>
          <div className="grid grid-cols-4">
            <div className="kpi-card success">
              <div className="kpi-label">Total Revenue</div>
              <div className="kpi-value">{formatCurrency(summary.totalRevenue)}</div>
              <div className="kpi-change">Equipment sales YTD</div>
            </div>
            <div className="kpi-card info">
              <div className="kpi-label">Equipment Sold</div>
              <div className="kpi-value">{summary.equipmentSold}</div>
              <div className="kpi-change">Units this year</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Active Customers</div>
              <div className="kpi-value">{summary.activeCustomers}</div>
              <div className="kpi-change">Hospitals & clinics</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Active Suppliers</div>
              <div className="kpi-value">{summary.activeSuppliers}</div>
              <div className="kpi-change">Equipment manufacturers</div>
            </div>
          </div>

          <div className="card" style={{ marginTop: '20px' }}>
            <div className="card-header">
              <h3 className="card-title">Business Unit Overview</h3>
              <p className="card-subtitle">Life Sciences - Pharmaceutical Equipment</p>
            </div>
            <div style={{ padding: '20px', background: '#f9fafb', borderRadius: '8px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Equipment Categories</div>
                <div style={{ fontSize: '24px', fontWeight: 600, color: '#111827' }}>4</div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Lab, Diagnostic, Sterilization, Storage</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Active Customers</div>
                <div style={{ fontSize: '24px', fontWeight: 600, color: '#111827' }}>{summary.activeCustomers}</div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Hospitals, clinics, research facilities</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Order Type</div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#111827' }}>Direct Orders</div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>B2B equipment sales</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2" style={{ marginTop: '20px' }}>
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Revenue by Equipment Category</h3>
                <p className="card-subtitle">Sales breakdown</p>
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={equipmentCategories}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) => `${name.split(' ')[0]}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {equipmentCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Monthly Sales Trend</h3>
                <p className="card-subtitle">Last 6 months</p>
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={salesByMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} name="Revenue" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card" style={{ marginTop: '20px' }}>
            <div className="card-header">
              <h3 className="card-title">Top Customers by Revenue</h3>
              <p className="card-subtitle">Hospitals and medical facilities</p>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Revenue</th>
                  <th>Orders</th>
                  <th>Equipment Types</th>
                </tr>
              </thead>
              <tbody>
                {topCustomers.map((customer, index) => (
                  <tr key={index}>
                    <td style={{ fontWeight: 600 }}>{customer.name}</td>
                    <td>{formatCurrency(customer.revenue)}</td>
                    <td>{customer.orders}</td>
                    <td style={{ fontSize: '12px', color: '#6b7280' }}>{customer.equipment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card" style={{ marginTop: '20px' }}>
            <div className="card-header">
              <h3 className="card-title">Equipment Category Performance</h3>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Units Sold</th>
                  <th>Revenue</th>
                  <th>Avg Unit Price</th>
                  <th>% of Total</th>
                </tr>
              </thead>
              <tbody>
                {equipmentCategories.map((category, index) => (
                  <tr key={index}>
                    <td style={{ fontWeight: 600 }}>{category.name}</td>
                    <td>{category.units}</td>
                    <td>{formatCurrency(category.value)}</td>
                    <td>{formatCurrency(category.value / category.units)}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{
                          width: '80px',
                          height: '20px',
                          background: '#e5e7eb',
                          borderRadius: '4px',
                          overflow: 'hidden',
                          marginRight: '10px'
                        }}>
                          <div style={{
                            width: `${(category.value / summary.totalRevenue * 100)}%`,
                            height: '100%',
                            background: category.color,
                            transition: 'width 0.3s'
                          }} />
                        </div>
                        <span style={{ fontWeight: 600 }}>{((category.value / summary.totalRevenue) * 100).toFixed(1)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : activeView === 'service' ? (
        <>
          <div className="grid grid-cols-4">
            <div className="kpi-card success">
              <div className="kpi-label">Service Contracts</div>
              <div className="kpi-value">{summary.serviceContracts}</div>
              <div className="kpi-change">Active maintenance agreements</div>
            </div>
            <div className="kpi-card info">
              <div className="kpi-label">Warranty Active</div>
              <div className="kpi-value">{summary.warrantyActive}</div>
              <div className="kpi-change">Equipment under warranty</div>
            </div>
            <div className="kpi-card warning">
              <div className="kpi-label">Service Revenue</div>
              <div className="kpi-value">{formatCurrency(485000)}</div>
              <div className="kpi-change">Annual contract value</div>
            </div>
            <div className="kpi-card danger">
              <div className="kpi-label">Renewals Due</div>
              <div className="kpi-value">12</div>
              <div className="kpi-change">Next 30 days</div>
            </div>
          </div>

          <div className="card" style={{ marginTop: '20px' }}>
            <div className="card-header">
              <h3 className="card-title">Active Service Contracts</h3>
              <p className="card-subtitle">Maintenance agreements and warranty extensions</p>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Equipment</th>
                  <th>Contract Type</th>
                  <th>Status</th>
                  <th>Next Service</th>
                  <th>Annual Value</th>
                </tr>
              </thead>
              <tbody>
                {serviceContracts.map((contract, index) => (
                  <tr key={index}>
                    <td style={{ fontWeight: 600 }}>{contract.customer}</td>
                    <td>{contract.equipment}</td>
                    <td>{contract.contract}</td>
                    <td>
                      <span className={`badge ${contract.status === 'Active' ? 'success' : 'warning'}`}>
                        {contract.status}
                      </span>
                    </td>
                    <td>{contract.nextService}</td>
                    <td>{formatCurrency(contract.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-2" style={{ marginTop: '20px' }}>
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Service Schedule</h3>
                <p className="card-subtitle">Upcoming maintenance visits</p>
              </div>
              <div style={{ padding: '20px' }}>
                {serviceContracts.slice(0, 5).map((contract, index) => (
                  <div key={index} style={{
                    padding: '12px',
                    marginBottom: '10px',
                    background: '#f9fafb',
                    borderRadius: '8px',
                    borderLeft: `4px solid ${contract.status === 'Active' ? '#10b981' : '#f59e0b'}`
                  }}>
                    <div style={{ fontWeight: 600, marginBottom: '4px' }}>{contract.equipment}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>{contract.customer}</div>
                    <div style={{ fontSize: '12px', marginTop: '4px', color: '#111827' }}>
                      Next Service: <strong>{contract.nextService}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Contract Statistics</h3>
              </div>
              <div>
                <div className="stat-row">
                  <span className="stat-label">Total Contracts</span>
                  <span className="stat-value">{summary.serviceContracts}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Annual Maintenance</span>
                  <span className="stat-value">65</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Full Service</span>
                  <span className="stat-value">23</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Warranty Extensions</span>
                  <span className="stat-value">10</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Total Contract Value</span>
                  <span className="stat-value">{formatCurrency(485000)}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Avg Contract Value</span>
                  <span className="stat-value">{formatCurrency(485000 / summary.serviceContracts)}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-4">
            <div className="kpi-card success">
              <div className="kpi-label">Total Certifications</div>
              <div className="kpi-value">{summary.complianceCertifications}</div>
              <div className="kpi-change">Active certificates</div>
            </div>
            <div className="kpi-card info">
              <div className="kpi-label">ISO 13485</div>
              <div className="kpi-value">78</div>
              <div className="kpi-change">Quality management</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">CE Mark</div>
              <div className="kpi-value">52</div>
              <div className="kpi-change">European compliance</div>
            </div>
            <div className="kpi-card warning">
              <div className="kpi-label">Expiring Soon</div>
              <div className="kpi-value">8</div>
              <div className="kpi-change">Within 90 days</div>
            </div>
          </div>

          <div className="card" style={{ marginTop: '20px' }}>
            <div className="card-header">
              <h3 className="card-title">Compliance & Certifications</h3>
              <p className="card-subtitle">Regulatory certifications and quality standards</p>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Equipment</th>
                  <th>Certification</th>
                  <th>Issue Date</th>
                  <th>Expiry Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {complianceCerts.map((cert, index) => (
                  <tr key={index}>
                    <td style={{ fontWeight: 600 }}>{cert.equipment}</td>
                    <td>
                      <span className="badge info">{cert.certification}</span>
                    </td>
                    <td>{cert.issueDate}</td>
                    <td>{cert.expiryDate}</td>
                    <td>
                      <span className={`badge ${cert.status === 'Valid' ? 'success' : 'warning'}`}>
                        {cert.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-2" style={{ marginTop: '20px' }}>
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Certification Breakdown</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[
                  { name: 'ISO 13485', count: 78 },
                  { name: 'CE Mark', count: 52 },
                  { name: 'FDA 510(k)', count: 26 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Compliance Summary</h3>
              </div>
              <div>
                <div className="stat-row">
                  <span className="stat-label">Total Certifications</span>
                  <span className="stat-value">{summary.complianceCertifications}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Valid Certificates</span>
                  <span className="stat-value">
                    <span className="badge success">148</span>
                  </span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Expiring in 90 Days</span>
                  <span className="stat-value">
                    <span className="badge warning">8</span>
                  </span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Renewal Required</span>
                  <span className="stat-value">
                    <span className="badge danger">0</span>
                  </span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Compliance Rate</span>
                  <span className="stat-value">100%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card" style={{ marginTop: '20px' }}>
            <div className="card-header">
              <h3 className="card-title">Regulatory Standards</h3>
              <p className="card-subtitle">Industry compliance requirements</p>
            </div>
            <div style={{ padding: '20px' }}>
              <div className="grid grid-cols-3" style={{ gap: '20px' }}>
                <div style={{
                  padding: '20px',
                  background: 'rgba(99, 102, 241, 0.1)',
                  borderRadius: '12px',
                  border: '1px solid #e0e7ff'
                }}>
                  <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>ISO 13485</div>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>78</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>Medical devices quality management system</div>
                </div>
                <div style={{
                  padding: '20px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  borderRadius: '12px',
                  border: '1px solid #d1fae5'
                }}>
                  <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>CE Mark</div>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>52</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>European health & safety compliance</div>
                </div>
                <div style={{
                  padding: '20px',
                  background: 'rgba(245, 158, 11, 0.1)',
                  borderRadius: '12px',
                  border: '1px solid #fef3c7'
                }}>
                  <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>FDA 510(k)</div>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>26</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>US FDA premarket notification</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LifeSciences;
