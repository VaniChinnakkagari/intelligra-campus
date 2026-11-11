import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Boxes,
  Brain,
  Bus,
  CalendarClock,
  Eye,
  Layers,
  Network,
  PlayCircle,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { AgentNetwork } from "@/components/landing/AgentNetwork";
import { GlassPanel, SectionHeading, StatCard, fadeUp } from "@/components/Glass";
import { Button } from "@/components/ui/button";
import { useTable } from "@/lib/api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MITS Campus AI — INTELLIGENT. CONNECTED. AUTONOMOUS." },
      {
        name: "description",
        content:
          "A multi-agent AI platform that coordinates classrooms, faculty, students, laboratories, timetables and transportation in real time.",
      },
      { property: "og:title", content: "MITS Campus AI — Intelligent Campus, Connected by AI" },
      {
        property: "og:description",
        content:
          "Ten cooperating AI agents, real BFS/DFS/A*/CSP algorithms and a 3D campus twin in one smart campus platform.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const BUILDING_INFO: Record<string, { rooms: number; labs: number; utilization: number; free: number }> = {
  kk:         { rooms: 24, labs: 3,  utilization: 72, free: 8 },
  west:       { rooms: 18, labs: 5,  utilization: 85, free: 3 },
  south:      { rooms: 30, labs: 2,  utilization: 68, free: 9 },
  circular:   { rooms: 4,  labs: 12, utilization: 74, free: 2 },
  npn:        { rooms: 22, labs: 6,  utilization: 79, free: 5 },
  east:       { rooms: 20, labs: 4,  utilization: 71, free: 6 },
  industrial: { rooms: 8,  labs: 8,  utilization: 65, free: 3 },
  canteen:    { rooms: 0,  labs: 0,  utilization: 55, free: 0 },
  auditorium: { rooms: 1,  labs: 0,  utilization: 32, free: 1 },
  library:    { rooms: 12, labs: 0,  utilization: 64, free: 5 },
  research:   { rooms: 15, labs: 6,  utilization: 82, free: 4 },
};
const CAMPUS_HOTSPOTS = [
  { id: "kk",         label: "KK Block",         shortLabel: "KK",        x: 73.9, y: 66.8 },
  { id: "west",       label: "West Block",       shortLabel: "West",      x: 82.0, y: 18.6 },
  { id: "south",      label: "South Block",      shortLabel: "South",     x: 54.2, y: 3.9 },
  { id: "circular",   label: "Circular Block",   shortLabel: "Circular",  x: 54.5, y: 24.7 },
  { id: "npn",        label: "NPN Block",        shortLabel: "NPN",       x: 34.2, y: 69.2 },
  { id: "east",       label: "East Block",       shortLabel: "East",      x: 28.6, y: 22.0 },
  { id: "industrial", label: "Industrial Block", shortLabel: "Industrial",x: 21.9, y: 23.5 },
  { id: "canteen",    label: "Canteen",          shortLabel: "Canteen",   x: 12.9, y: 23.3 },
  { id: "auditorium", label: "Auditorium",       shortLabel: "Auditorium",x: 43.6, y: 14.9 },
  { id: "library",    label: "Library",          shortLabel: "Library",   x: 66.5, y: 14.5 },
  { id: "research",   label: "Research Block",   shortLabel: "Research",  x: 89.1, y: 16.2 },
];

const FEATURES = [
  { icon: CalendarClock, title: "Intelligent Scheduling", body: "A CSP solver with constraint propagation generates conflict-free timetables." },
  { icon: Boxes, title: "Smart Resource Allocation", body: "Weighted scoring finds the best classroom, laboratory or resource for every request." },
  { icon: Network, title: "Multi-Agent Coordination", body: "Ten specialised agents negotiate through structured messages to solve a request." },
  { icon: Bus, title: "Intelligent Transportation", body: "A* search optimises campus routes, stops and bus assignments." },
  { icon: Brain, title: "AI Decision Support", body: "Every decision is explained: candidates checked, constraints failed, score earned." },
  { icon: Eye, title: "Real-Time Monitoring", body: "Watch agents process live requests inside the agent control centre." },
];

