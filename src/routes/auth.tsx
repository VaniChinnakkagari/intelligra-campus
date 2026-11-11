import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
<<<<<<< HEAD
import {  GraduationCap, Loader2, ShieldCheck, UserCog } from "lucide-react";
=======
import { Cpu, GraduationCap, Loader2, ShieldCheck, UserCog } from "lucide-react";
>>>>>>> 4ed5064e0872a8573dbceff1cf59df711efc6f87
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
<<<<<<< HEAD
      { title: "Sign in — MITS Campus AI" },
      {
        name: "description",
        content: "Role-aware sign-in for MITS students, faculty and campus administrators.",
      },
      { property: "og:title", content: "Sign in — MITS Campus AI" },
      { property: "og:description", content: "Enter the MITS smart campus as a student, faculty member or admin." },
=======
      { title: "Sign in — Nexus Campus AI" },
      { name: "description", content: "Role-aware sign-in for students, faculty and campus administrators." },
      { property: "og:title", content: "Sign in — Nexus Campus AI" },
      { property: "og:description", content: "Enter the Nexus smart campus as a student, faculty member or admin." },
>>>>>>> 4ed5064e0872a8573dbceff1cf59df711efc6f87
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

<<<<<<< HEAD
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
=======
function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [role, setRole] = useState<Role>("faculty");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
>>>>>>> 4ed5064e0872a8573dbceff1cf59df711efc6f87
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard" });
    });
  }, [navigate]);

<<<<<<< HEAD
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
=======
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "register") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: { full_name: fullName || email.split("@")[0], role },
          },
        });
        if (error) throw error;
        toast.success("Campus account created", { description: "You are now signed in." });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back to Nexus Campus AI");
      }
>>>>>>> 4ed5064e0872a8573dbceff1cf59df711efc6f87
      navigate({ to: "/dashboard" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Authentication failed";
      toast.error("Could not sign you in", { description: message });
    } finally {
      setBusy(false);
    }
  }

<<<<<<< HEAD
=======
  async function google() {
    const { lovable } = await import("@/integrations/lovable/index");
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Google sign-in unavailable", { description: String(result.error) });
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/dashboard" });
  }

>>>>>>> 4ed5064e0872a8573dbceff1cf59df711efc6f87
  async function forgot() {
    if (!email) {
      toast.error("Enter your email first");
      return;
    }
<<<<<<< HEAD
    if (!isEmailAllowed(email, role)) {
      toast.error("Only MITS emails can reset passwords");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/settings`,
=======
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth`,
>>>>>>> 4ed5064e0872a8573dbceff1cf59df711efc6f87
    });
    if (error) toast.error(error.message);
    else toast.success("Reset link sent", { description: "Check your inbox." });
  }

  return (
    <main className="relative grid min-h-screen place-items-center px-4 py-14">
      <div className="w-full max-w-5xl">
<<<<<<< HEAD
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
=======
        <Link to="/" className="mb-8 flex items-center justify-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-primary/15 text-primary">
            <Cpu className="size-5" />
          </span>
          <span className="font-display text-base font-semibold">
            NEXUS <span className="text-primary">CAMPUS AI</span>
          </span>
        </Link>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.05fr] lg:items-center">
          <div>
            <h1 className="text-2xl font-semibold sm:text-3xl">How will you enter the campus?</h1>
>>>>>>> 4ed5064e0872a8573dbceff1cf59df711efc6f87
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
<<<<<<< HEAD

            {/* Info banner */}
            <GlassPanel className="mt-4 p-3 text-xs text-muted-foreground">
              🔒 <strong>MITS members only:</strong> Students and faculty must use their
              <code className="mx-1 rounded bg-primary/10 px-1 py-0.5 text-primary">@mits.ac.in</code>
              email. Accounts are issued by the admin.
            </GlassPanel>
=======
>>>>>>> 4ed5064e0872a8573dbceff1cf59df711efc6f87
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <GlassPanel level={3} className="p-7">
<<<<<<< HEAD
              <div className="rounded-xl bg-secondary/40 p-3 text-center">
                <p className="font-mono text-xs tracking-[0.2em] text-primary uppercase">
                  Sign In
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Use your MITS credentials to continue
                </p>
              </div>

              <form onSubmit={submit} className="mt-6 space-y-4">
=======
              <div className="flex gap-2 rounded-xl bg-secondary/40 p-1">
                {(["login", "register"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`flex-1 rounded-lg py-2 text-sm capitalize transition-all ${
                      mode === m ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {m === "login" ? "Login" : "Register"}
                  </button>
                ))}
              </div>

              <form onSubmit={submit} className="mt-6 space-y-4">
                {mode === "register" ? (
                  <div className="space-y-2">
                    <Label htmlFor="name">Full name</Label>
                    <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Dr. Neha Verma" />
                  </div>
                ) : null}
>>>>>>> 4ed5064e0872a8573dbceff1cf59df711efc6f87
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
<<<<<<< HEAD
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
=======
                    placeholder="you@nexuscampus.edu"
                  />
>>>>>>> 4ed5064e0872a8573dbceff1cf59df711efc6f87
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    minLength={6}
<<<<<<< HEAD
                    autoComplete="current-password"
=======
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
>>>>>>> 4ed5064e0872a8573dbceff1cf59df711efc6f87
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

<<<<<<< HEAD
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
=======
                <Button type="submit" disabled={busy} className="w-full rounded-xl shadow-glow">
                  {busy ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                  {mode === "login" ? `LOGIN AS ${role.toUpperCase()}` : `CREATE ${role.toUpperCase()} ACCOUNT`}
                </Button>

                <Button type="button" variant="outline" onClick={google} className="w-full rounded-xl bg-transparent">
                  Continue with Google
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  Passwords are hashed and handled by the campus auth service — never stored locally.
>>>>>>> 4ed5064e0872a8573dbceff1cf59df711efc6f87
                </p>
              </form>
            </GlassPanel>
          </motion.div>
        </div>
      </div>
    </main>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 4ed5064e0872a8573dbceff1cf59df711efc6f87
