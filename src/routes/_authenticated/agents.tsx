import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
<<<<<<< HEAD
import { GlassPanel, StatusDot } from "@/components/Glass";
import { useTable } from "@/lib/api";
import { useSession } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import {
  Network, Bot, GraduationCap, UserCog, Building2, CalendarClock,
  Boxes, Bus, ShieldAlert, Sparkles, Activity, Cpu, Play, X,
  CheckCircle, ArrowRight, Loader2, Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { runRealPipeline } from "@/lib/ai/agent-functions";
import { type RequestSpec } from "@/lib/engine";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
=======
import { GlassPanel } from "@/components/Glass";
>>>>>>> 4ed5064e0872a8573dbceff1cf59df711efc6f87

export const Route = createFileRoute("/_authenticated/agents")({
  component: Page,
});

<<<<<<< HEAD
const AGENT_ICONS: Record<string, any> = {
  coordinator: Network,
  student: GraduationCap,
  faculty: UserCog,
  classroom: Building2,
  timetable: CalendarClock,
  resource: Boxes,
  transportation: Bus,
  conflict: ShieldAlert,
  notification: Bot,
  admin: UserCog,
};

const AGENT_COLORS: Record<string, string> = {
  coordinator: "text-cyan-400",
  student: "text-blue-400",
  faculty: "text-violet-400",
  classroom: "text-cyan-400",
  timetable: "text-violet-400",
  resource: "text-green-400",
  transportation: "text-blue-400",
  conflict: "text-red-400",
  notification: "text-green-400",
  admin: "text-violet-400",
};

// The 8 stages shown in the UI — matches the REAL pipeline
const PIPELINE_STAGES = [
  { agent: "faculty",      title: "Faculty Agent",      task: "Validating request" },
  { agent: "coordinator",  title: "Coordinator Agent",  task: "Building task plan" },
  { agent: "classroom",    title: "Classroom Agent",    task: "Querying DB for candidates" },
  { agent: "timetable",    title: "Timetable Agent",    task: "Checking conflicts" },
  { agent: "resource",     title: "Resource Agent",     task: "Verifying equipment" },
  { agent: "conflict",     title: "Conflict Agent",     task: "Applying rule engine" },
  { agent: "coordinator",  title: "Decision Agent",     task: "Scoring candidates" },
  { agent: "notification", title: "Notification Agent", task: "Saving decision to DB" },
];

function Page() {
  const { user } = useSession();
  const { data: agents, isLoading, refetch: refetchAgents } = useTable("agents", { order: "tasks_processed", ascending: false });
  const { data: messages, refetch: refetchMessages } = useTable("agent_messages", { order: "created_at", ascending: false, limit: 10 });

  const [modalOpen, setModalOpen] = useState(false);
  const [pipelineRunning, setPipelineRunning] = useState(false);
  const [currentStage, setCurrentStage] = useState(-1);
  const [result, setResult] = useState<any | null>(null);

  // Form state for the real request
  const [requestType, setRequestType] = useState("Computer Laboratory");
  const [capacity, setCapacity] = useState(60);
  const [computers, setComputers] = useState(70);
  const [startTime, setStartTime] = useState("14:00");
  const [endTime, setEndTime] = useState("16:00");

  const openModal = () => {
    setModalOpen(true);
    setResult(null);
    setCurrentStage(-1);
  };

  const closeModal = () => {
    setModalOpen(false);
    setResult(null);
    setCurrentStage(-1);
    setPipelineRunning(false);
  };

  // ═══════════════════════════════════════════════════════════
  // REAL PIPELINE EXECUTION
  // ═══════════════════════════════════════════════════════════
  const executePipeline = async () => {
    setPipelineRunning(true);
    setCurrentStage(0);
    setResult(null);

    try {
      const spec: RequestSpec = {
        type: requestType,
        capacity,
        computers: requestType.includes("Computer") ? computers : undefined,
        startTime,
        endTime,
      };

      // RUN THE REAL PIPELINE
      const pipelineResult = await runRealPipeline(
        spec,
        user?.email?.split("@")[0] ?? "User"
      );

      // Animate the stages as they complete (the work is already done)
      for (let i = 0; i < pipelineResult.stages.length; i++) {
        await new Promise((r) => setTimeout(r, 500));
        setCurrentStage(i);
      }

      setResult(pipelineResult);

      // Refetch agents + messages to show new data
      setTimeout(() => {
        refetchAgents();
        refetchMessages();
      }, 500);

      // Toast
      if (pipelineResult.finalDecision.winner) {
        toast.success("✅ Real agents processed the request", {
          description: `${pipelineResult.finalDecision.winner.candidate.name} at ${pipelineResult.finalDecision.winner.score}% score`,
        });
      } else {
        toast.warning("No valid candidate found", {
          description: pipelineResult.finalDecision.explanation?.slice(0, 80),
        });
      }
    } catch (err) {
      console.error("Pipeline failed:", err);
      toast.error("Agent pipeline failed", { description: String(err) });
    } finally {
      setPipelineRunning(false);
    }
  };

  const isFinished = result !== null;

  return (
    <div className="mx-auto w-full max-w-7xl">
      <PageHeader
        title="Agent Control Center"
        subtitle="All ten specialised agents, their load and message bus."
        actions={
          <Button onClick={openModal} className="gap-2 rounded-xl">
            <Play className="size-4" />
            🎯 Run Real Request
          </Button>
        }
      />

      {/* Info banner */}
      <GlassPanel className="mb-4 p-3 text-xs text-muted-foreground">
        🤖 <strong>Live multi-agent pipeline.</strong> Click <strong>"Run Real Request"</strong> to
        submit a request through 8 real agent functions. Each agent does actual work on live data.
      </GlassPanel>

      {/* Agent Network Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <GlassPanel hover className="p-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <Cpu className="size-5 text-primary" />
            <span className="text-2xl font-semibold">{agents?.length || 0}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Total Agents</p>
        </GlassPanel>

        <GlassPanel hover className="p-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <Activity className="size-5 text-green-400" />
            <span className="text-2xl font-semibold">
              {agents?.filter((a: any) => a["status"] === "active").length || 0}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Active Agents</p>
        </GlassPanel>

        <GlassPanel hover className="p-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <Activity className="size-5 text-yellow-400" />
            <span className="text-2xl font-semibold">
              {agents?.filter((a: any) => a["status"] === "busy").length || 0}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Busy Agents</p>
        </GlassPanel>

        <GlassPanel hover className="p-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="size-5 text-primary" />
            <span className="text-2xl font-semibold">
              {agents?.length
                ? Math.round(
                    agents.reduce((acc: number, a: any) => acc + a["success_rate"], 0) / agents.length
                  )
                : 0}
              %
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Avg Success Rate</p>
        </GlassPanel>
      </div>

      {/* Agent Cards */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Agent Network</h2>
        {isLoading ? (
          <GlassPanel className="p-12 text-center text-muted-foreground">Loading agents…</GlassPanel>
        ) : agents?.length === 0 ? (
          <GlassPanel className="p-12 text-center text-muted-foreground">No agents found.</GlassPanel>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {agents?.map((agent: any) => {
              const Icon = AGENT_ICONS[agent["key"]] || Bot;
              const color = AGENT_COLORS[agent["key"]] || "text-primary";
              return (
                <GlassPanel key={agent["id"]} hover className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`grid size-10 place-items-center rounded-xl bg-primary/10 ${color}`}>
                        <Icon className="size-5" />
                      </span>
                      <div>
                        <h3 className="font-semibold text-sm">{agent["name"]}</h3>
                        <p className="text-xs text-muted-foreground">#{agent["key"]}</p>
                      </div>
                    </div>
                    <StatusDot status={agent["status"]} />
                  </div>

                  <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                    {agent["description"]}
                  </p>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded bg-primary/5 p-2 text-center">
                      <span className="text-muted-foreground">Tasks</span>
                      <p className="font-semibold">{agent["tasks_processed"]}</p>
                    </div>
                    <div className="rounded bg-primary/5 p-2 text-center">
                      <span className="text-muted-foreground">Success</span>
                      <p className="font-semibold text-green-400">{agent["success_rate"]}%</p>
                    </div>
                  </div>

                  {agent["current_task"] && (
                    <div className="mt-2 rounded bg-primary/5 p-2">
                      <p className="text-xs text-muted-foreground">Current Task</p>
                      <p className="text-xs font-medium">{agent["current_task"]}</p>
                    </div>
                  )}

                  <p className="mt-2 text-[10px] text-muted-foreground">
                    Last active: {new Date(agent["last_activity"]).toLocaleTimeString("en-IN", {
                      hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata"
                    })}
                  </p>
                </GlassPanel>
              );
            })}
          </div>
        )}
      </div>

      {/* Agent Communication Stream */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center justify-between">
          <span>Agent Communication Stream</span>
          <span className="text-xs text-muted-foreground font-normal">
            Auto-updates from database
          </span>
        </h2>
        <GlassPanel level={2} className="p-4">
          {messages?.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No messages yet. Click "Run Real Request" to trigger the agent pipeline.
            </p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {messages?.map((msg: any) => (
                <div key={msg["id"]} className="flex items-start gap-3 rounded-lg bg-primary/5 p-3">
                  <div className="min-w-[180px]">
                    <span className="text-xs font-medium text-cyan-400">{msg["sender"]}</span>
                    <span className="mx-1 text-xs text-muted-foreground">→</span>
                    <span className="text-xs font-medium text-violet-400">{msg["receiver"]}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold">{msg["message_type"]}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {JSON.stringify(msg["payload"]).slice(0, 100)}
                    </p>
                  </div>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                    {new Date(msg["created_at"]).toLocaleTimeString("en-IN", {
                      hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata"
                    })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </GlassPanel>
      </div>

      {/* ============================================================
          REAL PIPELINE MODAL
          ============================================================ */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-background/80 backdrop-blur-md p-4">
          <GlassPanel level={3} className="w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Sparkles className="size-5 text-primary" />
                  Real Agent Pipeline
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  8 real agent functions will run in sequence on live data
                </p>
              </div>
              <button
                onClick={closeModal}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-primary/10 hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Request input form — only shown before running */}
            {!pipelineRunning && !result && (
              <div className="space-y-4 mb-4">
                <div>
                  <Label className="text-xs">Request Type</Label>
                  <select
                    value={requestType}
                    onChange={(e) => setRequestType(e.target.value)}
                    className="w-full rounded-lg bg-background/50 px-3 py-2 text-sm mt-1"
                  >
                    <option>Computer Laboratory</option>
                    <option>Classroom</option>
                    <option>Science Laboratory</option>
                    <option>Auditorium</option>
                    <option>Study Pod</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Capacity</Label>
                    <Input
                      type="number"
                      value={capacity}
                      onChange={(e) => setCapacity(Number(e.target.value))}
                      className="bg-background/50 mt-1"
                    />
                  </div>
                  {requestType.includes("Computer") && (
                    <div>
                      <Label className="text-xs">Computers Needed</Label>
                      <Input
                        type="number"
                        value={computers}
                        onChange={(e) => setComputers(Number(e.target.value))}
                        className="bg-background/50 mt-1"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Start Time</Label>
                    <Input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="bg-background/50 mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">End Time</Label>
                    <Input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="bg-background/50 mt-1"
                    />
                  </div>
                </div>

                <Button onClick={executePipeline} className="w-full rounded-xl gap-2" size="lg">
                  <Play className="size-4" /> Execute Real Pipeline
                </Button>
              </div>
            )}

            {/* Pipeline stages */}
            {(pipelineRunning || result) && (
              <div className="space-y-3">
                {PIPELINE_STAGES.map((stage, index) => {
                  const isActive = index === currentStage;
                  const isDone = index < currentStage || isFinished;
                  const Icon = AGENT_ICONS[stage.agent] || Bot;
                  const color = AGENT_COLORS[stage.agent] || "text-primary";

                  return (
                    <div
                      key={index}
                      className={cn(
                        "rounded-xl border p-3 transition-all duration-500",
                        isActive && "border-primary/50 bg-primary/10 shadow-glow scale-[1.02]",
                        isDone && "border-green-400/30 bg-green-400/5",
                        !isActive && !isDone && "border-border/50 bg-background/30 opacity-40"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={cn(
                            "grid size-9 shrink-0 place-items-center rounded-xl transition-all",
                            isActive && `bg-primary/20 ${color} scale-110`,
                            isDone && "bg-green-400/15 text-green-400",
                            !isActive && !isDone && "bg-primary/5 text-muted-foreground"
                          )}
                        >
                          {isDone ? <CheckCircle className="size-5" /> : <Icon className="size-5" />}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold">{stage.title}</p>
                            {isActive && (
                              <span className="flex items-center gap-1 text-[10px] text-primary">
                                <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                                Processing…
                              </span>
                            )}
                            {isDone && (
                              <span className="text-[10px] text-green-400">✓ Complete</span>
                            )}
                          </div>
                          <p className="text-xs mt-0.5">{stage.task}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Final Result */}
            {result && result.finalDecision.winner && (
              <div className="mt-4 rounded-xl border border-green-400/40 bg-green-400/5 p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="size-6 text-green-400 shrink-0" />
                  <div>
                    <p className="font-semibold text-green-400">✅ Real Pipeline Complete</p>
                    <p className="mt-2 text-sm">
                      <strong>Recommended:</strong> {result.finalDecision.winner.candidate.name}
                    </p>
                    <div className="mt-2 grid grid-cols-2 gap-1 text-xs text-muted-foreground">
                      <span>Capacity:</span>
                      <span>{result.finalDecision.winner.candidate.capacity}</span>
                      {result.finalDecision.winner.candidate.computers > 0 && (
                        <>
                          <span>Computers:</span>
                          <span>{result.finalDecision.winner.candidate.computers}</span>
                        </>
                      )}
                      <span>Distance:</span>
                      <span>{result.finalDecision.winner.candidate.distance}m</span>
                    </div>
                    <p className="mt-2 text-xs">
                      <strong>Score:</strong>{" "}
                      <span className="text-cyan-400 font-semibold">
                        {result.finalDecision.winner.score}%
                      </span>
                    </p>
                    <p className="mt-2 text-[11px] text-muted-foreground italic">
                      {result.finalDecision.explanation?.slice(0, 250)}...
                    </p>
                    <p className="mt-3 text-[10px] text-green-400">
                      ✅ {result.messages.length} real messages saved to database ·{" "}
                      {result.totalDurationMs}ms
                    </p>
                  </div>
                </div>
                <Button onClick={closeModal} className="mt-3 w-full rounded-xl">
                  Close & View Updated Stream
                </Button>
              </div>
            )}

            {result && !result.finalDecision.winner && (
              <div className="mt-4 rounded-xl border border-red-400/40 bg-red-400/5 p-4">
                <div className="flex items-start gap-3">
                  <X className="size-6 text-red-400 shrink-0" />
                  <div>
                    <p className="font-semibold text-red-400">❌ No Valid Candidate</p>
                    <p className="mt-2 text-sm">
                      {result.finalDecision.explanation ?? "No suitable resource found."}
                    </p>
                    <p className="mt-2 text-[10px] text-muted-foreground">
                      Pipeline failed at stage {result.stages.length} · {result.totalDurationMs}ms
                    </p>
                  </div>
                </div>
                <Button onClick={closeModal} className="mt-3 w-full rounded-xl">
                  Close
                </Button>
              </div>
            )}
          </GlassPanel>
        </div>
      )}
    </div>
  );
}
=======
function Page() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <PageHeader title="Agent Control Center" subtitle="All ten specialised agents, their load and message bus." />
      <GlassPanel level={2} className="p-6">
        <p className="text-sm text-muted-foreground">
          This module is wired to the campus database and agent pipeline.
        </p>
      </GlassPanel>
    </div>
  );
}
>>>>>>> 4ed5064e0872a8573dbceff1cf59df711efc6f87