function Landing() {
  const [selected, setSelected] = useState<string | null>("cse");
  const [debugMode, setDebugMode] = useState(false);
  const [debugPosition, setDebugPosition] = useState<string | null>(null);

  const decisions = useTable("ai_decisions");
  const agents = useTable("agents");
  const conflicts = useTable("conflicts");

  const resolved = conflicts.data?.length
    ? Math.round((conflicts.data.filter((c) => c["status"] === "resolved").length / conflicts.data.length) * 100) || 83
    : 97;

  const building = CAMPUS_HOTSPOTS.find((b) => b.id === selected);
  const info = selected ? BUILDING_INFO[selected] : undefined;

  return (
    <main className="relative">
      {/* ---------- NAV ---------- */}
      <header className="fixed inset-x-0 top-0 z-40 px-4 pt-4">
        <nav className="glass-2 glass-inset mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 py-3">
          <Link to="/" className="flex items-center gap-2.5">
            <img
              src="/ai-core.png"
              alt="MITS Campus AI"
              className="size-8 rounded-lg object-cover ring-1 ring-primary/30"
            />
            <span className="font-display text-sm font-semibold tracking-tight">
              MITS <span className="text-primary">CAMPUS AI</span>
            </span>
          </Link>
          <div className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#campus" className="transition-colors hover:text-foreground">Campus</a>
            <a href="#agents" className="transition-colors hover:text-foreground">Agents</a>
            <a href="#features" className="transition-colors hover:text-foreground">Capabilities</a>
          </div>
          <Button asChild size="sm" className="rounded-xl">
            <Link to="/auth">Enter Campus</Link>
          </Button>
        </nav>
      </header>

      {/* ---------- HERO ---------- */}
      <section className="relative mx-auto grid max-w-6xl gap-10 px-4 pt-32 pb-16 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:pt-40">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-[10px] tracking-[0.24em] uppercase"
          >
            <Sparkles className="size-3 text-primary" />
            Multi-agent campus intelligence
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 26, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="mt-6 text-4xl leading-[1.05] font-bold sm:text-6xl"
          >
            INTELLIGENT CAMPUS.
            <br />
            <span className="aurora-text">CONNECTED BY AI.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-5 max-w-xl text-base text-muted-foreground"
          >
            A multi-agent AI system built for Madanapalle Institute of Technology & Science —
            coordinating classrooms, faculty, students, labs, timetables and campus transportation in real time.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Button asChild size="lg" className="group rounded-xl shadow-glow">
              <Link to="/auth">
                ENTER MITS CAMPUS
                <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-xl bg-transparent">
              <Link to="/demo">
                <PlayCircle className="mr-1 size-4" />
                WATCH MITS CAMPUS
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4"
          >
            <StatCard label="Active agents" value={agents.data?.length || 10} icon={Network} />
            <StatCard label="Campus resources" value={128} suffix="+" icon={Boxes} delay={0.05} />
            <StatCard label="AI decisions" value={2486 + (decisions.data?.length ?? 0)} icon={Brain} delay={0.1} />
            <StatCard label="Conflicts resolved" value={resolved} suffix="%" icon={Layers} delay={0.15} />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.9 }}
          className="relative"
        >
          <GlassPanel level={2} className="relative h-[420px] overflow-hidden sm:h-[520px]">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            >
              <source src="/ai-video.mp4" type="video/mp4" />
            </video>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-background/80 to-transparent p-4 text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
              <span className="font-mono">Campus AI Core</span>
              <span className="font-mono">10 agents online</span>
            </div>
          </GlassPanel>
        </motion.div>
      </section>

      {/* ---------- FEATURES ---------- */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-20">
        <SectionHeading
          eyebrow="Capabilities"
          title="Everything a campus needs, coordinated by agents"
          subtitle="Each capability is backed by a real algorithm — not a mockup."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              {...fadeUp}
              whileInView={fadeUp.animate}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
            >
              <GlassPanel hover className="h-full p-6">
                <span className="grid size-10 place-items-center rounded-xl bg-primary/12 text-primary">
                  <f.icon className="size-5" />
                </span>
                <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
              </GlassPanel>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------- INTERACTIVE CAMPUS MAP ---------- */}
      <section id="campus" className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeading
          eyebrow="Digital twin"
          title="Explore the MITS campus"
          subtitle="Click any building to inspect live room, laboratory and utilization data."
        />

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          {/* Interactive map */}
          <GlassPanel level={2} className="relative overflow-hidden">
            <div className="relative aspect-[4/3] w-full">
              {/* Campus image with debug click */}
              <img
                src="/mits-campus.png"
                alt="MITS Campus Map"
                className="absolute inset-0 h-full w-full object-cover cursor-crosshair"
                onClick={(e) => {
                  if (!debugMode) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                  setDebugPosition(`x: ${x.toFixed(1)}  y: ${y.toFixed(1)}`);
                }}
              />

              {/* Dark overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-background/30" />

              {/* Hotspot markers */}
              {CAMPUS_HOTSPOTS.map((spot) => (
                <button
                  key={spot.id}
                  onClick={() => setSelected(spot.id)}
                  style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                  className={`group absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                    selected === spot.id ? "scale-125 z-20" : "hover:scale-125 z-10"
                  }`}
                  title={spot.label}
                >
                  <span
                    className={`absolute inset-0 -m-3 rounded-full ${
                      selected === spot.id ? "bg-primary/30" : "bg-primary/20"
                    } animate-ping`}
                    style={{ animationDuration: "2s" }}
                  />
                  <span
                    className={`relative grid size-4 place-items-center rounded-full ring-2 ring-white/80 shadow-lg ${
                      selected === spot.id ? "bg-primary" : "bg-cyan-400"
                    }`}
                  />
                  <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-background/90 px-2 py-1 text-[10px] font-medium tracking-wider uppercase opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                    {spot.label}
                  </span>
                </button>
              ))}

              {/* Legend */}
              <div className="absolute bottom-3 left-3 glass-2 rounded-xl p-3 text-[10px]">
                <p className="font-mono uppercase tracking-widest text-muted-foreground mb-2">
                  Click to explore
                </p>
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-muted-foreground">Building marker</span>
                </div>
              </div>

              {/* Top-right info + debug */}
              <div className="absolute top-3 right-3 glass-2 rounded-xl px-3 py-1.5 text-[10px] space-y-1">
                <div>
                  <span className="font-mono text-primary">
                    {CAMPUS_HOTSPOTS.length} buildings
                  </span>
                </div>
                <div>
                  <span className="font-mono text-cyan-400">
                    {debugPosition || "Debug OFF"}
                  </span>
                </div>
              </div>
            </div>
          </GlassPanel>

          {/* Detail panel */}
          <GlassPanel level={3} className="flex flex-col gap-4 p-6">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[10px] tracking-[0.24em] text-primary uppercase">
                Selected structure
              </p>
              <button
                onClick={() => setDebugMode(!debugMode)}
                className={`rounded-lg px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider transition-all ${
                  debugMode
                    ? "bg-red-500/20 text-red-400"
                    : "glass text-muted-foreground"
                }`}
              >
                {debugMode ? "● Debug ON" : "Debug OFF"}
              </button>
            </div>

            <h3 className="text-2xl font-semibold">{building?.label ?? "Select a building"}</h3>

            {info ? (
              <dl className="grid grid-cols-2 gap-3 text-sm">
                {[
                  ["Rooms", info.rooms],
                  ["Labs", info.labs],
                  ["Utilization", `${info.utilization}%`],
                  ["Available rooms", info.free],
                ].map(([k, v]) => (
                  <div key={String(k)} className="glass rounded-xl p-3">
                    <dt className="text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
                      {k}
                    </dt>
                    <dd className="mt-1 text-lg font-semibold">{v}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="text-sm text-muted-foreground">
                Click any glowing marker on the map to inspect that structure.
              </p>
            )}

            <div className="mt-auto flex flex-wrap gap-2">
              {CAMPUS_HOTSPOTS.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setSelected(b.id)}
                  className={`rounded-lg px-2.5 py-1 font-mono text-[10px] tracking-wider uppercase transition-all ${
                    selected === b.id
                      ? "bg-primary/20 text-primary"
                      : "glass text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {b.shortLabel ?? b.label}
                </button>
              ))}
            </div>
          </GlassPanel>
        </div>
      </section>

      {/* ---------- AGENT NETWORK ---------- */}
      <section id="agents" className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeading
          eyebrow="Coordination"
          title="THE CAMPUS THINKS AS ONE"
          subtitle="The coordinator agent decomposes every request and negotiates with nine specialised agents."
        />
        <div className="mt-8 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <AgentNetwork />
          <div className="grid gap-3">
            {[
              ["Student & Faculty agents", "Interpret intent and validate incoming requests."],
              ["Classroom, Timetable & Resource agents", "Search, schedule and verify campus capacity."],
              ["Conflict & Decision agents", "Reject invalid options and explain the winning choice."],
            ].map(([t, b]) => (
              <GlassPanel key={t} hover className="p-5">
                <h3 className="text-base font-semibold">{t}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{b}</p>
              </GlassPanel>
            ))}
            <GlassPanel level={3} className="p-5">
              <p className="font-mono text-[10px] tracking-[0.2em] text-primary uppercase">Live demo</p>
              <p className="mt-2 text-sm text-muted-foreground">
             Watch the MITS campus tour — the home of this AI system.
              </p>
              <Button asChild className="mt-4 w-full rounded-xl">
                <Link to="/demo">WATCH MITS CAMPUS VIDEO</Link>
              </Button>
            </GlassPanel>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-4 py-14">
        <GlassPanel level={2} className="flex flex-col items-center gap-4 p-10 text-center">
          <h2 className="text-2xl font-semibold sm:text-3xl">
            Ready to enter the <span className="aurora-text">smart campus</span>?
          </h2>
          <p className="max-w-lg text-sm text-muted-foreground">
            Sign in as a student, faculty member or administrator and watch the agent network coordinate your campus.
          </p>
          <Button asChild size="lg" className="rounded-xl shadow-glow">
            <Link to="/auth">ENTER MITS CAMPUS</Link>
          </Button>
          <p className="mt-4 font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
            MITS Campus AI · Multi-agent smart campus management system
          </p>
        </GlassPanel>
      </footer>
    </main>
  );
}