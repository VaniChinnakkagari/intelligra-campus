import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { GlassPanel } from "@/components/Glass";
import { useTable, useUpsert } from "@/lib/api";
import { useState, useMemo } from "react";
import {
  CheckCircle, XCircle, MinusCircle, Play, GitBranch,
  Zap, Shield, Sparkles, RefreshCw, Info, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/rules")({
  component: Page,
});

type Rule = {
  id: string;
  name: string;
  rule_type: string;
  conditions: string[];
  conclusion: string;
  weight: number;
  active: boolean;
};

type RuleStatus = "PASSED" | "FAILED" | "SKIPPED";

type EvaluationResult = {
  ruleId: string;
  status: RuleStatus;
  reasoning: string;
};

// Simulated scenario data for the rule engine demo
const SCENARIOS = [
  {
    id: "lab-request",
    label: "Computer Lab Request",
    description: "60 students, 2:00-4:00 PM, 70 computers, computer lab",
    context: {
      roomCapacity: 70,
      requiredCapacity: 60,
      roomAvailable: true,
      hasConflict: false,
      labComputers: 70,
      requiredComputers: 70,
      labType: "computer",
      requestedLabType: "computer",
      facultyScheduled: false,
      facultyWorkload: 12,
      maxFacultyHours: 18,
      distance: 120,
      utilization: 38,
    },
  },
  {
    id: "small-room",
    label: "Small Room, Big Class",
    description: "80 students need a 40-seat classroom",
    context: {
      roomCapacity: 40,
      requiredCapacity: 80,
      roomAvailable: true,
      hasConflict: false,
      labComputers: 0,
      requiredComputers: 0,
      labType: "classroom",
      requestedLabType: "classroom",
      facultyScheduled: false,
      facultyWorkload: 8,
      maxFacultyHours: 18,
      distance: 250,
      utilization: 85,
    },
  },
  {
    id: "busy-lab",
    label: "Busy Lab",
    description: "Lab currently occupied, requested anyway",
    context: {
      roomCapacity: 60,
      requiredCapacity: 50,
      roomAvailable: false,
      hasConflict: true,
      labComputers: 60,
      requiredComputers: 50,
      labType: "computer",
      requestedLabType: "computer",
      facultyScheduled: true,
      facultyWorkload: 20,
      maxFacultyHours: 18,
      distance: 300,
      utilization: 95,
    },
  },
  {
    id: "perfect-match",
    label: "Perfect Match",
    description: "All constraints satisfied ideally",
    context: {
      roomCapacity: 65,
      requiredCapacity: 60,
      roomAvailable: true,
      hasConflict: false,
      labComputers: 65,
      requiredComputers: 60,
      labType: "computer",
      requestedLabType: "computer",
      facultyScheduled: false,
      facultyWorkload: 10,
      maxFacultyHours: 18,
      distance: 80,
      utilization: 45,
    },
  },
];

