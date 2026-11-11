-- ============================================================
-- MITS CAMPUS AI — Real data seed
-- Madanapalle Institute of Technology & Science
-- Batch: CSE-2024 | Semester 3-1
-- ============================================================

-- ============ CLEAN OLD FICTIONAL DATA ============
DELETE FROM public.knowledge_relationships;
DELETE FROM public.knowledge_entities;
DELETE FROM public.agent_messages;
DELETE FROM public.ai_decisions;
DELETE FROM public.conflicts;
DELETE FROM public.notifications;
DELETE FROM public.requests;
DELETE FROM public.timetable_entries;
DELETE FROM public.route_stops;
DELETE FROM public.buses;
DELETE FROM public.routes;
DELETE FROM public.drivers;
DELETE FROM public.resources;
DELETE FROM public.laboratories;
DELETE FROM public.classrooms;
DELETE FROM public.time_slots;
DELETE FROM public.courses;
DELETE FROM public.students;
DELETE FROM public.batches;
DELETE FROM public.faculty;
DELETE FROM public.departments;
DELETE FROM public.rules;

-- ============ MITS DEPARTMENTS ============
INSERT INTO public.departments (code, name, hod, building) VALUES
 ('CSE',   'Computer Science and Engineering',              'Dr. R. Kalpana',              'West Block'),
 ('CST',   'Computer Science and Technology',               'Dr. K. Dinesh',               'NPN Block'),
 ('AIML',  'Artificial Intelligence and Machine Learning',  'Dr. Chandra Prakash Gupta',   'NPN Block'),
 ('CSD',   'Computer Science and Data Science',             'Dr. S. Kusuma',               'West Block'),
 ('CSC',   'Computer Science and Cyber Security',           'Dr. M. Jaganathan',           'West Block'),
 ('ECE',   'Electronics and Communication Engineering',     'Dr. P. Anandmohan',           'East Block'),
 ('EEE',   'Electrical and Electronics Engineering',        'Dr. K. Anand Kumar',          'East Block'),
 ('MECH',  'Mechanical Engineering',                        'Dr. V. Vamshidhar',           'West Block'),
 ('CIVIL', 'Civil Engineering',                             'Dr. Dipankar Roy',            'East Block'),
 ('MBA',   'Master of Business Administration',             'Dr. D. Bhaskar',              'NPN Block'),
 ('MCA',   'Master of Computer Applications',               'Dr. R. Anuradha',             'NPN Block'),
 ('H&S',   'Humanities and Sciences',                       'Dr. R. Saravana',             'South Block');

-- ============ MITS BATCHES ============
INSERT INTO public.batches (department_id, name, year, strength)
SELECT d.id, x.name, x.year, x.strength
FROM public.departments d
JOIN (VALUES
 ('CSE-2024',   1, 60),
 ('CST-2024',   1, 60),
 ('AIML-2024',  1, 60),
 ('CSD-2024',   1, 60),
 ('CSC-2024',   1, 60),
 ('ECE-2024',   1, 60),
 ('EEE-2024',   1, 60),
 ('MECH-2024',  1, 60),
 ('CIVIL-2024', 1, 60)
) AS x(name, year, strength) ON x.name LIKE d.code || '%';

