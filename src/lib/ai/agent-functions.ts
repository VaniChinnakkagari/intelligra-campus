/**
 * NEXUS CAMPUS AI — Real Multi-Agent Functions
 * 
 * Each agent is a specialized function that performs ONE reasoning task.
 * The Coordinator Agent orchestrates them in sequence.
 * 
 * This implements the FIPA-ACL style multi-agent coordination pattern
 * where agents exchange structured messages to solve a complex problem.
 */

import { supabase } from "@/integrations/supabase/client";
import {
  evaluateRules,
  scoreCandidate,
  decide,
  type Candidate,
  type RequestSpec,
  type ScoredCandidate,
  type RuleEvaluation,
} from "@/lib/engine";

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

export type AgentMessage = {
  sender: string;
  receiver: string;
  type: string;
  payload: Record<string, unknown>;
  timestamp: string;
};

export type AgentResult<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  message: AgentMessage;
  durationMs: number;
};

export type PipelineResult = {
  success: boolean;
  stages: AgentResult[];
  finalDecision: {
    winner: ScoredCandidate | null;
    scored: ScoredCandidate[];
    explanation: string;
  };
  messages: AgentMessage[];
  totalDurationMs: number;
};

// ═══════════════════════════════════════════════════════════
// AGENT 1: FACULTY AGENT
// Validates incoming requests
// ═══════════════════════════════════════════════════════════

export async function facultyAgent(request: RequestSpec): Promise<AgentResult> {
  const start = Date.now();

  // Validate request
  if (!request.capacity || request.capacity <= 0) {
    return {
      success: false,
      error: "Invalid capacity — must be greater than 0",
      message: {
        sender: "FacultyAgent",
        receiver: "CoordinatorAgent",
        type: "REQUEST_REJECTED",
        payload: { reason: "Invalid capacity" },
        timestamp: new Date().toISOString(),
      },
      durationMs: Date.now() - start,
    };
  }

  if (request.capacity > 500) {
    return {
      success: false,
      error: "Capacity exceeds campus maximum (500)",
      message: {
        sender: "FacultyAgent",
        receiver: "CoordinatorAgent",
        type: "REQUEST_REJECTED",
        payload: { reason: "Capacity too large" },
        timestamp: new Date().toISOString(),
      },
      durationMs: Date.now() - start,
    };
  }

  if (!request.startTime || !request.endTime) {
    return {
      success: false,
      error: "Time window is required",
      message: {
        sender: "FacultyAgent",
        receiver: "CoordinatorAgent",
        type: "REQUEST_REJECTED",
        payload: { reason: "Missing time window" },
        timestamp: new Date().toISOString(),
      },
      durationMs: Date.now() - start,
    };
  }

  // Valid request
  return {
    success: true,
    data: { validatedRequest: request },
    message: {
      sender: "FacultyAgent",
      receiver: "CoordinatorAgent",
      type: "REQUEST_VALIDATED",
      payload: {
        capacity: request.capacity,
        startTime: request.startTime,
        endTime: request.endTime,
        computers: request.computers,
        requestType: request.type,
      },
      timestamp: new Date().toISOString(),
    },
    durationMs: Date.now() - start,
  };
}

// ═══════════════════════════════════════════════════════════
// AGENT 2: COORDINATOR AGENT
// Decomposes request into sub-tasks
// ═══════════════════════════════════════════════════════════

export async function coordinatorAgent(
  request: RequestSpec
): Promise<AgentResult> {
  const start = Date.now();

  // Build task plan
  const plan = [
    { step: 1, agent: "ClassroomAgent", task: "Search for candidate resources" },
    { step: 2, agent: "TimetableAgent", task: "Check schedule availability" },
    { step: 3, agent: "ResourceAgent", task: "Verify equipment requirements" },
    { step: 4, agent: "ConflictAgent", task: "Validate hard constraints" },
    { step: 5, agent: "DecisionAgent", task: "Score and rank candidates" },
    { step: 6, agent: "NotificationAgent", task: "Dispatch result" },
  ];

  return {
    success: true,
    data: { plan, request },
    message: {
      sender: "CoordinatorAgent",
      receiver: "ClassroomAgent",
      type: "TASK_PLAN_CREATED",
      payload: {
        plan,
        minCapacity: request.capacity,
        labType: request.labType || "any",
      },
      timestamp: new Date().toISOString(),
    },
    durationMs: Date.now() - start,
  };
}

