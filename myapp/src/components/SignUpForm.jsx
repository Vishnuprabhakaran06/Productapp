import React, { useState } from "react";
import './SignUpForm.css';

export default function SignUpForm({ onSubmit, onCancel, switchToSignIn }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "viewer", // fixed for signup
    });
    const [errors, setErrors] = useState({});

    // Validation
    const validate = () => {
        const e = {};
        if (!formData.name.trim()) e.name = "Name is required";
        if (!formData.email.trim()) e.email = "Email is required";
        if (!formData.password.trim()) e.password = "Password is required";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        // Force role to viewer for normal signup
        onSubmit({ ...formData, role: "viewer" });
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <h2>Sign Up</h2>

            <label>
                Name:
                <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                />
                {errors.name && <div className="field-error">{errors.name}</div>}
            </label>

            <label>
                Email:
                <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                />
                {errors.email && <div className="field-error">{errors.email}</div>}
            </label>

            <label>
                Password:
                <input 
                    type="password" 
                    name="password" 
                    value={formData.password} 
                    onChange={handleChange} 
                />
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