-- ============ MITS FACULTY (Real names from MITS website) ============
INSERT INTO public.faculty (department_id, employee_code, name, email, designation, specialization, max_hours, workload)
SELECT d.id, f.code, f.name, f.email, f.desig, f.spec, 18, 6 + (row_number() over () % 8)
FROM public.departments d
JOIN (VALUES
 ('MITS-CSE-001','Dr. R. Kalpana','drkalpanar@mits.ac.in','Professor & Head','Computer Networks','CSE'),
 ('MITS-CSE-002','Dr. S. Satheesh Kumar','drsatheeshkumars@mits.ac.in','Assoc. Professor','MANET','CSE'),
 ('MITS-CSE-003','Dr. K. Chokkanathan','chokkanathank@mits.ac.in','Assoc. Professor','Big Data','CSE'),
 ('MITS-CSE-004','Dr. A. Poongodai','drpoongodala@mits.ac.in','Asst. Professor','Wireless Networks','CSE'),
 ('MITS-CSE-005','Dr. G. Arun Kumar','drgarunk@mits.ac.in','Asst. Professor','Deep Learning','CSE'),
 ('MITS-CSE-006','Dr. R. Suthakar','drsuthakarr@mits.ac.in','Asst. Professor','Cloud Computing','CSE'),
 ('MITS-AI-001','Dr. Chandra Prakash Gupta','drcpgupta@mits.ac.in','Professor & Dean','AI and Data Science','AIML'),
 ('MITS-AI-002','Dr. Sachi Kanta Dash','drsachikanta@mits.ac.in','Assoc. Professor','Machine Learning','AIML'),
 ('MITS-AI-003','Dr. M. Jaganathan','drjaganathanm@mits.ac.in','Assoc. Professor','Deep Learning','AIML'),
 ('MITS-AI-004','Dr. Brahm Prakash','drbrahmprakash@mits.ac.in','Assoc. Professor','Cyber Security','AIML'),
 ('MITS-CST-001','Dr. K. Dinesh','drdineshk@mits.ac.in','Assoc. Professor & Head','Image Processing','CST'),
 ('MITS-CST-002','Dr. R. Manikandan','drmanikandanr@mits.ac.in','Assoc. Professor','Big Data Analytics','CST'),
 ('MITS-CST-003','Dr. V. Maruthi Prasad','maruthiprasadv@mits.ac.in','Asst. Professor','Cloud Computing','CST'),
 ('MITS-CST-004','Dr. V. Naveen','naveenv@mits.ac.in','Asst. Professor','IoT','CST'),
 ('MITS-DS-001','Dr. B. Persis Urbana Ivy','drpersisurbanaivyb@mits.ac.in','Professor','Data Science','CSD'),
 ('MITS-DS-002','Dr. K. Nirmala Devi','drnirmaladevikathamuthu@mits.ac.in','Assoc. Professor','Data Mining','CSD'),
 ('MITS-DS-003','Dr. S. Kusuma','dshod@mits.ac.in','Asst. Professor & Head','Data Analytics','CSD'),
 ('MITS-DS-004','Dr. M. Kiran Kumar','kirankumarm@mits.ac.in','Asst. Professor','ML','CSD'),
 ('MITS-ECE-001','Dr. P. Anandmohan','drsatheeshkumars@mits.ac.in','Professor & Head','VLSI Design','ECE'),
 ('MITS-ECE-002','Dr. B. Rajesh Kumar','brajeshkumarb@mits.ac.in','Professor','Communication','ECE'),
 ('MITS-ECE-003','Dr. K. Nalini','drsnalini@mits.ac.in','Asst. Professor','Embedded Systems','ECE'),
 ('MITS-EEE-001','Dr. K. Anand Kumar','drsatheeshkumars@mits.ac.in','Professor & Head','Power Systems','EEE'),
 ('MITS-EEE-002','Dr. D. V. Naveen Kumar','drsatheeshkumars@mits.ac.in','Asst. Professor','Power Electronics','EEE'),
 ('MITS-ME-001','Dr. V. Vamshidhar','drsatheeshkumars@mits.ac.in','Professor & Head','Thermal Engineering','MECH'),
 ('MITS-ME-002','Dr. A. Ravi','drsatheeshkumars@mits.ac.in','Asst. Professor','Machine Design','MECH'),
 ('MITS-CE-001','Dr. Dipankar Roy','drsatheeshkumars@mits.ac.in','Professor & Head','Water Resources','CIVIL'),
 ('MITS-CE-002','Dr. Sudheer Kumar Yemmiganur','drsatheeshkumars@mits.ac.in','Assoc. Professor','Geotechnical','CIVIL'),
 ('MITS-HS-001','Dr. R. Saravana','drsaravanar@mits.ac.in','Assoc. Professor & Head','Mathematics','H&S'),
 ('MITS-HS-002','Dr. M. Sudhakar Reddy','drsudhakarreddym@mits.ac.in','Assoc. Professor','Mathematics','H&S'),
 ('MITS-HS-003','Dr. Vivekanand Mishra','drsatheeshkumars@mits.ac.in','Professor','Physics','H&S'),
 ('MITS-HS-004','Dr. P. Amaladass','amaladass@mits.ac.in','Professor','Chemistry','H&S'),
 ('MITS-HS-005','Dr. Sudhakar Beedam','drsudhakarb@mits.ac.in','Assoc. Professor & Head','English','H&S')
) AS f(code, name, email, desig, spec, dept) ON f.dept = d.code;

