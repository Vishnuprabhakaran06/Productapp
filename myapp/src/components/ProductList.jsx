import React from 'react';
import ProductCard from './ProductCard';


export default function ProductList({ products, onEdit, onDelete, loadingOps }) {
    if (loadingOps.list) return (
        <div className="skeleton-list" aria-live="polite">Loading products...</div>
    );


    if (!products || products.length === 0) return (
        <div className="no-products" role="status">
            <h3>No products found</h3>
            <p>Try adjusting your filters or add a new product</p>
        </div>
    );


    return (
        <section className="product-list" aria-live="polite">
            {products.map(p => (
                <ProductCard key={p._id} product={p} onEdit={onEdit} onDelete={onDelete} disabled={loadingOps.create || loadingOps.update || loadingOps.remove} />
            ))}
        </section>
    );
}