export type Database = {
  public: {
    Tables: {
      family_members: {
        Row: {
          id: string;
          name: string;
          password_hash: string;
          avatar_emoji: string;
          default_template: "cover-rating" | "minimal-quote" | "polaroid-photo";
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          password_hash: string;
          avatar_emoji?: string;
          default_template?: "cover-rating" | "minimal-quote" | "polaroid-photo";
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["family_members"]["Insert"]>;
        Relationships: [];
      };
      reading_logs: {
        Row: {
          id: string;
          member_id: string;
          title: string;
          author: string | null;
          publisher: string | null;
          genre: string | null;
          cover_url: string | null;
          photo_url: string | null;
          status: "want" | "reading" | "done";
          rating: number;
          format: "paper" | "ebook" | "audio";
          started_at: string | null;
          finished_at: string | null;
          one_line_review: string | null;
          quote: string | null;
          tags: string[];
          recommend: boolean | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          member_id: string;
          title: string;
          author?: string | null;
          publisher?: string | null;
          genre?: string | null;
          cover_url?: string | null;
          photo_url?: string | null;
          status?: "want" | "reading" | "done";
          rating?: number;
          format?: "paper" | "ebook" | "audio";
          started_at?: string | null;
          finished_at?: string | null;
          one_line_review?: string | null;
          quote?: string | null;
          tags?: string[];
          recommend?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["reading_logs"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "reading_logs_member_id_fkey";
            columns: ["member_id"];
            isOneToOne: false;
            referencedRelation: "family_members";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
