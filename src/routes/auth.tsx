import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {  GraduationCap, Loader2, ShieldCheck, UserCog } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { GlassPanel } from "@/components/Glass";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { Role } from "@/hooks/useAuth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — MITS Campus AI" },
      {
        name: "description",
        content: "Role-aware sign-in for MITS students, faculty and campus administrators.",
      },
      { property: "og:title", content: "Sign in — MITS Campus AI" },
      { property: "og:description", content: "Enter the MITS smart campus as a student, faculty member or admin." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

const ROLES: { key: Role; label: string; icon: typeof GraduationCap; body: string }[] = [
  { key: "student", label: "STUDENT", icon: GraduationCap, body: "Timetable, labs, resources, transport and the campus assistant." },
  { key: "faculty", label: "FACULTY", icon: UserCog, body: "Courses, intelligent room and lab requests, AI recommendations." },
  { key: "admin", label: "ADMIN", icon: ShieldCheck, body: "Campus command centre, all modules, agents and analytics." },
];

// Only these domains can log in (except admin)
const ALLOWED_DOMAINS = ["@mits.ac.in"];
const ADMIN_EMAILS = ["vanichinnakkagari07@gmail.com"]; // add more if needed
const DEV_WHITELIST = [
  "vanichinnakkagari07@gmail.com",
  "vanichinnakkagari649@gmail.com",
  "vanichinnakkagari0708@gmail.com",
];
function AuthPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard" });
    });
  }, [navigate]);

 function isEmailAllowed(emailToCheck: string, selectedRole: Role): boolean {
  const normalized = emailToCheck.toLowerCase().trim();

  // DEV whitelist — allows testing with existing accounts
  if (DEV_WHITELIST.includes(normalized)) {
    return true;
  }

  // Admin can log in with any email in ADMIN_EMAILS
  if (selectedRole === "admin") {
    return ADMIN_EMAILS.includes(normalized);
  }

  // Students & Faculty must use @mits.ac.in emails
  return ALLOWED_DOMAINS.some((domain) => normalized.endsWith(domain));
}

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);

    try {
      // Check email domain
      if (!isEmailAllowed(email, role)) {
        if (role === "admin") {
          throw new Error("This email is not authorized as an administrator.");
        }
        throw new Error(
          "Access denied. Only MITS members (@mits.ac.in email) can log in."
        );
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      toast.success(`Welcome back to MITS Campus AI`);
      navigate({ to: "/dashboard" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Authentication failed";
      toast.error("Could not sign you in", { description: message });
    } finally {
      setBusy(false);
    }
  }

  async function forgot() {
    if (!email) {
      toast.error("Enter your email first");
      return;
    }
    if (!isEmailAllowed(email, role)) {
      toast.error("Only MITS emails can reset passwords");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/settings`,
    });
    if (error) toast.error(error.message);
    else toast.success("Reset link sent", { description: "Check your inbox." });
  }

  return (
    <main className="relative grid min-h-screen place-items-center px-4 py-14">
      <div className="w-full max-w-5xl">
      <Link to="/" className="mb-8 flex items-center justify-center gap-2.5">
  <img
    src="/ai-core.png"
    alt="MITS Campus AI"
    className="size-9 rounded-xl object-cover ring-1 ring-primary/30 shadow-glow"
  />
  <span className="font-display text-base font-semibold">
    MITS <span className="text-primary">CAMPUS AI</span>
  </span>
</Link>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.05fr] lg:items-center">
          <div>
            <h1 className="text-2xl font-semibold sm:text-3xl">How will you enter MITS?</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Your portal, sidebar and agent permissions adapt to the role you choose.
            </p>
            <div className="mt-5 grid gap-3">
              {ROLES.map((r) => (
                <button key={r.key} type="button" onClick={() => setRole(r.key)} className="text-left">
                  <GlassPanel
                    hover
                    level={role === r.key ? 3 : 1}
                    className={`flex items-start gap-4 p-4 ${role === r.key ? "border-primary/50 shadow-glow" : ""}`}
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/12 text-primary">
                      <r.icon className="size-5" />
                    </span>
                    <span>
                      <span className="font-mono text-xs tracking-[0.2em]">{r.label}</span>
                      <span className="mt-1 block text-sm text-muted-foreground">{r.body}</span>
                    </span>
                  </GlassPanel>
                </button>
              ))}
            </div>

            {/* Info banner */}
            <GlassPanel className="mt-4 p-3 text-xs text-muted-foreground">
              🔒 <strong>MITS members only:</strong> Students and faculty must use their
              <code className="mx-1 rounded bg-primary/10 px-1 py-0.5 text-primary">@mits.ac.in</code>
              email. Accounts are issued by the admin.
            </GlassPanel>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <GlassPanel level={3} className="p-7">
              <div className="rounded-xl bg-secondary/40 p-3 text-center">
                <p className="font-mono text-xs tracking-[0.2em] text-primary uppercase">
                  Sign In
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Use your MITS credentials to continue
                </p>
              </div>

              <form onSubmit={submit} className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={
                      role === "admin" ? "admin@mits.ac.in" : "yourname@mits.ac.in"
                    }
                  />
                  {email && !isEmailAllowed(email, role) && (
                    <p className="text-xs text-destructive">
                      {role === "admin"
                        ? "This email is not authorized as admin."
                        : "Only @mits.ac.in emails can log in."}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    minLength={6}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-muted-foreground">
                    <Checkbox checked={remember} onCheckedChange={(v) => setRemember(!!v)} />
                    Remember me
                  </label>
                  <button type="button" onClick={forgot} className="text-primary hover:underline">
                    Forgot password?
                  </button>
                </div>

                <Button
                  type="submit"
                  disabled={busy || !isEmailAllowed(email, role)}
                  className="w-full rounded-xl shadow-glow"
                >
                  {busy ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                  LOGIN AS {role.toUpperCase()}
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  Need an account? Contact the campus admin.
                  <br />
                  First-time users: use password <strong>Reset1998</strong>
                </p>
              </form>
            </GlassPanel>
          </motion.div>
        </div>
      </div>
    </main>
  );
}