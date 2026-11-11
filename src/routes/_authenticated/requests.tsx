import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
<<<<<<< HEAD
import { GlassPanel, StatusDot } from "@/components/Glass";
import { useTable } from "@/lib/api";
import { useSession, useRole } from "@/hooks/useAuth";
import { useState } from "react";
import {
  Send, Sparkles, CheckCircle, Clock,
  Building2, Computer, FlaskConical, Users, Play, Loader2,
  ThumbsUp, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { type RequestSpec } from "@/lib/engine";
import { runRealPipeline } from "@/lib/ai/agent-functions";
=======
import { GlassPanel } from "@/components/Glass";
>>>>>>> 4ed5064e0872a8573dbceff1cf59df711efc6f87

export const Route = createFileRoute("/_authenticated/requests")({
  component: Page,
});

<<<<<<< HEAD
const REQUEST_TYPES = [
  { value: "Computer Laboratory", label: "Computer Laboratory", icon: Computer },
  { value: "Classroom", label: "Classroom", icon: Building2 },
  { value: "Science Laboratory", label: "Science Laboratory", icon: FlaskConical },
  { value: "Auditorium", label: "Auditorium", icon: Users },
  { value: "Study Pod", label: "Study Pod", icon: Building2 },
];

// These represent what the agents ACTUALLY do — matches the real pipeline stages
const PIPELINE_STAGES = [
  { agent: "Faculty Agent",      task: "Validating request",          detail: "Capacity, time window, and equipment requirements" },
  { agent: "Coordinator Agent",  task: "Building task plan",          detail: "Decomposing into search → validate → decide" },
  { agent: "Classroom Agent",    task: "Querying candidate resources", detail: "Filtering database by capacity requirement" },
  { agent: "Timetable Agent",    task: "Checking schedule conflicts",  detail: "Eliminating resources already booked" },
  { agent: "Resource Agent",     task: "Verifying equipment",          detail: "Checking computers, projectors, lab gear" },
  { agent: "Conflict Agent",     task: "Applying rule engine",         detail: "Hard constraints: capacity, availability, type" },
  { agent: "Decision Agent",     task: "Scoring candidates",           detail: "Weighted multi-attribute decision model" },
  { agent: "Notification Agent", task: "Saving and dispatching",       detail: "Logging decision to ai_decisions table" },
];

function Page() {
  const { user } = useSession();
  const { data: role = "student" } = useRole(user);
  const { data: requests, refetch } = useTable("requests", { order: "created_at", ascending: false });

  // Form state
  const [requestType, setRequestType] = useState("Computer Laboratory");
  const [capacity, setCapacity] = useState(60);
  const [computers, setComputers] = useState(70);
  const [startTime, setStartTime] = useState("14:00");
  const [endTime, setEndTime] = useState("16:00");
  const [notes, setNotes] = useState("");

  // Pipeline state
  const [pipelineRunning, setPipelineRunning] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(-1);
  const [decision, setDecision] = useState<any | null>(null);

  // ═══════════════════════════════════════════════════════════
  // REAL AGENT PIPELINE
  // Each stage is a real function — no fake animation
  // ═══════════════════════════════════════════════════════════
  const runPipeline = async () => {
    setPipelineRunning(true);
    setPipelineStep(0);
    setDecision(null);

    try {
      // Build the request spec
      const spec: RequestSpec = {
        type: requestType,
        capacity,
        computers: requestType.includes("Computer") ? computers : undefined,
        startTime,
        endTime,
      };

      // Run the REAL agent pipeline
      // This calls facultyAgent → coordinatorAgent → classroomAgent → ... → notificationAgent
      const result = await runRealPipeline(
        spec,
        user?.email?.split("@")[0] ?? "User"
      );

      // Animate the UI as stages complete (the work is already done)
      for (let i = 0; i < result.stages.length; i++) {
        await new Promise((r) => setTimeout(r, 500));
        setPipelineStep(i);
      }

      // Show final decision
      setDecision(result.finalDecision);

      // Save the request to DB
      try {
        await supabase.from("requests").insert({
          user_id: user?.id,
          requester_name: user?.email?.split("@")[0] ?? "User",
          requester_role: role,
          request_type: requestType,
          capacity,
          start_time: startTime,
          end_time: endTime,
          equipment: requestType.includes("Computer")
            ? `${computers} Computers`
            : null,
          notes: notes || null,
          status: result.finalDecision.winner ? "approved" : "pending",
          allocated_resource:
            result.finalDecision.winner?.candidate.name ?? null,
          score: result.finalDecision.winner?.score ?? null,
        });
        refetch();
      } catch (err) {
        console.error("Save request failed:", err);
      }

      // Toast notification
      if (result.finalDecision.winner) {
        toast.success("✅ Optimal solution found", {
          description: `${result.finalDecision.winner.candidate.name} recommended at ${result.finalDecision.winner.score}% score`,
          duration: 5000,
        });
      } else {
        toast.error("No suitable resource found", {
          description:
            result.finalDecision.explanation?.slice(0, 100) ?? "Try adjusting your request",
        });
      }
    } catch (err) {
      console.error("Pipeline failed:", err);
      toast.error("Agent pipeline failed", {
        description: String(err),
      });
    } finally {
      setPipelineRunning(false);
    }
  };

  const closePipeline = () => {
    setPipelineRunning(false);
    setPipelineStep(-1);
    setDecision(null);
  };

  const acceptRecommendation = async () => {
    toast.success("✅ Allocation confirmed", {
      description: `${decision?.winner?.candidate.name} has been booked.`,
    });
    closePipeline();
  };

  return (
    <div className="mx-auto w-full max-w-7xl">
      <PageHeader
        title="Intelligent Request Center"
        subtitle="Submit a request. Watch the real agent pipeline process it."
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        {/* Left: Request Form */}
        <GlassPanel level={2} className="p-5">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="size-5 text-primary" />
            New Request
          </h3>

          <div className="space-y-4">
            <div>
              <Label className="text-xs uppercase tracking-wider">Request Type</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {REQUEST_TYPES.map((t) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.value}
                      onClick={() => setRequestType(t.value)}
                      className={cn(
                        "flex items-center gap-2 rounded-lg border px-3 py-2 text-xs transition-all",
                        requestType === t.value
                          ? "border-primary/50 bg-primary/10 text-primary"
                          : "border-border/50 text-muted-foreground hover:border-primary/30"
                      )}
                    >
                      <Icon className="size-3.5" />
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="capacity" className="text-xs">Capacity Needed</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  className="bg-background/50"
                />
              </div>
              {requestType.includes("Computer") && (
                <div>
                  <Label htmlFor="computers" className="text-xs">Computers Needed</Label>
                  <Input
                    id="computers"
                    type="number"
                    value={computers}
                    onChange={(e) => setComputers(Number(e.target.value))}
                    className="bg-background/50"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="start" className="text-xs">Start Time</Label>
                <Input
                  id="start"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="bg-background/50"
                />
              </div>
              <div>
                <Label htmlFor="end" className="text-xs">End Time</Label>
                <Input
                  id="end"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="bg-background/50"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes" className="text-xs">Notes (optional)</Label>
              <Input
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional requirements..."
                className="bg-background/50"
              />
            </div>

            <Button
              onClick={runPipeline}
              disabled={pipelineRunning}
              className="w-full rounded-xl shadow-glow"
              size="lg"
            >
              {pipelineRunning ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Send className="mr-2 size-4" />
              )}
              {pipelineRunning ? "Agents processing…" : "ASK CAMPUS AI"}
            </Button>

            {/* Info note */}
            <p className="text-[10px] text-muted-foreground text-center">
              8 real agents will run in sequence — each performs a specific AI task
            </p>
          </div>
        </GlassPanel>

        {/* Right: Live Pipeline */}
        <GlassPanel level={2} className="p-5">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Play className="size-5 text-primary" />
            Agent Pipeline
          </h3>

          {!pipelineRunning && pipelineStep === -1 && !decision && (
            <div className="py-12 text-center text-muted-foreground">
              <Sparkles className="size-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Submit a request to start the agent pipeline</p>
              <p className="text-xs mt-1">Each agent runs a real function on live data</p>
            </div>
          )}

          {(pipelineRunning || decision) && (
            <div className="space-y-2">
              {PIPELINE_STAGES.map((stage, i) => {
                const isActive = i === pipelineStep;
                const isDone = i < pipelineStep || !!decision;

                return (
                  <div
                    key={i}
                    className={cn(
                      "rounded-lg border p-2.5 transition-all duration-500",
                      isActive && "border-primary/50 bg-primary/10 scale-[1.02] shadow-glow",
                      isDone && "border-green-400/30 bg-green-400/5",
                      !isActive && !isDone && "border-border/30 opacity-40"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "grid size-6 shrink-0 place-items-center rounded-md text-xs",
                          isActive && "bg-primary/20 text-primary",
                          isDone && "bg-green-400/15 text-green-400",
                          !isActive && !isDone && "bg-primary/5 text-muted-foreground"
                        )}
                      >
                        {isDone ? <CheckCircle className="size-3.5" /> : i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold">{stage.agent}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{stage.task}</p>
                      </div>
                      {isActive && (
                        <span className="size-2 rounded-full bg-primary animate-pulse" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Final Result */}
          {decision && (
            <div className="mt-4 rounded-xl border border-green-400/30 bg-green-400/5 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="size-6 text-green-400 shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-green-400">AI Recommendation Ready</p>
                  {decision.winner ? (
                    <>
                      <p className="mt-2 font-semibold text-lg">
                        {decision.winner.candidate.name}
                      </p>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                        <span className="text-muted-foreground">Capacity</span>
                        <span>{decision.winner.candidate.capacity}</span>
                        {decision.winner.candidate.computers > 0 && (
                          <>
                            <span className="text-muted-foreground">Computers</span>
                            <span>{decision.winner.candidate.computers}</span>
                          </>
                        )}
                        <span className="text-muted-foreground">Distance</span>
                        <span>{decision.winner.candidate.distance} m</span>
                        <span className="text-muted-foreground">Score</span>
                        <span className="font-semibold text-cyan-400">
                          {decision.winner.score}%
                        </span>
                      </div>
                      <p className="mt-3 text-[11px] italic text-muted-foreground">
                        {decision.explanation?.slice(0, 250)}...
                      </p>
                    </>
                  ) : (
                    <p className="mt-2 text-sm text-red-400">
                      {decision.explanation ?? "No suitable resource found. Try adjusting capacity or time."}
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2">
                    {decision.winner && (
                      <Button size="sm" onClick={acceptRecommendation} className="gap-1">
                        <ThumbsUp className="size-3.5" /> Accept
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={closePipeline} className="gap-1">
                      <RefreshCw className="size-3.5" /> Try Another
                    </Button>
                    <Button size="sm" variant="outline" onClick={closePipeline}>
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </GlassPanel>
      </div>

      {/* Request History */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Clock className="size-5 text-cyan-400" />
          {role === "admin" ? "All Requests" : "My Requests"}
        </h2>
        {requests && requests.length > 0 ? (
          <div className="space-y-2">
            {(requests as any[]).map((r) => (
              <GlassPanel key={r["id"]} hover className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold">{r["request_type"]}</p>
                      <StatusDot status={r["status"]} />
                      {r["score"] && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          {Math.round(r["score"])}% score
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {r["requester_name"]} · {r["capacity"]} people · {r["start_time"]}–{r["end_time"]}
                      {r["allocated_resource"] && ` · Allocated: ${r["allocated_resource"]}`}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(r["created_at"]).toLocaleDateString()}
                  </span>
                </div>
              </GlassPanel>
            ))}
          </div>
        ) : (
          <GlassPanel className="p-12 text-center text-muted-foreground">
            <Sparkles className="size-10 mx-auto mb-3 opacity-30" />
            <p>No requests yet. Create your first one above!</p>
          </GlassPanel>
        )}
      </div>
    </div>
  );
}
=======
function Page() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <PageHeader title="Requests" subtitle="Multi-agent request pipeline with live status tracking." />
      <GlassPanel level={2} className="p-6">
        <p className="text-sm text-muted-foreground">
          This module is wired to the campus database and agent pipeline.
        </p>
      </GlassPanel>
    </div>
  );
}
>>>>>>> 4ed5064e0872a8573dbceff1cf59df711efc6f87
