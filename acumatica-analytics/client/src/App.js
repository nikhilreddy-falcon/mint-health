import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  DollarSign,
  TrendingUp,
  Users,
  Package,
  Wallet,
  LineChart,
  Brain,
  Building2,
  LogOut,
  AlertTriangle,
  ShieldCheck,
  ShoppingCart,
  Tag,
  FileText,
  Microscope
} from 'lucide-react';
import './App.css';

// Import pages
import Dashboard from './pages/Dashboard';
import FinancialAnalytics from './pages/FinancialAnalytics';
import SalesAnalytics from './pages/SalesAnalytics';
import InventoryManagement from './pages/InventoryManagement';
import SupplyChainManagement from './pages/SupplyChainManagement';
import ExpiryManagement from './pages/ExpiryManagement';
import LifeSciences from './pages/LifeSciences';
import Login from './pages/Login';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="app">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <div className="sidebar-header">
            <img src="/Falcondive.svg" alt="Falcon Dive" className="logo" />
          </div>
          <nav className="sidebar-nav">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <LayoutDashboard className="icon" size={20} />
              <span className="label">Executive Dashboard</span>
            </NavLink>
            <NavLink to="/expiry" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <AlertTriangle className="icon" size={20} />
              <span className="label">Expiry Management</span>
            </NavLink>
            <NavLink to="/inventory" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <Package className="icon" size={20} />
              <span className="label">Inventory Management</span>
            </NavLink>
            <NavLink to="/sales" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <TrendingUp className="icon" size={20} />
              <span className="label">Sales & Customers</span>
            </NavLink>
            <NavLink to="/supply-chain" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <Building2 className="icon" size={20} />
              <span className="label">Supply Chain</span>
            </NavLink>
            <NavLink to="/life-sciences" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <Microscope className="icon" size={20} />
              <span className="label">Life Sciences</span>
            </NavLink>
            <NavLink to="/financial" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <DollarSign className="icon" size={20} />
              <span className="label">Financial Analytics</span>
            </NavLink>
          </nav>

          {/* User Profile Section */}
          <div className="sidebar-footer">
            <div className="user-profile">
              <div className="user-avatar">
                <span>AD</span>
              </div>
              <div className="user-details">
                <div className="user-name">Analytics User</div>
                <div className="user-email">admin@analytics.com</div>
              </div>
              <button className="logout-btn" onClick={handleLogout} title="Logout">
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <header className="app-header">
            <button
              className="menu-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              ☰
            </button>
            <div className="header-right">
              <span className="user-info">Analytics User</span>
            </div>
          </header>

          <div className="content-area">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/expiry" element={<ExpiryManagement />} />
              <Route path="/inventory" element={<InventoryManagement />} />
              <Route path="/sales" element={<SalesAnalytics />} />
              <Route path="/supply-chain" element={<SupplyChainManagement />} />
              <Route path="/life-sciences" element={<LifeSciences />} />
              <Route path="/financial" element={<FinancialAnalytics />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
