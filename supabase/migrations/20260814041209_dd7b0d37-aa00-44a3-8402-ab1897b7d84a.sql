
-- ============ helpers ============
CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;

CREATE TYPE public.app_role AS ENUM ('admin','faculty','student');

-- ============ profiles & roles ============
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles readable by authenticated" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "own profile write" ON public.profiles FOR ALL TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "roles readable by authenticated" ON public.user_roles FOR SELECT TO authenticated USING (true);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email,'@',1)))
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, COALESCE((NEW.raw_user_meta_data->>'role')::public.app_role, 'student'))
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ campus core ============
CREATE TABLE public.departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE, name text NOT NULL, hod text, building text,
  created_at timestamptz NOT NULL DEFAULT now());

CREATE TABLE public.batches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id uuid REFERENCES public.departments ON DELETE CASCADE,
  name text NOT NULL, year int NOT NULL DEFAULT 1, strength int NOT NULL DEFAULT 60,
  created_at timestamptz NOT NULL DEFAULT now());

CREATE TABLE public.faculty (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id uuid REFERENCES public.departments ON DELETE SET NULL,
  employee_code text UNIQUE, name text NOT NULL, email text, designation text,
  specialization text, max_hours int NOT NULL DEFAULT 18, workload int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now());

CREATE TABLE public.students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id uuid REFERENCES public.batches ON DELETE SET NULL,
  department_id uuid REFERENCES public.departments ON DELETE SET NULL,
  roll_no text UNIQUE, name text NOT NULL, email text, semester int NOT NULL DEFAULT 1,
  attendance numeric NOT NULL DEFAULT 90,
  created_at timestamptz NOT NULL DEFAULT now());

CREATE TABLE public.courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id uuid REFERENCES public.departments ON DELETE SET NULL,
  faculty_id uuid REFERENCES public.faculty ON DELETE SET NULL,
  code text NOT NULL UNIQUE, name text NOT NULL, credits int NOT NULL DEFAULT 3,
  category text NOT NULL DEFAULT 'theory', semester int NOT NULL DEFAULT 1,
  requires_lab boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now());

CREATE TABLE public.classrooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE, name text NOT NULL, building text NOT NULL DEFAULT 'Academic Block',
  floor int NOT NULL DEFAULT 1, capacity int NOT NULL DEFAULT 60, has_projector boolean NOT NULL DEFAULT true,
  has_smartboard boolean NOT NULL DEFAULT false, utilization numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'available',
  created_at timestamptz NOT NULL DEFAULT now());

CREATE TABLE public.laboratories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE, name text NOT NULL, lab_type text NOT NULL DEFAULT 'computer',
  building text NOT NULL DEFAULT 'CSE Block', capacity int NOT NULL DEFAULT 60,
  computers int NOT NULL DEFAULT 0, equipment text[] NOT NULL DEFAULT '{}',
  utilization numeric NOT NULL DEFAULT 0, status text NOT NULL DEFAULT 'available',
  distance_from_gate int NOT NULL DEFAULT 100,
  created_at timestamptz NOT NULL DEFAULT now());

CREATE TABLE public.resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL, resource_type text NOT NULL, location text,
  quantity int NOT NULL DEFAULT 1, available int NOT NULL DEFAULT 1,
  utilization numeric NOT NULL DEFAULT 0, status text NOT NULL DEFAULT 'available',
  created_at timestamptz NOT NULL DEFAULT now());

CREATE TABLE public.time_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL, start_time text NOT NULL, end_time text NOT NULL, slot_order int NOT NULL);

CREATE TABLE public.timetable_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id uuid REFERENCES public.batches ON DELETE CASCADE,
  course_id uuid REFERENCES public.courses ON DELETE CASCADE,
  faculty_id uuid REFERENCES public.faculty ON DELETE SET NULL,
  classroom_id uuid REFERENCES public.classrooms ON DELETE SET NULL,
  laboratory_id uuid REFERENCES public.laboratories ON DELETE SET NULL,
  time_slot_id uuid REFERENCES public.time_slots ON DELETE CASCADE,
  day_of_week text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now());

