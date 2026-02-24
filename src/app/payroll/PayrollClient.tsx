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
        <div>
            <div className="flex items-center justify-between mb-lg">
                <div className="flex items-center gap-md">
                    <button className="btn btn-secondary btn-sm" onClick={() => nav(-1)}>←</button>
                    <h3>{mn[month]} {year}</h3>
                    <button className="btn btn-secondary btn-sm" onClick={() => nav(1)}>→</button>
                </div>
                <button className="btn btn-primary btn-sm" onClick={() => setShowPost(!showPost)}>Post Payroll</button>
            </div>

            {err && <div style={{ padding: 8, background: "var(--status-overdue-bg)", color: "var(--status-overdue)", borderRadius: 6, fontSize: "0.875rem", marginBottom: 12 }}>{err}</div>}

            {showPost && (
                <div className="card mb-lg">
                    <h4 style={{ marginBottom: 12 }}>Post Payroll — {mn[month]} {year}</h4>
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Staff *</label>
                            <select className="form-select" value={postStaffId} onChange={e => setPostStaffId(e.target.value)}>
                                <option value="">Select</option>
                                {staffList.map((s: SM) => <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Deductions</label>
                            <input type="number" className="form-input" value={postDed} onChange={e => setPostDed(+e.target.value)} />
                        </div>
                    </div>
                    <button className="btn btn-primary btn-sm mt-md" disabled={!postStaffId || posting} onClick={handlePost}>{posting ? "..." : "Post"}</button>
                </div>
            )}

            <div className="data-table-wrapper">
                <table className="data-table">
                    <thead><tr><th>Staff</th><th>Role</th><th className="text-right">Gross</th><th className="text-right">Ded.</th><th className="text-right">Net</th><th className="text-right">Paid</th><th className="text-right">Pending</th><th>Status</th><th></th></tr></thead>
                    <tbody>
                        {entries.length === 0 ? (
                            <tr><td colSpan={9}><div className="empty-state"><p>No entries</p></div></td></tr>
                        ) : entries.map((e: PE) => (
                            <tr key={e.id}>
                                <td style={{ fontWeight: 500 }}>{e.staff?.firstName} {e.staff?.lastName}</td>
                                <td className="text-muted">{e.staff?.role}</td>
                                <td className="text-right font-mono">₹{e.grossSalary.toLocaleString()}</td>
                                <td className="text-right font-mono">₹{e.deductions.toLocaleString()}</td>
                                <td className="text-right font-mono">₹{e.netPayable.toLocaleString()}</td>
                                <td className="text-right font-mono" style={{ color: "var(--status-paid)" }}>₹{e.paidAmount.toLocaleString()}</td>
                                <td className="text-right font-mono" style={{ color: e.pendingBalance > 0 ? "var(--status-overdue)" : "inherit" }}>₹{e.pendingBalance.toLocaleString()}</td>
                                <td><span className={`status-pill ${e.pendingBalance <= 0 ? "paid" : e.paidAmount > 0 ? "partial" : "pending"}`}>{e.pendingBalance <= 0 ? "Paid" : e.paidAmount > 0 ? "Partial" : "Pending"}</span></td>
                                <td>{e.pendingBalance > 0 && <button className="btn btn-ghost btn-sm" onClick={() => { setPayId(e.id); setPayAmt(e.pendingBalance); }}>Pay</button>}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {payId && (
                <div className="modal-overlay" onClick={() => setPayId(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header"><h3>Record Payment</h3><button className="btn btn-ghost btn-sm" onClick={() => setPayId(null)}>✕</button></div>
                        <div className="form-group mb-lg">
                            <label className="form-label">Amount</label>
                            <input type="number" className="form-input" value={payAmt} onChange={e => setPayAmt(+e.target.value)} />
                        </div>
                        <div className="flex gap-md">
                            <button className="btn btn-primary" disabled={paying || payAmt <= 0} onClick={handlePay}>{paying ? "..." : "Pay"}</button>
                            <button className="btn btn-secondary" onClick={() => setPayId(null)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
