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
        <div>
            <div className="page-header">
                <h1>Monthly Payroll</h1>
            </div>

            {/* Summary */}
            <div className="card-grid" style={{ marginBottom: "var(--space-xl)" }}>
                <div className="stat-tile">
                    <span className="stat-label">Total Gross</span>
                    <span className="stat-value">₹{(data?.totalGross || 0).toLocaleString()}</span>
                </div>
                <div className="stat-tile">
                    <span className="stat-label">Total Deductions</span>
                    <span className="stat-value">₹{(data?.totalDeductions || 0).toLocaleString()}</span>
                </div>
                <div className="stat-tile">
                    <span className="stat-label">Total Paid</span>
                    <span className="stat-value" style={{ color: "var(--status-paid)" }}>₹{(data?.totalPaid || 0).toLocaleString()}</span>
                </div>
                <div className="stat-tile">
                    <span className="stat-label">Pending</span>
                    <span className="stat-value" style={{ color: data?.totalPending && data.totalPending > 0 ? "var(--status-overdue)" : "inherit" }}>
                        ₹{(data?.totalPending || 0).toLocaleString()}
                    </span>
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