-- ============ MITS CSE-2024 STUDENTS (Your class) ============
INSERT INTO public.students (batch_id, department_id, roll_no, name, email, semester, attendance)
SELECT b.id, b.department_id, s.roll, s.name, lower(s.roll) || '@mits.ac.in', 3, 75 + (s.i * 7) % 24
FROM public.batches b
JOIN (VALUES
 (1,  '24691A05IW', 'Chinnakkagari Vani'),
 (2,  '24691A05GZ', 'Srujana Kamuri'),
 (3,  '24691A05IT', 'Marella Vaishnavi'),
 (4,  '24691A05JA', 'Varshini Gandham'),
 (5,  '24691A05IS', 'Alla Vaishnavi'),
 (6,  '24691A05IV', 'Ankireddy Vandana'),
 (7,  '24691A05IX', 'Vardhan Gogula'),
 (8,  '24691A05IZ', 'Vardhan Poojari'),
 (9,  '24691A05IY', 'Vardhan Gorla Gugudu'),
 (10, '24691A05IO', 'Potu Usha Devi'),
 (11, '24691A05IP', 'Dupati Usha sree'),
 (12, '24691A05IQ', 'Kotireddy ushasree'),
 (13, '24691A05IR', 'Goni Vagnavi'),
 (14, '24691A05IL', 'Kotireddy Thishitha Reddy'),
 (15, '24691A05HY', 'Naresh Gari Tejaswi'),
 (16, '24691A05IE', 'Tharun Dudekula'),
 (17, '24691A05HI', 'Moghasala Subhashini'),
 (18, '24691A05GU', 'Challa Sreevarshini'),
 (19, '24691A05HG', 'Perla Subba Venkata Keerthi'),
 (20, '24691A05HB', 'Gavvala Sruthi')
) AS s(i, roll, name) ON true
WHERE b.name = 'CSE-2024';

-- ============ MITS COURSES ============
INSERT INTO public.courses (department_id, faculty_id, code, name, credits, category, semester, requires_lab)
SELECT d.id, f.id, c.code, c.name, c.credits, c.cat, c.sem, c.lab
FROM (VALUES
 ('CS301','Data Structures and Algorithms',4,'core',3,true,'CSE'),
 ('CS302','Operating Systems',4,'core',3,true,'CSE'),
 ('CS303','Database Management Systems',4,'core',3,true,'CSE'),
 ('CS304','Computer Networks',3,'core',3,true,'CSE'),
 ('CS305','Object Oriented Programming',3,'core',3,true,'CSE'),
 ('AI301','Artificial Intelligence',3,'core',3,true,'AIML'),
 ('AI302','Machine Learning',4,'core',3,true,'AIML'),
 ('CST301','Full Stack Development',3,'core',3,true,'CST'),
 ('DS301','Data Analytics',3,'core',3,true,'CSD'),
 ('CY301','Cyber Security Fundamentals',3,'core',3,true,'CSC'),
 ('EC201','Digital Electronics',3,'theory',3,true,'ECE'),
 ('EE201','Electrical Circuits',3,'theory',3,false,'EEE'),
 ('ME201','Thermodynamics',4,'theory',3,false,'MECH'),
 ('CE201','Structural Analysis',4,'theory',3,false,'CIVIL'),
 ('MA301','Discrete Mathematics',4,'theory',3,false,'H&S'),
 ('PH301','Engineering Physics',3,'theory',3,false,'H&S'),
 ('EN301','Technical English',2,'theory',3,false,'H&S')
) AS c(code, name, credits, cat, sem, lab, deptcode)
JOIN public.departments d ON d.code = c.deptcode
LEFT JOIN LATERAL (SELECT * FROM public.faculty WHERE department_id = d.id LIMIT 1) f ON true;

