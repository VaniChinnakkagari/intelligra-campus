import { createFileRoute } from "@tanstack/react-router";
<<<<<<< HEAD
import { useState } from "react";
import { createPortal } from "react-dom";
import { PageHeader } from "@/components/AppShell";
import { GlassPanel, StatusDot, Ring } from "@/components/Glass";
import { useTable } from "@/lib/api";
import { useSession } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { runRealPipeline } from "@/lib/ai/agent-functions";
import { type RequestSpec } from "@/lib/engine";
import { toast } from "sonner";
import { 
  Building2, Computer, Package, Activity, Cpu, Sparkles, 
  Search, Filter, X, CheckCircle2, Bot, Loader2, ShieldAlert,
  Network, CalendarClock, Boxes, UserCog, GraduationCap, Bus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
=======
import { PageHeader } from "@/components/AppShell";
import { GlassPanel } from "@/components/Glass";
>>>>>>> 4ed5064e0872a8573dbceff1cf59df711efc6f87

export const Route = createFileRoute("/_authenticated/resources")({
  component: Page,
});

<<<<<<< HEAD
// Matches the exact stages from your agents.tsx page
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

function Page() {
  const { user } = useSession();
  const { data: classrooms, isLoading: roomsLoading } = useTable('classrooms');
  const { data: laboratories, isLoading: labsLoading } = useTable('laboratories');
  const { data: resources, isLoading: resourcesLoading } = useTable('resources');

  const [filter, setFilter] = useState<"all" | "available">("all");
  const [search, setSearch] = useState("");

  // Modal & Pipeline State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pipelineRunning, setPipelineRunning] = useState(false);
  const [currentStage, setCurrentStage] = useState(-1);
  const [result, setResult] = useState<any | null>(null);

  // Form State
  const [requestType, setRequestType] = useState("Classroom");
  const [capacity, setCapacity] = useState(60);
  const [computers, setComputers] = useState(70);
  const [startTime, setStartTime] = useState("14:00");
  const [endTime, setEndTime] = useState("16:00");
  const [reason, setReason] = useState("");

  const isLoading = roomsLoading || labsLoading || resourcesLoading;

  // Filter Logic
  const filteredRooms = classrooms?.filter(c => {
    const matchesSearch = c.name?.toLowerCase().includes(search.toLowerCase()) || c.code?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || c.status === "available";
    return matchesSearch && matchesFilter;
  }) || [];

  const filteredLabs = laboratories?.filter(l => {
    const matchesSearch = l.name?.toLowerCase().includes(search.toLowerCase()) || l.code?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || l.status === "available";
    return matchesSearch && matchesFilter;
  }) || [];

  // 🚨 TRIGGER THE REAL AI PIPELINE
  const executePipeline = async (e: React.FormEvent) => {
    e.preventDefault();
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

      // 1. Run the real AI pipeline (faculty -> coordinator -> classroom -> etc)
      const pipelineResult = await runRealPipeline(
        spec,
        user?.email?.split("@")[0] ?? "User"
      );

      // 2. Animate the stages (visual effect while the real work finishes)
      for (let i = 0; i < pipelineResult.stages.length; i++) {
        await new Promise((r) => setTimeout(r, 400));
        setCurrentStage(i);
      }

      // 3. Save to the main Requests table so it shows in "My Requests"
      const winningRoom = pipelineResult.finalDecision.winner?.candidate?.name || "Pending Assignment";
      
      await supabase.from("requests").insert({
        request_type: requestType,
        capacity: capacity,
        requested_time: `${new Date().toISOString().split("T")[0]}T${startTime}`,
        reason: reason || "No reason provided",
        status: pipelineResult.finalDecision.winner ? "approved" : "pending",
        requester_name: user?.email?.split("@")[0] ?? "Geetha"
      });

      setResult(pipelineResult);

      if (pipelineResult.finalDecision.winner) {
        toast.success("✅ Real agents processed the request!", {
          description: `Allocated: ${winningRoom} at ${pipelineResult.finalDecision.winner.score}% score`,
        });
      } else {
        toast.warning("No valid candidate found", {
          description: "The agents couldn't find a matching room.",
        });
      }
    } catch (err) {
      console.error("Pipeline failed:", err);
      toast.error("Agent pipeline failed", { description: String(err) });
    } finally {
      setPipelineRunning(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setResult(null);
    setCurrentStage(-1);
    setPipelineRunning(false);
  };

  const RequestModal = () => {
    if (!isModalOpen) return null;

    return createPortal(
      <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
        <GlassPanel level={2} className="w-full max-w-2xl p-6 relative border-cyan-500/30 shadow-[0_0_50px_rgba(34,211,238,0.2)] bg-[#0a0f1c] max-h-[90vh] overflow-y-auto">
          <button 
            onClick={closeModal}
            disabled={pipelineRunning}
            className="absolute top-4 right-4 text-muted-foreground hover:text-white transition-colors disabled:opacity-50"
          >
            <X className="size-5" />
          </button>

          <div className="mb-6">
            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Cpu className="size-5 text-cyan-400" /> Request Resource Pipeline
            </h3>
            <p className="text-xs text-muted-foreground">The 8-Agent system will validate, allocate, and notify.</p>
          </div>

          {/* Form */}
          {!pipelineRunning && !result && (
            <form onSubmit={executePipeline} className="space-y-4">
              <div>
                <Label className="text-xs">Request Type</Label>
                <select
                  value={requestType}
                  onChange={(e) => setRequestType(e.target.value)}
                  className="w-full rounded-lg bg-black/40 border border-primary/20 px-3 py-2.5 text-sm mt-1 text-white outline-none focus:border-cyan-400"
                >
                  <option value="Classroom">Classroom</option>
                  <option value="Computer Laboratory">Computer Laboratory</option>
                  <option value="Science Laboratory">Science Laboratory</option>
                  <option value="Auditorium">Auditorium</option>
                  <option value="Study Pod">Study Pod</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Capacity</Label>
                  <Input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="bg-black/40 border-primary/20 text-white mt-1"
                    required
                  />
                </div>
                {requestType.includes("Computer") && (
                  <div>
                    <Label className="text-xs">Computers Needed</Label>
                    <Input
                      type="number"
                      value={computers}
                      onChange={(e) => setComputers(Number(e.target.value))}
                      className="bg-black/40 border-primary/20 text-white mt-1"
                      required
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
                    className="bg-black/40 border-primary/20 text-white mt-1 [color-scheme:dark]"
                    required
                  />
                </div>
                <div>
                  <Label className="text-xs">End Time</Label>
                  <Input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="bg-black/40 border-primary/20 text-white mt-1 [color-scheme:dark]"
                    required
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs">Reason</Label>
                <Input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Extra class for ATCD"
                  className="bg-black/40 border-primary/20 text-white mt-1"
                  required
                />
              </div>

              <Button type="submit" className="w-full mt-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold h-11">
                <Bot className="mr-2 size-4" /> Execute Real Agent Pipeline
              </Button>
            </form>
          )}

          {/* Pipeline Progress Animation */}
          {(pipelineRunning || result) && (
            <div className="space-y-3 mt-4">
              {PIPELINE_STAGES.map((stage, index) => {
                const isActive = index === currentStage;
                const isDone = index < currentStage || (result !== null);
                const Icon = AGENT_ICONS[stage.agent] || Bot;

                return (
                  <div
                    key={index}
                    className={cn(
                      "rounded-xl border p-3 transition-all duration-500",
                      isActive && "border-cyan-500/50 bg-cyan-500/10 shadow-[0_0_15px_rgba(34,211,238,0.2)] scale-[1.02]",
                      isDone && "border-green-400/30 bg-green-400/5",
                      !isActive && !isDone && "border-border/50 bg-black/20 opacity-40"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={cn(
                          "grid size-9 shrink-0 place-items-center rounded-xl transition-all",
                          isActive && "bg-cyan-500/20 text-cyan-400 scale-110",
                          isDone && "bg-green-400/15 text-green-400",
                          !isActive && !isDone && "bg-primary/5 text-muted-foreground"
                        )}
                      >
                        {isDone ? <CheckCircle2 className="size-5" /> : <Icon className="size-5" />}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-white">{stage.title}</p>
                          {isActive && (
                            <span className="flex items-center gap-1 text-[10px] text-cyan-400">
                              <span className="size-1.5 rounded-full bg-cyan-400 animate-pulse" /> Processing…
                            </span>
                          )}
                          {isDone && <span className="text-[10px] text-green-400">✓ Complete</span>}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{stage.task}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Final Result */}
          {result && (
            <div className="mt-6 animate-in slide-in-from-bottom-4 duration-300">
              {result.finalDecision.winner ? (
                <div className="rounded-xl border border-green-400/40 bg-green-400/10 p-5">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="size-6 text-green-400 shrink-0" />
                    <div className="w-full">
                      <p className="font-semibold text-green-400 text-lg">Pipeline Complete</p>
                      <div className="mt-3 bg-black/40 p-3 rounded-lg border border-white/5">
                        <p className="text-sm">
                          <strong>Allocated Room:</strong> <span className="text-cyan-400">{result.finalDecision.winner.candidate.name}</span>
                        </p>
                        <p className="text-xs mt-1 text-muted-foreground">
                          Confidence Score: <strong className="text-green-400">{result.finalDecision.winner.score}%</strong>
                        </p>
                        <p className="text-xs mt-1 text-muted-foreground italic mt-2">
                          {result.finalDecision.explanation?.slice(0, 120)}...
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button onClick={closeModal} className="mt-4 w-full rounded-xl bg-green-500 hover:bg-green-400 text-black font-bold">
                    Confirm & View Requests
                  </Button>
                </div>
              ) : (
                <div className="rounded-xl border border-red-400/40 bg-red-400/10 p-5">
                  <div className="flex items-start gap-3">
                    <ShieldAlert className="size-6 text-red-400 shrink-0" />
                    <div>
                      <p className="font-semibold text-red-400">No Valid Candidate</p>
                      <p className="text-sm mt-1 text-muted-foreground">
                        {result.finalDecision.explanation ?? "No suitable resource found."}
                      </p>
                    </div>
                  </div>
                  <Button onClick={closeModal} className="mt-4 w-full rounded-xl bg-red-500 hover:bg-red-400 text-white font-bold">
                    Close
                  </Button>
                </div>
              )}
            </div>
          )}
        </GlassPanel>
      </div>,
      document.body
    );
  };

  return (
    <div className="mx-auto w-full max-w-7xl relative">
      <PageHeader 
        title="Campus Resources" 
        subtitle="Real-time monitoring of classrooms, labs, and equipment." 
        actions={
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold shadow-glow"
          >
            <Sparkles className="mr-2 size-4" /> Request Resource
          </Button>
        }
      />
      
      {/* AI Agent Banner */}
      <GlassPanel level={2} className="mt-6 p-4 border border-cyan-500/30 bg-cyan-500/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-cyan-500/20 rounded-lg">
            <Cpu className="size-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              Facility Allocation Agent <span className="text-[10px] bg-cyan-500 text-black px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Active</span>
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              The AI Agent is monitoring {classrooms?.length || 0} rooms and {laboratories?.length || 0} labs. Currently, {classrooms?.filter(c => c.status === 'available').length || 0} rooms are available for immediate booking.
            </p>
          </div>
        </div>
        <div className="text-xs font-mono text-cyan-400 flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full border border-white/10">
          <span className="size-2 rounded-full bg-green-400 animate-pulse" /> Live Sync
        </div>
      </GlassPanel>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-6">
        <GlassPanel hover className="p-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <Building2 className="size-5 text-primary" />
            <span className="text-2xl font-semibold">{classrooms?.length || 0}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Classrooms</p>
        </GlassPanel>
        
        <GlassPanel hover className="p-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <Computer className="size-5 text-primary" />
            <span className="text-2xl font-semibold">{laboratories?.length || 0}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Laboratories</p>
        </GlassPanel>
        
        <GlassPanel hover className="p-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <Package className="size-5 text-primary" />
            <span className="text-2xl font-semibold">{resources?.length || 0}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Resources</p>
        </GlassPanel>
        
        <GlassPanel hover className="p-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <Activity className="size-5 text-green-400" />
            <span className="text-2xl font-semibold text-green-400">
              {classrooms?.filter(c => c.status === 'available').length || 0}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Available Rooms</p>
        </GlassPanel>
      </div>

      {/* Toolbar: Search & Filter */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search rooms or labs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl bg-black/40 border border-primary/20 pl-10 pr-4 py-2 text-sm text-white outline-none focus:border-cyan-400 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="size-4 text-muted-foreground" />
          <div className="flex bg-black/40 rounded-lg p-1 border border-primary/20">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${filter === "all" ? "bg-primary text-white" : "text-muted-foreground hover:text-white"}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("available")}
              className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${filter === "available" ? "bg-green-500 text-black" : "text-muted-foreground hover:text-white"}`}
            >
              Available Only
            </button>
          </div>
        </div>
      </div>

      {/* Classrooms Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Building2 className="size-5 text-cyan-400" /> Classrooms
        </h2>
        {isLoading ? (
          <GlassPanel className="p-12 text-center text-muted-foreground">Loading classrooms...</GlassPanel>
        ) : filteredRooms.length === 0 ? (
          <GlassPanel className="p-12 text-center text-muted-foreground">No classrooms found matching your search.</GlassPanel>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRooms.map((room) => (
              <GlassPanel key={room.id} hover className="p-4 transition-all hover:border-cyan-500/50">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-white">{room.name}</h3>
                    <p className="text-xs text-cyan-400 font-mono">{room.code} • {room.building}</p>
                  </div>
                  <StatusDot status={room.status} />
                </div>
                <div className="mt-3 flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">Capacity: <strong className="text-white">{room.capacity}</strong></span>
                  <span className="text-muted-foreground">Floor: <strong className="text-white">{room.floor}</strong></span>
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <Ring value={room.utilization || 0} label="Utilization" />
                  <div className="flex flex-col text-xs text-muted-foreground space-y-1">
                    <span>{room.has_projector ? '📽️ Projector Available' : '❌ No Projector'}</span>
                    <span>{room.has_smartboard ? '🖥️ Smart Board Active' : '❌ No Smart Board'}</span>
                  </div>
                </div>
              </GlassPanel>
            ))}
          </div>
        )}
      </div>

      {/* Laboratories Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Computer className="size-5 text-violet-400" /> Laboratories
        </h2>
        {isLoading ? (
          <GlassPanel className="p-12 text-center text-muted-foreground">Loading laboratories...</GlassPanel>
        ) : filteredLabs.length === 0 ? (
          <GlassPanel className="p-12 text-center text-muted-foreground">No laboratories found matching your search.</GlassPanel>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredLabs.map((lab) => (
              <GlassPanel key={lab.id} hover className="p-4 transition-all hover:border-violet-500/50">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-white">{lab.name}</h3>
                    <p className="text-xs text-violet-400 font-mono">{lab.code} • {lab.lab_type}</p>
                  </div>
                  <StatusDot status={lab.status} />
                </div>
                <div className="mt-3 flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">Capacity: <strong className="text-white">{lab.capacity}</strong></span>
                  <span className="text-muted-foreground">PCs: <strong className="text-white">{lab.computers}</strong></span>
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <Ring value={lab.utilization || 0} label="Utilization" />
                  <span className="text-xs text-muted-foreground">{lab.building}</span>
                </div>
                {lab.equipment?.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1">
                    {lab.equipment.slice(0, 3).map((item: string, i: number) => (
                      <span key={i} className="rounded bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 text-[10px] text-violet-300">
                        {item}
                      </span>
                    ))}
                    {lab.equipment.length > 3 && (
                      <span className="text-[10px] text-muted-foreground flex items-center pl-1">+{lab.equipment.length - 3} more</span>
                    )}
                  </div>
                )}
              </GlassPanel>
            ))}
          </div>
        )}
      </div>

      <RequestModal />
    </div>
  );
}
=======
function Page() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <PageHeader title="Resources & Labs" subtitle="Classrooms, laboratories and equipment with AI availability scoring." />
      <GlassPanel level={2} className="p-6">
        <p className="text-sm text-muted-foreground">
          This module is wired to the campus database and agent pipeline.
        </p>
      </GlassPanel>
    </div>
  );
}
>>>>>>> 4ed5064e0872a8573dbceff1cf59df711efc6f87
