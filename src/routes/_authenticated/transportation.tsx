import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/AppShell";
import { GlassPanel } from "@/components/Glass";
import { useTable } from "@/lib/api";
import { supabase } from "@/integrations/supabase/client";
import { Bus, MapPin, Users, Activity, Clock, Navigation, FileEdit, Check, X, Cpu, Sparkles, AlertCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/transportation")({
  component: TransportationPage,
});

function TransportationPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const { data: buses } = useTable("buses", { _refresh: refreshKey });
  const [editingBus, setEditingBus] = useState<any>(null);
  const [busy, setBusy] = useState(false);

  // 🚨 AI Agent State
  const [agentRunning, setAgentRunning] = useState(false);
  const [agentLogs, setAgentLogs] = useState<string[]>([]);
  const [optimized, setOptimized] = useState(false);

  const totalBuses = buses?.length || 0;
  const activeBuses = buses?.filter((b: any) => b.status === "en-route" || b.status === "active").length || 0;
  const totalCapacity = buses?.reduce((acc: number, b: any) => acc + (b.capacity || 0), 0) || 0;
  const currentPassengers = buses?.reduce((acc: number, b: any) => acc + (b.passengers || 0), 0) || 0;

  const handleUpdateBus = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.from("buses").update({
      bus_number: editingBus.bus_number,
      route: editingBus.route,
      status: editingBus.status,
      capacity: Number(editingBus.capacity),
      passengers: Number(editingBus.passengers),
    }).eq("id", editingBus.id);

    if (error) alert("Error updating bus: " + error.message);
    else {
      setEditingBus(null);
      setRefreshKey(prev => prev + 1);
    }
    setBusy(false);
  };

  // 🚨 The AI Transport Agent Function
  const runTransportAgent = async () => {
    setAgentRunning(true);
    setOptimized(false);
    setAgentLogs([]);

    const log = (msg: string) => setAgentLogs(prev => [...prev, msg]);

    log("🚌 Transport Agent initialized...");
    await new Promise(r => setTimeout(r, 600));
    log(`📊 Scanning ${totalBuses} buses across campus routes...`);
    
    await new Promise(r => setTimeout(r, 800));
    
    // Agent analyzes the data
    const overcrowded = buses?.filter((b: any) => b.capacity > 0 && (b.passengers / b.capacity) > 0.85);
    const inactive = buses?.filter((b: any) => b.status === "inactive");

    if (overcrowded && overcrowded.length > 0) {
      log(`⚠️ CONSTRAINT WARNING: ${overcrowded.length} bus(es) exceed 85% capacity.`);
      overcrowded.forEach((b: any) => {
        log(`   -> ${b.bus_number} (${b.route}) is at ${Math.round((b.passengers/b.capacity)*100)}% capacity.`);
      });
      log(`🤖 Recommendation: Deploy standby bus to ${overcrowded[0].route}.`);
    } else {
      log(`✅ Load balancing optimal. No bus exceeds 85% capacity.`);
    }

    await new Promise(r => setTimeout(r, 700));
    
    if (inactive && inactive.length > 0) {
      log(`🛠️ Maintenance Flag: ${inactive.length} bus(es) are inactive and require inspection.`);
    }

    await new Promise(r => setTimeout(r, 600));
    log(`✅ Transport optimization complete. 0 critical failures.`);
    
    setOptimized(true);
    setAgentRunning(false);
  };

  if (!buses) return <div className="p-20 text-center animate-pulse text-white">Loading Transportation Data...</div>;

  return (
    <div className="mx-auto w-full max-w-7xl">
      <PageHeader
        title="Transportation"
        subtitle="Live tracking and AI-driven management of the MITS bus fleet."
        actions={
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-xs text-green-400">
              <span className="size-2 rounded-full bg-green-400 animate-pulse" />
              LIVE GPS
            </span>
            <Button onClick={runTransportAgent} disabled={agentRunning} className="rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold">
              {agentRunning ? "Agent Running..." : <><Cpu className="mr-2 size-4" /> Run Transport Agent</>}
            </Button>
          </div>
        }
      />

      {/* 🚨 AI AGENT LOGS PANEL */}
      {agentLogs.length > 0 && (
        <GlassPanel level={2} className="mt-6 p-4 bg-black/40 border border-cyan-500/30">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-cyan-400 flex items-center gap-2">
              <Sparkles className="size-4" /> Transport Agent Telemetry
            </h3>
            {optimized && (
              <span className="flex items-center gap-1.5 text-xs text-green-400 font-semibold bg-green-400/10 px-2 py-1 rounded border border-green-400/20">
                <ShieldCheck className="size-3" /> Optimized
              </span>
            )}
          </div>
          <div className="font-mono text-xs text-gray-300 space-y-1">
            {agentLogs.map((msg, i) => (
              <div key={i} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                {msg}
              </div>
            ))}
          </div>
        </GlassPanel>
      )}

      {/* EDIT BUS FORM */}
      {editingBus && (
        <div className="mt-6">
          <form onSubmit={handleUpdateBus} className="p-5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Edit Bus: {editingBus.bus_number}</h3>
              <Button type="button" size="sm" variant="ghost" onClick={() => setEditingBus(null)} className="text-white hover:bg-white/10"><X className="size-4" /></Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><label className="text-xs text-muted-foreground mb-1 block">Bus Number</label><input type="text" value={editingBus.bus_number} onChange={(e) => setEditingBus({...editingBus, bus_number: e.target.value})} className="w-full p-2 rounded-lg bg-background border border-primary/20 text-white" /></div>
              <div><label className="text-xs text-muted-foreground mb-1 block">Route</label><input type="text" value={editingBus.route} onChange={(e) => setEditingBus({...editingBus, route: e.target.value})} className="w-full p-2 rounded-lg bg-background border border-primary/20 text-white" /></div>
              <div><label className="text-xs text-muted-foreground mb-1 block">Status</label><select value={editingBus.status} onChange={(e) => setEditingBus({...editingBus, status: e.target.value})} className="w-full p-2 rounded-lg bg-background border border-primary/20 text-white"><option value="active">Active</option><option value="en-route">En Route</option><option value="inactive">Inactive</option></select></div>
              <div><label className="text-xs text-muted-foreground mb-1 block">Capacity</label><input type="number" value={editingBus.capacity} onChange={(e) => setEditingBus({...editingBus, capacity: e.target.value})} className="w-full p-2 rounded-lg bg-background border border-primary/20 text-white" /></div>
              <div><label className="text-xs text-muted-foreground mb-1 block">Passengers</label><input type="number" value={editingBus.passengers} onChange={(e) => setEditingBus({...editingBus, passengers: e.target.value})} className="w-full p-2 rounded-lg bg-background border border-primary/20 text-white" /></div>
              <div className="flex items-end gap-2">
                <Button type="submit" disabled={busy} className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold flex-1">{busy ? "Saving..." : <><Check className="mr-2 size-4"/> Save</>}</Button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Top Stats (Unchanged) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-6">
        <GlassPanel hover className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Fleet</p>
              <p className="text-2xl font-semibold mt-1 text-white">{totalBuses}</p>
            </div>
            <Bus className="size-8 text-cyan-400 opacity-60" />
          </div>
        </GlassPanel>

        <GlassPanel hover className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Active Now</p>
              <p className="text-2xl font-semibold mt-1 text-green-400">{activeBuses}</p>
            </div>
            <Activity className="size-8 text-green-400 opacity-60" />
          </div>
        </GlassPanel>

        <GlassPanel hover className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Capacity</p>
              <p className="text-2xl font-semibold mt-1 text-white">{totalCapacity}</p>
            </div>
            <Users className="size-8 text-violet-400 opacity-60" />
          </div>
        </GlassPanel>

        <GlassPanel hover className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Passengers</p>
              <p className="text-2xl font-semibold mt-1 text-yellow-400">{currentPassengers}</p>
            </div>
            <Navigation className="size-8 text-yellow-400 opacity-60" />
          </div>
        </GlassPanel>
      </div>

      {/* Bus List (Unchanged) */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-white mb-4">MITS Bus Fleet</h3>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {buses.map((bus: any) => {
            const isActive = bus.status === "en-route" || bus.status === "active";
            const occupancyPercent = bus.capacity > 0 ? Math.round((bus.passengers / bus.capacity) * 100) : 0;

            return (
              <GlassPanel key={bus.id} hover className="p-5 flex flex-col justify-between">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-white">{bus.bus_number}</h4>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="size-3" /> Route: {bus.route}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                      isActive 
                        ? "bg-green-400/10 text-green-400 border-green-400/20" 
                        : "bg-red-400/10 text-red-400 border-red-400/20"
                    }`}>
                      {bus.status}
                    </span>
                    <Button onClick={() => setEditingBus(bus)} variant="ghost" size="icon" className="size-7 text-cyan-400 hover:bg-cyan-400/10">
                      <FileEdit className="size-4" />
                    </Button>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Occupancy</span>
                    <span className="text-white font-medium">{bus.passengers} / {bus.capacity} seats</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-primary/10 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        occupancyPercent > 90 ? "bg-red-500" : 
                        occupancyPercent > 70 ? "bg-yellow-400" : "bg-cyan-400"
                      }`}
                      style={{ width: `${occupancyPercent}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-primary/10">
                  <div className="flex items-center gap-1">
                    <Clock className="size-3 text-cyan-400" />
                    Next stop: {isActive ? "Main Gate" : "Depot"}
                  </div>
                  <span className="font-mono text-cyan-400">{occupancyPercent}% full</span>
                </div>
              </GlassPanel>
            );
          })}
        </div>
      </div>
    </div>
  );
}