// ═══════════════════════════════════════════════════════════
// AGENT 3: CLASSROOM AGENT
// Searches DB for candidate classrooms/labs
// ═══════════════════════════════════════════════════════════

export async function classroomAgent(
  request: RequestSpec
): Promise<AgentResult<Candidate[]>> {
  const start = Date.now();

  try {
    // Determine which table to query based on request type
    const isLabRequest =
      request.type.toLowerCase().includes("lab") ||
      request.type.toLowerCase().includes("laboratory");

    let candidates: Candidate[] = [];

    if (isLabRequest) {
      const { data: labs, error } = await supabase
        .from("laboratories")
        .select("*")
        .gte("capacity", request.capacity);

      if (error) throw error;

      candidates = (labs || []).map((l: any) => ({
        id: l.id,
        name: l.name,
        capacity: l.capacity,
        computers: l.computers,
        labType: l.lab_type,
        distance: l.distance_from_gate,
        utilization: l.utilization,
        status: l.status,
      }));
    } else {
      const { data: rooms, error } = await supabase
        .from("classrooms")
        .select("*")
        .gte("capacity", request.capacity);

      if (error) throw error;

      candidates = (rooms || []).map((r: any) => ({
        id: r.id,
        name: r.name,
        capacity: r.capacity,
        computers: 0,
        labType: "classroom",
        distance: 100,
        utilization: r.utilization,
        status: r.status,
      }));
    }

    return {
      success: true,
      data: candidates,
      message: {
        sender: "ClassroomAgent",
        receiver: "TimetableAgent",
        type: "CANDIDATES_FOUND",
        payload: {
          count: candidates.length,
          candidates: candidates.slice(0, 5).map((c) => ({
            id: c.id,
            name: c.name,
            capacity: c.capacity,
          })),
        },
        timestamp: new Date().toISOString(),
      },
      durationMs: Date.now() - start,
    };
  } catch (err) {
    return {
      success: false,
      error: String(err),
      message: {
        sender: "ClassroomAgent",
        receiver: "CoordinatorAgent",
        type: "SEARCH_FAILED",
        payload: { error: String(err) },
        timestamp: new Date().toISOString(),
      },
      durationMs: Date.now() - start,
    };
  }
}

// ═══════════════════════════════════════════════════════════
// AGENT 4: TIMETABLE AGENT
// Checks timetable conflicts
// ═══════════════════════════════════════════════════════════

export async function timetableAgent(
  candidates: Candidate[]
): Promise<AgentResult<Candidate[]>> {
  const start = Date.now();

  try {
    // Fetch all timetable entries to check conflicts
    const { data: entries, error } = await supabase
      .from("timetable_entries")
      .select("classroom_id, laboratory_id, time_slot_id, day_of_week");

    if (error) throw error;

    // Build a set of busy resource IDs
    const busyIds = new Set(
      (entries || [])
        .map((e: any) => e.classroom_id || e.laboratory_id)
        .filter(Boolean)
    );

    // Filter candidates that are not busy
    const available = candidates.filter((c) => !busyIds.has(c.id));

    return {
      success: true,
      data: available,
      message: {
        sender: "TimetableAgent",
        receiver: "ResourceAgent",
        type: "AVAILABILITY_CHECKED",
        payload: {
          totalCandidates: candidates.length,
          availableCount: available.length,
          busyCount: candidates.length - available.length,
        },
        timestamp: new Date().toISOString(),
      },
      durationMs: Date.now() - start,
    };
  } catch (err) {
    return {
      success: false,
      error: String(err),
      message: {
        sender: "TimetableAgent",
        receiver: "CoordinatorAgent",
        type: "CHECK_FAILED",
        payload: { error: String(err) },
        timestamp: new Date().toISOString(),
      },
      durationMs: Date.now() - start,
    };
  }
}

// ═══════════════════════════════════════════════════════════
// AGENT 5: RESOURCE AGENT
// Verifies equipment (computers, projectors, etc.)
// ═══════════════════════════════════════════════════════════

export async function resourceAgent(
  candidates: Candidate[],
  request: RequestSpec
): Promise<AgentResult<Candidate[]>> {
  const start = Date.now();

  const requiredComputers = request.computers || 0;

  // Filter candidates that meet equipment requirements
  const equipped = candidates.filter(
    (c) => c.computers >= requiredComputers
  );

  return {
    success: true,
    data: equipped,
    message: {
      sender: "ResourceAgent",
      receiver: "ConflictAgent",
      type: "EQUIPMENT_VERIFIED",
      payload: {
        requiredComputers,
        passedCount: equipped.length,
        failedCount: candidates.length - equipped.length,
      },
      timestamp: new Date().toISOString(),
    },
    durationMs: Date.now() - start,
  };
}