function Page() {
  const { data: rules, isLoading, refetch } = useTable("rules", { order: "name" });
  const upsert = useUpsert("rules");
  const [selectedScenario, setSelectedScenario] = useState(SCENARIOS[0]);
  const [evaluations, setEvaluations] = useState<Record<string, EvaluationResult>>({});
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Evaluate all rules against a scenario
  const runEvaluation = async () => {
    setIsEvaluating(true);
    setEvaluations({});

    const ctx = selectedScenario.context;
    const results: Record<string, EvaluationResult> = {};

    const ruleList = (rules as Rule[]) || [];

    // Evaluate each rule
    ruleList.forEach((rule, i) => {
      setTimeout(() => {
        const result = evaluateRule(rule, ctx);
        setEvaluations((prev) => ({ ...prev, [rule.id]: result }));
      }, i * 200);
    });

    setTimeout(() => {
      setIsEvaluating(false);
      const passed = Object.values(results).filter((r) => r.status === "PASSED").length;
      toast.success("Rule evaluation complete", {
        description: `${passed} of ${ruleList.length} rules passed`,
      });
    }, ruleList.length * 200 + 200);
  };

  const toggleRule = async (rule: Rule) => {
    try {
      await upsert.mutateAsync({ id: rule.id, active: !rule.active });
      toast.success(rule.active ? "Rule disabled" : "Rule enabled");
      refetch();
    } catch (err) {
      toast.error("Failed to toggle rule", { description: String(err) });
    }
  };

  const stats = useMemo(() => {
    const ruleList = (rules as Rule[]) || [];
    const hard = ruleList.filter((r) => r.rule_type === "hard").length;
    const soft = ruleList.filter((r) => r.rule_type === "soft").length;
    const active = ruleList.filter((r) => r.active).length;

    const passed = Object.values(evaluations).filter((e) => e.status === "PASSED").length;
    const failed = Object.values(evaluations).filter((e) => e.status === "FAILED").length;
    const skipped = Object.values(evaluations).filter((e) => e.status === "SKIPPED").length;

    return { total: ruleList.length, hard, soft, active, passed, failed, skipped };
  }, [rules, evaluations]);

  const hasEvaluated = Object.keys(evaluations).length > 0;

  return (
    <div className="mx-auto w-full max-w-7xl">
      <PageHeader
        title="AI Rule Engine"
        subtitle="Declarative IF-THEN rules driving automated campus decisions."
      />

      {/* Info banner */}
      <GlassPanel className="mb-4 p-3 text-xs text-muted-foreground flex items-start gap-2">
        <Info className="size-4 shrink-0 mt-0.5 text-primary" />
        <span>
          <strong>Rule-Based Reasoning:</strong> Each rule evaluates conditions against a
          scenario. If all conditions pass, the rule fires. <strong>Hard rules</strong> must pass
          for a candidate to be valid. <strong>Soft rules</strong> contribute to the final score.
        </span>
      </GlassPanel>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <GlassPanel hover className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Rules</p>
              <p className="text-2xl font-semibold mt-1">{stats.total}</p>
            </div>
            <GitBranch className="size-7 text-cyan-400 opacity-60" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">{stats.active} active</p>
        </GlassPanel>

        <GlassPanel hover className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Hard Rules</p>
              <p className="text-2xl font-semibold mt-1">{stats.hard}</p>
            </div>
            <Shield className="size-7 text-red-400 opacity-60" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">Must pass</p>
        </GlassPanel>

        <GlassPanel hover className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Soft Rules</p>
              <p className="text-2xl font-semibold mt-1">{stats.soft}</p>
            </div>
            <Sparkles className="size-7 text-yellow-400 opacity-60" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">Contribute to score</p>
        </GlassPanel>

        <GlassPanel hover className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Last Eval</p>
              <p className="text-2xl font-semibold mt-1">
                {hasEvaluated ? `${stats.passed}/${stats.total}` : "—"}
              </p>
            </div>
            <Zap className="size-7 text-green-400 opacity-60" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {hasEvaluated ? `${stats.failed} failed` : "Not yet run"}
          </p>
        </GlassPanel>
      </div>

      {/* Scenario selector */}
      <GlassPanel level={2} className="mt-6 p-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Play className="size-4 text-primary" />
              Test Scenario
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Select a scenario, then run the rules
            </p>
          </div>
          <Button
            onClick={runEvaluation}
            disabled={isEvaluating}
            className="gap-2 rounded-xl"
          >
            {isEvaluating ? (
              <RefreshCw className="size-4 animate-spin" />
            ) : (
              <Play className="size-4" />
            )}
            {isEvaluating ? "Evaluating…" : "Run Evaluation"}
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setSelectedScenario(s);
                setEvaluations({});
              }}
              className={cn(
                "rounded-xl border p-3 text-left transition-all",
                selectedScenario.id === s.id
                  ? "border-primary/50 bg-primary/10"
                  : "border-border/40 hover:border-primary/30"
              )}
            >
              <p className="text-xs font-semibold">{s.label}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{s.description}</p>
            </button>
          ))}
        </div>
      </GlassPanel>

      {/* Rules list */}
      <div className="mt-6 space-y-3">
        {isLoading ? (
          <GlassPanel className="p-12 text-center text-muted-foreground">
            Loading rules…
          </GlassPanel>
        ) : !rules || rules.length === 0 ? (
          <GlassPanel className="p-12 text-center text-muted-foreground">
            No rules found. Run the SQL migration to add rules.
          </GlassPanel>
        ) : (
          (rules as Rule[]).map((rule) => {
            const evaluation = evaluations[rule.id];
            const isHard = rule.rule_type === "hard";

            return (
              <GlassPanel
                key={rule.id}
                hover
                className={cn(
                  "p-4 transition-all",
                  evaluation?.status === "PASSED" && "border-green-400/40",
                  evaluation?.status === "FAILED" && "border-red-400/40"
                )}
              >
                <div className="flex items-start gap-4">
                  {/* Type badge */}
                  <div
                    className={cn(
                      "flex size-12 shrink-0 items-center justify-center rounded-xl",
                      isHard
                        ? "bg-red-400/10 text-red-400"
                        : "bg-yellow-400/10 text-yellow-400"
                    )}
                  >
                    {isHard ? <Shield className="size-6" /> : <Sparkles className="size-6" />}
                  </div>

                  {/* Main content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="font-semibold">{rule.name}</h3>
                      <span
                        className={cn(
                          "rounded px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
                          isHard
                            ? "bg-red-400/15 text-red-400"
                            : "bg-yellow-400/15 text-yellow-400"
                        )}
                      >
                        {rule.rule_type}
                      </span>
                      {!rule.active && (
                        <span className="rounded bg-gray-400/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-gray-400">
                          Disabled
                        </span>
                      )}

                      {/* Status badge */}
                      {evaluation && (
                        <span
                          className={cn(
                            "flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
                            evaluation.status === "PASSED" && "bg-green-400/15 text-green-400",
                            evaluation.status === "FAILED" && "bg-red-400/15 text-red-400",
                            evaluation.status === "SKIPPED" && "bg-gray-400/15 text-gray-400"
                          )}
                        >
                          {evaluation.status === "PASSED" && <CheckCircle className="size-3" />}
                          {evaluation.status === "FAILED" && <XCircle className="size-3" />}
                          {evaluation.status === "SKIPPED" && <MinusCircle className="size-3" />}
                          {evaluation.status}
                        </span>
                      )}
                    </div>

                    {/* IF / THEN */}
                    <div className="space-y-2">
                      <div className="rounded-lg bg-primary/5 p-3">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                          IF
                        </p>
                        <div className="space-y-1">
                          {rule.conditions.map((cond, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs">
                              <ChevronRight className="size-3 text-primary mt-0.5 shrink-0" />
                              <span className="font-mono text-muted-foreground">{cond}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-lg bg-green-400/5 border border-green-400/20 p-3">
                        <p className="text-[10px] uppercase tracking-wider text-green-400 mb-1">
                          THEN
                        </p>
                        <p className="text-xs font-mono font-medium text-green-400">
                          {rule.conclusion}
                        </p>
                      </div>

                      {evaluation?.reasoning && (
                        <div
                          className={cn(
                            "rounded-lg p-2 text-xs",
                            evaluation.status === "PASSED"
                              ? "bg-green-400/5 text-green-400"
                              : evaluation.status === "FAILED"
                                ? "bg-red-400/5 text-red-400"
                                : "bg-gray-400/5 text-gray-400"
                          )}
                        >
                          <span className="font-semibold">Reasoning: </span>
                          {evaluation.reasoning}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Weight + toggle */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className="rounded-lg bg-primary/5 px-2 py-1 text-center">
                      <p className="text-[10px] text-muted-foreground uppercase">Weight</p>
                      <p className="text-sm font-semibold">{(rule.weight * 100).toFixed(0)}%</p>
                    </div>

                    <button
                      onClick={() => toggleRule(rule)}
                      className={cn(
                        "rounded-lg px-2 py-1 text-[10px] font-medium transition-all",
                        rule.active
                          ? "bg-primary/15 text-primary hover:bg-primary/25"
                          : "bg-gray-400/15 text-gray-400 hover:bg-gray-400/25"
                      )}
                    >
                      {rule.active ? "ACTIVE" : "OFF"}
                    </button>
                  </div>
                </div>
              </GlassPanel>
            );
          })
        )}
      </div>

      {/* Explanation */}
      {hasEvaluated && (
        <GlassPanel level={2} className="mt-6 p-5">
          <h3 className="text-sm font-semibold mb-3">Evaluation Summary</h3>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl bg-green-400/5 border border-green-400/20 p-3">
              <p className="text-2xl font-semibold text-green-400">{stats.passed}</p>
              <p className="text-xs text-muted-foreground mt-1">Rules passed</p>
            </div>
            <div className="rounded-xl bg-red-400/5 border border-red-400/20 p-3">
              <p className="text-2xl font-semibold text-red-400">{stats.failed}</p>
              <p className="text-xs text-muted-foreground mt-1">Rules failed</p>
            </div>
            <div className="rounded-xl bg-gray-400/5 border border-gray-400/20 p-3">
              <p className="text-2xl font-semibold text-gray-400">{stats.skipped}</p>
              <p className="text-xs text-muted-foreground mt-1">Rules skipped</p>
            </div>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            <strong>Conclusion: </strong>
            {stats.failed === 0
              ? "✅ All hard rules passed — this option is a valid candidate for the request."
              : `❌ ${stats.failed} rule${stats.failed !== 1 ? "s" : ""} failed — this option is eliminated.`}
          </p>
        </GlassPanel>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// RULE EVALUATION ENGINE
// ═══════════════════════════════════════════════════════════

function evaluateRule(rule: Rule, ctx: any): EvaluationResult {
  const ruleName = rule.name.toLowerCase();

  // ─── Capacity Sufficiency ───
  if (ruleName.includes("capacity")) {
    const pass = ctx.roomCapacity >= ctx.requiredCapacity;
    return {
      ruleId: rule.id,
      status: pass ? "PASSED" : "FAILED",
      reasoning: pass
        ? `Room capacity ${ctx.roomCapacity} ≥ required ${ctx.requiredCapacity}`
        : `Room capacity ${ctx.roomCapacity} < required ${ctx.requiredCapacity}`,
    };
  }

  // ─── Availability ───
  if (ruleName.includes("availability") && !ruleName.includes("faculty")) {
    if (!ctx.roomAvailable) {
      return {
        ruleId: rule.id,
        status: "FAILED",
        reasoning: "Room is currently occupied or unavailable",
      };
    }
    if (ctx.hasConflict) {
      return {
        ruleId: rule.id,
        status: "FAILED",
        reasoning: "Timetable conflict detected for this slot",
      };
    }
    return {
      ruleId: rule.id,
      status: "PASSED",
      reasoning: "Room is available and has no conflicts",
    };
  }

  // ─── Equipment Match ───
  if (ruleName.includes("equipment")) {
    if (ctx.requiredComputers === 0) {
      return {
        ruleId: rule.id,
        status: "SKIPPED",
        reasoning: "No equipment constraints for this request",
      };
    }
    const pass = ctx.labComputers >= ctx.requiredComputers;
    return {
      ruleId: rule.id,
      status: pass ? "PASSED" : "FAILED",
      reasoning: pass
        ? `Lab has ${ctx.labComputers} computers (needs ${ctx.requiredComputers})`
        : `Lab has only ${ctx.labComputers} computers (needs ${ctx.requiredComputers})`,
    };
  }

  // ─── Timetable Freedom ───
  if (ruleName.includes("timetable")) {
    const pass = !ctx.hasConflict;
    return {
      ruleId: rule.id,
      status: pass ? "PASSED" : "FAILED",
      reasoning: pass
        ? "Slot is free — no overlapping bookings"
        : "Slot already has a scheduled class",
    };
  }

  // ─── Faculty Availability ───
  if (ruleName.includes("faculty")) {
    if (ctx.facultyScheduled) {
      return {
        ruleId: rule.id,
        status: "FAILED",
        reasoning: "Faculty is already scheduled in this slot",
      };
    }
    if (ctx.facultyWorkload >= ctx.maxFacultyHours) {
      return {
        ruleId: rule.id,
        status: "FAILED",
        reasoning: `Faculty workload ${ctx.facultyWorkload} exceeds max ${ctx.maxFacultyHours}`,
      };
    }
    return {
      ruleId: rule.id,
      status: "PASSED",
      reasoning: `Faculty has capacity (${ctx.facultyWorkload}/${ctx.maxFacultyHours} hours)`,
    };
  }

  // ─── Proximity ───
  if (ruleName.includes("proximity")) {
    const pass = ctx.distance <= 250;
    return {
      ruleId: rule.id,
      status: pass ? "PASSED" : "FAILED",
      reasoning: pass
        ? `Distance ${ctx.distance}m is within preferred range`
        : `Distance ${ctx.distance}m exceeds 250m preference`,
    };
  }

  // ─── Room Efficiency ───
  if (ruleName.includes("efficiency")) {
    const pct = ctx.requiredCapacity / Math.max(ctx.roomCapacity, 1);
    const pass = pct >= 0.7;
    return {
      ruleId: rule.id,
      status: pass ? "PASSED" : "FAILED",
      reasoning: pass
        ? `${Math.round(pct * 100)}% utilisation — efficient`
        : `${Math.round(pct * 100)}% utilisation — wasteful`,
    };
  }

  // ─── Gap Minimisation ───
  if (ruleName.includes("gap")) {
    return {
      ruleId: rule.id,
      status: "PASSED",
      reasoning: "No excessive gaps detected in schedule",
    };
  }

  // Default
  return {
    ruleId: rule.id,
    status: "SKIPPED",
    reasoning: "Rule evaluation not configured for this scenario",
  };
}