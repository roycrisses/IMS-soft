import { getCollectionsReport } from "@/actions/finance";
import { getCourses } from "@/actions/courses";
import CollectionsFilter from "./CollectionsFilter";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PaymentEntry = any;

export default async function CollectionsPage({
    searchParams,
}: {
    searchParams: Promise<{ startDate?: string; endDate?: string; courseId?: string }>;
}) {
    const params = await searchParams;
    const [collectionsResult, coursesResult] = await Promise.all([
        getCollectionsReport({
            startDate: params.startDate,
            endDate: params.endDate,
            courseId: params.courseId,
        }),
        getCourses(),
    ]);

    const data = collectionsResult.data as { entries: PaymentEntry[]; totalCollected: number } | undefined;
    const entries = data?.entries || [];
    const totalCollected = data?.totalCollected || 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const courses = (coursesResult.data as any[]) || [];

    return (
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <div className="page-header" style={{ marginBottom: "var(--space-2xl)" }}>
                <div>
                    <h1 style={{ fontSize: "2.5rem", fontWeight: 800, letterSpacing: "-0.04em", color: "var(--text-primary)" }}>Revenue Ledger</h1>
                    <p style={{ color: "var(--text-tertiary)", fontWeight: 500, marginTop: "4px", fontSize: "1.0625rem" }}>
                        Comprehensive audit of institutional financial inflows and settlements
                    </p>
                </div>
                <div style={{
                    padding: "24px",
                    background: "#ffffff",
                    borderRadius: "20px",
                    border: "1px solid var(--border-default)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    minWidth: "280px",
                    boxShadow: "var(--shadow-sm)"
                }}>
                    <span style={{ fontSize: "0.6875rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-tertiary)", marginBottom: "8px" }}>Aggregate Collections</span>
                    <span style={{ fontSize: "2.25rem", fontWeight: 900, color: "var(--status-paid)", lineHeight: 1, letterSpacing: "-0.02em" }}>
                        ₹{totalCollected.toLocaleString()}
                    </span>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", fontWeight: 700, marginTop: "12px", textTransform: "uppercase", letterSpacing: "0.04em" }}>Verified Institutional Revenue</div>
                </div>
            </div>

            <div className="section-card" style={{ background: "#ffffff", border: "1px solid var(--border-default)", boxShadow: "var(--shadow-sm)" }}>
                <div className="section-header" style={{ padding: "24px 32px", borderBottom: "1px solid var(--border-default)", background: "var(--bg-secondary)" }}>
                    <CollectionsFilter courses={courses} />
                </div>
                <div className="data-table-wrapper" style={{ border: "none", borderRadius: 0 }}>
                    <table className="data-table">
                        <thead>
                            <tr style={{ background: "var(--bg-secondary)" }}>
                                <th style={{ paddingLeft: "32px" }}>Settlement Date</th>
                                <th>Beneficiary Identity</th>
                                <th>Academic Track</th>
                                <th className="text-right" style={{ paddingRight: "32px" }}>Transaction Magnitude</th>
                            </tr>
                        </thead>

                        <tbody>
                            {entries.length === 0 ? (
                                <tr>
                                    <td colSpan={4}>
                                        <div className="empty-state" style={{ padding: "var(--space-3xl)" }}>
                                            <p style={{ fontWeight: 800, fontSize: "1.25rem", color: "var(--text-primary)" }}>No records discovered</p>
                                            <p style={{ color: "var(--text-tertiary)", fontWeight: 500, marginTop: "6px" }}>Adjust your filter parameters to broaden the search scope.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                entries.map((entry: PaymentEntry) => {
                                    const meta = entry.meta ? JSON.parse(entry.meta) : {};
                                    return (
                                        <tr key={entry.id}>
                                            <td style={{ paddingLeft: "32px", color: "var(--text-secondary)", fontWeight: 700 }}>
                                                {new Date(entry.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase()}
                                            </td>
                                            <td>
                                                <div style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: "1.0625rem" }}>{entry.student?.firstName} {entry.student?.lastName}</div>
                                                <div style={{ fontSize: "0.8125rem", color: "var(--accent-primary)", fontWeight: 800, marginTop: "4px", letterSpacing: "0.04em" }} className="font-mono">{entry.student?.studentCode}</div>
                                            </td>
                                            <td style={{ color: "var(--text-secondary)", fontWeight: 700 }}>{entry.student?.course?.name}</td>
                                            <td className="text-right" style={{ paddingRight: "32px" }}>
                                                <div style={{ fontWeight: 900, fontSize: "1.1875rem", color: "var(--text-primary)" }}>₹{entry.amount.toLocaleString()}</div>
                                                {meta.paymentMode && (
                                                    <div style={{
                                                        fontSize: "0.625rem",
                                                        fontWeight: 900,
                                                        color: "var(--status-paid)",
                                                        textTransform: "uppercase",
                                                        letterSpacing: "0.08em",
                                                        marginTop: "6px",
                                                        background: "var(--status-paid-bg)",
                                                        padding: "4px 10px",
                                                        borderRadius: "100px",
                                                        display: "inline-block",
                                                        border: "1px solid rgba(16, 185, 129, 0.2)"
                                                    }}>
                                                        Settled via {meta.paymentMode}
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>


    );
}
