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
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div className="page-header" style={{ marginBottom: "var(--space-2xl)" }}>
                <div>
                    <h1 style={{ fontSize: "2.5rem", fontWeight: 800, letterSpacing: "-0.04em" }}>Revenue Ledger</h1>
                    <p style={{ color: "var(--text-tertiary)", fontWeight: 500, marginTop: "4px", fontSize: "1rem" }}>
                        Comprehensive audit of institutional financial inflows and settlements
                    </p>
                </div>
                <div style={{
                    padding: "20px 24px",
                    background: "var(--bg-secondary)",
                    borderRadius: "16px",
                    border: "1px solid var(--border-default)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    minWidth: "240px",
                    boxShadow: "var(--shadow-sm)"
                }}>
                    <span style={{ fontSize: "0.6875rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-tertiary)", marginBottom: "4px" }}>Aggregate Collections</span>
                    <span style={{ fontSize: "2rem", fontWeight: 900, color: "var(--status-paid)", lineHeight: 1 }}>
                        ₹{totalCollected.toLocaleString()}
                    </span>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", fontWeight: 600, marginTop: "8px" }}>Verified Institutional Revenue</div>
                </div>
            </div>

            <div className="section-card">
                <div className="section-header" style={{ padding: "0 var(--space-xl)" }}>
                    <CollectionsFilter courses={courses} />
                </div>
                <div className="data-table-wrapper" style={{ border: "none", borderRadius: 0 }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Settlement Date</th>
                                <th>Beneficiary Identity</th>
                                <th>Academic Track</th>
                                <th className="text-right">Transaction Magnitude</th>
                            </tr>
                        </thead>

                        <tbody>
                            {entries.length === 0 ? (
                                <tr>
                                    <td colSpan={4}>
                                        <div className="empty-state" style={{ padding: "var(--space-3xl)" }}>
                                            <p style={{ fontWeight: 800, fontSize: "1.125rem", color: "var(--text-primary)" }}>No records discovered</p>
                                            <p style={{ color: "var(--text-tertiary)", fontWeight: 500, marginTop: "4px" }}>Adjust your filter parameters to broaden the search scope.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                entries.map((entry: PaymentEntry) => {
                                    const meta = entry.meta ? JSON.parse(entry.meta) : {};
                                    return (
                                        <tr key={entry.id}>
                                            <td style={{ color: "var(--text-secondary)", fontWeight: 600 }}>
                                                {new Date(entry.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                            </td>
                                            <td>
                                                <div style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: "1rem" }}>{entry.student?.firstName} {entry.student?.lastName}</div>
                                                <div style={{ fontSize: "0.75rem", color: "var(--accent-primary)", fontWeight: 800, marginTop: "2px", letterSpacing: "0.02em" }}>{entry.student?.studentCode}</div>
                                            </td>
                                            <td style={{ color: "var(--text-secondary)", fontWeight: 600 }}>{entry.student?.course?.name}</td>
                                            <td className="text-right">
                                                <div style={{ fontWeight: 800, fontSize: "1.125rem", color: "var(--text-primary)" }}>₹{entry.amount.toLocaleString()}</div>
                                                {meta.paymentMode && (
                                                    <div style={{
                                                        fontSize: "0.625rem",
                                                        fontWeight: 900,
                                                        color: "var(--status-paid)",
                                                        textTransform: "uppercase",
                                                        letterSpacing: "0.08em",
                                                        marginTop: "4px",
                                                        background: "rgba(16, 185, 129, 0.05)",
                                                        padding: "2px 8px",
                                                        borderRadius: "100px",
                                                        display: "inline-block"
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
