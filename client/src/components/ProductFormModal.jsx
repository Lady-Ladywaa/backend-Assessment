import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

export default function ProductFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting,
  serverError,
}) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [clientError, setClientError] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setPrice(initialData.price !== undefined ? String(initialData.price) : '');
      setQuantity(initialData.quantity !== undefined ? String(initialData.quantity) : '1');
    } else {
      setName('');
      setPrice('');
      setQuantity('1');
    }
    setClientError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setClientError('');

    if (!name.trim()) {
      setClientError('Product name is required');
      return;
    }

    const numPrice = Number(price);
    if (price === '' || isNaN(numPrice) || numPrice < 0) {
      setClientError('Please enter a valid non-negative price');
      return;
    }

    const numQuantity = Number(quantity);
    if (quantity === '' || isNaN(numQuantity) || numQuantity < 1) {
      setClientError('Quantity must be at least 1 unit');
      return;
    }

    onSubmit({
      name: name.trim(),
      price: numPrice,
      quantity: Math.floor(numQuantity),
    });
  };

  const isEditMode = Boolean(initialData && initialData.id);

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditMode ? `Edit Product (${initialData.id})` : 'Add New Product'}</h2>
          <button className="close-modal-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {(clientError || serverError) && (
              <div className="form-error">
                <AlertCircle size={16} style={{ display: 'inline', marginRight: '6px' }} />
                {clientError || serverError}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="prod-name">Product Name *</label>
              <input
                id="prod-name"
                type="text"
                className="form-input"
                placeholder="e.g. Wireless Gaming Mouse"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="prod-price">Price (฿) *</label>
              <input
                id="prod-price"
                type="number"
                step="0.01"
                min="0"
                className="form-input"
                placeholder="e.g. 1200.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="prod-quantity">Quantity *</label>
              <input
                id="prod-quantity"
                type="number"
                min="1"
                step="1"
                className="form-input"
                placeholder="e.g. 1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span>Saving...</span>
              ) : (
                <>
                  <CheckCircle size={16} />
                  <span>{isEditMode ? 'Update Product' : 'Add Product'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
