import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';


export default function ProductCard({ product, onEdit, onDelete, disabled }) {
    return (
        <article className="product-card" aria-labelledby={`p-${product._id}`}>
            <div className="product-image">
                <img src={product.imageUrl || 'https://via.placeholder.com/300'} alt={product.name} onError={e => e.currentTarget.src = 'https://via.placeholder.com/300?text=No+Image'} />
                <div className="category">{product.category}</div>
                {(product.stock || 0) < 50 && <div className="low-stock">Low Stock</div>}
            </div>


            <div className="product-details">
                <div className="title-rating">
                    <h3 id={`p-${product._id}`}>{product.name}</h3>
                    <div className="rating" aria-hidden>{product.rating} ★</div>
                </div>


                <p className="description">{product.description}</p>


                <div className="tags-brand">
                    {product.brand && <span className="brand">{product.brand}</span>}
                    {product.sku && <span className="sku">SKU: {product.sku}</span>}
                </div>


                <div className="price-stock">
                    <span className="price">${product.price}</span>
                    <span className="stock">{product.stock} in stock</span>
                </div>


                {product.tags && product.tags.length > 0 && (
                    <div className="tags">
                        {product.tags.slice(0, 3).map((tag, i) => <span key={i}>#{tag}</span>)}
                    </div>
                )}


                <div className="actions">
                    <button onClick={() => onEdit(product)} disabled={disabled} aria-label={`Edit ${product.name}`}><Edit2 /> Edit</button>
                    <button onClick={() => onDelete(product._id)} disabled={disabled} aria-label={`Delete ${product.name}`}><Trash2 /> Delete</button>
                </div>
            </div>
        </article>
    );
}