// ═══════════════════════════════════════════════════════════
// AGENT 6: CONFLICT AGENT
// Applies rule engine to eliminate constraint violators
// ═══════════════════════════════════════════════════════════

export async function conflictAgent(
  candidates: Candidate[],
  request: RequestSpec
): Promise<
  AgentResult<{
    valid: Candidate[];
    evaluations: Map<string, RuleEvaluation[]>;
  }>
> {
  const start = Date.now();

  const evaluations = new Map<string, RuleEvaluation[]>();
  const valid: Candidate[] = [];

  for (const candidate of candidates) {
    const rules = evaluateRules(candidate, request);
    evaluations.set(candidate.id, rules);

    // Check if any hard rule failed
    const hardFailed = rules.some(
      (r) => r.kind === "hard" && r.status === "FAILED"
    );

    if (!hardFailed) {
      valid.push(candidate);
    }
  }

  return {
    success: true,
    data: { valid, evaluations },
    message: {
      sender: "ConflictAgent",
      receiver: "DecisionAgent",
      type: "CONSTRAINTS_VALIDATED",
      payload: {
        totalChecked: candidates.length,
        validCount: valid.length,
        eliminatedCount: candidates.length - valid.length,
      },
      timestamp: new Date().toISOString(),
    },
    durationMs: Date.now() - start,
  };
}

// ═══════════════════════════════════════════════════════════
// AGENT 7: DECISION AGENT
// Applies weighted scoring to pick best candidate
// ═══════════════════════════════════════════════════════════

export async function decisionAgent(
  candidates: Candidate[],
  request: RequestSpec
): Promise<
  AgentResult<{
    winner: ScoredCandidate | null;
    scored: ScoredCandidate[];
    explanation: string;
  }>
> {
  const start = Date.now();

  const result = decide(candidates, request);

  return {
    success: true,
    data: result,
    message: {
      sender: "DecisionAgent",
      receiver: "NotificationAgent",
      type: "DECISION_READY",
      payload: {
        selected: result.winner?.candidate.name || "none",
        score: result.winner?.score || 0,
        candidateCount: result.scored.length,
      },
      timestamp: new Date().toISOString(),
    },
    durationMs: Date.now() - start,
  };
}

// ═══════════════════════════════════════════════════════════
// AGENT 8: NOTIFICATION AGENT
// Saves decision to DB and notifies requester
// ═══════════════════════════════════════════════════════════

export async function notificationAgent(
  decision: {
    winner: ScoredCandidate | null;
    scored: ScoredCandidate[];
    explanation: string;
  },
  request: RequestSpec,
  requesterName?: string
): Promise<AgentResult> {
  const start = Date.now();

  try {
    // Log decision to ai_decisions table
    if (decision.winner) {
      await supabase.from("ai_decisions").insert({
        request_summary: `${request.type} for ${request.capacity} people, ${request.startTime}-${request.endTime}`,
        agent: "DecisionAgent",
        algorithm: "Weighted Scoring + Rule Engine",
        selected_resource: decision.winner.candidate.name,
        score: decision.winner.score,
        reason: decision.explanation,
        candidates: decision.scored.map((s) => ({
          name: s.candidate.name,
          score: s.score,
          eliminated: s.eliminated,
        })),
      });
    }

    // Log to agent_messages
  

    return {
      success: true,
      message: {
        sender: "NotificationAgent",
        receiver: "User",
        type: "DECISION_DELIVERED",
        payload: {
          selected: decision.winner?.candidate.name || "none",
          score: decision.winner?.score || 0,
        },
        timestamp: new Date().toISOString(),
      },
      durationMs: Date.now() - start,
    };
  } catch (err) {
    return {
      success: false,
      error: String(err),
      message: {
        sender: "NotificationAgent",
        receiver: "CoordinatorAgent",
        type: "NOTIFICATION_FAILED",
        payload: { error: String(err) },
        timestamp: new Date().toISOString(),
      },
      durationMs: Date.now() - start,
    };
  }
}

