"use client";

import { Bell, Search } from "lucide-react";

export default function TopBar() {
    return (
        <header style={{
            height: "var(--topbar-height)",
            background: "var(--bg-primary)",
            borderBottom: "1px solid var(--border-default)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 var(--space-xl)",
            position: "sticky",
            top: 0,
            zIndex: 40,
            boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
        }}>
            {/* Search */}
            <div className="search-bar" style={{
                flex: "0 1 400px",
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-default)",
                transition: "all var(--transition-fast)",
            }}>
                <Search size={16} style={{ color: "var(--text-tertiary)" }} />
                <input
                    placeholder="Search platform..."
                    style={{ fontWeight: 500 }}
                />
            </div>


            {/* Right side */}
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-lg)" }}>
                <button className="btn-ghost" style={{
                    position: "relative",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "var(--space-sm)",
                    borderRadius: "var(--radius-md)",
                }}>
                    <Bell size={18} style={{ color: "var(--text-secondary)" }} />
                </button>

                {/* Admin avatar */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-sm)",
                }}>
                    <div style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: "var(--accent-primary)",
                        color: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.8125rem",
                        fontWeight: 600,
                    }}>
                        A
                    </div>
                    <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>Admin</span>
                </div>
            </div>
        </header>
    );
}
