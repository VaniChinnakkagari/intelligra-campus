import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
<<<<<<< HEAD
import { GlassPanel, StatusDot } from "@/components/Glass";
import { useTable } from "@/lib/api";
import { useState, useEffect } from "react";
import {
  AlertCircle, AlertTriangle, CheckCircle, Clock, ShieldAlert,
  Users, Building2, CalendarClock, Bus, Computer, ChevronDown,
  ChevronUp, XCircle, RefreshCw, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
=======
import { GlassPanel } from "@/components/Glass";
>>>>>>> 4ed5064e0872a8573dbceff1cf59df711efc6f87

export const Route = createFileRoute("/_authenticated/conflicts")({
  component: Page,
});

<<<<<<< HEAD
type Conflict = {
  id: string;
  conflict_type: string;
  severity: string;
  title: string;
  cause: string | null;
  affected: string[];
  ai_analysis: string | null;
  recommendation: string | null;
  status: string;
  created_at: string;
};

const SEVERITY_CONFIG: Record<string, { color: string; icon: React.ElementType }> = {
  critical: { color: "text-red-400 bg-red-400/10 border-red-400/30", icon: XCircle },
  high: { color: "text-orange-400 bg-orange-400/10 border-orange-400/30", icon: AlertCircle },
  medium: { color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30", icon: AlertTriangle },
  low: { color: "text-blue-400 bg-blue-400/10 border-blue-400/30", icon: ShieldAlert },
};

const TYPE_ICONS: Record<string, React.ElementType> = {
  classroom: Building2,
  faculty: Users,
  lab: Computer,
  resource: Computer,
  timetable: CalendarClock,
  transportation: Bus,
};

const STATUS_CONFIG: Record<string, string> = {
  resolved: "text-green-400 bg-green-400/10",
  open: "text-red-400 bg-red-400/10",
  investigating: "text-yellow-400 bg-yellow-400/10",
};

function Page() {
  const { data, isLoading, refetch } = useTable<Conflict>("conflicts", {
    order: "created_at",
    ascending: false,
  });
  const [expanded, setExpanded] = useState<string | null>(null);
  const [detecting, setDetecting] = useState(false);
  const [lastDetected, setLastDetected] = useState<Date | null>(null);

  // Auto-run detection on page load (once per session)
  useEffect(() => {
    const hasRun = sessionStorage.getItem("conflicts_detected");
    if (!hasRun) {
      runDetection(true);
      sessionStorage.setItem("conflicts_detected", "true");
    }
  }, []);

  const runDetection = async (silent: boolean = false) => {
    setDetecting(true);
    try {
      const { data: result, error } = await supabase.rpc("detect_all_conflicts");

      if (error) throw error;

      const summary = (result as any)?.[0];
      const found = summary?.conflicts_found ?? 0;
      const breakdown = summary?.detection_summary ?? "";

      if (!silent) {
        toast.success(`✅ Detected ${found} conflict${found === 1 ? "" : "s"}`, {
          description: breakdown,
        });
      } else {
        console.log(`[Auto-detect] ${found} conflicts · ${breakdown}`);
      }

      setLastDetected(new Date());
      refetch();
    } catch (err) {
      if (!silent) {
        toast.error("Detection failed", { description: String(err) });
      } else {
        console.error("[Auto-detect] Failed:", err);
      }
    } finally {
      setDetecting(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpanded(expanded === id ? null : id);
  };

  const markResolved = async (id: string) => {
    const { error } = await supabase
      .from("conflicts")
      .update({ status: "resolved" })
      .eq("id", id);

    if (error) {
      toast.error("Failed to resolve", { description: error.message });
    } else {
      toast.success("Conflict marked resolved");
      refetch();
    }
  };

  const getSeverityConfig = (severity: string) => {
    return SEVERITY_CONFIG[severity.toLowerCase()] || SEVERITY_CONFIG.low;
  };

  const getTypeIcon = (type: string) => {
    return TYPE_ICONS[type.toLowerCase()] || AlertCircle;
  };

  const getStatusColor = (status: string) => {
    return STATUS_CONFIG[status.toLowerCase()] || "text-gray-400 bg-gray-400/10";
  };

  const getConflictTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      classroom: "Classroom Conflict",
      faculty: "Faculty Conflict",
      lab: "Lab Conflict",
      resource: "Resource Conflict",
      timetable: "Timetable Conflict",
      transportation: "Transportation Conflict",
    };
    return labels[type.toLowerCase()] || type;
  };

  const isAutoDetected = (c: Conflict) =>
    c.ai_analysis?.startsWith("[AUTO-DETECTED]") ?? false;

  // Stats
  const conflicts = (data as Conflict[]) || [];
  const total = conflicts.length;
  const open = conflicts.filter((c) => c.status === "open").length;
  const resolved = conflicts.filter((c) => c.status === "resolved").length;
  const critical = conflicts.filter((c) => c.severity === "critical").length;
  const autoDetected = conflicts.filter(isAutoDetected).length;

  return (
    <div className="mx-auto w-full max-w-7xl">
      <PageHeader
        title="Campus Conflict Center"
        subtitle="Detected scheduling and resource conflicts with AI resolutions."
        actions={
          <Button
            onClick={() => runDetection(false)}
            disabled={detecting}
            className="gap-2 rounded-xl"
          >
            {detecting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <RefreshCw className="size-4" />
            )}
            {detecting ? "Detecting…" : "🔄 Detect Conflicts"}
          </Button>
        }
      />

      {/* Info banner */}
      <GlassPanel className="mb-4 p-3 text-xs text-muted-foreground">
        🤖 <strong>Auto-detection:</strong> The agent network scans your timetable,
        labs, resources and buses for conflicts. Detection runs automatically when this
        page loads.
        {lastDetected && (
          <span className="ml-2 text-primary">
            Last scan: {lastDetected.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata" })}
          </span>
        )}
      </GlassPanel>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <GlassPanel hover className="p-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <AlertCircle className="size-5 text-red-400" />
            <span className="text-2xl font-semibold">{total}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Total Conflicts</p>
        </GlassPanel>

        <GlassPanel hover className="p-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <Clock className="size-5 text-red-400" />
            <span className="text-2xl font-semibold">{open}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Open</p>
        </GlassPanel>

        <GlassPanel hover className="p-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <CheckCircle className="size-5 text-green-400" />
            <span className="text-2xl font-semibold">{resolved}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Resolved</p>
        </GlassPanel>

        <GlassPanel hover className="p-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <AlertTriangle className="size-5 text-red-400" />
            <span className="text-2xl font-semibold">{critical}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Critical</p>
        </GlassPanel>

        <GlassPanel hover className="p-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <ShieldAlert className="size-5 text-primary" />
            <span className="text-2xl font-semibold">{autoDetected}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Auto-Detected</p>
        </GlassPanel>
      </div>

      {/* Conflicts List */}
      <div className="mt-6 space-y-3">
        {isLoading ? (
          <GlassPanel className="p-12 text-center text-muted-foreground">
            Loading conflicts…
          </GlassPanel>
        ) : conflicts.length === 0 ? (
          <GlassPanel className="p-12 text-center text-muted-foreground">
            <CheckCircle className="mx-auto size-12 text-green-400 mb-3" />
            <p className="text-lg font-semibold">No conflicts detected</p>
            <p className="text-sm">The campus is running smoothly!</p>
          </GlassPanel>
        ) : (
          conflicts.map((conflict) => {
            const severityConfig = getSeverityConfig(conflict.severity);
            const SeverityIcon = severityConfig.icon;
            const TypeIcon = getTypeIcon(conflict.conflict_type);
            const isExpanded = expanded === conflict.id;
            const statusColor = getStatusColor(conflict.status);
            const isAuto = isAutoDetected(conflict);

            return (
              <GlassPanel
                key={conflict.id}
                hover
                className={cn("p-4 transition-all", isExpanded && "border-primary/50")}
              >
                <div
                  className="flex cursor-pointer items-start gap-3"
                  onClick={() => toggleExpand(conflict.id)}
                >
                  <div className={cn("rounded-lg p-2", severityConfig.color)}>
                    <SeverityIcon className="size-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{conflict.title}</h3>
                      <span className={cn("text-xs px-2 py-0.5 rounded-full", severityConfig.color)}>
                        {conflict.severity.toUpperCase()}
                      </span>
                      <span className={cn("text-xs px-2 py-0.5 rounded-full", statusColor)}>
                        {conflict.status.toUpperCase()}
                      </span>
                      {isAuto && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          🤖 AUTO
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <TypeIcon className="size-3" />
                        {getConflictTypeLabel(conflict.conflict_type)}
                      </span>
                      <span>·</span>
                      <span>{new Date(conflict.created_at).toLocaleDateString()}</span>
                      {conflict.affected && conflict.affected.length > 0 && (
                        <>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <Users className="size-3" />
                            {conflict.affected.length} affected
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <StatusDot status={conflict.status === "resolved" ? "available" : "busy"} />
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                      {isExpanded ? (
                        <ChevronUp className="size-4" />
                      ) : (
                        <ChevronDown className="size-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-4 space-y-3 border-t border-border/50 pt-4">
                    {conflict.cause && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground">Cause</p>
                        <p className="text-sm">{conflict.cause}</p>
                      </div>
                    )}

                    {conflict.affected && conflict.affected.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground">
                          Affected Entities
                        </p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {conflict.affected.map((item: string, i: number) => (
                            <span key={i} className="rounded bg-primary/10 px-2 py-1 text-xs">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {conflict.ai_analysis && (
                      <div className="rounded bg-primary/5 p-3">
                        <p className="text-xs font-semibold text-cyan-400">AI Analysis</p>
                        <p className="text-sm">
                          {conflict.ai_analysis.replace(/^\[AUTO-DETECTED\]\s*/, "")}
                        </p>
                      </div>
                    )}

                    {conflict.recommendation && (
                      <div className="rounded bg-green-400/5 p-3 border border-green-400/20">
                        <p className="text-xs font-semibold text-green-400">
                          AI Recommendation
                        </p>
                        <p className="text-sm">{conflict.recommendation}</p>
                      </div>
                    )}

                    {conflict.status !== "resolved" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="gap-1"
                          onClick={() => markResolved(conflict.id)}
                        >
                          <CheckCircle className="size-3.5" /> Mark Resolved
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </GlassPanel>
            );
          })
        )}
      </div>
    </div>
  );
}
=======
function Page() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <PageHeader title="Conflict Center" subtitle="Detected scheduling and resource conflicts with AI resolutions." />
      <GlassPanel level={2} className="p-6">
        <p className="text-sm text-muted-foreground">
          This module is wired to the campus database and agent pipeline.
        </p>
      </GlassPanel>
    </div>
  );
}
>>>>>>> 4ed5064e0872a8573dbceff1cf59df711efc6f87
