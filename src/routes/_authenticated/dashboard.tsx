import { PageHeader } from "@/components/AppShell";
import { GlassPanel, StatusDot } from "@/components/Glass";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useTable } from "@/lib/api";
import { useRole, useSession } from "@/hooks/useAuth";
import {
  Users, UserCog, Building2, Computer, Bus, CalendarClock,
  Activity, AlertCircle, Cpu, Sparkles, Clock, BookOpen,
  GraduationCap, Inbox, PlayCircle, Target, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Page,
});

function Page() {
  const { user } = useSession();
  const { data: role = "student" } = useRole(user);

  if (role === "admin") return <AdminDashboard />;
  if (role === "faculty") return <FacultyDashboard />;
  return <StudentDashboard />;
}

const TIME_SLOTS = ["9:10-10:10", "10:10-11:10", "11:10-12:10", "12:10-1:00", "1:00-2:00", "2:00-3:00", "3:00-4:00", "4:00-5:00"];
const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT"];

// 🚨 MASTER TIMETABLE DATA FOR ALL SECTIONS
const ALL_SECTIONS_TIMETABLE: Record<string, Record<string, { sub: string, fac: string }[]>> = {
  A: {
    MON: [{ sub: "AI LAB", fac: "Ramalingam" }, { sub: "AI LAB", fac: "Ramalingam" }, { sub: "AI LAB", fac: "Ramalingam" }, { sub: "LUNCH", fac: "" }, { sub: "OE", fac: "" }, { sub: "IQTA", fac: "Alok Barik" }, { sub: "HOLISTIC HOUR", fac: "" }, { sub: "HOLISTIC HOUR", fac: "" }],
    TUE: [{ sub: "SS", fac: "" }, { sub: "AI", fac: "Ramalingam" }, { sub: "IQTA", fac: "Alok Barik" }, { sub: "LUNCH", fac: "" }, { sub: "OE", fac: "" }, { sub: "ATCD", fac: "Sreenivasulu" }, { sub: "FSD II LAB", fac: "Jayaselvi" }, { sub: "FSD II LAB", fac: "Jayaselvi" }],
    WED: [{ sub: "CNIP", fac: "Sathish" }, { sub: "ATCD", fac: "Sreenivasulu" }, { sub: "FSD II", fac: "Jayaselvi" }, { sub: "LUNCH", fac: "" }, { sub: "OE", fac: "" }, { sub: "AI", fac: "Ramalingam" }, { sub: "PSOSM", fac: "Rajesh" }, { sub: "BDC", fac: "Kuruku Nirmala" }],
    THU: [{ sub: "CNIP LAB", fac: "Sathish" }, { sub: "CNIP LAB", fac: "Sathish" }, { sub: "CNIP LAB", fac: "Sathish" }, { sub: "LUNCH", fac: "" }, { sub: "BDC", fac: "Kuruku Nirmala" }, { sub: "CNIP", fac: "Sathish" }, { sub: "HOLISTIC HOUR", fac: "" }, { sub: "HOLISTIC HOUR", fac: "" }],
    FRI: [{ sub: "ATCD", fac: "Sreenivasulu" }, { sub: "CNIP", fac: "Sathish" }, { sub: "APT", fac: "" }, { sub: "LUNCH", fac: "" }, { sub: "TINKERING LAB", fac: "" }, { sub: "TINKERING LAB", fac: "" }, { sub: "IQTA", fac: "Alok Barik" }, { sub: "PSOSM", fac: "Rajesh" }],
    SAT: [{ sub: "PSOSM", fac: "Rajesh" }, { sub: "BDC", fac: "Kuruku Nirmala" }, { sub: "AI", fac: "Ramalingam" }, { sub: "MENTOR/LIBRARY", fac: "" }, { sub: "—", fac: "" }, { sub: "—", fac: "" }, { sub: "—", fac: "" }, { sub: "—", fac: "" }],
  },
  B: {
    MON: [{ sub: "AI", fac: "Sri Lakshmi Preethi" }, { sub: "IQTA", fac: "Alok Barik" }, { sub: "APT", fac: "Shaik Tipu" }, { sub: "LUNCH", fac: "" }, { sub: "OE", fac: "" }, { sub: "BDC", fac: "Anandaraj" }, { sub: "HOLISTIC HOUR", fac: "" }, { sub: "HOLISTIC HOUR", fac: "" }],
    TUE: [{ sub: "CNIP", fac: "Sravanyadevi" }, { sub: "TINKERING LAB", fac: "" }, { sub: "TINKERING LAB", fac: "" }, { sub: "LUNCH", fac: "" }, { sub: "OE", fac: "" }, { sub: "IQTA", fac: "Alok Barik" }, { sub: "SS", fac: "Anandkumar" }, { sub: "PSOSM", fac: "Lakshmana Rao" }],
    WED: [{ sub: "ATCD", fac: "Jayaselvi" }, { sub: "CNIP", fac: "Sravanyadevi" }, { sub: "FSD II", fac: "Galeeb / Hemanand" }, { sub: "LUNCH", fac: "" }, { sub: "OE", fac: "" }, { sub: "AI", fac: "Sri Lakshmi Preethi" }, { sub: "FSD II LAB", fac: "Galeeb / Hemanand" }, { sub: "FSD II LAB", fac: "Galeeb / Hemanand" }],
    THU: [{ sub: "AI LAB", fac: "Sri Lakshmi Preethi / Vasanthara Devi" }, { sub: "AI LAB", fac: "Sri Lakshmi Preethi / Vasanthara Devi" }, { sub: "AI LAB", fac: "Sri Lakshmi Preethi / Vasanthara Devi" }, { sub: "LUNCH", fac: "" }, { sub: "IQTA", fac: "Alok Barik" }, { sub: "ATCD", fac: "Jayaselvi" }, { sub: "HOLISTIC HOUR", fac: "" }, { sub: "HOLISTIC HOUR", fac: "" }],
    FRI: [{ sub: "CNIP LAB", fac: "Sravanyadevi / Rajesh" }, { sub: "CNIP LAB", fac: "Sravanyadevi / Rajesh" }, { sub: "CNIP LAB", fac: "Sravanyadevi / Rajesh" }, { sub: "LUNCH", fac: "" }, { sub: "PSOSM", fac: "Lakshmana Rao" }, { sub: "CNIP", fac: "Sravanyadevi" }, { sub: "AI", fac: "Sri Lakshmi Preethi" }, { sub: "BDC", fac: "Anandaraj" }],
    SAT: [{ sub: "PSOSM", fac: "Lakshmana Rao" }, { sub: "BDC", fac: "Anandaraj" }, { sub: "ATCD", fac: "Jayaselvi" }, { sub: "MENTOR/LIBRARY", fac: "" }, { sub: "—", fac: "" }, { sub: "—", fac: "" }, { sub: "—", fac: "" }, { sub: "—", fac: "" }],
  },
  C: {
    MON: [{ sub: "AI", fac: "Vasundara Devi" }, { sub: "CNIP", fac: "Shabbeer Basha" }, { sub: "BDC", fac: "Nitin Raut" }, { sub: "LUNCH", fac: "" }, { sub: "OE", fac: "" }, { sub: "ATCD", fac: "Dinesh Singh" }, { sub: "HOLISTIC HOUR", fac: "" }, { sub: "HOLISTIC HOUR", fac: "" }],
    TUE: [{ sub: "CNIP LAB", fac: "Shabbeer Basha / Anandaraj" }, { sub: "CNIP LAB", fac: "Shabbeer Basha / Anandaraj" }, { sub: "CNIP LAB", fac: "Shabbeer Basha / Anandaraj" }, { sub: "LUNCH", fac: "" }, { sub: "OE", fac: "" }, { sub: "AI", fac: "Vasundara Devi" }, { sub: "TINKERING LAB", fac: "Murali / Ramalingam" }, { sub: "TINKERING LAB", fac: "Murali / Ramalingam" }],
    WED: [{ sub: "AI LAB", fac: "Vasundara Devi / Murali" }, { sub: "AI LAB", fac: "Vasundara Devi / Murali" }, { sub: "AI LAB", fac: "Vasundara Devi / Murali" }, { sub: "LUNCH", fac: "" }, { sub: "OE", fac: "" }, { sub: "IQTA", fac: "Alok Barik" }, { sub: "APT", fac: "Shaik Tipu" }, { sub: "PSOSM", fac: "Jayaselvi" }],
    THU: [{ sub: "IQTA", fac: "Alok Barik" }, { sub: "ATCD", fac: "Dinesh Singh" }, { sub: "SS", fac: "Anandkumar" }, { sub: "LUNCH", fac: "" }, { sub: "FSD II LAB", fac: "Murali / Ramalingam" }, { sub: "FSD II LAB", fac: "Murali / Ramalingam" }, { sub: "HOLISTIC HOUR", fac: "" }, { sub: "HOLISTIC HOUR", fac: "" }],
    FRI: [{ sub: "ATCD", fac: "Dinesh Singh" }, { sub: "IQTA", fac: "Alok Barik" }, { sub: "FSD II", fac: "Sri Lakshmi Preethi" }, { sub: "LUNCH", fac: "" }, { sub: "PSOSM", fac: "Jayaselvi" }, { sub: "CNIP", fac: "Shabbeer Basha" }, { sub: "AI", fac: "Vasundara Devi" }, { sub: "BDC", fac: "Nitin Raut" }],
    SAT: [{ sub: "PSOSM", fac: "Jayaselvi" }, { sub: "BDC", fac: "Nitin Raut" }, { sub: "CNIP", fac: "Shabbeer Basha" }, { sub: "MENTOR/LIBRARY", fac: "" }, { sub: "—", fac: "" }, { sub: "—", fac: "" }, { sub: "—", fac: "" }, { sub: "—", fac: "" }],
  },
  D: {
    MON: [{ sub: "CNIP LAB", fac: "Renuka / Sathish" }, { sub: "CNIP LAB", fac: "Renuka / Sathish" }, { sub: "CNIP LAB", fac: "Renuka / Sathish" }, { sub: "LUNCH", fac: "" }, { sub: "OE", fac: "" }, { sub: "CNIP", fac: "Renuka" }, { sub: "HOLISTIC HOUR", fac: "" }, { sub: "HOLISTIC HOUR", fac: "" }],
    TUE: [{ sub: "AI LAB", fac: "Thangarasan / Varshadevi" }, { sub: "AI LAB", fac: "Thangarasan / Varshadevi" }, { sub: "AI LAB", fac: "Thangarasan / Varshadevi" }, { sub: "LUNCH", fac: "" }, { sub: "OE", fac: "" }, { sub: "PSOSM", fac: "Kavi Priya" }, { sub: "ATCD", fac: "Dinesh Singh" }, { sub: "BDC", fac: "Aleemullakhan" }],
    WED: [{ sub: "ATCD", fac: "Dinesh Singh" }, { sub: "IQTA", fac: "Sanjaya Brahman" }, { sub: "CNIP", fac: "Renuka" }, { sub: "LUNCH", fac: "" }, { sub: "OE", fac: "" }, { sub: "AI", fac: "Thangarasan" }, { sub: "TINKERING LAB", fac: "Geetha / Galeeb" }, { sub: "TINKERING LAB", fac: "Geetha / Galeeb" }],
    THU: [{ sub: "AI", fac: "Thangarasan" }, { sub: "BDC", fac: "Aleemullakhan" }, { sub: "PSOSM", fac: "Kavi Priya" }, { sub: "LUNCH", fac: "" }, { sub: "FSD II", fac: "Sri Lakshmi Preethi" }, { sub: "IQTA", fac: "Sanjaya Brahman" }, { sub: "HOLISTIC HOUR", fac: "" }, { sub: "HOLISTIC HOUR", fac: "" }],
    FRI: [{ sub: "CNIP", fac: "Renuka" }, { sub: "SS", fac: "Anandkumar" }, { sub: "AI", fac: "Thangarasan" }, { sub: "LUNCH", fac: "" }, { sub: "IQTA", fac: "Sanjaya Brahman" }, { sub: "APT", fac: "Shaik Tipu" }, { sub: "FSD II LAB", fac: "Sri Lakshmi Preethi / Kavi Priya" }, { sub: "FSD II LAB", fac: "Sri Lakshmi Preethi / Kavi Priya" }],
    SAT: [{ sub: "PSOSM", fac: "Kavi Priya" }, { sub: "BDC", fac: "Aleemullakhan" }, { sub: "ATCD", fac: "Dinesh Singh" }, { sub: "MENTOR/LIBRARY", fac: "" }, { sub: "—", fac: "" }, { sub: "—", fac: "" }, { sub: "—", fac: "" }, { sub: "—", fac: "" }],
  },
  E: {
    MON: [{ sub: "IQTA", fac: "Sanjaya Brahman" }, { sub: "CNIP", fac: "Kavi Priya" }, { sub: "ATCD", fac: "Hemanand" }, { sub: "LUNCH", fac: "" }, { sub: "OE", fac: "" }, { sub: "AI", fac: "Bommy" }, { sub: "HOLISTIC HOUR", fac: "" }, { sub: "HOLISTIC HOUR", fac: "" }],
    TUE: [{ sub: "AI", fac: "Bommy" }, { sub: "FSD II", fac: "Sri Lakshmi Preethi" }, { sub: "IQTA", fac: "Sanjaya Brahman" }, { sub: "LUNCH", fac: "" }, { sub: "OE", fac: "" }, { sub: "ATCD", fac: "Hemanand" }, { sub: "FSD II LAB", fac: "Sri Lakshmi Preethi / Kavi Priya" }, { sub: "FSD II LAB", fac: "Sri Lakshmi Preethi / Kavi Priya" }],
    WED: [{ sub: "CNIP LAB", fac: "Kavi Priya / Thangarasan" }, { sub: "CNIP LAB", fac: "Kavi Priya / Thangarasan" }, { sub: "CNIP LAB", fac: "Kavi Priya / Thangarasan" }, { sub: "LUNCH", fac: "" }, { sub: "OE", fac: "" }, { sub: "CNIP", fac: "Kavi Priya" }, { sub: "PSOSM", fac: "Vijayganth" }, { sub: "BDC", fac: "Sowmyadevi" }],
    THU: [{ sub: "APT", fac: "Shaik Tipu" }, { sub: "TINKERING LAB", fac: "Sathish / Sowmyadevi" }, { sub: "TINKERING LAB", fac: "Sathish / Sowmyadevi" }, { sub: "LUNCH", fac: "" }, { sub: "AI", fac: "Bommy" }, { sub: "BDC", fac: "Sowmyadevi" }, { sub: "HOLISTIC HOUR", fac: "" }, { sub: "HOLISTIC HOUR", fac: "" }],
    FRI: [{ sub: "AI LAB", fac: "Bommy / Hemanand" }, { sub: "AI LAB", fac: "Bommy / Hemanand" }, { sub: "AI LAB", fac: "Bommy / Hemanand" }, { sub: "LUNCH", fac: "" }, { sub: "PSOSM", fac: "Vijayganth" }, { sub: "SS", fac: "Anandkumar" }, { sub: "CNIP", fac: "Kavi Priya" }, { sub: "IQTA", fac: "Sanjaya Brahman" }],
    SAT: [{ sub: "PSOSM", fac: "Vijayganth" }, { sub: "BDC", fac: "Sowmyadevi" }, { sub: "ATCD", fac: "Hemanand" }, { sub: "MENTOR/LIBRARY", fac: "" }, { sub: "—", fac: "" }, { sub: "—", fac: "" }, { sub: "—", fac: "" }, { sub: "—", fac: "" }],
  },
  F: {
    MON: [{ sub: "AI LAB", fac: "Vandana / Geetha" }, { sub: "AI LAB", fac: "Vandana / Geetha" }, { sub: "AI LAB", fac: "Vandana / Geetha" }, { sub: "LUNCH", fac: "" }, { sub: "OE", fac: "" }, { sub: "IQTA", fac: "Sanjaya Brahman" }, { sub: "HOLISTIC HOUR", fac: "" }, { sub: "HOLISTIC HOUR", fac: "" }],
    TUE: [{ sub: "ATCD", fac: "Anandaraj" }, { sub: "AI", fac: "Geetha" }, { sub: "APT", fac: "Shaik Tipu" }, { sub: "LUNCH", fac: "" }, { sub: "OE", fac: "" }, { sub: "BDC", fac: "Sathish" }, { sub: "IQTA", fac: "Sanjaya Brahman" }, { sub: "CNIP", fac: "Anandaraj" }],
    WED: [{ sub: "CNIP", fac: "Anandaraj" }, { sub: "FSD II", fac: "Sri Lakshmi Preethi" }, { sub: "VERBAL", fac: "Rama Mohan" }, { sub: "LUNCH", fac: "" }, { sub: "OE", fac: "" }, { sub: "ATCD", fac: "Anandaraj" }, { sub: "FSD II LAB", fac: "Sri Lakshmi Preethi / Kavi Priya" }, { sub: "FSD II LAB", fac: "Sri Lakshmi Preethi / Kavi Priya" }],
    THU: [{ sub: "IQTA", fac: "Sanjaya Brahman" }, { sub: "CNIP", fac: "Anandaraj" }, { sub: "PSOSM", fac: "Sreenivasulu" }, { sub: "LUNCH", fac: "" }, { sub: "TINKERING LAB", fac: "Murali / Renuka" }, { sub: "TINKERING LAB", fac: "Murali / Renuka" }, { sub: "HOLISTIC HOUR", fac: "" }, { sub: "HOLISTIC HOUR", fac: "" }],
    FRI: [{ sub: "CNIP LAB", fac: "Anandaraj / Vasundara" }, { sub: "CNIP LAB", fac: "Anandaraj / Vasundara" }, { sub: "CNIP LAB", fac: "Anandaraj / Vasundara" }, { sub: "LUNCH", fac: "" }, { sub: "AI", fac: "Geetha" }, { sub: "ATCD", fac: "Anandaraj" }, { sub: "BDC", fac: "Sathish" }, { sub: "PSOSM", fac: "Sreenivasulu" }],
    SAT: [{ sub: "PSOSM", fac: "Sreenivasulu" }, { sub: "BDC", fac: "Sathish" }, { sub: "AI", fac: "Geetha" }, { sub: "MENTOR/LIBRARY", fac: "" }, { sub: "—", fac: "" }, { sub: "—", fac: "" }, { sub: "—", fac: "" }, { sub: "—", fac: "" }],
  },
  G: {
    MON: [{ sub: "CNIP", fac: "Rajesh" }, { sub: "VERBAL", fac: "Rama Mohan" }, { sub: "IQTA", fac: "Jagadeesh Babu" }, { sub: "LUNCH", fac: "" }, { sub: "OE", fac: "" }, { sub: "ATCD", fac: "Geetha" }, { sub: "HOLISTIC HOUR", fac: "" }, { sub: "HOLISTIC HOUR", fac: "" }],
    TUE: [{ sub: "AI LAB", fac: "Sri Lakshmi Preethi / Kavi Priya" }, { sub: "AI LAB", fac: "Sri Lakshmi Preethi / Kavi Priya" }, { sub: "AI LAB", fac: "Sri Lakshmi Preethi / Kavi Priya" }, { sub: "LUNCH", fac: "" }, { sub: "OE", fac: "" }, { sub: "ATCD", fac: "Geetha" }, { sub: "CNIP", fac: "Rajesh" }, { sub: "PSOSM", fac: "Renuka" }],
    WED: [{ sub: "FSD II", fac: "Sri Lakshmi Preethi" }, { sub: "AI", fac: "Geetha" }, { sub: "CNIP", fac: "Rajesh" }, { sub: "LUNCH", fac: "" }, { sub: "OE", fac: "" }, { sub: "IQTA", fac: "Jagadeesh Babu" }, { sub: "FSD II LAB", fac: "Sri Lakshmi Preethi / Kavi Priya" }, { sub: "FSD II LAB", fac: "Sri Lakshmi Preethi / Kavi Priya" }],
    THU: [{ sub: "CNIP LAB", fac: "Rajesh / Renuka" }, { sub: "CNIP LAB", fac: "Rajesh / Renuka" }, { sub: "CNIP LAB", fac: "Rajesh / Renuka" }, { sub: "LUNCH", fac: "" }, { sub: "BDC", fac: "Deepthi" }, { sub: "APT", fac: "Shaik Tipu" }, { sub: "HOLISTIC HOUR", fac: "" }, { sub: "HOLISTIC HOUR", fac: "" }],
    FRI: [{ sub: "ATCD", fac: "Geetha" }, { sub: "TINKERING LAB", fac: "Vandana / Bommy" }, { sub: "TINKERING LAB", fac: "Vandana / Bommy" }, { sub: "LUNCH", fac: "" }, { sub: "AI", fac: "Geetha" }, { sub: "PSOSM", fac: "Renuka" }, { sub: "IQTA", fac: "Jagadeesh Babu" }, { sub: "BDC", fac: "Deepthi" }],
    SAT: [{ sub: "PSOSM", fac: "Renuka" }, { sub: "BDC", fac: "Deepthi" }, { sub: "AI", fac: "Geetha" }, { sub: "MENTOR/LIBRARY", fac: "" }, { sub: "—", fac: "" }, { sub: "—", fac: "" }, { sub: "—", fac: "" }, { sub: "—", fac: "" }],
  },
  H: {
    MON: [{ sub: "CNIP LAB", fac: "Shabbeer / Murali" }, { sub: "CNIP LAB", fac: "Shabbeer / Murali" }, { sub: "CNIP LAB", fac: "Shabbeer / Murali" }, { sub: "LUNCH", fac: "" }, { sub: "OE", fac: "" }, { sub: "VERBAL", fac: "Rama Mohan" }, { sub: "HOLISTIC HOUR", fac: "" }, { sub: "HOLISTIC HOUR", fac: "" }],
    TUE: [{ sub: "APT", fac: "Shaik Tipu" }, { sub: "ATCD", fac: "Sreenivasulu" }, { sub: "AI", fac: "Deepthi" }, { sub: "LUNCH", fac: "" }, { sub: "OE", fac: "" }, { sub: "IQTA", fac: "Jagadeesh Babu" }, { sub: "PSOSM", fac: "Galeeb" }, { sub: "BDC", fac: "Shabbeer" }],
    WED: [{ sub: "AI LAB", fac: "Varshadevi" }, { sub: "AI LAB", fac: "Deepthi / Vijayganth" }, { sub: "AI LAB", fac: "Deepthi / Vijayganth" }, { sub: "LUNCH", fac: "" }, { sub: "OE", fac: "" }, { sub: "CNIP", fac: "Murali" }, { sub: "ATCD", fac: "Sreenivasulu" }, { sub: "PSOSM", fac: "Galeeb" }],
    THU: [{ sub: "AI", fac: "Deepthi" }, { sub: "IQTA", fac: "Jagadeesh Babu" }, { sub: "BDC", fac: "Shabbeer" }, { sub: "LUNCH", fac: "" }, { sub: "FSD II LAB", fac: "Murali / Deepthi" }, { sub: "FSD II LAB", fac: "Murali / Deepthi" }, { sub: "HOLISTIC HOUR", fac: "" }, { sub: "HOLISTIC HOUR", fac: "" }],
    FRI: [{ sub: "CNIP", fac: "Murali" }, { sub: "FSD II", fac: "Kavi Priya" }, { sub: "ATCD", fac: "Sreenivasulu" }, { sub: "LUNCH", fac: "" }, { sub: "IQTA", fac: "Jagadeesh Babu" }, { sub: "AI", fac: "Deepthi" }, { sub: "TINKERING LAB", fac: "Murali / Vijayganth" }, { sub: "TINKERING LAB", fac: "Murali / Vijayganth" }],
    SAT: [{ sub: "PSOSM", fac: "Galeeb" }, { sub: "BDC", fac: "Shabbeer" }, { sub: "CNIP", fac: "Murali" }, { sub: "MENTOR/LIBRARY", fac: "" }, { sub: "—", fac: "" }, { sub: "—", fac: "" }, { sub: "—", fac: "" }, { sub: "—", fac: "" }],
  },
   I: {
    MON: [
      { sub: "CNIP", fac: "Vijayganth" }, 
      { sub: "AI", fac: "Varshadevi" }, // 🚨 AI for Varshadevi
      { sub: "FSD II", fac: "Sangeetha" }, 
      { sub: "LUNCH", fac: "" }, 
      { sub: "OE", fac: "" }, 
      { sub: "ATCD", fac: "Sanoop" }, 
      { sub: "HOLISTIC HOUR", fac: "" }, 
      { sub: "HOLISTIC HOUR", fac: "" }
    ],
    TUE: [
      { sub: "CNIP LAB", fac: "Varshadevi / Jayaselvi" }, 
      { sub: "CNIP LAB", fac: "Varshadevi / Jayaselvi" }, 
      { sub: "CNIP LAB", fac: "Varshadevi / Jayaselvi" }, 
      { sub: "LUNCH", fac: "" }, 
      { sub: "OE", fac: "" }, 
      { sub: "IQTA", fac: "Vijayganth" }, 
      { sub: "BDC", fac: "Renuka" }, 
      { sub: "PSOSM", fac: "Murali" }
    ],
    WED: [
      { sub: "IQTA", fac: "Vijayganth" }, 
      { sub: "TINKERING LAB", fac: "Kavi Priya / Thangarasan" }, 
      { sub: "TINKERING LAB", fac: "Kavi Priya / Thangarasan" }, 
      { sub: "LUNCH", fac: "" }, 
      { sub: "OE", fac: "" }, 
      { sub: "AI", fac: "Varshadevi" }, // 🚨 AI for Varshadevi
      { sub: "APT", fac: "Shaik Tipu" }, 
      { sub: "PSOSM", fac: "Murali" }
    ],
    THU: [
      { sub: "AI LAB", fac: "Varshadevi / Jayaselvi" }, 
      { sub: "AI LAB", fac: "Varshadevi / Jayaselvi" }, 
      { sub: "AI LAB", fac: "Varshadevi / Jayaselvi" }, 
      { sub: "LUNCH", fac: "" }, 
      { sub: "ATCD", fac: "Sanoop" }, 
      { sub: "CNIP", fac: "Varshadevi" }, 
      { sub: "HOLISTIC HOUR", fac: "" }, 
      { sub: "HOLISTIC HOUR", fac: "" }
    ],
    FRI: [
      { sub: "VERBAL", fac: "Rama Mohan" }, 
      { sub: "ATCD", fac: "Sanoop" }, 
      { sub: "CNIP", fac: "Varshadevi" }, 
      { sub: "LUNCH", fac: "" }, 
      { sub: "FSD II LAB", fac: "Sangeetha / Varshadevi" }, 
      { sub: "FSD II LAB", fac: "Sangeetha / Varshadevi" }, 
      { sub: "IQTA", fac: "Vijayganth" }, 
      { sub: "BDC", fac: "Renuka" }
    ],
    SAT: [
      { sub: "PSOSM", fac: "Murali" }, 
      { sub: "BDC", fac: "Renuka" }, 
      { sub: "AI", fac: "Varshadevi" }, // 🚨 AI for Varshadevi
      { sub: "MENTOR/LIBRARY", fac: "" }, 
      { sub: "—", fac: "" }, 
      { sub: "—", fac: "" }, 
      { sub: "—", fac: "" }, 
      { sub: "—", fac: "" }
    ],
  },
  J: {
    MON: [{ sub: "CNIP", fac: "Deepthi" }, { sub: "FSD II", fac: "Sangeetha" }, { sub: "BDC", fac: "Hemanand" }, { sub: "LUNCH", fac: "" }, { sub: "OE", fac: "" }, { sub: "AI", fac: "Deepthi" }, { sub: "HOLISTIC HOUR", fac: "" }, { sub: "HOLISTIC HOUR", fac: "" }],
    TUE: [{ sub: "AI", fac: "Deepthi" }, { sub: "IQTA", fac: "Sanoop" }, { sub: "ATCD", fac: "Hemanand" }, { sub: "LUNCH", fac: "" }, { sub: "OE", fac: "" }, { sub: "BDC", fac: "Hemanand" }, { sub: "TINKERING LAB", fac: "Sri Lakshmi Preethi / Vandana" }, { sub: "TINKERING LAB", fac: "Sri Lakshmi Preethi / Vandana" }],
    WED: [{ sub: "CNIP LAB", fac: "Sangeetha / Shabbeer" }, { sub: "CNIP LAB", fac: "Sangeetha / Shabbeer" }, { sub: "CNIP LAB", fac: "Sangeetha / Shabbeer" }, { sub: "LUNCH", fac: "" }, { sub: "OE", fac: "" }, { sub: "PSOSM", fac: "Vandana" }, { sub: "CNIP", fac: "Sangeetha" }, { sub: "VERBAL", fac: "Rama Mohan" }],
    THU: [{ sub: "ATCD", fac: "Hemanand" }, { sub: "IQTA", fac: "Sanoop" }, { sub: "AI", fac: "Deepthi" }, { sub: "LUNCH", fac: "" }, { sub: "FSD II LAB", fac: "Sri Lakshmi Preethi / Kavi Priya" }, { sub: "FSD II LAB", fac: "Sri Lakshmi Preethi / Kavi Priya" }, { sub: "HOLISTIC HOUR", fac: "" }, { sub: "HOLISTIC HOUR", fac: "" }],
    FRI: [{ sub: "AI LAB", fac: "Deepthi / Shabbeer" }, { sub: "AI LAB", fac: "Deepthi / Shabbeer" }, { sub: "AI LAB", fac: "Deepthi / Shabbeer" }, { sub: "LUNCH", fac: "" }, { sub: "IQTA", fac: "Sanoop" }, { sub: "ATCD", fac: "Hemanand" }, { sub: "APT", fac: "Shaik Tipu" }, { sub: "PSOSM", fac: "Vandana" }],
    SAT: [{ sub: "PSOSM", fac: "Vandana" }, { sub: "BDC", fac: "Hemanand" }, { sub: "CNIP", fac: "Sangeetha" }, { sub: "MENTOR/LIBRARY", fac: "" }, { sub: "—", fac: "" }, { sub: "—", fac: "" }, { sub: "—", fac: "" }, { sub: "—", fac: "" }],
  }
};

