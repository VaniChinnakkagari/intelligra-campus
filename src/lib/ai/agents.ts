/** Multi-agent system: agent registry, structured message bus and the request pipeline. */
import {
  Bot,
  Boxes,
  Building2,
  Bus,
  CalendarClock,
  GraduationCap,
  Network,
  ShieldAlert,
  Sparkles,
  UserCog,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { decide, type Candidate, type RequestSpec, type ScoredCandidate } from "./engine";

export type AgentKey =
  | "coordinator"
  | "student"
  | "faculty"
  | "classroom"
  | "timetable"
  | "resource"
  | "transportation"
  | "conflict"
  | "notification"
  | "admin"
  | "decision";

export type AgentDef = {
  key: AgentKey;
  name: string;
  role: string;
  icon: LucideIcon;
  accent: "cyan" | "violet" | "magenta" | "softblue" | "success";
};

export const AGENTS: AgentDef[] = [
  { key: "coordinator", name: "Coordinator Agent", role: "Builds task plans and orchestrates every agent", icon: Network, accent: "cyan" },
  { key: "student", name: "Student Agent", role: "Answers student schedule and navigation queries", icon: GraduationCap, accent: "softblue" },
  { key: "faculty", name: "Faculty Agent", role: "Parses and validates faculty requests", icon: UserCog, accent: "violet" },
  { key: "classroom", name: "Classroom Agent", role: "Searches classrooms and laboratories", icon: Building2, accent: "cyan" },
  { key: "timetable", name: "Timetable Agent", role: "Solves timetables with CSP + propagation", icon: CalendarClock, accent: "violet" },
  { key: "resource", name: "Resource Agent", role: "Verifies equipment and inventory", icon: Boxes, accent: "success" },
  { key: "transportation", name: "Transportation Agent", role: "Optimises campus routes with A*", icon: Bus, accent: "softblue" },
  { key: "conflict", name: "Conflict Agent", role: "Detects hard and soft constraint violations", icon: ShieldAlert, accent: "magenta" },
  { key: "decision", name: "Decision Agent", role: "Scores candidates and explains the choice", icon: Sparkles, accent: "cyan" },
  { key: "notification", name: "Notification Agent", role: "Delivers results to campus users", icon: Bot, accent: "success" },
  { key: "admin", name: "Admin Agent", role: "Applies policy and administrative overrides", icon: UserCog, accent: "violet" },
];

export const agentByKey = (k: string) => AGENTS.find((a) => a.key === k) ?? AGENTS[0]!;

export type AgentMessage = {
  sender: string;
  receiver: string;
  type: string;
  payload: Record<string, unknown>;
};

export type PipelineStage = {
  agent: AgentKey;
  title: string;
  detail: string;
  message?: AgentMessage;
};

export type PipelineResult = {
  stages: PipelineStage[];
  scored: ScoredCandidate[];
  winner: ScoredCandidate | null;
  explanation: string;
};

/** Runs the full multi-agent negotiation for a resource request. */
export function runRequestPipeline(req: RequestSpec, candidates: Candidate[]): PipelineResult {
  const { scored, winner, explanation } = decide(candidates, req);
  const valid = scored.filter((s) => !s.eliminated);

  const stages: PipelineStage[] = [
    {
      agent: "faculty",
      title: "Analysing request",
      detail: `Parsed a ${req.type} request for ${req.capacity} people, ${req.startTime}–${req.endTime}.`,
      message: { sender: "FacultyAgent", receiver: "CoordinatorAgent", type: "RESOURCE_REQUEST", payload: { ...req } },
    },
    {
      agent: "coordinator",
      title: "Creating task plan",
      detail: "Decomposed the request into search, schedule, equipment, constraint and decision tasks.",
      message: { sender: "CoordinatorAgent", receiver: "ClassroomAgent", type: "SEARCH_RESOURCES", payload: { minCapacity: req.capacity, labType: req.labType ?? "any" } },
    },
    {
      agent: "classroom",
      title: "Searching resources",
      detail: `Indexed ${candidates.length} campus resources and shortlisted ${scored.filter((s) => s.candidate.capacity >= req.capacity).length} by capacity.`,
      message: { sender: "ClassroomAgent", receiver: "TimetableAgent", type: "CHECK_AVAILABILITY", payload: { candidates: scored.slice(0, 4).map((s) => s.candidate.name) } },
    },
    {
      agent: "timetable",
      title: "Checking schedule conflicts",
      detail: `${valid.length} candidate(s) are free in the requested window.`,
      message: { sender: "TimetableAgent", receiver: "ResourceAgent", type: "SLOTS_CLEAR", payload: { free: valid.length } },
    },
    {
      agent: "resource",
      title: "Verifying equipment",
      detail: req.computers ? `Confirmed workstation counts against the ${req.computers}-computer requirement.` : "No equipment constraint declared; inventory check skipped.",
      message: { sender: "ResourceAgent", receiver: "ConflictAgent", type: "EQUIPMENT_OK", payload: { computers: req.computers ?? 0 } },
    },
    {
      agent: "conflict",
      title: "Validating constraints",
      detail: `${scored.filter((s) => s.eliminated).length} candidate(s) violated a hard constraint and were eliminated.`,
      message: { sender: "ConflictAgent", receiver: "DecisionAgent", type: "CONSTRAINTS_VALIDATED", payload: { rejected: scored.filter((s) => s.eliminated).length } },
    },
    {
      agent: "decision",
      title: "Evaluating candidates",
      detail: winner ? `Highest weighted score: ${winner.candidate.name} at ${winner.score}%.` : "No candidate satisfies all hard constraints.",
      message: { sender: "DecisionAgent", receiver: "NotificationAgent", type: "DECISION_READY", payload: { selected: winner?.candidate.name ?? "none", score: winner?.score ?? 0 } },
    },
    {
      agent: "notification",
      title: "Dispatching result",
      detail: winner ? `Allocation of ${winner.candidate.name} notified to the requester.` : "Requester notified that no allocation is possible.",
    },
  ];

  return { stages, scored, winner, explanation };
}
