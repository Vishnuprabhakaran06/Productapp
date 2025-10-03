
import React, { useMemo, useState } from 'react';
import useProducts from './hooks/useProducts';
import ProductStats from './components/ProductStats';
import SearchFilters from './components/SearchFilters';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import './index.css';


const categories = ['All', 'Electronics', 'Clothing', 'Food', 'Books', 'Home', 'Sports', 'Other'];


export default function ProductDashboard() {
    const { products, loading, error, fetchAll, createProduct, updateProduct, deleteProduct } = useProducts();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState('newest');
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [message, setMessage] = useState('');


    const filtered = useMemo(() => {
        let list = [...products];
        if (selectedCategory !== 'All') list = list.filter(p => p.category === selectedCategory);
        if (searchTerm) {
            const t = searchTerm.toLowerCase();
            list = list.filter(p => (p.name || '').toLowerCase().includes(t) || (p.description || '').toLowerCase().includes(t) || (p.brand || '').toLowerCase().includes(t));
        }
        switch (sortBy) {
            case 'price-asc': list.sort((a, b) => a.price - b.price); break;
            case 'price-desc': list.sort((a, b) => b.price - a.price); break;
            case 'name': list.sort((a, b) => a.name.localeCompare(b.name)); break;
            default: break;
        }
        return list;
    }, [products, searchTerm, selectedCategory, sortBy]);


    const onAdd = () => { setEditing(null); setShowModal(true); };
    const onEdit = (p) => { setEditing(p); setShowModal(true); };


    const handleSubmit = async (payload) => {
        try {
            if (editing) {
                await updateProduct(editing._id, payload);
                setMessage('Product updated');
            } else {
                await createProduct(payload);
                setMessage('Product created');
            }
            setTimeout(() => setMessage(''), 3000);
            setShowModal(false);
        } catch (err) {
            // error state handled in hook
        }
    };


    const handleDelete = async (id) => {
        if (!window.confirm('Delete product?')) return;
        try {
            await deleteProduct(id);
            setMessage('Product deleted');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) { }
    };


    return (
        <main className="product-hub">
            <div className="background-blur" aria-hidden></div>


            <div className="container">
                <header className="header">
                    <h1>Product Hub</h1>
                    <p>Manage your inventory with style</p>
                </header>


                {error && <div className="alert error" role="alert">{error}</div>}
                {message && <div className="alert success" role="status">{message}</div>}


                <ProductStats products={products} />


                <SearchFilters categories={categories} searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} sortBy={sortBy} setSortBy={setSortBy} onAdd={onAdd} disableAdd={loading.create || loading.update} />


                <ProductList products={filtered} onEdit={onEdit} onDelete={handleDelete} loadingOps={loading} />


                {showModal && (
                    <div className="modal" role="dialog" aria-modal="true">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h2>{editing ? 'Edit Product' : 'Add Product'}</h2>
                                <button onClick={() => setShowModal(false)} aria-label="Close dialog">✕</button>
                            </div>


                            <ProductForm initial={editing} onCancel={() => setShowModal(false)} onSubmit={handleSubmit} categories={categories} submitting={loading.create || loading.update} />
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}