-- ============ MITS CLASSROOMS ============
INSERT INTO public.classrooms (code, name, building, floor, capacity, has_projector, has_smartboard, utilization, status) VALUES
 ('KK-101','KK Lecture Hall 101','KK Block',1,80,true,true,72,'available'),
 ('KK-102','KK Lecture Hall 102','KK Block',1,80,true,false,65,'available'),
 ('KK-201','KK Seminar Hall 201','KK Block',2,120,true,true,58,'available'),
 ('KK-202','KK Classroom 202','KK Block',2,60,true,false,71,'occupied'),
 ('KK-301','KK Classroom 301','KK Block',3,60,true,true,48,'available'),
 ('SB-101','South Block Lecture 101','South Block',1,70,true,false,55,'available'),
 ('SB-102','South Block Lecture 102','South Block',1,70,true,true,62,'available'),
 ('SB-201','South Block Seminar 201','South Block',2,100,true,true,45,'available'),
 ('WB-301','CSE Classroom 301','West Block',3,65,true,true,88,'occupied'),
 ('WB-302','CSE Classroom 302','West Block',3,65,true,true,71,'available'),
 ('WB-303','CSE Classroom 303','West Block',3,60,true,false,58,'available'),
 ('EB-101','ECE Classroom 101','East Block',1,60,true,false,69,'available'),
 ('EB-102','EEE Classroom 102','East Block',1,60,true,true,54,'available'),
 ('EB-201','Civil Classroom 201','East Block',2,75,true,false,42,'available'),
 ('NPN-101','AIML Classroom 101','NPN Block',1,60,true,true,76,'available'),
 ('NPN-102','CST Classroom 102','NPN Block',1,60,true,false,81,'occupied'),
 ('AUD-MAIN','MITS Main Auditorium','KK Block',0,500,true,true,35,'available');

-- ============ MITS LABORATORIES (Circular Block, 12 labs) ============
INSERT INTO public.laboratories (code, name, lab_type, building, capacity, computers, equipment, utilization, status, distance_from_gate) VALUES
 ('CB-101','Programming Lab 01','computer','Circular Block',60,60,ARRAY['Workstations','Projector','AC'],78,'occupied',180),
 ('CB-102','Programming Lab 02','computer','Circular Block',60,60,ARRAY['Workstations','Projector'],64,'available',185),
 ('CB-103','Data Structures Lab','computer','Circular Block',50,50,ARRAY['Workstations','Projector'],55,'available',190),
 ('CB-104','DBMS Lab','computer','Circular Block',50,50,ARRAY['Workstations','AC'],48,'available',195),
 ('CB-201','Networks Lab','computer','Circular Block',40,40,ARRAY['Routers','Switches','Workstations'],61,'available',200),
 ('CB-202','Operating Systems Lab','computer','Circular Block',45,45,ARRAY['Workstations'],52,'available',205),
 ('CB-203','AI and ML Lab','computer','Circular Block',70,70,ARRAY['GPU Workstations','Smart Board','Projector','AC'],38,'available',120),
 ('CB-204','Deep Learning Lab','computer','Circular Block',50,50,ARRAY['GPU Workstations'],42,'available',125),
 ('CB-301','Full Stack Lab','computer','Circular Block',50,50,ARRAY['Workstations','Projector'],56,'available',210),
 ('CB-302','Data Analytics Lab','computer','Circular Block',45,45,ARRAY['Workstations'],49,'available',215),
 ('CB-303','Cyber Security Lab','computer','Circular Block',40,40,ARRAY['Workstations','Firewalls'],35,'available',220),
 ('CB-304','IoT Lab','electronics','Circular Block',40,40,ARRAY['IoT Kits','Sensors'],40,'available',225),
 ('IND-01','Mechanical Workshop','mechanical','Industrial Block',50,10,ARRAY['Lathe','Welding','Drilling'],62,'available',300),
 ('IND-02','Industrial Automation Lab','mechanical','Industrial Block',40,20,ARRAY['PLC','Robotics','CNC'],47,'available',310);

