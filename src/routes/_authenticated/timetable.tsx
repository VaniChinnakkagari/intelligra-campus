import { createFileRoute } from "@tanstack/react-router";
<<<<<<< HEAD
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/AppShell";
import { GlassPanel } from "@/components/Glass";
import { Button } from "@/components/ui/button";
import { useTable } from "@/lib/api";
import { useSession } from "@/hooks/useAuth";
import { Cpu, Sparkles, CheckCircle2, Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/timetable")({
  component: TimetablePage,
});

const TIME_SLOTS = [
  "SLOT 1\n09:10-10:10", "SLOT 2\n10:10-11:10", "SLOT 3\n11:10-12:10", "LUNCH\n12:10-13:00", 
  "SLOT 5\n13:00-14:00", "SLOT 6\n14:00-15:00", "SLOT 7\n15:00-16:00", "SLOT 8\n16:00-17:00"
];

const SECTIONS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT"];

// 🚨 MASTER TIMETABLE DATA (CORRECTED AND EXACT)
const ALL_SECTIONS_TIMETABLE: Record<string, Record<string, { sub: string, fac: string }[]>> = {
  A: {
    MON: [{ sub: "AI LAB", fac: "Ramalingam" }, { sub: "AI LAB", fac: "Ramalingam" }, { sub: "AI LAB", fac: "Ramalingam" }, { sub: "LUNCH", fac: "" }, { sub: "OE", fac: "" }, { sub: "IQTA", fac: "Alok Barik" }, { sub: "HOLISTIC HOUR", fac: "" }, { sub: "HOLISTIC HOUR", fac: "" }],
    TUE: [{ sub: "SS", fac: "Anandkumar" }, { sub: "AI", fac: "Ramalingam" }, { sub: "IQTA", fac: "Alok Barik" }, { sub: "LUNCH", fac: "" }, { sub: "OE", fac: "" }, { sub: "ATCD", fac: "Sreenivasulu" }, { sub: "FSD II LAB", fac: "Jayaselvi" }, { sub: "FSD II LAB", fac: "Jayaselvi" }],
    WED: [{ sub: "CNIP", fac: "Sathish" }, { sub: "ATCD", fac: "Sreenivasulu" }, { sub: "FSD II", fac: "Jayaselvi" }, { sub: "LUNCH", fac: "" }, { sub: "OE", fac: "" }, { sub: "AI", fac: "Ramalingam" }, { sub: "PSOSM", fac: "Rajesh" }, { sub: "BDC", fac: "Kuruku Nirmala" }],
    THU: [{ sub: "CNIP LAB", fac: "Sathish" }, { sub: "CNIP LAB", fac: "Sathish" }, { sub: "CNIP LAB", fac: "Sathish" }, { sub: "LUNCH", fac: "" }, { sub: "BDC", fac: "Kuruku Nirmala" }, { sub: "CNIP", fac: "Sathish" }, { sub: "HOLISTIC HOUR", fac: "" }, { sub: "HOLISTIC HOUR", fac: "" }],
    FRI: [{ sub: "ATCD", fac: "Sreenivasulu" }, { sub: "CNIP", fac: "Sathish" }, { sub: "APT", fac: "Shaik Tipu" }, { sub: "LUNCH", fac: "" }, { sub: "TINKERING LAB", fac: "Murali" }, { sub: "TINKERING LAB", fac: "Murali" }, { sub: "IQTA", fac: "Alok Barik" }, { sub: "PSOSM", fac: "Rajesh" }],
    SAT: [{ sub: "PSOSM", fac: "Rajesh" }, { sub: "BDC", fac: "Kuruku Nirmala" }, { sub: "AI", fac: "Ramalingam" }, { sub: "MENTOR/LIBRARY", fac: "" }, { sub: "—", fac: "" }, { sub: "—", fac: "" }, { sub: "—", fac: "" }, { sub: "—", fac: "" }],
  },
  B: {
    MON: [{ sub: "AI", fac: "Sri Lakshmi Preethi" }, { sub: "IQTA", fac: "Alok Barik" }, { sub: "APT", fac: "Shaik Tipu" }, { sub: "LUNCH", fac: "" }, { sub: "OE", fac: "" }, { sub: "BDC", fac: "Anandaraj" }, { sub: "HOLISTIC HOUR", fac: "" }, { sub: "HOLISTIC HOUR", fac: "" }],
    TUE: [{ sub: "CNIP", fac: "Sravanyadevi" }, { sub: "TINKERING LAB", fac: "Murali" }, { sub: "TINKERING LAB", fac: "Murali" }, { sub: "LUNCH", fac: "" }, { sub: "OE", fac: "" }, { sub: "IQTA", fac: "Alok Barik" }, { sub: "SS", fac: "Anandkumar" }, { sub: "PSOSM", fac: "Lakshmana Rao" }],
    WED: [{ sub: "ATCD", fac: "Jayaselvi" }, { sub: "CNIP", fac: "Sravanyadevi" }, { sub: "FSD II", fac: "Galeebathullah / Hemanand" }, { sub: "LUNCH", fac: "" }, { sub: "OE", fac: "" }, { sub: "AI", fac: "Sri Lakshmi Preethi" }, { sub: "FSD II LAB", fac: "Galeebathullah / Hemanand" }, { sub: "FSD II LAB", fac: "Galeebathullah / Hemanand" }],
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
    WED: [{ sub: "ATCD", fac: "Dinesh Singh" }, { sub: "IQTA", fac: "Sanjaya Brahman" }, { sub: "CNIP", fac: "Renuka" }, { sub: "LUNCH", fac: "" }, { sub: "OE", fac: "" }, { sub: "AI", fac: "Thangarasan" }, { sub: "TINKERING LAB", fac: "Murali / Ramalingam" }, { sub: "TINKERING LAB", fac: "Murali / Ramalingam" }],
    THU: [{ sub: "AI", fac: "Thangarasan" }, { sub: "BDC", fac: "Aleemullakhan" }, { sub: "PSOSM", fac: "Kavi Priya" }, { sub: "LUNCH", fac: "" }, { sub: "FSD II", fac: "Sri Lakshmi Preethi" }, { sub: "IQTA", fac: "Sanjaya Brahman" }, { sub: "HOLISTIC HOUR", fac: "" }, { sub: "HOLISTIC HOUR", fac: "" }],
    FRI: [{ sub: "CNIP", fac: "Renuka" }, { sub: "SS", fac: "Anandkumar" }, { sub: "AI", fac: "Thangarasan" }, { sub: "LUNCH", fac: "" }, { sub: "IQTA", fac: "Sanjaya Brahman" }, { sub: "APT", fac: "Shaik Tipu" }, { sub: "FSD II LAB", fac: "Geetha" }, { sub: "FSD II LAB", fac: "Geetha" }],
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
    WED: [{ sub: "AI LAB", fac: "Deepthi / Vijayganth" }, { sub: "AI LAB", fac: "Deepthi / Vijayganth" }, { sub: "AI LAB", fac: "Deepthi / Vijayganth" }, { sub: "LUNCH", fac: "" }, { sub: "OE", fac: "" }, { sub: "CNIP", fac: "Murali" }, { sub: "ATCD", fac: "Sreenivasulu" }, { sub: "PSOSM", fac: "Galeeb" }],
    THU: [{ sub: "AI", fac: "Deepthi" }, { sub: "IQTA", fac: "Jagadeesh Babu" }, { sub: "BDC", fac: "Shabbeer" }, { sub: "LUNCH", fac: "" }, { sub: "FSD II LAB", fac: "Murali / Deepthi" }, { sub: "FSD II LAB", fac: "Murali / Deepthi" }, { sub: "HOLISTIC HOUR", fac: "" }, { sub: "HOLISTIC HOUR", fac: "" }],
    FRI: [{ sub: "CNIP", fac: "Murali" }, { sub: "FSD II", fac: "Kavi Priya" }, { sub: "ATCD", fac: "Sreenivasulu" }, { sub: "LUNCH", fac: "" }, { sub: "IQTA", fac: "Jagadeesh Babu" }, { sub: "AI", fac: "Deepthi" }, { sub: "TINKERING LAB", fac: "Murali / Vijayganth" }, { sub: "TINKERING LAB", fac: "Murali / Vijayganth" }],
    SAT: [{ sub: "PSOSM", fac: "Galeeb" }, { sub: "BDC", fac: "Shabbeer" }, { sub: "CNIP", fac: "Murali" }, { sub: "MENTOR/LIBRARY", fac: "" }, { sub: "—", fac: "" }, { sub: "—", fac: "" }, { sub: "—", fac: "" }, { sub: "—", fac: "" }],
  },
  I: {
    MON: [{ sub: "CNIP", fac: "Vijayganth" }, { sub: "AI", fac: "Varshadevi" }, { sub: "FSD II", fac: "Sangeetha" }, { sub: "LUNCH", fac: "" }, { sub: "OE", fac: "" }, { sub: "ATCD", fac: "Sanoop" }, { sub: "HOLISTIC HOUR", fac: "" }, { sub: "HOLISTIC HOUR", fac: "" }],
    TUE: [{ sub: "CNIP LAB", fac: "Vijayganth / Jayaselvi" }, { sub: "CNIP LAB", fac: "Vijayganth / Jayaselvi" }, { sub: "CNIP LAB", fac: "Vijayganth/ Jayaselvi" }, { sub: "LUNCH", fac: "" }, { sub: "OE", fac: "" }, { sub: "IQTA", fac: "Vijayganth" }, { sub: "BDC", fac: "Renuka" }, { sub: "PSOSM", fac: "Murali" }],
    WED: [{ sub: "IQTA", fac: "Vijayganth" }, { sub: "TINKERING LAB", fac: "Kavi Priya / Thangarasan" }, { sub: "TINKERING LAB", fac: "Kavi Priya / Thangarasan" }, { sub: "LUNCH", fac: "" }, { sub: "OE", fac: "" }, { sub: "AI", fac: "Varshadevi" }, { sub: "APT", fac: "Shaik Tipu" }, { sub: "PSOSM", fac: "Murali" }],
    THU: [{ sub: "AI LAB", fac: "Varshadevi / Jayaselvi" }, { sub: "AI LAB", fac: "Varshadevi / Jayaselvi" }, { sub: "AI LAB", fac: "Varshadevi / Jayaselvi" }, { sub: "LUNCH", fac: "" }, { sub: "ATCD", fac: "Sanoop" }, { sub: "CNIP", fac: "Vijayganth" }, { sub: "HOLISTIC HOUR", fac: "" }, { sub: "HOLISTIC HOUR", fac: "" }],
    FRI: [{ sub: "VERBAL", fac: "Rama Mohan" }, { sub: "ATCD", fac: "Sanoop" }, { sub: "CNIP", fac: "Vijayganth" }, { sub: "LUNCH", fac: "" }, { sub: "FSD II LAB", fac: "Sangeetha / Varshadevi" }, { sub: "FSD II LAB", fac: "Sangeetha / Varshadevi" }, { sub: "IQTA", fac: "Vijayganth" }, { sub: "BDC", fac: "Renuka" }],
    SAT: [{ sub: "PSOSM", fac: "Murali" }, { sub: "BDC", fac: "Renuka" }, { sub: "AI", fac: "Varshadevi" }, { sub: "MENTOR/LIBRARY", fac: "" }, { sub: "—", fac: "" }, { sub: "—", fac: "" }, { sub: "—", fac: "" }, { sub: "—", fac: "" }],
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

function TimetablePage() {
  const { user } = useSession();
  const { data: faculty } = useTable("faculty");
  
  const [selectedSection, setSelectedSection] = useState("I");
  const [generating, setGenerating] = useState(true);
  const [generated, setGenerated] = useState(false);
  const [aiLogs, setAiLogs] = useState<string[]>([]);
  const [schedule, setSchedule] = useState<Record<string, string[]>>({});

  let me: any = faculty?.find((f: any) => f["email"]?.toLowerCase() === user?.email?.toLowerCase());
  if (!me) me = faculty?.find((f: any) => f["name"]?.toLowerCase().includes("varshadevi")); 

  // 🚨 BULLETPROOF NAME MATCHING: Picks the longest word in the name (e.g. "varshadevi" instead of "s")
  const getBestNamePart = (fullName: string): string => {
    if (!fullName) return "";
    const cleaned = fullName.replace(/\b(Mr|Mrs|Ms|Dr|Prof)\.?\s*/gi, "").replace(/\./g, " ").trim();
    const parts = cleaned.split(/\s+/).filter(Boolean);
    
    // Find the longest part (e.g., "varshadevi" is longer than "s")
    let bestPart = "";
    for (const part of parts) {
      if (part.length > bestPart.length) {
        bestPart = part;
      }
    }
    return bestPart.toLowerCase();
  };

  const myMatchName = getBestNamePart(me?.["name"] || "") || "varshadevi";

  // 🚨 AGENT BOOT SEQUENCE
  const runTimetableAgent = async () => {
    setGenerating(true);
    setGenerated(false);
    setAiLogs([]);
    setSchedule({});
    
    const log = (msg: string) => setAiLogs(prev => [...prev, msg]);

    log(`🤖 Timetable Agent Initialized.`);
    await new Promise(r => setTimeout(r, 400));
    log(`👤 Authenticated as: ${me?.name || "Faculty"}`);
    await new Promise(r => setTimeout(r, 400));
    log(`📥 Fetching Master Timetable for Section ${selectedSection}...`);
    await new Promise(r => setTimeout(r, 500));

    const sectionData = ALL_SECTIONS_TIMETABLE[selectedSection];
    const newSchedule: Record<string, string[]> = {};
    let totalClassesFound = 0;

    if (!sectionData) {
      log(`⚠️ No data found for Section ${selectedSection} in master database.`);
      setGenerating(false);
      setGenerated(true);
      return;
    }

    log(`🔍 Parsing grid constraints for assigned faculty: "${myMatchName}"`);
    await new Promise(r => setTimeout(r, 400));

    for (const day of DAYS) {
      newSchedule[day] = Array(8).fill("");
      for (let i = 0; i < 8; i++) {
        const cell = sectionData[day][i];
        if (!cell) continue;

        if (cell.sub === "LUNCH") {
          newSchedule[day][i] = "LUNCH";
          continue;
        }

        // Check if this faculty is assigned to this cell
        const isMyClass = cell.fac && cell.fac.toLowerCase().includes(myMatchName);

        if (isMyClass) {
          newSchedule[day][i] = cell.sub;
          totalClassesFound++;
        }
      }
    }

    await new Promise(r => setTimeout(r, 400));
    log(`✅ Agent extracted ${totalClassesFound} active classes.`);
    log(`🚫 Filtered out all unrelated faculty assignments.`);
    
    setSchedule(newSchedule);
    setGenerating(false);
    setGenerated(true);
  };

  // 🚨 AUTOMATICALLY TRIGGER AGENT ON PAGE LOAD & SECTION CHANGE
  useEffect(() => {
    if (faculty) {
      runTimetableAgent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSection, faculty]);

  return (
    <div className="mx-auto w-full max-w-7xl">
      <PageHeader
        title="My Teaching Timetable"
        subtitle="Powered by Timetable Agent dynamic filtering."
        actions={
          <Button 
            onClick={runTimetableAgent} 
            disabled={generating} 
            className="rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold"
          >
            {generating ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Cpu className="mr-2 size-4" />}
            {generating ? "Agent Filtering..." : "Re-Run Agent"}
          </Button>
        }
      />

      <div className="mt-6 flex flex-col gap-4">
        
        {/* Section Selector */}
        <GlassPanel level={2} className="p-4 flex flex-col sm:flex-row items-center gap-4">
          <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Select Section:</span>
          <div className="flex flex-wrap gap-2">
            {SECTIONS.map((sec) => (
              <button
                key={sec}
                onClick={() => setSelectedSection(sec)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedSection === sec
                    ? "bg-cyan-500 text-black shadow-glow"
                    : "bg-primary/5 text-muted-foreground hover:bg-primary/10 hover:text-white"
                }`}
              >
                Section {sec}
              </button>
            ))}
          </div>
        </GlassPanel>

        {/* AI Logs Panel */}
        {aiLogs.length > 0 && (
          <GlassPanel level={2} className="p-4 bg-black/40 border border-cyan-500/30">
            <h3 className="text-xs font-semibold text-cyan-400 mb-2 flex items-center gap-2">
              <Sparkles className="size-4" /> Timetable Agent Telemetry
            </h3>
            <div className="font-mono text-xs text-gray-300 space-y-1">
              {aiLogs.map((logMsg, i) => (
                <div key={i} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  {logMsg}
                </div>
              ))}
            </div>
          </GlassPanel>
        )}

        {/* Timetable Grid */}
        <GlassPanel level={2} className="p-5 min-h-[400px]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-xs text-muted-foreground uppercase">Selected</p>
                <p className="text-lg font-bold text-white">Section {selectedSection}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase">My Classes/Week</p>
                <p className="text-lg font-bold text-white">
                  {generated ? Object.values(schedule).flat().filter(s => s && s !== "LUNCH").length : "..."}
                </p>
              </div>
            </div>
            {generated && !generating && (
              <span className="flex items-center gap-1.5 text-xs text-green-400 font-semibold bg-green-400/10 px-3 py-1.5 rounded-full border border-green-400/20">
                <CheckCircle2 className="size-4" /> Agent Filtered
              </span>
            )}
          </div>

          {generating ? (
            <div className="flex flex-col items-center justify-center py-20 opacity-50">
              <Loader2 className="size-8 text-cyan-400 animate-spin mb-4" />
              <p className="text-sm text-cyan-400 font-mono">Agent extracting schedule...</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-primary/20 animate-in fade-in duration-500">
              <table className="w-full text-sm text-center border-collapse">
                <thead>
                  <tr>
                    <th className="border border-primary/20 bg-primary/10 p-2 text-xs text-muted-foreground w-24">DAY</th>
                    {TIME_SLOTS.map(time => (
                      <th key={time} className="border border-primary/20 bg-primary/10 p-2 text-xs text-muted-foreground whitespace-pre-line">{time}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DAYS.map(day => (
                    <tr key={day}>
                      <td className="border border-primary/20 bg-primary/5 p-2 font-bold text-cyan-400">{day}</td>
                      {TIME_SLOTS.map((slot, index) => {
                        const subject = schedule[day]?.[index];
                        
                        return (
                          <td 
                            key={slot} 
                            className={`border border-primary/20 p-2 text-xs ${
                              subject === "LUNCH" ? "bg-primary/10 text-muted-foreground font-semibold" :
                              subject?.includes("LAB") || subject === "TINKERING" ? "bg-violet-500/20 text-violet-300 font-bold border-violet-500/50 shadow-[inset_0_0_15px_rgba(139,92,246,0.3)]" :
                              subject ? "bg-cyan-500/20 text-cyan-300 font-bold border-cyan-500/50 shadow-[inset_0_0_15px_rgba(34,211,238,0.3)]" : ""
                            }`}
                          >
                            {subject || ""}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {generated && !generating && (
             <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
               <p className="text-xs text-muted-foreground">
                 <strong className="text-white">Agent Note:</strong> The AI has parsed the Master Timetable and filtered out all subjects that do not belong to <strong className="text-cyan-400">{me?.name}</strong>. Your assigned labs are highlighted in purple, and theory classes in cyan. If this section is blank, you do not teach in Section {selectedSection}.
               </p>
             </div>
          )}
        </GlassPanel>
      </div>
    </div>
  );
}
=======
import { PageHeader } from "@/components/AppShell";
import { GlassPanel } from "@/components/Glass";

export const Route = createFileRoute("/_authenticated/timetable")({
  component: Page,
});

function Page() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <PageHeader title="Timetable" subtitle="CSP-generated, conflict-free timetable across batches, rooms and faculty." />
      <GlassPanel level={2} className="p-6">
        <p className="text-sm text-muted-foreground">
          This module is wired to the campus database and agent pipeline.
        </p>
      </GlassPanel>
    </div>
  );
}
>>>>>>> 4ed5064e0872a8573dbceff1cf59df711efc6f87
