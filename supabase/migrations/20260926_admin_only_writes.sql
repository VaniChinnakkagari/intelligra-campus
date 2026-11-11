-- ============================================================
-- MITS CAMPUS AI — Admin-only write policies
-- Everyone can READ, only admins can WRITE
-- ============================================================

-- Helper: check if current user is admin (using existing has_role function)
-- The has_role function already exists from the original migration.

-- ============================================================
-- Drop existing permissive write policies, replace with admin-only
-- ============================================================

DO $$
DECLARE
  t text;
  campus_tables text[] := ARRAY[
    'departments', 'batches', 'faculty', 'students', 'courses',
    'classrooms', 'laboratories', 'resources', 'time_slots',
    'timetable_entries', 'drivers', 'routes', 'buses', 'route_stops',
    'agents', 'agent_messages', 'ai_decisions', 'conflicts',
    'knowledge_entities', 'knowledge_relationships', 'rules'
  ];
BEGIN
  FOREACH t IN ARRAY campus_tables
  LOOP
    -- Drop old permissive auth write policies
    EXECUTE format('DROP POLICY IF EXISTS "auth write %1$s" ON public.%1$I', t);

    -- Drop old public read policy (we'll recreate with clearer name)
    EXECUTE format('DROP POLICY IF EXISTS "public read %1$s" ON public.%1$I', t);

    -- Everyone (anon + authenticated) can READ
    EXECUTE format('CREATE POLICY "read %1$s" ON public.%1$I FOR SELECT USING (true)', t);

    -- Only admins can INSERT
    EXECUTE format(
      'CREATE POLICY "admin insert %1$s" ON public.%1$I FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), ''admin''))',
      t
    );

    -- Only admins can UPDATE
    EXECUTE format(
      'CREATE POLICY "admin update %1$s" ON public.%1$I FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), ''admin'')) WITH CHECK (public.has_role(auth.uid(), ''admin''))',
      t
    );

    -- Only admins can DELETE
    EXECUTE format(
      'CREATE POLICY "admin delete %1$s" ON public.%1$I FOR DELETE TO authenticated USING (public.has_role(auth.uid(), ''admin''))',
      t
    );
  END LOOP;
END $$;

-- ============================================================
-- Special handling for REQUESTS
-- Faculty + Admins can create/update requests; students can create their own
-- ============================================================
DROP POLICY IF EXISTS "auth write requests" ON public.requests;
DROP POLICY IF EXISTS "public read requests" ON public.requests;

CREATE POLICY "read all requests" ON public.requests
  FOR SELECT USING (true);

-- Any authenticated user can create a request (students, faculty, admin)
CREATE POLICY "anyone creates requests" ON public.requests
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Only the creator or admin can update
CREATE POLICY "creator or admin updates requests" ON public.requests
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- Only admins can delete
CREATE POLICY "admin deletes requests" ON public.requests
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- NOTIFICATIONS — user sees their own or broadcast, admin can manage all
-- ============================================================
DROP POLICY IF EXISTS "auth manage notifications" ON public.notifications;
DROP POLICY IF EXISTS "own or broadcast notifications" ON public.notifications;

CREATE POLICY "read own or broadcast notifications" ON public.notifications
  FOR SELECT TO authenticated
  USING (user_id IS NULL OR user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admin manages notifications" ON public.notifications
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- Ensure has_role is executable by authenticated users (it already is)
-- ============================================================
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

-- ============================================================
-- Verify: count policies for a sample table
-- ============================================================
-- SELECT polname, polcmd, polroles::regrole[]
-- FROM pg_policy
-- WHERE polrelid = 'public.classrooms'::regclass;