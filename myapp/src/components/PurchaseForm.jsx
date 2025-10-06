import React, { useState, useEffect } from 'react';
import './PurchaseForm.css';

export default function PurchaseForm({ initial, onSubmit, onCancel, products, customers }) {
    const [form, setForm] = useState({ productId: '', customerId: '', quantity: 1 });

    useEffect(() => { if (initial) setForm(initial); }, [initial]);

    const selectedProduct = products.find(p => p._id === form.productId);
    const maxQty = selectedProduct ? selectedProduct.stock : 0;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedProduct) return alert('Select a product');
        if (form.quantity > maxQty) return alert('Not enough stock');
        onSubmit(form);
    };

    return (
        <form className="form-container" onSubmit={handleSubmit}>
            <h3>{initial ? 'Edit Purchase' : 'Add Purchase'}</h3>

            <label>Customer</label>
            <select value={form.customerId} onChange={e => setForm({ ...form, customerId: e.target.value })} required>
                <option value="">Select Customer</option>
                {customers.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>

            <label>Product</label>
            <select value={form.productId} onChange={e => setForm({ ...form, productId: e.target.value })} required>
                <option value="">Select Product</option>
                {products.map(p => <option key={p._id} value={p._id}>{p.name} (Stock: {p.stock})</option>)}
            </select>

            <label>Quantity</label>
            <input type="number" min="1" max={maxQty} value={form.quantity} onChange={e => setForm({ ...form, quantity: Number(e.target.value) })} required />

            <div className="form-buttons">
                <button type="submit">Save</button>
                <button type="button" onClick={onCancel} className="cancel-btn">Cancel</button>
            </div>
        </form>
    );
}
