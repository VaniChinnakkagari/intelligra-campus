import { createFileRoute, Link } from "@tanstack/react-router";
import { GlassPanel } from "@/components/Glass";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: "Live AI Demo — Nexus Campus AI" },
      { name: "description", content: "Watch the Nexus multi-agent system schedule, route and resolve conflicts in real time." },
      { property: "og:title", content: "Live AI Demo — Nexus Campus AI" },
      { property: "og:description", content: "A guided walkthrough of the Nexus campus multi-agent intelligence." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
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
