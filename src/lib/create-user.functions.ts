import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

/**
 * Admin-only server function to create a login account for a student or faculty.
 * Uses Supabase Admin API (service role).
 */
export const createUserAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: { email: string; name: string; role: "student" | "faculty" }) => data)
  .handler(async ({ data, context }) => {
    // 1. Verify the caller is an admin
    const { data: roleData } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .single();

    if (roleData?.role !== "admin") {
      throw new Error("Only admins can create user accounts.");
    }

    // 2. Validate email
    const email = data.email.toLowerCase().trim();
    if (!email.endsWith("@mits.ac.in")) {
      throw new Error("Only @mits.ac.in emails can be created.");
    }

    // 3. Check if account already exists
    const { data: existing } = await supabaseAdmin.auth.admin.listUsers();
    const alreadyExists = existing?.users?.some((u) => u.email === email);
    if (alreadyExists) {
      throw new Error(`Account already exists for ${email}.`);
    }

    // 4. Create the user with default password
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: "Reset1998",
      email_confirm: true,
      user_metadata: {
        full_name: data.name,
        role: data.role,
      },
    });

    if (createError) {
      throw new Error(createError.message);
    }

    return {
      success: true,
      userId: newUser.user?.id,
      email,
      password: "Reset1998",
    };
  });