CREATE TABLE public.requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE SET NULL,
  requester_name text, requester_role text NOT NULL DEFAULT 'faculty',
  request_type text NOT NULL, capacity int NOT NULL DEFAULT 30,
  requested_date date NOT NULL DEFAULT CURRENT_DATE,
  start_time text NOT NULL DEFAULT '14:00', end_time text NOT NULL DEFAULT '16:00',
  equipment text, notes text, status text NOT NULL DEFAULT 'pending',
  allocated_resource text, score numeric,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now());

CREATE TABLE public.drivers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL, license_no text, phone text, experience_years int NOT NULL DEFAULT 1,
  status text NOT NULL DEFAULT 'active', created_at timestamptz NOT NULL DEFAULT now());

CREATE TABLE public.routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE, name text NOT NULL, distance_km numeric NOT NULL DEFAULT 10,
  duration_min int NOT NULL DEFAULT 30, utilization numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'active', created_at timestamptz NOT NULL DEFAULT now());

CREATE TABLE public.buses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bus_number text NOT NULL UNIQUE, capacity int NOT NULL DEFAULT 45,
  route_id uuid REFERENCES public.routes ON DELETE SET NULL,
  driver_id uuid REFERENCES public.drivers ON DELETE SET NULL,
  passengers int NOT NULL DEFAULT 0, status text NOT NULL DEFAULT 'idle',
  created_at timestamptz NOT NULL DEFAULT now());

CREATE TABLE public.route_stops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id uuid REFERENCES public.routes ON DELETE CASCADE,
  stop_name text NOT NULL, stop_order int NOT NULL, arrival_time text);

CREATE TABLE public.agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE, name text NOT NULL, description text,
  status text NOT NULL DEFAULT 'idle', current_task text,
  tasks_processed int NOT NULL DEFAULT 0, success_rate numeric NOT NULL DEFAULT 95,
  last_activity timestamptz NOT NULL DEFAULT now());

CREATE TABLE public.agent_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender text NOT NULL, receiver text NOT NULL, message_type text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}', request_id uuid REFERENCES public.requests ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now());

CREATE TABLE public.ai_decisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid REFERENCES public.requests ON DELETE CASCADE,
  request_summary text NOT NULL, agent text NOT NULL, algorithm text NOT NULL,
  selected_resource text, score numeric NOT NULL DEFAULT 0, reason text,
  candidates jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz NOT NULL DEFAULT now());

CREATE TABLE public.conflicts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conflict_type text NOT NULL, severity text NOT NULL DEFAULT 'low',
  title text NOT NULL, cause text, affected text[] NOT NULL DEFAULT '{}',
  ai_analysis text, recommendation text, status text NOT NULL DEFAULT 'open',
  created_at timestamptz NOT NULL DEFAULT now());

CREATE TABLE public.knowledge_entities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL, label text NOT NULL, properties jsonb NOT NULL DEFAULT '{}');

CREATE TABLE public.knowledge_relationships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_entity uuid REFERENCES public.knowledge_entities ON DELETE CASCADE,
  to_entity uuid REFERENCES public.knowledge_entities ON DELETE CASCADE,
  relationship text NOT NULL);

CREATE TABLE public.rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL, rule_type text NOT NULL DEFAULT 'hard',
  conditions text[] NOT NULL DEFAULT '{}', conclusion text NOT NULL,
  weight numeric NOT NULL DEFAULT 1, active boolean NOT NULL DEFAULT true);

CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  category text NOT NULL DEFAULT 'system', title text NOT NULL, body text,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now());

CREATE TRIGGER req_updated BEFORE UPDATE ON public.requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ grants + RLS for campus tables ============
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['departments','batches','faculty','students','courses','classrooms','laboratories','resources','time_slots','timetable_entries','drivers','routes','buses','route_stops','agents','agent_messages','ai_decisions','conflicts','knowledge_entities','knowledge_relationships','rules']
  LOOP
    EXECUTE format('GRANT SELECT ON public.%I TO anon', t);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY "public read %1$s" ON public.%1$I FOR SELECT USING (true)', t);
    EXECUTE format('CREATE POLICY "auth write %1$s" ON public.%1$I FOR ALL TO authenticated USING (true) WITH CHECK (true)', t);
  END LOOP;
