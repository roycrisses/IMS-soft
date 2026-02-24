"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
    const supabase = await createClient();

    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password || typeof email !== "string" || typeof password !== "string") {
        redirect(`/login?message=${encodeURIComponent("Email and password are required and must be valid strings.")}`);
    }

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        redirect(`/login?message=${encodeURIComponent(error.message)}`);
    }

    revalidatePath("/", "layout");
    redirect("/");
}

export async function signOut() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath("/", "layout");
    redirect("/login");
}
