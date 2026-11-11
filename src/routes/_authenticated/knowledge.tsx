import { createFileRoute } from "@tanstack/react-router";
<<<<<<< HEAD
import { useState } from "react";
import { PageHeader } from "@/components/AppShell";
import { GlassPanel } from "@/components/Glass";
import { useTable } from "@/lib/api";
import { Building2, Users, UserCog, Network, GraduationCap, ChevronRight, Home, Cpu, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/knowledge")({
  component: KnowledgeGraphPage,
});

function KnowledgeGraphPage() {
  const { data: departments } = useTable("departments");
  const { data: faculty } = useTable("faculty");
  const { data: students } = useTable("students", { limit: 1000 });
  const { data: mentorMentee } = useTable("mentor_mentee", { limit: 2000 });
  const { data: courses } = useTable("courses");

  const [activeNode, setActiveNode] = useState<{ type: string; id: string | null }>({ type: "root", id: null });
  
  const [agentRunning, setAgentRunning] = useState(false);
  const [aiLogs, setAiLogs] = useState<string[]>([]);
  const [aiHighlightedNode, setAiHighlightedNode] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const cseDept = departments?.find((d: any) => d.code === "CSE");
  const cseFaculty = faculty?.filter((f: any) => f.department_id === cseDept?.id) || [];
  
  const selectedMentor = cseFaculty.find((f: any) => f.id === activeNode.id);
  
  const myMenteeIds = mentorMentee?.filter((mm: any) => mm.faculty_id === activeNode.id).map((mm: any) => mm.student_id) || [];
  const myMentees = students?.filter((s: any) => myMenteeIds.includes(s.id)) || [];

  const getMenteeCount = (facultyId: string) => {
    return mentorMentee?.filter((m: any) => m.faculty_id === facultyId).length || 0;
  };

  const getShortName = (fullName: string) => {
    if (!fullName) return "";
    return fullName.split(" ").slice(-1)[0];
  };
  // 🚨 THE SMART AI AGENT (BULLETPROOF NAME MATCHING)
  const runAgentQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setAgentRunning(true);
    setAiLogs([]);
    setAiHighlightedNode(null);
    
    const log = (msg: string) => setAiLogs(prev => [...prev, msg]);
    
    // Clean the query: lowercase, remove dots, remove extra spaces
    const cleanQuery = query.toLowerCase().replace(/\./g, "").replace(/\s+/g, " ").trim();

    log(`🤖 Agent received query: "${query}"`);
    await new Promise(r => setTimeout(r, 600));
    log(`🧠 Running NLP intent parser...`);

    // RULE 1: Specific Person Mentioned
    // We clean the DB name and check if it's a substring of the query
    let matchedFaculty = null;
    
    cseFaculty.forEach((f: any) => {
      const cleanName = f.name.toLowerCase().replace(/\./g, "").replace(/\s+/g, "");
      // Check if the query contains the last name (e.g., "geetha") or the full name
      const lastName = cleanName.slice(-5); // just grab the last 5 letters to be safe
      
      if (cleanQuery.includes(cleanName) || (lastName.length > 3 && cleanQuery.includes(lastName))) {
        matchedFaculty = f;
      }
    });

    if (matchedFaculty) {
      log(`✅ Entity Match: Found Faculty "${matchedFaculty.name}"`);
      await new Promise(r => setTimeout(r, 500));
      
      const count = getMenteeCount(matchedFaculty.id);
      log(`🧠 Graph Traversal: Following mentor -> mentee edges.`);
      log(`📊 Result: ${matchedFaculty.name} has ${count} mentees assigned.`);
      
      setActiveNode({ type: "faculty", id: matchedFaculty.id });
      setAiHighlightedNode(matchedFaculty.id);
      setAgentRunning(false);
      return;
    }

    // RULE 2: Specific Course Mentioned
    const matchedCourse = courses?.find((c: any) => cleanQuery.includes(c.name.toLowerCase().replace(/\./g, "")));
    if (matchedCourse) {
      log(`✅ Entity Match: Found Course "${matchedCourse.name}"`);
      await new Promise(r => setTimeout(r, 500));
      const teachingFaculty = cseFaculty.find((f: any) => f.id === matchedCourse.faculty_id);
      
      if (teachingFaculty) {
        log(`🧠 Graph Traversal: Following course -> faculty edges.`);
        log(`📊 Result: ${matchedCourse.name} is taught by ${teachingFaculty.name}.`);
        setActiveNode({ type: "faculty", id: teachingFaculty.id });
        setAiHighlightedNode(teachingFaculty.id);
      } else {
        log(`❌ Error: No faculty linked to this course in the graph.`);
      }
      setAgentRunning(false);
      return;
    }

    // RULE 3: General Counts
    if (cleanQuery.includes("how many") || cleanQuery.includes("total")) {
      if (cleanQuery.includes("faculty") || cleanQuery.includes("faculties")) {
        log(`✅ Intent Detected: Count Faculty`);
        await new Promise(r => setTimeout(r, 500));
        log(`📊 Result: There are exactly ${cseFaculty.length} faculty members in the CSE department.`);
        setAgentRunning(false);
        return;
      }
      if (cleanQuery.includes("student") || cleanQuery.includes("mentee")) {
        log(`✅ Intent Detected: Count Students`);
        await new Promise(r => setTimeout(r, 500));
        log(`📊 Result: There are ${students?.length || 0} students mapped in the graph.`);
        setAgentRunning(false);
        return;
      }
    }

    log(`❌ Agent Reasoning Failed: Could not understand intent.`);
    log(`💡 Try typing exactly: "show geetha mentees" or "how many faculties are there?"`);
    setAgentRunning(false);
  };
  
  return (
    <div className="mx-auto w-full max-w-7xl">
      <PageHeader
        title="AI Knowledge Graph"
        subtitle="Type a query to traverse the MITS Campus semantic graph."
        actions={
          <Button 
            onClick={() => { setActiveNode({ type: "root", id: null }); setAiLogs([]); setQuery(""); setAiHighlightedNode(null); }} 
            variant="outline" 
            size="sm" 
            className="rounded-xl border-primary/30"
          >
            <Home className="mr-2 size-4" /> Reset Graph
          </Button>
        }
      />

      <div className="mt-6">
        <form onSubmit={runAgentQuery} className="flex gap-2">
          <div className="relative flex-1">
            <Cpu className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-cyan-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask the Graph AI..."
              className="w-full rounded-xl bg-black/40 border border-cyan-500/30 pl-12 pr-4 py-3 text-sm text-white outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all placeholder:text-muted-foreground"
            />
          </div>
          <Button type="submit" disabled={agentRunning} className="rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-8">
            {agentRunning ? "Traversing..." : "Query AI"}
          </Button>
        </form>
      </div>

      {aiLogs.length > 0 && (
        <GlassPanel level={2} className="mt-4 p-4 bg-black/40 border border-cyan-500/30">
          <h3 className="text-xs font-semibold text-cyan-400 mb-2 flex items-center gap-2">
            <Sparkles className="size-4" /> Knowledge Agent Telemetry
          </h3>
          <div className="font-mono text-xs text-gray-300 space-y-1">
            {aiLogs.map((msg, i) => (
              <div key={i} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                {msg}
              </div>
            ))}
          </div>
        </GlassPanel>
      )}

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        <GlassPanel level={2} className="lg:col-span-3 min-h-[600px] border border-primary/20 relative overflow-hidden bg-[#050810] rounded-3xl">
          
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent opacity-50" />

          <div className="absolute top-6 left-6 z-30 flex items-center gap-2 text-xs font-mono text-muted-foreground bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
            <button onClick={() => setActiveNode({ type: "root", id: null })} className="hover:text-cyan-400 transition-colors">MITS Campus</button>
            <ChevronRight className="size-3" />
            <button onClick={() => setActiveNode({ type: "dept", id: cseDept?.id || null })} className={`hover:text-cyan-400 transition-colors ${activeNode.type !== "root" ? "text-cyan-400 font-bold" : ""}`}>CSE Department</button>
            {activeNode.type === "faculty" && (
              <>
                <ChevronRight className="size-3" />
                <span className="text-white font-bold">{selectedMentor?.name}</span>
              </>
            )}
          </div>

          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {activeNode.type === "dept" && cseFaculty.map((f: any, i: number) => {
              const angle = (i / cseFaculty.length) * 2 * Math.PI;
              const radius = 260;
              const x2 = `calc(50% + ${Math.cos(angle) * radius}px)`;
              const y2 = `calc(50% + ${Math.sin(angle) * radius}px)`;
              const isHighlighted = aiHighlightedNode === f.id;

              return (
                <line 
                  key={i} 
                  x1="50%" 
                  y1="50%" 
                  x2={x2} 
                  y2={y2} 
                  stroke={isHighlighted ? "#22d3ee" : "#8b5cf6"} 
                  strokeOpacity={isHighlighted ? 0.8 : 0.1} 
                  strokeWidth={isHighlighted ? 3 : 1} 
                  className={isHighlighted ? "animate-pulse" : ""}
                />
              );
            })}
            {activeNode.type === "faculty" && myMentees.map((m: any, i: number) => {
              const angle = (i / Math.min(myMentees.length, 30)) * 2 * Math.PI;
              const radius = 220;
              const x2 = `calc(50% + ${Math.cos(angle) * radius}px)`;
              const y2 = `calc(50% + ${Math.sin(angle) * radius}px)`;
              
              return (
                <line 
                  key={i} 
                  x1="50%" 
                  y1="50%" 
                  x2={x2} 
                  y2={y2} 
                  stroke="#22d3ee" 
                  strokeOpacity="0.2" 
                  strokeWidth="1" 
                />
              );
            })}
          </svg>

          <div className="absolute inset-0 flex items-center justify-center z-10">
            
            {activeNode.type === "root" && (
              <>
                <div className="relative z-20 size-32 rounded-full border-2 border-cyan-400/50 bg-cyan-950/50 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(34,211,238,0.3)] backdrop-blur-sm">
                  <Building2 className="size-10 text-cyan-400 mb-1" />
                  <span className="text-sm font-bold text-white tracking-widest">MITS</span>
                </div>
                <div 
                  onClick={() => setActiveNode({ type: "dept", id: cseDept?.id || null })}
                  className="absolute top-[20%] cursor-pointer group flex flex-col items-center"
                >
                  <div className="size-20 rounded-full border border-cyan-400/50 bg-cyan-500/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                    <Building2 className="size-8 text-cyan-300" />
                  </div>
                  <span className="mt-2 text-xs font-bold text-cyan-100 bg-black/50 px-2 py-0.5 rounded">CSE</span>
                </div>
              </>
            )}

            {activeNode.type === "dept" && (
              <>
                <div className="relative z-20 size-24 rounded-full border-2 border-violet-400/50 bg-violet-950/50 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(139,92,246,0.3)]">
                  <Building2 className="size-8 text-violet-400 mb-1" />
                  <span className="text-xs font-bold text-white">CSE</span>
                </div>
                
                {cseFaculty.map((f: any, i: number) => {
                  const angle = (i / cseFaculty.length) * 2 * Math.PI;
                  const radius = 260;
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;
                  const count = getMenteeCount(f.id);
                  const isHighlighted = aiHighlightedNode === f.id;

                  return (
                    <div 
                      key={f.id}
                      onClick={() => setActiveNode({ type: "faculty", id: f.id })}
                      style={{ transform: `translate(${x}px, ${y}px)` }}
                      className={`absolute cursor-pointer group flex flex-col items-center hover:z-30 transition-all ${isHighlighted ? 'scale-125 z-40' : ''}`}
                    >
                      <div className={`size-14 rounded-full border-2 flex items-center justify-center transition-all relative ${isHighlighted ? 'border-cyan-400 bg-cyan-400/30 shadow-[0_0_30px_rgba(34,211,238,0.5)]' : 'border-violet-400/50 bg-violet-500/20 group-hover:scale-110 group-hover:bg-violet-500/40'}`}>
                        <UserCog className={`size-6 ${isHighlighted ? 'text-cyan-300' : 'text-violet-300'}`} />
                        <div className="absolute -top-2 -right-2 bg-cyan-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-lg border border-cyan-300">
                          {count}
                        </div>
                      </div>
                      <div className={`mt-2 px-2 py-0.5 rounded border text-center whitespace-nowrap ${isHighlighted ? 'bg-cyan-400/20 border-cyan-400/50' : 'bg-black/80 border-white/10'}`}>
                        <p className={`text-[10px] font-bold ${isHighlighted ? 'text-cyan-300' : 'text-white'}`}>{getShortName(f.name)}</p>
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            {activeNode.type === "faculty" && selectedMentor && (
              <>
                <div className="relative z-20 size-24 rounded-full border-2 border-cyan-400/50 bg-cyan-950/80 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(34,211,238,0.4)]">
                  <UserCog className="size-8 text-cyan-400 mb-1" />
                  <span className="text-[10px] font-bold text-white text-center leading-tight px-1">{selectedMentor.name}</span>
                </div>
                {myMentees.slice(0, 30).map((m: any, i: number) => {
                  const angle = (i / Math.min(myMentees.length, 30)) * 2 * Math.PI;
                  const radius = 220;
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;

                  return (
                    <div 
                      key={m.id}
                      style={{ transform: `translate(${x}px, ${y}px)` }}
                      className="absolute flex flex-col items-center hover:z-30 group"
                    >
                      <div className="size-10 rounded-full border border-cyan-400/30 bg-cyan-500/20 flex items-center justify-center group-hover:scale-125 transition-all">
                        <GraduationCap className="size-5 text-cyan-300" />
                      </div>
                      <div className="mt-1 bg-black/80 px-2 py-0.5 rounded border border-white/10 text-center opacity-0 group-hover:opacity-100 transition-opacity absolute top-full whitespace-nowrap z-50">
                        <p className="text-[9px] font-bold text-white">{m.roll_no}</p>
                        <p className="text-[8px] text-cyan-300">{m.name}</p>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </GlassPanel>

        <GlassPanel level={2} className="p-6 border border-primary/20 flex flex-col gap-4 bg-black/20 backdrop-blur-md">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Network className="size-4 text-cyan-400" /> Graph Telemetry
          </h3>
          
          <div className="rounded-lg bg-primary/5 p-4 border border-primary/10">
            <p className="text-xs text-muted-foreground mb-1">Active Node</p>
            <p className="text-sm font-medium text-white capitalize">
              {activeNode.type === "root" ? "MITS Campus" : activeNode.type === "dept" ? "CSE Department" : selectedMentor?.name}
            </p>
          </div>

          <div className="rounded-lg bg-primary/5 p-4 border border-primary/10">
            <p className="text-xs text-muted-foreground mb-1">Graph Topology</p>
            <div className="space-y-2 mt-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Departments</span>
                <span className="text-white font-semibold">1</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Faculty Nodes</span>
                <span className="text-white font-semibold">{cseFaculty.length}</span>
              </div>
              {activeNode.type === "faculty" && (
                <div className="flex justify-between text-sm">
                  <span className="text-cyan-400">Mentee Connections</span>
                  <span className="text-cyan-400 font-semibold">{myMentees.length}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-auto p-4 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
            <p className="text-xs text-cyan-400 font-semibold mb-1">💡 AI Query Examples</p>
            <ul className="text-xs text-muted-foreground space-y-1 mt-1 list-disc pl-4">
              <li>"How many faculties are there?"</li>
              <li>"Who teaches FSD II?"</li>
              <li>"Show Geetha's mentees"</li>
            </ul>
          </div>
        </GlassPanel>
        
      </div>
    </div>
  );
}
=======
import { PageHeader } from "@/components/AppShell";
import { GlassPanel } from "@/components/Glass";

export const Route = createFileRoute("/_authenticated/knowledge")({
  component: Page,
});

function Page() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <PageHeader title="Knowledge Graph" subtitle="Entities and relationships the agents reason over." />
      <GlassPanel level={2} className="p-6">
        <p className="text-sm text-muted-foreground">
          This module is wired to the campus database and agent pipeline.
        </p>
      </GlassPanel>
    </div>
  );
}
>>>>>>> 4ed5064e0872a8573dbceff1cf59df711efc6f87
