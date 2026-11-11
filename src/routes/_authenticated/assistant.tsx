import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { GlassPanel } from "@/components/Glass";
<<<<<<< HEAD
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useSession, useRole, type Role } from "@/hooks/useAuth";
=======
>>>>>>> 4ed5064e0872a8573dbceff1cf59df711efc6f87

export const Route = createFileRoute("/_authenticated/assistant")({
  component: Page,
});

<<<<<<< HEAD
type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  type?: "info" | "success" | "warning" | "error";
};

// Role-specific suggestions
const SUGGESTIONS_BY_ROLE: Record<Role, string[]> = {
  student: [
    "Where is my next class?",
    "Find a free computer lab",
    "Show today's timetable",
    "What bus is leaving next?",
    "Find an available classroom",
  ],
  faculty: [
    "What's my next class to teach?",
    "Find a free lab",
    "Show my schedule",
    "Show campus conflicts",
    "Campus statistics",
  ],
  admin: [
    "Show campus statistics",
    "Show campus conflicts",
    "Show system status",
    "What resources are available?",
    "Show me the campus overview",
  ],
};

function Page() {
  const { user } = useSession();
  const { data: role = "student" } = useRole(user);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Set welcome message based on role
  useEffect(() => {
    const welcomeByRole: Record<Role, string> = {
      student:
        "👋 **Welcome, student!**\n\nI can help you with:\n• Finding your next class\n• Locating free labs & classrooms\n• Checking bus schedules\n• Viewing your timetable\n\nWhat do you need?",
      faculty:
        "👋 **Welcome, Professor!**\n\nI can help you with:\n• Your next teaching slot\n• Finding available labs for your class\n• Checking schedule conflicts\n• Department resources\n\nHow can I assist?",
      admin:
        "👋 **Welcome, Admin!**\n\nI can help you with:\n• Campus-wide statistics\n• All active conflicts\n• System and agent status\n• Resource utilization\n\nWhat do you need?",
    };

    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: welcomeByRole[role as Role] || welcomeByRole.student,
        timestamp: new Date(),
        type: "info",
      },
    ]);
  }, [role]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSuggestion = (s: string) => {
    setInput(s);
    setTimeout(() => handleSend(s), 50);
  };

  const handleSend = async (overrideInput?: string) => {
    const text = (overrideInput || input).trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await processQuery(text, role as Role);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.content,
        timestamp: new Date(),
        type: response.type || "info",
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `❌ **Sorry, something went wrong.**\n\n${String(err)}`,
        timestamp: new Date(),
        type: "error",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestions = SUGGESTIONS_BY_ROLE[role as Role] || SUGGESTIONS_BY_ROLE.student;

  return (
    <div className="mx-auto w-full max-w-7xl">
      <PageHeader
        title="Campus AI Assistant"
        subtitle={`Available 24/7 · Role: ${role.charAt(0).toUpperCase() + role.slice(1)}`}
      />

      <GlassPanel level={2} className="flex h-[650px] flex-col overflow-hidden p-0">
        {/* Messages */}
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`flex size-8 shrink-0 items-center justify-center rounded-full ${
                  msg.role === "user"
                    ? "bg-primary/20 text-primary"
                    : "bg-violet-500/20 text-violet-400"
                }`}
              >
                {msg.role === "user" ? <User className="size-4" /> : <Bot className="size-4" />}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.role === "user"
                    ? "glass border-primary/20"
                    : `glass-2 ${
                        msg.type === "success"
                          ? "border-green-400/30"
                          : msg.type === "warning"
                            ? "border-yellow-400/30"
                            : msg.type === "error"
                              ? "border-red-400/30"
                              : "border-violet-400/30"
                      }`
                }`}
              >
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {msg.content}
                </div>
                <div className="mt-1 text-[10px] text-muted-foreground">
                  {msg.timestamp.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata" })}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-violet-400">
                <Bot className="size-4" />
              </div>
              <div className="glass-2 flex items-center gap-2 rounded-2xl px-4 py-3">
                <Loader2 className="size-4 animate-spin text-violet-400" />
                <span className="text-xs text-muted-foreground">Thinking…</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Role-aware Suggestions */}
        <div className="border-t border-border/50 px-4 py-3">
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => handleSuggestion(s)}
                className="rounded-full glass px-3 py-1 text-xs transition-all hover:border-primary/50 hover:text-primary"
                disabled={isLoading}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-border/50 p-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about the campus…"
              className="flex-1 bg-background/50"
              disabled={isLoading}
            />
            <Button onClick={() => handleSend()} disabled={isLoading || !input.trim()}>
              {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            </Button>
          </div>
        </div>
=======
function Page() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <PageHeader title="AI Assistant" subtitle="Ask the campus agents anything about rooms, labs, routes or schedules." />
      <GlassPanel level={2} className="p-6">
        <p className="text-sm text-muted-foreground">
          This module is wired to the campus database and agent pipeline.
        </p>
>>>>>>> 4ed5064e0872a8573dbceff1cf59df711efc6f87
      </GlassPanel>
    </div>
  );
}
<<<<<<< HEAD

// ═══════════════════════════════════════════════════════════
// INTENT DETECTION
// ═══════════════════════════════════════════════════════════

type Intent =
  | "next_class"
  | "today_timetable"
  | "free_labs"
  | "free_classrooms"
  | "bus_info"
  | "conflicts"
  | "resources"
  | "stats"
  | "system_status"
  | "help"
  | "unknown";

function detectIntent(query: string): Intent {
  const q = query.toLowerCase();

  if (q.includes("next class") || q.includes("where is my class") || q.includes("next teaching") || q.includes("upcoming class")) {
    return "next_class";
  }
  if ((q.includes("today") || q.includes("timetable") || q.includes("schedule") || q.includes("my schedule"))) {
    return "today_timetable";
  }
  if (q.includes("computer lab") || (q.includes("lab") && (q.includes("free") || q.includes("available") || q.includes("find")))) {
    return "free_labs";
  }
  if (q.includes("classroom") && (q.includes("free") || q.includes("available") || q.includes("find"))) {
    return "free_classrooms";
  }
  if (q.includes("bus") || q.includes("transport") || q.includes("route")) {
    return "bus_info";
  }
  if (q.includes("conflict") || q.includes("issue") || q.includes("problem")) {
    return "conflicts";
  }
  if (q.includes("system status") || q.includes("agent status") || q.includes("health")) {
    return "system_status";
  }
  if (q.includes("resource") || q.includes("equipment")) {
    return "resources";
  }
  if (q.includes("stat") || q.includes("overview") || q.includes("how many") || q.includes("total")) {
    return "stats";
  }
  if (q.includes("help") || q.includes("what can you")) {
    return "help";
  }
  return "unknown";
}

// ═══════════════════════════════════════════════════════════
// QUERY PROCESSOR (role-aware)
// ═══════════════════════════════════════════════════════════

async function processQuery(
  query: string,
  role: Role
): Promise<{ content: string; type?: Message["type"] }> {
  const intent = detectIntent(query);

  // ─── Role-aware override for next_class ───
  if (intent === "next_class") {
    if (role === "admin") {
      return {
        content:
          "ℹ️ **Admins don't have a class schedule.**\n\n" +
          "As an admin, try asking:\n" +
          "• \"Show campus statistics\"\n" +
          "• \"Show campus conflicts\"\n" +
          "• \"Show system status\"\n" +
          "• \"What resources are available?\"",
        type: "info",
      };
    }
    if (role === "faculty") return getNextClassForFaculty();
    return getNextClass();
  }

  switch (intent) {
    case "today_timetable":
      return getTodayTimetable();

    case "free_labs":
      return getFreeLabs();

    case "free_classrooms":
      return getFreeClassrooms();

    case "bus_info":
      return getBusInfo();

    case "conflicts":
      return getConflicts();

    case "system_status":
      return getSystemStatus();

    case "resources":
      return getResources();

    case "stats":
      return getStats();

    case "help":
      return {
        content:
          `🤖 **I can help with:**\n\n` +
          (role === "admin"
            ? `📊 *Campus data*\n• "Campus statistics"\n• "Show conflicts"\n• "System status"\n\n` +
              `📦 *Resources*\n• "What resources are available?"\n\n`
            : role === "faculty"
              ? `📅 *Teaching*\n• "My next class to teach"\n• "Show my schedule"\n\n` +
                `💻 *Resources*\n• "Find a free lab"\n\n` +
                `⚠️ *System*\n• "Show campus conflicts"\n\n`
              : `📅 *Schedule*\n• "Where is my next class?"\n• "Show today's timetable"\n\n` +
                `💻 *Resources*\n• "Find a free computer lab"\n• "Find an available classroom"\n\n` +
                `🚌 *Transportation*\n• "What bus is leaving next?"\n\n`) +
          `Click a suggestion below 👇`,
        type: "info",
      };

    default:
      return {
        content:
          `🤔 **I didn't quite understand that.**\n\n` +
          `You asked: *"${query}"*\n\n` +
          `Try clicking a suggestion below 👇`,
        type: "info",
      };
  }
}