/* ============================================================
   FACULTY DASHBOARD (MASTER FILTER)
   ============================================================ */
function FacultyDashboard() {
  const { user } = useSession();
  const navigate = useNavigate();

  const { data: faculty } = useTable("faculty");
  const { data: requests } = useTable("requests");
  const { data: agents } = useTable("agents");
  const { data: mentorMentee } = useTable("mentor_mentee");
  const { data: classrooms } = useTable("classrooms");
  const { data: laboratories } = useTable("laboratories");

  // 1. Find the logged-in faculty
  let me: any = faculty?.find(
    (f: any) => f["email"]?.toLowerCase() === user?.email?.toLowerCase()
  );
  if (!me) {
    me = faculty?.find((f: any) => f["name"]?.toLowerCase().includes("geetha"));
  }

  // 🚨 ROBUST LAST-NAME EXTRACTION
  // Handles "Mrs.V.Geetha", "Dr. G. Arun Kumar", "Mr. K. Sathish", etc.
  const getLastName = (fullName: string): string => {
    if (!fullName) return "";
    const cleaned = fullName
      .replace(/\b(Mr|Mrs|Ms|Dr|Prof)\.?\s*/gi, "")
      .replace(/\./g, " ")
      .trim();
    const parts = cleaned.split(/\s+/).filter(Boolean);
    return (parts[parts.length - 1] || "").toLowerCase();
  };

  const myShortName = getLastName(me?.["name"] || "") || "geetha";

  // 2. Mentees Count
  const myMenteeIds = new Set(
    (mentorMentee as any[])?.filter((m) => m["faculty_id"] === me?.["id"])?.map((m) => m["student_id"]) || []
  );
  const myMenteeCount = myMenteeIds.size;

  const myRequests = (requests as any[])?.filter(
    (r) => r["requester_name"]?.toLowerCase().includes(myShortName)
  ) || [];
  const myPendingRequests = myRequests.filter((r) => r["status"] === "pending").length;
  
  const availableRooms = (classrooms as any[])?.filter((c) => c["status"] === "available").length || 0;
  const availableLabs = (laboratories as any[])?.filter((l) => l["status"] === "available").length || 0;
  const dateStr = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  const firstName = me?.["name"]?.split(" ").slice(-1)[0] ?? "Faculty";

  return (
    <div className="mx-auto w-full max-w-7xl">
      <PageHeader
        title={`Welcome, ${firstName}`}
        subtitle={`${me?.["designation"] ?? "Faculty"} · Computer Science & Engineering · ${dateStr}`}
        actions={
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs text-green-400">
              <span className="size-2 rounded-full bg-green-400 animate-pulse" />
              LIVE
            </span>
            <span className="text-xs text-muted-foreground">{agents?.length ?? 0} agents online</span>
          </div>
        }
      />

      {/* Top Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-6">
        <GlassPanel hover className="p-4 cursor-pointer" onClick={() => navigate({ to: "/mentees", search: { facultyId: me?.id } as any })}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">My Mentees</p>
              <p className="text-2xl font-semibold mt-1 text-green-400">{myMenteeCount}</p>
            </div>
            <Users className="size-8 text-green-400 opacity-60" />
          </div>
        </GlassPanel>

        <GlassPanel hover className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Pending Requests</p>
              <p className="text-2xl font-semibold mt-1">{myPendingRequests}</p>
            </div>
            <Inbox className="size-8 text-yellow-400 opacity-60" />
          </div>
        </GlassPanel>

        <GlassPanel hover className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">AI Agents Online</p>
              <p className="text-2xl font-semibold mt-1 text-cyan-400">{agents?.length ?? 0}</p>
            </div>
            <Cpu className="size-8 text-cyan-400 opacity-60" />
          </div>
        </GlassPanel>
        
        <GlassPanel hover className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Available Rooms</p>
              <p className="text-2xl font-semibold mt-1 text-cyan-400">{availableRooms}</p>
            </div>
            <Building2 className="size-8 text-cyan-400 opacity-60" />
          </div>
        </GlassPanel>
      </div>

      {/* 🚨 ALL SECTIONS TIMETABLE GRID (FILTERED) 🚨 */}
      <div className="mt-6 space-y-8">
        {Object.entries(ALL_SECTIONS_TIMETABLE).map(([section, schedule]) => {
          
          // Check if this faculty teaches anything in this section
          const hasClassInSection = Object.values(schedule).some(daySlots => 
            daySlots.some(cell => cell.fac && cell.fac.toLowerCase().includes(myShortName))
          );

          // If they don't teach in this section, we skip rendering it entirely!
          if (!hasClassInSection) return null;

          return (
            <GlassPanel key={section} level={2} className="p-5 border-cyan-500/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <CalendarClock className="text-cyan-400 size-4" />
                  Section {section} — Your Assigned Classes
                </h3>
                <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded-full border border-cyan-500/30">
                  You teach here
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-primary/20">
                <table className="w-full text-sm text-center border-collapse">
                  <thead>
                    <tr>
                      <th className="border border-primary/20 bg-primary/10 p-2 text-[10px] text-muted-foreground font-semibold w-16">DAY</th>
                      {TIME_SLOTS.map(time => (
                        <th key={time} className="border border-primary/20 bg-primary/10 p-2 text-[10px] text-muted-foreground font-semibold">{time}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {DAYS.map(day => (
                      <tr key={day}>
                        <td className="border border-primary/20 bg-primary/5 p-2 font-bold text-cyan-400 text-xs">{day}</td>
                        {schedule[day].map((cell, idx) => {
                          const isMyClass = cell.fac && cell.fac.toLowerCase().includes(myShortName);
                          const isLab = cell.sub.includes("LAB") || cell.sub.includes("TINKERING");

                          // If it's NOT my class, leave it empty (or faded)
                          if (!isMyClass) {
                            return (
                              <td key={idx} className="border border-primary/20 p-2 text-[10px] bg-black/40 text-transparent select-none">
                                {cell.sub}
                              </td>
                            );
                          }

                          // If it IS my class, highlight it
                          return (
                            <td 
                              key={idx} 
                              className={`border border-primary/20 p-2 text-[10px] font-bold ${
                                isLab ? "bg-violet-500/20 text-violet-300 border-violet-500/50 shadow-[inset_0_0_15px_rgba(139,92,246,0.3)]" :
                                "bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-[inset_0_0_15px_rgba(34,211,238,0.3)]"
                              }`}
                            >
                              {cell.sub}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassPanel>
          );
        })}

        {/* Empty state if no sections match */}
        {!Object.entries(ALL_SECTIONS_TIMETABLE).some(([, schedule]) =>
          Object.values(schedule).some(daySlots =>
            daySlots.some(cell => cell.fac && cell.fac.toLowerCase().includes(myShortName))
          )
        ) && (
          <GlassPanel level={2} className="p-10 text-center">
            <CalendarClock className="size-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-sm font-semibold text-white mb-2">No classes assigned</p>
            <p className="text-xs text-muted-foreground">
              The AI Agent could not find any section where <span className="text-cyan-400 font-mono">{me?.name || "this faculty"}</span> is scheduled.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Detected last name: <span className="text-cyan-400 font-mono">{myShortName}</span>
            </p>
          </GlassPanel>
        )}
      </div>
    </div>
  );
}

function StudentDashboard() {
  const { user } = useSession();
  const navigate = useNavigate();
  const { data: students } = useTable("students");
  const { data: agents } = useTable("agents");
  const { data: buses } = useTable("buses");
  const { data: laboratories } = useTable("laboratories");
  const { data: requests } = useTable("requests");
  const { data: batches } = useTable("batches");

  if (!students) return <div className="p-20 text-center animate-pulse">Loading Student Data...</div>;

  // 1. Find the logged-in student
  const me: any = students?.find((s: any) => s["email"]?.toLowerCase() === user?.email?.toLowerCase()) ?? students?.[0];
  
  // 2. Figure out their section (from batch, or fallback to "I" if testing with Vani)
  const myBatch = (batches as any[])?.find(b => b.id === me?.["batch_id"]);
  const mySection = myBatch?.section || me?.["section"] || "I"; // Default to I for demo
  
  // 3. Calculate Today's Schedule
  const today = new Date().toLocaleDateString("en-US", { weekday: "short" }).toUpperCase().slice(0, 3);
  const todaySchedule = ALL_SECTIONS_TIMETABLE[mySection]?.[today] || [];
  const hasClassesToday = todaySchedule.some(c => c.sub !== "LUNCH" && c.sub !== "—" && c.sub !== "OE");

  // 4. Extract data for stats
  const availableLabs = laboratories?.filter((l: any) => l["status"] === "available").length || 0;
  const nextBus: any = buses?.find((b: any) => b["status"] === "en-route") ?? buses?.[0];
  const myRequests = requests?.slice(0, 3) || [];
  const dateStr = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  return (
    <div className="mx-auto w-full max-w-7xl">
      <PageHeader
        title={`Welcome, ${me?.["name"]?.split(" ")[0] ?? user?.email?.split("@")[0] ?? "Student"}`}
        subtitle={`${dateStr} · Section ${mySection} · Your classes, requests and campus updates`}
        actions={
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs text-green-400">
              <span className="size-2 rounded-full bg-green-400 animate-pulse" />
              LIVE
            </span>
            <span className="text-xs text-muted-foreground">{agents?.length ?? 0} agents online</span>
          </div>
        }
      />

      {/* Top Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-6">
        <GlassPanel hover className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">My Attendance</p>
              <p className="text-2xl font-semibold mt-1">{Math.round(me?.["attendance"] ?? 89)}%</p>
            </div>
            <GraduationCap className="size-8 text-cyan-400 opacity-60" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Roll: {me?.["roll_no"] ?? "—"} · Sem {me?.["semester"] ?? 3}
          </p>
        </GlassPanel>

        <GlassPanel hover className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Available Labs</p>
              <p className="text-2xl font-semibold mt-1">{availableLabs}</p>
            </div>
            <Computer className="size-8 text-violet-400 opacity-60" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">Free to use now</p>
        </GlassPanel>

        <GlassPanel hover className="p-4 cursor-pointer" onClick={() => navigate({ to: "/requests" })}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">My Requests</p>
              <p className="text-2xl font-semibold mt-1">{myRequests.length}</p>
            </div>
            <BookOpen className="size-8 text-cyan-400 opacity-60" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">Active requests</p>
        </GlassPanel>

        <GlassPanel hover className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Next Bus</p>
              <p className="text-2xl font-semibold mt-1">{nextBus?.["bus_number"] ?? "—"}</p>
            </div>
            <Bus className="size-8 text-yellow-400 opacity-60" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {nextBus ? `${nextBus["passengers"]}/${nextBus["capacity"]} seats` : "No buses"}
          </p>
        </GlassPanel>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Dynamic Today's Schedule */}
        <GlassPanel level={2} className="p-5">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <CalendarClock className="size-4 text-cyan-400" />
            Today's Schedule ({today})
          </h3>
          
          {hasClassesToday ? (
            <div className="space-y-2">
              {todaySchedule.map((cell, idx) => {
                if (cell.sub === "LUNCH" || cell.sub === "—" || cell.sub === "OE") return null; // Skip empty slots
                return (
                  <div key={idx} className="flex items-center justify-between rounded bg-primary/5 p-3 border border-primary/10">
                    <div>
                      <p className="text-sm font-bold text-white">{cell.sub}</p>
                      <p className="text-xs text-muted-foreground">Slot {idx + 1} · {TIME_SLOTS[idx]}</p>
                    </div>
                    <span className="text-xs text-cyan-400 font-mono">{cell.fac}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              <Sparkles className="size-8 mx-auto text-muted-foreground/30 mb-2" />
              <p className="text-sm">No classes scheduled for today!</p>
              <p className="text-xs mt-1">Enjoy your free time.</p>
            </div>
          )}
        </GlassPanel>

        {/* Dynamic AI Recommendations */}
        <GlassPanel level={2} className="p-5">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="size-4 text-yellow-400" />
            AI Recommendations
          </h3>
          <div className="space-y-3">
            {/* Dynamic Next Class */}
            <div className="rounded bg-primary/5 p-3 border border-cyan-500/10">
              <p className="text-xs text-cyan-400 font-semibold mb-1">📍 Today's Focus</p>
              <p className="text-sm mt-1 text-white">
                {hasClassesToday 
                  ? `You have ${todaySchedule.filter(c => c.sub !== "LUNCH").length} sessions today. Next up: ${todaySchedule.find(c => c.sub !== "LUNCH" && c.sub !== "—")?.sub}.`
                  : "No classes today. Consider visiting the library or completing pending assignments."
                }
              </p>
            </div>
            
            {/* Dynamic Free Lab recommendation */}
            <div className="rounded bg-primary/5 p-3 border border-green-500/10">
              <p className="text-xs text-green-400 font-semibold mb-1">💻 Study Pod Available</p>
              <p className="text-sm mt-1 text-white">
                {availableLabs > 0 
                  ? `${availableLabs} labs are currently free. The AI Agent recommends the AI & ML Lab for project work.`
                  : "All labs are currently occupied. The AI Agent will notify you when one frees up."
                }
              </p>
            </div>

            {/* Dynamic Bus recommendation */}
            {nextBus && (
               <div className="rounded bg-primary/5 p-3 border border-yellow-500/10">
                <p className="text-xs text-yellow-400 font-semibold mb-1">🚌 Transit Update</p>
                <p className="text-sm mt-1 text-white">
                  Bus {nextBus["bus_number"]} is currently {nextBus["status"]} with {nextBus["capacity"] - nextBus["passengers"]} seats left.
                </p>
              </div>
            )}
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}
/* ============================================================
   ADMIN DASHBOARD
   ============================================================ */
function AdminDashboard() {
  const navigate = useNavigate();
  const { data: students } = useTable("students");
  const { data: faculty } = useTable("faculty");
  const { data: classrooms } = useTable("classrooms");
  const { data: laboratories } = useTable("laboratories");
  const { data: resources } = useTable("resources");
  const { data: requests } = useTable("requests");
  const { data: agents } = useTable("agents");
  const { data: conflicts } = useTable("conflicts");
  const { data: buses } = useTable("buses");
  const { data: timetable } = useTable("timetable_entries", { limit: 5 });
  const { data: allCourses } = useTable("courses");
  const { data: allClassrooms } = useTable("classrooms");
  const { data: departments } = useTable("departments");

  const totalStudents = (students as any[])?.length || 0;
  const cseDept = (departments as any[])?.find((d) => d["code"] === "CSE");
  const cseFaculty = (faculty as any[])?.filter((f) => f["department_id"] === cseDept?.["id"]) || [];
  const totalFaculty = cseFaculty.length;

  const totalClassrooms = classrooms?.length || 0;
  const totalLabs = laboratories?.length || 0;
  const totalResources = resources?.length || 0;
  const totalRequests = requests?.length || 0;
  const totalAgents = agents?.length || 0;
  const totalConflicts = conflicts?.length || 0;
  const totalBuses = buses?.length || 0;

  const availableClassrooms = classrooms?.filter((c: any) => c["status"] === "available").length || 0;
  const availableLabs = laboratories?.filter((l: any) => l["status"] === "available").length || 0;
  const pendingRequests = requests?.filter((r: any) => r["status"] === "pending").length || 0;
  const approvedRequests = requests?.filter((r: any) => r["status"] === "approved").length || 0;
  const activeAgents = agents?.filter((a: any) => a["status"] === "active" || a["status"] === "busy").length || 0;
  const openConflicts = conflicts?.filter((c: any) => c["status"] === "open").length || 0;
  const resolvedConflicts = conflicts?.filter((c: any) => c["status"] === "resolved").length || 0;

  const avgAgentSuccess = agents?.length ? Math.round(agents.reduce((acc: number, a: any) => acc + (a["success_rate"] || 0), 0) / agents.length) : 0;
  const topAgent: any = agents?.length ? agents.reduce((a: any, b: any) => (a["success_rate"] || 0) > (b["success_rate"] || 0) ? a : b) : null;

  const dateStr = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  return (
    <div className="mx-auto w-full max-w-7xl">
      <PageHeader
        title="CSE Command Center"
        subtitle={`MITS · Computer Science and Engineering · ${dateStr}`}
        actions={
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs text-green-400">
              <span className="size-2 rounded-full bg-green-400 animate-pulse" />
              LIVE
            </span>
            <span className="text-xs text-muted-foreground">{totalAgents} agents online</span>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-6">
        <ClickableCard onClick={() => navigate({ to: "/admin", search: { tab: "students" } as any })} label="Students" value={totalStudents} sub="CSE students" icon={Users} accent="text-cyan-400" />
        <ClickableCard onClick={() => navigate({ to: "/admin", search: { tab: "faculty" } as any })} label="Faculty" value={totalFaculty} sub="CSE teaching staff" icon={UserCog} accent="text-violet-400" />
        <ClickableCard onClick={() => navigate({ to: "/agents" })} label="AI Agents" value={totalAgents} sub={`${activeAgents} active · ${avgAgentSuccess}% success`} icon={Cpu} accent="text-yellow-400" />
        <ClickableCard onClick={() => navigate({ to: "/conflicts" })} label="Conflicts" value={totalConflicts} sub={`${openConflicts} open · ${resolvedConflicts} resolved`} icon={AlertCircle} accent="text-red-400" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ClickableCard onClick={() => navigate({ to: "/resources" })} label="Classrooms" value={totalClassrooms} sub={`${availableClassrooms} available · ${totalClassrooms - availableClassrooms} occupied`} icon={Building2} accent="text-cyan-400" />
        <ClickableCard onClick={() => navigate({ to: "/resources" })} label="Laboratories" value={totalLabs} sub={`${availableLabs} available · ${totalLabs - availableLabs} occupied`} icon={Computer} accent="text-violet-400" />
        <ClickableCard onClick={() => navigate({ to: "/resources" })} label="Resources" value={totalResources} sub={`${totalResources} total items`} icon={Activity} accent="text-green-400" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <GlassPanel level={2} className="cursor-pointer p-5 transition-all hover:border-primary/50 hover:shadow-glow" onClick={() => navigate({ to: "/requests" })}>
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <CalendarClock className="size-4 text-cyan-400" />
            Recent Requests
            <span className="ml-auto text-xs text-muted-foreground">View all →</span>
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Total</span><span className="font-semibold">{totalRequests}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Pending</span><span className="font-semibold text-yellow-400">{pendingRequests}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Approved</span><span className="font-semibold text-green-400">{approvedRequests}</span></div>
            <div className="mt-3 h-2 w-full rounded-full bg-primary/10 overflow-hidden">
              <div className="h-full rounded-full bg-green-400 transition-all" style={{ width: `${totalRequests ? (approvedRequests / totalRequests) * 100 : 0}%` }} />
            </div>
            <p className="text-xs text-muted-foreground text-center">{totalRequests ? Math.round((approvedRequests / totalRequests) * 100) : 0}% approval rate</p>
          </div>
        </GlassPanel>

        <GlassPanel level={2} className="cursor-pointer p-5 transition-all hover:border-primary/50 hover:shadow-glow" onClick={() => navigate({ to: "/transportation" })}>
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Bus className="size-4 text-yellow-400" />
            Transportation
            <span className="ml-auto text-xs text-muted-foreground">View all →</span>
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Total Buses</span><span className="font-semibold">{totalBuses}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Active</span><span className="font-semibold text-green-400">{buses?.filter((b: any) => b["status"] === "en-route" || b["status"] === "active").length || 0}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Total Capacity</span><span className="font-semibold text-cyan-400">{buses?.reduce((acc: number, b: any) => acc + (b["capacity"] || 0), 0) || 0}</span></div>
          </div>
        </GlassPanel>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <GlassPanel level={2} className="cursor-pointer p-5 lg:col-span-2 transition-all hover:border-primary/50 hover:shadow-glow" onClick={() => navigate({ to: "/agents" })}>
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Activity className="size-4 text-cyan-400" />
            Agent Network Status
            <span className="ml-auto text-xs text-muted-foreground">View all →</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {agents?.slice(0, 6).map((agent: any) => (
              <div key={agent["id"]} className="flex items-center gap-2 rounded bg-primary/5 px-3 py-2">
                <StatusDot status={agent["status"]} />
                <span className="text-xs">{agent["name"]}</span>
                <span className={`text-xs font-semibold ${agent["success_rate"] > 95 ? "text-green-400" : agent["success_rate"] > 85 ? "text-yellow-400" : "text-red-400"}`}>
                  {agent["success_rate"]}%
                </span>
              </div>
            ))}
          </div>
          {topAgent && (
            <div className="mt-3 rounded bg-primary/5 p-3">
              <p className="text-xs text-muted-foreground">Top Performer</p>
              <p className="font-semibold text-cyan-400">{topAgent["name"] ?? "—"}</p>
              <p className="text-xs text-muted-foreground">{topAgent["success_rate"] ?? 0}% success · {topAgent["tasks_processed"] ?? 0} tasks</p>
            </div>
          )}
        </GlassPanel>

        <GlassPanel level={2} className="p-5">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="size-4 text-yellow-400" />
            Quick Actions
          </h3>
          <div className="space-y-2">
            <QuickAction onClick={() => navigate({ to: "/timetable" })} emoji="📋" label="View Timetable" />
            <QuickAction onClick={() => navigate({ to: "/resources" })} emoji="💻" label="Find Available Lab" />
            <QuickAction onClick={() => navigate({ to: "/transportation" })} emoji="🚌" label="Check Bus Schedule" />
            <QuickAction onClick={() => navigate({ to: "/demo" })} emoji="🤖" label="MITS Campus Tour" />
            <QuickAction onClick={() => navigate({ to: "/admin" })} emoji="⚙️" label="Manage Campus" />
          </div>
        </GlassPanel>
      </div>

      {timetable && timetable.length > 0 && (
        <div className="mt-6">
          <GlassPanel level={2} className="cursor-pointer p-5 transition-all hover:border-primary/50 hover:shadow-glow" onClick={() => navigate({ to: "/timetable" })}>
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <CalendarClock className="size-4 text-cyan-400" />
              Recent Schedule
              <span className="ml-auto text-xs text-muted-foreground">View all →</span>
            </h3>
            <div className="space-y-2">
              {timetable.slice(0, 4).map((entry: any) => {
                const course = (allCourses as any[])?.find((c) => c["id"] === entry["course_id"]);
                const room = (allClassrooms as any[])?.find((c) => c["id"] === entry["classroom_id"]);
                return (
                  <div key={entry["id"]} className="flex items-center justify-between rounded bg-primary/5 p-3">
                    <div>
                      <p className="text-sm font-medium">
                        {course?.["code"] ?? "—"}{" "}
                        <span className="text-muted-foreground font-normal">{course?.["name"]?.split("(")[0] ?? "Course"}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{entry["day_of_week"]}</p>
                    </div>
                    <span className="text-xs text-cyan-400">{room?.["code"] ?? "Room TBD"}</span>
                  </div>
                );
              })}
            </div>
          </GlassPanel>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   Helper components
   ============================================================ */
function ClickableCard({ onClick, label, value, sub, icon: Icon, accent }: { onClick: () => void; label: string; value: number; sub: string; icon: any; accent: string; }) {
  return (
    <button onClick={onClick} className="glass-2 rounded-2xl border border-border p-4 text-left transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-glow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
        <Icon className={`size-8 opacity-60 ${accent}`} />
      </div>
      <p className="text-xs text-muted-foreground mt-2">{sub}</p>
    </button>
  );
}

function QuickAction({ onClick, emoji, label }: { onClick: () => void; emoji: string; label: string; }) {
  return (
    <button onClick={onClick} className="w-full rounded-lg glass px-4 py-2 text-left text-sm transition-all hover:border-primary/50 hover:text-primary">
      {emoji} {label}
    </button>
  );
}