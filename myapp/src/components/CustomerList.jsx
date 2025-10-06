import React from 'react';
import './CustomerList.css'
export default function CustomerList({ customers, onEdit, onDelete }) {
    if (!customers.length) return <p>No customers found</p>;
    return (
        <table className="list-table">
            <thead>
                <tr><th>Name</th><th>Email</th><th>Actions</th></tr>
            </thead>
            <tbody>
                {customers.map(c => (
                    <tr key={c._id}>
                        <td data-label="Name">{c.name}</td>
                        <td data-label="Email">{c.email}</td>
                        <td data-label="Actions">
                            <button onClick={() => onEdit(c)}>Edit</button>
                            <button onClick={() => onDelete(c._id)}>Delete</button>
                        </td>

                    </tr>
                ))}
            </tbody>
        </table>
    );
}