// ═══════════════════════════════════════════════════════════
// HANDLERS
// ═══════════════════════════════════════════════════════════

async function getNextClass() {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

  const { data: entries } = await supabase
    .from("timetable_entries")
    .select("*")
    .eq("day_of_week", today)
    .limit(10);

  const { data: courses } = await supabase.from("courses").select("*");
  const { data: faculty } = await supabase.from("faculty").select("*");
  const { data: classrooms } = await supabase.from("classrooms").select("*");
  const { data: slots } = await supabase.from("time_slots").select("*").order("slot_order");

  if (!entries || entries.length === 0) {
    return {
      content: `📅 **No classes today (${today})**\n\nEnjoy your day off! 🎉`,
      type: "success" as const,
    };
  }

  const entry: any = entries[0];
  const course = (courses as any[])?.find((c) => c["id"] === entry["course_id"]);
  const fac = (faculty as any[])?.find((f) => f["id"] === entry["faculty_id"]);
  const room = (classrooms as any[])?.find((c) => c["id"] === entry["classroom_id"]);
  const slot = (slots as any[])?.find((s) => s["id"] === entry["time_slot_id"]);

  return {
    content:
      `📍 **Your next class (${today}):**\n\n` +
      `**${course?.["name"] ?? "Course"}**\n` +
      `\`${course?.["code"] ?? ""}\`\n\n` +
      `⏰ ${slot?.["start_time"] ?? "—"} – ${slot?.["end_time"] ?? "—"}\n` +
      `👤 ${fac?.["name"] ?? "Faculty TBD"}\n` +
      `📍 ${room?.["name"] ?? "Room TBD"}\n\n` +
      `_Have a great class! 🎓_`,
    type: "success" as const,
  };
}

