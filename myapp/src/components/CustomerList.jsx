import React from 'react';
import './CustomerList.css'

export default function CustomerList({ customers, onEdit, onDelete, user }) {
    if (!customers.length) return <p>No customers found</p>;

    const canModify = user?.role !== 'viewer'; // viewer cannot edit/delete

    const handleEdit = (c) => {
        if (!onEdit || !canModify) return alert("You can't access it");
        onEdit(c);
    };

    const handleDelete = (c) => {
        if (!onDelete || !canModify) return alert("You can't access it");
        onDelete(c._id);
    };

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
                            {canModify && onEdit && <button onClick={() => handleEdit(c)}>Edit</button>}
                            {canModify && onDelete && <button onClick={() => handleDelete(c)}>Delete</button>}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
