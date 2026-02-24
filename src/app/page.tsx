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
          <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.04em", color: "var(--text-primary)" }}>
            Administrative Overview
          </h1>
          <p style={{ color: "var(--text-tertiary)", fontWeight: 500, marginTop: "4px" }}>
            Welcome back, System Administrator
          </p>
        </div>
        <div style={{
          padding: "var(--space-sm) var(--space-lg)",
          background: "var(--bg-primary)",
          border: "1px solid var(--border-default)",
          borderRadius: "var(--radius-md)",
          fontSize: "0.875rem",
          fontWeight: 600,
          color: "var(--text-secondary)",
          boxShadow: "var(--shadow-sm)"
        }}>
          {new Date().toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="card-grid" style={{ marginBottom: "var(--space-2xl)", gridTemplateColumns: "repeat(4, 1fr)" }}>
        <div className="stat-tile">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-sm)" }}>
            <div style={{ padding: "8px", background: "rgba(37, 99, 235, 0.08)", borderRadius: "10px", color: "var(--accent-primary)" }}>
              <Users size={20} />
            </div>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--status-paid)" }}>+12%</span>
          </div>
          <span className="stat-label">Enrollment</span>
          <span className="stat-value">{stats.totalStudents}</span>
        </div>

        <div className="stat-tile">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-sm)" }}>
            <div style={{ padding: "8px", background: "rgba(239, 68, 68, 0.08)", borderRadius: "10px", color: "var(--status-overdue)" }}>
              <AlertTriangle size={20} />
            </div>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--status-overdue)" }}>Critical</span>
          </div>
          <span className="stat-label">Fee Arrears</span>
          <span className="stat-value">₹{stats.outstandingFees.toLocaleString()}</span>
        </div>

        <div className="stat-tile">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-sm)" }}>
            <div style={{ padding: "8px", background: "rgba(16, 185, 129, 0.08)", borderRadius: "10px", color: "var(--status-paid)" }}>
              <CreditCard size={20} />
            </div>
          </div>
          <span className="stat-label">Collections</span>
          <span className="stat-value">₹{stats.thisMonthCollections.toLocaleString()}</span>
        </div>

        <div className="stat-tile">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-sm)" }}>
            <div style={{ padding: "8px", background: "rgba(245, 158, 11, 0.08)", borderRadius: "10px", color: "var(--status-partial)" }}>
              <DollarSign size={20} />
            </div>
          </div>
          <span className="stat-label">Payroll</span>
          <span className="stat-value">₹{stats.pendingPayroll.toLocaleString()}</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "var(--space-2xl)" }}>
        {/* Left Column: Quick Actions */}
        <div className="card" style={{ padding: "var(--space-2xl)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-xl)" }}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 700 }}>Management Suite</h3>
            <span style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", fontWeight: 600, textTransform: "uppercase" }}>Quick Actions</span>
          </div>
          <div className="quick-links" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <Link href="/students/new" className="quick-link" style={{ padding: "var(--space-xl)", background: "var(--bg-secondary)", border: "none" }}>
              <div style={{ padding: "10px", background: "var(--bg-primary)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-sm)" }}>
                <UserPlus size={20} color="var(--accent-primary)" />
              </div>
              <div style={{ marginLeft: "var(--space-md)" }}>
                <div style={{ fontWeight: 700 }}>New Student</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>Register enrollment</div>
              </div>
              <ArrowRight size={14} style={{ marginLeft: "auto", opacity: 0.4 }} />
            </Link>

            <Link href="/finance/collections" className="quick-link" style={{ padding: "var(--space-xl)", background: "var(--bg-secondary)", border: "none" }}>
              <div style={{ padding: "10px", background: "var(--bg-primary)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-sm)" }}>
                <CreditCard size={20} color="var(--status-paid)" />
              </div>
              <div style={{ marginLeft: "var(--space-md)" }}>
                <div style={{ fontWeight: 700 }}>Collections</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>Process incoming fees</div>
              </div>
              <ArrowRight size={14} style={{ marginLeft: "auto", opacity: 0.4 }} />
            </Link>

            <Link href="/staff/new" className="quick-link" style={{ padding: "var(--space-xl)", background: "var(--bg-secondary)", border: "none" }}>
              <div style={{ padding: "10px", background: "var(--bg-primary)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-sm)" }}>
                <GraduationCap size={20} color="var(--accent-navy)" />
              </div>
              <div style={{ marginLeft: "var(--space-md)" }}>
                <div style={{ fontWeight: 700 }}>Onboard Staff</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>Manage faculty profiles</div>
              </div>
              <ArrowRight size={14} style={{ marginLeft: "auto", opacity: 0.4 }} />
            </Link>

            <Link href="/payroll" className="quick-link" style={{ padding: "var(--space-xl)", background: "var(--bg-secondary)", border: "none" }}>
              <div style={{ padding: "10px", background: "var(--bg-primary)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-sm)" }}>
                <FileText size={20} color="var(--status-partial)" />
              </div>
              <div style={{ marginLeft: "var(--space-md)" }}>
                <div style={{ fontWeight: 700 }}>Payroll</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>Run monthly cycle</div>
              </div>
              <ArrowRight size={14} style={{ marginLeft: "auto", opacity: 0.4 }} />
            </Link>
          </div>
        </div>

        {/* Right Column: Inventory/Overview */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2xl)" }}>
          <div className="card" style={{ flex: 1 }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "var(--space-lg)" }}>Ecosystem Health</h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "var(--space-md)", background: "var(--bg-secondary)", borderRadius: "var(--radius-md)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
                  <Users size={16} color="var(--text-secondary)" />
                  <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>Active Faculty</span>
                </div>
                <span style={{ fontSize: "1rem", fontWeight: 800 }}>{stats.totalStaff}</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "var(--space-md)", background: "var(--bg-secondary)", borderRadius: "var(--radius-md)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
                  <GraduationCap size={16} color="var(--text-secondary)" />
                  <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>Student Base</span>
                </div>
                <span style={{ fontSize: "1rem", fontWeight: 800 }}>{stats.totalStudents}</span>
              </div>
            </div>

            <div style={{ marginTop: "var(--space-xl)", padding: "var(--space-lg)", background: "var(--accent-blue-light)", borderRadius: "var(--radius-md)", border: "1px solid rgba(37, 99, 235, 0.1)" }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--accent-primary)", marginBottom: "4px" }}>SYSTEM NOTIFICATION</div>
              <div style={{ fontSize: "0.8125rem", color: "var(--accent-navy)", lineHeight: 1.5, fontWeight: 500 }}>
                High volume detected in finance modules. Ensure all collections are verified by EOD.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}
