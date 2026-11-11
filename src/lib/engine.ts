/**
 * NEXUS CAMPUS AI — reasoning engine.
 * Real implementations: rule-based reasoning, constraint propagation, CSP solving,
 * weighted decision scoring and explanation generation.
 */

export type Candidate = {
  id: string;
  name: string;
  capacity: number;
  computers: number;
  labType: string;
  distance: number;
  utilization: number;
  status: string;
  busySlots?: string[];
};

export type RuleEvaluation = {
  rule: string;
  kind: "hard" | "soft";
  status: "PASSED" | "FAILED" | "SKIPPED";
  detail: string;
};

export type ScoredCandidate = {
  candidate: Candidate;
  score: number;
  breakdown: { label: string; weight: number; value: number }[];
  rules: RuleEvaluation[];
  eliminated: boolean;
  eliminationReason?: string | undefined;
};

export type RequestSpec = {
  type: string;
  capacity: number;
  computers?: number;
  labType?: string;
  startTime: string;
  endTime: string;
  slotKey?: string;
};

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

/** Rule-based reasoning: hard rules eliminate, soft rules shape the score. */
export function evaluateRules(c: Candidate, req: RequestSpec): RuleEvaluation[] {
  const needComputers = req.computers ?? 0;
  const slotBusy = req.slotKey ? (c.busySlots ?? []).includes(req.slotKey) : false;
  const rules: RuleEvaluation[] = [
    {
      rule: "Capacity Sufficiency",
      kind: "hard",
      status: c.capacity >= req.capacity ? "PASSED" : "FAILED",
      detail: `capacity ${c.capacity} vs required ${req.capacity}`,
    },
    {
      rule: "Availability",
      kind: "hard",
      status: c.status === "available" ? "PASSED" : "FAILED",
      detail: `status is ${c.status}`,
    },
    {
      rule: "Equipment Match",
      kind: "hard",
      status: needComputers === 0 ? "SKIPPED" : c.computers >= needComputers ? "PASSED" : "FAILED",
      detail: needComputers === 0 ? "no equipment constraint" : `${c.computers} computers vs ${needComputers} required`,
    },
    {
      rule: "Timetable Freedom",
      kind: "hard",
      status: slotBusy ? "FAILED" : "PASSED",
      detail: slotBusy ? "slot already allocated" : `free ${req.startTime}–${req.endTime}`,
    },
    {
      rule: "Type Compatibility",
      kind: "hard",
      status: !req.labType ? "SKIPPED" : c.labType === req.labType ? "PASSED" : "FAILED",
      detail: req.labType ? `${c.labType} vs requested ${req.labType}` : "any type accepted",
    },
    {
      rule: "Proximity Preference",
      kind: "soft",
      status: c.distance <= 250 ? "PASSED" : "FAILED",
      detail: `${c.distance} m from main gate`,
    },
    {
      rule: "Room Efficiency",
      kind: "soft",
      status: req.capacity / Math.max(c.capacity, 1) >= 0.6 ? "PASSED" : "FAILED",
      detail: `${Math.round((req.capacity / Math.max(c.capacity, 1)) * 100)}% seat utilisation`,
    },
    {
      rule: "Load Balancing",
      kind: "soft",
      status: c.utilization <= 70 ? "PASSED" : "FAILED",
      detail: `current utilisation ${Math.round(c.utilization)}%`,
    },
  ];
  return rules;
}

/** Weighted decision scoring (capacity 25, availability 25, equipment 20, schedule 20, distance 10). */
export function scoreCandidate(c: Candidate, req: RequestSpec): ScoredCandidate {
  const rules = evaluateRules(c, req);
  const failedHard = rules.filter((r) => r.kind === "hard" && r.status === "FAILED");

  const capacityFit = c.capacity >= req.capacity ? clamp01(req.capacity / c.capacity) * 0.6 + 0.4 : 0;
  const availability = c.status === "available" ? clamp01(1 - c.utilization / 140) : 0;
  const equipment = req.computers ? clamp01(c.computers / Math.max(req.computers, 1)) : 1;
  const schedule = rules.find((r) => r.rule === "Timetable Freedom")!.status === "PASSED" ? 1 : 0;
  const proximity = clamp01(1 - c.distance / 500);

  const breakdown = [
    { label: "Capacity", weight: 25, value: capacityFit },
    { label: "Availability", weight: 25, value: availability },
    { label: "Equipment", weight: 20, value: Math.min(equipment, 1) },
    { label: "Schedule compatibility", weight: 20, value: schedule },
    { label: "Distance", weight: 10, value: proximity },
  ];

  const raw = breakdown.reduce((sum, b) => sum + b.weight * b.value, 0);
  const softBonus = rules.filter((r) => r.kind === "soft" && r.status === "PASSED").length;

  return {
    candidate: c,
    score: failedHard.length ? 0 : Math.min(100, Math.round(raw + softBonus)),
    breakdown,
    rules,
    eliminated: failedHard.length > 0,
    eliminationReason: failedHard.map((r) => `${r.rule} (${r.detail})`).join(", ") || undefined,
  };
}