-- ============ MITS TIME SLOTS ============
INSERT INTO public.time_slots (label, start_time, end_time, slot_order) VALUES
 ('Slot 1','09:00','10:00',1),
 ('Slot 2','10:00','11:00',2),
 ('Slot 3','11:15','12:15',3),
 ('Slot 4','12:15','13:15',4),
 ('Slot 5','14:00','15:00',5),
 ('Slot 6','15:00','16:00',6),
 ('Slot 7','16:15','17:15',7);

-- ============ MITS RESOURCES ============
INSERT INTO public.resources (name, resource_type, location, quantity, available, utilization, status)
SELECT r.name, r.rtype, r.loc, r.qty, r.avail, round(100.0*(r.qty-r.avail)/GREATEST(r.qty,1)), 'available'
FROM (VALUES
 ('Smart Projector Set','projector','KK Block',30,22,0),
 ('Interactive Smart Board','smartboard','KK Block',15,11,0),
 ('Desktop Workstation','computer','Circular Block',400,120,0),
 ('GPU Compute Node','computer','Circular Block',20,14,0),
 ('Portable PA System','audio','KK Block Auditorium',8,6,0),
 ('Conference Microphone','audio','KK Block',30,22,0),
 ('Oscilloscope','equipment','Circular Block',26,19,0),
 ('3D Printer','equipment','Industrial Block',6,4,0),
 ('Robotic Arm','equipment','Industrial Block',8,6,0),
 ('Sports Equipment Kit','sports','Sports Complex',40,31,0),
 ('Library Study Pod','library','NPN Block Library',35,12,0),
 ('Network Router','equipment','Circular Block',40,25,0)
) AS r(name, rtype, loc, qty, avail, u);

-- ============ MITS DRIVERS ============
INSERT INTO public.drivers (name, license_no, phone, experience_years, status) VALUES
 ('Ramesh Kumar','AP-07-2019-4412','+91 98470 11223',12,'active'),
 ('Suresh Babu','AP-07-2016-8821','+91 98470 33445',9,'active'),
 ('Joseph Mathew','AP-07-2021-1123','+91 98470 55667',5,'active'),
 ('Abdul Rahman','AP-07-2014-7712','+91 98470 77889',15,'on-leave'),
 ('Vinod Pillai','AP-07-2020-9931','+91 98470 99001',7,'active');

-- ============ MITS BUS ROUTES ============
INSERT INTO public.routes (code, name, distance_km, duration_min, utilization, status) VALUES
 ('MITS-R01','Madanapalle Town → MITS',8.5,25,82,'active'),
 ('MITS-R02','Angallu Village → MITS',3.2,10,74,'active'),
 ('MITS-R03','Punganur → MITS',22.4,45,58,'active'),
 ('MITS-R04','Chittoor → MITS',65.0,90,63,'active'),
 ('MITS-R05','Tirupati → MITS',95.0,120,41,'active'),
 ('MITS-R06','Kadiri Road → MITS',12.6,30,72,'active'),
 ('MITS-R07','Kurabalakota → MITS',4.5,12,88,'active'),
 ('MITS-R08','Madanapalle Bus Stand → MITS',9.8,28,66,'active');

-- ============ MITS BUSES ============
INSERT INTO public.buses (bus_number, capacity, route_id, driver_id, passengers, status)
SELECT b.num, b.cap, r.id, d.id, b.pax, b.st
FROM (VALUES
 ('MITS-01',52,'MITS-R01',41,'en-route'),
 ('MITS-02',52,'MITS-R02',33,'en-route'),
 ('MITS-03',45,'MITS-R03',28,'idle'),
 ('MITS-04',52,'MITS-R04',36,'en-route'),
 ('MITS-05',45,'MITS-R05',0,'maintenance')
) AS b(num, cap, rcode, pax, st)
JOIN public.routes r ON r.code = b.rcode
JOIN LATERAL (SELECT * FROM public.drivers ORDER BY md5(b.num) LIMIT 1) d ON true;

