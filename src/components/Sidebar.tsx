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
            background: "var(--bg-primary)",
            borderRight: "1px solid var(--border-default)",
            display: "flex",
            flexDirection: "column",
            zIndex: 50,
            overflow: "hidden",
        }}>
            {/* Logo */}
            <div style={{
                padding: "var(--space-xl)",
                borderBottom: "1px solid var(--border-default)",
                background: "linear-gradient(to bottom, var(--bg-primary), var(--bg-secondary))",
            }}>
                <div style={{
                    fontSize: "1.125rem",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    letterSpacing: "-0.025em",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                }}>
                    <div style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "3px",
                        background: "var(--accent-primary)",
                        boxShadow: "0 2px 8px rgba(37, 99, 235, 0.4)",
                        transform: "rotate(45deg)",
                    }} />
                    Lumina<span style={{ color: "var(--accent-primary)", fontWeight: 800 }}>MIS</span>
                </div>
                <div style={{
                    fontSize: "0.6875rem",
                    color: "var(--text-tertiary)",
                    marginTop: "6px",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    fontWeight: 600,
                }}>
                    Academic Excellence
                </div>
            </div>



            {/* Nav */}
            <nav style={{ flex: 1, padding: "var(--space-md)", overflowY: "auto" }}>
                {navItems.map((item) => {
                    if (item.children) {
                        return (
                            <div key={item.label} style={{ marginBottom: "var(--space-xs)" }}>
                                <div style={{
                                    padding: "var(--space-sm) var(--space-md)",
                                    fontSize: "0.6875rem",
                                    fontWeight: 600,
                                    color: "var(--text-tertiary)",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.08em",
                                    marginTop: "var(--space-md)",
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
                                                gap: "var(--space-md)",
                                                padding: "var(--space-sm) var(--space-md)",
                                                paddingLeft: "var(--space-xl)",
                                                borderRadius: "var(--radius-md)",
                                                fontSize: "0.875rem",
                                                fontWeight: isActive ? 600 : 400,
                                                color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                                                background: isActive ? "var(--bg-secondary)" : "transparent",
                                                transition: "all var(--transition-fast)",
                                                marginBottom: "2px",
                                            }}
                                        >
                                            <Icon size={16} />
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
                                gap: "var(--space-md)",
                                padding: "var(--space-sm) var(--space-md)",
                                borderRadius: "var(--radius-md)",
                                fontSize: "0.875rem",
                                fontWeight: isActive ? 600 : 400,
                                color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                                background: isActive ? "var(--bg-secondary)" : "transparent",
                                transition: "all var(--transition-fast)",
                                marginBottom: "2px",
                            }}
                        >
                            <Icon size={16} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div style={{
                padding: "var(--space-lg)",
                borderTop: "1px solid var(--border-default)",
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-sm)",
            }}>
                <button
                    onClick={() => signOut()}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--space-md)",
                        padding: "var(--space-sm) var(--space-md)",
                        borderRadius: "var(--radius-md)",
                        fontSize: "0.875rem",
                        color: "var(--status-overdue)",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        transition: "all var(--transition-fast)",
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'var(--status-overdue-bg)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                    <LogOut size={16} />
                    Sign Out
                </button>
                <div style={{
                    fontSize: "0.75rem",
                    color: "var(--text-tertiary)",
                    marginTop: "4px"
                }}>
                    v1.0.0 · Aura Admin
                </div>
            </div>

        </aside>
    );
}
