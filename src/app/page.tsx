import Link from "next/link";
import { getDashboardStats } from "@/actions/attendance";
import {
  GraduationCap,
  DollarSign,
  Users,
  CreditCard,
  AlertTriangle,
  UserPlus,
  FileText,
  ArrowRight,
} from "lucide-react";

export default async function Dashboard() {
  const result = await getDashboardStats();
  const stats = result.success ? (result.data as {
    totalStudents: number;
    totalStaff: number;
    outstandingFees: number;
    thisMonthCollections: number;
    pendingPayroll: number;
  }) : {
    totalStudents: 0,
    totalStaff: 0,
    outstandingFees: 0,
    thisMonthCollections: 0,
    pendingPayroll: 0,
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <div className="page-header" style={{ marginBottom: "var(--space-2xl)" }}>
        <div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800, letterSpacing: "-0.04em", color: "var(--text-primary)" }}>
            Institutional Intelligence
          </h1>
          <p style={{ color: "var(--text-tertiary)", fontWeight: 500, marginTop: "4px" }}>
            Real-time administrative operations and financial metrics
          </p>
        </div>
        <div style={{
          padding: "var(--space-sm) var(--space-xl)",
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-default)",
          borderRadius: "12px",
          fontSize: "0.875rem",
          fontWeight: 700,
          color: "var(--text-secondary)",
        }}>
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="card-grid" style={{ marginBottom: "var(--space-2xl)", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--space-xl)" }}>
        <div className="stat-tile" style={{ padding: "var(--space-xl)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-md)" }}>
            <div style={{ padding: "10px", background: "rgba(37, 99, 235, 0.08)", borderRadius: "12px", color: "var(--accent-primary)" }}>
              <Users size={24} />
            </div>
            <div style={{ fontSize: "0.6875rem", fontWeight: 800, background: "var(--status-paid-bg)", color: "var(--status-paid)", padding: "2px 8px", borderRadius: "100px" }}>+4.2%</div>
          </div>
          <span className="stat-label" style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Student Body</span>
          <span className="stat-value" style={{ fontSize: "2.25rem", fontWeight: 800, marginTop: "4px" }}>{stats.totalStudents}</span>
          <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginTop: "4px" }}>Enrolled beneficiaries</div>
        </div>

        <div className="stat-tile" style={{ padding: "var(--space-xl)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-md)" }}>
            <div style={{ padding: "10px", background: "rgba(239, 68, 68, 0.08)", borderRadius: "12px", color: "var(--status-overdue)" }}>
              <AlertTriangle size={24} />
            </div>
            <div style={{ fontSize: "0.6875rem", fontWeight: 800, background: "var(--status-overdue-bg)", color: "var(--status-overdue)", padding: "2px 8px", borderRadius: "100px" }}>Urgent</div>
          </div>
          <span className="stat-label" style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Fee Arrears</span>
          <span className="stat-value" style={{ fontSize: "2.25rem", fontWeight: 800, marginTop: "4px" }}>₹{stats.outstandingFees.toLocaleString()}</span>
          <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginTop: "4px" }}>Outstanding collection</div>
        </div>

        <div className="stat-tile" style={{ padding: "var(--space-xl)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-md)" }}>
            <div style={{ padding: "10px", background: "rgba(16, 185, 129, 0.08)", borderRadius: "12px", color: "var(--status-paid)" }}>
              <CreditCard size={24} />
            </div>
            <div style={{ fontSize: "0.6875rem", fontWeight: 800, background: "var(--status-paid-bg)", color: "var(--status-paid)", padding: "2px 8px", borderRadius: "100px" }}>On Track</div>
          </div>
          <span className="stat-label" style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Collections</span>
          <span className="stat-value" style={{ fontSize: "2.25rem", fontWeight: 800, marginTop: "4px" }}>₹{stats.thisMonthCollections.toLocaleString()}</span>
          <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginTop: "4px" }}>Current month revenue</div>
        </div>

        <div className="stat-tile" style={{ padding: "var(--space-xl)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-md)" }}>
            <div style={{ padding: "10px", background: "rgba(245, 158, 11, 0.08)", borderRadius: "12px", color: "var(--status-partial)" }}>
              <DollarSign size={24} />
            </div>
          </div>
          <span className="stat-label" style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Payroll Liability</span>
          <span className="stat-value" style={{ fontSize: "2.25rem", fontWeight: 800, marginTop: "4px" }}>₹{stats.pendingPayroll.toLocaleString()}</span>
          <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginTop: "4px" }}>Pending disbursements</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "var(--space-2xl)" }}>
        {/* Management Suite */}
        <div className="section-card" style={{ padding: "var(--space-2xl)" }}>
          <div className="section-header" style={{ marginBottom: "var(--space-xl)", padding: 0, border: "none" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 800 }}>Command Center</h3>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-lg)" }}>
            <Link href="/students/new" className="quick-link" style={{
              padding: "var(--space-xl)",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-default)",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              transition: "all 0.2s ease"
            }}>
              <div style={{ padding: "12px", background: "var(--bg-primary)", borderRadius: "12px", boxShadow: "0 4px 10px rgba(37, 99, 235, 0.1)" }}>
                <UserPlus size={24} color="var(--accent-primary)" />
              </div>
              <div style={{ marginLeft: "var(--space-lg)" }}>
                <div style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: "1.0625rem" }}>Student Intake</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", fontWeight: 500, marginTop: "2px" }}>Register new enrollment</div>
              </div>
            </Link>

            <Link href="/finance/collections" className="quick-link" style={{
              padding: "var(--space-xl)",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-default)",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              transition: "all 0.2s ease"
            }}>
              <div style={{ padding: "12px", background: "var(--bg-primary)", borderRadius: "12px", boxShadow: "0 4px 10px rgba(16, 185, 129, 0.1)" }}>
                <CreditCard size={24} color="var(--status-paid)" />
              </div>
              <div style={{ marginLeft: "var(--space-lg)" }}>
                <div style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: "1.0625rem" }}>Revenue Flow</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", fontWeight: 500, marginTop: "2px" }}>Process collections</div>
              </div>
            </Link>

            <Link href="/staff/new" className="quick-link" style={{
              padding: "var(--space-xl)",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-default)",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              transition: "all 0.2s ease"
            }}>
              <div style={{ padding: "12px", background: "var(--bg-primary)", borderRadius: "12px", boxShadow: "0 4px 10px rgba(15, 23, 42, 0.1)" }}>
                <GraduationCap size={24} color="var(--text-primary)" />
              </div>
              <div style={{ marginLeft: "var(--space-lg)" }}>
                <div style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: "1.0625rem" }}>Faculty Boarding</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", fontWeight: 500, marginTop: "2px" }}>Staff induction portal</div>
              </div>
            </Link>

            <Link href="/payroll" className="quick-link" style={{
              padding: "var(--space-xl)",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-default)",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              transition: "all 0.2s ease"
            }}>
              <div style={{ padding: "12px", background: "var(--bg-primary)", borderRadius: "12px", boxShadow: "0 4px 10px rgba(245, 158, 11, 0.1)" }}>
                <FileText size={24} color="var(--status-partial)" />
              </div>
              <div style={{ marginLeft: "var(--space-lg)" }}>
                <div style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: "1.0625rem" }}>Disbursements</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", fontWeight: 500, marginTop: "2px" }}>Execute payroll cycle</div>
              </div>
            </Link>
          </div>
        </div>

        {/* System Intelligence */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2xl)" }}>
          <div className="section-card" style={{ flex: 1, padding: "var(--space-xl)" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 800, marginBottom: "var(--space-lg)" }}>Operational Pulse</h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "var(--space-lg)", background: "var(--bg-secondary)", borderRadius: "12px", border: "1px solid var(--border-default)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
                  <Users size={18} color="var(--text-tertiary)" />
                  <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-secondary)" }}>Faculty Headcount</span>
                </div>
                <span style={{ fontSize: "1.125rem", fontWeight: 800, color: "var(--text-primary)" }}>{stats.totalStaff}</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "var(--space-lg)", background: "var(--bg-secondary)", borderRadius: "12px", border: "1px solid var(--border-default)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
                  <GraduationCap size={18} color="var(--text-tertiary)" />
                  <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-secondary)" }}>Undergrad Strength</span>
                </div>
                <span style={{ fontSize: "1.125rem", fontWeight: 800, color: "var(--text-primary)" }}>{stats.totalStudents}</span>
              </div>
            </div>

            <div style={{ marginTop: "var(--space-xl)", padding: "var(--space-xl)", background: "linear-gradient(135deg, rgba(37, 99, 235, 0.05), rgba(37, 99, 235, 0))", borderRadius: "16px", border: "1px solid rgba(37, 99, 235, 0.15)" }}>
              <div style={{ fontSize: "0.6875rem", fontWeight: 900, color: "var(--accent-primary)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.1em" }}>Intelligence Advisory</div>
              <div style={{ fontSize: "0.875rem", color: "var(--text-primary)", lineHeight: 1.6, fontWeight: 500 }}>
                High-priority arrears detected in several batches. Automated advisories have been dispatched to department heads.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


  );
}
