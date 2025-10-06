import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function usePurchases() {
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState({ create: false, update: false, delete: false });
    const [error, setError] = useState('');

    useEffect(() => {
        // Initialize with empty purchases
        setPurchases([]);
    }, []);

    const createPurchase = async (payload) => {
        setLoading(prev => ({ ...prev, create: true }));
        try {
            setPurchases(prev => [...prev, { _id: uuidv4(), date: new Date().toISOString(), ...payload }]);
        } catch (err) {
            setError('Failed to create purchase');
        }
        setLoading(prev => ({ ...prev, create: false }));
    };

    const updatePurchase = async (id, payload) => {
        setLoading(prev => ({ ...prev, update: true }));
        try {
            setPurchases(prev => prev.map(p => (p._id === id ? { ...p, ...payload } : p)));
        } catch (err) {
            setError('Failed to update purchase');
        }
        setLoading(prev => ({ ...prev, update: false }));
    };

    const deletePurchase = async (id) => {
        setLoading(prev => ({ ...prev, delete: true }));
        try {
            setPurchases(prev => prev.filter(p => p._id !== id));
        } catch (err) {
            setError('Failed to delete purchase');
        }
        setLoading(prev => ({ ...prev, delete: false }));
    };

    return { purchases, loading, error, createPurchase, updatePurchase, deletePurchase };
}
