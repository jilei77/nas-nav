"use client";

import { Search, Globe, Sun, Moon, Monitor, Settings } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useState, useEffect } from "react";

export default function Header() {
    const { theme, setTheme } = useTheme();
    const [networkMode, setNetworkMode] = useState<"internal" | "external">("external");
    const [searchValue, setSearchValue] = useState("");

    // Load network mode from local storage
    useEffect(() => {
        const savedMode = localStorage.getItem("networkMode") as "internal" | "external";
        if (savedMode) setNetworkMode(savedMode);
    }, []);

    const toggleNetworkMode = () => {
        const newMode = networkMode === "external" ? "internal" : "external";
        setNetworkMode(newMode);
        localStorage.setItem("networkMode", newMode);
        // Dispatch a custom event so other components can react
        window.dispatchEvent(new Event("networkModeChanged"));

        // Show success message (simple alert for now, can be improved)
        // In a real app, use a toast.
        const msg = document.createElement("div");
        msg.textContent = `Switched to ${newMode === "internal" ? "Intranet" : "Extranet"} Mode`;
        msg.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--glass-bg);
      backdrop-filter: blur(10px);
      padding: 10px 20px;
      border-radius: 20px;
      border: 1px solid var(--glass-border);
      z-index: 1000;
      animation: fadeInOut 2s forwards;
    `;
        document.body.appendChild(msg);
        setTimeout(() => msg.remove(), 2000);
    };

    const cycleTheme = () => {
        if (theme === "system") setTheme("light");
        else if (theme === "light") setTheme("dark");
        else setTheme("system");
    };

    return (
        <header className="glass" style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            padding: "1rem 2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem"
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1 }}>
                <div className="search-container" style={{ position: "relative", width: "100%", maxWidth: "400px" }}>
                    <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
                    <input
                        type="text"
                        placeholder="Search sites..."
                        value={searchValue}
                        onChange={(e) => {
                            setSearchValue(e.target.value);
                            window.dispatchEvent(new CustomEvent("searchChanged", { detail: e.target.value }));
                        }}
                        style={{
                            width: "100%",
                            padding: "10px 10px 10px 40px",
                            borderRadius: "12px",
                            border: "1px solid var(--border)",
                            background: "rgba(255,255,255,0.1)",
                            color: "var(--text-primary)",
                            fontSize: "14px",
                            outline: "none"
                        }}
                    />
                </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <button
                    onClick={toggleNetworkMode}
                    title={`Current: ${networkMode === "internal" ? "Intranet" : "Extranet"}`}
                    style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--text-primary)",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "8px",
                        borderRadius: "8px",
                        transition: "background 0.2s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "rgba(128,128,128,0.1)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "none"}
                >
                    <Globe size={20} />
                    <span style={{ fontSize: "14px", fontWeight: 500 }}>
                        {networkMode === "internal" ? "Intranet" : "Extranet"}
                    </span>
                </button>

                <button
                    onClick={cycleTheme}
                    title={`Theme: ${theme}`}
                    style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--text-primary)",
                        padding: "8px",
                        borderRadius: "8px",
                        transition: "background 0.2s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "rgba(128,128,128,0.1)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "none"}
                >
                    {theme === "light" && <Sun size={20} />}
                    {theme === "dark" && <Moon size={20} />}
                    {theme === "system" && <Monitor size={20} />}
                </button>

                <button
                    onClick={() => window.dispatchEvent(new Event("openAdmin"))}
                    title="Settings"
                    style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--text-primary)",
                        padding: "8px",
                        borderRadius: "8px",
                        transition: "background 0.2s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "rgba(128,128,128,0.1)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "none"}
                >
                    <Settings size={20} />
                </button>
            </div>
        </header>
    );
}
