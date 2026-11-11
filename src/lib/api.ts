import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Row = Record<string, any>;

/** Generic, table-name-agnostic accessor (the generated client requires literal table names). */
const db = supabase as unknown as { from: (table: string) => any };

<<<<<<< HEAD
/**
 * Generic table reader used across dashboards and admin modules.
 * Auto-refreshes every 10 seconds so admin changes appear live for everyone.
 */
export function useTable<T = Row>(
  table: string,
  opts: {
    order?: string;
    ascending?: boolean;
    limit?: number;
    select?: string;
    refetchInterval?: number; // override the default 10s
  } = {},
=======
/** Generic table reader used across dashboards and admin modules. */
export function useTable<T = Row>(
  table: string,
  opts: { order?: string; ascending?: boolean; limit?: number; select?: string } = {},
>>>>>>> 4ed5064e0872a8573dbceff1cf59df711efc6f87
) {
  return useQuery({
    queryKey: ["table", table, opts],
    queryFn: async (): Promise<T[]> => {
      let q = db.from(table).select(opts.select ?? "*");
      if (opts.order) q = q.order(opts.order, { ascending: opts.ascending ?? true });
      if (opts.limit) q = q.limit(opts.limit);
      const { data, error } = await q;
      if (error) throw new Error(error.message);
      return (data ?? []) as T[];
    },
<<<<<<< HEAD
    staleTime: 5_000,
    refetchInterval: opts.refetchInterval ?? 10_000, // auto-refresh every 10s
    refetchOnWindowFocus: true,
=======
    staleTime: 30_000,
>>>>>>> 4ed5064e0872a8573dbceff1cf59df711efc6f87
  });
}

export function useCount(table: string) {
  return useQuery({
    queryKey: ["count", table],
    queryFn: async () => {
      const { count, error } = await db.from(table).select("*", { count: "exact", head: true });
      if (error) throw new Error(error.message);
      return count ?? 0;
    },
<<<<<<< HEAD
    staleTime: 10_000,
    refetchInterval: 15_000,
  });
}

/** Only admins should call useUpsert / useRemove. */
=======
    staleTime: 60_000,
  });
}

>>>>>>> 4ed5064e0872a8573dbceff1cf59df711efc6f87
export function useUpsert(table: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: Row) => {
      const { data, error } = row["id"]
        ? await db.from(table).update(row).eq("id", row["id"]).select().single()
        : await db.from(table).insert(row).select().single();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
<<<<<<< HEAD
      // Immediately invalidate so all views refresh on next tick
=======
>>>>>>> 4ed5064e0872a8573dbceff1cf59df711efc6f87
      qc.invalidateQueries({ queryKey: ["table", table] });
      qc.invalidateQueries({ queryKey: ["count", table] });
    },
  });
}

export function useRemove(table: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db.from(table).delete().eq("id", id);
      if (error) throw new Error(error.message);
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["table", table] });
      qc.invalidateQueries({ queryKey: ["count", table] });
    },
  });
<<<<<<< HEAD
}
=======
}
>>>>>>> 4ed5064e0872a8573dbceff1cf59df711efc6f87
