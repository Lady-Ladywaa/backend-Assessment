import React from 'react';
import { Edit2, Trash2, Tag, Box } from 'lucide-react';

export default function ProductCard({ product, onEdit, onDelete }) {
  const { id, name, price, quantity } = product;
  const numPrice = Number(price) || 0;
  const numQty = Number(quantity) || 0;
  const isLowStock = numQty <= 1;
  const totalValue = numPrice * numQty;

  return (
    <div className="product-card animate-fade-in">
      <div>
        <div className="product-header">
          <div className="product-title-group">
            <h3>{name}</h3>
            <span className="product-id-tag">ID: {id}</span>
          </div>

          <span className={`quantity-badge ${isLowStock ? 'low-stock' : 'in-stock'}`}>
            <Box size={13} />
            <span>{numQty} {numQty === 1 ? 'unit' : 'units'}</span>
          </span>
        </div>

        <div className="product-pricing">
          <div className="price-val">
            ฿{numPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="total-value-label">
            Total value: ฿{totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      <div className="product-actions">
        <button
          className="btn-edit"
          onClick={() => onEdit(product)}
          title="Edit product"
        >
          <Edit2 size={14} />
          <span>Edit</span>
        </button>

        <button
          className="btn-danger"
          onClick={() => onDelete(id)}
          title="Delete product"
        >
          <Trash2 size={14} />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
}
