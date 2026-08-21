"use client";

import { useEffect, useState } from "react";

export default function TimeDisplay() {
    const [mounted, setMounted] = useState(false);
    const [time, setTime] = useState<Date | null>(null);

    useEffect(() => {
        setMounted(true);
        setTime(new Date());
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    if (!mounted) {
        return (
            <div style={{ textAlign: "center", padding: "2rem 0 4rem", color: "#ffffff", textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
                <div style={{ fontSize: "5rem", fontWeight: 700, lineHeight: 1, minHeight: "5rem" }}>&nbsp;</div>
                <div style={{ fontSize: "1.5rem", fontWeight: 400, opacity: 0.9, minHeight: "2rem", marginTop: "1rem" }}>&nbsp;</div>
            </div>
        );
    }

    return (
        <div style={{ textAlign: "center", padding: "2rem 0 4rem", color: "#ffffff", textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
            <div style={{ fontSize: "5rem", fontWeight: 700, lineHeight: 1 }}>
                {time ? time.toLocaleTimeString([], { hour12: false }) : ""}
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: 400, opacity: 0.9, marginTop: "1rem" }}>
                {time ? time.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : ""}
            </div>
        </div>
    );
}
