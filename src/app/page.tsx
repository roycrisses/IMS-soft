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
    <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
      <div className="page-header" style={{ marginBottom: "var(--space-2xl)" }}>
        <div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800, letterSpacing: "-0.04em", color: "var(--text-primary)" }}>
            Institutional Intelligence
          </h1>
          <p style={{ color: "var(--text-tertiary)", fontWeight: 500, marginTop: "4px", fontSize: "1.0625rem" }}>
            Real-time administrative operations and financial metrics
          </p>
        </div>
        <div style={{
          padding: "12px 24px",
          background: "#ffffff",
          border: "1px solid var(--border-default)",
          borderRadius: "14px",
          fontSize: "0.875rem",
          fontWeight: 800,
          color: "var(--text-primary)",
          boxShadow: "var(--shadow-sm)",
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--status-paid)" }}></div>
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          }).toUpperCase()}
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="card-grid" style={{ marginBottom: "var(--space-2xl)", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--space-xl)" }}>
        <div className="stat-tile" style={{ padding: "var(--space-xl)", background: "#ffffff", border: "1px solid var(--border-default)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-md)" }}>
            <div style={{ padding: "12px", background: "rgba(37, 99, 235, 0.04)", borderRadius: "14px", color: "var(--accent-primary)", border: "1px solid rgba(37, 99, 235, 0.1)" }}>
              <Users size={22} strokeWidth={2.5} />
            </div>
            <div style={{ fontSize: "0.625rem", fontWeight: 900, background: "var(--status-paid-bg)", color: "var(--status-paid)", padding: "4px 10px", borderRadius: "100px", textTransform: "uppercase", letterSpacing: "0.05em" }}>+4.2%</div>
          </div>
          <span className="stat-label" style={{ fontSize: "0.6875rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-tertiary)" }}>Student Body</span>
          <span className="stat-value" style={{ fontSize: "2.5rem", fontWeight: 900, marginTop: "6px", color: "var(--text-primary)", letterSpacing: "-0.02em" }}>{stats.totalStudents}</span>
          <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginTop: "8px", fontWeight: 600 }}>Enrolled beneficiaries</div>
        </div>

        <div className="stat-tile" style={{ padding: "var(--space-xl)", background: "#ffffff", border: "1px solid var(--border-default)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-md)" }}>
            <div style={{ padding: "12px", background: "rgba(239, 68, 68, 0.04)", borderRadius: "14px", color: "var(--status-overdue)", border: "1px solid rgba(239, 68, 68, 0.1)" }}>
              <AlertTriangle size={22} strokeWidth={2.5} />
            </div>
            <div style={{ fontSize: "0.625rem", fontWeight: 900, background: "var(--status-overdue-bg)", color: "var(--status-overdue)", padding: "4px 10px", borderRadius: "100px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Urgent</div>
          </div>
          <span className="stat-label" style={{ fontSize: "0.6875rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-tertiary)" }}>Fee Arrears</span>
          <span className="stat-value" style={{ fontSize: "2.5rem", fontWeight: 900, marginTop: "6px", color: "var(--status-overdue)", letterSpacing: "-0.02em" }}>₹{stats.outstandingFees.toLocaleString()}</span>
          <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginTop: "8px", fontWeight: 600 }}>Outstanding collection</div>
        </div>

        <div className="stat-tile" style={{ padding: "var(--space-xl)", background: "#ffffff", border: "1px solid var(--border-default)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-md)" }}>
            <div style={{ padding: "12px", background: "rgba(16, 185, 129, 0.04)", borderRadius: "14px", color: "var(--status-paid)", border: "1px solid rgba(16, 185, 129, 0.1)" }}>
              <CreditCard size={22} strokeWidth={2.5} />
            </div>
            <div style={{ fontSize: "0.625rem", fontWeight: 900, background: "var(--status-paid-bg)", color: "var(--status-paid)", padding: "4px 10px", borderRadius: "100px", textTransform: "uppercase", letterSpacing: "0.05em" }}>On Track</div>
          </div>
          <span className="stat-label" style={{ fontSize: "0.6875rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-tertiary)" }}>Collections</span>
          <span className="stat-value" style={{ fontSize: "2.5rem", fontWeight: 900, marginTop: "6px", color: "var(--status-paid)", letterSpacing: "-0.02em" }}>₹{stats.thisMonthCollections.toLocaleString()}</span>
          <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginTop: "8px", fontWeight: 600 }}>Current month revenue</div>
        </div>

        <div className="stat-tile" style={{ padding: "var(--space-xl)", background: "#ffffff", border: "1px solid var(--border-default)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-md)" }}>
            <div style={{ padding: "12px", background: "rgba(245, 158, 11, 0.04)", borderRadius: "14px", color: "var(--status-partial)", border: "1px solid rgba(245, 158, 11, 0.1)" }}>
              <DollarSign size={22} strokeWidth={2.5} />
            </div>
          </div>
          <span className="stat-label" style={{ fontSize: "0.6875rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-tertiary)" }}>Payroll Liability</span>
          <span className="stat-value" style={{ fontSize: "2.5rem", fontWeight: 900, marginTop: "6px", color: "var(--text-primary)", letterSpacing: "-0.02em" }}>₹{stats.pendingPayroll.toLocaleString()}</span>
          <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginTop: "8px", fontWeight: 600 }}>Pending disbursements</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "var(--space-2xl)" }}>
        {/* Management Suite */}
        <div className="section-card" style={{ padding: "var(--space-2xl)", background: "#ffffff", border: "1px solid var(--border-default)", boxShadow: "var(--shadow-sm)" }}>
          <div className="section-header" style={{ marginBottom: "var(--space-2xl)", padding: 0, border: "none" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 800 }}>Command Center</h3>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-xl)" }}>
            <Link href="/students/new" className="quick-link" style={{
              padding: "var(--space-xl)",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-default)",
              borderRadius: "18px",
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            }}>
              <div style={{ padding: "14px", background: "#ffffff", borderRadius: "14px", boxShadow: "0 8px 16px rgba(37, 99, 235, 0.08)", border: "1px solid var(--border-default)" }}>
                <UserPlus size={24} color="var(--accent-primary)" strokeWidth={2.5} />
              </div>
              <div style={{ marginLeft: "var(--space-lg)" }}>
                <div style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: "1.0625rem" }}>Student Intake</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", fontWeight: 700, marginTop: "4px", textTransform: "uppercase", letterSpacing: "0.04em" }}>Register Entry</div>
              </div>
            </Link>

            <Link href="/finance/collections" className="quick-link" style={{
              padding: "var(--space-xl)",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-default)",
              borderRadius: "18px",
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            }}>
              <div style={{ padding: "14px", background: "#ffffff", borderRadius: "14px", boxShadow: "0 8px 16px rgba(16, 185, 129, 0.08)", border: "1px solid var(--border-default)" }}>
                <CreditCard size={24} color="var(--status-paid)" strokeWidth={2.5} />
              </div>
              <div style={{ marginLeft: "var(--space-lg)" }}>
                <div style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: "1.0625rem" }}>Revenue Flow</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", fontWeight: 700, marginTop: "4px", textTransform: "uppercase", letterSpacing: "0.04em" }}>Process funds</div>
              </div>
            </Link>

            <Link href="/staff/new" className="quick-link" style={{
              padding: "var(--space-xl)",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-default)",
              borderRadius: "18px",
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            }}>
              <div style={{ padding: "14px", background: "#ffffff", borderRadius: "14px", boxShadow: "0 8px 16px rgba(15, 23, 42, 0.08)", border: "1px solid var(--border-default)" }}>
                <GraduationCap size={24} color="var(--text-primary)" strokeWidth={2.5} />
              </div>
              <div style={{ marginLeft: "var(--space-lg)" }}>
                <div style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: "1.0625rem" }}>Faculty Boarding</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", fontWeight: 700, marginTop: "4px", textTransform: "uppercase", letterSpacing: "0.04em" }}>Onboard Personnel</div>
              </div>
            </Link>

            <Link href="/payroll" className="quick-link" style={{
              padding: "var(--space-xl)",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-default)",
              borderRadius: "18px",
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            }}>
              <div style={{ padding: "14px", background: "#ffffff", borderRadius: "14px", boxShadow: "0 8px 16px rgba(245, 158, 11, 0.08)", border: "1px solid var(--border-default)" }}>
                <FileText size={24} color="var(--status-partial)" strokeWidth={2.5} />
              </div>
              <div style={{ marginLeft: "var(--space-lg)" }}>
                <div style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: "1.0625rem" }}>Disbursements</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", fontWeight: 700, marginTop: "4px", textTransform: "uppercase", letterSpacing: "0.04em" }}>Execute cycle</div>
              </div>
            </Link>
          </div>
        </div>

        {/* System Intelligence */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2xl)" }}>
          <div className="section-card" style={{ flex: 1, padding: "var(--space-2xl)", background: "#ffffff", border: "1px solid var(--border-default)", boxShadow: "var(--shadow-sm)" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 900, marginBottom: "var(--space-xl)", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-tertiary)" }}>Operational Pulse</h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px", background: "var(--bg-secondary)", borderRadius: "16px", border: "1px solid var(--border-default)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent-primary)" }}></div>
                  <span style={{ fontSize: "0.9375rem", fontWeight: 800, color: "var(--text-secondary)" }}>Faculty Headcount</span>
                </div>
                <span style={{ fontSize: "1.25rem", fontWeight: 900, color: "var(--text-primary)" }}>{stats.totalStaff}</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px", background: "var(--bg-secondary)", borderRadius: "16px", border: "1px solid var(--border-default)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--status-paid)" }}></div>
                  <span style={{ fontSize: "0.9375rem", fontWeight: 800, color: "var(--text-secondary)" }}>Undergrad Strength</span>
                </div>
                <span style={{ fontSize: "1.25rem", fontWeight: 900, color: "var(--text-primary)" }}>{stats.totalStudents}</span>
              </div>
            </div>

            <div style={{ marginTop: "var(--space-2xl)", padding: "24px", background: "linear-gradient(135deg, rgba(37, 99, 235, 0.03), rgba(37, 99, 235, 0))", borderRadius: "20px", border: "1px solid rgba(37, 99, 235, 0.12)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <div style={{ padding: "6px", background: "rgba(37, 99, 235, 0.1)", borderRadius: "8px" }}>
                  <AlertTriangle size={14} color="var(--accent-primary)" strokeWidth={3} />
                </div>
                <div style={{ fontSize: "0.75rem", fontWeight: 900, color: "var(--accent-primary)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Intelligence Advisory</div>
              </div>
              <div style={{ fontSize: "0.9375rem", color: "var(--text-primary)", lineHeight: 1.6, fontWeight: 700, letterSpacing: "-0.01em" }}>
                High-priority arrears detected in several batches. Automated advisories have been dispatched to department heads.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


  );
}
