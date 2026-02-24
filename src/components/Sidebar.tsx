"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    GraduationCap,
    DollarSign,
    Users,
    FileText,
    Settings,
    CreditCard,
    AlertTriangle,
    LogOut,
} from "lucide-react";
import { signOut } from "@/actions/auth";


const navItems = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "Students", href: "/students", icon: GraduationCap },
    {
        label: "Finance",
        icon: DollarSign,
        children: [
            { label: "Collections", href: "/finance/collections", icon: CreditCard },
            { label: "Dues", href: "/finance/dues", icon: AlertTriangle },
        ],
    },
    { label: "Staff & Payroll", href: "/staff", icon: Users },
    { label: "Payroll", href: "/payroll", icon: FileText },
    { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside style={{
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
            width: "var(--sidebar-width)",
            background: "#ffffff",
            borderRight: "1px solid var(--border-default)",
            display: "flex",
            flexDirection: "column",
            zIndex: 50,
            overflow: "hidden",
            boxShadow: "4px 0 24px rgba(0, 0, 0, 0.02)"
        }}>
            {/* Logo Section */}
            <div style={{
                padding: "32px 24px",
                background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                position: "relative"
            }}>
                <div style={{
                    fontSize: "1.25rem",
                    fontWeight: 900,
                    color: "var(--text-primary)",
                    letterSpacing: "-0.04em",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                }}>
                    <div style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "4px",
                        background: "var(--accent-primary)",
                        boxShadow: "0 4px 12px rgba(37, 99, 235, 0.4)",
                        transform: "rotate(45deg)",
                    }} />
                    Lumina<span style={{ color: "var(--accent-primary)" }}>MIS</span>
                </div>
                <div style={{
                    fontSize: "0.625rem",
                    color: "var(--text-tertiary)",
                    marginTop: "8px",
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
                    fontWeight: 800,
                    opacity: 0.8
                }}>
                    Institutional Core
                </div>
            </div>

            {/* Navigation */}
            <nav style={{ flex: 1, padding: "16px 12px", overflowY: "auto" }}>
                {navItems.map((item) => {
                    if (item.children) {
                        return (
                            <div key={item.label} style={{ marginBottom: "24px" }}>
                                <div style={{
                                    padding: "0 12px",
                                    fontSize: "0.625rem",
                                    fontWeight: 900,
                                    color: "var(--text-tertiary)",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.12em",
                                    marginBottom: "12px",
                                    opacity: 0.6
                                }}>
                                    {item.label}
                                </div>
                                {item.children.map((child) => {
                                    const isActive = pathname === child.href;
                                    const Icon = child.icon;
                                    return (
                                        <Link
                                            key={child.href}
                                            href={child.href}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "12px",
                                                padding: "10px 12px",
                                                borderRadius: "12px",
                                                fontSize: "0.875rem",
                                                fontWeight: isActive ? 700 : 600,
                                                color: isActive ? "var(--accent-primary)" : "var(--text-secondary)",
                                                background: isActive ? "rgba(37, 99, 235, 0.06)" : "transparent",
                                                transition: "all 0.2s ease",
                                                marginBottom: "4px",
                                                textDecoration: "none"
                                            }}
                                        >
                                            <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                                            {child.label}
                                        </Link>
                                    );
                                })}
                            </div>
                        );
                    }

                    const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href!);
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href!}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                padding: "12px",
                                borderRadius: "12px",
                                fontSize: "0.875rem",
                                fontWeight: isActive ? 700 : 600,
                                color: isActive ? "var(--accent-primary)" : "var(--text-secondary)",
                                background: isActive ? "rgba(37, 99, 235, 0.06)" : "transparent",
                                transition: "all 0.2s ease",
                                marginBottom: "6px",
                                textDecoration: "none"
                            }}
                        >
                            <Icon size={18} strokeWidth={2.5} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div style={{
                padding: "24px 12px",
                borderTop: "1px solid var(--border-default)",
                background: "linear-gradient(to top, #f8fafc 0%, #ffffff 100%)"
            }}>
                <button
                    onClick={() => signOut()}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "12px",
                        borderRadius: "12px",
                        width: "100%",
                        fontSize: "0.875rem",
                        fontWeight: 700,
                        color: "var(--status-overdue)",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        textAlign: "left"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.06)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                    <LogOut size={18} strokeWidth={2.5} />
                    Terminate Session
                </button>
                <div style={{
                    fontSize: "0.6875rem",
                    color: "var(--text-tertiary)",
                    padding: "12px",
                    fontWeight: 700,
                    opacity: 0.5
                }}>
                    v4.0.2 · Lumina Enterprise
                </div>
            </div>
        </aside>
    );
}
