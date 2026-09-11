import React from 'react';
import { AlertTriangle, PackageX, RefreshCw } from 'lucide-react';

export function LoadingBanner() {
  return (
    <div className="banner">
      <div className="spinner"></div>
      <p style={{ color: 'var(--text-muted)' }}>Fetching products from Express API...</p>
    </div>
  );
}

export function ErrorBanner({ message, onRetry }) {
  return (
    <div className="banner banner-error">
      <AlertTriangle size={36} color="var(--accent-danger)" />
      <h3>Server Connection Error</h3>
      <p style={{ color: 'var(--text-main)', maxWidth: '500px' }}>
        {message || 'Unable to connect to Express backend server. Make sure the server is running on port 3000.'}
      </p>
      {onRetry && (
        <button className="btn-primary" onClick={onRetry} style={{ marginTop: '0.5rem' }}>
          <RefreshCw size={16} />
          <span>Retry Connection</span>
        </button>
      )}
    </div>
  );
}

export function EmptyBanner({ searchQuery, onClearSearch }) {
  return (
    <div className="banner">
      <PackageX size={40} color="var(--text-dark)" />
      <h3 style={{ fontSize: '1.2rem' }}>No products found</h3>
      <p style={{ color: 'var(--text-muted)' }}>
        {searchQuery
          ? `No products match your search query "${searchQuery}".`
          : 'Your product inventory is currently empty. Click "Add Product" to create one.'}
      </p>
      {searchQuery && (
        <button className="btn-secondary" onClick={onClearSearch} style={{ marginTop: '0.5rem' }}>
          <span>Clear Filter</span>
        </button>
      )}
    </div>
  );
}
