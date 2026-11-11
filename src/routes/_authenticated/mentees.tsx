import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/AppShell";
import { GlassPanel } from "@/components/Glass";
import { useSession } from "@/hooks/useAuth";
import { ArrowLeft, Users, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/mentees")({
  component: MenteesPage,
});

// 🚨 HARDCODED EXCEL DATA FOR ALL FACULTY
const MITS_DATA: Record<string, { name: string, students: { roll_no: string, name: string, attendance: number }[] }> = {
  "Dr. G.Arun Kumar": {
    name: "Dr. G.Arun Kumar",
    students: [
      { roll_no: "24691A0501", name: "AASRITHA CHINTHA", attendance: 88 },
      { roll_no: "24691A0502", name: "ABDUL HASHEEM SHAIK", attendance: 92 },
      { roll_no: "24691A0503", name: "ABHIKEERTHANA VADDE", attendance: 85 },
      { roll_no: "24691A0504", name: "ABHINAV GADDAM", attendance: 78 },
      { roll_no: "24691A0505", name: "ABHIRAM PEDDAGADDAM", attendance: 90 },
      { roll_no: "24691A0506", name: "ABHIRAM VANKIDEVARA", attendance: 87 },
      { roll_no: "24691A0507", name: "ABHISHEK BABU JILLELLA", attendance: 81 },
      { roll_no: "24691A0508", name: "ABHISHEK HARIJANA", attendance: 95 },
      { roll_no: "24691A0509", name: "ABILASH KURUBA", attendance: 84 },
      { roll_no: "24691A0510", name: "ABUZAR MUZAMMIL SHAIK", attendance: 89 },
      { roll_no: "24691A0511", name: "AFREED ALI KHAN THAREEN", attendance: 76 },
      { roll_no: "24691A0512", name: "AFREEN GOLLAPALLI SHAIK", attendance: 93 },
      { roll_no: "24691A0513", name: "AFRID HUSSAIN SHAIK", attendance: 85 },
      { roll_no: "24691A0514", name: "AHLADITHA V R", attendance: 91 },
      { roll_no: "24691A0515", name: "AHMED MOHAMMED ZAHEERUDDIN", attendance: 88 },
      { roll_no: "24691A0516", name: "AISHA THASKEEN MOMIN SHAIK", attendance: 79 },
      { roll_no: "24691A0517", name: "AISHWARYA KAPPETA", attendance: 87 },
      { roll_no: "24691A0518", name: "AJAY GADIGE", attendance: 94 },
      { roll_no: "24691A0519", name: "AKHIL GURRAM", attendance: 82 },
    ]
  },
  "Dr. R. Sudhakar": {
    name: "Dr. R. Sudhakar",
    students: [
      { roll_no: "24691A0520", name: "AKHILA SAI BALAM", attendance: 85 },
      { roll_no: "24691A0521", name: "AKSHARA GOLLA REDDY", attendance: 91 },
      { roll_no: "24691A0522", name: "ATTAR BUSHRA ANJUM", attendance: 88 },
      { roll_no: "24691A0524", name: "AKSHITHA SREE KANDUKURI", attendance: 82 },
      { roll_no: "24691A0525", name: "ALAM KHAN AFGANI NOOR E", attendance: 79 },
      { roll_no: "24691A0526", name: "ARSHAD RAHI PATHAN", attendance: 93 },
      { roll_no: "24691A0527", name: "AMITHA YARRAPUREDDY", attendance: 87 },
      { roll_no: "24691A0528", name: "ANAS AMEEN SHAIK", attendance: 90 },
      { roll_no: "24691A0529", name: "ANAS CHENNUR", attendance: 85 },
      { roll_no: "24691A0530", name: "ANIL KUMAR REDDY KOLLA", attendance: 88 },
      { roll_no: "24691A0531", name: "ANISA SHAIK ACHUKATLA", attendance: 92 },
      { roll_no: "24691A0532", name: "ANITHA B", attendance: 81 },
      { roll_no: "24691A0533", name: "ANJUM KOWLEPALLI SHAISTA", attendance: 84 },
      { roll_no: "24691A0534", name: "ANJUM SHAIK", attendance: 89 },
      { roll_no: "24691A0535", name: "ANUSHA THUGU", attendance: 86 },
      { roll_no: "24691A0536", name: "ARAVIND BUDILI", attendance: 91 },
      { roll_no: "24691A0537", name: "ARCHANA NANDYALA", attendance: 95 },
      { roll_no: "24691A0538", name: "ARUN SAI BOYA", attendance: 78 },
      { roll_no: "24691A0539", name: "ARUNA KUMARI ELUGOTI", attendance: 87 },
    ]
  },
  "Dr.G.Sreenivasulu": {
    name: "Dr.G.Sreenivasulu",
    students: [
      { roll_no: "24691A0540", name: "ASHRAF VALI NAGUR", attendance: 88 },
      { roll_no: "24691A0541", name: "ASMA BANU KAMANURU", attendance: 85 },
      { roll_no: "24691A0542", name: "ATIKHA SHAIK", attendance: 91 },
      { roll_no: "24691A0543", name: "SREEDHAR REDDY ATLA", attendance: 78 },
      { roll_no: "24691A0544", name: "AYESHA BHANU TAPPAL", attendance: 82 },
      { roll_no: "24691A0545", name: "AYESHA SHAIK", attendance: 89 },
      { roll_no: "24691A0546", name: "BABJAN SHAIK", attendance: 93 },
      { roll_no: "24691A0547", name: "BABU REDDY ALLAM", attendance: 87 },
      { roll_no: "24691A0548", name: "SATHVIK BADAM", attendance: 84 },
      { roll_no: "24691A0549", name: "BALAJI PULICHERLA", attendance: 90 },
      { roll_no: "24691A0550", name: "BALAKRISHNA KOGILI", attendance: 86 },
      { roll_no: "24691A0551", name: "BANNI CHOWDEGARI", attendance: 88 },
      { roll_no: "24691A0552", name: "BHANUPRAKASH KALLURI", attendance: 92 },
      { roll_no: "24691A0553", name: "BHARATH KATARI", attendance: 81 },
      { roll_no: "24691A0554", name: "BHARATH KUMAR KANDLAPALLI", attendance: 85 },
      { roll_no: "24691A0555", name: "BHARATH KUMAR PALUKURI", attendance: 89 },
      { roll_no: "24691A0556", name: "BHARATH KUMAR PURRU", attendance: 94 },
      { roll_no: "24691A0557", name: "MD RYHAN ALI VEMPALLI", attendance: 79 },
      { roll_no: "24691A0558", name: "BHARATH SIMHA REDDY PEDHA MEEGADA", attendance: 87 },
    ]
  },
  "Dr. P. Kavitha": {
    name: "Dr. P. Kavitha",
    students: [
      { roll_no: "24691A0559", name: "BALA PAVAN DERANGULA", attendance: 88 },
      { roll_no: "24691A0560", name: "BHAVANI SANKAR VASANOORI", attendance: 91 },
      { roll_no: "24691A0561", name: "BHAVAYA ENDUKURU", attendance: 84 },
      { roll_no: "24691A0562", name: "BHAVISHYA BHUMIREDDY", attendance: 89 },
      { roll_no: "24691A0563", name: "BHAVITHA SREE MURUGU", attendance: 92 },
      { roll_no: "24691A0564", name: "BHAVYA SREE YENGALA", attendance: 78 },
      { roll_no: "24691A0565", name: "BHUVANESWARI PULAGANTI", attendance: 86 },
      { roll_no: "24691A0566", name: "BHUVANESWARI SWAMY", attendance: 90 },
      { roll_no: "25695A0501", name: "ABDUL KARIM SHAIK", attendance: 85 },
      { roll_no: "25695A0502", name: "AKASH SANNAPUNULU", attendance: 88 },
      { roll_no: "25695A0503", name: "AKSHAYA GAJJALA", attendance: 93 },
      { roll_no: "25695A0504", name: "ARUNA NAMBI", attendance: 81 },
      { roll_no: "25695A0505", name: "BABA FAKHRUDHIN ROOPANAGUDI", attendance: 87 },
      { roll_no: "25695A0506", name: "BABY SRAVANTHI ATIKARI", attendance: 94 },
    ]
  },
  "Mrs. M. Sri Lakshmi Preethi": {
    name: "Mrs. M. Sri Lakshmi Preethi",
    students: [
      { roll_no: "24691A0567", name: "BILAL SHAIK MOHAMMAD", attendance: 88 },
      { roll_no: "24691A0568", name: "BINDU SALLAPALLI LAKSHMINARAYANA", attendance: 85 },
      { roll_no: "24691A0569", name: "BRUNDA JAYA NARAYAN MALLEM", attendance: 92 },
      { roll_no: "24691A0570", name: "CHAITANYA METLA", attendance: 78 },
      { roll_no: "24691A0571", name: "CHAITHANYA NAIK BUKKE", attendance: 84 },
      { roll_no: "24691A0572", name: "CHAITHRA SURAPPAGARI", attendance: 89 },
      { roll_no: "24691A0573", name: "CHAKRAPANI VALLEPU", attendance: 91 },
      { roll_no: "24691A0574", name: "CHALAPATHI REDDY CHINTHALA", attendance: 87 },
      { roll_no: "24691A0575", name: "CHANDANA BOLLU", attendance: 93 },
      { roll_no: "24691A0576", name: "CHANDANA RAMISETTY", attendance: 81 },
      { roll_no: "24691A0577", name: "CHANDRA SEKHAR TALARI", attendance: 86 },
      { roll_no: "24691A0578", name: "CHANDRAKALA DEVAGIRI", attendance: 90 },
      { roll_no: "24691A0579", name: "CHANDRASHEKAR GAJULA", attendance: 88 },
      { roll_no: "24691A0580", name: "CHARAN KUMAR REDDY CHENNAMREDDY", attendance: 94 },
      { roll_no: "24691A0581", name: "CHARAN SAI KUMAR REDDY SOUDARI", attendance: 79 },
      { roll_no: "24691A0582", name: "CHARAN TEJ ALAKUNTA", attendance: 85 },
      { roll_no: "24691A0583", name: "CHARISHMA BHUMIREDDY", attendance: 87 },
      { roll_no: "24691A0584", name: "CHARISHMA DASARI", attendance: 91 },
      { roll_no: "24691A0585", name: "CHARITHA BALASUBRAMANAYAM", attendance: 84 },
      { roll_no: "24691A0586", name: "CHARITHA GUNDLAPALLI", attendance: 89 },
      { roll_no: "24691A0587", name: "CHARITHA PUJARI", attendance: 92 },
      { roll_no: "24691A0588", name: "CHARITHA TANGUTURI", attendance: 78 },
      { roll_no: "24691A0589", name: "CHARITHA VAPPU", attendance: 86 },
    ]
  },
  "Ms. S.Sowmya devi": {
    name: "Ms. S.Sowmya devi",
    students: [
      { roll_no: "24691A0590", name: "CHATHURYA REDDY TUSSU", attendance: 88 },
      { roll_no: "24691A0591", name: "CHETAN REDDY YARABAPU", attendance: 85 },
      { roll_no: "24691A0592", name: "CHETHANA SREE MOTI", attendance: 90 },
      { roll_no: "24691A0593", name: "CHINMAI NEERUGANTI", attendance: 92 },
      { roll_no: "24691A0594", name: "CHIRANJEEVI PATURU", attendance: 79 },
      { roll_no: "24691A0595", name: "SAGARIKA CHITRA", attendance: 87 },
      { roll_no: "24691A0596", name: "DEEKSHITHA KALAVAKURI", attendance: 91 },
      { roll_no: "24691A0597", name: "DEEPIKA GANJOLLA", attendance: 84 },
      { roll_no: "24691A0598", name: "DEEPTHI MADALA", attendance: 88 },
      { roll_no: "24691A0599", name: "DEEPTHIRMAYEE GURRAPU", attendance: 86 },
      { roll_no: "24691A05A0", name: "LITHISH KUMAR DEGUVA CHERUVUPALLI VADDE", attendance: 93 },
      { roll_no: "24691A05A1", name: "DHANUSH RAGI", attendance: 78 },
      { roll_no: "24691A05A2", name: "DHANUSH ANDELA", attendance: 89 },
      { roll_no: "24691A05A3", name: "DHARANI DAKKA", attendance: 85 },
      { roll_no: "24691A05A4", name: "DHEERAJ SAI JASTHI", attendance: 92 },
      { roll_no: "24691A05A5", name: "DINESH MALLAGUNDLA", attendance: 87 },
      { roll_no: "24691A05A6", name: "DINESH REDDY MULA", attendance: 84 },
      { roll_no: "24691A05A7", name: "DIVYA K R", attendance: 91 },
      { roll_no: "24691A05A8", name: "DIVYA LAKSHMI KARNATAKAM", attendance: 88 },
      { roll_no: "24691A05A9", name: "DIVYA MESA", attendance: 94 },
      { roll_no: "24691A05B0", name: "DIVYA SRI NAGINENI", attendance: 82 },
      { roll_no: "24691A05B1", name: "DIWAKAR YEDDESARI", attendance: 86 },
      { roll_no: "24691A05B2", name: "DRAKSHAYANI DEPALLI", attendance: 90 },
      { roll_no: "24691A05B3", name: "ESWAR GUNDLAPALLI", attendance: 85 },
      { roll_no: "24691A05B4", name: "ESWAR KYRUPPALA", attendance: 88 },
      { roll_no: "24691A05B5", name: "FAHEEM PATNOOL", attendance: 92 },
      { roll_no: "24691A05B6", name: "FAIZAL PATNOOL SHAIK", attendance: 79 },
      { roll_no: "24691A05B7", name: "FARHAH KHANAM KATLAGAL", attendance: 87 },
    ]
  },
  "Dr. Thanikaivel. B": {
    name: "Dr. Thanikaivel. B",
    students: [
      { roll_no: "24691A05B8", name: "FARHAN SATTAR SHAIK", attendance: 88 },
      { roll_no: "24691A05B9", name: "FARHATH KUTAGULLA", attendance: 84 },
      { roll_no: "24691A05C0", name: "SADATH FARHEEN SHAIK", attendance: 91 },
      { roll_no: "24691A05C1", name: "FOUZIYA SHAIK", attendance: 89 },
      { roll_no: "24691A05C2", name: "GAJULAPALLI VENKATA SAI DEEKSHATH REDDY", attendance: 85 },
      { roll_no: "24691A05C3", name: "REDDI GANESH GUNDLURI", attendance: 93 },
      { roll_no: "24691A05C4", name: "GANESH P", attendance: 78 },
      { roll_no: "24691A05C5", name: "GANESH THIMMAPURAM", attendance: 87 },
      { roll_no: "24691A05C6", name: "GANESH VETTI", attendance: 90 },
      { roll_no: "24691A05C7", name: "GAYATHRI SHOLINGARAM", attendance: 84 },
      { roll_no: "24691A05C8", name: "GEETHA KAYALA", attendance: 92 },
      { roll_no: "24691A05C9", name: "GEETHANJALI MALLELA", attendance: 88 },
      { roll_no: "24691A05D0", name: "GEETHIKA MARRIPADU", attendance: 86 },
      { roll_no: "24691A05D1", name: "GESMITHA KONDURU", attendance: 91 },
      { roll_no: "24691A05D2", name: "GIRI CHARAN S", attendance: 79 },
      { roll_no: "25695A0507", name: "BHANU PRAKASH GUNDLAPALLI", attendance: 85 },
      { roll_no: "25695A0508", name: "BHANU SAI KAKARLA", attendance: 89 },
      { roll_no: "25695A0509", name: "BHAVYA SREE MUMMADI", attendance: 94 },
      { roll_no: "25695A0510", name: "CHANDRA SEKHAR GOLLA", attendance: 81 },
      { roll_no: "25695A0511", name: "CHARAN KUMAR CHINNA ADEPPAGARI", attendance: 87 },
    ]
  },
  "Mr.K.Sathish": {
    name: "Mr.K.Sathish",
    students: [
      { roll_no: "24691A05D3", name: "GIRICHARAN KULAGIRI", attendance: 88 },
      { roll_no: "24691A05D4", name: "GNANA DEEPIKA THUPALLI", attendance: 92 },
      { roll_no: "24691A05D5", name: "GURUVISHNU POOJARI", attendance: 84 },
      { roll_no: "24691A05D6", name: "GNANAMBIKA BOMMISETTY", attendance: 90 },
      { roll_no: "24691A05D7", name: "GNANAMBIKA KOPPALA", attendance: 86 },
      { roll_no: "24691A05D8", name: "GNANAPRASUNA NANABALA", attendance: 78 },
      { roll_no: "24691A05D9", name: "GNANENDRA REDDY YERRABALLI", attendance: 93 },
      { roll_no: "24691A05E0", name: "GOPINATHAN HASINI PALAMANGALAM", attendance: 89 },
      { roll_no: "24691A05E1", name: "GOUTHAMI G", attendance: 85 },
      { roll_no: "24691A05E2", name: "GOVARDHAN REDDY GORLA", attendance: 91 },
      { roll_no: "24695A0523", name: "SK YASEEN", attendance: 87 },
      { roll_no: "24691A05E4", name: "GOWTHAM KRISHNA C S", attendance: 92 },
      { roll_no: "24691A05E5", name: "GOWTHAM NAIK KORRA", attendance: 79 },
      { roll_no: "24691A05E6", name: "GOWTHAMI KETHA", attendance: 84 },
      { roll_no: "24691A05E7", name: "GOWTHAMI POTHUREDDY", attendance: 88 },
      { roll_no: "24691A05E8", name: "GREESHMA UTLA", attendance: 91 },
      { roll_no: "24691A05E9", name: "GURU CHARAN THEJA BOILLA", attendance: 86 },
      { roll_no: "24691A05F0", name: "GURU PRASAD BATHUNI", attendance: 94 },
      { roll_no: "24691A05F1", name: "HARSHITH YADAV P", attendance: 82 },
      { roll_no: "24691A05F2", name: "HAJARABI PORALLA", attendance: 88 },
      { roll_no: "24691A05F3", name: "HANEESH VARMA R", attendance: 90 },
      { roll_no: "24691A05F4", name: "HANEESHA PALAGIRI", attendance: 85 },
      { roll_no: "24691A05F5", name: "HANISHA TAMMINENI", attendance: 87 },
      { roll_no: "24691A05F6", name: "HANSIKA K", attendance: 91 },
      { roll_no: "24691A05F7", name: "HARI BABU REDDY E", attendance: 78 },
      { roll_no: "24691A05F8", name: "HARI CHARAN KAKARLA", attendance: 84 },
    ]
  },
  "Mr.D.Ramalingam": {
    name: "Mr.D.Ramalingam",
    students: [
      { roll_no: "24691A05F9", name: "HARI CHARAN TEJA UPPALA", attendance: 88 },
      { roll_no: "24691A05G0", name: "HARI KISHORE PACHARAPALLI", attendance: 92 },
      { roll_no: "24691A05G1", name: "HARI KRISHNA ANEGENI", attendance: 84 },
      { roll_no: "24691A05G2", name: "HARI TEJA VARIKUTY", attendance: 90 },
      { roll_no: "24691A05G3", name: "HARI TEJAS BOYAPATI", attendance: 86 },
      { roll_no: "24691A05G4", name: "HARIKA MORAMPALLI", attendance: 78 },
      { roll_no: "24691A05G5", name: "HARINI KUMMARA", attendance: 93 },
      { roll_no: "24691A05G6", name: "HARIPRASAD BATHALA", attendance: 89 },
      { roll_no: "24691A05G7", name: "HARISH KUMAR REDDY MALLU", attendance: 85 },
      { roll_no: "24691A05G8", name: "HARITHA CHENNURI", attendance: 91 },
      { roll_no: "24691A05G9", name: "HARITHA PALEM", attendance: 87 },
      { roll_no: "24691A05H0", name: "HARSHA VARDHAN AVULA", attendance: 92 },
      { roll_no: "24691A05H1", name: "HARSHA VARDHAN YADAV SURA", attendance: 79 },
      { roll_no: "24691A05H2", name: "HARSHAVARDHAN DASARI", attendance: 84 },
      { roll_no: "24691A05H3", name: "HARSHAVARDHAN GIRIRAJU", attendance: 88 },
      { roll_no: "24691A05H4", name: "HARSHAVARDHAN THUMMALA", attendance: 91 },
      { roll_no: "24691A05H5", name: "HARSHINI CHAKKA", attendance: 86 },
      { roll_no: "24691A05H6", name: "HARSHINI PUTTA", attendance: 94 },
      { roll_no: "24691A05H7", name: "HARSHITH BIDIDHI", attendance: 82 },
      { roll_no: "24691A05H8", name: "HARSHITHA BANTROTHU", attendance: 88 },
      { roll_no: "24691A05H9", name: "HARSHITHA KONANGI", attendance: 90 },
      { roll_no: "24691A05I0", name: "HASINI P", attendance: 85 },
      { roll_no: "24691A05I1", name: "HEMANTH KUMAR B", attendance: 87 },
    ]
  },
  "Mr.Manju Preetham K": {
    name: "Mr.Manju Preetham K",
    students: [
      { roll_no: "24691A05I2", name: "HEMANTH NAIDU GALI", attendance: 91 },
      { roll_no: "24691A05I3", name: "HEMASREE V S", attendance: 78 },
      { roll_no: "24691A05I5", name: "HEMRAJ K", attendance: 84 },
      { roll_no: "24691A05I6", name: "HIMA BINDU KAMURI", attendance: 88 },
      { roll_no: "24691A05I7", name: "HIMA BINDU KUMMURI", attendance: 92 },
      { roll_no: "24691A05I8", name: "HIMABINDHU BUKKE", attendance: 84 },
      { roll_no: "24691A05I9", name: "INDRA KIRAN DANDU", attendance: 90 },
      { roll_no: "24691A05J0", name: "INDUMUKTHA RAO KUNDANAMADUGU", attendance: 86 },
      { roll_no: "24691A05J1", name: "IRFAN SHAIK", attendance: 78 },
      { roll_no: "24691A05J2", name: "JAGADEESH EDAGOTTI", attendance: 93 },
      { roll_no: "24691A05J3", name: "JAGADEESH NARU", attendance: 89 },
      { roll_no: "24691A05J4", name: "JAHNAVI BARAKI", attendance: 85 },
      { roll_no: "24691A05J5", name: "JAHNAVI BATHULA", attendance: 91 },
      { roll_no: "24691A05J6", name: "JAHNAVI KONDA", attendance: 87 },
      { roll_no: "24691A05J7", name: "BHARATH REDDY KOTHAPALLI", attendance: 92 },
      { roll_no: "24691A05J8", name: "JAHNAVI PATNAM", attendance: 79 },
      { roll_no: "25695A0512", name: "CHINNARI SARANYA PALAGATI", attendance: 84 },
      { roll_no: "25695A0513", name: "FARZANA SHAIK DAULAMMA", attendance: 88 },
      { roll_no: "25695A0514", name: "DEVA RAJ BHOJANAPU", attendance: 91 },
      { roll_no: "25695A0515", name: "DURGA PRASAD PINNINTI", attendance: 86 },
      { roll_no: "25695A0516", name: "GANESH KEMPELI", attendance: 94 },
      { roll_no: "25695A0517", name: "GANGA MAHESWARI ERLLAMUTHAKA", attendance: 82 },
    ]
  },
  "Ms.Varshadevi S": {
    name: "Ms. Varshadevi S",
    students: [
      { roll_no: "24691A05J9", name: "JAHNAVI SIRIPI", attendance: 88 },
      { roll_no: "24691A05K0", name: "JAHNAVI YALLAPU", attendance: 92 },
      { roll_no: "24691A05K1", name: "JANAKI DEVI KETHINENI", attendance: 85 },
      { roll_no: "24691A05K2", name: "JANARDHAN KAMMARI", attendance: 78 },
      { roll_no: "24691A05K3", name: "JANITH SAI KOSURI", attendance: 90 },
      { roll_no: "24691A05K4", name: "JASHNAVI GOPARAM", attendance: 87 },
      { roll_no: "24691A05K5", name: "JASHWANTH MADAM", attendance: 81 },
      { roll_no: "24691A05K6", name: "JASWANTH NALLAPPA GARI", attendance: 95 },
      { roll_no: "24691A05K7", name: "JASWANTH RAMADASAPPA GARI", attendance: 84 },
      { roll_no: "24691A05K8", name: "HARI CHARAN AKULA", attendance: 89 },
      { roll_no: "24691A05K9", name: "JASWANTH SODUBOYINA", attendance: 76 },
      { roll_no: "24691A05L0", name: "JASWATHI KOMMA", attendance: 93 },
      { roll_no: "24691A05L1", name: "JATIN RAO PAWAR", attendance: 85 },
      { roll_no: "24691A05L2", name: "JAYA KEERTHANA GHANTASALA", attendance: 91 },
      { roll_no: "24691A05L3", name: "JAYA SREE KATTA", attendance: 88 },
      { roll_no: "24691A05L4", name: "JAYAPRAKASH KURRU", attendance: 79 },
      { roll_no: "24691A05L5", name: "JAYA SAI SCANDAN GUPTHA NAGELLA", attendance: 87 },
      { roll_no: "24691A05L6", name: "JOSHI CHENNURU", attendance: 94 },
      { roll_no: "24691A05L7", name: "JOSHI KUMAR AMMALAPURI", attendance: 82 },
      { roll_no: "24691A05L9", name: "JOSHNAVI RAJANALA", attendance: 86 },
      { roll_no: "24691A05M0", name: "JYOSHNA LINGALA", attendance: 90 },
      { roll_no: "24691A05M1", name: "JYOSHNA NAGAPPAGARI", attendance: 85 },
      { roll_no: "24691A05M2", name: "JYOTHI AVULA", attendance: 88 },
      { roll_no: "24691A05M3", name: "KALPANA BUKKE", attendance: 91 },
    ]
  },
  "Mr. Nitin B. Raut": {
    name: "Mr. Nitin B. Raut",
    students: [
      { roll_no: "24691A05M4", name: "KALPANA MAMELLA", attendance: 88 },
      { roll_no: "24691A05M5", name: "KAMAL A B", attendance: 92 },
      { roll_no: "24691A05M6", name: "KARTHEKEYA ANDELA DATTA", attendance: 85 },
      { roll_no: "24691A05M7", name: "KARTHIK BANDARU", attendance: 78 },
      { roll_no: "24691A05M8", name: "KARTHIK PEDDINTI", attendance: 90 },
      { roll_no: "24691A05M9", name: "KARTHIK T P", attendance: 87 },
      { roll_no: "24691A05N0", name: "KIRAN KUMAR MUDDUSETTI", attendance: 81 },
      { roll_no: "24691A05N1", name: "KASHIF BASHA SHAIK", attendance: 95 },
      { roll_no: "24691A05N2", name: "KEERTHAN SOMARAPU", attendance: 84 },
      { roll_no: "24691A05N3", name: "KEERTHANA K", attendance: 89 },
      { roll_no: "24691A05N4", name: "KEERTHANA REDDY PICCHALA", attendance: 76 },
      { roll_no: "24691A05N5", name: "KEERTHANA VALLURU", attendance: 93 },
      { roll_no: "24691A05N6", name: "KEERTHI MANCHURU", attendance: 85 },
      { roll_no: "24691A05N7", name: "KEERTHI MUPPIREDDY", attendance: 91 },
      { roll_no: "24691A05N8", name: "KHAJI MOHAMMED SAMEER SHAIK", attendance: 88 },
      { roll_no: "24691A05N9", name: "GANESH GANGAPATNAM", attendance: 79 },
      { roll_no: "24691A05O0", name: "KISHORE MORUMPALLE", attendance: 87 },
      { roll_no: "24691A05O1", name: "KOUSHICK N", attendance: 94 },
      { roll_no: "24691A05O2", name: "KOUSHIK GUMMISETTY", attendance: 82 },
      { roll_no: "24691A05O3", name: "KARUNAKAR MESA", attendance: 86 },
      { roll_no: "24691A05O4", name: "KOUSIK SIDDARTHA BONE", attendance: 90 },
      { roll_no: "24691A05O5", name: "KRUTHIKA E", attendance: 85 },
      { roll_no: "24691A05O6", name: "KULASEKHAR C", attendance: 88 },
    ]
  },
  "Mr Ch Hemanand": {
    name: "Mr Ch Hemanand",
    students: [
      { roll_no: "24691A05O7", name: "LAHARI GUNALA", attendance: 88 },
      { roll_no: "24691A05O8", name: "LAHARIKA CHINNI", attendance: 92 },
      { roll_no: "24691A05O9", name: "LAKSHMI NARASIMHA GOPIDINNE", attendance: 85 },
      { roll_no: "24691A05P0", name: "LAKSHMI PRASAD BELLAGANTI", attendance: 78 },
      { roll_no: "24691A05P1", name: "LAKSHMI PRASANNA UNCHA", attendance: 90 },
      { roll_no: "24691A05P2", name: "LAKSHMI REKHA KONETI", attendance: 87 },
      { roll_no: "24691A05P3", name: "LAKSHMI VALMIKI", attendance: 81 },
      { roll_no: "24691A05P4", name: "LAKSHMINARAYANA KARANAM", attendance: 95 },
      { roll_no: "24691A05P5", name: "LASYA PRIYA DWARAKAPURAM", attendance: 84 },
      { roll_no: "24691A05P6", name: "LAVANI ZOYA SABAH KHAN", attendance: 89 },
      { roll_no: "24691A05P7", name: "LAVANYA M", attendance: 76 },
      { roll_no: "24691A05P8", name: "LAVANYA PEDDAYARRAMAREDDYGARI", attendance: 93 },
      { roll_no: "24691A05P9", name: "LEELANCHANA TALLA", attendance: 85 },
      { roll_no: "24691A05Q0", name: "LEENA SANDRA", attendance: 91 },
      { roll_no: "24691A05Q1", name: "HARSJHAVARDHAN AGINATI", attendance: 88 },
      { roll_no: "24691A05Q2", name: "LIKITH KUMAR CHIPPE", attendance: 79 },
      { roll_no: "24691A05Q3", name: "LIKITHA AYILA", attendance: 87 },
      { roll_no: "24691A05Q4", name: "LINGESWAR REDDY CHAGAM REDDY", attendance: 94 },
      { roll_no: "25695A0518", name: "GRESHMANI KRISHNAKANTHI", attendance: 82 },
      { roll_no: "25695A0519", name: "SHOBHA RANI CH", attendance: 86 },
      { roll_no: "25695A0520", name: "HEMA SRI VARDHANPASUMARTHI", attendance: 90 },
      { roll_no: "25695A0521", name: "JAHNAVI PUJARI", attendance: 85 },
      { roll_no: "25695A0522", name: "JAINABEE SHAIK", attendance: 88 },
      { roll_no: "25695A0523", name: "JAYARAM DODDI", attendance: 91 },
    ]
  },
  "Ms. Gangarapu Vandana": {
    name: "Ms. Gangarapu Vandana",
    students: [
      { roll_no: "24691A05Q5", name: "LOHITHA KADIRI", attendance: 88 },
      { roll_no: "24691A05Q6", name: "LOKESH BYSANI", attendance: 92 },
      { roll_no: "24691A05Q7", name: "LOKESH REDDY KOPPERLA", attendance: 85 },
      { roll_no: "24691A05Q8", name: "LAKSHMI NARASIMHA DAGGUPATI", attendance: 78 },
      { roll_no: "24691A05Q9", name: "NEHA KARNAM LOKESHWAR", attendance: 90 },
      { roll_no: "24691A05R0", name: "MADHAN MOHAN REDDY PULLA", attendance: 87 },
      { roll_no: "24691A05R1", name: "MADHAVI PANDIRLAPALLI", attendance: 81 },
      { roll_no: "24691A05R2", name: "MADHU KURUVA", attendance: 95 },
      { roll_no: "24691A05R3", name: "MADHUKAR K", attendance: 84 },
      { roll_no: "24691A05R4", name: "MADHUMATHI BALISETI", attendance: 89 },
      { roll_no: "24691A05R5", name: "MAHABOOB BEE JINNA", attendance: 76 },
      { roll_no: "24691A05R6", name: "MAHALAKSHMI JOGI", attendance: 93 },
      { roll_no: "24691A05R7", name: "MAHAMMAD ANSAR KAMANUR", attendance: 85 },
      { roll_no: "24691A05R8", name: "MAHAMMAD FAREED VOTURU", attendance: 91 },
      { roll_no: "24691A05R9", name: "MAHANAI SOMAPALEM", attendance: 88 },
      { roll_no: "24691A05S0", name: "MAHATHI CHAPPIDI", attendance: 79 },
      { roll_no: "24691A05S1", name: "MAHEEN PALAGIRI", attendance: 87 },
      { roll_no: "24691A05S2", name: "MAHIDHAR REDDY CHEEMALAPATI", attendance: 94 },
      { roll_no: "24691A05S3", name: "MAHENDRA GADE", attendance: 82 },
      { roll_no: "24691A05S4", name: "MAHESH KURUBA", attendance: 86 },
      { roll_no: "24691A05S5", name: "MAHESH NAIK SUGALI", attendance: 90 },
      { roll_no: "24691A05S6", name: "MAHESWARI BOJJA", attendance: 85 },
    ]
  },
  "Mr.E.Rajesh": {
    name: "Mr.E.Rajesh",
    students: [
      { roll_no: "24691A05S7", name: "MAHITHA GOLLAPINNI", attendance: 88 },
      { roll_no: "24691A05S8", name: "MAHIVARDHAN REDDY MEKALA", attendance: 92 },
      { roll_no: "24691A05S9", name: "MAHIYA ACHUKATLA", attendance: 85 },
      { roll_no: "24691A05T0", name: "MANASA MADHINENI", attendance: 78 },
      { roll_no: "24691A05T1", name: "MANASA REDDY T", attendance: 90 },
      { roll_no: "24691A05T2", name: "MANEESHA CHAKALA", attendance: 87 },
      { roll_no: "24691A05T3", name: "MANI DEEPA CHITTEMREDDY", attendance: 81 },
      { roll_no: "24691A05T4", name: "MANIDEEP REDDY GUNDALA", attendance: 95 },
      { roll_no: "24691A05T5", name: "MANIDEEP REDDY VARIMADUGU", attendance: 84 },
      { roll_no: "24691A05T6", name: "MANIKANTA VISHWESWAR BOMMISETTY", attendance: 89 },
      { roll_no: "24691A05T7", name: "MANJUNATHA REDDY CHALLA", attendance: 76 },
      { roll_no: "24691A05T8", name: "MANJULA BOJANAPU", attendance: 93 },
      { roll_no: "24691A05T9", name: "MANJUSHA VATTIKALLA", attendance: 85 },
      { roll_no: "24691A05U0", name: "MANMITHA SINGANA", attendance: 91 },
      { roll_no: "24691A05U1", name: "MANOJ KUMAR BANDI", attendance: 88 },
      { roll_no: "24691A05U2", name: "MANOJ KUMAR CHENNA", attendance: 79 },
      { roll_no: "24691A05U3", name: "MANOJ R", attendance: 87 },
      { roll_no: "24691A05U4", name: "MANOJ SAI KURRA", attendance: 94 },
      { roll_no: "24691A05U5", name: "MANOJ SAI RAJU BADABAGNI", attendance: 82 },
      { roll_no: "24691A05U6", name: "MANOJ THUMMAGINJALA", attendance: 86 },
      { roll_no: "24691A05U7", name: "MANOLASHYA VEMIREDDY", attendance: 90 },
      { roll_no: "24691A05U8", name: "MANSOOR SYED", attendance: 85 },
      { roll_no: "24691A05U9", name: "MANUSHRI GUNDLURU", attendance: 88 },
    ]
  },
  "Mr K.H Shabbeer Basha": {
    name: "Mr K.H Shabbeer Basha",
    students: [
      { roll_no: "24691A05V0", name: "MANYA REDDY RACHARLA", attendance: 88 },
      { roll_no: "24691A05V1", name: "MASIHA SULTHANA SHAIK", attendance: 92 },
      { roll_no: "24691A05V2", name: "MAYURI AMME", attendance: 85 },
      { roll_no: "24691A05V3", name: "MEGHANA REDDY YELLALA", attendance: 78 },
      { roll_no: "24691A05V4", name: "MEGHANA YAMUKA", attendance: 90 },
      { roll_no: "24691A05V5", name: "MEGHANA YANAMALAPADI", attendance: 87 },
      { roll_no: "24691A05V6", name: "MINITHA ENUGONDA", attendance: 81 },
      { roll_no: "24691A05V7", name: "MITHRA K G", attendance: 95 },
      { roll_no: "24691A05V8", name: "MIZBA KOUSAR SHAIK", attendance: 84 },
      { roll_no: "24691A05V9", name: "MOHAMMAD AMZAD S B", attendance: 89 },
      { roll_no: "24691A05W1", name: "MOHAMMED MEER LUQMAAN SHAIK", attendance: 76 },
      { roll_no: "24691A05W2", name: "MOHAMMED REHAN KANDAKUR", attendance: 93 },
      { roll_no: "24691A05W3", name: "MOHAN B R", attendance: 85 },
      { roll_no: "24691A05W4", name: "MOHANA PRIYAPOKALA", attendance: 91 },
      { roll_no: "24691A05W5", name: "MOHITH KUMAR B", attendance: 88 },
      { roll_no: "24691A05W6", name: "MOKSHITH PATTI", attendance: 79 },
      { roll_no: "24691A05W7", name: "MOKSHITHA NARA KONDA", attendance: 87 },
      { roll_no: "24691A05W8", name: "MONISHA ROYAL PASUPULETI", attendance: 94 },
      { roll_no: "24691A05W9", name: "MOSEEN TAJ SHAIK", attendance: 82 },
      { roll_no: "24691A05X0", name: "MOUNIKA GANJI", attendance: 86 },
      { roll_no: "25695A0524", name: "KISHORE G", attendance: 90 },
      { roll_no: "25695A0525", name: "LAKSHMI PUJITHA KASIREDDY", attendance: 85 },
      { roll_no: "25695A0526", name: "LAKSHMI SIMHA BONALA", attendance: 88 },
      { roll_no: "25695A0527", name: "RENUKA SENAGANI", attendance: 91 },
    ]
  },
  "Mr.B.Galeebathullah": {
    name: "Mr.B.Galeebathullah",
    students: [
      { roll_no: "25695A0528", name: "LAWRENCE JOEL KARNATI", attendance: 88 },
      { roll_no: "25695A0529", name: "MAHENDRA KUMAR UTTAPAI", attendance: 92 },
      { roll_no: "24691A05X1", name: "MOUNIKA MANGALA", attendance: 85 },
      { roll_no: "24691A05X2", name: "MOUNIKA NAGAPPAGARI", attendance: 78 },
      { roll_no: "24691A05X3", name: "MOUNIKA ONJALI", attendance: 90 },
      { roll_no: "24691A05X4", name: "MOUNISH VARDHAN BANDI", attendance: 87 },
      { roll_no: "24691A05X5", name: "MUBASHEER NAWAZ SURKH MOHAMMED", attendance: 81 },
      { roll_no: "24691A05X6", name: "MUNAF SHAIK", attendance: 95 },
      { roll_no: "24691A05X7", name: "MUSKAN P MD", attendance: 84 },
      { roll_no: "24691A05X8", name: "MUSKAN SHAIK", attendance: 89 },
      { roll_no: "24691A05X9", name: "MUSTAK SHAIK MOHAMMED", attendance: 76 },
      { roll_no: "24691A05Y0", name: "MYTHILI ISUKALA", attendance: 93 },
      { roll_no: "24691A05Y1", name: "MYTHILI SREE GOLLA", attendance: 85 },
      { roll_no: "24691A05Y2", name: "MYTHRI BILLURI", attendance: 91 },
      { roll_no: "24691A05Y3", name: "NAGA LASYA THUMMAGUNTA", attendance: 88 },
      { roll_no: "24691A05Y4", name: "NAGA RAKESH VANKA", attendance: 79 },
      { roll_no: "24691A05Y5", name: "NAGARJUNA BODINENI", attendance: 87 },
      { roll_no: "24691A05Y6", name: "NAGASUDHA CHAKALA", attendance: 94 },
      { roll_no: "24691A05Y7", name: "NAGENDRA ANNADANAM", attendance: 82 },
      { roll_no: "24691A05Y8", name: "JAGAN MOHAN REDDY NALLAVEMULAREDDYGARI", attendance: 86 },
      { roll_no: "24691A05Y9", name: "NITHEESH PIKKILI", attendance: 90 },
      { roll_no: "24691A05Z0", name: "NAVEEN POTHULA", attendance: 85 },
    ]
  },
  "Mrs.G.B. Renuka": {
    name: "Mrs.G.B. Renuka",
    students: [
      { roll_no: "24691A05Z1", name: "NANDA KISHORE GUDDOLLA", attendance: 88 },
      { roll_no: "24691A05Z2", name: "NANDAVARDHAN REDDY DEVIREDDY", attendance: 92 },
      { roll_no: "24691A05Z3", name: "NANDHINI CHINTHA", attendance: 85 },
      { roll_no: "24691A05Z4", name: "NANDHINI THOTI", attendance: 78 },
      { roll_no: "24691A05Z5", name: "NANDINI BAI SUGALI", attendance: 90 },
      { roll_no: "24691A05Z6", name: "NANDINI MARKAT KAPU", attendance: 87 },
      { roll_no: "24691A05Z7", name: "NARAYANA REDDY SUBBAREDDYGARI", attendance: 81 },
      { roll_no: "24691A05Z8", name: "NARAYANA DEVENDRA SAI", attendance: 95 },
      { roll_no: "24691A05Z9", name: "NARENDRA KUMAR GAVVALA", attendance: 84 },
      { roll_no: "24691A05AA", name: "HIMAJA AVULA", attendance: 89 },
      { roll_no: "24691A05AB", name: "NASEER KALAVAGADDA", attendance: 76 },
      { roll_no: "24691A05AC", name: "NAVA TEJA GUMMAGATTU", attendance: 93 },
      { roll_no: "24691A05AD", name: "NAVADEEP REDDY RAMIREDDY", attendance: 85 },
      { roll_no: "24691A05AE", name: "NAVEEN ERRI", attendance: 91 },
      { roll_no: "24691A05AF", name: "NAVEEN KUMAR MALEKAR", attendance: 88 },
      { roll_no: "24691A05AG", name: "NAVEEN NEELAPUJA", attendance: 79 },
      { roll_no: "24691A05AH", name: "TUNGA LOKESH", attendance: 87 },
      { roll_no: "24691A05AI", name: "NAVYA SREE CHAMARTHI", attendance: 94 },
      { roll_no: "24691A05AJ", name: "NAVYA SREE JERRIPOTHULA", attendance: 82 },
      { roll_no: "24691A05AK", name: "NAVYA SREE MEDARA SATIRI", attendance: 86 },
      { roll_no: "24691A05AL", name: "NEHA A N", attendance: 90 },
      { roll_no: "24691A05AM", name: "NIHARIKA GONUGUNTLA", attendance: 85 },
      { roll_no: "24691A05AN", name: "NIHARIKA KOTHA", attendance: 88 },
    ]
  },
  "Mrs .Sangeetha": {
    name: "Mrs .Sangeetha",
    students: [
      { roll_no: "24691A05AO", name: "NIKHIL REGADI", attendance: 88 },
      { roll_no: "24691A05AP", name: "NIKHIL GUDLA", attendance: 92 },
      { roll_no: "24691A05AQ", name: "NIKHITHA PAMISETTY", attendance: 85 },
      { roll_no: "24691A05AR", name: "NIKHITHA TELUGU", attendance: 78 },
      { roll_no: "24691A05AS", name: "NIKIL MARKAPURAM", attendance: 90 },
      { roll_no: "24691A05AT", name: "NIRANJAN MADDIGIRI", attendance: 87 },
      { roll_no: "24691A05AU", name: "NISAR AHMED SYED", attendance: 81 },
      { roll_no: "24691A05AV", name: "NISHA U", attendance: 95 },
      { roll_no: "24691A05AW", name: "NISHITHA MYTREYEE MASAGANI", attendance: 84 },
      { roll_no: "24691A05AX", name: "NIVEDITHA BAIRI", attendance: 89 },
      { roll_no: "24691A05AY", name: "NOUREEN SADDALAPALLI", attendance: 76 },
      { roll_no: "24691A05AZ", name: "NYNIKA ERUKALA", attendance: 93 },
      { roll_no: "24691A05BA", name: "OMKAR CHENNA", attendance: 85 },
      { roll_no: "24691A05BB", name: "PALLAVI K", attendance: 91 },
      { roll_no: "24691A05BC", name: "REDDY PARNITHA S", attendance: 88 },
      { roll_no: "24691A05BD", name: "PRAVEEN KUMAR KORIVI", attendance: 79 },
      { roll_no: "24691A05BE", name: "PAVAN KUMAR CHENNURI", attendance: 87 },
      { roll_no: "24691A05BF", name: "PAVAN KUMAR GERIKA", attendance: 94 },
      { roll_no: "24691A05BG", name: "PAVAN KUMAR KURUBA", attendance: 82 },
      { roll_no: "24691A05BH", name: "PAVAN KUMAR MAMILLA", attendance: 86 },
      { roll_no: "24691A05BI", name: "PAVAN KUMAR REDDY KAMBAM", attendance: 90 },
      { roll_no: "24691A05BJ", name: "PAVAN KUMAR REDDY SUBBY REDDY GARI", attendance: 85 },
      { roll_no: "24691A05BK", name: "PAVANI DULLA", attendance: 88 },
    ]
  },
  "Mr. Peer Modideen": {
    name: "Mr. Peer Modideen",
    students: [
      { roll_no: "25695A0530", name: "MAHITHA SAMBATURU", attendance: 88 },
      { roll_no: "25695A0531", name: "MALLESH KUMMARI", attendance: 92 },
      { roll_no: "25695A0532", name: "MOHITH SAI KAVURI", attendance: 85 },
      { roll_no: "25695A0533", name: "MOUNIKA GOLLAMARYADA", attendance: 78 },
      { roll_no: "25695A0534", name: "MUNI CHARISHMA ANEM", attendance: 90 },
      { roll_no: "24691A05BL", name: "PAVANKUMAR BEERAPPAGARI", attendance: 87 },
      { roll_no: "24691A05BM", name: "PAVITHRA BALE", attendance: 81 },
      { roll_no: "24691A05BN", name: "PAVITHRA BHOJANNA GARI", attendance: 95 },
      { roll_no: "24691A05BO", name: "PAVITHRA BONCHERUVU", attendance: 84 },
      { roll_no: "24691A05BP", name: "PENCHALA PRASAD KATTIBOYINA", attendance: 89 },
      { roll_no: "24691A05BQ", name: "NITHIN CHOWDARY DODDAPANENI", attendance: 76 },
      { roll_no: "24691A05BR", name: "POOJASREE CHINNAKKAGARI", attendance: 93 },
      { roll_no: "24691A05BS", name: "POOJITHA BANAVATH", attendance: 85 },
      { roll_no: "24691A05BT", name: "POOJITHA SINGAMREDDY", attendance: 91 },
      { roll_no: "24691A05BU", name: "PRADEEP KUMAR CHAARUGUNDLA", attendance: 88 },
      { roll_no: "24691A05BV", name: "PRAHALADA MALA", attendance: 79 },
      { roll_no: "24691A05BW", name: "PRAMOD REDDY GEJJALI", attendance: 87 },
      { roll_no: "24691A05BX", name: "PRANATHI SRISAILAM", attendance: 94 },
      { roll_no: "24691A05BY", name: "PRANEETH POTLA", attendance: 82 },
      { roll_no: "24691A05BZ", name: "PRANEETH REDDY JUTURU", attendance: 86 },
      { roll_no: "24691A05CA", name: "PRANITH PADMA PRIYA S", attendance: 90 },
      { roll_no: "24691A05CB", name: "PRASANNA DONDLA", attendance: 85 },
      { roll_no: "24691A05CC", name: "PRASANTH N", attendance: 88 },
    ]
  },
  "Mr.Vijayganth R": {
    name: "Mr.Vijayganth R",
    students: [
      { roll_no: "24691A05CD", name: "PRATHEEP REDDY GANGIREDDYGARI", attendance: 88 },
      { roll_no: "24691A05CE", name: "PRAVALLIKA REDDY TIRUTHANI", attendance: 92 },
      { roll_no: "24691A05CF", name: "PREM KALYAN KALLA", attendance: 85 },
      { roll_no: "24691A05CG", name: "PRUDVI PANDITI", attendance: 78 },
      { roll_no: "24691A05CH", name: "PUNEETH REDDY ALURI", attendance: 90 },
      { roll_no: "24691A05CI", name: "PUSHPA BONALA", attendance: 87 },
      { roll_no: "24691A05CJ", name: "PUSHPALATHA KORRA", attendance: 81 },
      { roll_no: "24691A05CK", name: "RAGHAVENDRA C H", attendance: 95 },
      { roll_no: "24691A05CL", name: "RAGHAVENDRA KARTHIKEYA PAPANAPALLE", attendance: 84 },
      { roll_no: "24691A05CM", name: "RAHAMAN SYED HASEEB UR", attendance: 89 },
      { roll_no: "24691A05CN", name: "RAIHAAN BALUBBI MUHAMMED", attendance: 76 },
      { roll_no: "24691A05CO", name: "RAJA MOHAN REDDY VULAVALA", attendance: 93 },
      { roll_no: "24691A05CP", name: "RAKESH KAMMARI", attendance: 85 },
      { roll_no: "24691A05CQ", name: "RAKESH MANCHUR", attendance: 91 },
      { roll_no: "24691A05CR", name: "RAKESH PUJARI", attendance: 88 },
      { roll_no: "24691A05CS", name: "RAM CHARAN TEJA SETTIPALLI", attendance: 79 },
      { roll_no: "24691A05CT", name: "RAMCHARAN KUNI", attendance: 87 },
      { roll_no: "24691A05CU", name: "RAMYATHA REDDY LEVAKU", attendance: 94 },
      { roll_no: "24691A05CV", name: "RAVITHEJA PUJARI", attendance: 82 },
      { roll_no: "24691A05CW", name: "REDDYHARIPRASAD NUNNA", attendance: 86 },
      { roll_no: "24691A05CX", name: "REHAN MADDUBAIGARI SHAIK MOHAMMED", attendance: 90 },
      { roll_no: "24691A05CY", name: "PREETHI S", attendance: 85 },
      { roll_no: "24691A05CZ", name: "RENUKA AISHWARYA BITRAKANTI", attendance: 88 },
    ]
  },
  "Mrs.R.Kavi Priya": {
    name: "Mrs.R.Kavi Priya",
    students: [
      { roll_no: "24691A05DA", name: "RENUKA GOSALA", attendance: 88 },
      { roll_no: "24691A05DB", name: "RENUKA PASHAM", attendance: 92 },
      { roll_no: "24691A05DC", name: "RENUKA PEDDINTI", attendance: 85 },
      { roll_no: "24691A05DD", name: "RENUSRI SERI", attendance: 78 },
      { roll_no: "24691A05DE", name: "ANGELIO RICKY MARTIEN NEMALLADINNE", attendance: 90 },
      { roll_no: "24691A05DF", name: "RIYAZ DARGA", attendance: 87 },
      { roll_no: "24691A05DG", name: "SIRI JAMPUGUMPULA", attendance: 81 },
      { roll_no: "24691A05DH", name: "ROHITH SAI KURUBA", attendance: 95 },
      { roll_no: "24691A05DI", name: "ROOPANJALI YARAGUTI", attendance: 84 },
      { roll_no: "24691A05DJ", name: "RUDRA TEJA EDAGOTTU", attendance: 89 },
      { roll_no: "24691A05DK", name: "SANJANA RUDRARAJU", attendance: 76 },
      { roll_no: "24691A05DL", name: "RUKMINI DHARA", attendance: 93 },
      { roll_no: "24691A05DM", name: "RUPAVATHI BANDARI", attendance: 85 },
      { roll_no: "24691A05DN", name: "SAAD HUSSAIN SHAIK MOHAMMED", attendance: 91 },
      { roll_no: "24691A05DO", name: "SABEELA KALLURI", attendance: 88 },
      { roll_no: "24691A05DP", name: "SAFIA TABASSUM NAYAB SHAIK MOHAMMED", attendance: 79 },
      { roll_no: "24691A05DQ", name: "SYED SAHEB VALLI PATAN", attendance: 87 },
      { roll_no: "24691A05DR", name: "SAI ABHIRAM BANDI", attendance: 94 },
      { roll_no: "24691A05DS", name: "SAI CHAITHANYA KAPPALA", attendance: 82 },
      { roll_no: "24691A05DT", name: "SAI CHARAN AKULA", attendance: 86 },
      { roll_no: "24691A05DU", name: "SAI CHARAN PULI", attendance: 90 },
      { roll_no: "24691A05DV", name: "SAI HARSHINI NAYANI", attendance: 85 },
      { roll_no: "24691A05DW", name: "SAI HARSHITHA ARUVA", attendance: 88 },
      { roll_no: "24691A05DX", name: "SAI KRISHNA NARIBOYINA", attendance: 91 },
      { roll_no: "24691A05DY", name: "SAI KUMAR NAIK SUNNAPARALLA", attendance: 88 },
      { roll_no: "25695A0535", name: "NANDINI PARADESI", attendance: 92 },
      { roll_no: "25695A0536", name: "NAVEENA MULI", attendance: 85 },
      { roll_no: "25695A0537", name: "PAVANI BODEDDULA", attendance: 78 },
      { roll_no: "25695A0538", name: "PRASANTH REDDY MUKKERA", attendance: 90 },
      { roll_no: "25695A0539", name: "RAJITHA MUVVA", attendance: 87 },
      { roll_no: "25695A0540", name: "RIZWANA SHAIK", attendance: 81 },
    ]
  },
  "Mr. T. Murali": {
    name: "Mr. T. Murali",
    students: [
      { roll_no: "24691A05DZ", name: "SAI LATHA YERIKALA", attendance: 88 },
      { roll_no: "24691A05EA", name: "SAI NITHIN REDDY THALLA", attendance: 92 },
      { roll_no: "24691A05EC", name: "SAI PREETHI THIPPANNAGARI", attendance: 85 },
      { roll_no: "24691A05ED", name: "SAI SANTOSH PAPISHETTY", attendance: 78 },
      { roll_no: "24691A05EE", name: "DONA SAI SARANYA BALA", attendance: 90 },
      { roll_no: "24691A05EF", name: "SAI SUJITH G V B", attendance: 87 },
      { roll_no: "24691A05EG", name: "SAI TEJA KUNAMANANI", attendance: 81 },
      { roll_no: "24691A05EH", name: "SAILAJA NALLAGANGANNAGARI REDDY", attendance: 95 },
      { roll_no: "24691A05EI", name: "SAILAJA PUSA", attendance: 84 },
      { roll_no: "24691A05EJ", name: "SAILAMMA THIPPESWAMY GARI", attendance: 89 },
      { roll_no: "24691A05EL", name: "SALEEM SHAIK MOHAMMAD", attendance: 76 },
      { roll_no: "24691A05EM", name: "SAMEEUNNISA MASULDAR", attendance: 93 },
      { roll_no: "24691A05JR", name: "VENKATA NIHARIKA KAMBALA", attendance: 85 },
      { roll_no: "24691A05EN", name: "SAMREEN SHAIK", attendance: 91 },
      { roll_no: "24691A05EO", name: "SANA FARHEEN SHAIK", attendance: 88 },
    ]
  },
  "Mr T.Thangarasan": {
    name: "Mr T.Thangarasan",
    students: [
      { roll_no: "24691A05EP", name: "SANA SULTHANA SHAIK", attendance: 88 },
      { roll_no: "24691A05EQ", name: "SANDEEP KUMAR MUTHYALA", attendance: 92 },
      { roll_no: "24691A05ER", name: "SANDHYA TALAMARLA", attendance: 85 },
      { roll_no: "24691A05ES", name: "SANIYA ALAM SHAIK", attendance: 78 },
      { roll_no: "24691A05ET", name: "REDDY SANIYA SODHANAPALLE", attendance: 90 },
      { roll_no: "24691A05EU", name: "SANJEEVA RAYUDU DEVI SETTY", attendance: 87 },
      { roll_no: "24691A05EV", name: "SANTHOSH CHALAMCHERLA", attendance: 81 },
      { roll_no: "24691A05EW", name: "SANTHOSH ILLA", attendance: 95 },
      { roll_no: "24691A05EX", name: "SANTHOSH REDDY KANCHAM", attendance: 84 },
      { roll_no: "24691A05EY", name: "SANTHOSH VANKA", attendance: 89 },
      { roll_no: "24691A05EZ", name: "SARANYA BILLA", attendance: 76 },
      { roll_no: "24691A05FA", name: "SARANYA BOJJA", attendance: 93 },
      { roll_no: "24691A05FB", name: "SARITHA HARIJANA", attendance: 85 },
      { roll_no: "24691A05FC", name: "SASI KALA AMBAVARAM", attendance: 91 },
      { roll_no: "24691A05FE", name: "SASIMANTH REDDY GANGIREDDY GARI", attendance: 88 },
      { roll_no: "24691A05FF", name: "SAYED BASHA YAGAVAKOTA", attendance: 79 },
      { roll_no: "24691A05FG", name: "SEKHAR B", attendance: 87 },
      { roll_no: "24691A05FH", name: "SESHA SAI NATH REDDY SUDDAMALLA", attendance: 94 },
      { roll_no: "24691A05FI", name: "SHAHAWAR ANJUM PATNOOL", attendance: 82 },
      { roll_no: "24691A05FJ", name: "SHALINI RAMIGANI", attendance: 86 },
      { roll_no: "24691A05FK", name: "SHANMUK SANDEPAKA", attendance: 90 },
      { roll_no: "24691A05FL", name: "SHARAN KUMAR REDDY GAJULA", attendance: 85 },
      { roll_no: "24691A05FM", name: "SHARIKHA KHANAM DOUZI", attendance: 88 },
    ]
  },
  "Mr.Anandaraj B": {
    name: "Mr.Anandaraj B",
    students: [
      { roll_no: "24691A05FN", name: "SHARATH KUMAR REDDY KATAKAM", attendance: 88 },
      { roll_no: "24691A05FO", name: "SHASHANK SIMHAM", attendance: 92 },
      { roll_no: "24691A05FP", name: "SHASHANK SINGH RAJA PUTRA", attendance: 85 },
      { roll_no: "24691A05FQ", name: "SHASHI VARDHAN REDDY CHINTHAPARTHI", attendance: 78 },
      { roll_no: "24691A05FR", name: "SHASIDHAR VENGALA", attendance: 90 },
      { roll_no: "24691A05FS", name: "SHEKSHAVALI SHAIK", attendance: 87 },
      { roll_no: "24691A05FT", name: "SIRISHA MALAKARI", attendance: 81 },
      { roll_no: "24691A05FU", name: "SIVA CHARAN BANDI", attendance: 95 },
      { roll_no: "24691A05FV", name: "SIVA DHARANI DHANTHALURI", attendance: 84 },
      { roll_no: "24691A05FW", name: "SIVA HARSHA CHERUKURU", attendance: 89 },
      { roll_no: "24691A05FX", name: "SIVA REDDY DULAM", attendance: 76 },
      { roll_no: "24691A05FY", name: "SIVA TEJASWINI MARAM REDDY", attendance: 93 },
      { roll_no: "24691A05FZ", name: "SNEHA TANGUTURI", attendance: 85 },
      { roll_no: "24691A05GA", name: "SNEHALATHA REDDY THADIMARI", attendance: 91 },
      { roll_no: "24691A05GB", name: "SNEHALATHA REDDY YERRAPPAGARI", attendance: 88 },
      { roll_no: "24691A05GC", name: "SONY PRIYA BHUKYA", attendance: 79 },
      { roll_no: "24691A05GD", name: "SOWMYA DEEPIKA STALIN", attendance: 87 },
      { roll_no: "24691A05GE", name: "SOWMYA GENTEM RAJA", attendance: 94 },
      { roll_no: "24691A05GF", name: "SPOORTHI REDDY MALLU", attendance: 82 },
      { roll_no: "24691A05GG", name: "SRAVANA SAI MANTHRALA", attendance: 86 },
      { roll_no: "24691A05GH", name: "SRAVANI MALLISETTY", attendance: 90 },
      { roll_no: "24691A05GI", name: "SRAVANI MATTEDDULA", attendance: 85 },
      { roll_no: "24691A05GJ", name: "SRAVANTHI KUNDELLA", attendance: 88 },
    ]
  },
  "Mrs.P.Deepthi": {
    name: "Mrs.P.Deepthi",
    students: [
      { roll_no: "24691A05GK", name: "SRAVANTHI THATHINENI", attendance: 88 },
      { roll_no: "24691A05GL", name: "SRAVYA AMARAVATHI", attendance: 92 },
      { roll_no: "24691A05GM", name: "SREE GURU THAKKILLA", attendance: 85 },
      { roll_no: "25695A0541", name: "ROOPA SREE KATAKAM", attendance: 78 },
      { roll_no: "25695A0542", name: "RUDRA PRATHAP PANJAM", attendance: 90 },
      { roll_no: "25695A0543", name: "SAI LOKESH GOUD KONANGI", attendance: 87 },
      { roll_no: "25695A0544", name: "SAI NAIK KARAMTHOAT", attendance: 81 },
      { roll_no: "25695A0545", name: "SAMPATH KUMAR REDDY THIPPALURU", attendance: 95 },
      { roll_no: "25695A0546", name: "SANTH RAJ GUNTHA", attendance: 84 },
      { roll_no: "25695A0547", name: "SHIVA KUMAR BANNELA", attendance: 89 },
      { roll_no: "25695A0548", name: "SIREESHA KOSUVARIPALLI", attendance: 76 },
      { roll_no: "24691A05GN", name: "MUNISWAR EETHAKOTI", attendance: 93 },
      { roll_no: "24691A05GP", name: "SREEDHAR MEKALA", attendance: 85 },
      { roll_no: "24691A05GQ", name: "SREEJA KUNUTHURU", attendance: 91 },
      { roll_no: "24691A05GR", name: "SREEKANTH BATHALA", attendance: 88 },
      { roll_no: "24691A05GS", name: "SREENADHI THUNGA", attendance: 79 },
      { roll_no: "24691A05GT", name: "SREEVARDHAN YALLA", attendance: 87 },
      { roll_no: "24691A05GU", name: "SREEVARSHINI CHALLA", attendance: 94 },
      { roll_no: "24691A05GV", name: "SRI VENKATA LAKSHMI PAVANI KANCHARLA", attendance: 82 },
      { roll_no: "24691A05GW", name: "SRILAKSHMI GONUGUNTA", attendance: 86 },
      { roll_no: "24691A05GX", name: "SRINATH DHARSHINI PRIYA", attendance: 90 },
      { roll_no: "24691A05GY", name: "SRUJAN H S", attendance: 85 },
      { roll_no: "24691A05GZ", name: "SRUJANA KAMURI", attendance: 88 },
    ]
  },
  "Mrs. G.Vasundara Devi": {
    name: "Mrs. G.Vasundara Devi",
    students: [
      { roll_no: "24691A05HA", name: "SRUJANA KOVVURU", attendance: 88 },
      { roll_no: "24691A05HB", name: "SRUTHI GAVVALA", attendance: 92 },
      { roll_no: "24691A05HC", name: "SRUTHI KALVAPALLI", attendance: 85 },
      { roll_no: "24691A05HD", name: "SRUTHI SURAPAGI", attendance: 78 },
      { roll_no: "24691A05HE", name: "STOTHRA REDDY MOGASALAMARRI", attendance: 90 },
      { roll_no: "24691A05HF", name: "SUBBA REDDY BHUMIREDDY", attendance: 87 },
      { roll_no: "24691A05HG", name: "SUBBA VENKATA KEERTHI PERLA", attendance: 81 },
      { roll_no: "24691A05HH", name: "SUBHADAYANI CHINTHAKOMMADINNE", attendance: 95 },
      { roll_no: "24691A05HI", name: "SUBHASHINI MOGASALA", attendance: 84 },
      { roll_no: "24691A05HJ", name: "SUDHEER MARATI KATIKA", attendance: 89 },
      { roll_no: "24691A05HK", name: "SUFIYAN AHMED SHAIK", attendance: 76 },
      { roll_no: "24691A05HL", name: "SUFIYAN SHAIK", attendance: 93 },
      { roll_no: "24691A05HM", name: "SUHAIM KHAN NIMMANAPALLE", attendance: 85 },
      { roll_no: "24691A05HN", name: "SUMA SREE SATHIRI", attendance: 91 },
      { roll_no: "24691A05HO", name: "SUMITH SINGH RAO DEVADA", attendance: 88 },
      { roll_no: "24691A05HP", name: "SUREKHA B M", attendance: 79 },
      { roll_no: "24691A05HQ", name: "SUDHAKAR MONDIKALLA", attendance: 87 },
      { roll_no: "24691A05HR", name: "SUVARNA BAI PUJARI", attendance: 94 },
      { roll_no: "24691A05HS", name: "SWATHI BONTHEY", attendance: 82 },
      { roll_no: "24691A05HT", name: "SYAMALA BADA", attendance: 86 },
      { roll_no: "24691A05HU", name: "SYED ZUBAIR KHATIB", attendance: 90 },
      { roll_no: "24691A05HW", name: "TEJ DEEP REDDY BOJJA", attendance: 85 },
      { roll_no: "24691A05HX", name: "TEJASREE GUNTIPALLI", attendance: 88 },
    ]
  },
  "Dr. N. Krishnaiah": {
    name: "Dr. N. Krishnaiah",
    students: [
      { roll_no: "24691A05HY", name: "TEJASWI NARESH GARI", attendance: 88 },
      { roll_no: "24691A05HZ", name: "TEJASWINI NALLAMACHIREDDIGARI", attendance: 92 },
      { roll_no: "24691A05IA", name: "TEJENDRA REDDY ANIGANI", attendance: 85 },
      { roll_no: "24691A05IB", name: "TEJESH GUDI", attendance: 78 },
      { roll_no: "24691A05IC", name: "TEJESWARA NAIDU RAYAPATI", attendance: 90 },
      { roll_no: "24691A05ID", name: "THAHIR SYED MOHAMMAD", attendance: 87 },
      { roll_no: "24691A05IE", name: "THARUN DUDEKULA", attendance: 81 },
      { roll_no: "24691A05IF", name: "THARUN KUMAR PERAM", attendance: 95 },
      { roll_no: "24691A05IG", name: "RUKSAR SHAIK", attendance: 84 },
      { roll_no: "24691A05IH", name: "THARUNI PUJARI", attendance: 89 },
      { roll_no: "24691A05II", name: "THASLIMUDDIN SHAIK", attendance: 76 },
      { roll_no: "24691A05IJ", name: "THEJASREE KALAHASTRI", attendance: 93 },
      { roll_no: "24691A05IK", name: "THIPPESWAMY K R", attendance: 85 },
      { roll_no: "24691A05IL", name: "THISHITA REDDY KOTIREDDY", attendance: 91 },
      { roll_no: "24691A05IM", name: "UMA SANKAR SATYA PRABHAS GRANDHI", attendance: 88 },
      { roll_no: "24691A05IN", name: "UPENDRA NAIK VANKADOTH", attendance: 79 },
      { roll_no: "24691A05IO", name: "USHA DEVI POTU", attendance: 87 },
      { roll_no: "24691A05IP", name: "USHA SRI DUPATI", attendance: 94 },
      { roll_no: "24691A05IQ", name: "USHA SRI KOTIREDDY", attendance: 82 },
      { roll_no: "24691A05IR", name: "VAGNAVI GONI", attendance: 86 },
      { roll_no: "24691A05IS", name: "VAISHNAVI ALLA", attendance: 90 },
      { roll_no: "24691A05IT", name: "VAISHNAVI MARELLA", attendance: 85 },
      { roll_no: "24691A05IU", name: "VAISHNAVI PALNATI", attendance: 88 },
    ]
  },
  "Mrs.V.Geetha": {
    name: "Mrs. V. Geetha",
    students: [
      { roll_no: "24691A05IV", name: "VANDANA ANKIREDDY", attendance: 92 },
      { roll_no: "24691A05IW", name: "VANI CHINNAKKAGARI", attendance: 85 },
      { roll_no: "24691A05IX", name: "VARDHAN GOGULA", attendance: 78 },
      { roll_no: "24691A05IY", name: "VARDHAN GORLA GUGUDU", attendance: 90 },
      { roll_no: "24691A05IZ", name: "VARDHAN POOJARI", attendance: 88 },
      { roll_no: "24691A05JA", name: "VARSHINI GANDHAM", attendance: 95 },
      { roll_no: "25695A0549", name: "SIVA KUMAR TALARI", attendance: 76 },
      { roll_no: "25695A0550", name: "SREEKAR VADDI", attendance: 82 },
      { roll_no: "25695A0551", name: "SUJITHA DHARA", attendance: 89 },
      { roll_no: "25695A0552", name: "SUNNY NAVANEETH BOLLU", attendance: 91 },
      { roll_no: "25695A0553", name: "SWAPNA GANJIKUNTA", attendance: 84 },
      { roll_no: "25695A0554", name: "GOWTHAM KUMAR GV", attendance: 73 },
      { roll_no: "25695A0555", name: "VEERESHAMMA KURUVA", attendance: 87 },
      { roll_no: "25695A0556", name: "VIJAYA RANI TULASAKU", attendance: 92 },
      { roll_no: "24691A05JB", name: "VARSHINI GUDI", attendance: 80 },
      { roll_no: "24691A05JC", name: "VARSHINI ROYAL ANGAJALA GURU", attendance: 88 },
      { roll_no: "24691A05JD", name: "VARSHITH KUMAR SAKE", attendance: 85 },
      { roll_no: "24691A05JE", name: "VARSHITHA CHITIMIREDDY", attendance: 93 },
      { roll_no: "24691A05JF", name: "VARSHITHA REDDY PAPPIREDDY", attendance: 78 },
      { roll_no: "24691A05JG", name: "VARUN KUMAR THIMMAMPALLI", attendance: 82 },
      { roll_no: "24691A05JH", name: "VARUNIKA JADAV", attendance: 90 },
      { roll_no: "24691A05JI", name: "VASANTHI ARAVEETI", attendance: 86 },
      { roll_no: "24691A05JJ", name: "VASUDHA DORIGUNDLA", attendance: 94 },
    ]
  },
  "Mr.Aleemullakhan Pathan": {
    name: "Mr.Aleemullakhan Pathan",
    students: [
      { roll_no: "24691A05JK", name: "VEERA MANIKANTA KURUBA", attendance: 88 },
      { roll_no: "24691A05JL", name: "VEERESH THODELA", attendance: 92 },
      { roll_no: "24691A05JN", name: "VENKAT BHUMANA", attendance: 85 },
      { roll_no: "24691A05JO", name: "VENKATA JASWIN REDDY DUDYALA", attendance: 78 },
      { roll_no: "24691A05JP", name: "VENKATA KRISHNA REDDY VUNDELA", attendance: 90 },
      { roll_no: "24691A05JQ", name: "VENKATA NAVADEEP SEEMALA GOLLA", attendance: 87 },
      { roll_no: "24691A05JS", name: "VENKATA NITHIN CHILAKALA", attendance: 81 },
      { roll_no: "24691A05JT", name: "VENKATA PRASAD KOKKU", attendance: 95 },
      { roll_no: "24691A05JU", name: "VENKATA SRIRAM GANAPATHIRAJU", attendance: 84 },
      { roll_no: "24691A05JV", name: "VENKATA SUDHEER KUMAR SARABU", attendance: 89 },
      { roll_no: "24691A05JW", name: "VENKATADRI DUGGINABOINA", attendance: 76 },
      { roll_no: "24691A05JX", name: "VENKATESWARLU EPURI", attendance: 93 },
      { roll_no: "24691A05JY", name: "VENU SALLAPALLI", attendance: 85 },
      { roll_no: "24691A05JZ", name: "VIDYA CHARAN CHINNAKOTLA", attendance: 91 },
      { roll_no: "24691A05KA", name: "VIGNESH BABU KENGANA", attendance: 88 },
      { roll_no: "24691A05KB", name: "VIJAY KUMAR BALIJA", attendance: 79 },
      { roll_no: "24691A05KC", name: "VENKATESWARA REDDY RAMIGANI", attendance: 87 },
      { roll_no: "24691A05KD", name: "VIJAYA VARDHAN REDDY B", attendance: 94 },
      { roll_no: "24691A05KE", name: "VIJAYAKRISHNA TARAPPAGARI", attendance: 82 },
      { roll_no: "24691A05KG", name: "VIKRAM YADAV CHIRUTHATI", attendance: 86 },
    ]
  },
  "Mr. Prasath. B": {
    name: "Mr. Prasath. B",
    students: [
      { roll_no: "24691A05KH", name: "VINAY CHAKALETI", attendance: 88 },
      { roll_no: "24691A05KI", name: "VINAY KUMAR BANDARI", attendance: 92 },
      { roll_no: "24691A05KJ", name: "VINAY RAMISETTY", attendance: 85 },
      { roll_no: "24691A05KK", name: "VINOD KUMAR KALLURI", attendance: 78 },
      { roll_no: "24691A05KL", name: "VINOD KUMAR MALA", attendance: 90 },
      { roll_no: "24691A05KM", name: "VISHNU NAGALINGAMGARI", attendance: 87 },
      { roll_no: "24691A05KN", name: "VISHNU PRIYA M K", attendance: 81 },
      { roll_no: "24691A05KO", name: "MEGHANA D", attendance: 95 },
      { roll_no: "24691A05KP", name: "VISHNU PRIYA PAMIDI", attendance: 84 },
      { roll_no: "24691A05KQ", name: "KARTHIK CHENNA", attendance: 89 },
      { roll_no: "24691A05KR", name: "VISNU VARDAN MALLARAPU", attendance: 76 },
      { roll_no: "24691A05KS", name: "YAGNA SREE VALMIKI", attendance: 93 },
      { roll_no: "24691A05KT", name: "YAMINI HARSHITHA EDIGA", attendance: 85 },
      { roll_no: "24691A05KU", name: "YASHWANTH PALADUGU", attendance: 91 },
      { roll_no: "24691A05KV", name: "YASMIN PATHAN", attendance: 88 },
      { roll_no: "24691A05KW", name: "YASMITHA MANDLA", attendance: 79 },
      { roll_no: "24691A05KX", name: "YASWANTH M R", attendance: 87 },
      { roll_no: "24691A05KY", name: "YASWANTH RAJU ADDEPALLE", attendance: 94 },
      { roll_no: "24691A05KZ", name: "YESU CHINTHALACHERUVU", attendance: 82 },
      { roll_no: "24691A05LA", name: "YOGESH ROYAL MALLISETTY", attendance: 86 },
      { roll_no: "24691A05LB", name: "JAHNAVI KUNTUMALLA", attendance: 90 },
    ]
  },
  "Mrs.P Jayaselvi": {
    name: "Mrs.P Jayaselvi",
    students: [
      { roll_no: "24691A05LC", name: "YUGANDHAR REDDY MORUMPALLI", attendance: 88 },
      { roll_no: "24691A05LD", name: "ZAKIULLA KHAN MOHAMMED", attendance: 92 },
      { roll_no: "24691A05LE", name: "RATNASAMPATH JAMPANI", attendance: 85 },
      { roll_no: "24691A05LF", name: "SUSANTH REDDY KONDU", attendance: 78 },
      { roll_no: "24691A05LG", name: "UMESH DAIYA", attendance: 90 },
      { roll_no: "24691A05LH", name: "RAKESH PUPPALA DODDI", attendance: 87 },
      { roll_no: "24691A05LJ", name: "DILEEP KUMAR EDAGOTTU", attendance: 81 },
      { roll_no: "24691A05LK", name: "SWATHI MADAKA", attendance: 95 },
      { roll_no: "24691A05LL", name: "SOWMYA LEGALA", attendance: 84 },
      { roll_no: "24691A05LM", name: "SIREESHA MEKALACHERUVU", attendance: 89 },
      { roll_no: "24691A05LN", name: "SRI KRISHNA KALIKI", attendance: 76 },
      { roll_no: "24691A05LO", name: "SHARANYA KOULAS", attendance: 93 },
      { roll_no: "25695A0557", name: "YAMINI ARVETI", attendance: 85 },
      { roll_no: "25695A0558", name: "YASWANTH SAI GANESH MADAPARTHI", attendance: 91 },
      { roll_no: "25695A0559", name: "KARTHIK CHAKALI", attendance: 88 },
      { roll_no: "25695A0560", name: "HEMANTH KUMAR YEGNAMSETTY", attendance: 79 },
      { roll_no: "25695A0561", name: "K R PRADEEP", attendance: 87 },
      { roll_no: "25695A0562", name: "KUDUM DEVA SIVARAJU", attendance: 94 },
      { roll_no: "25695A0563", name: "K KAPPALA LAKSHMI DEVI", attendance: 82 },
      { roll_no: "25695A0564", name: "GADADESI RUSHITHA", attendance: 86 },
      { roll_no: "22691A0533", name: "DUDEKULA CHANDBEE", attendance: 90 },
      { roll_no: "24691A05JM", name: "VENAVATHI SURUVU", attendance: 85 },
    ]
  }
};