END $$;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.requests TO authenticated;
GRANT SELECT ON public.requests TO anon;
GRANT ALL ON public.requests TO service_role;
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read requests" ON public.requests FOR SELECT USING (true);
CREATE POLICY "auth write requests" ON public.requests FOR ALL TO authenticated USING (true) WITH CHECK (true);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own or broadcast notifications" ON public.notifications FOR SELECT TO authenticated USING (user_id IS NULL OR user_id = auth.uid());
CREATE POLICY "auth manage notifications" ON public.notifications FOR ALL TO authenticated USING (user_id IS NULL OR user_id = auth.uid()) WITH CHECK (user_id IS NULL OR user_id = auth.uid());

-- ============ SEED ============
INSERT INTO public.departments (code,name,hod,building) VALUES
 ('CSE','Computer Science & Engineering','Dr. Aravind Menon','CSE Block'),
 ('ECE','Electronics & Communication','Dr. Priya Nair','Academic Block'),
 ('ME','Mechanical Engineering','Dr. Rakesh Iyer','Academic Block'),
 ('CE','Civil Engineering','Dr. Sunita Rao','Academic Block'),
 ('AI','Artificial Intelligence & Data Science','Dr. Neha Verma','CSE Block');

INSERT INTO public.batches (department_id,name,year,strength)
SELECT d.id, d.code||'-'||y.y||' Batch', y.y, 55 + (y.y*3)
FROM public.departments d CROSS JOIN (VALUES (1),(2),(3),(4)) AS y(y);

INSERT INTO public.faculty (department_id,employee_code,name,email,designation,specialization,max_hours,workload)
SELECT d.id, 'FAC'||lpad((row_number() over ())::text,3,'0'), f.name, lower(replace(f.name,' ','.'))||'@nexuscampus.edu', f.desig, f.spec, 18, 8 + (row_number() over ())%9
FROM public.departments d
JOIN (VALUES
 ('Dr. Aravind Menon','Professor','Distributed Systems','CSE'),
 ('Dr. Neha Verma','Professor','Machine Learning','AI'),
 ('Prof. Kiran Das','Associate Professor','Computer Networks','CSE'),
 ('Dr. Priya Nair','Professor','VLSI Design','ECE'),
 ('Prof. Rahul Sharma','Assistant Professor','Embedded Systems','ECE'),
 ('Dr. Rakesh Iyer','Professor','Thermodynamics','ME'),
 ('Prof. Divya Krishnan','Assistant Professor','Robotics','ME'),
 ('Dr. Sunita Rao','Professor','Structural Engineering','CE'),
 ('Prof. Manish Gupta','Assistant Professor','Data Mining','AI'),
 ('Prof. Anita Joseph','Associate Professor','Software Engineering','CSE')
) AS f(name,desig,spec,dep) ON f.dep = d.code;

INSERT INTO public.students (batch_id,department_id,roll_no,name,email,semester,attendance)
SELECT b.id, b.department_id, 'NC'||lpad(s.i::text,4,'0'), s.name, 'student'||s.i||'@nexuscampus.edu', 1 + (s.i%8), 72 + (s.i*3)%27
FROM (VALUES
 (1,'Aditya Raghavan'),(2,'Sneha Kulkarni'),(3,'Rohit Bansal'),(4,'Ishita Mehta'),(5,'Karthik Suresh'),
 (6,'Ananya Pillai'),(7,'Vikram Chandra'),(8,'Meera Joshi'),(9,'Nikhil Reddy'),(10,'Tara Sequeira'),
 (11,'Arjun Malhotra'),(12,'Pooja Shetty'),(13,'Sameer Khan'),(14,'Lakshmi Iyer'),(15,'Devansh Patel'),
 (16,'Riya Chatterjee'),(17,'Harsh Vardhan'),(18,'Nandini Rao'),(19,'Yash Deshmukh'),(20,'Kavya Nambiar')
) AS s(i,name)
JOIN LATERAL (SELECT * FROM public.batches ORDER BY md5(name||s.i::text) LIMIT 1) b ON true;

