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
} from "lucide-react";

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
            }}>
                <div style={{
                    fontSize: "1.125rem",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    letterSpacing: "-0.025em",
                }}>
                    Institute<span style={{ color: "var(--text-tertiary)", fontWeight: 400 }}>MIS</span>
                </div>
                <div style={{
                    fontSize: "0.6875rem",
                    color: "var(--text-tertiary)",
                    marginTop: "2px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                }}>
                    Management System
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
                fontSize: "0.75rem",
                color: "var(--text-tertiary)",
            }}>
                v1.0.0 · Admin
            </div>
        </aside>
    );
}
