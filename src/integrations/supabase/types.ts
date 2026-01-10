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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      articles: {
        Row: {
          affiliate_enabled: boolean | null
          affiliate_id: string | null
          amazon_product_data: Json | null
          article_type: string
          configuration: Json | null
          content: string
          created_at: string
          exit_intent_config: Json | null
          featured_image_alt: string | null
          featured_image_url: string | null
          html_content: string | null
          id: string
          image_metadata: Json | null
          last_edited: string | null
          markdown_content: string | null
          product_url: string | null
          schema_markup: Json | null
          seo_score: Json | null
          title: string
          updated_at: string
          user_id: string
          word_count: number | null
        }
        Insert: {
          affiliate_enabled?: boolean | null
          affiliate_id?: string | null
          amazon_product_data?: Json | null
          article_type?: string
          configuration?: Json | null
          content: string
          created_at?: string
          exit_intent_config?: Json | null
          featured_image_alt?: string | null
          featured_image_url?: string | null
          html_content?: string | null
          id?: string
          image_metadata?: Json | null
          last_edited?: string | null
          markdown_content?: string | null
          product_url?: string | null
          schema_markup?: Json | null
          seo_score?: Json | null
          title: string
          updated_at?: string
          user_id: string
          word_count?: number | null
        }
        Update: {
          affiliate_enabled?: boolean | null
          affiliate_id?: string | null
          amazon_product_data?: Json | null
          article_type?: string
          configuration?: Json | null
          content?: string
          created_at?: string
          exit_intent_config?: Json | null
          featured_image_alt?: string | null
          featured_image_url?: string | null
          html_content?: string | null
          id?: string
          image_metadata?: Json | null
          last_edited?: string | null
          markdown_content?: string | null
          product_url?: string | null
          schema_markup?: Json | null
          seo_score?: Json | null
          title?: string
          updated_at?: string
          user_id?: string
          word_count?: number | null
        }
        Relationships: []
      }
      content_library: {
        Row: {
          alt_text: string | null
          created_at: string | null
          file_name: string
          file_size: number | null
          file_type: string
          file_url: string
          height: number | null
          id: string
          seo_filename: string | null
          storage_path: string
          tags: string[] | null
          updated_at: string | null
          user_id: string
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string | null
          file_name: string
          file_size?: number | null
          file_type: string
          file_url: string
          height?: number | null
          id?: string
          seo_filename?: string | null
          storage_path: string
          tags?: string[] | null
          updated_at?: string | null
          user_id: string
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string | null
          file_name?: string
          file_size?: number | null
          file_type?: string
          file_url?: string
          height?: number | null
          id?: string
          seo_filename?: string | null
          storage_path?: string
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string
          width?: number | null
        }
        Relationships: []
      }
      email_subscribers: {
        Row: {
          email: string
          id: string
          is_active: boolean
          metadata: Json | null
          source: string
          subscribed_at: string
          unsubscribed_at: string | null
        }
        Insert: {
          email: string
          id?: string
          is_active?: boolean
          metadata?: Json | null
          source?: string
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Update: {
          email?: string
          id?: string
          is_active?: boolean
          metadata?: Json | null
          source?: string
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      generated_images: {
        Row: {
          alt_text: string | null
          article_id: string | null
          caption: string | null
          created_at: string | null
          format: string | null
          height: number | null
          id: string
          image_url: string
          optimized: boolean | null
          position: number | null
          storage_path: string
          user_id: string
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          article_id?: string | null
          caption?: string | null
          created_at?: string | null
          format?: string | null
          height?: number | null
          id?: string
          image_url: string
          optimized?: boolean | null
          position?: number | null
          storage_path: string
          user_id: string
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          article_id?: string | null
          caption?: string | null
          created_at?: string | null
          format?: string | null
          height?: number | null
          id?: string
          image_url?: string
          optimized?: boolean | null
          position?: number | null
          storage_path?: string
          user_id?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "generated_images_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      popup_config: {
        Row: {
          created_at: string | null
          cta_text: string | null
          cta_url: string | null
          description: string | null
          display_once: boolean | null
          enabled: boolean | null
          id: string
          title: string | null
          trigger_delay: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          cta_text?: string | null
          cta_url?: string | null
          description?: string | null
          display_once?: boolean | null
          enabled?: boolean | null
          id?: string
          title?: string | null
          trigger_delay?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          cta_text?: string | null
          cta_url?: string | null
          description?: string | null
          display_once?: boolean | null
          enabled?: boolean | null
          id?: string
          title?: string | null
          trigger_delay?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          articles_created_this_month: number | null
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          subscription_tier: string | null
          updated_at: string | null
          usage_reset_date: string | null
        }
        Insert: {
          articles_created_this_month?: number | null
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          subscription_tier?: string | null
          updated_at?: string | null
          usage_reset_date?: string | null
        }
        Update: {
          articles_created_this_month?: number | null
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          subscription_tier?: string | null
          updated_at?: string | null
          usage_reset_date?: string | null
        }
        Relationships: []
      }
      seo_suggestions: {
        Row: {
          article_type: string | null
          created_at: string | null
          id: string
          meta_description: string | null
          primary_keyword: string | null
          secondary_keywords: string[] | null
          suggested_titles: Json | null
          topic: string
          user_id: string
        }
        Insert: {
          article_type?: string | null
          created_at?: string | null
          id?: string
          meta_description?: string | null
          primary_keyword?: string | null
          secondary_keywords?: string[] | null
          suggested_titles?: Json | null
          topic: string
          user_id: string
        }
        Update: {
          article_type?: string | null
          created_at?: string | null
          id?: string
          meta_description?: string | null
          primary_keyword?: string | null
          secondary_keywords?: string[] | null
          suggested_titles?: Json | null
          topic?: string
          user_id?: string
        }
        Relationships: []
      }
      social_notifications: {
        Row: {
          action: string
          created_at: string | null
          enabled: boolean | null
          icon: string | null
          id: string
          location: string
          name: string
        }
        Insert: {
          action: string
          created_at?: string | null
          enabled?: boolean | null
          icon?: string | null
          id?: string
          location: string
          name: string
        }
        Update: {
          action?: string
          created_at?: string | null
          enabled?: boolean | null
          icon?: string | null
          id?: string
          location?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
