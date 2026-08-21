"use client";

import { useEffect, useState } from "react";
import SiteIcon from "./SiteIcon";
import sitesData from "@/data/sites.json";

interface Site {
    id: string;
    name: string;
    urlInternal: string;
    urlExternal: string;
    description: string;
    icon?: string;
}

interface Category {
    id: string;
    name: string;
    sites: Site[];
}

export default function SiteGrid() {
    const [categories, setCategories] = useState<Category[]>(sitesData.categories);
    const [networkMode, setNetworkMode] = useState<"internal" | "external">("external");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        // Initial load
        const savedMode = localStorage.getItem("networkMode") as "internal" | "external";
        if (savedMode) setNetworkMode(savedMode);

        // Listen for changes
        const handleNetworkChange = () => {
            const newMode = localStorage.getItem("networkMode") as "internal" | "external";
            if (newMode) setNetworkMode(newMode);
        };

        const handleSearchChange = (e: CustomEvent<string>) => {
            setSearchTerm(e.detail.toLowerCase());
        };

        window.addEventListener("networkModeChanged", handleNetworkChange);
        window.addEventListener("searchChanged", handleSearchChange as EventListener);

        return () => {
            window.removeEventListener("networkModeChanged", handleNetworkChange);
            window.removeEventListener("searchChanged", handleSearchChange as EventListener);
        };
    }, []);

    const getUrl = (site: Site) => {
        if (networkMode === "internal" && site.urlInternal) return site.urlInternal;
        return site.urlExternal || site.urlInternal; // Fallback to internal if external missing, though requirement says show external
    };

    const filteredCategories = categories.map(cat => ({
        ...cat,
        sites: cat.sites.filter(site =>
            site.name.toLowerCase().includes(searchTerm) ||
            site.description.toLowerCase().includes(searchTerm)
        )
    })).filter(cat => cat.sites.length > 0);

    return (
        <div className="container" style={{ paddingBottom: "4rem" }}>
            {filteredCategories.map(category => (
                <div key={category.id} style={{ marginBottom: "3rem" }}>
                    <h2 style={{
                        marginBottom: "1.5rem",
                        fontSize: "1.2rem",
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem"
                    }}>
                        {category.name}
                    </h2>

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                        gap: "1.5rem"
                    }}>
                        {category.sites.map(site => {
                            const targetUrl = getUrl(site);
                            return (
                                <a
                                    key={site.id}
                                    href={targetUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="glass"
                                    style={{
                                        padding: "1.5rem",
                                        borderRadius: "20px",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "1rem",
                                        transition: "transform 0.2s, box-shadow 0.2s",
                                        cursor: "pointer",
                                        textDecoration: "none"
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = "translateY(-4px)";
                                        e.currentTarget.style.boxShadow = "var(--shadow)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "translateY(0)";
                                        e.currentTarget.style.boxShadow = "none";
                                    }}
                                >
                                    <SiteIcon name={site.name} url={targetUrl} icon={site.icon} />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <h3 style={{
                                            fontSize: "1rem",
                                            fontWeight: 600,
                                            color: "var(--text-primary)",
                                            marginBottom: "0.25rem",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis"
                                        }}>
                                            {site.name}
                                        </h3>
                                        <p style={{
                                            fontSize: "0.85rem",
                                            color: "var(--text-secondary)",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis"
                                        }}>
                                            {site.description}
                                        </p>
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                </div>
            ))}

            {filteredCategories.length === 0 && (
                <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-secondary)" }}>
                    No sites found matching "{searchTerm}"
                </div>
            )}
        </div>
    );
}
