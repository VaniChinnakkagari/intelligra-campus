import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { GlassPanel } from "@/components/Glass";
import { useTable } from "@/lib/api";
import { useMemo, useState } from "react";
import {
  Brain, Sparkles, CheckCircle, TrendingUp, Calendar,
  User, Target, ArrowRight, X, Search, Filter, Cpu,
  BookOpen, Clock, Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/decisions")({
  component: Page,
});

type Decision = {
  id: string;
  request_id: string | null;
  request_summary: string;
  agent: string;
  algorithm: string;
  selected_resource: string | null;
  score: number;
  reason: string | null;
  candidates: any;
  created_at: string;
};

function Page() {
  const { data: decisions, isLoading } = useTable("ai_decisions", {
    order: "created_at",
    ascending: false,
  });

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Decision | null>(null);
  const [sortBy, setSortBy] = useState<"date" | "score">("date");

  const filtered = useMemo(() => {
    let list = (decisions as Decision[]) || [];

    // Search filter
    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter(
        (d) =>
          d.request_summary?.toLowerCase().includes(s) ||
          d.agent?.toLowerCase().includes(s) ||
          d.algorithm?.toLowerCase().includes(s) ||
          d.selected_resource?.toLowerCase().includes(s)
      );
    }

    // Sort
    if (sortBy === "score") {
      list = [...list].sort((a, b) => (b.score || 0) - (a.score || 0));
    }

    return list;
  }, [decisions, search, sortBy]);

  // Stats
  const stats = useMemo(() => {
    const list = (decisions as Decision[]) || [];
    const total = list.length;
    const avgScore = total
      ? Math.round(list.reduce((acc, d) => acc + (d.score || 0), 0) / total)
      : 0;
    const highScore = list.filter((d) => (d.score || 0) >= 90).length;
    const agentsUsed = new Set(list.map((d) => d.agent)).size;

    return { total, avgScore, highScore, agentsUsed };
  }, [decisions]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400";
    if (score >= 75) return "text-cyan-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return "bg-green-400/10 border-green-400/30";
    if (score >= 75) return "bg-cyan-400/10 border-cyan-400/30";
    if (score >= 60) return "bg-yellow-400/10 border-yellow-400/30";
    return "bg-red-400/10 border-red-400/30";
  };

  return (
    <div className="mx-auto w-full max-w-7xl">
      <PageHeader
        title="AI Decision Center"
        subtitle="Explainable decision log with scores and reasoning traces."
      />

      {/* Info banner */}
      <GlassPanel className="mb-4 p-3 text-xs text-muted-foreground flex items-start gap-2">
        <Brain className="size-4 shrink-0 mt-0.5 text-primary" />
        <span>
          <strong>Explainable AI:</strong> Every decision made by the agent network is logged here
          with the algorithm used, the winning candidate, its score, and full reasoning.
          This is the AI's "paper trail".
        </span>
      </GlassPanel>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <GlassPanel hover className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Decisions</p>
              <p className="text-2xl font-semibold mt-1">{stats.total}</p>
            </div>
            <Brain className="size-7 text-cyan-400 opacity-60" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">Logged by agent network</p>
        </GlassPanel>

        <GlassPanel hover className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Avg Score</p>
              <p className={cn("text-2xl font-semibold mt-1", getScoreColor(stats.avgScore))}>
                {stats.avgScore}%
              </p>
            </div>
            <TrendingUp className="size-7 text-green-400 opacity-60" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">Across all decisions</p>
        </GlassPanel>

        <GlassPanel hover className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">High Score</p>
              <p className="text-2xl font-semibold mt-1">{stats.highScore}</p>
            </div>
            <Award className="size-7 text-yellow-400 opacity-60" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">≥ 90% suitability</p>
        </GlassPanel>

        <GlassPanel hover className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Agents</p>
              <p className="text-2xl font-semibold mt-1">{stats.agentsUsed}</p>
            </div>
            <Cpu className="size-7 text-violet-400 opacity-60" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">Contributing agents</p>
        </GlassPanel>
      </div>

      {/* Search + Sort */}
      <div className="mt-6 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search decisions by request, agent, or resource…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-background/50"
          />
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={sortBy === "date" ? "default" : "outline"}
            onClick={() => setSortBy("date")}
            className="gap-1"
          >
            <Calendar className="size-3.5" /> Latest
          </Button>
          <Button
            size="sm"
            variant={sortBy === "score" ? "default" : "outline"}
            onClick={() => setSortBy("score")}
            className="gap-1"
          >
            <TrendingUp className="size-3.5" /> Score
          </Button>
        </div>
      </div>

      {/* Decision list */}
      <div className="mt-6 space-y-3">
        {isLoading ? (
          <GlassPanel className="p-12 text-center text-muted-foreground">
            Loading decisions…
          </GlassPanel>
        ) : filtered.length === 0 ? (
          <GlassPanel className="p-12 text-center text-muted-foreground">
            <Brain className="size-12 mx-auto mb-3 opacity-30" />
            <p className="font-semibold">
              {search ? "No matching decisions" : "No decisions logged yet"}
            </p>
            <p className="text-sm mt-1">
              {search
                ? "Try a different search term"
                : "Decisions will appear here when the agent network processes requests"}
            </p>
          </GlassPanel>
        ) : (
          filtered.map((decision) => (
            <GlassPanel
              key={decision.id}
              hover
              className={cn("p-4 cursor-pointer", getScoreBg(decision.score))}
              onClick={() => setSelected(decision)}
            >
              <div className="flex items-start gap-4">
                {/* Score badge */}
                <div
                  className={cn(
                    "flex size-16 shrink-0 flex-col items-center justify-center rounded-xl border-2",
                    getScoreBg(decision.score)
                  )}
                >
                  <span className={cn("text-xl font-semibold leading-none", getScoreColor(decision.score))}>
                    {Math.round(decision.score)}
                  </span>
                  <span className="text-[9px] text-muted-foreground uppercase mt-0.5">score</span>
                </div>

                {/* Main content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <p className="font-semibold">{decision.request_summary}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Cpu className="size-3" />
                      {decision.agent}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="size-3" />
                      {decision.algorithm}
                    </span>
                    {decision.selected_resource && (
                      <>
                        <span>·</span>
                        <span className="flex items-center gap-1 text-primary">
                          <Target className="size-3" />
                          {decision.selected_resource}
                        </span>
                      </>
                    )}
                  </div>

                  {decision.reason && (
                    <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                      {decision.reason}
                    </p>
                  )}

                  <div className="mt-2 flex items-center gap-3 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      {new Date(decision.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>

                <ArrowRight className="size-4 text-muted-foreground shrink-0 mt-2" />
              </div>
            </GlassPanel>
          ))
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-background/80 backdrop-blur-md p-4"
          onClick={() => setSelected(null)}
        >
          <GlassPanel
            level={3}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <span className={cn("grid size-12 place-items-center rounded-xl border-2", getScoreBg(selected.score))}>
                  <Brain className={cn("size-6", getScoreColor(selected.score))} />
                </span>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    AI Decision
                  </p>
                  <h2 className="text-lg font-semibold mt-0.5">{selected.request_summary}</h2>
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-primary/10"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Score card */}
            <div className={cn("rounded-xl border-2 p-4 mb-4", getScoreBg(selected.score))}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    Suitability Score
                  </p>
                  <p className={cn("text-3xl font-bold mt-1", getScoreColor(selected.score))}>
                    {Math.round(selected.score)}%
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Selected Resource</p>
                  <p className="font-semibold text-primary mt-1">
                    {selected.selected_resource || "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="rounded-lg bg-primary/5 p-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Agent
                </p>
                <p className="text-sm font-medium mt-1 flex items-center gap-1.5">
                  <Cpu className="size-3.5 text-primary" />
                  {selected.agent}
                </p>
              </div>
              <div className="rounded-lg bg-primary/5 p-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Algorithm
                </p>
                <p className="text-sm font-medium mt-1 flex items-center gap-1.5">
                  <BookOpen className="size-3.5 text-primary" />
                  {selected.algorithm}
                </p>
              </div>
            </div>

            {/* Reason */}
            {selected.reason && (
              <div className="rounded-lg bg-green-400/5 border border-green-400/20 p-4 mb-4">
                <p className="text-xs font-semibold text-green-400 mb-2 flex items-center gap-1.5">
                  <CheckCircle className="size-3.5" />
                  Reasoning
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selected.reason}
                </p>
              </div>
            )}

            {/* Candidates */}
            {selected.candidates && Array.isArray(selected.candidates) && selected.candidates.length > 0 && (
              <div className="rounded-lg bg-primary/5 p-4 mb-4">
                <p className="text-xs font-semibold mb-3 flex items-center gap-1.5">
                  <Filter className="size-3.5 text-primary" />
                  Candidates Evaluated
                </p>
                <div className="space-y-2">
                  {selected.candidates.map((c: any, i: number) => (
                    <div
                      key={i}
                      className={cn(
                        "flex items-center justify-between rounded-lg border p-2.5",
                        c.score >= 90
                          ? "border-green-400/30 bg-green-400/5"
                          : c.score >= 60
                            ? "border-cyan-400/30 bg-cyan-400/5"
                            : "border-red-400/30 bg-red-400/5"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {i === 0 && <Award className="size-4 text-yellow-400" />}
                        <span className="text-sm font-medium">{c.name}</span>
                      </div>
                      <span className={cn("text-sm font-semibold", getScoreColor(c.score))}>
                        {Math.round(c.score)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timestamp */}
            <div className="text-xs text-muted-foreground text-center">
              <Clock className="size-3 inline mr-1" />
              {new Date(selected.created_at).toLocaleString()}
            </div>

            <Button onClick={() => setSelected(null)} className="mt-4 w-full rounded-xl">
              Close
            </Button>
          </GlassPanel>
        </div>
      )}
    </div>
  );
}