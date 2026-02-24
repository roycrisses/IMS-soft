"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { postMonthlyPayroll, recordSalaryPayment } from "@/actions/payroll";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PE = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SM = any;

export default function PayrollClient({ entries, staffList, month, year }: { entries: PE[]; staffList: SM[]; month: number; year: number }) {
    const router = useRouter();
    const [showPost, setShowPost] = useState(false);
    const [postStaffId, setPostStaffId] = useState("");
    const [postDed, setPostDed] = useState(0);
    const [posting, setPosting] = useState(false);
    const [err, setErr] = useState("");
    const [payId, setPayId] = useState<string | null>(null);
    const [payAmt, setPayAmt] = useState(0);
    const [paying, setPaying] = useState(false);

    const handlePost = async () => {
        setPosting(true); setErr("");
        const r = await postMonthlyPayroll({ staffId: postStaffId, month, year, deductions: postDed });
        if (r.success) { setShowPost(false); router.refresh(); } else setErr(r.error || "Error");
        setPosting(false);
    };

    const handlePay = async () => {
        if (!payId) return;
        setPaying(true); setErr("");
        const r = await recordSalaryPayment({ payrollId: payId, amount: payAmt });
        if (r.success) { setPayId(null); router.refresh(); } else setErr(r.error || "Error");
        setPaying(false);
    };

    const nav = (dir: number) => {
        let m = month + dir, y = year;
        if (m < 1) { m = 12; y--; } if (m > 12) { m = 1; y++; }
        router.push(`/payroll?month=${m}&year=${y}`);
    };

    const mn = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2xl)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-md)",
                    background: "var(--bg-secondary)",
                    padding: "6px",
                    borderRadius: "14px",
                    border: "1px solid var(--border-default)"
                }}>
                    <button className="btn btn-secondary" onClick={() => nav(-1)} style={{ width: "36px", height: "36px", padding: 0, borderRadius: "10px", background: "#ffffff", border: "1px solid var(--border-default)" }}>←</button>
                    <span style={{ minWidth: "140px", textAlign: "center", fontWeight: 900, fontSize: "0.875rem", color: "var(--text-primary)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                        {mn[month]} {year}
                    </span>
                    <button className="btn btn-secondary" onClick={() => nav(1)} style={{ width: "36px", height: "36px", padding: 0, borderRadius: "10px", background: "#ffffff", border: "1px solid var(--border-default)" }}>→</button>
                </div>
                <button className="btn btn-primary" onClick={() => setShowPost(!showPost)} style={{
                    height: "48px",
                    padding: "0 24px",
                    borderRadius: "12px",
                    fontWeight: 800,
                    boxShadow: "0 10px 20px rgba(37, 99, 235, 0.15)"
                }}>
                    {showPost ? "Cancel Entry" : "Record New Payroll"}
                </button>
            </div>

            {err && (
                <div style={{
                    padding: "16px 20px",
                    background: "rgba(239, 68, 68, 0.04)",
                    color: "var(--status-overdue)",
                    borderRadius: "14px",
                    fontSize: "0.875rem",
                    fontWeight: 800,
                    border: "1px solid rgba(239, 68, 68, 0.15)",
                    boxShadow: "var(--shadow-sm)"
                }}>
                    {err}
                </div>
            )}

            {showPost && (
                <div className="section-card" style={{ padding: "var(--space-2xl)", background: "var(--bg-secondary)", border: "1px solid var(--border-default)", boxShadow: "var(--shadow-sm)" }}>
                    <h4 style={{ marginBottom: "var(--space-xl)", fontWeight: 800, fontSize: "1.25rem" }}>Initiate Payroll Transaction</h4>
                    <div className="form-grid" style={{ gridTemplateColumns: "3fr 1fr", gap: "var(--space-xl)" }}>
                        <div className="form-group">
                            <label className="form-label" style={{ fontWeight: 800, fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-tertiary)", marginBottom: "8px" }}>Recipient Faculty</label>
                            <select className="form-select" value={postStaffId} onChange={e => setPostStaffId(e.target.value)} style={{ height: "52px", borderRadius: "12px", fontSize: "1rem", fontWeight: 700, background: "#ffffff" }}>
                                <option value="">Select individual from register</option>
                                {staffList.map((s: SM) => <option key={s.id} value={s.id}>{s.firstName} {s.lastName} — {s.role}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label" style={{ fontWeight: 800, fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-tertiary)", marginBottom: "8px" }}>Deductions</label>
                            <input type="number" className="form-input" value={postDed} onChange={e => setPostDed(+e.target.value)} placeholder="0.00" style={{ height: "52px", borderRadius: "12px", fontSize: "1rem", fontWeight: 700, background: "#ffffff" }} />
                        </div>
                    </div>
                    <div style={{ marginTop: "var(--space-2xl)", display: "flex", justifyContent: "flex-end" }}>
                        <button className="btn btn-primary" disabled={!postStaffId || posting} onClick={handlePost} style={{ height: "52px", padding: "0 36px", borderRadius: "12px", fontWeight: 800, fontSize: "1rem" }}>
                            {posting ? "Authorizing..." : "Commit Transaction"}
                        </button>
                    </div>
                </div>
            )}

            <div className="section-card" style={{ background: "#ffffff", border: "1px solid var(--border-default)", boxShadow: "var(--shadow-sm)" }}>
                <div className="section-header" style={{ padding: "24px", background: "var(--bg-secondary)", borderBottom: "1px solid var(--border-default)" }}>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 800 }}>Distribution Registry</h3>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        Settlement Summary for Cycle {mn[month].toUpperCase()} {year}
                    </div>
                </div>
                <div className="data-table-wrapper" style={{ border: "none", borderRadius: 0, overflow: "visible" }}>
                    <table className="data-table">
                        <thead>
                            <tr style={{ background: "var(--bg-secondary)" }}>
                                <th style={{ paddingLeft: "24px" }}>Personnel Identity</th>
                                <th className="text-right">Gross Value</th>
                                <th className="text-right">Deductions</th>
                                <th className="text-right">Net Payable</th>
                                <th className="text-right">Settled</th>
                                <th className="text-right">Outstanding</th>
                                <th>Status</th>
                                <th style={{ textAlign: "right", paddingRight: "24px" }}>Interface</th>
                            </tr>
                        </thead>
                        <tbody>
                            {entries.length === 0 ? (
                                <tr>
                                    <td colSpan={8}>
                                        <div className="empty-state" style={{ padding: "var(--space-3xl)" }}>
                                            <p style={{ fontWeight: 800, fontSize: "1.125rem", color: "var(--text-primary)" }}>No payroll entries for this cycle</p>
                                            <p style={{ color: "var(--text-tertiary)", fontWeight: 500, marginTop: "4px" }}>Select faculty above to record a new transaction.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : entries.map((e: PE) => (
                                <tr key={e.id}>
                                    <td style={{ paddingLeft: "24px" }}>
                                        <div style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: "0.9375rem" }}>{e.staff?.firstName} {e.staff?.lastName}</div>
                                        <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", fontWeight: 700, marginTop: "2px" }}>{e.staff?.role}</div>
                                    </td>
                                    <td className="text-right font-mono" style={{ color: "var(--text-secondary)", fontWeight: 700, fontSize: "0.875rem" }}>₹{e.grossSalary.toLocaleString()}</td>
                                    <td className="text-right font-mono" style={{ color: "var(--status-overdue)", fontWeight: 700, fontSize: "0.875rem" }}>₹{e.deductions.toLocaleString()}</td>
                                    <td className="text-right font-mono" style={{ fontWeight: 900, fontSize: "1rem", color: "var(--text-primary)" }}>₹{e.netPayable.toLocaleString()}</td>
                                    <td className="text-right font-mono" style={{ color: "var(--status-paid)", fontWeight: 900, fontSize: "0.9375rem" }}>₹{e.paidAmount.toLocaleString()}</td>
                                    <td className="text-right font-mono" style={{
                                        color: e.pendingBalance > 0 ? "var(--status-overdue)" : "var(--status-paid)",
                                        fontWeight: 900,
                                        fontSize: "1rem"
                                    }}>
                                        ₹{e.pendingBalance.toLocaleString()}
                                    </td>
                                    <td>
                                        <span style={{
                                            background: e.pendingBalance <= 0 ? "var(--status-paid-bg)" : e.paidAmount > 0 ? "var(--status-partial-bg)" : "var(--status-pending-bg)",
                                            color: e.pendingBalance <= 0 ? "var(--status-paid)" : e.paidAmount > 0 ? "var(--status-partial)" : "var(--text-tertiary)",
                                            fontWeight: 900,
                                            fontSize: "0.625rem",
                                            textTransform: "uppercase",
                                            padding: "5px 14px",
                                            borderRadius: "100px",
                                            letterSpacing: "0.06em",
                                            border: e.pendingBalance <= 0 ? "1px solid rgba(16, 185, 129, 0.2)" : e.paidAmount > 0 ? "1px solid rgba(245, 158, 11, 0.2)" : "1px solid var(--border-default)"
                                        }}>
                                            {e.pendingBalance <= 0 ? "Settled" : e.paidAmount > 0 ? "Partial" : "Arrears"}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: "right", paddingRight: "24px" }}>
                                        {e.pendingBalance > 0 && (
                                            <button className="btn btn-secondary btn-sm" onClick={() => { setPayId(e.id); setPayAmt(e.pendingBalance); }} style={{
                                                height: "36px",
                                                padding: "0 18px",
                                                fontWeight: 800,
                                                borderRadius: "10px",
                                                background: "var(--bg-secondary)",
                                                border: "1px solid var(--border-default)",
                                                fontSize: "0.8125rem"
                                            }}>
                                                Settle
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {payId && (
                <div className="modal-overlay" style={{
                    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                    background: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(12px)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    zIndex: 100
                }} onClick={() => setPayId(null)}>
                    <div className="section-card" style={{ width: "100%", maxWidth: "440px", padding: "32px", border: "1px solid var(--border-default)", boxShadow: "0 32px 64px rgba(0,0,0,0.15)", background: "#ffffff", borderRadius: "24px" }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px", alignItems: "center" }}>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <h3 style={{ fontWeight: 800, fontSize: "1.5rem", letterSpacing: "-0.02em" }}>Record Settlement</h3>
                                <p style={{ fontSize: "0.875rem", color: "var(--text-tertiary)", fontWeight: 500 }}>Confirm actual funds disbursement</p>
                            </div>
                            <button onClick={() => setPayId(null)} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-default)", width: "36px", height: "36px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-tertiary)", cursor: "pointer", fontWeight: 800, transition: "all 0.2s ease" }}>✕</button>
                        </div>
                        <div className="form-group" style={{ marginBottom: "32px" }}>
                            <label className="form-label" style={{ fontWeight: 800, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-tertiary)", marginBottom: "12px" }}>Disbursement Magnitude (INR)</label>
                            <input type="number" className="form-input" value={payAmt} onChange={e => setPayAmt(+e.target.value)} style={{ fontSize: "2rem", fontWeight: 900, height: "80px", textAlign: "center", borderRadius: "18px", background: "var(--bg-secondary)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }} />
                        </div>
                        <div style={{ display: "flex", gap: "16px" }}>
                            <button className="btn btn-primary" style={{ flex: 1.6, height: "56px", borderRadius: "14px", fontWeight: 800, fontSize: "1.0625rem" }} disabled={paying || payAmt <= 0} onClick={handlePay}>
                                {paying ? "Authorizing..." : "Confirm Payout"}
                            </button>
                            <button className="btn btn-secondary" style={{ flex: 1, height: "56px", borderRadius: "14px", fontWeight: 700, fontSize: "1rem" }} onClick={() => setPayId(null)}>Discard</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
