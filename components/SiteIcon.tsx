"use client";

import { useState } from "react";
import { Globe } from "lucide-react";

interface SiteIconProps {
    icon?: string;
    name: string;
    url: string;
}

export default function SiteIcon({ icon, name, url }: SiteIconProps) {
    const [error, setError] = useState(false);

    // Helper to get pinyin initials (simplified for now, just first letter)
    const getInitials = (str: string) => {
        return str.charAt(0).toUpperCase();
    };

    // 1. If icon is an Iconify string (e.g. "mdi:home") - Not fully implemented in this MVP without Iconify React
    // 2. If icon is a URL, use it
    // 3. Fallback to Favicon
    // 4. Fallback to Pinyin Initial

    // For this MVP, we will try:
    // 1. Provided Icon URL (if looks like URL)
    // 2. Google Favicon Service
    // 3. Fallback to Initial

    if (icon && (icon.startsWith("http") || icon.startsWith("/"))) {
        if (!error) {
            return (
                <img
                    src={icon}
                    alt={name}
                    onError={() => setError(true)}
                    style={{ width: "48px", height: "48px", borderRadius: "12px", objectFit: "cover" }}
                />
            )
        }
    }

    // Try Favicon from Google
    if (!error) {
        const domain = new URL(url).hostname;
        return (
            <img
                src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
                alt={name}
                onError={() => setError(true)}
                style={{ width: "48px", height: "48px", borderRadius: "12px" }}
            />
        );
    }

    // Fallback to Initial
    return (
        <div style={{
            width: "48px",
            height: "48px",
            borderRadius: "12px",
            background: "var(--accent)",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px",
            fontWeight: "bold"
        }}>
            {getInitials(name)}
        </div>
    );
}