-- ============ MITS ROUTE STOPS ============
INSERT INTO public.route_stops (route_id, stop_name, stop_order, arrival_time)
SELECT r.id, s.stop, s.ord, s.t FROM public.routes r
JOIN (VALUES
 ('Madanapalle Bus Stand',1,'07:30'),
 ('Gandhi Circle',2,'07:45'),
 ('MITS Main Gate',3,'08:10')
) AS s(stop, ord, t) ON r.code='MITS-R01';

INSERT INTO public.route_stops (route_id, stop_name, stop_order, arrival_time)
SELECT r.id, s.stop, s.ord, s.t FROM public.routes r
JOIN (VALUES
 ('Angallu Junction',1,'08:00'),
 ('Kurabalakota',2,'08:08'),
 ('MITS Main Gate',3,'08:15')
) AS s(stop, ord, t) ON r.code='MITS-R02';

INSERT INTO public.route_stops (route_id, stop_name, stop_order, arrival_time)
SELECT r.id, s.stop, s.ord, s.t FROM public.routes r
JOIN (VALUES
 ('Punganur Bus Stand',1,'06:50'),
 ('Chowdepalle',2,'07:20'),
 ('MITS Main Gate',3,'08:05')
) AS s(stop, ord, t) ON r.code='MITS-R03';

INSERT INTO public.route_stops (route_id, stop_name, stop_order, arrival_time)
SELECT r.id, s.stop, s.ord, s.t FROM public.routes r
JOIN (VALUES
 ('Kadiri Road',1,'07:40'),
 ('Kurabalakota Mandal',2,'08:05'),
 ('MITS Main Gate',3,'08:15')
) AS s(stop, ord, t) ON r.code='MITS-R06';

-- ============ MITS REQUESTS ============
INSERT INTO public.requests (requester_name, requester_role, request_type, capacity, start_time, end_time, equipment, status, allocated_resource, score) VALUES
 ('Dr. R. Kalpana','faculty','Computer Laboratory',60,'14:00','16:00','70 Computers','approved','CB-203',94),
 ('Dr. K. Chokkanathan','faculty','Classroom',65,'10:00','11:00','Projector','approved','WB-302',89),
 ('Dr. G. Arun Kumar','faculty','AI Lab',50,'11:15','12:15','GPU Workstations','pending',NULL,NULL),
 ('Chinnakkagari Vani','student','Library Study Pod',4,'16:15','17:15',NULL,'pending',NULL,NULL),
 ('Dr. S. Satheesh Kumar','faculty','Seminar Hall',100,'09:00','11:00','PA System','processing',NULL,NULL);

-- ============ MITS CONFLICTS ============
INSERT INTO public.conflicts (conflict_type, severity, title, cause, affected, ai_analysis, recommendation, status) VALUES
 ('classroom','high','Double booking in WB-301','Two CSE batches scheduled in WB-301 at Slot 3 on Wednesday',ARRAY['WB-301','CSE-2024','CSE-2023'],'Timetable Agent detected overlapping assignments produced by two independent schedule edits.','Move CSE-2024 to WB-302 which is free at Slot 3 and has sufficient capacity.','open'),
 ('faculty','critical','Faculty overlap: Dr. R. Kalpana','Assigned to CS301 and CS304 in the same slot on Monday',ARRAY['Dr. R. Kalpana','CS301','CS304'],'Hard constraint violation: a faculty member cannot occupy two rooms simultaneously.','Shift CS304 to Slot 6 on Monday; faculty workload remains within 18 hours.','open'),
 ('lab','medium','Lab capacity shortfall in CB-201','Networks Lab holds 40 but CSE-2024 strength is 60',ARRAY['CB-201','CSE-2024'],'Capacity constraint fails by 20 seats; splitting the batch is feasible.','Split into two sessions or relocate to CB-101 (60 seats).','investigating'),
 ('resource','low','Projector shortage in KK Block','17 available against 22 concurrent requirements',ARRAY['Smart Projector Set'],'Soft constraint: peak demand exceeds inventory during Slot 2.','Reallocate 5 projectors from West Block during morning peak.','open'),
 ('timetable','medium','Excessive gaps for CSE-2023 Batch','Three idle slots on Thursday',ARRAY['CSE-2023 Batch'],'Soft constraint on gap minimisation is violated with a penalty of 3.','Compact the Thursday schedule by moving CS304 to Slot 3.','resolved'),
 ('transportation','high','Route MITS-R07 over capacity','Kurabalakota route demand exceeds bus MITS-02 capacity by 12 passengers',ARRAY['MITS-02','MITS-R07'],'Utilization at 88% with peak overflow between 08:00 and 08:15.','Add a second trip or reassign bus MITS-03 to the Kurabalakota loop.','open');

