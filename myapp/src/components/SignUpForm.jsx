import React, { useState } from "react";
import './SignUpForm.css';

export default function SignUpForm({ onSubmit, onCancel, switchToSignIn }) {
    const [data, setData] = useState({ name: "", email: "", password: "" });
    const [errors, setErrors] = useState({});

    const validate = () => {
        const e = {};
        if (!data.name.trim()) e.name = "Name is required";
        if (!data.email.trim()) e.email = "Email is required";
        if (!data.password.trim()) e.password = "Password is required";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;
        onSubmit(data);
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <label>Name
                <input value={data.name} onChange={e => setData({ ...data, name: e.target.value })}/>
                {errors.name && <div className="field-error">{errors.name}</div>}
            </label>
            <label>Email
                <input type="email" value={data.email} onChange={e => setData({ ...data, email: e.target.value })}/>
                {errors.email && <div className="field-error">{errors.email}</div>}
            </label>
            <label>Password
                <input type="password" value={data.password} onChange={e => setData({ ...data, password: e.target.value })}/>
                {errors.password && <div className="field-error">{errors.password}</div>}
            </label>

            <div className="auth-actions">
                <button type="submit" className="auth-button signup">Sign Up</button>
                <button type="button" className="auth-button cancel" onClick={onCancel}>Cancel</button>
            </div>

            <p className="auth-switch">
                Already have an account? <span onClick={switchToSignIn}>Sign In</span>
            </p>
        </form>
    );
}
