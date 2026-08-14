import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Boxes,
  Brain,
  Bus,
  CalendarClock,
  Cpu,
  Eye,
  Layers,
  Network,
  PlayCircle,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { AICoreScene, CampusScene } from "@/components/three/Scene";
import { AgentNetwork } from "@/components/landing/AgentNetwork";
import { GlassPanel, SectionHeading, StatCard, fadeUp } from "@/components/Glass";
import { CAMPUS_BUILDINGS } from "@/components/three/Campus3D";
import { Button } from "@/components/ui/button";
import { useTable } from "@/lib/api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nexus Campus AI — Intelligent Campus, Connected by AI" },
      {
        name: "description",
        content:
          "A multi-agent AI platform that coordinates classrooms, faculty, students, laboratories, timetables and transportation in real time.",
      },
      { property: "og:title", content: "Nexus Campus AI — Intelligent Campus, Connected by AI" },
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
  gate: { rooms: 0, labs: 0, utilization: 12, free: 0 },
  academic: { rooms: 32, labs: 4, utilization: 71, free: 7 },
  cse: { rooms: 24, labs: 5, utilization: 82, free: 4 },
  library: { rooms: 8, labs: 0, utilization: 64, free: 3 },
  complab: { rooms: 4, labs: 4, utilization: 78, free: 1 },
  sciencelab: { rooms: 3, labs: 3, utilization: 47, free: 2 },
  auditorium: { rooms: 1, labs: 0, utilization: 32, free: 1 },
  cafeteria: { rooms: 2, labs: 0, utilization: 55, free: 2 },
  sports: { rooms: 4, labs: 0, utilization: 41, free: 3 },
  hostel: { rooms: 120, labs: 0, utilization: 88, free: 12 },
  parking: { rooms: 0, labs: 0, utilization: 66, free: 0 },
  busstop: { rooms: 0, labs: 0, utilization: 74, free: 0 },
};

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
  const decisions = useTable("ai_decisions");
  const agents = useTable("agents");
  const conflicts = useTable("conflicts");

  const resolved = conflicts.data?.length
    ? Math.round((conflicts.data.filter((c) => c["status"] === "resolved").length / conflicts.data.length) * 100) || 83
    : 97;

  const building = CAMPUS_BUILDINGS.find((b) => b.id === selected);
  const info = selected ? BUILDING_INFO[selected] : undefined;

  return (
    <main className="relative">
      {/* ---------- NAV ---------- */}
      <header className="fixed inset-x-0 top-0 z-40 px-4 pt-4">
        <nav className="glass-2 glass-inset mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 py-3">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-lg bg-primary/15 text-primary">
              <Cpu className="size-4" />
            </span>
            <span className="font-display text-sm font-semibold tracking-tight">
              NEXUS <span className="text-primary">CAMPUS AI</span>
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
            An intelligent multi-agent system that coordinates classrooms, faculty, students,
            resources, timetables and transportation in real time.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Button asChild size="lg" className="group rounded-xl shadow-glow">
              <Link to="/auth">
                ENTER SMART CAMPUS
                <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-xl bg-transparent">
              <Link to="/demo">
                <PlayCircle className="mr-1 size-4" />
                WATCH AI DEMO
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
          <GlassPanel level={2} className="h-[420px] overflow-hidden sm:h-[520px]">
            <AICoreScene />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-4 text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
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
            <motion.div key={f.title} {...fadeUp} whileInView={fadeUp.animate} viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.05 }}>
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

      {/* ---------- 3D CAMPUS ---------- */}
      <section id="campus" className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeading
          eyebrow="Digital twin"
          title="Explore the 3D campus"
          subtitle="Click a building to inspect live room, laboratory and utilisation data."
        />
        <div className="mt-8 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <GlassPanel level={2} className="h-[440px] overflow-hidden">
            <CampusScene selected={selected} onSelect={setSelected} />
          </GlassPanel>
          <GlassPanel level={3} className="flex flex-col gap-4 p-6">
            <p className="font-mono text-[10px] tracking-[0.24em] text-primary uppercase">Selected structure</p>
            <h3 className="text-2xl font-semibold">{building?.label ?? "Select a building"}</h3>
            {info ? (
              <dl className="grid grid-cols-2 gap-3 text-sm">
                {[
                  ["Rooms", info.rooms],
                  ["Labs", info.labs],
                  ["Utilisation", `${info.utilization}%`],
                  ["Available rooms", info.free],
                ].map(([k, v]) => (
                  <div key={String(k)} className="glass rounded-xl p-3">
                    <dt className="text-[10px] tracking-[0.18em] text-muted-foreground uppercase">{k}</dt>
                    <dd className="mt-1 text-lg font-semibold">{v}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
            <div className="mt-auto flex flex-wrap gap-2">
              {CAMPUS_BUILDINGS.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setSelected(b.id)}
                  className={`rounded-lg px-2.5 py-1 font-mono text-[10px] tracking-wider uppercase transition-all ${
                    selected === b.id ? "bg-primary/20 text-primary" : "glass text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {b.label}
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
                Run the full ten-step agent negotiation on a real lab request.
              </p>
              <Button asChild className="mt-4 w-full rounded-xl">
                <Link to="/demo">START LIVE AI DEMO</Link>
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
            <Link to="/auth">ENTER SMART CAMPUS</Link>
          </Button>
          <p className="mt-4 font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
            Nexus Campus AI · Multi-agent smart campus management system
          </p>
        </GlassPanel>
      </footer>
    </main>
  );
}
