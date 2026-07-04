export type PlantCategory = 'houseplant' | 'cutting' | 'vegetable';
export type PlantSource = 'manual' | 'scan';
export type ScanType = 'identification' | 'health_check' | 'propagation';
export type LogType =
  | 'status_update'
  | 'watering'
  | 'misting'
  | 'repotting'
  | 'fertilizing'
  | 'note';

export type PlantCareFacts = {
  light?: string;
  water?: string;
  soil?: string;
  potting?: string;
  feeding?: string;
  temperature?: string;
};

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
  total_xp: number;
  level: number;
  current_streak_days: number;
  longest_streak_days: number;
  last_active_date: string | null;
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

export type Scan = {
  id: string;
  plant_id: string | null;
  user_id: string;
  image_url: string;
  scan_type: ScanType;
  species_identified: string | null;
  confidence_score: number | null;
  health_score: number | null;
  health_status: string | null;
  ai_raw_response: Record<string, unknown> | null;
  created_at: string;
};

export type PlantLog = {
  id: string;
  plant_id: string;
  scan_id: string | null;
  log_type: LogType;
  notes: string | null;
  health_score: number | null;
  created_at: string;
};

export type HomePlant = {
  id: string;
  user_id: string;
  nickname: string;
  species_name: string | null;
  species_common_name: string | null;
  cover_image_url: string | null;
  current_health_score: number | null;
  current_health_status: string | null;
  category: PlantCategory;
  added_via: PlantSource;
  created_at: string;
  updated_at: string;
  checkup_count: number;
};

export type UserRankProgress = {
  current_rank_title: string;
  current_rank_subtitle: string;
  next_rank_title: string | null;
  xp_current: number;
  xp_target: number;
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
      scans: {
        Row: Scan;
        Insert: {
          plant_id?: string | null;
          user_id: string;
          image_url: string;
          scan_type?: ScanType;
          species_identified?: string | null;
          confidence_score?: number | null;
          health_score?: number | null;
          health_status?: string | null;
          ai_raw_response?: Record<string, unknown> | null;
        };
        Update: Partial<Scan>;
        Relationships: [];
      };
      plant_logs: {
        Row: PlantLog;
        Insert: {
          plant_id: string;
          scan_id?: string | null;
          log_type: LogType;
          notes?: string | null;
          health_score?: number | null;
        };
        Update: Partial<PlantLog>;
        Relationships: [];
      };
    };
    Views: {
      home_plants: {
        Row: HomePlant;
        Relationships: [];
      };
    };
    Functions: {
      level_progress: {
        Args: { xp: number };
        Returns: number;
      };
      user_rank_progress: {
        Args: { p_user_id: string };
        Returns: UserRankProgress[];
      };
      can_user_scan: {
        Args: { uid: string };
        Returns: boolean;
      };
      increment_scan_count: {
        Args: { uid: string };
        Returns: undefined;
      };
    };
    Enums: {
      plant_category: PlantCategory;
      plant_source: PlantSource;
    };
    CompositeTypes: Record<string, never>;
  };
};
