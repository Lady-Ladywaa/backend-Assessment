import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ searchQuery, setSearchQuery, onSearchSubmit }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearchSubmit(searchQuery);
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    onSearchSubmit('');
  };

  return (
    <div className="controls-bar">
      <div className="search-box">
        <Search className="search-icon" size={18} />
        <input
          type="text"
          className="search-input"
          placeholder="Search products by name (e.g. Mouse, Keyboard)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        {searchQuery && (
          <button className="clear-search-btn" onClick={handleClear} title="Clear search">
            <X size={16} />
          </button>
        )}
      </div>

      <button
        className="btn-secondary"
        onClick={() => onSearchSubmit(searchQuery)}
      >
        <Search size={16} />
        <span>Filter via Query String (`?name=`)</span>
      </button>
    </div>
  );
}
