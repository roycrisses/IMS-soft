import Link from "next/link";
import { getDuesReport } from "@/actions/finance";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DueStudent = any;

export default async function DuesPage() {
    const result = await getDuesReport();
    const students = (result.data as DueStudent[]) || [];

    const totalDues = students.reduce((s: number, st: DueStudent) => s + st.balanceDue, 0);

    return (
        <div>
            <div className="page-header">
                <h1>Fee Dues</h1>
                <div className="stat-tile" style={{ padding: "var(--space-md) var(--space-lg)", minWidth: 180 }}>
                    <span className="stat-label">Total Outstanding</span>
                    <span className="stat-value" style={{ fontSize: "1.25rem", color: "var(--status-overdue)" }}>
                        ₹{totalDues.toLocaleString()}
                    </span>
                </div>
            </div>

            <div className="data-table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Student</th>
                            <th>Course</th>
                            <th>Batch</th>
                            <th>Contact</th>
                            <th className="text-right">Total Fee</th>
                            <th className="text-right">Paid</th>
                            <th className="text-right">Balance Due</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.length === 0 ? (
                            <tr>
                                <td colSpan={9}>
                                    <div className="empty-state"><p>No outstanding dues</p></div>
                                </td>
                            </tr>
                        ) : (
                            students.map((s: DueStudent) => (
                                <tr key={s.id}>
                                    <td className="font-mono">{s.studentCode}</td>
                                    <td style={{ fontWeight: 500 }}>{s.name}</td>
                                    <td>{s.course}</td>
                                    <td>{s.batch}</td>
                                    <td className="text-muted">{s.primaryPhone}</td>
                                    <td className="text-right font-mono">₹{s.totalCharged.toLocaleString()}</td>
                                    <td className="text-right font-mono" style={{ color: "var(--status-paid)" }}>₹{s.totalPaid.toLocaleString()}</td>
                                    <td className="text-right font-mono" style={{ fontWeight: 600, color: "var(--status-overdue)" }}>₹{s.balanceDue.toLocaleString()}</td>
                                    <td>
                                        <Link href={`/students/${s.id}`} className="btn btn-ghost btn-sm">
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
