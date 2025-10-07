import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api/customers';

export default function useCustomers() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState({ create: false, update: false, delete: false });
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get(API)
            .then(res => setCustomers(res.data))
            .catch(() => setError('Failed to fetch customers'));
    }, []);

    const createCustomer = async (payload) => {
        setLoading(prev => ({ ...prev, create: true }));
        try {
            const res = await axios.post(API, payload);
            setCustomers(prev => [...prev, res.data]);
        } catch {
            setError('Failed to create customer');
        }
        setLoading(prev => ({ ...prev, create: false }));
    };

    const updateCustomer = async (id, payload) => {
        setLoading(prev => ({ ...prev, update: true }));
        try {
            const res = await axios.put(`${API}/${id}`, payload);
            setCustomers(prev => prev.map(c => c._id === id ? res.data : c));
        } catch {
            setError('Failed to update customer');
        }
        setLoading(prev => ({ ...prev, update: false }));
    };

    const deleteCustomer = async (id) => {
        setLoading(prev => ({ ...prev, delete: true }));
        try {
            await axios.delete(`${API}/${id}`);
            setCustomers(prev => prev.filter(c => c._id !== id));
        } catch {
            setError('Failed to delete customer');
        }
        setLoading(prev => ({ ...prev, delete: false }));
    };

    return { customers, loading, error, createCustomer, updateCustomer, deleteCustomer };
}
