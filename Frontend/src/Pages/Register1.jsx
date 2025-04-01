import React, { useState } from 'react';
import PasswordValidator from 'password-validator';
import { useNavigate } from 'react-router-dom';


// Password validation schema
const passwordSchema = new PasswordValidator();
passwordSchema
    .is().min(8)          // Minimum length 8
    .is().max(100)        // Maximum length 100
    .has().uppercase()    // Must have at least one uppercase letter
    .has().lowercase()    // Must have at least one lowercase letter
    .has().digits(1)      // Must have at least one digit
    .has().symbols()      // Must have at least one special character
    .has().not().spaces(); // Should not have spaces

// Map validation errors
const passwordErrorMessages = {
    min: "at least 8 characters",
    max: "no more than 100 characters",
    uppercase: "at least one uppercase letter",
    lowercase: "at least one lowercase letter",
    digits: "at least one digit",
    symbols: "at least one special character",
    spaces: "no spaces",
};

function validatePassword(password) {
    const validationErrors = passwordSchema.validate(password, { list: true });
    if (validationErrors.length > 0) {
        return `Password must have ${validationErrors.map(err => passwordErrorMessages[err]).join(", ")}.`;
    }
    return null;
}

function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors

        // Validate form fields
        if (!(form.firstName && form.lastName && form.email && form.password && form.confirmPassword)) {
            setError("All fields are required.");
            return;
        }

        const passwordError = validatePassword(form.password);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        if(form.password !== form.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        console.log("API URL:", `https://event-management-full-stack-2.onrender.com/users/register`);

        try {
            const response = await fetch(`https://event-management-full-stack-2.onrender.com/users/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(form),
            });

            if (response.ok) {
                const data = await response.json();
                navigate(`/register/${data.user._id}/${data.user.email}`);
                alert("Account created successfully");
                setForm({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" }); // Reset form
            } else {
                const data = await response.json();
                setError(data.message || "Something went wrong.");
            }
        } catch (err) {
            console.error(err);
            setError("Server error. Please try again later.");
        }
    };

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <label>First Name</label>
                <input
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    placeholder="First Name"
                    onChange={handleChange}
                />
                <label>Last Name</label>
                <input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    placeholder="Last Name"
                    onChange={handleChange}
                />
                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    value={form.email}
                    placeholder="Email"
                    onChange={handleChange}
                />
                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    value={form.password}
                    placeholder="Password"
                    onChange={handleChange}
                />
                <label>Confirm Password</label>
                <input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    placeholder="Confirm Password"
                    onChange={handleChange}
                />
                {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
                <button type="submit">Create an Account</button>
            </form>
        </div>
    );
}

export default Register;