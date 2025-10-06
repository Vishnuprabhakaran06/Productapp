import React from 'react';
import './PurchaseList.css'
export default function PurchaseList({ purchases, customers, products, onEdit, onDelete }) {
    if (!purchases.length) return <p>No purchases found</p>;
    return (
        <table className="list-table">
            <thead>
                <tr><th>Customer</th><th>Product</th><th>Quantity</th><th>Date</th><th>Actions</th></tr>
            </thead>
            <tbody>
                {purchases.map(p => {
                    const customer = customers.find(c => c._id === p.customerId);
                    const product = products.find(pr => pr._id === p.productId);
                    return (
                        <tr key={p._id}>
                            <td data-label="Customer">{customer?.name || 'Unknown'}</td>
                            <td data-label="Product">{product?.name || 'Unknown'}</td>
                            <td data-label="Quantity">{p.quantity}</td>
                            <td data-label="Date">{new Date(p.date).toLocaleDateString()}</td>
                            <td data-label="Actions">
                                <button onClick={() => onEdit(p)}>Edit</button>
                                <button onClick={() => onDelete(p._id)}>Delete</button>
                            </td>

                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}
