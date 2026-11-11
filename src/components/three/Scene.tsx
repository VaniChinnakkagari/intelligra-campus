import { ClientOnly } from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { use3dLevel } from "@/hooks/usePrefs";
import type { AICore3DProps } from "./AICore3D";
import type { Campus3DProps } from "./Campus3D";

const AICore3D = lazy(() => import("./AICore3D"));
const Campus3D = lazy(() => import("./Campus3D"));

function Fallback({ label }: { label: string }) {
  return (
    <div className="grid h-full w-full place-items-center">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-pulse-glow size-16 rounded-full bg-primary/25 blur-xl" />
        <p className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground uppercase">
          {label}
        </p>
      </div>
    </div>
  );
}

export function AICoreScene(props: AICore3DProps) {
  const level = use3dLevel();
  if (level === "off") return <Fallback label="3D effects disabled" />;
  return (
    <ClientOnly fallback={<Fallback label="Initialising AI core" />}>
      <Suspense fallback={<Fallback label="Initialising AI core" />}>
        <AICore3D {...props} quality={level === "light" ? "light" : "full"} />
      </Suspense>
    </ClientOnly>
  );
}

export function CampusScene(props: Campus3DProps) {
  const level = use3dLevel();
  if (level === "off") return <Fallback label="3D effects disabled" />;
  return (
    <ClientOnly fallback={<Fallback label="Loading campus model" />}>
      <Suspense fallback={<Fallback label="Loading campus model" />}>
        <Campus3D {...props} quality={level === "light" ? "light" : "full"} />
      </Suspense>
    </ClientOnly>
  );
}
