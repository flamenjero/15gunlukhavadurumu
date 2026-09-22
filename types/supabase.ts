/**
 * Supabase Database tipleri — agricultural_tips + locations
 */

export type AgriculturalTipCategory = "tarim" | "aricilik";

export type MoonPhase =
  | "new_moon"
  | "waxing_crescent"
  | "first_quarter"
  | "waxing_gibbous"
  | "full_moon"
  | "waning_gibbous"
  | "last_quarter"
  | "waning_crescent"
  | "any";

export type SeasonRuleValue =
  | "spring"
  | "summer"
  | "autumn"
  | "winter"
  | "early_spring"
  | "late_spring"
  | "early_summer"
  | "late_summer"
  | "early_autumn"
  | "late_autumn"
  | (string & {});

export interface AgriculturalTipConditions {
  min_temp?: number;
  max_temp?: number;
  condition?: string | string[];
  season?: SeasonRuleValue | SeasonRuleValue[];
  moon_phase?: MoonPhase | MoonPhase[] | string | string[];
  min_elevation?: number;
  max_elevation?: number;
  min_wind_speed?: number;
  max_wind_speed?: number;
  min_humidity?: number;
  max_humidity?: number;
  min_night_temp?: number;
  wind_max_kph?: number;
  precip_chance_min?: number;
  months?: number[];
  tags?: string[];
}

export interface AgriculturalTip {
  id: string;
  category: AgriculturalTipCategory;
  title: string;
  content: string;
  conditions: AgriculturalTipConditions;
  priority: number;
  target_regions: string[] | null;
  is_active: boolean;
  created_at: string;
}

export type AgriculturalTipInsert = Omit<
  AgriculturalTip,
  "id" | "created_at" | "is_active" | "priority"
> & {
  id?: string;
  created_at?: string;
  is_active?: boolean;
  priority?: number;
};

export type AgriculturalTipUpdate = Partial<AgriculturalTipInsert>;

export interface LocationRecord {
  id: string;
  city_name: string;
  city_slug: string;
  district_name: string;
  district_slug: string;
  lat: number;
  lng: number;
  elevation: number;
  label: string;
  search_key: string;
  is_active: boolean;
  created_at: string;
}

export type LocationInsert = Omit<
  LocationRecord,
  "id" | "created_at" | "is_active"
> & {
  id?: string;
  created_at?: string;
  is_active?: boolean;
};

export type LocationUpdate = Partial<LocationInsert>;

export interface Database {
  public: {
    Tables: {
      agricultural_tips: {
        Row: AgriculturalTip;
        Insert: AgriculturalTipInsert;
        Update: AgriculturalTipUpdate;
        Relationships: [];
      };
      locations: {
        Row: LocationRecord;
        Insert: LocationInsert;
        Update: LocationUpdate;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      search_locations: {
        Args: { search_query: string; result_limit: number };
        Returns: LocationRecord;
      };
      list_cities: {
        Args: { result_limit: number };
        Returns: { city_name: string; city_slug: string };
      };
    };
    Enums: {
      agricultural_tip_category: AgriculturalTipCategory;
    };
    CompositeTypes: Record<string, never>;
  };
}
