import React, { useState } from "react";
import './SignInForm.css';

export default function SignInForm({ onSubmit, onCancel, switchToSignUp }) {
    const [data, setData] = useState({ email: "", password: "", role: "viewer" });
    const [errors, setErrors] = useState({});

    // Fixed credentials
    const FIXED_USERS = {
        admin: { name: "Admin", email: "admin@example.com", password: "admin123" },
        manager: { name: "Manager", email: "manager@example.com", password: "manager123" }
    };

    const roles = ["viewer", "manager", "admin"];

    const validate = () => {
        const e = {};
        if (!data.email.trim()) e.email = "Email is required";
        if (!data.password.trim()) e.password = "Password is required";
        if (!data.role) e.role = "Role is required";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        // Check fixed credentials
        if (data.role === "admin") {
            if (data.email === FIXED_USERS.admin.email && data.password === FIXED_USERS.admin.password) {
                onSubmit({ name: FIXED_USERS.admin.name, email: data.email, role: "admin", confirmed: true });
                return;
            } else {
                alert("Invalid admin credentials");
                return;
            }
        }

        if (data.role === "manager") {
            if (data.email === FIXED_USERS.manager.email && data.password === FIXED_USERS.manager.password) {
                onSubmit({ name: FIXED_USERS.manager.name, email: data.email, role: "manager", confirmed: true });
                return;
            } else {
                alert("Invalid manager credentials");
                return;
            }
        }

        // Viewer login
        onSubmit({ email: data.email, password: data.password, role: "viewer", confirmed: true });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <label>Email
                <input 
                    type="email" 
                    name="email" 
                    value={data.email} 
                    onChange={handleChange} 
                />
                {errors.email && <div className="field-error">{errors.email}</div>}
            </label>

            <label>Password
                <input 
                    type="password" 
                    name="password" 
                    value={data.password} 
                    onChange={handleChange} 
                />
                {errors.password && <div className="field-error">{errors.password}</div>}
            </label>

            <label>Role:
                <select name="role" value={data.role} onChange={handleChange}>
                    {roles.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                {errors.role && <div className="field-error">{errors.role}</div>}
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
