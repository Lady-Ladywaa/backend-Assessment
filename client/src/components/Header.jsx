import React from 'react';
import { ShoppingBag, Plus, Server, Package, DollarSign, Layers } from 'lucide-react';

export default function Header({ isConnected, products, onOpenAddModal }) {
  const totalProducts = products.length;
  const totalItemsCount = products.reduce((acc, p) => acc + (Number(p.quantity) || 0), 0);
  const totalValue = products.reduce((acc, p) => acc + (Number(p.price) || 0) * (Number(p.quantity) || 0), 0);

  return (
    <header className="header">
      <div className="brand">
        <div className="brand-icon">
          <ShoppingBag size={24} />
        </div>
        <div className="brand-text">
          <h1>Product Inventory Manager</h1>
          <p>Express API & React Integration Assessment</p>
        </div>
      </div>

      <div className="header-actions">
        <div className={`status-badge ${isConnected ? 'connected' : 'disconnected'}`}>
          <span className="status-dot"></span>
          <span>{isConnected ? 'API Connected (Port 3000)' : 'API Disconnected'}</span>
        </div>

        <button className="btn-primary" onClick={onOpenAddModal}>
          <Plus size={18} />
          <span>Add Product</span>
        </button>
      </div>
    </header>
  );
}

export function StatsSummary({ products }) {
  const totalProducts = products.length;
  const totalItemsCount = products.reduce((acc, p) => acc + (Number(p.quantity) || 0), 0);
  const totalValue = products.reduce((acc, p) => acc + (Number(p.price) || 0) * (Number(p.quantity) || 0), 0);

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon">
          <Package size={22} />
        </div>
        <div className="stat-info">
          <div className="stat-label">Unique Products</div>
          <div className="stat-value">{totalProducts}</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">
          <Layers size={22} />
        </div>
        <div className="stat-info">
          <div className="stat-label">Total Units in Stock</div>
          <div className="stat-value">{totalItemsCount}</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">
          <DollarSign size={22} />
        </div>
        <div className="stat-info">
          <div className="stat-label">Total Inventory Value</div>
          <div className="stat-value">฿{totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
        </div>
      </div>
    </div>
  );
}
