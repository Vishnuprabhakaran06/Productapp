import React, { useState, useEffect } from 'react';
import './CustomerForm.css';

export default function CustomerForm({ initial, onSubmit, onCancel }) {
    const [form, setForm] = useState({ name: '', email: '' });

    useEffect(() => { if (initial) setForm(initial); }, [initial]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <form className="form-container" onSubmit={handleSubmit}>
            <h3>{initial ? 'Edit Customer' : 'Add Customer'}</h3>
            <label>Name</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />

            <label>Email</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />

            <div className="form-buttons">
                <button type="submit">Save</button>
                <button type="button" onClick={onCancel} className="cancel-btn">Cancel</button>
            </div>
        </form>
    );
}
