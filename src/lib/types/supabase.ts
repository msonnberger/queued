export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
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
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
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
      auth_key: {
        Row: {
          expires: number | null
          hashed_password: string | null
          id: string
          primary_key: boolean
          user_id: string
        }
        Insert: {
          expires?: number | null
          hashed_password?: string | null
          id: string
          primary_key: boolean
          user_id: string
        }
        Update: {
          expires?: number | null
          hashed_password?: string | null
          id?: string
          primary_key?: boolean
          user_id?: string
        }
      }
      auth_session: {
        Row: {
          active_expires: number
          id: string
          idle_expires: number
          user_id: string
        }
        Insert: {
          active_expires: number
          id: string
          idle_expires: number
          user_id: string
        }
        Update: {
          active_expires?: number
          id?: string
          idle_expires?: number
          user_id?: string
        }
      }
      auth_user: {
        Row: {
          id: string
          name: string | null
        }
        Insert: {
          id: string
          name?: string | null
        }
        Update: {
          id?: string
          name?: string | null
        }
      }
      queues: {
        Row: {
          created_at: string
          current_track_uri: string | null
          id: string
          name: string
          owner_id: string | null
        }
        Insert: {
          created_at?: string
          current_track_uri?: string | null
          id: string
          name: string
          owner_id?: string | null
        }
        Update: {
          created_at?: string
          current_track_uri?: string | null
          id?: string
          name?: string
          owner_id?: string | null
        }
      }
      spotify_tokens: {
        Row: {
          refresh_token: string
          user_id: string
        }
        Insert: {
          refresh_token: string
          user_id: string
        }
        Update: {
          refresh_token?: string
          user_id?: string
        }
      }
      tracks: {
        Row: {
          created_at: string | null
          id: number
          qid: string
          spotify_uri: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          qid: string
          spotify_uri: string
        }
        Update: {
          created_at?: string | null
          id?: number
          qid?: string
          spotify_uri?: string
        }
      }
      votes: {
        Row: {
          created_at: string | null
          id: number
          track_id: number
          value: number
          voter_id: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          track_id: number
          value: number
          voter_id: string
        }
        Update: {
          created_at?: string | null
          id?: number
          track_id?: number
          value?: number
          voter_id?: string
        }
      }
      waitlist: {
        Row: {
          email: string
          id: number
        }
        Insert: {
          email: string
          id?: number
        }
        Update: {
          email?: string
          id?: number
        }
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
  storage: {
    Tables: {
      buckets: {
        Row: {
          created_at: string | null
          id: string
          name: string
          owner: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          name: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          path_tokens: string[] | null
          updated_at: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: unknown
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
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
