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
          feedback_requested_at: string | null
          id: string
          message: string | null
          name: string
          pending_email_sent_at: string | null
          phone: string
          service: string
          status: string
          status_email_sent_at: string | null
          tracking_token: string
          updated_at: string
          whatsapp_pending_sent_at: string | null
          whatsapp_status_sent_at: string | null
        }
        Insert: {
          admin_notes?: string | null
          alternative_slots?: string[] | null
          created_at?: string
          date?: string | null
          email?: string | null
          feedback_requested_at?: string | null
          id?: string
          message?: string | null
          name: string
          pending_email_sent_at?: string | null
          phone: string
          service: string
          status?: string
          status_email_sent_at?: string | null
          tracking_token?: string
          updated_at?: string
          whatsapp_pending_sent_at?: string | null
          whatsapp_status_sent_at?: string | null
        }
        Update: {
          admin_notes?: string | null
          alternative_slots?: string[] | null
          created_at?: string
          date?: string | null
          email?: string | null
          feedback_requested_at?: string | null
          id?: string
          message?: string | null
          name?: string
          pending_email_sent_at?: string | null
          phone?: string
          service?: string
          status?: string
          status_email_sent_at?: string | null
          tracking_token?: string
          updated_at?: string
          whatsapp_pending_sent_at?: string | null
          whatsapp_status_sent_at?: string | null
        }
        Relationships: []
      }
      brands: {
        Row: {
          created_at: string
          display_order: number
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          name?: string
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
      services: {
        Row: {
          created_at: string
          description: string
          display_order: number
          duration: string
          icon: string
          id: string
          price: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string
          display_order?: number
          duration?: string
          icon?: string
          id?: string
          price?: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          display_order?: number
          duration?: string
          icon?: string
          id?: string
          price?: string
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
      testimonials: {
        Row: {
          approved: boolean
          booking_id: string | null
          comment: string
          created_at: string
          customer_name: string
          display_order: number
          id: string
          image_url: string | null
          rating: number
          service: string | null
          updated_at: string
        }
        Insert: {
          approved?: boolean
          booking_id?: string | null
          comment?: string
          created_at?: string
          customer_name: string
          display_order?: number
          id?: string
          image_url?: string | null
          rating: number
          service?: string | null
          updated_at?: string
        }
        Update: {
          approved?: boolean
          booking_id?: string | null
          comment?: string
          created_at?: string
          customer_name?: string
          display_order?: number
          id?: string
          image_url?: string | null
          rating?: number
          service?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
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
      get_booking_by_token: {
        Args: { _token: string }
        Returns: {
          admin_notes: string
          alternative_slots: string[]
          created_at: string
          date: string
          id: string
          name: string
          service: string
          status: string
          updated_at: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      lookup_booking: {
        Args: { _code: string; _phone: string }
        Returns: {
          admin_notes: string
          alternative_slots: string[]
          created_at: string
          date: string
          id: string
          name: string
          service: string
          status: string
          tracking_token: string
        }[]
      }
      submit_feedback: {
        Args: { _comment: string; _rating: number; _token: string }
        Returns: string
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