INSERT INTO public.courses (department_id,faculty_id,code,name,credits,category,semester,requires_lab)
SELECT d.id, f.id, c.code, c.name, c.credits, c.cat, c.sem, c.lab
FROM (VALUES
 ('CS301','Data Structures & Algorithms',4,'theory',3,true,'CSE','Dr. Aravind Menon'),
 ('CS302','Operating Systems',4,'theory',3,true,'CSE','Prof. Kiran Das'),
 ('CS401','Computer Networks',3,'theory',4,true,'CSE','Prof. Kiran Das'),
 ('CS402','Software Engineering',3,'theory',4,false,'CSE','Prof. Anita Joseph'),
 ('AI301','Artificial Intelligence',4,'core',3,true,'AI','Dr. Neha Verma'),
 ('AI302','Machine Learning',4,'core',3,true,'AI','Dr. Neha Verma'),
 ('AI401','Deep Learning',4,'elective',4,true,'AI','Prof. Manish Gupta'),
 ('EC201','Digital Electronics',3,'theory',2,true,'ECE','Dr. Priya Nair'),
 ('EC301','Microcontrollers',4,'theory',3,true,'ECE','Prof. Rahul Sharma'),
 ('EC302','Signals & Systems',3,'theory',3,false,'ECE','Dr. Priya Nair'),
 ('ME201','Thermodynamics',4,'theory',2,false,'ME','Dr. Rakesh Iyer'),
 ('ME301','Robotics & Automation',4,'core',3,true,'ME','Prof. Divya Krishnan'),
 ('CE201','Structural Analysis',4,'theory',2,false,'CE','Dr. Sunita Rao'),
 ('CE301','Geotechnical Engineering',3,'theory',3,true,'CE','Dr. Sunita Rao'),
 ('CS403','Database Systems',4,'theory',4,true,'CSE','Prof. Anita Joseph')
) AS c(code,name,credits,cat,sem,lab,dep,fac)
JOIN public.departments d ON d.code = c.dep
LEFT JOIN public.faculty f ON f.name = c.fac;

INSERT INTO public.classrooms (code,name,building,floor,capacity,has_projector,has_smartboard,utilization,status) VALUES
 ('AB-101','Lecture Hall 101','Academic Block',1,80,true,true,74,'available'),
 ('AB-102','Lecture Hall 102','Academic Block',1,80,true,false,61,'available'),
 ('AB-201','Seminar Room 201','Academic Block',2,45,true,true,52,'available'),
 ('AB-202','Lecture Hall 202','Academic Block',2,70,true,false,80,'occupied'),
 ('AB-301','Lecture Hall 301','Academic Block',3,90,true,true,66,'available'),
 ('CSE-201','CSE Classroom 201','CSE Block',2,65,true,true,88,'occupied'),
 ('CSE-202','CSE Classroom 202','CSE Block',2,65,true,true,71,'available'),
 ('CSE-204','CSE Classroom 204','CSE Block',2,60,true,false,58,'available'),
 ('CSE-301','CSE Classroom 301','CSE Block',3,70,true,true,63,'available'),
 ('CSE-302','CSE Classroom 302','CSE Block',3,70,true,false,45,'available'),
 ('ECE-101','ECE Classroom 101','Academic Block',1,60,true,false,69,'available'),
 ('ECE-102','ECE Classroom 102','Academic Block',1,60,true,true,54,'available'),
 ('ME-101','Mechanical Hall 101','Academic Block',1,75,true,false,49,'available'),
 ('CE-101','Civil Hall 101','Academic Block',1,75,true,false,41,'maintenance'),
 ('AUD-01','Main Auditorium','Auditorium',1,400,true,true,32,'available');

INSERT INTO public.laboratories (code,name,lab_type,building,capacity,computers,equipment,utilization,status,distance_from_gate) VALUES
 ('LAB-01','Programming Lab 01','computer','CSE Block',60,60,ARRAY['Workstations','Projector','AC'],78,'occupied',210),
 ('LAB-02','Programming Lab 02','computer','CSE Block',50,50,ARRAY['Workstations','Projector'],64,'available',215),
 ('LAB-03','Networks Lab','computer','CSE Block',40,40,ARRAY['Routers','Switches','Workstations'],55,'available',230),
 ('LAB-04','AI & Data Science Lab','computer','CSE Block',70,70,ARRAY['GPU Workstations','Smart Board','Projector','AC'],38,'available',120),
 ('LAB-05','Electronics Lab','electronics','Academic Block',45,20,ARRAY['Oscilloscopes','Function Generators'],61,'available',180),
 ('LAB-06','Embedded Systems Lab','electronics','Academic Block',40,30,ARRAY['Microcontroller Kits','Logic Analyzers'],47,'available',190),
 ('LAB-07','Robotics Lab','mechanical','Academic Block',35,15,ARRAY['Robotic Arms','3D Printers'],52,'available',260),
 ('LAB-08','Materials Science Lab','science','Academic Block',30,10,ARRAY['UTM','Microscopes'],29,'maintenance',275);

