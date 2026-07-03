export type PlantCategory = 'houseplant' | 'cutting' | 'vegetable';
export type PlantSource = 'manual' | 'scan';

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  free_scans_used: number;
  free_scans_limit: number;
  is_premium: boolean;
  premium_expires_at: string | null;
  referral_code: string;
  referred_by: string | null;
  referral_credit_days: number;
  created_at: string;
  updated_at: string;
};

export type Plant = {
  id: string;
  user_id: string;
  nickname: string;
  species_name: string | null;
  species_common_name: string | null;
  category: PlantCategory;
  key_facts: Record<string, unknown>;
  current_health_score: number | null;
  current_health_status: string | null;
  cover_image_url: string | null;
  added_via: PlantSource;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
        };
        Update: {
          full_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      plants: {
        Row: Plant;
        Insert: {
          user_id: string;
          nickname: string;
          species_name?: string | null;
          species_common_name?: string | null;
          category?: PlantCategory;
          cover_image_url?: string | null;
          added_via?: PlantSource;
        };
        Update: Partial<Plant>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      plant_category: PlantCategory;
      plant_source: PlantSource;
    };
    CompositeTypes: Record<string, never>;
  };
};
