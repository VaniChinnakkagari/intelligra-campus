import { createFileRoute, Link } from "@tanstack/react-router";
<<<<<<< HEAD
import { PageHeader } from "@/components/AppShell";
import { GlassPanel } from "@/components/Glass";
import {
  ExternalLink, Play, ArrowRight, Building2, Award, Users,
  MapPin, Sparkles, GraduationCap, BookOpen, Cpu, Trophy
} from "lucide-react";
import { Button } from "@/components/ui/button";
=======
import { GlassPanel } from "@/components/Glass";
>>>>>>> 4ed5064e0872a8573dbceff1cf59df711efc6f87

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
<<<<<<< HEAD
      { title: "About MITS Campus — MITS Campus AI" },
      {
        name: "description",
        content:
          "Madanapalle Institute of Technology & Science — a Deemed to be University, NAAC A+ accredited, driving innovation since 1998.",
      },
      { property: "og:title", content: "About MITS Campus" },
      {
        property: "og:description",
        content: "Discover MITS — where the smart campus AI system was built.",
      },
=======
      { title: "Live AI Demo — Nexus Campus AI" },
      { name: "description", content: "Watch the Nexus multi-agent system schedule, route and resolve conflicts in real time." },
      { property: "og:title", content: "Live AI Demo — Nexus Campus AI" },
      { property: "og:description", content: "A guided walkthrough of the Nexus campus multi-agent intelligence." },
>>>>>>> 4ed5064e0872a8573dbceff1cf59df711efc6f87
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
<<<<<<< HEAD
  component: Page,
});

const YOUTUBE_ID = "9wWB38Pkkak";
const YOUTUBE_URL = `https://youtu.be/${YOUTUBE_ID}`;
const EMBED_URL = `https://www.youtube-nocookie.com/embed/${YOUTUBE_ID}?rel=0&modestbranding=1`;

const HIGHLIGHTS = [
  {
    icon: Building2,
    title: "Established 1998",
    body: "Founded under the Ratakonda Ranga Reddy Educational Academy in the serene surroundings of Madanapalle, Andhra Pradesh.",
  },
  {
    icon: Award,
    title: "NAAC A+ Accredited",
    body: "Recognized with NAAC A+ grade and NBA accreditation. Now a Deemed to be University under UGC Act, 1956.",
  },
  {
    icon: Users,
    title: "5000+ Students",
    body: "A vibrant learning community across CSE, ECE, EEE, Mechanical, Civil, AI/ML, MBA and MCA programmes.",
  },
  {
    icon: MapPin,
    title: "26-Acre Campus",
    body: "Spacious 26.17-acre campus on the Madanapalle–Anantapur Highway (NH-42), near Angallu — 10 km from Madanapalle.",
  },
];

const PROGRAMMES = [
  { code: "CSE", name: "Computer Science and Engineering" },
  { code: "CST", name: "Computer Science and Technology" },
  { code: "CAI", name: "CSE (Artificial Intelligence)" },
  { code: "AIML", name: "AI and Machine Learning" },
  { code: "CSC", name: "Cyber Security" },
  { code: "CSD", name: "Data Science" },
  { code: "ECE", name: "Electronics and Communication" },
  { code: "EEE", name: "Electrical and Electronics" },
  { code: "MECH", name: "Mechanical Engineering" },
  { code: "CIVIL", name: "Civil Engineering" },
  { code: "MBA", name: "Business Administration" },
  { code: "MCA", name: "Computer Applications" },
];

