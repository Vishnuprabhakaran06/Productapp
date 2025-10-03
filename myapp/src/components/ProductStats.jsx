import React from 'react';
import { Package, DollarSign, TrendingUp, Archive } from 'lucide-react';


export default function ProductStats({ products }) {
    const stats = {
        total: products.length,
        value: products.reduce((sum, p) => sum + (p.price * (p.stock || 0)), 0),
        lowStock: products.filter(p => (p.stock || 0) < 50).length,
        categories: new Set(products.map(p => p.category)).size
    };


    return (
        <section className="stats-grid" aria-label="Product statistics">
            <div className="stat-card" role="status">
                <div>
                    <p>Total Products</p>
                    <p>{stats.total}</p>
                </div>
                <Package className="stat-icon" />
            </div>


            <div className="stat-card" role="status">
                <div>
                    <p>Inventory Value</p>
                    <p>${Math.round(stats.value)}</p>
                </div>
                <DollarSign className="stat-icon" />
            </div>


            <div className="stat-card" role="status">
                <div>
                    <p>Low Stock Items</p>
                    <p>{stats.lowStock}</p>
                </div>
                <TrendingUp className="stat-icon" />
            </div>


            <div className="stat-card" role="status">
                <div>
                    <p>Categories</p>
                    <p>{stats.categories}</p>
                </div>
                <Archive className="stat-icon" />
            </div>
        </section>
    );
}