export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      agent_messages: {
        Row: {
          created_at: string
          id: string
          message_type: string
          payload: Json
          receiver: string
          request_id: string | null
          sender: string
        }
        Insert: {
          created_at?: string
          id?: string
          message_type: string
          payload?: Json
          receiver: string
          request_id?: string | null
          sender: string
        }
        Update: {
          created_at?: string
          id?: string
          message_type?: string
          payload?: Json
          receiver?: string
          request_id?: string | null
          sender?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_messages_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
        ]
      }
      agents: {
        Row: {
          current_task: string | null
          description: string | null
          id: string
          key: string
          last_activity: string
          name: string
          status: string
          success_rate: number
          tasks_processed: number
        }
        Insert: {
          current_task?: string | null
          description?: string | null
          id?: string
          key: string
          last_activity?: string
          name: string
          status?: string
          success_rate?: number
          tasks_processed?: number
        }
        Update: {
          current_task?: string | null
          description?: string | null
          id?: string
          key?: string
          last_activity?: string
          name?: string
          status?: string
          success_rate?: number
          tasks_processed?: number
        }
        Relationships: []
      }
      ai_decisions: {
        Row: {
          agent: string
          algorithm: string
          candidates: Json
          created_at: string
          id: string
          reason: string | null
          request_id: string | null
          request_summary: string
          score: number
          selected_resource: string | null
        }
        Insert: {
          agent: string
          algorithm: string
          candidates?: Json
          created_at?: string
          id?: string
          reason?: string | null
          request_id?: string | null
          request_summary: string
          score?: number
          selected_resource?: string | null
        }
        Update: {
          agent?: string
          algorithm?: string
          candidates?: Json
          created_at?: string
          id?: string
          reason?: string | null
          request_id?: string | null
          request_summary?: string
          score?: number
          selected_resource?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_decisions_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
        ]
      }
      batches: {
        Row: {
          created_at: string
          department_id: string | null
          id: string
          name: string
          strength: number
          year: number
        }
        Insert: {
          created_at?: string
          department_id?: string | null
          id?: string
          name: string
          strength?: number
          year?: number
        }
        Update: {
          created_at?: string
          department_id?: string | null
          id?: string
          name?: string
          strength?: number
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "batches_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      buses: {
        Row: {
          bus_number: string
          capacity: number
          created_at: string
          driver_id: string | null
          id: string
          passengers: number
          route_id: string | null
          status: string
        }
        Insert: {
          bus_number: string
          capacity?: number
          created_at?: string
          driver_id?: string | null
          id?: string
          passengers?: number
          route_id?: string | null
          status?: string
        }
        Update: {
          bus_number?: string
          capacity?: number
          created_at?: string
          driver_id?: string | null
          id?: string
          passengers?: number
          route_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "buses_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "buses_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
        ]
      }
      classrooms: {
        Row: {
          building: string
          capacity: number
          code: string
          created_at: string
          floor: number
          has_projector: boolean
          has_smartboard: boolean
          id: string
          name: string
          status: string
          utilization: number
        }
        Insert: {
          building?: string
          capacity?: number
          code: string
          created_at?: string
          floor?: number
          has_projector?: boolean
          has_smartboard?: boolean
          id?: string
          name: string
          status?: string
          utilization?: number
        }
        Update: {
          building?: string
          capacity?: number
          code?: string
          created_at?: string
          floor?: number
          has_projector?: boolean
          has_smartboard?: boolean
          id?: string
          name?: string
          status?: string
          utilization?: number
        }
        Relationships: []
      }
      conflicts: {
        Row: {
          affected: string[]
          ai_analysis: string | null
          cause: string | null
          conflict_type: string
          created_at: string
          id: string
          recommendation: string | null
          severity: string
          status: string
          title: string
        }
        Insert: {
          affected?: string[]
          ai_analysis?: string | null
          cause?: string | null
          conflict_type: string
          created_at?: string
          id?: string
          recommendation?: string | null
          severity?: string
          status?: string
          title: string
        }
        Update: {
          affected?: string[]
          ai_analysis?: string | null
          cause?: string | null
          conflict_type?: string
          created_at?: string
          id?: string
          recommendation?: string | null
          severity?: string
          status?: string
          title?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          category: string
          code: string
          created_at: string
          credits: number
          department_id: string | null
          faculty_id: string | null
          id: string
          name: string
          requires_lab: boolean
          semester: number
        }
        Insert: {
          category?: string
          code: string
          created_at?: string
          credits?: number
          department_id?: string | null
          faculty_id?: string | null
          id?: string
          name: string
          requires_lab?: boolean
          semester?: number
        }
        Update: {
          category?: string
          code?: string
          created_at?: string
          credits?: number
          department_id?: string | null
          faculty_id?: string | null
          id?: string
          name?: string
          requires_lab?: boolean
          semester?: number
        }
        Relationships: [
          {
            foreignKeyName: "courses_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courses_faculty_id_fkey"
            columns: ["faculty_id"]
            isOneToOne: false
            referencedRelation: "faculty"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          building: string | null
          code: string
          created_at: string
          hod: string | null
          id: string
          name: string
        }
        Insert: {
          building?: string | null
          code: string
          created_at?: string
          hod?: string | null
          id?: string
          name: string
        }
        Update: {
          building?: string | null
          code?: string
          created_at?: string
          hod?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      drivers: {
        Row: {
          created_at: string
          experience_years: number
          id: string
          license_no: string | null
          name: string
          phone: string | null
          status: string
        }
        Insert: {
          created_at?: string
          experience_years?: number
          id?: string
          license_no?: string | null
          name: string
          phone?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          experience_years?: number
          id?: string
          license_no?: string | null
          name?: string
          phone?: string | null
          status?: string
        }
        Relationships: []
      }
      faculty: {
        Row: {
          created_at: string
          department_id: string | null
          designation: string | null
          email: string | null
          employee_code: string | null
          id: string
          max_hours: number
          name: string
          specialization: string | null
          workload: number
        }
        Insert: {
          created_at?: string
          department_id?: string | null
          designation?: string | null
          email?: string | null
          employee_code?: string | null
          id?: string
          max_hours?: number
          name: string
          specialization?: string | null
          workload?: number
        }
        Update: {
          created_at?: string
          department_id?: string | null
          designation?: string | null
          email?: string | null
          employee_code?: string | null
          id?: string
          max_hours?: number
          name?: string
          specialization?: string | null
          workload?: number
        }
        Relationships: [
          {
            foreignKeyName: "faculty_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_entities: {
        Row: {
          entity_type: string
          id: string
          label: string
          properties: Json
        }
        Insert: {
          entity_type: string
          id?: string
          label: string
          properties?: Json
        }
        Update: {
          entity_type?: string
          id?: string
          label?: string
          properties?: Json
        }
        Relationships: []
      }
      knowledge_relationships: {
        Row: {
          from_entity: string | null
          id: string
          relationship: string
          to_entity: string | null
        }
        Insert: {
          from_entity?: string | null
          id?: string
          relationship: string
          to_entity?: string | null
        }
        Update: {
          from_entity?: string | null
          id?: string
          relationship?: string
          to_entity?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_relationships_from_entity_fkey"
            columns: ["from_entity"]
            isOneToOne: false
            referencedRelation: "knowledge_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_relationships_to_entity_fkey"
            columns: ["to_entity"]
            isOneToOne: false
            referencedRelation: "knowledge_entities"
            referencedColumns: ["id"]
          },
        ]
      }
      laboratories: {
        Row: {
          building: string
          capacity: number
          code: string
          computers: number
          created_at: string
          distance_from_gate: number
          equipment: string[]
          id: string
          lab_type: string
          name: string
          status: string
          utilization: number
        }
        Insert: {
          building?: string
          capacity?: number
          code: string
          computers?: number
          created_at?: string
          distance_from_gate?: number
          equipment?: string[]
          id?: string
          lab_type?: string
          name: string
          status?: string
          utilization?: number
        }
        Update: {
          building?: string
          capacity?: number
          code?: string
          computers?: number
          created_at?: string
          distance_from_gate?: number
          equipment?: string[]
          id?: string
          lab_type?: string
          name?: string
          status?: string
          utilization?: number
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          category: string
          created_at: string
          id: string
          read: boolean
          title: string
          user_id: string | null
        }
        Insert: {
          body?: string | null
          category?: string
          created_at?: string
          id?: string
          read?: boolean
          title: string
          user_id?: string | null
        }
        Update: {
          body?: string | null
          category?: string
          created_at?: string
          id?: string
          read?: boolean
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      requests: {
        Row: {
          allocated_resource: string | null
          capacity: number
          created_at: string
          end_time: string
          equipment: string | null
          id: string
          notes: string | null
          request_type: string
          requested_date: string
          requester_name: string | null
          requester_role: string
          score: number | null
          start_time: string
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          allocated_resource?: string | null
          capacity?: number
          created_at?: string
          end_time?: string
          equipment?: string | null
          id?: string
          notes?: string | null
          request_type: string
          requested_date?: string
          requester_name?: string | null
          requester_role?: string
          score?: number | null
          start_time?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          allocated_resource?: string | null
          capacity?: number
          created_at?: string
          end_time?: string
          equipment?: string | null
          id?: string
          notes?: string | null
          request_type?: string
          requested_date?: string
          requester_name?: string | null
          requester_role?: string
          score?: number | null
          start_time?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      resources: {
        Row: {
          available: number
          created_at: string
          id: string
          location: string | null
          name: string
          quantity: number
          resource_type: string
          status: string
          utilization: number
        }
        Insert: {
          available?: number
          created_at?: string
          id?: string
          location?: string | null
          name: string
          quantity?: number
          resource_type: string
          status?: string
          utilization?: number
        }
        Update: {
          available?: number
          created_at?: string
          id?: string
          location?: string | null
          name?: string
          quantity?: number
          resource_type?: string
          status?: string
          utilization?: number
        }
        Relationships: []
      }
      route_stops: {
        Row: {
          arrival_time: string | null
          id: string
          route_id: string | null
          stop_name: string
          stop_order: number
        }
        Insert: {
          arrival_time?: string | null
          id?: string
          route_id?: string | null
          stop_name: string
          stop_order: number
        }
        Update: {
          arrival_time?: string | null
          id?: string
          route_id?: string | null
          stop_name?: string
          stop_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "route_stops_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
        ]
      }
      routes: {
        Row: {
          code: string
          created_at: string
          distance_km: number
          duration_min: number
          id: string
          name: string
          status: string
          utilization: number
        }
        Insert: {
          code: string
          created_at?: string
          distance_km?: number
          duration_min?: number
          id?: string
          name: string
          status?: string
          utilization?: number
        }
        Update: {
          code?: string
          created_at?: string
          distance_km?: number
          duration_min?: number
          id?: string
          name?: string
          status?: string
          utilization?: number
        }
        Relationships: []
      }
      rules: {
        Row: {
          active: boolean
          conclusion: string
          conditions: string[]
          id: string
          name: string
          rule_type: string
          weight: number
        }
        Insert: {
          active?: boolean
          conclusion: string
          conditions?: string[]
          id?: string
          name: string
          rule_type?: string
          weight?: number
        }
        Update: {
          active?: boolean
          conclusion?: string
          conditions?: string[]
          id?: string
          name?: string
          rule_type?: string
          weight?: number
        }
        Relationships: []
      }
      students: {
        Row: {
          attendance: number
          batch_id: string | null
          created_at: string
          department_id: string | null
          email: string | null
          id: string
          name: string
          roll_no: string | null
          semester: number
        }
        Insert: {
          attendance?: number
          batch_id?: string | null
          created_at?: string
          department_id?: string | null
          email?: string | null
          id?: string
          name: string
          roll_no?: string | null
          semester?: number
        }
        Update: {
          attendance?: number
          batch_id?: string | null
          created_at?: string
          department_id?: string | null
          email?: string | null
          id?: string
          name?: string
          roll_no?: string | null
          semester?: number
        }
        Relationships: [
          {
            foreignKeyName: "students_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      time_slots: {
        Row: {
          end_time: string
          id: string
          label: string
          slot_order: number
          start_time: string
        }
        Insert: {
          end_time: string
          id?: string
          label: string
          slot_order: number
          start_time: string
        }
        Update: {
          end_time?: string
          id?: string
          label?: string
          slot_order?: number
          start_time?: string
        }
        Relationships: []
      }
      timetable_entries: {
        Row: {
          batch_id: string | null
          classroom_id: string | null
          course_id: string | null
          created_at: string
          day_of_week: string
          faculty_id: string | null
          id: string
          laboratory_id: string | null
          time_slot_id: string | null
        }
        Insert: {
          batch_id?: string | null
          classroom_id?: string | null
          course_id?: string | null
          created_at?: string
          day_of_week: string
          faculty_id?: string | null
          id?: string
          laboratory_id?: string | null
          time_slot_id?: string | null
        }
        Update: {
          batch_id?: string | null
          classroom_id?: string | null
          course_id?: string | null
          created_at?: string
          day_of_week?: string
          faculty_id?: string | null
          id?: string
          laboratory_id?: string | null
          time_slot_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "timetable_entries_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timetable_entries_classroom_id_fkey"
            columns: ["classroom_id"]
            isOneToOne: false
            referencedRelation: "classrooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timetable_entries_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timetable_entries_faculty_id_fkey"
            columns: ["faculty_id"]
            isOneToOne: false
            referencedRelation: "faculty"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timetable_entries_laboratory_id_fkey"
            columns: ["laboratory_id"]
            isOneToOne: false
            referencedRelation: "laboratories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timetable_entries_time_slot_id_fkey"
            columns: ["time_slot_id"]
            isOneToOne: false
            referencedRelation: "time_slots"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "faculty" | "student"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "faculty", "student"],
    },
  },
} as const
