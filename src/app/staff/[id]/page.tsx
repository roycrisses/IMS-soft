import { getStaffMember } from "@/actions/staff";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import StaffDetailClient from "./StaffDetailClient";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StaffData = any;

export default async function StaffDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const result = await getStaffMember(id);

    if (!result.success) notFound();

    const staff = result.data as StaffData;
    const currentSalary = staff.salaryStructures?.[0];
    const totalSalary = currentSalary ? currentSalary.base + currentSalary.allowances : 0;

    return (
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <div className="page-header" style={{ marginBottom: "var(--space-2xl)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                    <Link href="/staff" className="btn btn-secondary" style={{
                        width: "48px",
                        height: "48px",
                        padding: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "14px",
                        background: "#ffffff",
                        border: "1px solid var(--border-default)",
                        boxShadow: "var(--shadow-sm)"
                    }}>
                        <ArrowLeft size={20} strokeWidth={2.5} />
                    </Link>
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                            <h1 style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.04em" }}>
                                {staff.firstName} {staff.lastName}
                            </h1>
                            <span style={{
                                background: staff.isActive ? "rgba(16, 185, 129, 0.04)" : "rgba(239, 68, 68, 0.04)",
                                color: staff.isActive ? "var(--status-paid)" : "var(--status-overdue)",
                                fontWeight: 900,
                                fontSize: "0.6875rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.06em",
                                padding: "6px 16px",
                                borderRadius: "100px",
                                border: staff.isActive ? "1px solid rgba(16, 185, 129, 0.15)" : "1px solid rgba(239, 68, 68, 0.15)"
                            }}>
                                {staff.isActive ? "Operational" : "Inactive"}
                            </span>
                        </div>
                        <p style={{ color: "var(--text-tertiary)", fontWeight: 600, marginTop: "4px", fontSize: "1.0625rem" }}>
                            {staff.role} <span style={{ opacity: 0.3, margin: "0 8px" }}>•</span> Senior Faculty Member
                        </p>
                    </div>
                </div>
            </div>

            <div className="card-grid" style={{ marginBottom: "40px", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }}>
                <div className="stat-tile" style={{ padding: "24px", background: "#ffffff", border: "1px solid var(--border-default)", boxShadow: "var(--shadow-sm)", borderRadius: "20px" }}>
                    <span style={{ fontSize: "0.6875rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-tertiary)", marginBottom: "12px", display: "block" }}>Total Remuneration</span>
                    <span style={{ fontSize: "1.75rem", fontWeight: 900, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>₹{totalSalary.toLocaleString()}</span>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginTop: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>Monthly Gross Package</div>
                </div>
                <div className="stat-tile" style={{ padding: "24px", background: "#ffffff", border: "1px solid var(--border-default)", boxShadow: "var(--shadow-sm)", borderRadius: "20px" }}>
                    <span style={{ fontSize: "0.6875rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-tertiary)", marginBottom: "12px", display: "block" }}>Base Components</span>
                    <span style={{ fontSize: "1.75rem", fontWeight: 900, color: "var(--text-secondary)", letterSpacing: "-0.02em" }}>₹{currentSalary?.base?.toLocaleString() || 0}</span>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginTop: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>Core Fixed Pay</div>
                </div>
                <div className="stat-tile" style={{ padding: "24px", background: "#ffffff", border: "1px solid var(--border-default)", boxShadow: "var(--shadow-sm)", borderRadius: "20px" }}>
                    <span style={{ fontSize: "0.6875rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-tertiary)", marginBottom: "12px", display: "block" }}>Benefit Allowances</span>
                    <span style={{ fontSize: "1.75rem", fontWeight: 900, color: "var(--status-partial)", letterSpacing: "-0.02em" }}>₹{currentSalary?.allowances?.toLocaleString() || 0}</span>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginTop: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>Perks and Variable Pay</div>
                </div>
                <div className="stat-tile" style={{ padding: "24px", background: "rgba(37, 99, 235, 0.02)", border: "1px solid rgba(37, 99, 235, 0.1)", boxShadow: "var(--shadow-sm)", borderRadius: "20px" }}>
                    <span style={{ fontSize: "0.6875rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-tertiary)", marginBottom: "12px", display: "block" }}>Tenure Start</span>
                    <span style={{ fontSize: "1.375rem", fontWeight: 900, color: "var(--accent-primary)", letterSpacing: "-0.02em" }}>
                        {new Date(staff.joinDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginTop: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>Official Joining Date</div>
                </div>
            </div>

            <StaffDetailClient staff={staff} />
        </div>

    );
}
