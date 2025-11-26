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
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      code_reviews: {
        Row: {
          created_at: string
          critical_issues: number | null
          file_name: string
          grade: string | null
          high_issues: number | null
          id: number
          language: string | null
          low_issues: number | null
          medium_issues: number | null
          model: string | null
          overall_score: number | null
          owner: string
          report_md: string | null
          security_score: number | null
          source_preview: string | null
          status: string
          structured_data: Json | null
          tokens: number | null
          total_issues: number | null
        }
        Insert: {
          created_at?: string
          critical_issues?: number | null
          file_name: string
          grade?: string | null
          high_issues?: number | null
          id?: number
          language?: string | null
          low_issues?: number | null
          medium_issues?: number | null
          model?: string | null
          overall_score?: number | null
          owner: string
          report_md?: string | null
          security_score?: number | null
          source_preview?: string | null
          status?: string
          structured_data?: Json | null
          tokens?: number | null
          total_issues?: number | null
        }
        Update: {
          created_at?: string
          critical_issues?: number | null
          file_name?: string
          grade?: string | null
          high_issues?: number | null
          id?: number
          language?: string | null
          low_issues?: number | null
          medium_issues?: number | null
          model?: string | null
          overall_score?: number | null
          owner?: string
          report_md?: string | null
          security_score?: number | null
          source_preview?: string | null
          status?: string
          structured_data?: Json | null
          tokens?: number | null
          total_issues?: number | null
        }
        Relationships: []
      }
      file_reviews: {
        Row: {
          content_hash: string
          created_at: string
          file_size: number | null
          filename: string
          grade: string | null
          id: number
          language: string | null
          model: string | null
          overall_score: number | null
          review_data: Json | null
          tokens_used: number | null
          total_issues: number | null
        }
        Insert: {
          content_hash: string
          created_at?: string
          file_size?: number | null
          filename: string
          grade?: string | null
          id?: number
          language?: string | null
          model?: string | null
          overall_score?: number | null
          review_data?: Json | null
          tokens_used?: number | null
          total_issues?: number | null
        }
        Update: {
          content_hash?: string
          created_at?: string
          file_size?: number | null
          filename?: string
          grade?: string | null
          id?: number
          language?: string | null
          model?: string | null
          overall_score?: number | null
          review_data?: Json | null
          tokens_used?: number | null
          total_issues?: number | null
        }
        Relationships: []
      }
      github_connections: {
        Row: {
          access_token: string
          connected_at: string
          created_at: string
          github_avatar_url: string | null
          github_email: string | null
          github_user_id: number
          github_username: string
          id: number
          scope: string | null
          token_type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token: string
          connected_at?: string
          created_at?: string
          github_avatar_url?: string | null
          github_email?: string | null
          github_user_id: number
          github_username: string
          id?: number
          scope?: string | null
          token_type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string
          connected_at?: string
          created_at?: string
          github_avatar_url?: string | null
          github_email?: string | null
          github_user_id?: number
          github_username?: string
          id?: number
          scope?: string | null
          token_type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      github_repositories: {
        Row: {
          architecture_score: number | null
          auto_review_enabled: boolean | null
          created_at: string
          default_branch: string | null
          github_repo_id: number
          id: number
          is_private: boolean | null
          language: string | null
          last_synced_at: string | null
          owner_login: string
          repo_full_name: string
          repo_name: string
          security_score: number | null
          tech_debt_score: number | null
          updated_at: string
          user_id: string
          webhook_id: number | null
          webhook_secret: string | null
        }
        Insert: {
          architecture_score?: number | null
          auto_review_enabled?: boolean | null
          created_at?: string
          default_branch?: string | null
          github_repo_id: number
          id?: number
          is_private?: boolean | null
          language?: string | null
          last_synced_at?: string | null
          owner_login: string
          repo_full_name: string
          repo_name: string
          security_score?: number | null
          tech_debt_score?: number | null
          updated_at?: string
          user_id: string
          webhook_id?: number | null
          webhook_secret?: string | null
        }
        Update: {
          architecture_score?: number | null
          auto_review_enabled?: boolean | null
          created_at?: string
          default_branch?: string | null
          github_repo_id?: number
          id?: number
          is_private?: boolean | null
          language?: string | null
          last_synced_at?: string | null
          owner_login?: string
          repo_full_name?: string
          repo_name?: string
          security_score?: number | null
          tech_debt_score?: number | null
          updated_at?: string
          user_id?: string
          webhook_id?: number | null
          webhook_secret?: string | null
        }
        Relationships: []
      }
      pr_reviews: {
        Row: {
          base_sha: string | null
          created_at: string
          critical_issues: number | null
          grade: string | null
          head_sha: string
          high_issues: number | null
          id: number
          low_issues: number | null
          medium_issues: number | null
          model: string | null
          overall_score: number | null
          pr_number: number
          pr_title: string | null
          repo_full_name: string
          review_data: Json | null
          review_duration_ms: number | null
          risk_level: string | null
          tokens_used: number | null
          total_issues: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          base_sha?: string | null
          created_at?: string
          critical_issues?: number | null
          grade?: string | null
          head_sha: string
          high_issues?: number | null
          id?: number
          low_issues?: number | null
          medium_issues?: number | null
          model?: string | null
          overall_score?: number | null
          pr_number: number
          pr_title?: string | null
          repo_full_name: string
          review_data?: Json | null
          review_duration_ms?: number | null
          risk_level?: string | null
          tokens_used?: number | null
          total_issues?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          base_sha?: string | null
          created_at?: string
          critical_issues?: number | null
          grade?: string | null
          head_sha?: string
          high_issues?: number | null
          id?: number
          low_issues?: number | null
          medium_issues?: number | null
          model?: string | null
          overall_score?: number | null
          pr_number?: number
          pr_title?: string | null
          repo_full_name?: string
          review_data?: Json | null
          review_duration_ms?: number | null
          risk_level?: string | null
          tokens_used?: number | null
          total_issues?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_usage: {
        Row: {
          code_reviews_count: number | null
          date: string
          id: number
          pr_reviews_count: number | null
          tokens_used: number | null
          user_id: string
        }
        Insert: {
          code_reviews_count?: number | null
          date?: string
          id?: number
          pr_reviews_count?: number | null
          tokens_used?: number | null
          user_id: string
        }
        Update: {
          code_reviews_count?: number | null
          date?: string
          id?: number
          pr_reviews_count?: number | null
          tokens_used?: number | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_rate_limit: {
        Args: {
          p_daily_limit?: number
          p_limit_type?: string
          p_user_id: string
        }
        Returns: boolean
      }
      increment_usage: {
        Args: {
          p_code_reviews?: number
          p_pr_reviews?: number
          p_tokens?: number
          p_user_id: string
        }
        Returns: undefined
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

// Custom types for AI code review
export type IssueSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info'
export type IssueCategory = 'bug' | 'security' | 'performance' | 'maintainability' | 'style' | 'best-practice'
export type ReviewGrade = 'A+' | 'A' | 'B' | 'C' | 'D' | 'F'

// Notification types
export type NotificationType = 'info' | 'success' | 'warning' | 'error'

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: NotificationType
  read: boolean
  dismissed: boolean
  link: string | null
  created_at: string
  updated_at: string
}

export interface ReviewIssue {
  id: string
  severity: IssueSeverity
  category: IssueCategory
  title: string
  description: string
  lineNumber: number | null
  codeSnippet: string | null
  suggestion: string
  impact: string
}

export interface ReviewMetrics {
  complexity: number
  maintainability: number
  readability: number
  testability: number
  security: number
}

export interface ReviewSummary {
  overallScore: number
  grade: ReviewGrade
  totalIssues: number
  criticalCount: number
  highCount: number
  mediumCount: number
  lowCount: number
}

export interface StructuredReview {
  summary: ReviewSummary
  issues: ReviewIssue[]
  metrics: ReviewMetrics
  strengths: string[]
  recommendations: string[]
}
