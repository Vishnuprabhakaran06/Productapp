import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function useCustomers() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState({ create: false, update: false, delete: false });
    const [error, setError] = useState('');

    useEffect(() => {
        // Initialize with sample customers
        setCustomers([
            { _id: uuidv4(), name: 'Ram', email: 'Ram@gmail.com' },
            { _id: uuidv4(), name: 'Vikram', email: 'vikram@gmail.com' },
        ]);
    }, []);

    const createCustomer = async (payload) => {
        setLoading(prev => ({ ...prev, create: true }));
        try {
            setCustomers(prev => [...prev, { _id: uuidv4(), ...payload }]);
        } catch (err) {
            setError('Failed to create customer');
        }
        setLoading(prev => ({ ...prev, create: false }));
    };

    const updateCustomer = async (id, payload) => {
        setLoading(prev => ({ ...prev, update: true }));
        try {
            setCustomers(prev => prev.map(c => (c._id === id ? { ...c, ...payload } : c)));
        } catch (err) {
            setError('Failed to update customer');
        }
        setLoading(prev => ({ ...prev, update: false }));
    };

    const deleteCustomer = async (id) => {
        setLoading(prev => ({ ...prev, delete: true }));
        try {
            setCustomers(prev => prev.filter(c => c._id !== id));
        } catch (err) {
            setError('Failed to delete customer');
        }
        setLoading(prev => ({ ...prev, delete: false }));
    };

    return { customers, loading, error, createCustomer, updateCustomer, deleteCustomer };
}