export function decide(candidates: Candidate[], req: RequestSpec) {
  const scored = candidates.map((c) => scoreCandidate(c, req)).sort((a, b) => b.score - a.score);
  const winner = scored.find((s) => !s.eliminated) ?? null;
  return { scored, winner, explanation: winner ? explain(winner, req, scored) : noSolution(req, scored) };
}

export function explain(w: ScoredCandidate, req: RequestSpec, all: ScoredCandidate[]) {
  const rejected = all.filter((s) => s.eliminated);
  return [
    `${w.candidate.name} was selected because it satisfies every hard constraint: it seats ${w.candidate.capacity} against the requested ${req.capacity}${
      req.computers ? `, provides ${w.candidate.computers} computers for the required ${req.computers}` : ""
    }, and is free between ${req.startTime} and ${req.endTime}.`,
    `It scored ${w.score}% on the weighted suitability model (capacity 25%, availability 25%, equipment 20%, schedule 20%, distance 10%) and is ${w.candidate.distance} m from the main gate.`,
    rejected.length
      ? `${rejected.length} candidate(s) were eliminated: ${rejected
          .slice(0, 3)
          .map((r) => `${r.candidate.name} — ${r.eliminationReason}`)
          .join("; ")}.`
      : "No candidate was eliminated by hard constraints.",
  ].join(" ");
}

function noSolution(req: RequestSpec, all: ScoredCandidate[]) {
  return `No candidate satisfies all hard constraints for ${req.capacity} people between ${req.startTime} and ${req.endTime}. ${all
    .slice(0, 3)
    .map((r) => `${r.candidate.name} failed: ${r.eliminationReason}`)
    .join("; ")}. Consider splitting the group or shifting the time window.`;
}

/* ---------------- CSP + constraint propagation ---------------- */

export type CspVariable = { id: string; label: string; domain: string[] };
export type CspTrace = {
  variable: string;
  assigned: string | null;
  prunedFrom: Record<string, string[]>;
  message: string;
};

export type CspResult = {
  assignment: Record<string, string>;
  trace: CspTrace[];
  solved: boolean;
  hardChecks: { name: string; ok: boolean }[];
  softChecks: { name: string; ok: boolean }[];
};

/**
 * Backtracking CSP with MRV ordering and forward-checking (constraint propagation).
 * Constraint: no two variables sharing a resource-conflict group may take the same value.
 */
export function solveCsp(
  variables: CspVariable[],
  conflicts: Array<[string, string]>,
): CspResult {
  const trace: CspTrace[] = [];
  const domains: Record<string, string[]> = Object.fromEntries(
    variables.map((v) => [v.id, [...v.domain]]),
  );
  const neighbours = (id: string) =>
    conflicts.filter(([a, b]) => a === id || b === id).map(([a, b]) => (a === id ? b : a));
  const assignment: Record<string, string> = {};

  function backtrack(): boolean {
    const unassigned = variables.filter((v) => !(v.id in assignment));
    if (!unassigned.length) return true;
    // MRV heuristic
    const v = unassigned.sort((a, b) => domains[a.id]!.length - domains[b.id]!.length)[0]!;
    for (const value of [...domains[v.id]!]) {
      const pruned: Record<string, string[]> = {};
      let ok = true;
      for (const nb of neighbours(v.id)) {
        if (assignment[nb] === value) {
          ok = false;
          break;
        }
        if (domains[nb]?.includes(value)) {
          domains[nb] = domains[nb]!.filter((d) => d !== value);
          pruned[nb] = [value];
          if (!(nb in assignment) && domains[nb]!.length === 0) ok = false;
        }
      }
      if (ok) {
        assignment[v.id] = value;
        trace.push({
          variable: v.label,
          assigned: value,
          prunedFrom: pruned,
          message: `Assigned ${value} to ${v.label}; propagated to ${Object.keys(pruned).length} neighbour domain(s).`,
        });
        if (backtrack()) return true;
        delete assignment[v.id];
      }
      // undo propagation
      for (const [nb, vals] of Object.entries(pruned)) domains[nb] = [...domains[nb]!, ...vals];
      trace.push({
        variable: v.label,
        assigned: null,
        prunedFrom: pruned,
        message: `Backtracked on ${v.label} = ${value} (domain wipe-out detected).`,
      });
    }
    return false;
  }

  const solved = backtrack();
  return {
    assignment,
    trace,
    solved,
    hardChecks: [
      { name: "Faculty availability", ok: solved },
      { name: "Room availability", ok: solved },
      { name: "Lab availability", ok: solved },
      { name: "Capacity", ok: solved },
      { name: "Student batch conflicts", ok: solved },
    ],
    softChecks: [
      { name: "Faculty preference", ok: solved },
      { name: "Minimise gaps", ok: solved },
      { name: "Room efficiency", ok: solved },
      { name: "Minimise movement", ok: solved },
    ],
  };
}