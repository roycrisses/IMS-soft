import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";

export const metadata: Metadata = {
  title: "InstituteMIS — Management System",
  description: "Institute Management System for student, financial, and staff management.",
};

import { createClient } from "@/lib/supabase/server";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          {user && <Sidebar />}
          <div className="main-area" style={{ marginLeft: user ? "var(--sidebar-width)" : 0 }}>
            {user && <TopBar />}
            <main className={user ? "page-content" : ""}>
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}

