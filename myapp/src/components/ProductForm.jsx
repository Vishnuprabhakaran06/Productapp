import React, { useState, useEffect } from 'react';

export default function ProductForm({ initial, onCancel, onSubmit, categories, submitting }) {
    const [data, setData] = useState(() => ({
        name: '', description: '', price: '', category: categories[0] || 'Electronics', stock: '', imageUrl: '', brand: '', rating: 5, tags: [], sku: '', isActive: true
    }));
    const [errors, setErrors] = useState({});


    useEffect(() => { if (initial) setData({ ...initial, price: initial.price ?? '', stock: initial.stock ?? '' }); }, [initial]);


    const validate = () => {
        const e = {};
        if (!data.name.trim()) e.name = 'Name is required';
        if (!data.description.trim()) e.description = 'Description is required';
        if (data.price === '' || Number(data.price) < 0) e.price = 'Price must be 0 or greater';
        if (data.stock === '' || Number(data.stock) < 0) e.stock = 'Stock must be 0 or greater';
        setErrors(e);
        return Object.keys(e).length === 0;
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;
        const payload = { ...data, price: Number(data.price), stock: Number(data.stock), tags: Array.isArray(data.tags) ? data.tags : (data.tags || []).map(t => t.trim()).filter(Boolean) };
        onSubmit(payload);
    };


    return (
        <form className="modal-form" onSubmit={handleSubmit} noValidate>
            <label>
                Name
                <input aria-invalid={!!errors.name} value={data.name} onChange={e => setData({ ...data, name: e.target.value })} required />
                {errors.name && <div className="field-error">{errors.name}</div>}
            </label>


            <label>
                Description
                <textarea value={data.description} onChange={e => setData({ ...data, description: e.target.value })} required />
                {errors.description && <div className="field-error">{errors.description}</div>}
            </label>
            <div className="grid-2">
                <label>
                    Price
                    <input type="number" min="0" step="0.01" value={data.price} onChange={e => setData({ ...data, price: e.target.value })} required />
                    {errors.price && <div className="field-error">{errors.price}</div>}
                </label>


                <label>
                    Stock
                    <input type="number" min="0" value={data.stock} onChange={e => setData({ ...data, stock: e.target.value })} required />
                    {errors.stock && <div className="field-error">{errors.stock}</div>}
                </label>
            </div>


            <label>
                Category
                <select value={data.category} onChange={e => setData({ ...data, category: e.target.value })}>
                    {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </label>


            <label>
                Image URL
                <input value={data.imageUrl} onChange={e => setData({ ...data, imageUrl: e.target.value })} placeholder="https://..." />
            </label>


            <div className="grid-2">
                <label>
                    Brand
                    <input value={data.brand} onChange={e => setData({ ...data, brand: e.target.value })} />
                </label>


                <label>
                    Rating
                    <input type="number" min="0" max="5" step="0.1" value={data.rating} onChange={e => setData({ ...data, rating: e.target.value })} />
                </label>
            </div>


            <label>
                SKU
                <input value={data.sku} onChange={e => setData({ ...data, sku: e.target.value })} />
            </label>


            <label>
                Tags (comma separated)
                <input value={(Array.isArray(data.tags) ? data.tags.join(', ') : data.tags)} onChange={e => setData({ ...data, tags: e.target.value.split(',').map(t => t.trim()) })} />
            </label>


            <label className="checkbox-label">
                Active
                <input type="checkbox" checked={data.isActive} onChange={e => setData({ ...data, isActive: e.target.checked })} />
            </label>


            <div className="modal-actions">
                <button type="submit" disabled={submitting}>{submitting ? 'Saving...' : 'Save'}</button>
                <button type="button" onClick={onCancel}>Cancel</button>
            </div>
        </form>
    );
}