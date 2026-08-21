"use client";

import { useState, useEffect } from "react";
import AdminDashboard from "./AdminDashboard";

export default function AdminWrapper() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleOpen = () => setIsOpen(true);
        window.addEventListener("openAdmin", handleOpen);
        return () => window.removeEventListener("openAdmin", handleOpen);
    }, []);

    if (!isOpen) return null;

    return <AdminDashboard onClose={() => setIsOpen(false)} />;
}