// ═══════════════════════════════════════════════════════════
// MAIN PIPELINE — Runs all 8 agents in sequence
// ═══════════════════════════════════════════════════════════

export async function runRealPipeline(
  request: RequestSpec,
  requesterName?: string
): Promise<PipelineResult> {
  const pipelineStart = Date.now();
  const stages: AgentResult[] = [];
  const messages: AgentMessage[] = [];

  // Helper to write each message to the DB
  const logMessage = async (message: AgentMessage) => {
    try {
      await supabase.from("agent_messages").insert({
        sender: message.sender,
        receiver: message.receiver,
        message_type: message.type,
        payload: message.payload,
      });
      console.log(`[DB] Logged: ${message.sender} → ${message.receiver} (${message.type})`);
    } catch (err) {
      console.error(`[DB] Failed to log ${message.sender} → ${message.receiver}:`, err);
    }
  };

  // ═══ STAGE 1: Faculty Agent validates ═══
  const faculty = await facultyAgent(request);
  stages.push(faculty);
  messages.push(faculty.message);
  await logMessage(faculty.message);

  if (!faculty.success) {
    return {
      success: false,
      stages,
      finalDecision: {
        winner: null,
        scored: [],
        explanation: faculty.error || "Validation failed",
      },
      messages,
      totalDurationMs: Date.now() - pipelineStart,
    };
  }

  // ═══ STAGE 2: Coordinator plans ═══
  const coordinator = await coordinatorAgent(request);
  stages.push(coordinator);
  messages.push(coordinator.message);
  await logMessage(coordinator.message);

  // ═══ STAGE 3: Classroom Agent searches ═══
  const classroom = await classroomAgent(request);
  stages.push(classroom);
  messages.push(classroom.message);
  await logMessage(classroom.message);

  if (!classroom.success || !classroom.data?.length) {
    return {
      success: false,
      stages,
      finalDecision: {
        winner: null,
        scored: [],
        explanation: "No candidates found in the database",
      },
      messages,
      totalDurationMs: Date.now() - pipelineStart,
    };
  }

  // ═══ STAGE 4: Timetable Agent checks ═══
  const timetable = await timetableAgent(classroom.data);
  stages.push(timetable);
  messages.push(timetable.message);
  await logMessage(timetable.message);

  if (!timetable.success || !timetable.data?.length) {
    return {
      success: false,
      stages,
      finalDecision: {
        winner: null,
        scored: [],
        explanation: "All candidates are busy in the timetable",
      },
      messages,
      totalDurationMs: Date.now() - pipelineStart,
    };
  }

  // ═══ STAGE 5: Resource Agent verifies ═══
  const resource = await resourceAgent(timetable.data, request);
  stages.push(resource);
  messages.push(resource.message);
  await logMessage(resource.message);

  if (!resource.success || !resource.data?.length) {
    return {
      success: false,
      stages,
      finalDecision: {
        winner: null,
        scored: [],
        explanation: "No candidates meet equipment requirements",
      },
      messages,
      totalDurationMs: Date.now() - pipelineStart,
    };
  }

  // ═══ STAGE 6: Conflict Agent validates ═══
  const conflict = await conflictAgent(resource.data, request);
  stages.push(conflict);
  messages.push(conflict.message);
  await logMessage(conflict.message);

  if (!conflict.success || !conflict.data?.valid.length) {
    return {
      success: false,
      stages,
      finalDecision: {
        winner: null,
        scored: [],
        explanation: "All candidates failed hard constraint validation",
      },
      messages,
      totalDurationMs: Date.now() - pipelineStart,
    };
  }

  // ═══ STAGE 7: Decision Agent scores ═══
  const decision = await decisionAgent(conflict.data.valid, request);
  stages.push(decision);
  messages.push(decision.message);
  await logMessage(decision.message);

  if (!decision.success || !decision.data) {
    return {
      success: false,
      stages,
      finalDecision: {
        winner: null,
        scored: [],
        explanation: "Decision scoring failed",
      },
      messages,
      totalDurationMs: Date.now() - pipelineStart,
    };
  }

  // ═══ STAGE 8: Notification Agent saves ═══
  const notification = await notificationAgent(
    decision.data,
    request,
    requesterName
  );
  stages.push(notification);
  messages.push(notification.message);
  await logMessage(notification.message);

  return {
    success: decision.data.winner !== null,
    stages,
    finalDecision: decision.data,
    messages,
    totalDurationMs: Date.now() - pipelineStart,
  };
}