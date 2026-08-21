"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash, Save, Download, Upload, Wand2 } from "lucide-react";
import sitesData from "@/data/sites.json";

interface AdminDashboardProps {
    onClose: () => void;
}

export default function AdminDashboard({ onClose }: AdminDashboardProps) {
    const [data, setData] = useState(sitesData);
    const [activeTab, setActiveTab] = useState<"sites" | "settings">("sites");
    const [loading, setLoading] = useState(false);

    // Fetch latest data on mount
    useEffect(() => {
        fetch("/api/data")
            .then(res => res.json())
            .then(setData);
    }, []);

    const handleSave = async () => {
        setLoading(true);
        try {
            await fetch("/api/data", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            alert("Saved successfully!");
            window.location.reload(); // Reload to reflect changes
        } catch (e) {
            alert("Failed to save");
        } finally {
            setLoading(false);
        }
    };

    const handleBackup = () => {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `nas-nav-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
    };

    const handleRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target?.result as string);
                setData(json);
                alert("Backup loaded! Click Save to apply.");
            } catch (err) {
                alert("Invalid JSON file");
            }
        };
        reader.readAsText(file);
    };

    const generateDescription = async (url: string, catIndex: number, siteIndex: number) => {
        if (!url) return alert("Please enter a URL first");

        // Optimistic UI update or loading state could be added here
        try {
            const res = await fetch("/api/ai", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url })
            });
            const json = await res.json();
            if (json.description) {
                const newData = { ...data };
                newData.categories[catIndex].sites[siteIndex].description = json.description;
                setData(newData);
            } else {
                alert(json.error || "Failed to generate");
            }
        } catch (e) {
            alert("Error generating description");
        }
    };

    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 200,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(5px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        }}>
            <div className="glass" style={{
                width: "90%",
                maxWidth: "800px",
                height: "80vh",
                borderRadius: "20px",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                background: "var(--bg-secondary)"
            }}>
                <div style={{
                    padding: "1.5rem",
                    borderBottom: "1px solid var(--border)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}>
                    <h2 style={{ fontSize: "1.25rem", fontWeight: 600 }}>Admin Dashboard</h2>
                    <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-primary)" }}>
                        <X size={24} />
                    </button>
                </div>

                <div style={{ display: "flex", borderBottom: "1px solid var(--border)" }}>
                    <button
                        onClick={() => setActiveTab("sites")}
                        style={{
                            flex: 1,
                            padding: "1rem",
                            background: activeTab === "sites" ? "var(--accent)" : "transparent",
                            color: activeTab === "sites" ? "white" : "var(--text-primary)",
                            border: "none",
                            cursor: "pointer",
                            fontWeight: 500
                        }}
                    >
                        Sites & Categories
                    </button>
                    <button
                        onClick={() => setActiveTab("settings")}
                        style={{
                            flex: 1,
                            padding: "1rem",
                            background: activeTab === "settings" ? "var(--accent)" : "transparent",
                            color: activeTab === "settings" ? "white" : "var(--text-primary)",
                            border: "none",
                            cursor: "pointer",
                            fontWeight: 500
                        }}
                    >
                        Settings & Backup
                    </button>
                </div>

                <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
                    {activeTab === "sites" ? (
                        <div>
                            {data.categories.map((cat, catIndex) => (
                                <div key={catIndex} style={{ marginBottom: "2rem", padding: "1rem", border: "1px solid var(--border)", borderRadius: "12px" }}>
                                    <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                                        <input
                                            value={cat.name}
                                            onChange={(e) => {
                                                const newData = { ...data };
                                                newData.categories[catIndex].name = e.target.value;
                                                setData(newData);
                                            }}
                                            style={{ flex: 1, padding: "8px", borderRadius: "8px", border: "1px solid var(--border)" }}
                                            placeholder="Category Name"
                                        />
                                        <button
                                            onClick={() => {
                                                const newData = { ...data };
                                                newData.categories.splice(catIndex, 1);
                                                setData(newData);
                                            }}
                                            style={{ color: "#ff3b30", background: "none", border: "none", cursor: "pointer" }}
                                        >
                                            <Trash size={20} />
                                        </button>
                                    </div>

                                    {cat.sites.map((site, siteIndex) => (
                                        <div key={siteIndex} style={{
                                            display: "grid",
                                            gridTemplateColumns: "1fr 1fr 1fr",
                                            gap: "0.5rem",
                                            marginBottom: "1rem",
                                            padding: "1rem",
                                            background: "rgba(128,128,128,0.05)",
                                            borderRadius: "8px"
                                        }}>
                                            <input
                                                value={site.name}
                                                onChange={(e) => {
                                                    const newData = { ...data };
                                                    newData.categories[catIndex].sites[siteIndex].name = e.target.value;
                                                    setData(newData);
                                                }}
                                                placeholder="Site Name"
                                                style={{ padding: "8px", borderRadius: "6px", border: "1px solid var(--border)" }}
                                            />
                                            <input
                                                value={site.urlInternal}
                                                onChange={(e) => {
                                                    const newData = { ...data };
                                                    newData.categories[catIndex].sites[siteIndex].urlInternal = e.target.value;
                                                    setData(newData);
                                                }}
                                                placeholder="Internal URL"
                                                style={{ padding: "8px", borderRadius: "6px", border: "1px solid var(--border)" }}
                                            />
                                            <input
                                                value={site.urlExternal}
                                                onChange={(e) => {
                                                    const newData = { ...data };
                                                    newData.categories[catIndex].sites[siteIndex].urlExternal = e.target.value;
                                                    setData(newData);
                                                }}
                                                placeholder="External URL"
                                                style={{ padding: "8px", borderRadius: "6px", border: "1px solid var(--border)" }}
                                            />
                                            <div style={{ gridColumn: "1 / -1", display: "flex", gap: "0.5rem" }}>
                                                <input
                                                    value={site.description}
                                                    onChange={(e) => {
                                                        const newData = { ...data };
                                                        newData.categories[catIndex].sites[siteIndex].description = e.target.value;
                                                        setData(newData);
                                                    }}
                                                    placeholder="Description"
                                                    style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid var(--border)" }}
                                                />
                                                <button
                                                    onClick={() => generateDescription(site.urlExternal || site.urlInternal, catIndex, siteIndex)}
                                                    title="Generate Description with AI"
                                                    style={{
                                                        padding: "8px",
                                                        borderRadius: "6px",
                                                        border: "1px solid var(--accent)",
                                                        background: "none",
                                                        color: "var(--accent)",
                                                        cursor: "pointer"
                                                    }}
                                                >
                                                    <Wand2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        const newData = { ...data };
                                                        newData.categories[catIndex].sites.splice(siteIndex, 1);
                                                        setData(newData);
                                                    }}
                                                    style={{ color: "#ff3b30", background: "none", border: "none", cursor: "pointer", padding: "8px" }}
                                                >
                                                    <Trash size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    <button
                                        onClick={() => {
                                            const newData = { ...data };
                                            newData.categories[catIndex].sites.push({
                                                id: Date.now().toString(),
                                                name: "New Site",
                                                urlInternal: "",
                                                urlExternal: "",
                                                description: "",
                                                icon: ""
                                            });
                                            setData(newData);
                                        }}
                                        style={{
                                            width: "100%",
                                            padding: "8px",
                                            border: "1px dashed var(--border)",
                                            borderRadius: "8px",
                                            background: "none",
                                            color: "var(--text-secondary)",
                                            cursor: "pointer"
                                        }}
                                    >
                                        + Add Site
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={() => {
                                    const newData = { ...data };
                                    newData.categories.push({
                                        id: Date.now().toString(),
                                        name: "New Category",
                                        sites: []
                                    });
                                    setData(newData);
                                }}
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    background: "var(--accent)",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "12px",
                                    cursor: "pointer",
                                    fontWeight: 600
                                }}
                            >
                                Add Category
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                            <div className="glass" style={{ padding: "1.5rem", borderRadius: "12px" }}>
                                <h3 style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>General Settings</h3>
                                <div style={{ marginBottom: "1rem" }}>
                                    <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem" }}>Admin Password</label>
                                    <input
                                        type="text"
                                        value={data.settings.password}
                                        onChange={(e) => {
                                            const newData = { ...data };
                                            newData.settings.password = e.target.value;
                                            setData(newData);
                                        }}
                                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)" }}
                                    />
                                </div>
                            </div>

                            <div className="glass" style={{ padding: "1.5rem", borderRadius: "12px" }}>
                                <h3 style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>AI Configuration</h3>
                                <div style={{ marginBottom: "1rem" }}>
                                    <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem" }}>OpenAI API URL</label>
                                    <input
                                        type="text"
                                        value={data.settings.openaiUrl}
                                        onChange={(e) => {
                                            const newData = { ...data };
                                            newData.settings.openaiUrl = e.target.value;
                                            setData(newData);
                                        }}
                                        placeholder="https://api.openai.com"
                                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)" }}
                                    />
                                </div>
                                <div style={{ marginBottom: "1rem" }}>
                                    <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem" }}>OpenAI API Key</label>
                                    <input
                                        type="password"
                                        value={data.settings.openaiKey}
                                        onChange={(e) => {
                                            const newData = { ...data };
                                            newData.settings.openaiKey = e.target.value;
                                            setData(newData);
                                        }}
                                        placeholder="sk-..."
                                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)" }}
                                    />
                                </div>
                            </div>

                            <div className="glass" style={{ padding: "1.5rem", borderRadius: "12px" }}>
                                <h3 style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>Backup & Restore</h3>
                                <div style={{ display: "flex", gap: "1rem" }}>
                                    <button
                                        onClick={handleBackup}
                                        style={{
                                            flex: 1,
                                            padding: "12px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: "0.5rem",
                                            background: "var(--bg-primary)",
                                            border: "1px solid var(--border)",
                                            borderRadius: "8px",
                                            cursor: "pointer",
                                            color: "var(--text-primary)"
                                        }}
                                    >
                                        <Download size={18} /> Backup
                                    </button>
                                    <label
                                        style={{
                                            flex: 1,
                                            padding: "12px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: "0.5rem",
                                            background: "var(--bg-primary)",
                                            border: "1px solid var(--border)",
                                            borderRadius: "8px",
                                            cursor: "pointer",
                                            color: "var(--text-primary)"
                                        }}
                                    >
                                        <Upload size={18} /> Restore
                                        <input type="file" accept=".json" onChange={handleRestore} style={{ display: "none" }} />
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ padding: "1.5rem", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end" }}>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        style={{
                            padding: "12px 24px",
                            background: "var(--accent)",
                            color: "white",
                            border: "none",
                            borderRadius: "12px",
                            fontSize: "1rem",
                            fontWeight: 600,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        <Save size={20} />
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
}
