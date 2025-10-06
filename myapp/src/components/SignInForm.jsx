import React, { useState } from "react";
import './SignInForm.css';

export default function SignInForm({ onSubmit, onCancel, switchToSignUp }) {
    const [data, setData] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});

    const validate = () => {
        const e = {};
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
            <label>Email
                <input type="email" value={data.email} onChange={e => setData({ ...data, email: e.target.value })}/>
                {errors.email && <div className="field-error">{errors.email}</div>}
            </label>
            <label>Password
                <input type="password" value={data.password} onChange={e => setData({ ...data, password: e.target.value })}/>
                {errors.password && <div className="field-error">{errors.password}</div>}
            </label>

            <div className="auth-actions">
                <button type="submit" className="auth-button signin">Sign In</button>
                <button type="button" className="auth-button cancel" onClick={onCancel}>Cancel</button>
            </div>

            <p className="auth-switch">
                Don't have an account? <span onClick={switchToSignUp}>Sign Up</span>
            </p>
        </form>
    );
}
