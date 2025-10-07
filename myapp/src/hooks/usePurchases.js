import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api/purchases';

export default function usePurchases() {
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState({ create: false, update: false, delete: false });
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get(API)
            .then(res => setPurchases(res.data))
            .catch(() => setError('Failed to fetch purchases'));
    }, []);

    const createPurchase = async (payload) => {
        setLoading(prev => ({ ...prev, create: true }));
        try {
            const res = await axios.post(API, payload);
            setPurchases(prev => [...prev, res.data]);
        } catch {
            setError('Failed to create purchase');
        }
        setLoading(prev => ({ ...prev, create: false }));
    };

    const updatePurchase = async (id, payload) => {
        setLoading(prev => ({ ...prev, update: true }));
        try {
            const res = await axios.put(`${API}/${id}`, payload);
            setPurchases(prev => prev.map(p => p._id === id ? res.data : p));
        } catch {
            setError('Failed to update purchase');
        }
        setLoading(prev => ({ ...prev, update: false }));
    };

    const deletePurchase = async (id) => {
        setLoading(prev => ({ ...prev, delete: true }));
        try {
            await axios.delete(`${API}/${id}`);
            setPurchases(prev => prev.filter(p => p._id !== id));
        } catch {
            setError('Failed to delete purchase');
        }
        setLoading(prev => ({ ...prev, delete: false }));
    };

    return { purchases, loading, error, createPurchase, updatePurchase, deletePurchase };
}
