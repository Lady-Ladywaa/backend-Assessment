import React, { useState, useEffect, useCallback } from 'react';
import Header, { StatsSummary } from './components/Header';
import SearchBar from './components/SearchBar';
import ProductCard from './components/ProductCard';
import ProductFormModal from './components/ProductFormModal';
import { LoadingBanner, ErrorBanner, EmptyBanner } from './components/StatusBanner';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // Search filter state
  const [searchQuery, setSearchQuery] = useState('');

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalServerError, setModalServerError] = useState('');

  // Fetch products from Express API
  const fetchProducts = useCallback(async (queryParam = '') => {
    setLoading(true);
    setError(null);
    try {
      const url = queryParam
        ? `${API_BASE_URL}/products?name=${encodeURIComponent(queryParam)}`
        : `${API_BASE_URL}/products`;

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Server returned HTTP status ${response.status}`);
      }

      const data = await response.json();
      setProducts(data);
      setIsConnected(true);
    } catch (err) {
      console.error('Fetch products error:', err);
      setError(err.message || 'Failed to fetch products from backend server');
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch on component mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle Search Submission
  const handleSearchSubmit = (query) => {
    fetchProducts(query);
  };

  // Open Modal for Create Mode
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setModalServerError('');
    setIsModalOpen(true);
  };

  // Open Modal for Edit Mode
  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setModalServerError('');
    setIsModalOpen(true);
  };

  // Close Modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setModalServerError('');
  };

  // Add Product Handler (POST /products)
  const handleCreateProduct = async (productData) => {
    setIsSubmitting(true);
    setModalServerError('');
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to add product');
      }

      // Update UI state in-memory without page reload
      setProducts((prev) => [...prev, responseData]);
      handleCloseModal();
    } catch (err) {
      console.error('Create product error:', err);
      setModalServerError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update Product Handler (PUT /products/:id)
  const handleUpdateProduct = async (productData) => {
    if (!editingProduct) return;
    setIsSubmitting(true);
    setModalServerError('');
    try {
      const response = await fetch(`${API_BASE_URL}/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to update product');
      }

      // Update UI state in-memory without page reload
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? responseData : p))
      );
      handleCloseModal();
    } catch (err) {
      console.error('Update product error:', err);
      setModalServerError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Form Submit dispatcher
  const handleFormSubmit = (formData) => {
    if (editingProduct) {
      handleUpdateProduct(formData);
    } else {
      handleCreateProduct(formData);
    }
  };

  // Delete Product Handler (DELETE /products/:id)
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to delete product');
      }

      // Update UI state in-memory without page reload
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Delete product error:', err);
      alert(`Delete Error: ${err.message}`);
    }
  };

  return (
    <div className="app-container">
      <Header
        isConnected={isConnected}
        products={products}
        onOpenAddModal={handleOpenAddModal}
      />

      <StatsSummary products={products} />

      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
      />

      {loading && <LoadingBanner />}

      {!loading && error && (
        <ErrorBanner
          message={error}
          onRetry={() => fetchProducts(searchQuery)}
        />
      )}

      {!loading && !error && products.length === 0 && (
        <EmptyBanner
          searchQuery={searchQuery}
          onClearSearch={() => {
            setSearchQuery('');
            fetchProducts('');
          }}
        />
      )}

      {!loading && !error && products.length > 0 && (
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteProduct}
            />
          ))}
        </div>
      )}

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        initialData={editingProduct}
        isSubmitting={isSubmitting}
        serverError={modalServerError}
      />
    </div>
  );
}