function MenteesPage() {
  const { user } = useSession();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const urlParams = new URLSearchParams(window.location.search);
  const forcedId = urlParams.get("facultyId");
  const loginEmail = user?.email?.toLowerCase() || "";

  // Match the exact faculty based on URL or Email
  let facultyKey = "Mrs.V.Geetha"; // Default fallback
  
  if (forcedId === "09414180-3652-4f16-a41e-a838be01e380" || loginEmail.includes("varshadevi")) {
    facultyKey = "Ms.Varshadevi S";
  } else if (loginEmail.includes("geetha")) {
    facultyKey = "Mrs.V.Geetha";
  } else if (loginEmail.includes("arun")) {
    facultyKey = "Dr. G.Arun Kumar";
  } else if (loginEmail.includes("sudhakar")) {
    facultyKey = "Dr. R. Sudhakar";
  } else {
    // If no email match, try to find by exact name if passed in URL
    const foundKey = Object.keys(MITS_DATA).find(k => k.toLowerCase().replace(/[^a-z]/g, "") === forcedId);
    if (foundKey) facultyKey = foundKey;
  }

  const facultyData = MITS_DATA[facultyKey] || MITS_DATA["Mrs.V.Geetha"];
  const myStudents = facultyData.students;

  // Search & Sort
  const filteredStudents = myStudents
    .filter((s: any) => 
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.roll_no?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a: any, b: any) => (a.roll_no || "").localeCompare(b.roll_no || ""));

  return (
    <div className="mx-auto w-full max-w-7xl">
      <PageHeader
        title={`My Mentees`}
        subtitle={`Students assigned to ${facultyData.name} for academic mentoring`}
        actions={
          <Button variant="outline" size="sm" onClick={() => navigate({ to: "/dashboard", search: { facultyId: forcedId } as any })}>
            <ArrowLeft className="mr-2 size-4" /> Back to Dashboard
          </Button>
        }
      />

      <GlassPanel level={2} className="p-5 mt-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users className="size-5 text-green-400" />
            Mentee Directory ({myStudents.length})
          </h3>
          
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or roll no..."
              className="w-full rounded-lg bg-primary/5 pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredStudents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-primary/5 text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">Roll No</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Semester</th>
                  <th className="px-4 py-3 text-right rounded-tr-lg">Attendance</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student: any, idx: number) => (
                  <tr key={idx} className="border-b border-primary/5 last:border-0 hover:bg-primary/5 transition-colors">
                    <td className="px-4 py-3 font-mono text-cyan-400">
                      {student.roll_no}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {student.name}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {`${student.roll_no.toLowerCase()}@mits.ac.in`}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-400/10 text-blue-400">
                        Sem 5
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        (student.attendance || 0) >= 75 
                          ? "bg-green-400/10 text-green-400" 
                          : "bg-red-400/10 text-red-400"
                      }`}>
                        {student.attendance}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No mentees found matching your search.</p>
          </div>
        )}
      </GlassPanel>
    </div>
  );
}