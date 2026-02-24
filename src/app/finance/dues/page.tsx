import Link from "next/link";
import { getDuesReport } from "@/actions/finance";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DueStudent = any;

export default async function DuesPage() {
    const result = await getDuesReport();
    const students = (result.data as DueStudent[]) || [];

    const totalDues = students.reduce((s: number, st: DueStudent) => s + st.balanceDue, 0);

    return (
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div className="page-header" style={{ marginBottom: "var(--space-2xl)" }}>
                <div>
                    <h1 style={{ fontSize: "2.5rem", fontWeight: 800, letterSpacing: "-0.04em" }}>Arrears Report</h1>
                    <p style={{ color: "var(--text-tertiary)", fontWeight: 500, marginTop: "4px", fontSize: "1rem" }}>
                        Strategic overview of outstanding balances and institutional fee liabilities
                    </p>
                </div>
                <div style={{
                    padding: "20px 24px",
                    background: "var(--bg-secondary)",
                    borderRadius: "16px",
                    border: "1px solid var(--border-default)",
                    boxShadow: "var(--shadow-sm)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    minWidth: "240px"
                }}>
                    <span style={{ fontSize: "0.6875rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-tertiary)", marginBottom: "4px" }}>Total Liabilities</span>
                    <span style={{ fontSize: "2rem", fontWeight: 900, color: "var(--status-overdue)", lineHeight: 1 }}>
                        ₹{totalDues.toLocaleString()}
                    </span>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", fontWeight: 600, marginTop: "8px" }}>Cumulative Pending Receivables</div>
                </div>
            </div>

            <div className="section-card">
                <div className="section-header" style={{ padding: "var(--space-xl)" }}>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 800 }}>Outstanding Balance Registry</h3>
                </div>
                <div className="data-table-wrapper" style={{ border: "none", borderRadius: 0 }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Student Identity</th>
                                <th>Academic / Batch Track</th>
                                <th className="text-right">Billed Aggregate</th>
                                <th className="text-right">Settled Amount</th>
                                <th className="text-right">Outstanding Dues</th>
                                <th style={{ textAlign: "right" }}>Interface</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.length === 0 ? (
                                <tr>
                                    <td colSpan={6}>
                                        <div className="empty-state" style={{ padding: "var(--space-3xl)" }}>
                                            <p style={{ fontWeight: 800, fontSize: "1.125rem", color: "var(--text-primary)" }}>Zero Liabilities Detected</p>
                                            <p style={{ color: "var(--text-tertiary)", fontWeight: 500, marginTop: "4px" }}>All institutional accounts are currently synchronized.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                students.map((s: DueStudent) => (
                                    <tr key={s.id}>
                                        <td>
                                            <div style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: "1rem" }}>{s.name}</div>
                                            <div style={{ fontSize: "0.75rem", color: "var(--accent-primary)", fontWeight: 800, marginTop: "2px", letterSpacing: "0.02em" }}>{s.studentCode}</div>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 700, color: "var(--text-secondary)" }}>{s.course}</div>
                                            <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", fontWeight: 600, marginTop: "2px" }}>{s.batch}</div>
                                        </td>
                                        <td className="text-right font-mono" style={{ color: "var(--text-secondary)", fontWeight: 600 }}>₹{s.totalCharged.toLocaleString()}</td>
                                        <td className="text-right font-mono" style={{ color: "var(--status-paid)", fontWeight: 700 }}>₹{s.totalPaid.toLocaleString()}</td>
                                        <td className="text-right">
                                            <span style={{
                                                fontWeight: 800,
                                                color: "var(--status-overdue)",
                                                background: "rgba(239, 68, 68, 0.05)",
                                                padding: "6px 14px",
                                                borderRadius: "100px",
                                                fontSize: "0.875rem",
                                                display: "inline-block"
                                            }}>
                                                ₹{s.balanceDue.toLocaleString()}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: "right" }}>
                                            <Link href={`/students/${s.id}`} className="btn btn-secondary btn-sm" style={{
                                                height: "36px",
                                                padding: "0 16px",
                                                fontWeight: 800,
                                                borderRadius: "8px",
                                                background: "var(--bg-secondary)",
                                                border: "1px solid var(--border-default)"
                                            }}>
                                                View Ledger
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    );
}