function Page() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <PageHeader
        title="About MITS Campus"
        subtitle="Madanapalle Institute of Technology & Science — Deemed to be University"
        actions={
          <Button asChild variant="outline" className="gap-2 rounded-xl">
            <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="size-4" />
              View on YouTube
            </a>
          </Button>
        }
      />

      {/* Info banner */}
      <GlassPanel className="mb-6 p-3 text-xs text-muted-foreground">
        🎥 <strong>About the campus</strong> where the MITS Campus AI system was built. After
        watching,{" "}
        <Link to="/auth" className="text-primary hover:underline">
          enter the smart campus
        </Link>{" "}
        to see the AI in action.
      </GlassPanel>

      {/* Video Section */}
      <GlassPanel level={2} className="overflow-hidden p-0 mb-6">
        <div className="relative aspect-video w-full bg-black">
          <iframe
            src={EMBED_URL}
            title="MITS Campus Tour"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>

        <div className="p-5">
          <div className="flex items-start gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-primary/15 text-primary shrink-0">
              <Play className="size-5" />
            </span>
            <div className="flex-1">
              <h3 className="font-semibold">MITS — A Place for Learning, Expression, Discourse & Innovation</h3>
              <p className="text-sm text-muted-foreground mt-1">
                A glimpse into the campus, culture and innovation spirit that drives
                MITS Deemed to be University — the home of the MITS Campus AI project.
              </p>
            </div>
          </div>
        </div>
      </GlassPanel>

      {/* Highlights */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Sparkles className="size-4 text-primary" />
          About MITS
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HIGHLIGHTS.map((h) => {
            const Icon = h.icon;
            return (
              <GlassPanel key={h.title} hover className="p-4 h-full">
                <span className="grid size-10 place-items-center rounded-xl bg-primary/12 text-primary">
                  <Icon className="size-5" />
                </span>
                <h3 className="font-semibold text-sm mt-3">{h.title}</h3>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{h.body}</p>
              </GlassPanel>
            );
          })}
        </div>
      </div>

      {/* Programmes */}
      <GlassPanel level={2} className="p-5 mb-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <GraduationCap className="size-5 text-primary" />
          Programmes Offered
        </h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {PROGRAMMES.map((p) => (
            <div
              key={p.code}
              className="flex items-center gap-3 rounded-lg bg-primary/5 px-3 py-2"
            >
              <span className="grid size-8 place-items-center rounded-md bg-primary/15 text-primary text-[10px] font-bold">
                {p.code}
              </span>
              <span className="text-xs text-muted-foreground truncate">{p.name}</span>
            </div>
          ))}
        </div>
      </GlassPanel>

      {/* Project connection */}
      <GlassPanel level={3} className="p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-primary/15 text-primary">
            <Cpu className="size-7" />
          </span>
          <div className="flex-1">
            <h2 className="text-lg font-semibold">The MITS Campus AI Project</h2>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              This campus is the inspiration for the <strong>MITS Campus AI</strong>{" "}
              project — a multi-agent smart campus management system built as part of
              the B.Tech CSE 2024-28 curriculum. The system coordinates classrooms,
              faculty, students, laboratories, timetables and campus transportation
              through a network of 10 specialised AI agents.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className="rounded-lg bg-primary/10 px-2.5 py-1 text-primary">
                🤖 10 AI Agents
              </span>
              <span className="rounded-lg bg-primary/10 px-2.5 py-1 text-primary">
                🧠 BFS · DFS · A* · CSP
              </span>
              <span className="rounded-lg bg-primary/10 px-2.5 py-1 text-primary">
                📊 Live PostgreSQL Data
              </span>
              <span className="rounded-lg bg-primary/10 px-2.5 py-1 text-primary">
                🎯 Multi-Agent Reasoning
              </span>
            </div>
          </div>
        </div>
      </GlassPanel>

      {/* CTA */}
      <GlassPanel level={2} className="p-6 text-center">
        <Trophy className="size-8 mx-auto text-primary mb-3" />
        <h2 className="text-xl font-semibold mb-2">
          Ready to see the AI in action?
        </h2>
        <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
          Sign in as a student, faculty member, or admin to explore the live campus
          intelligence system.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" className="gap-2 rounded-xl">
            <Link to="/auth">
              Enter Smart Campus <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="gap-2 rounded-xl">
            <Button
  size="lg"
  variant="outline"
  className="gap-2 rounded-xl"
  onClick={() => (window.location.href = "/")}
>
  <BookOpen className="size-4" /> Back to Home
</Button>
          </Button>
        </div>
      </GlassPanel>

      {/* Footer */}
      <p className="text-center text-[10px] text-muted-foreground mt-6">
        Madanapalle Institute of Technology & Science · Deemed to be University ·
        Angallu, Madanapalle, Andhra Pradesh 517325 · www.mits.ac.in
      </p>
    </main>
  );
}
=======
  component: Demo,
});

function Demo() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-16">
      <h1 className="text-3xl font-semibold">Live AI demo</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        A guided run of the campus agents: request intake, reasoning, allocation and conflict resolution.
      </p>
      <GlassPanel level={2} className="mt-6 p-6">
        <p className="text-sm text-muted-foreground">
          Sign in to run the full pipeline against live campus data.
        </p>
        <Link to="/auth" className="mt-4 inline-block text-primary hover:underline">
          Enter the campus
        </Link>
      </GlassPanel>
    </main>
  );
}
>>>>>>> 4ed5064e0872a8573dbceff1cf59df711efc6f87
