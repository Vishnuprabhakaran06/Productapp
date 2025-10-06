import React, { useMemo, useState, useEffect } from 'react';
import useProducts from './hooks/useProducts';
import ProductStats from './components/ProductStats';
import SearchFilters from './components/SearchFilters';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import SignUpForm from './components/SignUpForm';
import SignInForm from './components/SignInForm';
import './ProductDashboard.css';
import './AuthBar.css';

const categories = ['All', 'Electronics', 'Clothing', 'Food', 'Books', 'Home', 'Sports', 'Other'];

export default function ProductDashboard() {
    const { products, loading, error, createProduct, updateProduct, deleteProduct } = useProducts();

    // ========================
    // State variables
    // ========================
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState('newest');
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [message, setMessage] = useState('');

    // Authentication
    const [user, setUser] = useState(null); // null = not logged in
    const [showSignUp, setShowSignUp] = useState(false);
    const [showSignIn, setShowSignIn] = useState(false);

    // ========================
    // Filtered Products
    // ========================
    const filtered = useMemo(() => {
        let list = [...products];
        if (selectedCategory !== 'All') list = list.filter(p => p.category === selectedCategory);
        if (searchTerm) {
            const t = searchTerm.toLowerCase();
            list = list.filter(p =>
                (p.name || '').toLowerCase().includes(t) ||
                (p.description || '').toLowerCase().includes(t) ||
                (p.brand || '').toLowerCase().includes(t)
            );
        }
        switch (sortBy) {
            case 'price-asc': list.sort((a, b) => a.price - b.price); break;
            case 'price-desc': list.sort((a, b) => b.price - a.price); break;
            case 'name': list.sort((a, b) => a.name.localeCompare(b.name)); break;
            default: break;
        }
        return list;
    }, [products, searchTerm, selectedCategory, sortBy]);

    // ========================
    // Product Actions
    // ========================
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
        } catch (err) { }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete product?')) return;
        try {
            await deleteProduct(id);
            setMessage('Product deleted');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) { }
    };

    // ========================
    // Auth Handlers
    // ========================
    const handleSignUp = async (signupData) => {
        // TODO: backend signup logic
        alert(`Welcome email sent to ${signupData.email}`);
        setUser({ name: signupData.name, email: signupData.email, confirmed: false });
        setShowSignUp(false);
    };

    const handleSignIn = async (signinData) => {
        // TODO: backend sign in
        setUser({ name: signinData.email.split('@')[0], email: signinData.email, confirmed: true });
        setShowSignIn(false);
    };

    const handleConfirmEmail = () => {
        setUser({ ...user, confirmed: true });
        alert('Email confirmed! You now have full access.');
    };

    // ========================
    // Enforce access only for signed up users
    // ========================
    useEffect(() => {
        if (!user) {
            setShowModal(false);
        }
    }, [user]);

    // ========================
    // Render
    // ========================
    return (
        <main className="product-hub">
            <div className="background-blur" aria-hidden></div>

            <div className="container">
                {/* ================= Header ================= */}
                <header className="header">
                    <h1>Product Hub</h1>
                    <p>Manage your inventory with style</p>
                </header>

                {/* ================= Auth Bar ================= */}
                <div className="auth-buttons-top">
                    {!user && (
                        <>
                            <button className="auth-button signup" onClick={() => setShowSignUp(true)}>Sign Up</button>
                            <button className="auth-button signin" onClick={() => setShowSignIn(true)}>Sign In</button>
                        </>
                    )}

                    {user && !user.confirmed && (
                        <button className="auth-button signup" onClick={handleConfirmEmail}>
                            Confirm Email
                        </button>
                    )}

                    {user && user.confirmed && (
                        <>
                            <span className="welcome-text">Welcome, {user.name}</span>
                            <button className="auth-button logout" onClick={() => setUser(null)}>Logout</button>
                        </>
                    )}
                </div>

                {/* ================= Alerts ================= */}
                {error && <div className="alert error" role="alert">{error}</div>}
                {message && <div className="alert success" role="status">{message}</div>}

                {/* ================= Stats ================= */}
                {user && user.confirmed && <ProductStats products={products} />}

                {/* ================= Filters ================= */}
                {user && user.confirmed && <SearchFilters
                    categories={categories}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    onAdd={onAdd}
                    disableAdd={loading.create || loading.update}
                />}

                {/* ================= Product List ================= */}
                {user && user.confirmed && <ProductList products={filtered} onEdit={onEdit} onDelete={handleDelete} loadingOps={loading} />}

                {/* ================= Product Modal ================= */}
                {user && user.confirmed && showModal && (
                    <div className="modal" role="dialog" aria-modal="true">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h2>{editing ? 'Edit Product' : 'Add Product'}</h2>
                                <button onClick={() => setShowModal(false)} aria-label="Close dialog">✕</button>
                            </div>

                            <ProductForm
                                initial={editing}
                                onCancel={() => setShowModal(false)}
                                onSubmit={handleSubmit}
                                categories={categories}
                                submitting={loading.create || loading.update}
                            />
                        </div>
                    </div>
                )}

                {/* ================= SignUp Modal ================= */}
                {showSignUp && (
                    <div className="modal" role="dialog" aria-modal="true">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h2>Sign Up</h2>
                                <button onClick={() => setShowSignUp(false)} aria-label="Close dialog">✕</button>
                            </div>
                            <SignUpForm
                                onCancel={() => setShowSignUp(false)}
                                onSubmit={handleSignUp}
                                switchToSignIn={() => { setShowSignUp(false); setShowSignIn(true); }}
                            />
                        </div>
                    </div>
                )}

                {/* ================= SignIn Modal ================= */}
                {showSignIn && (
                    <div className="modal" role="dialog" aria-modal="true">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h2>Sign In</h2>
                                <button onClick={() => setShowSignIn(false)} aria-label="Close dialog">✕</button>
                            </div>
                            <SignInForm
                                onCancel={() => setShowSignIn(false)}
                                onSubmit={handleSignIn}
                                switchToSignUp={() => { setShowSignIn(false); setShowSignUp(true); }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