INSERT INTO public.resources (name,resource_type,location,quantity,available,utilization,status)
SELECT r.name, r.rtype, r.loc, r.qty, r.avail, round(100.0*(r.qty-r.avail)/GREATEST(r.qty,1)), 'available'
FROM (VALUES
 ('Smart Projector Set','projector','Academic Block',24,17,0),
 ('Interactive Smart Board','smartboard','CSE Block',12,9,0),
 ('Desktop Workstation','computer','CSE Block',280,64,0),
 ('GPU Compute Node','computer','CSE Block',16,11,0),
 ('Portable PA System','audio','Auditorium',8,6,0),
 ('Conference Microphone','audio','Academic Block',30,22,0),
 ('Laboratory Oscilloscope','equipment','Academic Block',26,19,0),
 ('3D Printer','equipment','Academic Block',6,4,0),
 ('Sports Equipment Kit','sports','Sports Complex',40,31,0),
 ('Library Study Pod','library','Library',35,12,0)
) AS r(name,rtype,loc,qty,avail,u);

INSERT INTO public.time_slots (label,start_time,end_time,slot_order) VALUES
 ('Slot 1','09:00','10:00',1),('Slot 2','10:00','11:00',2),('Slot 3','11:15','12:15',3),
 ('Slot 4','12:15','13:15',4),('Slot 5','14:00','15:00',5),('Slot 6','15:00','16:00',6),
 ('Slot 7','16:15','17:15',7);

INSERT INTO public.timetable_entries (batch_id,course_id,faculty_id,classroom_id,laboratory_id,time_slot_id,day_of_week)
SELECT b.id, c.id, c.faculty_id, cr.id, NULL, ts.id, d.day
FROM public.courses c
JOIN LATERAL (SELECT * FROM public.batches bb WHERE bb.department_id = c.department_id ORDER BY bb.year LIMIT 1) b ON true
JOIN LATERAL (SELECT * FROM public.classrooms ORDER BY md5(c.code||'r') LIMIT 1) cr ON true
CROSS JOIN LATERAL (SELECT * FROM public.time_slots ORDER BY md5(c.code) LIMIT 1) ts
CROSS JOIN (VALUES ('Monday'),('Wednesday'),('Friday')) AS d(day);

INSERT INTO public.drivers (name,license_no,phone,experience_years,status) VALUES
 ('Ramesh Kumar','KL07-2019-4412','+91 98470 11223',12,'active'),
 ('Suresh Babu','KL07-2016-8821','+91 98470 33445',9,'active'),
 ('Joseph Mathew','KL07-2021-1123','+91 98470 55667',5,'active'),
 ('Abdul Rahman','KL07-2014-7712','+91 98470 77889',15,'on-leave'),
 ('Vinod Pillai','KL07-2020-9931','+91 98470 99001',7,'active');

INSERT INTO public.routes (code,name,distance_km,duration_min,utilization,status) VALUES
 ('R-01','City Centre → Campus',12.4,35,82,'active'),
 ('R-02','Railway Station → Campus',8.1,25,74,'active'),
 ('R-03','Tech Park → Campus',15.7,45,58,'active'),
 ('R-04','North Suburb → Campus',18.2,50,63,'active'),
 ('R-05','Airport → Campus',22.5,55,41,'active'),
 ('R-06','Hostel Loop (Internal)',3.2,12,91,'active'),
 ('R-07','South Gate → Campus',9.8,28,66,'active'),
 ('R-08','Lakeside → Campus',14.3,40,37,'inactive');

