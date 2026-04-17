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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      about_highlights: {
        Row: {
          created_at: string
          display_order: number
          icon: string
          id: string
          label: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          icon?: string
          id?: string
          label: string
        }
        Update: {
          created_at?: string
          display_order?: number
          icon?: string
          id?: string
          label?: string
        }
        Relationships: []
      }
      before_after_items: {
        Row: {
          after_image_url: string
          before_image_url: string
          created_at: string
          display_order: number
          id: string
          title: string
        }
        Insert: {
          after_image_url: string
          before_image_url: string
          created_at?: string
          display_order?: number
          id?: string
          title?: string
        }
        Update: {
          after_image_url?: string
          before_image_url?: string
          created_at?: string
          display_order?: number
          id?: string
          title?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          admin_notes: string | null
          alternative_slots: string[] | null
          created_at: string
          date: string | null
          email: string | null
          id: string
          message: string | null
          name: string
          pending_email_sent_at: string | null
          phone: string
          service: string
          status: string
          status_email_sent_at: string | null
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          alternative_slots?: string[] | null
          created_at?: string
          date?: string | null
          email?: string | null
          id?: string
          message?: string | null
          name: string
          pending_email_sent_at?: string | null
          phone: string
          service: string
          status?: string
          status_email_sent_at?: string | null
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          alternative_slots?: string[] | null
          created_at?: string
          date?: string | null
          email?: string | null
          id?: string
          message?: string | null
          name?: string
          pending_email_sent_at?: string | null
          phone?: string
          service?: string
          status?: string
          status_email_sent_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      contact_info: {
        Row: {
          icon: string
          id: string
          key: string
          link: string | null
          updated_at: string
          value: string
        }
        Insert: {
          icon?: string
          id?: string
          key: string
          link?: string | null
          updated_at?: string
          value: string
        }
        Update: {
          icon?: string
          id?: string
          key?: string
          link?: string | null
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      instagram_posts: {
        Row: {
          caption: string
          comments: number
          created_at: string
          display_order: number
          embed_url: string | null
          id: string
          image_url: string | null
          likes: number
          link: string
        }
        Insert: {
          caption?: string
          comments?: number
          created_at?: string
          display_order?: number
          embed_url?: string | null
          id?: string
          image_url?: string | null
          likes?: number
          link?: string
        }
        Update: {
          caption?: string
          comments?: number
          created_at?: string
          display_order?: number
          embed_url?: string | null
          id?: string
          image_url?: string | null
          likes?: number
          link?: string
        }
        Relationships: []
      }
      portfolio_items: {
        Row: {
          category: string
          created_at: string
          display_order: number
          id: string
          image_url: string
          title: string
        }
        Insert: {
          category?: string
          created_at?: string
          display_order?: number
          id?: string
          image_url: string
          title?: string
        }
        Update: {
          category?: string
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string
          title?: string
        }
        Relationships: []
      }
      site_content: {
        Row: {
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
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
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
