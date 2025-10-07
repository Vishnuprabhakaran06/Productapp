import React from 'react';
import { Search } from 'lucide-react';

export default function SearchFilters({
    categories,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    onAdd,
    disableAdd,
    user // 👈 added user prop
}) {
    return (
        <div className="filters" role="region" aria-label="Filters">
            <div className="search-wrapper">
                <Search className="search-icon" />
                <label htmlFor="search" className="visually-hidden"></label>
                <input
                    id="search"
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>

            <label htmlFor="category" className="visually-hidden">Filter by category</label>
            <select
                id="category"
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
            >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>

            <label htmlFor="sort" className="visually-hidden">Sort products</label>
            <select
                id="sort"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
            >
                <option value="newest">Newest First</option>
                <option value="name">Name A-Z</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
            </select>

            {/* 👇 Hide Add Product for viewers */}
            {(user?.role === 'admin' || user?.role === 'manager') && (
                <button
                    onClick={onAdd}
                    disabled={disableAdd}
                    aria-disabled={disableAdd}
                    className="primary"
                >
                    Add Product
                </button>
            )}
        </div>
    );
}
