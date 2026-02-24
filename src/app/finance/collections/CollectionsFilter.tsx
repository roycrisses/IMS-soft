"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface Props {
    courses: { id: string; name: string }[];
}

export default function CollectionsFilter({ courses }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const updateParam = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) params.set(key, value);
        else params.delete(key);
        router.push(`/finance/collections?${params.toString()}`);
    };

    return (
        <div className="filters-row" style={{ display: "flex", gap: "var(--space-lg)", alignItems: "flex-end", width: "100%", paddingBottom: "var(--space-lg)" }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: "0.6875rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-tertiary)", marginBottom: "6px" }}>Period Start</label>
                <input
                    type="date"
                    className="form-input"
                    value={searchParams.get("startDate") || ""}
                    onChange={(e) => updateParam("startDate", e.target.value)}
                    style={{ width: 170, height: "44px", background: "var(--bg-secondary)", borderRadius: "12px", border: "1px solid var(--border-default)", fontWeight: 600 }}
                />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: "0.6875rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-tertiary)", marginBottom: "6px" }}>Period End</label>
                <input
                    type="date"
                    className="form-input"
                    value={searchParams.get("endDate") || ""}
                    onChange={(e) => updateParam("endDate", e.target.value)}
                    style={{ width: 170, height: "44px", background: "var(--bg-secondary)", borderRadius: "12px", border: "1px solid var(--border-default)", fontWeight: 600 }}
                />
            </div>
            <div className="form-group" style={{ marginBottom: 0, flex: 1, maxWidth: "280px" }}>
                <label className="form-label" style={{ fontSize: "0.6875rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-tertiary)", marginBottom: "6px" }}>Academic Program</label>
                <select
                    className="form-select"
                    value={searchParams.get("courseId") || ""}
                    onChange={(e) => updateParam("courseId", e.target.value)}
                    style={{ width: "100%", height: "44px", background: "var(--bg-secondary)", borderRadius: "12px", border: "1px solid var(--border-default)", fontWeight: 600, fontSize: "0.875rem" }}
                >
                    <option value="">All Academic Disciplines</option>
                    {courses.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
            </div>
        </div>


    );
}
