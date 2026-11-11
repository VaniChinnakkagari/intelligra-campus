import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/AppShell";
import { GlassPanel } from "@/components/Glass";
import { useTable } from "@/lib/api";
import { supabase } from "@/integrations/supabase/client";
import { Search, Users, UserCog, Building2, Computer, Bus, Box, FileEdit, Trash2, Plus, Check, X, Lightbulb, Key, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminModules,
});

const TABS = ["Classrooms", "Laboratories", "Buses", "Students", "Faculty", "Courses", "Timetables"];

const TIMETABLE_DATA: Record<string, Record<string, string[]>> = {
  A: { MON: ["AI LAB", "AI LAB", "APT", "LUNCH", "OE", "IQTA", "HOLISTIC HOUR"], TUE: ["SS", "AI", "IQTA", "LUNCH", "OE", "ATCD", "FSD II LAB"], WED: ["CNIP", "ATCD", "FSD II", "LUNCH", "OE", "AI", "PSOSM"], THU: ["CNIP LAB", "CNIP LAB", "CNIP LAB", "LUNCH", "BDC", "CNIP", "HOLISTIC HOUR"], FRI: ["ATCD", "CNIP", "APT", "LUNCH", "TINKERING LAB", "TINKERING LAB", "IQTA"], SAT: ["PSOSM", "BDC", "AI", "LUNCH", "MENTOR/LIBRARY", "MENTOR/LIBRARY", "PSOSM"] },
  B: { MON: ["AI", "IQTA", "APT", "LUNCH", "OE", "BDC", "HOLISTIC HOUR"], TUE: ["CNIP", "TINKERING LAB", "TINKERING LAB", "LUNCH", "OE", "IQTA", "SS"], WED: ["ATCD", "CNIP", "FSD II", "LUNCH", "OE", "AI", "FSD II LAB"], THU: ["AI LAB", "AI LAB", "AI LAB", "LUNCH", "IQTA", "ATCD", "HOLISTIC HOUR"], FRI: ["CNIP LAB", "CNIP LAB", "CNIP LAB", "LUNCH", "PSOSM", "CNIP", "AI"], SAT: ["PSOSM", "BDC", "ATCD", "LUNCH", "MENTOR/LIBRARY", "MENTOR/LIBRARY", "BDC"] },
  C: { MON: ["AI", "CNIP", "BDC", "LUNCH", "OE", "ATCD", "HOLISTIC HOUR"], TUE: ["CNIP LAB", "CNIP LAB", "CNIP LAB", "LUNCH", "OE", "AI", "TINKERING LAB"], WED: ["AI LAB", "AI LAB", "AI LAB", "LUNCH", "OE", "IQTA", "APT"], THU: ["IQTA", "ATCD", "SS", "LUNCH", "FSD II LAB", "FSD II LAB", "PSOSM"], FRI: ["ATCD", "IQTA", "FSD II", "LUNCH", "PSOSM", "CNIP", "HOLISTIC HOUR"], SAT: ["PSOSM", "BDC", "CNIP", "LUNCH", "MENTOR/LIBRARY", "MENTOR/LIBRARY", "BDC"] },
  D: { MON: ["CNIP LAB", "CNIP LAB", "CNIP LAB", "LUNCH", "OE", "CNIP", "HOLISTIC HOUR"], TUE: ["AI LAB", "AI LAB", "AI LAB", "LUNCH", "OE", "PSOSM", "ATCD"], WED: ["ATCD", "IQTA", "CNIP", "LUNCH", "OE", "AI", "TINKERING LAB"], THU: ["AI", "BDC", "PSOSM", "LUNCH", "FSD II", "IQTA", "HOLISTIC HOUR"], FRI: ["CNIP", "SS", "AI", "LUNCH", "IQTA", "APT", "FSD II LAB"], SAT: ["PSOSM", "BDC", "ATCD", "LUNCH", "MENTOR/LIBRARY", "MENTOR/LIBRARY", "MENTOR/LIBRARY"] },
  E: { MON: ["IQTA", "CNIP", "ATCD", "LUNCH", "OE", "AI", "HOLISTIC HOUR"], TUE: ["AI", "FSD II", "IQTA", "LUNCH", "OE", "ATCD", "FSD II LAB"], WED: ["CNIP LAB", "CNIP LAB", "CNIP LAB", "LUNCH", "OE", "CNIP", "PSOSM"], THU: ["APT", "TINKERING LAB", "TINKERING LAB", "LUNCH", "AI", "BDC", "HOLISTIC HOUR"], FRI: ["AI LAB", "AI LAB", "AI LAB", "LUNCH", "PSOSM", "SS", "CNIP"], SAT: ["PSOSM", "BDC", "ATCD", "LUNCH", "MENTOR/LIBRARY", "MENTOR/LIBRARY", "IQTA"] },
  F: { MON: ["AI LAB", "AI LAB", "AI LAB", "LUNCH", "OE", "IQTA", "HOLISTIC HOUR"], TUE: ["ATCD", "AI", "APT", "LUNCH", "OE", "BDC", "IQTA"], WED: ["CNIP", "FSD II", "VERBAL", "LUNCH", "OE", "ATCD", "FSD II LAB"], THU: ["IQTA", "CNIP", "PSOSM", "LUNCH", "TINKERING LAB", "TINKERING LAB", "HOLISTIC HOUR"], FRI: ["CNIP LAB", "CNIP LAB", "CNIP LAB", "LUNCH", "AI", "ATCD", "BDC"], SAT: ["PSOSM", "BDC", "AI", "LUNCH", "MENTOR/LIBRARY", "MENTOR/LIBRARY", "PSOSM"] },
  G: { MON: ["CNIP", "VERBAL", "IQTA", "LUNCH", "OE", "ATCD", "HOLISTIC HOUR"], TUE: ["AI LAB", "AI LAB", "AI LAB", "LUNCH", "OE", "ATCD", "CNIP"], WED: ["FSD II", "AI", "CNIP", "LUNCH", "OE", "IQTA", "FSD II LAB"], THU: ["CNIP LAB", "CNIP LAB", "CNIP LAB", "LUNCH", "BDC", "APT", "HOLISTIC HOUR"], FRI: ["ATCD", "TINKERING LAB", "TINKERING LAB", "LUNCH", "AI", "PSOSM", "IQTA"], SAT: ["PSOSM", "BDC", "AI", "LUNCH", "MENTOR/LIBRARY", "MENTOR/LIBRARY", "BDC"] },
  H: { MON: ["CNIP LAB", "CNIP LAB", "CNIP LAB", "LUNCH", "OE", "VERBAL", "HOLISTIC HOUR"], TUE: ["APT", "ATCD", "AI", "LUNCH", "OE", "IQTA", "PSOSM"], WED: ["AI LAB", "AI LAB", "AI LAB", "LUNCH", "OE", "CNIP", "ATCD"], THU: ["AI", "IQTA", "BDC", "LUNCH", "FSD II LAB", "FSD II LAB", "HOLISTIC HOUR"], FRI: ["CNIP", "FSD II", "ATCD", "LUNCH", "IQTA", "AI", "TINKERING LAB"], SAT: ["PSOSM", "BDC", "CNIP", "LUNCH", "MENTOR/LIBRARY", "MENTOR/LIBRARY", "MENTOR/LIBRARY"] },
  I: { MON: ["CNIP", "AI", "FSD II", "LUNCH", "OE", "ATCD", "HOLISTIC HOUR"], TUE: ["CNIP LAB", "CNIP LAB", "CNIP LAB", "LUNCH", "OE", "IQTA", "BDC"], WED: ["IQTA", "TINKERING LAB", "TINKERING LAB", "LUNCH", "OE", "AI", "APT"], THU: ["AI LAB", "AI LAB", "AI LAB", "LUNCH", "ATCD", "CNIP", "HOLISTIC HOUR"], FRI: ["VERBAL", "ATCD", "CNIP", "LUNCH", "FSD II LAB", "FSD II LAB", "IQTA"], SAT: ["PSOSM", "BDC", "AI", "LUNCH", "MENTOR/LIBRARY", "MENTOR/LIBRARY", "BDC"] },
  J: { MON: ["CNIP", "FSD II", "BDC", "LUNCH", "OE", "AI", "HOLISTIC HOUR"], TUE: ["AI", "IQTA", "ATCD", "LUNCH", "OE", "BDC", "TINKERING LAB"], WED: ["CNIP LAB", "CNIP LAB", "CNIP LAB", "LUNCH", "OE", "PSOSM", "CNIP"], THU: ["ATCD", "IQTA", "AI", "LUNCH", "FSD II LAB", "FSD II LAB", "VERBAL"], FRI: ["AI LAB", "AI LAB", "AI LAB", "LUNCH", "IQTA", "ATCD", "APT"], SAT: ["PSOSM", "BDC", "CNIP", "LUNCH", "MENTOR/LIBRARY", "MENTOR/LIBRARY", "PSOSM"] }
};

