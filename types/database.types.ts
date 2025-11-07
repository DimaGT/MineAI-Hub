export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database['public']['Tables'] & Database['public']['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database['public']['Tables'] &
      Database['public']['Views'])
  ? (Database['public']['Tables'] & Database['public']['Views'])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export interface Database {
  public: {
    Tables: {
      simulations: {
        Row: {
          id: string;
          user_id: string;
          input_data: Json;
          ai_result: Json;
          created_at: string;
          is_public: boolean | null;
          title: string | null;
          tags: string[] | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          input_data: Json;
          ai_result: Json;
          created_at?: string;
          is_public?: boolean;
          title?: string | null;
          tags?: string[] | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          input_data?: Json;
          ai_result?: Json;
          created_at?: string;
          is_public?: boolean;
          title?: string | null;
          tags?: string[] | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