-- ============ MITS RULES ============
INSERT INTO public.rules (name, rule_type, conditions, conclusion, weight, active) VALUES
 ('Capacity Sufficiency','hard',ARRAY['Room Capacity >= Required Capacity','Room Available = TRUE','Conflict = FALSE'],'Room Candidate = TRUE',1,true),
 ('Equipment Match','hard',ARRAY['Lab Computers >= Required Computers','Lab Type = Requested Type'],'Equipment Satisfied = TRUE',1,true),
 ('Timetable Freedom','hard',ARRAY['No Timetable Entry In Slot','No Pending Allocation In Slot'],'Slot Available = TRUE',1,true),
 ('Faculty Availability','hard',ARRAY['Faculty Not Scheduled In Slot','Faculty Workload < Max Hours'],'Faculty Assignable = TRUE',1,true),
 ('Proximity Preference','soft',ARRAY['Distance <= 250 meters'],'Proximity Bonus = TRUE',0.4,true),
 ('Gap Minimisation','soft',ARRAY['Adjacent Slot Occupied By Same Batch'],'Gap Penalty = FALSE',0.3,true),
 ('Room Efficiency','soft',ARRAY['Capacity Utilisation >= 0.7'],'Efficient Allocation = TRUE',0.5,true),
 ('Faculty Preference','soft',ARRAY['Slot In Faculty Preferred Window'],'Preference Satisfied = TRUE',0.35,true);

-- ============ MITS KNOWLEDGE ENTITIES ============
INSERT INTO public.knowledge_entities (entity_type, label, properties) VALUES
 ('Faculty','Dr. R. Kalpana','{"dept":"CSE","role":"HOD"}'),
 ('Faculty','Dr. Chandra Prakash Gupta','{"dept":"AIML","role":"Dean"}'),
 ('Course','CS301 Data Structures and Algorithms','{"credits":4,"sem":3}'),
 ('Course','AI302 Machine Learning','{"credits":4,"sem":3}'),
 ('Laboratory','CB-203 AI and ML Lab','{"computers":70,"block":"Circular Block"}'),
 ('Classroom','WB-301 CSE Classroom 301','{"capacity":65,"block":"West Block"}'),
 ('Batch','CSE-2024 Batch','{"strength":60,"sem":3}'),
 ('Student','Chinnakkagari Vani','{"roll":"24691A05IW","batch":"CSE-2024"}'),
 ('Bus','MITS-01','{"capacity":52,"route":"MITS-R01"}'),
 ('Route','MITS-R01 Madanapalle Town → MITS','{"km":8.5}'),
 ('Building','West Block','{"floors":4,"dept":"CSE"}'),
 ('Building','Circular Block','{"floors":3,"labs":12}'),
 ('Building','KK Block','{"floors":3,"type":"Classrooms + Auditorium"}');

-- ============ MITS KNOWLEDGE RELATIONSHIPS ============
INSERT INTO public.knowledge_relationships (from_entity, to_entity, relationship)
SELECT a.id,b.id,r.rel FROM (VALUES
 ('Dr. R. Kalpana','CS301 Data Structures and Algorithms','teaches'),
 ('Dr. R. Kalpana','CS304 Computer Networks','teaches'),
 ('Dr. Chandra Prakash Gupta','AI302 Machine Learning','teaches'),
 ('CS301 Data Structures and Algorithms','WB-301 CSE Classroom 301','scheduled_in'),
 ('AI302 Machine Learning','CB-203 AI and ML Lab','scheduled_in'),
 ('CB-203 AI and ML Lab','Circular Block','located_in'),
 ('WB-301 CSE Classroom 301','West Block','located_in'),
 ('CSE-2024 Batch','CS301 Data Structures and Algorithms','follows'),
 ('Chinnakkagari Vani','CSE-2024 Batch','belongs_to'),
 ('MITS-01','MITS-R01 Madanapalle Town → MITS','follows'),
 ('Dr. R. Kalpana','West Block','available_at')
) AS r(f,t,rel)
JOIN public.knowledge_entities a ON a.label = r.f
JOIN public.knowledge_entities b ON b.label = r.t;

