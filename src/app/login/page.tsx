import { login } from "@/actions/auth";

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
            background: "#f8fafc",
            backgroundImage: "radial-gradient(at 0% 0%, rgba(37, 99, 235, 0.05) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(37, 99, 235, 0.05) 0px, transparent 50%)",
        }}>
            <div style={{
                width: "100%",
                maxWidth: "440px",
                padding: "48px",
                background: "#ffffff",
                borderRadius: "24px",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                border: "1px solid rgba(226, 232, 240, 0.8)",
                position: "relative",
                overflow: "hidden"
            }}>
                <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background: "var(--accent-primary)"
                }} />

                <div style={{ marginBottom: "40px", textAlign: "left" }}>
                    <div style={{
                        fontSize: "2rem",
                        fontWeight: 900,
                        color: "var(--text-primary)",
                        letterSpacing: "-0.05em",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginBottom: "8px"
                    }}>
                        <div style={{
                            width: "16px",
                            height: "16px",
                            borderRadius: "5px",
                            background: "var(--accent-primary)",
                            boxShadow: "0 4px 12px rgba(37, 99, 235, 0.4)",
                            transform: "rotate(45deg)",
                        }} />
                        Lumina<span style={{ color: "var(--accent-primary)" }}>MIS</span>
                    </div>
                    <p style={{ color: "var(--text-tertiary)", fontSize: "1rem", fontWeight: 600 }}>
                        Administrative System Authentication
                    </p>
                </div>

                <form style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    <div className="form-group" style={{ textAlign: "left" }}>
                        <label className="form-label" htmlFor="email" style={{ fontWeight: 800, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-secondary)", marginBottom: "8px", display: "block" }}>Institutional Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            className="form-input"
                            required
                            placeholder="e.g. administrator@lumina.edu"
                            style={{ height: "52px", borderRadius: "12px", background: "var(--bg-secondary)", fontSize: "0.9375rem", fontWeight: 600, border: "2px solid transparent", transition: "all 0.2s ease" }}
                        />
                    </div>

                    <div className="form-group" style={{ textAlign: "left" }}>
                        <label className="form-label" htmlFor="password" style={{ fontWeight: 800, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-secondary)", marginBottom: "8px", display: "block" }}>Security Passphrase</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            className="form-input"
                            required
                            placeholder="••••••••••••"
                            style={{ height: "52px", borderRadius: "12px", background: "var(--bg-secondary)", fontSize: "0.9375rem", fontWeight: 600, border: "2px solid transparent", transition: "all 0.2s ease" }}
                        />
                    </div>

                    {searchParams?.message && (
                        <div style={{
                            background: "var(--status-overdue-bg)",
                            color: "var(--status-overdue)",
                            padding: "16px",
                            borderRadius: "12px",
                            fontSize: "0.875rem",
                            fontWeight: 700,
                            border: "1px solid rgba(239, 68, 68, 0.15)",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px"
                        }}>
                            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "currentColor" }} />
                            {searchParams.message}
                        </div>
                    )}

                    <div style={{ marginTop: "8px" }}>
                        <button
                            formAction={login}
                            className="btn btn-primary"
                            style={{
                                width: "100%",
                                height: "56px",
                                borderRadius: "14px",
                                fontSize: "1rem",
                                fontWeight: 800,
                                boxShadow: "0 10px 20px -5px rgba(37, 99, 235, 0.3)",
                                background: "var(--accent-primary)",
                                transition: "transform 0.2s ease, box-shadow 0.2s ease"
                            }}
                        >
                            Authorize Access
                        </button>
                    </div>
                </form>

                <div style={{ marginTop: "40px", paddingTop: "32px", borderTop: "1px solid #f1f5f9" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", fontWeight: 700, textTransform: "uppercase" }}>v4.0.2 Stable</span>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", fontWeight: 700 }}>© 2026 Lumina Analytics</span>
                    </div>
                </div>
            </div>
        </div>


    );
}