INSERT INTO public.buses (bus_number,capacity,route_id,driver_id,passengers,status)
SELECT b.num, b.cap, r.id, d.id, b.pax, b.st
FROM (VALUES ('NX-01',45,'R-01',41,'en-route'),('NX-02',45,'R-02',33,'en-route'),
 ('NX-03',52,'R-03',28,'idle'),('NX-04',40,'R-06',36,'en-route'),('NX-05',52,'R-04',0,'maintenance')
) AS b(num,cap,rcode,pax,st)
JOIN public.routes r ON r.code = b.rcode
JOIN LATERAL (SELECT * FROM public.drivers ORDER BY md5(b.num) LIMIT 1) d ON true;

INSERT INTO public.route_stops (route_id,stop_name,stop_order,arrival_time)
SELECT r.id, s.stop, s.ord, s.t FROM public.routes r
JOIN (VALUES ('City Centre',1,'07:30'),('Market Junction',2,'07:45'),('Main Gate',3,'08:10'),('Academic Block Stop',4,'08:15')) AS s(stop,ord,t) ON r.code='R-01'
UNION ALL
SELECT r.id, s.stop, s.ord, s.t FROM public.routes r
JOIN (VALUES ('Railway Station',1,'07:40'),('Old Town',2,'07:55'),('Main Gate',3,'08:05')) AS s(stop,ord,t) ON r.code='R-02'
UNION ALL
SELECT r.id, s.stop, s.ord, s.t FROM public.routes r
JOIN (VALUES ('Hostel Block A',1,'08:00'),('Cafeteria Stop',2,'08:05'),('CSE Block Stop',3,'08:09'),('Library Stop',4,'08:12')) AS s(stop,ord,t) ON r.code='R-06';

INSERT INTO public.agents (key,name,description,status,current_task,tasks_processed,success_rate) VALUES
 ('coordinator','Coordinator Agent','Decomposes requests into task plans and orchestrates all agents','active','Orchestrating task plan #2487',842,98.2),
 ('student','Student Agent','Handles student queries, schedules and campus navigation','active','Resolving navigation query',1204,96.4),
 ('faculty','Faculty Agent','Processes faculty requests for rooms, labs and resources','active','Parsing lab request',611,97.1),
 ('classroom','Classroom Agent','Searches and validates classrooms and laboratories','busy','Searching computer laboratories',923,95.8),
 ('timetable','Timetable Agent','Builds conflict-free timetables via CSP','active','Checking slot conflicts',487,94.3),
 ('resource','Resource Agent','Tracks equipment inventory and availability','active','Verifying equipment counts',768,97.9),
 ('transportation','Transportation Agent','Optimizes bus routes with A* search','idle','Awaiting route request',329,93.6),
 ('conflict','Conflict Agent','Detects and validates hard/soft constraint violations','active','Validating constraints',556,99.1),
 ('notification','Notification Agent','Delivers decisions and alerts to campus users','active','Dispatching notifications',1522,99.6),
 ('admin','Admin Agent','Enforces policy, rules and administrative overrides','idle','Idle',214,98.8);

INSERT INTO public.agent_messages (sender,receiver,message_type,payload) VALUES
 ('FacultyAgent','CoordinatorAgent','LAB_REQUEST','{"capacity":60,"startTime":"14:00","endTime":"16:00"}'),
 ('CoordinatorAgent','ClassroomAgent','SEARCH_LABS','{"type":"computer","minCapacity":60}'),
 ('ClassroomAgent','TimetableAgent','CHECK_AVAILABILITY','{"candidates":["LAB-02","LAB-04"]}'),
 ('TimetableAgent','ConflictAgent','VALIDATE_SLOTS','{"valid":2,"rejected":1}'),
 ('ConflictAgent','DecisionAgent','CONSTRAINTS_OK','{"hard":5,"soft":4}'),
 ('DecisionAgent','NotificationAgent','DECISION_READY','{"selected":"LAB-04","score":94}'),
 ('StudentAgent','TransportationAgent','NEXT_BUS','{"stop":"Main Gate"}'),
 ('TransportationAgent','StudentAgent','BUS_ETA','{"bus":"NX-02","eta":"8 min"}');

