import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X, Package, TrendingUp, DollarSign, Archive, AlertCircle } from 'lucide-react';
import './Productdashboard.css';

const API_URL = 'http://localhost:5000/api/products';

const categories = ['All', 'Electronics', 'Clothing', 'Food', 'Books', 'Home', 'Sports', 'Other'];

export default function ProductCRUD() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Electronics',
    stock: '',
    imageUrl: '',
    brand: '',
    rating: 5,
    tags: [],
    sku: '',
    isActive: true
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [searchTerm, selectedCategory, sortBy, products]);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (err) {
      setError('Could not connect to the server. Using demo data.');
      const demoProducts = [
        {
          _id: '1',
          name: 'Wireless Headphones Pro',
          description: 'Premium noise-canceling wireless headphones with 30-hour battery life',
          price: 299.99,
          category: 'Electronics',
          stock: 45,
          imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
          brand: 'AudioTech',
          rating: 4.8,
          tags: ['wireless', 'audio', 'premium'],
          sku: 'WHP-001',
          isActive: true
        },
        {
          _id: '2',
          name: 'Smart Fitness Watch',
          description: 'Track your health and fitness with this advanced smartwatch',
          price: 199.99,
          category: 'Electronics',
          stock: 120,
          imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
          brand: 'FitLife',
          rating: 4.5,
          tags: ['fitness', 'wearable', 'smart'],
          sku: 'SFW-002',
          isActive: true
        },
        {
          _id: '3',
          name: 'Organic Coffee Beans',
          description: 'Premium arabica coffee beans, ethically sourced and freshly roasted',
          price: 24.99,
          category: 'Food',
          stock: 200,
          imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400',
          brand: 'BrewMaster',
          rating: 4.9,
          tags: ['organic', 'coffee', 'premium'],
          sku: 'OCB-003',
          isActive: true
        }
      ];
      setProducts(demoProducts);
      setFilteredProducts(demoProducts);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.brand && p.brand.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const productData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      stock: parseInt(formData.stock),
      imageUrl: formData.imageUrl || 'https://via.placeholder.com/300',
      brand: formData.brand,
      rating: parseFloat(formData.rating),
      tags: Array.isArray(formData.tags) ? formData.tags.filter(t => t.trim() !== '') : [],
      sku: formData.sku,
      isActive: formData.isActive
    };

    try {
      if (editingProduct) {
        const response = await fetch(`${API_URL}/${editingProduct._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData),
        });

        if (!response.ok) {
          throw new Error('Failed to update product');
        }

        const updatedProduct = await response.json();
        setProducts(products.map(p =>
          p._id === editingProduct._id ? updatedProduct : p
        ));
        showSuccess('Product updated successfully!');
      } else {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData),
        });

        if (!response.ok) {
          throw new Error('Failed to create product');
        }

        const newProduct = await response.json();
        setProducts([...products, newProduct]);
        showSuccess('Product created successfully!');
      }

      resetForm();
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      setProducts(products.filter(p => p._id !== id));
      showSuccess('Product deleted successfully!');
    } catch (err) {
      setError(err.message || 'Failed to delete product');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      imageUrl: product.imageUrl,
      brand: product.brand || '',
      rating: product.rating,
      tags: product.tags || [],
      sku: product.sku || '',
      isActive: product.isActive
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Electronics',
      stock: '',
      imageUrl: '',
      brand: '',
      rating: 5,
      tags: [],
      sku: '',
      isActive: true
    });
    setEditingProduct(null);
    setShowModal(false);
  };

  const stats = {
    total: products.length,
    value: products.reduce((sum, p) => sum + (p.price * p.stock), 0),
    lowStock: products.filter(p => p.stock < 50).length,
    categories: new Set(products.map(p => p.category)).size
  };

  return (
    <div className="product-hub">
      <div className="background-blur"></div>

      <div className="container">
        <div className="header">
          <h1>Product Hub</h1>
          <p>Manage your inventory with style</p>
        </div>

        {error && (
          <div className="alert error">
            <AlertCircle className="icon" />
            <p>{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="alert success">
            <div className="icon">✓</div>
            <p>{successMessage}</p>
          </div>
        )}

        <div className="stats-grid">
          <div className="stat-card">
            <div>
              <p>Total Products</p>
              <p>{stats.total}</p>
            </div>
            <Package className="stat-icon" />
          </div>

          <div className="stat-card">
            <div>
              <p>Inventory Value</p>
              <p>${stats.value.toFixed(0)}</p>
            </div>
            <DollarSign className="stat-icon" />
          </div>

          <div className="stat-card">
            <div>
              <p>Low Stock Items</p>
              <p>{stats.lowStock}</p>
            </div>
            <TrendingUp className="stat-icon" />
          </div>

          <div className="stat-card">
            <div>
              <p>Categories</p>
              <p>{stats.categories}</p>
            </div>
            <Archive className="stat-icon" />
          </div>
        </div>

        <div className="filters">
          <div className="search-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>


          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="name">Name A-Z</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>

          <button onClick={() => setShowModal(true)} disabled={loading}>
            <Plus /> Add Product
          </button>
        </div>

        {/* Product List */}
        <div className="product-list">
          {filteredProducts.length > 0 ? filteredProducts.map(product => (
            <div key={product._id} className="product-card">
              <div className="product-image">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  onError={(e) => e.target.src = 'https://via.placeholder.com/300?text=No+Image'}
                />
                <div className="category">{product.category}</div>
                {product.stock < 50 && <div className="low-stock">Low Stock</div>}
              </div>

              <div className="product-details">
                <div className="title-rating">
                  <h3>{product.name}</h3>
                  <div className="rating">{product.rating} ★</div>
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
                  <button onClick={() => handleEdit(product)} disabled={loading}><Edit2 /> Edit</button>
                  <button onClick={() => handleDelete(product._id)} disabled={loading}><Trash2 /> Delete</button>
                </div>
              </div>
            </div>
          )) : (
            <div className="no-products">
              <Package />
              <h3>No products found</h3>
              <p>Try adjusting your filters or add a new product</p>
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <div className="modal-header">
                <h2>{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
                <button onClick={resetForm}><X /></button>
              </div>

              <form onSubmit={handleSubmit} className="modal-form">
                <label>
                  Name:
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </label>

                <label>
                  Description:
                  <textarea
                    required
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                  />
                </label>

                <label>
                  Price:
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                  />
                </label>

                <label>
                  Category:
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                  >
                    {categories.filter(c => c !== 'All').map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </label>

                <label>
                  Stock:
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.stock}
                    onChange={e => setFormData({ ...formData, stock: e.target.value })}
                  />
                </label>

                <label>
                  Image URL:
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                  />
                </label>

                <label>
                  Brand:
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={e => setFormData({ ...formData, brand: e.target.value })}
                  />
                </label>

                <label>
                  Rating:
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={e => setFormData({ ...formData, rating: e.target.value })}
                  />
                </label>

                <label>
                  SKU:
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={e => setFormData({ ...formData, sku: e.target.value })}
                  />
                </label>

                <label>
                  Tags (comma separated):
                  <input
                    type="text"
                    value={formData.tags.join(', ')}
                    onChange={e => setFormData({ ...formData, tags: e.target.value.split(',').map(t => t.trim()) })}
                  />
                </label>

                <label className="checkbox-label">
                  Active:
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                </label>

                <div className="modal-actions">
                  <button type="submit" disabled={loading}>
                    {editingProduct ? 'Update' : 'Add'} Product
                  </button>
                  <button type="button" onClick={resetForm}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}