const TIME_SLOTS = ["9:10-10:10AM", "10:10-11:10AM", "11:10-12:10PM", "12:10-1:00PM", "1:00-2:00PM", "2:00-3:00PM", "3:00-4:00PM", "4:00-5:00PM"];

function AdminModules() {
  const searchParams = useSearch({ from: "/_authenticated/admin" });
  const initialTab = (searchParams as any)?.tab === "faculty" ? "Faculty" : "Students";
  
  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [selectedSection, setSelectedSection] = useState("A");
  const [editingBus, setEditingBus] = useState<any>(null);

  const [refreshKey, setRefreshKey] = useState(0);
  const triggerRefresh = () => setRefreshKey(prev => prev + 1);

  const { data: students } = useTable("students", { limit: 1000, _refresh: refreshKey });
  const { data: classrooms } = useTable("classrooms", { _refresh: refreshKey });
  const { data: laboratories } = useTable("laboratories", { _refresh: refreshKey });
  const { data: buses } = useTable("buses", { _refresh: refreshKey });
  const { data: faculty } = useTable("faculty", { _refresh: refreshKey });
  const { data: courses } = useTable("courses", { _refresh: refreshKey }); 

  const [newStudent, setNewStudent] = useState({
    name: "", roll_no: "", email: "", semester: "5", attendance: "75", section: "A"
  });

  const handleAddStudent = async () => {
    if (!newStudent.name || !newStudent.roll_no) return alert("Name and Roll No are required");
    setBusy(true);
    const finalEmail = newStudent.email || `${newStudent.roll_no.toLowerCase()}@mits.ac.in`;
    const { error } = await supabase.from("students").insert([{ name: newStudent.name, roll_no: newStudent.roll_no, email: finalEmail, semester: newStudent.semester, attendance: Number(newStudent.attendance), section: newStudent.section }]);
    if (error) alert("Error adding student to DB: " + error.message);
    else {
      alert("Student added successfully! Now click the 🔑 button to create their login.");
      setShowAddForm(false);
      setNewStudent({ name: "", roll_no: "", email: "", semester: "5", attendance: "75", section: "A" });
      triggerRefresh();
    }
    setBusy(false);
  };

  const handleDelete = async (table: string, id: string) => {
    if (!confirm(`Are you sure you want to delete this record?`)) return;
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) alert("Error: " + error.message);
    else triggerRefresh();
  };

  const handleToggleStatus = async (table: string, id: string, currentStatus: string) => {
    const newStatus = currentStatus === "available" ? "occupied" : "available";
    const { error } = await supabase.from(table).update({ status: newStatus }).eq("id", id);
    if (error) alert("Error: " + error.message);
    else triggerRefresh();
  };

  const handleCreateLogin = async (email: string) => {
    if (!email) return alert("No email found for this record.");
    if (!confirm(`Create login for ${email} with password Reset1998?`)) return;
    setBusy(true);
    const { error } = await supabase.auth.signUp({ email, password: "Reset1998" });
    if (error) alert(`Failed to create login (Rate limit?): ${error.message}`);
    else alert(`Success! Login created for ${email} with password Reset1998.`);
    setBusy(false);
  };

  const handleEditStudent = async (student: any) => {
    const newName = prompt("Edit Name:", student.name);
    if (newName === null) return; 
    const newRoll = prompt("Edit Roll No:", student.roll_no);
    if (newRoll === null) return;
    const newAttendance = prompt("Edit Attendance %:", student.attendance);
    if (newAttendance === null) return;
    const { error } = await supabase.from("students").update({ name: newName || student.name, roll_no: newRoll || student.roll_no, attendance: Number(newAttendance) || student.attendance }).eq("id", student.id);
    if (error) alert("Error updating: " + error.message);
    else triggerRefresh();
  };

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
    else { setEditingBus(null); triggerRefresh(); }
    setBusy(false);
  };

  const filteredStudents = (students as any[])?.filter((s) => s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || s.roll_no?.toLowerCase().includes(searchTerm.toLowerCase())).sort((a, b) => (a.roll_no || "").localeCompare(b.roll_no || "")) || [];

  return (
    <div className="mx-auto w-full max-w-7xl">
      <PageHeader
        title="Manage Campus"
        subtitle="Manage classrooms, labs, buses, students, faculty, courses and timetables."
        actions={
          <Button onClick={() => { setActiveTab("Students"); setShowAddForm(true); }} size="sm" className="rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold">
            <Plus className="mr-2 size-4" /> Add Student
          </Button>
        }
      />

      <GlassPanel level={2} className="p-2 mt-6">
        <div className="flex flex-wrap items-center gap-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setSearchTerm(""); setShowAddForm(false); setEditingBus(null); }}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all ${activeTab === tab ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"}`}
            >
              {tab === "Students" && <Users className="size-4" />}
              {tab === "Faculty" && <UserCog className="size-4" />}
              {tab === "Classrooms" && <Building2 className="size-4" />}
              {tab === "Laboratories" && <Computer className="size-4" />}
              {tab === "Buses" && <Bus className="size-4" />}
              {tab === "Courses" && <Box className="size-4" />}
              {tab === "Timetables" && <Calendar className="size-4" />}
              {tab}
            </button>
          ))}
        </div>
      </GlassPanel>

      <div className="mt-4">
        <GlassPanel level={2} className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={`Search ${activeTab.toLowerCase()}...`}
                className="w-full rounded-lg bg-primary/5 pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <span className="text-sm text-muted-foreground">
              {activeTab === "Students" ? filteredStudents.length : activeTab === "Faculty" ? faculty?.length : activeTab === "Classrooms" ? classrooms?.length : activeTab === "Laboratories" ? laboratories?.length : activeTab === "Buses" ? buses?.length : activeTab === "Courses" ? courses?.length : "0"} records
            </span>
          </div>

          {/* EDIT BUS FORM */}
          {editingBus && activeTab === "Buses" && (
            <form onSubmit={handleUpdateBus} className="mb-6 p-5 rounded-xl border border-cyan-500/30 bg-cyan-500/5">
              <h3 className="text-lg font-semibold mb-4 text-white">Edit Bus: {editingBus.bus_number}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="text-xs text-muted-foreground mb-1 block">Bus Number</label><input type="text" value={editingBus.bus_number} onChange={(e) => setEditingBus({...editingBus, bus_number: e.target.value})} className="w-full p-2 rounded-lg bg-background border border-primary/20 text-white" /></div>
                <div><label className="text-xs text-muted-foreground mb-1 block">Route</label><input type="text" value={editingBus.route} onChange={(e) => setEditingBus({...editingBus, route: e.target.value})} className="w-full p-2 rounded-lg bg-background border border-primary/20 text-white" /></div>
                <div><label className="text-xs text-muted-foreground mb-1 block">Status</label><select value={editingBus.status} onChange={(e) => setEditingBus({...editingBus, status: e.target.value})} className="w-full p-2 rounded-lg bg-background border border-primary/20 text-white"><option value="active">Active</option><option value="en-route">En Route</option><option value="inactive">Inactive</option></select></div>
                <div><label className="text-xs text-muted-foreground mb-1 block">Capacity</label><input type="number" value={editingBus.capacity} onChange={(e) => setEditingBus({...editingBus, capacity: e.target.value})} className="w-full p-2 rounded-lg bg-background border border-primary/20 text-white" /></div>
                <div><label className="text-xs text-muted-foreground mb-1 block">Passengers</label><input type="number" value={editingBus.passengers} onChange={(e) => setEditingBus({...editingBus, passengers: e.target.value})} className="w-full p-2 rounded-lg bg-background border border-primary/20 text-white" /></div>
              </div>
              <div className="mt-6 flex gap-2">
                <Button type="submit" disabled={busy} size="sm" className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold">{busy ? "Updating..." : <><Check className="mr-2 size-4"/> Save Changes</>}</Button>
                <Button type="button" size="sm" variant="outline" onClick={() => setEditingBus(null)} className="text-white border-white/20 hover:bg-white/10"><X className="mr-2 size-4"/> Cancel</Button>
              </div>
            </form>
          )}

          {activeTab !== "Timetables" ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-primary/5 text-muted-foreground">
                  <tr>
                    {activeTab === "Students" && (<><th className="px-4 py-3 rounded-tl-lg">Roll No</th><th className="px-4 py-3">Name</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Sem</th><th className="px-4 py-3">Section</th><th className="px-4 py-3 text-right">Attendance</th><th className="px-4 py-3 text-right rounded-tr-lg">Actions</th></>)}
                    {activeTab === "Courses" && (<><th className="px-4 py-3 rounded-tl-lg">Code</th><th className="px-4 py-3">Course Name</th><th className="px-4 py-3">Credits</th><th className="px-4 py-3">Category</th><th className="px-4 py-3 text-right rounded-tr-lg">Actions</th></>)}
                    {activeTab === "Buses" && (<><th className="px-4 py-3 rounded-tl-lg">Bus Number</th><th className="px-4 py-3">Route</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Capacity</th><th className="px-4 py-3 text-right rounded-tr-lg">Actions</th></>)}
                    {activeTab !== "Students" && activeTab !== "Faculty" && activeTab !== "Courses" && activeTab !== "Buses" && (<><th className="px-4 py-3 rounded-tl-lg">ID / Code</th><th className="px-4 py-3">Name / Details</th><th className="px-4 py-3 text-right rounded-tr-lg">Actions</th></>)}
                  </tr>
                </thead>
                <tbody>
                  {activeTab === "Students" && filteredStudents.map((student: any) => {
                    const displayEmail = student.email || (student.roll_no ? `${student.roll_no.toLowerCase()}@mits.ac.in` : "—");
                    return (
                      <tr key={student.id} className="border-b border-primary/5 last:border-0 hover:bg-primary/5 transition-colors">
                        <td className="px-4 py-3 font-mono text-cyan-400">{student.roll_no}</td>
                        <td className="px-4 py-3 font-medium">{student.name}</td>
                        <td className="px-4 py-3 text-muted-foreground">{displayEmail}</td>
                        <td className="px-4 py-3"><span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-primary/10 text-primary">Sem {student.semester || 5}</span></td>
                        <td className="px-4 py-3"><span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-cyan-400/10 text-cyan-400 border border-cyan-400/20">{student.section || "—"}</span></td>
                        <td className="px-4 py-3 text-right"><span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${(student.attendance || 0) >= 75 ? "bg-green-400/10 text-green-400" : "bg-red-400/10 text-red-400"}`}>{student.attendance || 0}%</span></td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button onClick={() => handleCreateLogin(displayEmail)} variant="ghost" size="icon" title="Create Login (Reset1998)" className="size-8 text-yellow-400 hover:bg-yellow-400/10"><Key className="size-4" /></Button>
                            <Button onClick={() => handleEditStudent(student)} variant="ghost" size="icon" className="size-8 text-muted-foreground hover:bg-white/10"><FileEdit className="size-4" /></Button>
                            <Button onClick={() => handleDelete("students", student.id)} variant="ghost" size="icon" className="size-8 text-red-400 hover:bg-red-400/10"><Trash2 className="size-4" /></Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {activeTab === "Courses" && courses?.map((c: any) => (
                    <tr key={c.id} className="border-b border-primary/5 hover:bg-primary/5">
                      <td className="px-4 py-3 font-mono text-cyan-400">{c.code}</td>
                      <td className="px-4 py-3">{c.name}</td>
                      <td className="px-4 py-3">{c.credits} Credits</td>
                      <td className="px-4 py-3"><span className="px-2 py-1 rounded bg-primary/10 text-xs">{c.category}</span></td>
                      <td className="px-4 py-3 text-right"><Button onClick={() => handleDelete("courses", c.id)} variant="ghost" size="icon" className="size-8 text-red-400"><Trash2 className="size-4" /></Button></td>
                    </tr>
                  ))}

                  {activeTab === "Faculty" && faculty?.map((f: any) => (
                    <tr key={f.id} className="border-b border-primary/5 hover:bg-primary/5">
                      <td className="px-4 py-3 font-mono text-cyan-400">{f.employee_code || "N/A"}</td>
                      <td className="px-4 py-3">{f.name} ({f.designation})</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {f.email && (<Button onClick={() => handleCreateLogin(f.email)} variant="ghost" size="icon" title="Create Login" className="size-8 text-yellow-400 hover:bg-yellow-400/10"><Key className="size-4" /></Button>)}
                          <Button onClick={() => handleDelete("faculty", f.id)} variant="ghost" size="icon" className="size-8 text-red-400 hover:bg-red-400/10"><Trash2 className="size-4" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {activeTab === "Classrooms" && classrooms?.map((c: any) => (
                    <tr key={c.id} className="border-b border-primary/5 hover:bg-primary/5">
                      <td className="px-4 py-3 font-mono text-cyan-400">{c.code}</td>
                      <td className="px-4 py-3 flex items-center gap-2">Capacity: {c.capacity} | <button onClick={() => handleToggleStatus("classrooms", c.id, c.status)} className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all border ${c.status === "available" ? "bg-green-400/10 text-green-400 border-green-400/20 hover:bg-green-400/20" : "bg-red-400/10 text-red-400 border-red-400/20 hover:bg-red-400/20"}`}>{c.status}</button></td>
                      <td className="px-4 py-3 text-right"><Button onClick={() => handleDelete("classrooms", c.id)} variant="ghost" size="icon" className="size-8 text-red-400 hover:bg-red-400/10"><Trash2 className="size-4" /></Button></td>
                    </tr>
                  ))}
                  
                  {activeTab === "Laboratories" && laboratories?.map((l: any) => (
                    <tr key={l.id} className="border-b border-primary/5 hover:bg-primary/5">
                      <td className="px-4 py-3 font-mono text-cyan-400">{l.code}</td>
                      <td className="px-4 py-3 flex items-center gap-2">{l.name} | <button onClick={() => handleToggleStatus("laboratories", l.id, l.status)} className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all border ${l.status === "available" ? "bg-green-400/10 text-green-400 border-green-400/20 hover:bg-green-400/20" : "bg-red-400/10 text-red-400 border-red-400/20 hover:bg-red-400/20"}`}>{l.status}</button></td>
                      <td className="px-4 py-3 text-right"><Button onClick={() => handleDelete("laboratories", l.id)} variant="ghost" size="icon" className="size-8 text-red-400 hover:bg-red-400/10"><Trash2 className="size-4" /></Button></td>
                    </tr>
                  ))}

                  {activeTab === "Buses" && buses?.map((b: any) => (
                    <tr key={b.id} className="border-b border-primary/5 hover:bg-primary/5">
                      <td className="px-4 py-3 font-mono text-cyan-400">{b.bus_number}</td>
                      <td className="px-4 py-3 text-white">{b.route}</td>
                      <td className="px-4 py-3"><span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${b.status === "active" || b.status === "en-route" ? "bg-green-400/10 text-green-400 border-green-400/20" : "bg-red-400/10 text-red-400 border-red-400/20"}`}>{b.status}</span></td>
                      <td className="px-4 py-3 text-muted-foreground">{b.passengers} / {b.capacity}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button onClick={() => setEditingBus(b)} variant="ghost" size="icon" className="size-8 text-cyan-400 hover:bg-cyan-400/10" title="Edit Bus Details"><FileEdit className="size-4" /></Button>
                          <Button onClick={() => handleDelete("buses", b.id)} variant="ghost" size="icon" className="size-8 text-red-400 hover:bg-red-400/10"><Trash2 className="size-4" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            // 🚨 TIMETABLE VIEW (Placeholder for the long grid we had) 🚨
            <div className="mt-4">
              <div className="flex items-center gap-4 mb-4">
                <label className="text-sm font-medium text-white">Select Section:</label>
                <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} className="rounded-lg bg-primary/10 border border-primary/20 text-white p-2 text-sm outline-none">
                  {["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"].map(s => (<option key={s} value={s}>Section {s}</option>))}
                </select>
              </div>
              <div className="overflow-x-auto rounded-xl border border-primary/20">
                <table className="w-full text-sm text-center border-collapse">
                  <thead><tr><th className="border border-primary/20 bg-primary/10 p-2 text-xs text-muted-foreground font-semibold">DAY / TIME</th>{TIME_SLOTS.map(time => (<th key={time} className="border border-primary/20 bg-primary/10 p-2 text-xs text-muted-foreground font-semibold min-w-[100px]">{time}</th>))}</tr></thead>
                  <tbody>
                    {["MON", "TUE", "WED", "THU", "FRI", "SAT"].map(day => (
                      <tr key={day}>
                        <td className="border border-primary/20 bg-primary/5 p-2 font-bold text-cyan-400">{day}</td>
                        {TIMETABLE_DATA[selectedSection][day].map((subject, index) => (
                          <td key={index} className={`border border-primary/20 p-2 text-xs ${subject === "LUNCH" ? "bg-primary/10 text-muted-foreground font-semibold" : subject === "OE" ? "text-yellow-400" : subject === "MENTOR/LIBRARY" ? "text-muted-foreground italic" : "text-white font-medium"}`}>{subject}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </GlassPanel>
      </div>
    </div>
  );
}