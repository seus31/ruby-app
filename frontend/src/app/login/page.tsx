"use client"

import { useState } from 'react'
import axios from 'axios'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const param = { email: email, password: password }
            const options = {
                method: 'POST',
                url: 'http://localhost:3222/api/auth/login',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: param,
            }

            axios(options)
                .then((response: { data: { token: string } }) => {
                    localStorage.setItem('token', response.data.token)
                })
                .catch((error: unknown) => console.error(error))
        } catch {
            alert('Invalid email or password')
        }
    }

    return (
        <div className="container mt-5">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
        </div>
    )
}
