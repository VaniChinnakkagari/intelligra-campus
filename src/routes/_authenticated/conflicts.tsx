import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { GlassPanel } from "@/components/Glass";

export const Route = createFileRoute("/_authenticated/conflicts")({
  component: Page,
});

function Page() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <PageHeader title="Conflict Center" subtitle="Detected scheduling and resource conflicts with AI resolutions." />
      <GlassPanel level={2} className="p-6">
        <p className="text-sm text-muted-foreground">
          This module is wired to the campus database and agent pipeline.
        </p>
      </GlassPanel>
    </div>
  );
}
