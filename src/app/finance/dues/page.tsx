import Link from "next/link";
import { getDuesReport } from "@/actions/finance";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DueStudent = any;

export default async function DuesPage() {
    const result = await getDuesReport();
    const students = (result.data as DueStudent[]) || [];

    const totalDues = students.reduce((s: number, st: DueStudent) => s + st.balanceDue, 0);

    return (
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <div className="page-header" style={{ marginBottom: "var(--space-2xl)" }}>
                <div>
                    <h1 style={{ fontSize: "2.5rem", fontWeight: 800, letterSpacing: "-0.04em", color: "var(--text-primary)" }}>Arrears Report</h1>
                    <p style={{ color: "var(--text-tertiary)", fontWeight: 500, marginTop: "4px", fontSize: "1.0625rem" }}>
                        Strategic overview of outstanding balances and institutional fee liabilities
                    </p>
                </div>
                <div style={{
                    padding: "24px",
                    background: "#ffffff",
                    borderRadius: "20px",
                    border: "1px solid var(--border-default)",
                    boxShadow: "var(--shadow-sm)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    minWidth: "280px"
                }}>
                    <span style={{ fontSize: "0.6875rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-tertiary)", marginBottom: "8px" }}>Total Liabilities</span>
                    <span style={{ fontSize: "2.25rem", fontWeight: 900, color: "var(--status-overdue)", lineHeight: 1, letterSpacing: "-0.02em" }}>
                        ₹{totalDues.toLocaleString()}
                    </span>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", fontWeight: 700, marginTop: "12px", textTransform: "uppercase", letterSpacing: "0.04em" }}>Cumulative Pending Receivables</div>
                </div>
            </div>

            <div className="section-card" style={{ background: "#ffffff", border: "1px solid var(--border-default)", boxShadow: "var(--shadow-sm)" }}>
                <div className="section-header" style={{ padding: "24px 32px", borderBottom: "1px solid var(--border-default)", background: "var(--bg-secondary)" }}>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 800 }}>Outstanding Balance Registry</h3>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        Verified Institutional Liability Tracking
                    </div>
                </div>
                <div className="data-table-wrapper" style={{ border: "none", borderRadius: 0 }}>
                    <table className="data-table">
                        <thead>
                            <tr style={{ background: "var(--bg-secondary)" }}>
                                <th style={{ paddingLeft: "32px" }}>Student Identity</th>
                                <th>Academic / Batch Track</th>
                                <th className="text-right">Billed Aggregate</th>
                                <th className="text-right">Settled Amount</th>
                                <th className="text-right">Outstanding Dues</th>
                                <th style={{ textAlign: "right", paddingRight: "32px" }}>Interface</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.length === 0 ? (
                                <tr>
                                    <td colSpan={6}>
                                        <div className="empty-state" style={{ padding: "var(--space-3xl)" }}>
                                            <p style={{ fontWeight: 800, fontSize: "1.25rem", color: "var(--text-primary)" }}>Zero Liabilities Detected</p>
                                            <p style={{ color: "var(--text-tertiary)", fontWeight: 500, marginTop: "6px" }}>All institutional accounts are currently synchronized.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                students.map((s: DueStudent) => (
                                    <tr key={s.id}>
                                        <td style={{ paddingLeft: "32px" }}>
                                            <div style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: "1.0625rem" }}>{s.name}</div>
                                            <div style={{ fontSize: "0.8125rem", color: "var(--accent-primary)", fontWeight: 800, marginTop: "4px", letterSpacing: "0.04em" }} className="font-mono">{s.studentCode}</div>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 800, color: "var(--text-secondary)", fontSize: "0.9375rem" }}>{s.course}</div>
                                            <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", fontWeight: 700, marginTop: "2px" }}>{s.batch}</div>
                                        </td>
                                        <td className="text-right font-mono" style={{ color: "var(--text-secondary)", fontWeight: 700 }}>₹{s.totalCharged.toLocaleString()}</td>
                                        <td className="text-right font-mono" style={{ color: "var(--status-paid)", fontWeight: 800 }}>₹{s.totalPaid.toLocaleString()}</td>
                                        <td className="text-right">
                                            <span style={{
                                                fontWeight: 900,
                                                color: "var(--status-overdue)",
                                                background: "var(--status-overdue-bg)",
                                                padding: "6px 16px",
                                                borderRadius: "100px",
                                                fontSize: "0.875rem",
                                                display: "inline-block",
                                                border: "1px solid rgba(239, 68, 68, 0.2)",
                                                letterSpacing: "0.02em"
                                            }}>
                                                ₹{s.balanceDue.toLocaleString()}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: "right", paddingRight: "32px" }}>
                                            <Link href={`/students/${s.id}`} className="btn btn-secondary" style={{
                                                height: "40px",
                                                padding: "0 20px",
                                                fontWeight: 800,
                                                borderRadius: "10px",
                                                background: "var(--bg-secondary)",
                                                border: "1px solid var(--border-default)",
                                                fontSize: "0.875rem"
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
