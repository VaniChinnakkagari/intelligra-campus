import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Cpu, GraduationCap, Loader2, ShieldCheck, UserCog } from "lucide-react";
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
      { title: "Sign in — Nexus Campus AI" },
      { name: "description", content: "Role-aware sign-in for students, faculty and campus administrators." },
      { property: "og:title", content: "Sign in — Nexus Campus AI" },
      { property: "og:description", content: "Enter the Nexus smart campus as a student, faculty member or admin." },
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

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [role, setRole] = useState<Role>("faculty");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard" });
    });
  }, [navigate]);

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
      navigate({ to: "/dashboard" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Authentication failed";
      toast.error("Could not sign you in", { description: message });
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    try {
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
    } catch {
      toast.error("Google sign-in is not configured yet");
    }
  }

  async function forgot() {
    if (!email) return toast.error("Enter your email first");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth`,
    });
    if (error) toast.error(error.message);
    else toast.success("Reset link sent", { description: "Check your inbox." });
  }

  return (
    <main className="relative grid min-h-screen place-items-center px-4 py-14">
      <div className="w-full max-w-5xl">
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
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <GlassPanel level={3} className="p-7">
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
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@nexuscampus.edu"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    minLength={6}
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
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

                <Button type="submit" disabled={busy} className="w-full rounded-xl shadow-glow">
                  {busy ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                  {mode === "login" ? `LOGIN AS ${role.toUpperCase()}` : `CREATE ${role.toUpperCase()} ACCOUNT`}
                </Button>

                <Button type="button" variant="outline" onClick={google} className="w-full rounded-xl bg-transparent">
                  Continue with Google
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  Passwords are hashed and handled by the campus auth service — never stored locally.
                </p>
              </form>
            </GlassPanel>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
