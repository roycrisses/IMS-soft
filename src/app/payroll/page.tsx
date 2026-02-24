import { getPayrollReport } from "@/actions/payroll";
import { getStaffList } from "@/actions/staff";
import PayrollClient from "./PayrollClient";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PayrollEntry = any;

export default async function PayrollPage({
    searchParams,
}: {
    searchParams: Promise<{ month?: string; year?: string }>;
}) {
    const params = await searchParams;
    const now = new Date();
    const month = params.month ? parseInt(params.month) : now.getMonth() + 1;
    const year = params.year ? parseInt(params.year) : now.getFullYear();

    const [payrollResult, staffResult] = await Promise.all([
        getPayrollReport({ month, year }),
        getStaffList(),
    ]);

    const data = payrollResult.data as {
        entries: PayrollEntry[];
        totalGross: number;
        totalDeductions: number;
        totalPaid: number;
        totalPending: number;
    } | undefined;

    const entries = data?.entries || [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const staffList = (staffResult.data as any[]) || [];

    return (
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div className="page-header" style={{ marginBottom: "var(--space-2xl)" }}>
                <div>
                    <h1 style={{ fontSize: "2.5rem", fontWeight: 800, letterSpacing: "-0.04em", color: "var(--text-primary)" }}>Payroll Systems</h1>
                    <p style={{ color: "var(--text-tertiary)", fontWeight: 500, marginTop: "4px", fontSize: "1rem" }}>
                        Monthly salary distribution and deduction management
                    </p>
                </div>
            </div>

            {/* Summary Grid */}
            <div className="card-grid" style={{ marginBottom: "var(--space-2xl)", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--space-xl)" }}>
                <div className="stat-tile" style={{ padding: "var(--space-xl)", background: "#ffffff", border: "1px solid var(--border-default)" }}>
                    <span className="stat-label" style={{ fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "0.6875rem", color: "var(--text-tertiary)" }}>Gross Commitment</span>
                    <span className="stat-value" style={{ fontSize: "1.75rem", fontWeight: 900, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>₹{(data?.totalGross || 0).toLocaleString()}</span>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginTop: "6px", fontWeight: 600 }}>Total salary pool</div>
                </div>
                <div className="stat-tile" style={{ padding: "var(--space-xl)", background: "#ffffff", border: "1px solid var(--border-default)" }}>
                    <span className="stat-label" style={{ fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "0.6875rem", color: "var(--text-tertiary)" }}>Statutory Deductions</span>
                    <span className="stat-value" style={{ fontSize: "1.75rem", fontWeight: 900, color: "var(--status-partial)", letterSpacing: "-0.02em" }}>₹{(data?.totalDeductions || 0).toLocaleString()}</span>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginTop: "6px", fontWeight: 600 }}>Taxes & penalties</div>
                </div>
                <div className="stat-tile" style={{ padding: "var(--space-xl)", background: "#ffffff", border: "1px solid var(--border-default)" }}>
                    <span className="stat-label" style={{ fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "0.6875rem", color: "var(--text-tertiary)" }}>Disbursed Funds</span>
                    <span className="stat-value" style={{ fontSize: "1.75rem", fontWeight: 900, color: "var(--status-paid)", letterSpacing: "-0.02em" }}>₹{(data?.totalPaid || 0).toLocaleString()}</span>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginTop: "6px", fontWeight: 600 }}>Confirmed payments</div>
                </div>
                <div className="stat-tile" style={{
                    padding: "var(--space-xl)",
                    background: data?.totalPending && data.totalPending > 0 ? "rgba(239, 68, 68, 0.02)" : "rgba(16, 185, 129, 0.02)",
                    border: data?.totalPending && data.totalPending > 0 ? "1px solid rgba(239, 68, 68, 0.15)" : "1px solid rgba(16, 185, 129, 0.15)"
                }}>
                    <span className="stat-label" style={{ fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "0.6875rem", color: "var(--text-tertiary)" }}>Outstanding Payable</span>
                    <span className="stat-value" style={{
                        fontSize: "1.75rem",
                        fontWeight: 900,
                        color: data?.totalPending && data.totalPending > 0 ? "var(--status-overdue)" : "var(--status-paid)",
                        letterSpacing: "-0.02em"
                    }}>
                        ₹{(data?.totalPending || 0).toLocaleString()}
                    </span>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginTop: "6px", fontWeight: 600 }}>Pending reconciliation</div>
                </div>
            </div>




            <PayrollClient
                entries={entries}
                staffList={staffList}
                month={month}
                year={year}
            />
        </div>
    );
}
