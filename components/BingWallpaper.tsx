"use client";

import { useEffect, useState } from "react";

export default function BingWallpaper() {
    const [imageUrl, setImageUrl] = useState<string>("");

    useEffect(() => {
        // In a real app, we would fetch from our API proxy to avoid CORS
        // For now, we'll use a direct link or a placeholder if it fails
        // Since we can't easily fetch Bing from client due to CORS, we will use a Next.js API route later.
        // For this step, we will setup the component to accept the URL.

        // Temporary placeholder or fetch from our API
        fetch("/api/bing")
            .then((res) => res.json())
            .then((data) => {
                if (data.url) setImageUrl(data.url);
            })
            .catch(() => {
                // Fallback
                setImageUrl("https://images.unsplash.com/photo-1477346611705-65d1883cee1e?auto=format&fit=crop&w=1920&q=80");
            });
    }, []);

    if (!imageUrl) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: -1,
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                transition: "opacity 1s ease-in-out",
            }}
        />
    );
}
