import { useEffect, useState, useCallback } from 'react';
import { request } from '../api';


const API_URL = process.env.REACT_APP_API_URL;


export default function useProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState({ list: false, create: false, update: false, remove: false });
    const [error, setError] = useState(null);


    const fetchAll = useCallback(async () => {
        setError(null);
        setLoading(l => ({ ...l, list: true }));
        try {
            const data = await request(API_URL, { timeout: 8000, retries: 2 });
            setProducts(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message);
            // keep products unchanged so UI can show cached/demo set
        } finally {
            setLoading(l => ({ ...l, list: false }));
        }
    }, []);


    useEffect(() => { fetchAll(); }, [fetchAll]);


    const createProduct = async (payload) => {
        setError(null);
        setLoading(l => ({ ...l, create: true }));
        try {
            const newP = await request(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                timeout: 10000,
                retries: 1
            });
            setProducts(prev => [...prev, newP]);
            return newP;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(l => ({ ...l, create: false }));
        }
    };


    const updateProduct = async (id, payload) => {
        setError(null);
        setLoading(l => ({ ...l, update: true }));
        try {
            const updated = await request(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                timeout: 10000,
            });
            setProducts(prev => prev.map(p => p._id === id ? updated : p));
            return updated;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(l => ({ ...l, update: false }));
        }
    };


    const deleteProduct = async (id) => {
        setError(null);
        setLoading(l => ({ ...l, remove: true }));
        try {
            await request(`${API_URL}/${id}`, { method: 'DELETE', timeout: 8000 });
            setProducts(prev => prev.filter(p => p._id !== id));
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(l => ({ ...l, remove: false }));
        }
    };


    return { products, setProducts, loading, error, fetchAll, createProduct, updateProduct, deleteProduct };
}