INSERT INTO public.ai_decisions (request_summary,agent,algorithm,selected_resource,score,reason,candidates) VALUES
 ('Computer lab for 60 students, 14:00-16:00','DecisionAgent','Weighted Scoring + CSP','LAB-04',94,'LAB-04 satisfies all hard constraints, provides 70 computers for the requested capacity of 60, is free between 14:00 and 16:00 and scored highest on suitability.','[{"name":"LAB-04","score":94},{"name":"LAB-02","score":81},{"name":"LAB-01","score":0}]'),
 ('Seminar room for 40 attendees, 11:15-12:15','DecisionAgent','Weighted Scoring','AB-201',88,'Seminar Room 201 matches capacity closely, has a smart board and no timetable conflicts.','[{"name":"AB-201","score":88},{"name":"CSE-204","score":76}]'),
 ('Fastest path Main Gate → Lab 04','TransportationAgent','A* Search','Route via Academic Block',96,'A* expanded 6 nodes and returned the minimum f(n) path of 320m taking about 4 minutes walking.','[{"name":"via Academic Block","score":96},{"name":"via Cafeteria","score":72}]'),
 ('Timetable generation for CSE-3 Batch','TimetableAgent','CSP + Constraint Propagation','21 assignments',91,'All hard constraints satisfied with 3 soft-constraint relaxations for faculty preference.','[{"name":"solution-A","score":91},{"name":"solution-B","score":84}]'),
 ('Electronics lab for 45 students','DecisionAgent','Rule Engine','LAB-05',86,'LAB-05 is the only electronics lab satisfying capacity and equipment rules in the requested window.','[{"name":"LAB-05","score":86},{"name":"LAB-06","score":0}]');

INSERT INTO public.conflicts (conflict_type,severity,title,cause,affected,ai_analysis,recommendation,status) VALUES
 ('classroom','high','Double booking in CSE-201','Two batches scheduled in CSE-201 at Slot 3 on Wednesday',ARRAY['CSE-201','CSE-2 Batch','AI-3 Batch'],'Timetable Agent detected overlapping assignments produced by two independent schedule edits.','Move AI-3 Batch to CSE-302 which is free at Slot 3 and has sufficient capacity.','open'),
 ('faculty','critical','Faculty overlap: Dr. Neha Verma','Assigned to AI301 and AI302 in the same slot on Monday',ARRAY['Dr. Neha Verma','AI301','AI302'],'Hard constraint violation: a faculty member cannot occupy two rooms simultaneously.','Shift AI302 to Slot 6 on Monday; faculty workload remains within 18 hours.','open'),
 ('lab','medium','Lab capacity shortfall in LAB-03','Networks Lab holds 40 but batch strength is 58',ARRAY['LAB-03','CSE-4 Batch'],'Capacity constraint fails by 18 seats; splitting the batch is feasible.','Split into two sessions or relocate to LAB-01 (60 seats).','investigating'),
 ('resource','low','Projector shortage in Academic Block','17 available against 21 concurrent requirements',ARRAY['Smart Projector Set'],'Soft constraint: peak demand exceeds inventory during Slot 2.','Reallocate 4 projectors from CSE Block during morning peak.','open'),
 ('timetable','medium','Excessive gaps for ECE-2 Batch','Three idle slots on Thursday',ARRAY['ECE-2 Batch'],'Soft constraint on gap minimisation is violated with a penalty of 3.','Compact the Thursday schedule by moving EC302 to Slot 3.','resolved'),
 ('transportation','high','Route R-06 over capacity','Hostel loop demand exceeds bus NX-04 capacity by 12 passengers',ARRAY['NX-04','R-06'],'Utilization at 91% with peak overflow between 08:00 and 08:15.','Add a second trip or reassign bus NX-03 to the hostel loop at peak.','open');