async function getNextClassForFaculty() {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

  const { data: entries } = await supabase
    .from("timetable_entries")
    .select("*")
    .eq("day_of_week", today)
    .limit(10);

  const { data: courses } = await supabase.from("courses").select("*");
  const { data: faculty } = await supabase.from("faculty").select("*");
  const { data: classrooms } = await supabase.from("classrooms").select("*");
  const { data: slots } = await supabase.from("time_slots").select("*").order("slot_order");

  if (!entries || entries.length === 0) {
    return {
      content: `📅 **You have no teaching slots today (${today}).**\n\nEnjoy your free day! 🎉`,
      type: "success" as const,
    };
  }

  const entry: any = entries[0];
  const course = (courses as any[])?.find((c) => c["id"] === entry["course_id"]);
  const fac = (faculty as any[])?.find((f) => f["id"] === entry["faculty_id"]);
  const room = (classrooms as any[])?.find((c) => c["id"] === entry["classroom_id"]);
  const slot = (slots as any[])?.find((s) => s["id"] === entry["time_slot_id"]);

  return {
    content:
      `👨‍🏫 **Your next teaching slot (${today}):**\n\n` +
      `**${course?.["name"] ?? "Course"}**\n` +
      `\`${course?.["code"] ?? ""}\`\n\n` +
      `⏰ ${slot?.["start_time"] ?? "—"} – ${slot?.["end_time"] ?? "—"}\n` +
      `👨‍🏫 Faculty: ${fac?.["name"] ?? "—"}\n` +
      `📍 ${room?.["name"] ?? "Room TBD"}\n\n` +
      `_Good luck with the session!_`,
    type: "success" as const,
  };
}

async function getTodayTimetable() {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

  const { data: entries } = await supabase
    .from("timetable_entries")
    .select("*")
    .eq("day_of_week", today);

  const { data: courses } = await supabase.from("courses").select("*");
  const { data: faculty } = await supabase.from("faculty").select("*");
  const { data: slots } = await supabase.from("time_slots").select("*").order("slot_order");
  const { data: classrooms } = await supabase.from("classrooms").select("*");

  if (!entries || entries.length === 0) {
    return {
      content: `📅 **No classes today (${today})**\n\nEnjoy your day! 🎉`,
      type: "info" as const,
    };
  }

  const lines = (entries as any[])
    .map((e) => {
      const course = (courses as any[])?.find((c) => c["id"] === e["course_id"]);
      const slot = (slots as any[])?.find((s) => s["id"] === e["time_slot_id"]);
      const room = (classrooms as any[])?.find((c) => c["id"] === e["classroom_id"]);
      return `• **${slot?.["start_time"] ?? "—"}** · ${course?.["code"] ?? ""} ${course?.["name"]?.split("(")[0] ?? ""} · ${room?.["name"] ?? "—"}`;
    })
    .sort();

  return {
    content: `📅 **Today's Schedule (${today})**\n\n${lines.join("\n")}`,
    type: "info" as const,
  };
}

async function getFreeLabs() {
  const { data: labs } = await supabase
    .from("laboratories")
    .select("*")
    .eq("status", "available")
    .order("capacity", { ascending: false })
    .limit(5);

  if (!labs || labs.length === 0) {
    return {
      content: "❌ **No labs available right now.**",
      type: "warning" as const,
    };
  }

  const list = (labs as any[])
    .map((l) => `• **${l["name"]}** · ${l["capacity"]} seats · ${l["computers"]} PCs · ${l["building"]}`)
    .join("\n");

  return {
    content: `💻 **Available Labs (${labs.length}):**\n\n${list}`,
    type: "success" as const,
  };
}

