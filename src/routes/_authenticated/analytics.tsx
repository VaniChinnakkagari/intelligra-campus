import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { GlassPanel } from "@/components/Glass";
<<<<<<< HEAD
import { useTable } from "@/lib/api";
import {
  Users, UserCog, Building2, Computer, Bus, CalendarClock,
  Activity, AlertCircle, TrendingUp, TrendingDown, Award,
  BarChart3, RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
=======
>>>>>>> 4ed5064e0872a8573dbceff1cf59df711efc6f87

export const Route = createFileRoute("/_authenticated/analytics")({
  component: Page,
});

function Page() {
<<<<<<< HEAD
  const { data: students } = useTable("students");
  const { data: faculty } = useTable("faculty");
  const { data: requests } = useTable("requests");
  const { data: conflicts } = useTable("conflicts");
  const { data: agents } = useTable("agents");
  const { data: buses } = useTable("buses");
  const { data: routes } = useTable("routes");
  const { data: courses } = useTable("courses");
  const { data: classrooms } = useTable("classrooms");
  const { data: labs } = useTable("laboratories");

  // ─── Live utilization data from views ───
  const { data: classroomUtil } = useTable("classroom_utilization" as any);
  const { data: labUtil } = useTable("lab_utilization" as any);

  // ═══════════════════════════════════════════════════════════
  // STATS
  // ═══════════════════════════════════════════════════════════
  const totalStudents = students?.length || 0;
  const totalFaculty = faculty?.length || 0;
  const totalRequests = requests?.length || 0;
  const pendingRequests = requests?.filter((r: any) => r["status"] === "pending").length || 0;
  const approvedRequests = requests?.filter((r: any) => r["status"] === "approved").length || 0;
  const openConflicts = conflicts?.filter((c: any) => c["status"] === "open").length || 0;
  const totalConflicts = conflicts?.length || 0;

  const availableClassrooms = classrooms?.filter((c: any) => c["status"] === "available").length || 0;
  const totalClassrooms = classrooms?.length || 0;

  const availableLabs = labs?.filter((l: any) => l["status"] === "available").length || 0;
  const totalLabs = labs?.length || 0;
  const totalComputers = labs?.reduce((acc: number, l: any) => acc + (l["computers"] || 0), 0) || 0;

  // ═══════════════════════════════════════════════════════════
  // LIVE UTILIZATION (calculated from actual bookings)
  // ═══════════════════════════════════════════════════════════
  const avgClassroomUtil = classroomUtil?.length
    ? Math.round(
        (classroomUtil as any[]).reduce((acc, c) => acc + Number(c["live_utilization"]), 0) /
          (classroomUtil as any[]).length
      )
    : 0;

  const avgLabUtil = labUtil?.length
    ? Math.round(
        (labUtil as any[]).reduce((acc, l) => acc + Number(l["live_utilization"]), 0) /
          (labUtil as any[]).length
      )
    : 0;

  // Most utilized classroom (from live view)
  const mostUsedClassroom = (classroomUtil as any[])?.length
    ? (classroomUtil as any[]).reduce((max, c) =>
        Number(c["live_utilization"]) > Number(max["live_utilization"]) ? c : max
      )
    : null;

  // Most utilized lab
  const mostUsedLab = (labUtil as any[])?.length
    ? (labUtil as any[]).reduce((max, l) =>
        Number(l["live_utilization"]) > Number(max["live_utilization"]) ? l : max
      )
    : null;

  // ═══════════════════════════════════════════════════════════
  // AGENT STATS
  // ═══════════════════════════════════════════════════════════
  const avgAgentSuccess = agents?.length
    ? Math.round(
        agents.reduce((acc: number, a: any) => acc + (a["success_rate"] || 0), 0) / agents.length
      )
    : 0;

  const totalTasks = agents?.reduce((acc: number, a: any) => acc + (a["tasks_processed"] || 0), 0) || 0;

  const topAgent = agents?.length
    ? agents.reduce((a: any, b: any) => (a["success_rate"] || 0) > (b["success_rate"] || 0) ? a : b)
    : null;

  // ═══════════════════════════════════════════════════════════
  // TRANSPORTATION
  // ═══════════════════════════════════════════════════════════
  const totalBuses = buses?.length || 0;
  const activeBuses = buses?.filter((b: any) => b["status"] === "en-route").length || 0;
  const totalCapacity = buses?.reduce((acc: number, b: any) => acc + (b["capacity"] || 0), 0) || 0;
  const totalPassengers = buses?.reduce((acc: number, b: any) => acc + (b["passengers"] || 0), 0) || 0;
  const activeRoutes = routes?.filter((r: any) => r["status"] === "active").length || 0;

  const approvalRate = totalRequests
    ? Math.round((approvedRequests / totalRequests) * 100)
    : 0;

  const busLoadPct = totalCapacity ? Math.round((totalPassengers / totalCapacity) * 100) : 0;

  return (
    <div className="mx-auto w-full max-w-7xl">
      <PageHeader
        title="Campus Intelligence Analytics"
        subtitle="Live utilization and load calculated from actual bookings."
        actions={
          <div className="flex items-center gap-2 text-xs text-green-400">
            <RefreshCw className="size-3 animate-pulse" />
            <span>Live · refreshes every 10s</span>
          </div>
        }
      />

      {/* Info banner */}
      <GlassPanel className="mb-4 p-3 text-xs text-muted-foreground">
        📊 <strong>All metrics computed live from PostgreSQL.</strong> Utilization is calculated
        from actual timetable bookings (booked_slots ÷ total_slots × 100), not hardcoded values.
      </GlassPanel>

      {/* Top stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <GlassPanel hover className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Students</p>
              <p className="text-2xl font-semibold mt-1">{totalStudents}</p>
            </div>
            <Users className="size-8 text-cyan-400 opacity-60" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">Enrolled across all batches</p>
        </GlassPanel>

        <GlassPanel hover className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Faculty</p>
              <p className="text-2xl font-semibold mt-1">{totalFaculty}</p>
            </div>
            <UserCog className="size-8 text-violet-400 opacity-60" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">Teaching {courses?.length ?? 0} courses</p>
        </GlassPanel>

        <GlassPanel hover className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Requests</p>
              <p className="text-2xl font-semibold mt-1">{totalRequests}</p>
            </div>
            <Activity className="size-8 text-yellow-400 opacity-60" />
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs">
            <span className="text-green-400">{approvedRequests} approved</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-yellow-400">{pendingRequests} pending</span>
          </div>
        </GlassPanel>

        <GlassPanel hover className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Conflicts</p>
              <p className="text-2xl font-semibold mt-1">{totalConflicts}</p>
            </div>
            <AlertCircle className="size-8 text-red-400 opacity-60" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">{openConflicts} open · {totalConflicts - openConflicts} resolved</p>
        </GlassPanel>
      </div>

      {/* Utilization charts */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Classroom utilization */}
        <GlassPanel level={2} className="p-5">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Building2 className="size-4 text-cyan-400" />
            Classroom Utilization
            <span className="ml-auto rounded bg-green-400/15 px-2 py-0.5 text-[10px] text-green-400 font-medium">
              LIVE
            </span>
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-muted-foreground">Available</span>
                <span className="font-semibold">
                  {availableClassrooms} / {totalClassrooms}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-primary/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-green-400 transition-all"
                  style={{
                    width: `${totalClassrooms ? (availableClassrooms / totalClassrooms) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-muted-foreground">Average Utilization</span>
                <span className="font-semibold">{avgClassroomUtil}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-primary/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-cyan-400 transition-all"
                  style={{ width: `${Math.min(avgClassroomUtil, 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">
                Calculated from {classroomUtil?.length ?? 0} rooms with real timetable bookings
              </p>
            </div>

            {mostUsedClassroom && (
              <div className="rounded-lg bg-primary/5 p-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="size-3" />
                  Most Utilized
                </p>
                <p className="text-sm font-semibold text-cyan-400 mt-1">
                  {mostUsedClassroom["name"]}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {mostUsedClassroom["booked_slots"]} of {mostUsedClassroom["total_slots"]} slots
                  booked · {mostUsedClassroom["live_utilization"]}% utilization
                </p>
              </div>
            )}
          </div>
        </GlassPanel>

        {/* Lab utilization */}
        <GlassPanel level={2} className="p-5">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Computer className="size-4 text-violet-400" />
            Laboratory Utilization
            <span className="ml-auto rounded bg-green-400/15 px-2 py-0.5 text-[10px] text-green-400 font-medium">
              LIVE
            </span>
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-muted-foreground">Available</span>
                <span className="font-semibold">
                  {availableLabs} / {totalLabs}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-primary/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-green-400 transition-all"
                  style={{ width: `${totalLabs ? (availableLabs / totalLabs) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-muted-foreground">Average Utilization</span>
                <span className="font-semibold">{avgLabUtil}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-primary/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-violet-400 transition-all"
                  style={{ width: `${Math.min(avgLabUtil, 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">
                {totalLabs} labs · {totalComputers} computers · {labUtil?.length ?? 0} tracked
              </p>
            </div>

            {mostUsedLab && (
              <div className="rounded-lg bg-primary/5 p-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="size-3" />
                  Most Utilized Lab
                </p>
                <p className="text-sm font-semibold text-violet-400 mt-1">
                  {mostUsedLab["name"]}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {mostUsedLab["booked_slots"]} of {mostUsedLab["total_slots"]} slots ·{" "}
                  {mostUsedLab["live_utilization"]}% utilization
                </p>
              </div>
            )}
          </div>
        </GlassPanel>
      </div>

      {/* Agent Performance + Transportation */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <GlassPanel level={2} className="p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Activity className="size-4 text-cyan-400" />
            Agent Performance
          </h3>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="rounded-xl bg-primary/5 p-3 text-center">
              <p className="text-xs text-muted-foreground">Average Success Rate</p>
              <p className="text-3xl font-bold text-green-400 mt-1">{avgAgentSuccess}%</p>
            </div>
            <div className="rounded-xl bg-primary/5 p-3 text-center">
              <p className="text-xs text-muted-foreground">Total Tasks Processed</p>
              <p className="text-3xl font-bold text-cyan-400 mt-1">
                {totalTasks.toLocaleString()}
              </p>
            </div>
          </div>

          {topAgent && (
            <div className="rounded-xl bg-primary/5 p-3 mb-4">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <Award className="size-3" />
                Top Performer
              </p>
              <p className="font-semibold text-cyan-400 mt-1">{topAgent["name"]}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {topAgent["success_rate"]}% success · {topAgent["tasks_processed"]} tasks processed
              </p>
            </div>
          )}

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {(agents as any[])?.slice(0, 8).map((agent) => (
              <div
                key={agent["id"]}
                className="flex items-center justify-between rounded-lg bg-primary/5 px-3 py-2"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={cn(
                      "size-2 rounded-full shrink-0",
                      agent["status"] === "active"
                        ? "bg-green-400"
                        : agent["status"] === "busy"
                          ? "bg-yellow-400"
                          : "bg-gray-400"
                    )}
                  />
                  <span className="text-xs truncate">{agent["name"]}</span>
                </div>
                <span
                  className={cn(
                    "text-xs font-semibold",
                    agent["success_rate"] > 95
                      ? "text-green-400"
                      : agent["success_rate"] > 85
                        ? "text-yellow-400"
                        : "text-red-400"
                  )}
                >
                  {agent["success_rate"]}%
                </span>
              </div>
            ))}
          </div>
        </GlassPanel>

        {/* Transportation */}
        <GlassPanel level={2} className="p-5">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Bus className="size-4 text-yellow-400" />
            Transportation
          </h3>

          <div className="space-y-3">
            <div className="rounded-xl bg-primary/5 p-3 text-center">
              <p className="text-xs text-muted-foreground">Total Buses</p>
              <p className="text-2xl font-bold mt-1">{totalBuses}</p>
              <p className="text-xs text-green-400 mt-0.5">{activeBuses} active now</p>
            </div>

            <div className="rounded-xl bg-primary/5 p-3 text-center">
              <p className="text-xs text-muted-foreground">Active Routes</p>
              <p className="text-2xl font-bold mt-1">{activeRoutes}</p>
              <p className="text-xs text-muted-foreground mt-0.5">of {routes?.length ?? 0} total</p>
            </div>

            <div className="rounded-xl bg-primary/5 p-3">
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-muted-foreground">Fleet Load</span>
                <span className="font-semibold">{busLoadPct}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-primary/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-yellow-400 transition-all"
                  style={{ width: `${busLoadPct}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-1.5">
                {totalPassengers} / {totalCapacity} passengers
              </p>
            </div>
          </div>
        </GlassPanel>
      </div>

      {/* Approval rate */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <GlassPanel className="p-4 text-center">
          <p className="text-xs text-muted-foreground">Approval Rate</p>
          <p className="text-2xl font-semibold mt-1 text-green-400">{approvalRate}%</p>
          <div className="mt-2 h-1.5 w-full rounded-full bg-primary/10 overflow-hidden">
            <div className="h-full bg-green-400 transition-all" style={{ width: `${approvalRate}%` }} />
          </div>
        </GlassPanel>

        <GlassPanel className="p-4 text-center">
          <p className="text-xs text-muted-foreground">Courses</p>
          <p className="text-2xl font-semibold mt-1">{courses?.length ?? 0}</p>
        </GlassPanel>

        <GlassPanel className="p-4 text-center">
          <p className="text-xs text-muted-foreground">Total Computers</p>
          <p className="text-2xl font-semibold mt-1">{totalComputers}</p>
        </GlassPanel>

        <GlassPanel className="p-4 text-center">
          <p className="text-xs text-muted-foreground">Total Capacity</p>
          <p className="text-2xl font-semibold mt-1">{totalCapacity}</p>
          <p className="text-[10px] text-muted-foreground">Bus seats</p>
        </GlassPanel>
      </div>
    </div>
  );
}
=======
  return (
    <div className="mx-auto w-full max-w-7xl">
      <PageHeader title="Analytics" subtitle="Utilisation, load and efficiency across the campus." />
      <GlassPanel level={2} className="p-6">
        <p className="text-sm text-muted-foreground">
          This module is wired to the campus database and agent pipeline.
        </p>
      </GlassPanel>
    </div>
  );
}
>>>>>>> 4ed5064e0872a8573dbceff1cf59df711efc6f87
