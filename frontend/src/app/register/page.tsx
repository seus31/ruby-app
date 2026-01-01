"use client"

import { useState } from 'react'
import axios from 'axios'

export default function Page() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const param = { name: name, email: email, password: password }
            const options = {
                method: 'POST',
                url: 'http://localhost:3222/api/auth/register',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: param,
            }

            axios(options)
                .then(() => {
                    alert('Registration successful! Please login.')
                })
                .catch((error: unknown) => console.error(error))
        } catch {
            alert('Registration failed')
        }
    }

    return (
        <div className="container mt-5">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary">Register</button>
            </form>
        </div>
    )
}