async function getFreeClassrooms() {
  const { data: rooms } = await supabase
    .from("classrooms")
    .select("*")
    .eq("status", "available")
    .order("capacity", { ascending: false })
    .limit(5);

  if (!rooms || rooms.length === 0) {
    return { content: "❌ **No classrooms available right now.**", type: "warning" as const };
  }

  const list = (rooms as any[])
    .map((r) => `• **${r["name"]}** · ${r["capacity"]} seats · ${r["building"]}`)
    .join("\n");

  return {
    content: `🏫 **Available Classrooms (${rooms.length}):**\n\n${list}`,
    type: "success" as const,
  };
}

async function getBusInfo() {
  const { data: buses } = await supabase.from("buses").select("*").limit(5);
  const { data: routes } = await supabase.from("routes").select("*");

  if (!buses || buses.length === 0) {
    return { content: "🚌 No bus data available.", type: "info" as const };
  }

  const list = (buses as any[])
    .map((b) => {
      const route = (routes as any[])?.find((r) => r["id"] === b["route_id"]);
      const icon = b["status"] === "en-route" ? "🟢" : b["status"] === "idle" ? "⚪" : "🔧";
      return `${icon} **${b["bus_number"]}** · ${route?.["name"] ?? "—"} · ${b["passengers"]}/${b["capacity"]}`;
    })
    .join("\n");

  return {
    content: `🚌 **MITS Bus Fleet:**\n\n${list}`,
    type: "info" as const,
  };
}

async function getConflicts() {
  const { data: conflicts } = await supabase
    .from("conflicts")
    .select("*")
    .eq("status", "open")
    .limit(5);

  if (!conflicts || conflicts.length === 0) {
    return { content: "✅ **No open conflicts!**", type: "success" as const };
  }

  const list = (conflicts as any[])
    .map((c) => {
      const icon = c["severity"] === "critical" ? "🔴" : c["severity"] === "high" ? "🟠" : "🟡";
      return `${icon} **${c["title"]}**`;
    })
    .join("\n");

  return {
    content: `⚠️ **Open Conflicts (${conflicts.length}):**\n\n${list}`,
    type: "warning" as const,
  };
}

async function getSystemStatus() {
  const { data: agents } = await supabase.from("agents").select("*");
  const { data: conflicts } = await supabase.from("conflicts").select("*").eq("status", "open");

  const active = (agents as any[])?.filter((a) => a["status"] === "active").length || 0;
  const avgSuccess =
    (agents as any[])?.reduce((acc, a) => acc + (a["success_rate"] || 0), 0) /
    ((agents as any[])?.length || 1);

  return {
    content:
      `🖥️ **System Status:**\n\n` +
      `🤖 Agents online: **${agents?.length ?? 0}**\n` +
      `✅ Active agents: **${active}**\n` +
      `📈 Average success rate: **${Math.round(avgSuccess)}%**\n` +
      `⚠️ Open conflicts: **${conflicts?.length ?? 0}**\n\n` +
      `_All systems operational_ ✅`,
    type: "success" as const,
  };
}

async function getResources() {
  const { data: resources } = await supabase.from("resources").select("*").limit(6);

  if (!resources || resources.length === 0) {
    return { content: "📦 No resources found.", type: "info" as const };
  }

  const list = (resources as any[])
    .map((r) => `• **${r["name"]}** · ${r["available"]}/${r["quantity"]} · ${r["location"] ?? "—"}`)
    .join("\n");

  return {
    content: `📦 **Resources:**\n\n${list}`,
    type: "info" as const,
  };
}

async function getStats() {
  const [students, faculty, classrooms, labs, buses] = await Promise.all([
    supabase.from("students").select("*", { count: "exact", head: true }),
    supabase.from("faculty").select("*", { count: "exact", head: true }),
    supabase.from("classrooms").select("*", { count: "exact", head: true }),
    supabase.from("laboratories").select("*", { count: "exact", head: true }),
    supabase.from("buses").select("*", { count: "exact", head: true }),
  ]);

  return {
    content:
      `📊 **MITS Campus Statistics:**\n\n` +
      `👨‍🎓 Students: **${students.count ?? 0}**\n` +
      `👨‍🏫 Faculty: **${faculty.count ?? 0}**\n` +
      `🏫 Classrooms: **${classrooms.count ?? 0}**\n` +
      `💻 Laboratories: **${labs.count ?? 0}**\n` +
      `🚌 Buses: **${buses.count ?? 0}**\n\n` +
      `_Live data from the campus database._`,
    type: "success" as const,
  };
}
=======
>>>>>>> 4ed5064e0872a8573dbceff1cf59df711efc6f87
