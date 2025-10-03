export async function request(url, options = {}) {

    const REACT_APP_API_URL = 'http://localhost:5000/api/products';
    
    const { timeout = 8000, retries = 1, retryDelay = 700 } = options;


    for (let attempt = 0; attempt <= retries; attempt++) {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);


        try {
            const res = await fetch(url, { ...options, signal: controller.signal });
            clearTimeout(id);
            if (!res.ok) {
                const text = await res.text();
                const message = text || res.statusText || 'Request failed';
                throw new Error(message);
            }
            const contentType = res.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) return res.json();
            return res.text();
        } catch (err) {
            clearTimeout(id);
            if (err.name === 'AbortError') err.message = 'Request timed out';
            if (attempt < retries) await new Promise(r => setTimeout(r, retryDelay));
            else throw err;
        }
    }
}