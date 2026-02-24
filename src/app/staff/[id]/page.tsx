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
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div className="page-header" style={{ marginBottom: "var(--space-2xl)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-xl)" }}>
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
                            <h1 style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.04em" }}>{staff.firstName} {staff.lastName}</h1>
                            <span style={{
                                background: staff.isActive ? "var(--status-paid-bg)" : "var(--status-pending-bg)",
                                color: staff.isActive ? "var(--status-paid)" : "var(--text-tertiary)",
                                fontWeight: 900,
                                fontSize: "0.6875rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.06em",
                                padding: "6px 16px",
                                borderRadius: "100px",
                                border: staff.isActive ? "1px solid rgba(16, 185, 129, 0.2)" : "1px solid var(--border-default)"
                            }}>
                                {staff.isActive ? "Operational" : "Inactive"}
                            </span>
                        </div>
                        <p style={{ color: "var(--text-tertiary)", fontWeight: 600, marginTop: "4px", fontSize: "1rem" }}>
                            {staff.role} <span style={{ opacity: 0.3, margin: "0 8px" }}>•</span> Senior Faculty Member
                        </p>
                    </div>
                </div>
            </div>

            <div className="card-grid" style={{ marginBottom: "var(--space-2xl)", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--space-xl)" }}>
                <div className="stat-tile" style={{ padding: "var(--space-xl)", background: "#ffffff", border: "1px solid var(--border-default)" }}>
                    <span className="stat-label" style={{ fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "0.6875rem", color: "var(--text-tertiary)" }}>Total Remuneration</span>
                    <span className="stat-value" style={{ fontSize: "1.75rem", fontWeight: 900, color: "var(--text-primary)" }}>₹{totalSalary.toLocaleString()}</span>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginTop: "6px", fontWeight: 600 }}>Monthly gross package</div>
                </div>
                <div className="stat-tile" style={{ padding: "var(--space-xl)", background: "#ffffff", border: "1px solid var(--border-default)" }}>
                    <span className="stat-label" style={{ fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "0.6875rem", color: "var(--text-tertiary)" }}>Base Components</span>
                    <span className="stat-value" style={{ fontSize: "1.75rem", fontWeight: 900, color: "var(--text-secondary)" }}>₹{currentSalary?.base?.toLocaleString() || 0}</span>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginTop: "6px", fontWeight: 600 }}>Core fixed pay</div>
                </div>
                <div className="stat-tile" style={{ padding: "var(--space-xl)", background: "#ffffff", border: "1px solid var(--border-default)" }}>
                    <span className="stat-label" style={{ fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "0.6875rem", color: "var(--text-tertiary)" }}>Benefit Allowances</span>
                    <span className="stat-value" style={{ fontSize: "1.75rem", fontWeight: 900, color: "var(--status-partial)" }}>₹{currentSalary?.allowances?.toLocaleString() || 0}</span>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginTop: "6px", fontWeight: 600 }}>Perks and variable pay</div>
                </div>
                <div className="stat-tile" style={{ padding: "var(--space-xl)", background: "#ffffff", border: "1px solid var(--border-default)" }}>
                    <span className="stat-label" style={{ fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "0.6875rem", color: "var(--text-tertiary)" }}>Tenure Start</span>
                    <span className="stat-value" style={{ fontSize: "1.375rem", fontWeight: 900, color: "var(--accent-primary)" }}>
                        {new Date(staff.joinDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginTop: "6px", fontWeight: 600 }}>Official joining date</div>
                </div>
            </div>


            <StaffDetailClient staff={staff} />
        </div>

    );
}
