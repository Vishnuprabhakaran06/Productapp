import React from 'react';
import './PurchaseList.css'

export default function PurchaseList({ purchases, customers, products, onEdit, onDelete, user }) {
    if (!purchases.length) return <p>No purchases found</p>;

    const canModify = user?.role !== 'viewer'; // viewer cannot edit/delete

    const handleEdit = (p) => {
        if (!onEdit || !canModify) return alert("You can't access it");
        onEdit(p);
    };

    const handleDelete = (p) => {
        if (!onDelete || !canModify) return alert("You can't access it");
        onDelete(p._id);
    };

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
                                {canModify && onEdit && <button onClick={() => handleEdit(p)}>Edit</button>}
                                {canModify && onDelete && <button onClick={() => handleDelete(p)}>Delete</button>}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}