INSERT INTO public.rules (name,rule_type,conditions,conclusion,weight,active) VALUES
 ('Capacity Sufficiency','hard',ARRAY['Room Capacity >= Required Capacity','Room Available = TRUE','Conflict = FALSE'],'Room Candidate = TRUE',1,true),
 ('Equipment Match','hard',ARRAY['Lab Computers >= Required Computers','Lab Type = Requested Type'],'Equipment Satisfied = TRUE',1,true),
 ('Timetable Freedom','hard',ARRAY['No Timetable Entry In Slot','No Pending Allocation In Slot'],'Slot Available = TRUE',1,true),
 ('Faculty Availability','hard',ARRAY['Faculty Not Scheduled In Slot','Faculty Workload < Max Hours'],'Faculty Assignable = TRUE',1,true),
 ('Proximity Preference','soft',ARRAY['Distance <= 250 meters'],'Proximity Bonus = TRUE',0.4,true),
 ('Gap Minimisation','soft',ARRAY['Adjacent Slot Occupied By Same Batch'],'Gap Penalty = FALSE',0.3,true),
 ('Room Efficiency','soft',ARRAY['Capacity Utilisation >= 0.7'],'Efficient Allocation = TRUE',0.5,true),
 ('Faculty Preference','soft',ARRAY['Slot In Faculty Preferred Window'],'Preference Satisfied = TRUE',0.35,true);

INSERT INTO public.knowledge_entities (entity_type,label,properties) VALUES
 ('Faculty','Dr. Neha Verma','{"dept":"AI"}'),('Course','AI301 Artificial Intelligence','{"credits":4}'),
 ('Laboratory','LAB-04 AI & Data Science Lab','{"computers":70}'),('Classroom','CSE-204','{"capacity":60}'),
 ('Batch','AI-3 Batch','{"strength":58}'),('Student','Aditya Raghavan','{"roll":"NC0001"}'),
 ('Bus','NX-02','{"capacity":45}'),('Route','R-02 Railway Station → Campus','{"km":8.1}'),
 ('Resource','GPU Compute Node','{"quantity":16}'),('Building','CSE Block','{"floors":4}');

INSERT INTO public.knowledge_relationships (from_entity,to_entity,relationship)
SELECT a.id,b.id,r.rel FROM (VALUES
 ('Dr. Neha Verma','AI301 Artificial Intelligence','teaches'),
 ('AI301 Artificial Intelligence','LAB-04 AI & Data Science Lab','scheduled_in'),
 ('LAB-04 AI & Data Science Lab','CSE Block','located_in'),
 ('CSE-204','CSE Block','located_in'),
 ('AI-3 Batch','AI301 Artificial Intelligence','follows'),
 ('Aditya Raghavan','AI-3 Batch','belongs_to'),
 ('NX-02','R-02 Railway Station → Campus','follows'),
 ('LAB-04 AI & Data Science Lab','GPU Compute Node','uses'),
 ('Dr. Neha Verma','CSE Block','available_at')
) AS r(f,t,rel)
JOIN public.knowledge_entities a ON a.label = r.f
JOIN public.knowledge_entities b ON b.label = r.t;

INSERT INTO public.requests (requester_name,requester_role,request_type,capacity,start_time,end_time,equipment,status,allocated_resource,score) VALUES
 ('Dr. Neha Verma','faculty','Computer Laboratory',60,'14:00','16:00','70 Computers','approved','LAB-04',94),
 ('Prof. Kiran Das','faculty','Classroom',70,'10:00','11:00','Projector','approved','AB-101',89),
 ('Prof. Divya Krishnan','faculty','Robotics Lab',35,'11:15','12:15','Robotic Arms','pending',NULL,NULL),
 ('Aditya Raghavan','student','Library Study Pod',4,'16:15','17:15',NULL,'pending',NULL,NULL),
 ('Dr. Sunita Rao','faculty','Auditorium',250,'09:00','11:00','PA System','processing',NULL,NULL);

INSERT INTO public.notifications (user_id,category,title,body) VALUES
 (NULL,'ai','AI Recommendation ready','LAB-04 recommended with a 94% suitability score for your 14:00–16:00 session.'),
 (NULL,'request','Request approved','Your classroom request for AB-101 has been approved.'),
 (NULL,'timetable','Timetable updated','CSE-3 Batch timetable regenerated with 0 hard conflicts.'),
 (NULL,'transportation','Bus NX-02 arriving','Bus NX-02 reaches Main Gate in 8 minutes.'),
 (NULL,'conflict','Critical conflict detected','Faculty overlap detected for Dr. Neha Verma on Monday.'),
 (NULL,'system','Agent network healthy','All 10 campus agents are online with 97% average success rate.');