-- ============ MITS AI DECISIONS ============
INSERT INTO public.ai_decisions (request_summary, agent, algorithm, selected_resource, score, reason, candidates) VALUES
 ('Computer lab for 60 CSE-2024 students, 14:00-16:00','DecisionAgent','Weighted Scoring + CSP','CB-203',94,'CB-203 (AI and ML Lab) satisfies all hard constraints, provides 70 computers, is free between 14:00 and 16:00 and scored highest on suitability.','[{"name":"CB-203","score":94},{"name":"CB-102","score":81},{"name":"CB-101","score":0}]'),
 ('Seminar hall for 100 attendees, 09:00-11:00','DecisionAgent','Weighted Scoring','KK-201',88,'KK Seminar Hall 201 matches capacity closely, has smart board and no timetable conflicts.','[{"name":"KK-201","score":88},{"name":"SB-201","score":76}]'),
 ('Fastest path MITS Main Gate → Circular Block','TransportationAgent','A* Search','via KK Block',96,'A* expanded 6 nodes and returned the minimum f(n) path of 320m taking about 4 minutes walking.','[{"name":"via KK Block","score":96},{"name":"via West Block","score":72}]'),
 ('Timetable generation for CSE-2024 Batch','TimetableAgent','CSP + Constraint Propagation','21 assignments',91,'All hard constraints satisfied with 3 soft-constraint relaxations for faculty preference.','[{"name":"solution-A","score":91},{"name":"solution-B","score":84}]'),
 ('Electronics lab for 40 ECE students','DecisionAgent','Rule Engine','CB-304',86,'CB-304 (IoT Lab) is the only electronics lab satisfying capacity and equipment rules in the requested window.','[{"name":"CB-304","score":86},{"name":"CB-201","score":0}]');

-- ============ MITS AGENT MESSAGES ============
INSERT INTO public.agent_messages (sender,receiver,message_type,payload) VALUES
 ('FacultyAgent','CoordinatorAgent','LAB_REQUEST','{"capacity":60,"startTime":"14:00","endTime":"16:00","dept":"CSE"}'),
 ('CoordinatorAgent','ClassroomAgent','SEARCH_LABS','{"type":"computer","minCapacity":60}'),
 ('ClassroomAgent','TimetableAgent','CHECK_AVAILABILITY','{"candidates":["CB-102","CB-203"]}'),
 ('TimetableAgent','ConflictAgent','VALIDATE_SLOTS','{"valid":2,"rejected":1}'),
 ('ConflictAgent','DecisionAgent','CONSTRAINTS_OK','{"hard":5,"soft":4}'),
 ('DecisionAgent','NotificationAgent','DECISION_READY','{"selected":"CB-203","score":94}'),
 ('StudentAgent','TransportationAgent','NEXT_BUS','{"stop":"MITS Main Gate"}'),
 ('TransportationAgent','StudentAgent','BUS_ETA','{"bus":"MITS-02","eta":"8 min"}');

-- ============ MITS NOTIFICATIONS ============
INSERT INTO public.notifications (user_id, category, title, body) VALUES
 (NULL,'ai','AI Recommendation ready','CB-203 (AI and ML Lab) recommended with 94% suitability for the 14:00–16:00 session.'),
 (NULL,'request','Request approved','Your lab request for WB-302 has been approved.'),
 (NULL,'timetable','Timetable updated','CSE-2024 Batch timetable regenerated with 0 hard conflicts.'),
 (NULL,'transportation','Bus MITS-02 arriving','Bus MITS-02 reaches MITS Main Gate in 8 minutes.'),
 (NULL,'conflict','Critical conflict detected','Faculty overlap detected for Dr. R. Kalpana on Monday.'),
 (NULL,'system','Agent network healthy','All 10 campus agents are online with 97% average success rate