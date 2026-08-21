"use client";

import { useState, useEffect } from "react";
import { Lock } from "lucide-react";
import sitesData from "@/data/sites.json";

export default function LoginModal() {
    const [isAuthenticated, setIsAuthenticated] = useState(true); // Default to true to avoid flash
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);

    useEffect(() => {
        // Check cookie
        const authCookie = document.cookie.split('; ').find(row => row.startsWith('auth_token='));
        if (!authCookie) {
            setIsAuthenticated(false);
        }
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, verify against API. Here we verify against JSON for simplicity as requested.
        // NOTE: This exposes the password in the client bundle which is not secure, 
        // but acceptable for a personal NAS home page as per "simple" requirements.
        // A better approach would be an API route to verify.

        if (password === sitesData.settings.password) {
            // Set cookie for 30 days
            const date = new Date();
            date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
            document.cookie = `auth_token=true; expires=${date.toUTCString()}; path=/`;
            setIsAuthenticated(true);
        } else {
            setError(true);
        }
    };

    if (isAuthenticated) return null;

    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 9999,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        }}>
            <div className="glass" style={{
                padding: "3rem",
                borderRadius: "24px",
                width: "100%",
                maxWidth: "400px",
                textAlign: "center",
                boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
            }}>
                <div style={{
                    width: "64px",
                    height: "64px",
                    background: "var(--accent)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1.5rem",
                    color: "white"
                }}>
                    <Lock size={32} />
                </div>

                <h2 style={{ marginBottom: "0.5rem", color: "var(--text-primary)" }}>Welcome Back</h2>
                <p style={{ marginBottom: "2rem", color: "var(--text-secondary)" }}>Please enter password to continue</p>

                <form onSubmit={handleLogin}>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setError(false);
                        }}
                        style={{
                            width: "100%",
                            padding: "16px",
                            borderRadius: "12px",
                            border: error ? "1px solid #ff3b30" : "1px solid var(--border)",
                            background: "var(--bg-secondary)",
                            color: "var(--text-primary)",
                            fontSize: "16px",
                            marginBottom: "1rem",
                            outline: "none"
                        }}
                        autoFocus
                    />
                    {error && <p style={{ color: "#ff3b30", fontSize: "14px", marginBottom: "1rem" }}>Incorrect password</p>}

                    <button
                        type="submit"
                        style={{
                            width: "100%",
                            padding: "16px",
                            borderRadius: "12px",
                            border: "none",
                            background: "var(--accent)",
                            color: "white",
                            fontSize: "16px",
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "opacity 0.2s"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = "0.9"}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
                    >
                        Access NAS
                    </button>
                </form>
            </div>
        </div>
    );
}
