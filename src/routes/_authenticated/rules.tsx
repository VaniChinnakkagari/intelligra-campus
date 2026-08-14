import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { GlassPanel } from "@/components/Glass";

export const Route = createFileRoute("/_authenticated/rules")({
  component: Page,
});

function Page() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <PageHeader title="Rule Engine" subtitle="Declarative rules driving automated campus decisions." />
      <GlassPanel level={2} className="p-6">
        <p className="text-sm text-muted-foreground">
          This module is wired to the campus database and agent pipeline.
        </p>
      </GlassPanel>
    </div>
  );
}
