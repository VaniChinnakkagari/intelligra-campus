import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { GlassPanel } from "@/components/Glass";
import { usePrefs } from "@/hooks/usePrefs";
import { useSession, useRole } from "@/hooks/useAuth";
import { useState } from "react";
import {
  User, Lock, Palette, Zap, Volume2, Bell, Moon, Sun,
  Monitor, Eye, EyeOff, Check, X, Loader2, LogOut,
  Shield, Sparkles, Home, Mail, Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/settings")({
  component: Page,
});

function Page() {
  const { user } = useSession();
  const { data: role = "student" } = useRole(user);
  const { prefs, setPref } = usePrefs();
  const navigate = useNavigate();

  // Password change state
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  const changePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setSavingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error("Could not change password", { description: String(err) });
    } finally {
      setSavingPassword(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      <PageHeader
        title="Settings"
        subtitle="Profile, appearance, motion and 3D quality preferences."
      />

      {/* ─────── PROFILE ─────── */}
      <GlassPanel level={2} className="p-5 mb-4">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <User className="size-4 text-primary" />
          Profile
        </h3>

        <div className="flex items-start gap-4">
          <span className="grid size-16 place-items-center rounded-2xl bg-primary/15 text-primary text-2xl font-semibold shrink-0">
            {(user?.email ?? "U")[0]!.toUpperCase()}
          </span>
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-2">
              <Mail className="size-3.5 text-muted-foreground" />
              <span className="text-sm">{user?.email ?? "—"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="size-3.5 text-muted-foreground" />
              <span className="text-sm capitalize">Role: {role}</span>
              <span
                className={cn(
                  "rounded px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
                  role === "admin" && "bg-violet-400/15 text-violet-400",
                  role === "faculty" && "bg-cyan-400/15 text-cyan-400",
                  role === "student" && "bg-green-400/15 text-green-400"
                )}
              >
                {role}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="size-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Account created: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}
              </span>
            </div>
          </div>
        </div>
      </GlassPanel>

      {/* ─────── CHANGE PASSWORD ─────── */}
      <GlassPanel level={2} className="p-5 mb-4">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <Lock className="size-4 text-primary" />
          Change Password
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          If this is your first login, your default password was <code className="rounded bg-primary/10 px-1.5 py-0.5 text-primary">Reset1998</code>.
          Please change it now for security.
        </p>

        <div className="space-y-3">
          <div>
            <Label htmlFor="new-password" className="text-xs">New Password</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 6 chars)"
                className="bg-background/50 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <div>
            <Label htmlFor="confirm-password" className="text-xs">Confirm New Password</Label>
            <Input
              id="confirm-password"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="bg-background/50"
            />
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-xs text-destructive mt-1">Passwords do not match</p>
            )}
            {confirmPassword && newPassword === confirmPassword && newPassword.length >= 6 && (
              <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
                <Check className="size-3" /> Passwords match
              </p>
            )}
          </div>

          <Button
            onClick={changePassword}
            disabled={savingPassword || !newPassword || newPassword !== confirmPassword}
            className="w-full gap-2 rounded-xl"
          >
            {savingPassword ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Lock className="size-4" />
            )}
            Update Password
          </Button>
        </div>
      </GlassPanel>

      {/* ─────── APPEARANCE ─────── */}
      <GlassPanel level={2} className="p-5 mb-4">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <Palette className="size-4 text-primary" />
          Appearance
        </h3>

        <div className="space-y-4">
          {/* Theme */}
          <div>
            <Label className="text-xs mb-2 block">Theme</Label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "dark", label: "Dark", icon: Moon },
                { value: "light", label: "Light", icon: Sun },
                { value: "system", label: "System", icon: Monitor },
              ].map((opt) => {
                const Icon = opt.icon;
                const active = prefs.theme === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setPref("theme", opt.value as any)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition-all",
                      active
                        ? "border-primary/50 bg-primary/10 text-primary"
                        : "border-border/40 text-muted-foreground hover:border-primary/30"
                    )}
                  >
                    <Icon className="size-5" />
                    <span className="text-xs font-medium">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Motion */}
          <div>
            <Label className="text-xs mb-2 block">Animations</Label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: "full", label: "Full Motion" },
                { value: "reduced", label: "Reduced Motion" },
              ].map((opt) => {
                const active = prefs.motion === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setPref("motion", opt.value as any)}
                    className={cn(
                      "rounded-xl border-2 p-3 text-sm font-medium transition-all",
                      active
                        ? "border-primary/50 bg-primary/10 text-primary"
                        : "border-border/40 text-muted-foreground hover:border-primary/30"
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">
              Reduced motion disables animations for accessibility.
            </p>
          </div>

          {/* 3D Effects */}
          <div>
            <Label className="text-xs mb-2 block">3D Effects</Label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "on", label: "On" },
                { value: "reduced", label: "Reduced" },
                { value: "off", label: "Off" },
              ].map((opt) => {
                const active = prefs.effects3d === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setPref("effects3d", opt.value as any)}
                    className={cn(
                      "rounded-xl border-2 p-3 text-sm font-medium transition-all",
                      active
                        ? "border-primary/50 bg-primary/10 text-primary"
                        : "border-border/40 text-muted-foreground hover:border-primary/30"
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">
              3D effects automatically reduce on mobile devices.
            </p>
          </div>
        </div>
      </GlassPanel>

      {/* ─────── NOTIFICATIONS ─────── */}
      <GlassPanel level={2} className="p-5 mb-4">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <Bell className="size-4 text-primary" />
          Notifications & Sound
        </h3>

        <div className="space-y-3">
          <label className="flex items-center justify-between rounded-xl bg-primary/5 p-3 cursor-pointer">
            <div className="flex items-center gap-3">
              <Bell className="size-4 text-primary" />
              <div>
                <p className="text-sm font-medium">Enable Notifications</p>
                <p className="text-xs text-muted-foreground">Receive alerts from agents</p>
              </div>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={prefs.notifications}
                onChange={(e) => setPref("notifications", e.target.checked)}
                className="peer sr-only"
              />
              <div className="h-6 w-11 rounded-full bg-primary/20 peer-checked:bg-primary/60 transition-all">
                <div className="h-5 w-5 rounded-full bg-white shadow-md transition-all peer-checked:translate-x-5 translate-x-0.5 mt-0.5" />
              </div>
            </div>
          </label>

          <label className="flex items-center justify-between rounded-xl bg-primary/5 p-3 cursor-pointer">
            <div className="flex items-center gap-3">
              <Volume2 className="size-4 text-primary" />
              <div>
                <p className="text-sm font-medium">Sound Effects</p>
                <p className="text-xs text-muted-foreground">Play sounds on actions</p>
              </div>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={prefs.sound}
                onChange={(e) => setPref("sound", e.target.checked)}
                className="peer sr-only"
              />
              <div className="h-6 w-11 rounded-full bg-primary/20 peer-checked:bg-primary/60 transition-all">
                <div className="h-5 w-5 rounded-full bg-white shadow-md transition-all peer-checked:translate-x-5 translate-x-0.5 mt-0.5" />
              </div>
            </div>
          </label>
        </div>
      </GlassPanel>

      {/* ─────── SESSION ─────── */}
      <GlassPanel level={2} className="p-5 mb-4">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <LogOut className="size-4 text-primary" />
          Session
        </h3>
        <Button
          onClick={signOut}
          variant="outline"
          className="w-full gap-2 rounded-xl border-destructive/40 text-destructive hover:bg-destructive/10"
        >
          <LogOut className="size-4" />
          Sign Out
        </Button>
        <p className="text-[10px] text-muted-foreground text-center mt-2">
          You'll be redirected to the login page
        </p>
      </GlassPanel>

      {/* ─────── ABOUT ─────── */}
      <GlassPanel className="p-4 text-center text-xs text-muted-foreground">
        <Sparkles className="size-4 inline mr-1 text-primary" />
        <strong>MITS Campus AI</strong> · Multi-Agent Smart Campus Management System
        <br />
        <span className="text-[10px]">
          Madanapalle Institute of Technology & Science · Deemed to be University
        </span>
      </GlassPanel>
    </div>
  );
}