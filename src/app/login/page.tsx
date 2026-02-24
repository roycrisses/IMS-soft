import { login, signup } from "@/actions/auth";

export default function LoginPage({
    searchParams,
}: {
    searchParams: { message: string };
}) {
    return (
        <div className="login-container" style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            background: "var(--bg-secondary)",
            backgroundImage: "radial-gradient(circle at 100% 0%, rgba(37, 99, 235, 0.05) 0%, transparent 50%), radial-gradient(circle at 0% 100%, rgba(37, 99, 235, 0.05) 0%, transparent 50%)",
        }}>
            <div className="card" style={{
                width: "100%",
                maxWidth: "400px",
                padding: "var(--space-2xl)",
                textAlign: "center",
                background: "var(--bg-primary)",
                boxShadow: "var(--shadow-lg)",
                border: "1px solid var(--border-default)",
            }}>
                <div style={{ marginBottom: "var(--space-2xl)" }}>
                    <div style={{
                        fontSize: "1.75rem",
                        fontWeight: 800,
                        color: "var(--text-primary)",
                        letterSpacing: "-0.04em",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                        marginBottom: "4px"
                    }}>
                        <div style={{
                            width: "14px",
                            height: "14px",
                            borderRadius: "4px",
                            background: "var(--accent-primary)",
                            boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
                            transform: "rotate(45deg)",
                        }} />
                        Lumina<span style={{ color: "var(--accent-primary)" }}>MIS</span>
                    </div>
                    <p style={{ color: "var(--text-tertiary)", fontSize: "0.875rem", fontWeight: 500 }}>
                        Administrative Access Portal
                    </p>
                </div>

                <form style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
                    <div className="form-group" style={{ textAlign: "left" }}>
                        <label className="form-label" htmlFor="email">Work Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            className="form-input"
                            required
                            placeholder="admin@lumina.edu"
                        />
                    </div>

                    <div className="form-group" style={{ textAlign: "left" }}>
                        <label className="form-label" htmlFor="password">Security Key</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            className="form-input"
                            required
                            placeholder="••••••••"
                        />
                    </div>

                    {searchParams?.message && (
                        <div style={{
                            background: "var(--status-overdue-bg)",
                            color: "var(--status-overdue)",
                            padding: "var(--space-sm)",
                            borderRadius: "var(--radius-md)",
                            fontSize: "0.8125rem",
                            border: "1px solid rgba(239, 68, 68, 0.1)"
                        }}>
                            {searchParams.message}
                        </div>
                    )}

                    <div style={{ display: "flex", alignSelf: "stretch", marginTop: "var(--space-md)", gap: "var(--space-md)" }}>
                        <button
                            formAction={login}
                            className="btn btn-primary"
                            style={{ flex: 1, boxShadow: "0 4px 14px rgba(37, 99, 235, 0.2)" }}
                        >
                            Sign In
                        </button>
                    </div>
                </form>

                <div style={{ marginTop: "var(--space-2xl)", paddingTop: "var(--space-xl)", borderTop: "1px solid var(--border-light)" }}>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", fontWeight: 500 }}>
                        Lumina Analytics — Enterprise Edition
                    </p>
                </div>
            </div>
        </div>

    );
}
