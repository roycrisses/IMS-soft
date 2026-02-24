import Link from "next/link";
import { getStaffList } from "@/actions/staff";
import { Plus, Users } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StaffMember = any;

export default async function StaffPage() {
    const result = await getStaffList();
    const staff = (result.data as StaffMember[]) || [];

    return (
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div className="page-header" style={{ marginBottom: "var(--space-2xl)" }}>
                <div>
                    <h1 style={{ fontSize: "2.5rem", fontWeight: 800, letterSpacing: "-0.04em", color: "var(--text-primary)" }}>Human Resources</h1>
                    <p style={{ color: "var(--text-tertiary)", fontWeight: 500, marginTop: "4px", fontSize: "1rem" }}>
                        Faculty administration and institutional personnel management
                    </p>
                </div>
                <Link href="/staff/new" className="btn btn-primary" style={{
                    height: "48px",
                    padding: "0 28px",
                    boxShadow: "0 10px 20px rgba(37, 99, 235, 0.15)",
                    borderRadius: "12px",
                    fontWeight: 800,
                    fontSize: "0.9375rem"
                }}>
                    <Plus size={18} strokeWidth={3} />
                    Onboard Faculty
                </Link>
            </div>

            <div className="section-card" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-default)", boxShadow: "var(--shadow-sm)" }}>
                <div className="section-header" style={{ padding: "24px", background: "transparent", borderBottom: "1px solid var(--border-default)" }}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <h3 style={{ fontSize: "1.25rem", fontWeight: 800 }}>Personnel Register</h3>
                        <p style={{ fontSize: "0.875rem", color: "var(--text-tertiary)", fontWeight: 500, marginTop: "4px" }}>
                            Detailed overview of active and inactive faculty members
                        </p>
                    </div>
                    <div style={{
                        fontSize: "0.75rem",
                        color: "var(--accent-primary)",
                        fontWeight: 900,
                        background: "rgba(37, 99, 235, 0.06)",
                        padding: "6px 16px",
                        borderRadius: "100px",
                        letterSpacing: "0.04em",
                        border: "1px solid rgba(37, 99, 235, 0.1)"
                    }}>
                        {staff.length} INSTITUTIONAL ROLES
                    </div>
                </div>
                <div className="data-table-wrapper" style={{ border: "none", borderRadius: 0, overflow: "visible" }}>
                    <table className="data-table">
                        <thead>
                            <tr style={{ background: "var(--bg-secondary)" }}>
                                <th style={{ paddingLeft: "24px" }}>Personnel Identity</th>
                                <th>Department / Mandate</th>
                                <th>Matriculation</th>
                                <th>Remuneration</th>
                                <th>Status</th>
                                <th style={{ textAlign: "right", paddingRight: "24px" }}>Interface</th>
                            </tr>
                        </thead>
                        <tbody style={{ background: "#ffffff" }}>
                            {staff.length === 0 ? (
                                <tr>
                                    <td colSpan={6}>
                                        <div className="empty-state" style={{ padding: "var(--space-3xl)" }}>
                                            <div style={{
                                                width: "64px",
                                                height: "64px",
                                                background: "var(--bg-secondary)",
                                                borderRadius: "20px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: "var(--text-tertiary)",
                                                marginBottom: "var(--space-lg)",
                                                border: "1px solid var(--border-default)"
                                            }}>
                                                <Users size={32} />
                                            </div>
                                            <p style={{ fontWeight: 800, fontSize: "1.125rem", color: "var(--text-primary)" }}>No records found</p>
                                            <p style={{ color: "var(--text-tertiary)", fontWeight: 500, marginTop: "4px" }}>
                                                Initiate faculty onboarding to populate the register.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                staff.map((s: StaffMember) => {
                                    const currentSalary = s.salaryStructures?.[0];
                                    const totalSalary = currentSalary ? currentSalary.base + currentSalary.allowances : 0;
                                    return (
                                        <tr key={s.id}>
                                            <td style={{ paddingLeft: "24px" }}>
                                                <div style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: "0.9375rem" }}>{s.firstName} {s.lastName}</div>
                                                <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", fontWeight: 600, marginTop: "2px" }}>{s.email || "Official credentials pending"}</div>
                                            </td>
                                            <td>
                                                <div style={{ fontWeight: 800, color: "var(--text-secondary)", fontSize: "0.8125rem", textTransform: "uppercase", letterSpacing: "0.025em" }}>{s.role}</div>
                                                <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", fontWeight: 600, marginTop: "2px" }}>{s.phone || "No primary contact"}</div>
                                            </td>
                                            <td style={{ color: "var(--text-secondary)", fontWeight: 700, fontSize: "0.875rem" }}>
                                                {new Date(s.joinDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                            </td>
                                            <td className="font-mono" style={{ fontWeight: 900, fontSize: "1rem", color: "var(--text-primary)" }}>
                                                {currentSalary ? `₹${totalSalary.toLocaleString()}` : <span style={{ color: "var(--text-tertiary)", fontWeight: 500, fontStyle: "italic", fontSize: "0.8125rem" }}>Awaiting audit</span>}
                                            </td>
                                            <td>
                                                <span style={{
                                                    background: s.isActive ? "var(--status-paid-bg)" : "var(--status-pending-bg)",
                                                    color: s.isActive ? "var(--status-paid)" : "var(--text-tertiary)",
                                                    fontWeight: 900,
                                                    textTransform: "uppercase",
                                                    fontSize: "0.625rem",
                                                    letterSpacing: "0.06em",
                                                    padding: "5px 14px",
                                                    borderRadius: "100px",
                                                    border: s.isActive ? "1px solid rgba(16, 185, 129, 0.2)" : "1px solid var(--border-default)"
                                                }}>
                                                    {s.isActive ? "Authorized" : "Deactivated"}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: "right", paddingRight: "24px" }}>
                                                <Link href={`/staff/${s.id}`} className="btn btn-secondary btn-sm" style={{
                                                    height: "36px",
                                                    padding: "0 18px",
                                                    fontWeight: 800,
                                                    borderRadius: "10px",
                                                    background: "var(--bg-secondary)",
                                                    border: "1px solid var(--border-default)",
                                                    fontSize: "0.8125rem"
                                                }}>
                                                    Manage
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>

    );
}
