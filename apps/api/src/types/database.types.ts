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
      comment_like: {
        Row: {
          comment_id: string
          created_at: string
          user_id: string
        }
        Insert: {
          comment_id: string
          created_at?: string
          user_id: string
        }
        Update: {
          comment_id?: string
          created_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_like_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "post_comment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_like_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
        ]
      }
      follow: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follow_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follow_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
        ]
      }
      genre: {
        Row: {
          apple_genre_id: string | null
          apple_parent_genre_id: string | null
          badge_color: string | null
          color_status: string
          created_at: string
          depth: number
          id: string
          name: string
          needs_review: boolean
          parent_genre_id: string | null
          root_genre_id: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          apple_genre_id?: string | null
          apple_parent_genre_id?: string | null
          badge_color?: string | null
          color_status?: string
          created_at?: string
          depth?: number
          id?: string
          name: string
          needs_review?: boolean
          parent_genre_id?: string | null
          root_genre_id?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          apple_genre_id?: string | null
          apple_parent_genre_id?: string | null
          badge_color?: string | null
          color_status?: string
          created_at?: string
          depth?: number
          id?: string
          name?: string
          needs_review?: boolean
          parent_genre_id?: string | null
          root_genre_id?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "genre_parent_genre_id_fkey"
            columns: ["parent_genre_id"]
            isOneToOne: false
            referencedRelation: "genre"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "genre_root_genre_id_fkey"
            columns: ["root_genre_id"]
            isOneToOne: false
            referencedRelation: "genre"
            referencedColumns: ["id"]
          },
        ]
      }
      post: {
        Row: {
          caption: string | null
          comment_count: number
          created_at: string
          id: string
          like_count: number
          track_id: string
          updated_at: string
          user_id: string
          visibility: string
        }
        Insert: {
          caption?: string | null
          comment_count?: number
          created_at?: string
          id?: string
          like_count?: number
          track_id: string
          updated_at?: string
          user_id: string
          visibility?: string
        }
        Update: {
          caption?: string | null
          comment_count?: number
          created_at?: string
          id?: string
          like_count?: number
          track_id?: string
          updated_at?: string
          user_id?: string
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "track"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
        ]
      }
      post_comment: {
        Row: {
          body: string
          created_at: string
          id: string
          like_count: number
          post_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          like_count?: number
          post_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          like_count?: number
          post_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comment_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "post"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comment_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
        ]
      }
      post_like: {
        Row: {
          created_at: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_like_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "post"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_like_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
        ]
      }
      profile: {
        Row: {
          bio: string | null
          created_at: string
          display_name: string | null
          follower_count: number
          following_count: number
          handle: string
          id: string
          is_private: boolean
          pfp_url: string | null
          post_count: number
          updated_at: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          display_name?: string | null
          follower_count?: number
          following_count?: number
          handle: string
          id: string
          is_private?: boolean
          pfp_url?: string | null
          post_count?: number
          updated_at?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          display_name?: string | null
          follower_count?: number
          following_count?: number
          handle?: string
          id?: string
          is_private?: boolean
          pfp_url?: string | null
          post_count?: number
          updated_at?: string
        }
        Relationships: []
      }
      track: {
        Row: {
          album: string | null
          apple_bg_color: string | null
          apple_music_track_id: string | null
          apple_music_url: string | null
          apple_text_color_1: string | null
          apple_text_color_2: string | null
          apple_text_color_3: string | null
          apple_text_color_4: string | null
          artist_name: string
          artist_names: string[] | null
          cover_color_dark_contrast: string | null
          cover_color_dark_vibrant: string | null
          cover_color_vibrant: string | null
          cover_url: string | null
          created_at: string
          duration_ms: number | null
          id: string
          isrc: string | null
          release_date: string | null
          song_preview_url: string | null
          spotify_track_id: string | null
          spotify_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          album?: string | null
          apple_bg_color?: string | null
          apple_music_track_id?: string | null
          apple_music_url?: string | null
          apple_text_color_1?: string | null
          apple_text_color_2?: string | null
          apple_text_color_3?: string | null
          apple_text_color_4?: string | null
          artist_name: string
          artist_names?: string[] | null
          cover_color_dark_contrast?: string | null
          cover_color_dark_vibrant?: string | null
          cover_color_vibrant?: string | null
          cover_url?: string | null
          created_at?: string
          duration_ms?: number | null
          id?: string
          isrc?: string | null
          release_date?: string | null
          song_preview_url?: string | null
          spotify_track_id?: string | null
          spotify_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          album?: string | null
          apple_bg_color?: string | null
          apple_music_track_id?: string | null
          apple_music_url?: string | null
          apple_text_color_1?: string | null
          apple_text_color_2?: string | null
          apple_text_color_3?: string | null
          apple_text_color_4?: string | null
          artist_name?: string
          artist_names?: string[] | null
          cover_color_dark_contrast?: string | null
          cover_color_dark_vibrant?: string | null
          cover_color_vibrant?: string | null
          cover_url?: string | null
          created_at?: string
          duration_ms?: number | null
          id?: string
          isrc?: string | null
          release_date?: string | null
          song_preview_url?: string | null
          spotify_track_id?: string | null
          spotify_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      track_genre: {
        Row: {
          created_at: string
          genre_id: string
          track_id: string
        }
        Insert: {
          created_at?: string
          genre_id: string
          track_id: string
        }
        Update: {
          created_at?: string
          genre_id?: string
          track_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "track_genre_genre_id_fkey"
            columns: ["genre_id"]
            isOneToOne: false
            referencedRelation: "genre"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "track_genre_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "track"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_top_genres: {
        Args: { result_limit?: number; target_user_id: string }
        Returns: {
          badge_color: string
          id: string
          name: string
          post_count: number
          slug: string
        }[]
      }
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
