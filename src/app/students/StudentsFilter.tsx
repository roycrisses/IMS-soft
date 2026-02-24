"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useState, useCallback } from "react";

interface Props {
    courses: { id: string; name: string }[];
    batches: { id: string; name: string }[];
}

export default function StudentsFilter({ courses, batches }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [search, setSearch] = useState(searchParams.get("search") || "");

    const updateParams = useCallback(
        (key: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
            params.delete("page");
            router.push(`/students?${params.toString()}`);
        },
        [router, searchParams]
    );

    const handleSearch = () => {
        updateParams("search", search);
    };

    return (
        <div className="filters-row" style={{ display: "flex", gap: "12px", alignItems: "center", width: "100%" }}>
            <div className="search-bar" style={{
                flex: 1,
                maxWidth: "400px",
                background: "#ffffff",
                border: "1px solid var(--border-default)",
                borderRadius: "10px",
                padding: "0 16px",
                height: "44px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                transition: "all 0.2s ease",
            }}>
                <Search size={18} style={{ color: "var(--text-tertiary)" }} />
                <input
                    placeholder="Search name, code, or mobile..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    style={{
                        background: "transparent",
                        border: "none",
                        width: "100%",
                        height: "100%",
                        outline: "none",
                        fontSize: "0.875rem",
                        color: "var(--text-primary)",
                        fontWeight: 700
                    }}
                />
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
                <select
                    className="form-select"
                    value={searchParams.get("courseId") || ""}
                    onChange={(e) => updateParams("courseId", e.target.value)}
                    style={{
                        height: "44px",
                        minWidth: "200px",
                        background: "#ffffff",
                        borderRadius: "10px",
                        fontSize: "0.84rem",
                        fontWeight: 800,
                        border: "1px solid var(--border-default)",
                        padding: "0 12px",
                        color: "var(--text-secondary)"
                    }}
                >
                    <option value="">Selection Framework: All</option>
                    {courses.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>

                <select
                    className="form-select"
                    value={searchParams.get("batchId") || ""}
                    onChange={(e) => updateParams("batchId", e.target.value)}
                    style={{
                        height: "44px",
                        minWidth: "200px",
                        background: "#ffffff",
                        borderRadius: "10px",
                        fontSize: "0.84rem",
                        fontWeight: 800,
                        border: "1px solid var(--border-default)",
                        padding: "0 12px",
                        color: "var(--text-secondary)"
                    }}
                >
                    <option value="">Academic Cohort: All</option>
                    {batches.map((b) => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}

