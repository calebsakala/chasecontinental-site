export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1";
  };
  public: {
    Tables: {
      assessment_runs: {
        Row: {
          answers_json: Json;
          asset_key: string;
          band: string;
          created_at: string | null;
          id: string;
          lead_id: string | null;
          production_live: boolean | null;
          score: number;
          session_id: string | null;
          utm_campaign: string | null;
          utm_medium: string | null;
          utm_source: string | null;
          workflow_count: number | null;
        };
        Insert: {
          answers_json?: Json;
          asset_key?: string;
          band?: string;
          created_at?: string | null;
          id?: string;
          lead_id?: string | null;
          production_live?: boolean | null;
          score?: number;
          session_id?: string | null;
          utm_campaign?: string | null;
          utm_medium?: string | null;
          utm_source?: string | null;
          workflow_count?: number | null;
        };
        Update: {
          answers_json?: Json;
          asset_key?: string;
          band?: string;
          created_at?: string | null;
          id?: string;
          lead_id?: string | null;
          production_live?: boolean | null;
          score?: number;
          session_id?: string | null;
          utm_campaign?: string | null;
          utm_medium?: string | null;
          utm_source?: string | null;
          workflow_count?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "assessment_runs_lead_id_fkey";
            columns: ["lead_id"];
            isOneToOne: false;
            referencedRelation: "leads";
            referencedColumns: ["id"];
          },
        ];
      };
      assets: {
        Row: {
          asset_key: string;
          created_at: string | null;
          id: string;
          title: string;
        };
        Insert: {
          asset_key: string;
          created_at?: string | null;
          id?: string;
          title: string;
        };
        Update: {
          asset_key?: string;
          created_at?: string | null;
          id?: string;
          title?: string;
        };
        Relationships: [];
      };
      audit_runs: {
        Row: {
          agent_count: string | null;
          answers_json: Json;
          asset_key: string;
          band: string;
          created_at: string | null;
          id: string;
          lead_id: string | null;
          org_size: string | null;
          score: number;
          utm_campaign: string | null;
          utm_medium: string | null;
          utm_source: string | null;
        };
        Insert: {
          agent_count?: string | null;
          answers_json: Json;
          asset_key: string;
          band: string;
          created_at?: string | null;
          id?: string;
          lead_id?: string | null;
          org_size?: string | null;
          score: number;
          utm_campaign?: string | null;
          utm_medium?: string | null;
          utm_source?: string | null;
        };
        Update: {
          agent_count?: string | null;
          answers_json?: Json;
          asset_key?: string;
          band?: string;
          created_at?: string | null;
          id?: string;
          lead_id?: string | null;
          org_size?: string | null;
          score?: number;
          utm_campaign?: string | null;
          utm_medium?: string | null;
          utm_source?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "audit_runs_lead_id_fkey";
            columns: ["lead_id"];
            isOneToOne: false;
            referencedRelation: "leads";
            referencedColumns: ["id"];
          },
        ];
      };
      cc_events: {
        Row: {
          created_at: string | null;
          event_payload: Json | null;
          event_type: string;
          id: string;
          lead_id: string | null;
          run_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          event_payload?: Json | null;
          event_type: string;
          id?: string;
          lead_id?: string | null;
          run_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          event_payload?: Json | null;
          event_type?: string;
          id?: string;
          lead_id?: string | null;
          run_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "cc_events_lead_id_fkey";
            columns: ["lead_id"];
            isOneToOne: false;
            referencedRelation: "cc_leads";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cc_events_run_id_fkey";
            columns: ["run_id"];
            isOneToOne: false;
            referencedRelation: "cc_scorecard_runs";
            referencedColumns: ["id"];
          },
        ];
      };
      cc_leads: {
        Row: {
          company: string | null;
          created_at: string | null;
          email: string;
          id: string;
          migration_timeline: string | null;
          name: string;
          role: string | null;
          stack_size: string | null;
          stack_desc: string | null;
          vertical: string | null;
        };
        Insert: {
          company?: string | null;
          created_at?: string | null;
          email: string;
          id?: string;
          migration_timeline?: string | null;
          name: string;
          role?: string | null;
          stack_size?: string | null;
          stack_desc?: string | null;
          vertical?: string | null;
        };
        Update: {
          company?: string | null;
          created_at?: string | null;
          email?: string;
          id?: string;
          migration_timeline?: string | null;
          name?: string;
          role?: string | null;
          stack_size?: string | null;
          stack_desc?: string | null;
          vertical?: string | null;
        };
        Relationships: [];
      };
      cc_scorecard_runs: {
        Row: {
          answers_json: Json;
          band: string;
          chase_agents_fit_score: number | null;
          created_at: string | null;
          id: string;
          lead_id: string | null;
          score: number;
          session_id: string | null;
        };
        Insert: {
          answers_json?: Json;
          band?: string;
          chase_agents_fit_score?: number | null;
          created_at?: string | null;
          id?: string;
          lead_id?: string | null;
          score?: number;
          session_id?: string | null;
        };
        Update: {
          answers_json?: Json;
          band?: string;
          chase_agents_fit_score?: number | null;
          created_at?: string | null;
          id?: string;
          lead_id?: string | null;
          score?: number;
          session_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "cc_scorecard_runs_lead_id_fkey";
            columns: ["lead_id"];
            isOneToOne: false;
            referencedRelation: "cc_leads";
            referencedColumns: ["id"];
          },
        ];
      };
      downloads: {
        Row: {
          asset_key: string;
          created_at: string | null;
          downloaded_at: string | null;
          file_path: string | null;
          id: string;
          lead_id: string | null;
        };
        Insert: {
          asset_key: string;
          created_at?: string | null;
          downloaded_at?: string | null;
          file_path?: string | null;
          id?: string;
          lead_id?: string | null;
        };
        Update: {
          asset_key?: string;
          created_at?: string | null;
          downloaded_at?: string | null;
          file_path?: string | null;
          id?: string;
          lead_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "downloads_lead_id_fkey";
            columns: ["lead_id"];
            isOneToOne: false;
            referencedRelation: "leads";
            referencedColumns: ["id"];
          },
        ];
      };
      email_deliveries: {
        Row: {
          access_token: string;
          asset_key: string;
          click_count: number;
          created_at: string;
          email: string;
          error_message: string | null;
          first_clicked_at: string | null;
          id: string;
          last_clicked_at: string | null;
          lead_id: string;
          metadata: Json;
          provider_message_id: string | null;
          sent_at: string | null;
          status: string;
        };
        Insert: {
          access_token: string;
          asset_key: string;
          click_count?: number;
          created_at?: string;
          email: string;
          error_message?: string | null;
          first_clicked_at?: string | null;
          id?: string;
          last_clicked_at?: string | null;
          lead_id: string;
          metadata?: Json;
          provider_message_id?: string | null;
          sent_at?: string | null;
          status?: string;
        };
        Update: {
          access_token?: string;
          asset_key?: string;
          click_count?: number;
          created_at?: string;
          email?: string;
          error_message?: string | null;
          first_clicked_at?: string | null;
          id?: string;
          last_clicked_at?: string | null;
          lead_id?: string;
          metadata?: Json;
          provider_message_id?: string | null;
          sent_at?: string | null;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: "email_deliveries_lead_id_fkey";
            columns: ["lead_id"];
            isOneToOne: false;
            referencedRelation: "leads";
            referencedColumns: ["id"];
          },
        ];
      };
      email_preferences: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          metadata: Json;
          reason: string | null;
          source: string | null;
          unsubscribed_at: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
          metadata?: Json;
          reason?: string | null;
          source?: string | null;
          unsubscribed_at?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          metadata?: Json;
          reason?: string | null;
          source?: string | null;
          unsubscribed_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      events: {
        Row: {
          created_at: string | null;
          event_name: string;
          event_payload: Json | null;
          id: string;
          lead_id: string | null;
          session_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          event_name: string;
          event_payload?: Json | null;
          id?: string;
          lead_id?: string | null;
          session_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          event_name?: string;
          event_payload?: Json | null;
          id?: string;
          lead_id?: string | null;
          session_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "events_lead_id_fkey";
            columns: ["lead_id"];
            isOneToOne: false;
            referencedRelation: "leads";
            referencedColumns: ["id"];
          },
        ];
      };
      leads: {
        Row: {
          company: string | null;
          created_at: string | null;
          email: string;
          id: string;
          name: string;
          role: string | null;
          tool_stack: string | null;
          utm_campaign: string | null;
          utm_content: string | null;
          utm_medium: string | null;
          utm_source: string | null;
          utm_term: string | null;
          vertical: string | null;
        };
        Insert: {
          company?: string | null;
          created_at?: string | null;
          email: string;
          id?: string;
          name: string;
          role?: string | null;
          tool_stack?: string | null;
          utm_campaign?: string | null;
          utm_content?: string | null;
          utm_medium?: string | null;
          utm_source?: string | null;
          utm_term?: string | null;
          vertical?: string | null;
        };
        Update: {
          company?: string | null;
          created_at?: string | null;
          email?: string;
          id?: string;
          name?: string;
          role?: string | null;
          tool_stack?: string | null;
          utm_campaign?: string | null;
          utm_content?: string | null;
          utm_medium?: string | null;
          utm_source?: string | null;
          utm_term?: string | null;
          vertical?: string | null;
        };
        Relationships: [];
      };
      lg_campaign_responses: {
        Row: {
          agent_id: string | null;
          campaign_name: string | null;
          created_at: string | null;
          id: string;
          lead_id: string | null;
          metadata_id: string | null;
          next_action: string | null;
          pipeline_stage: string | null;
          responded_at: string | null;
          response_body: string | null;
          response_type: string | null;
          routed_to: string | null;
          sentiment_score: number | null;
          vertical: string | null;
        };
        Insert: {
          agent_id?: string | null;
          campaign_name?: string | null;
          created_at?: string | null;
          id?: string;
          lead_id?: string | null;
          metadata_id?: string | null;
          next_action?: string | null;
          pipeline_stage?: string | null;
          responded_at?: string | null;
          response_body?: string | null;
          response_type?: string | null;
          routed_to?: string | null;
          sentiment_score?: number | null;
          vertical?: string | null;
        };
        Update: {
          agent_id?: string | null;
          campaign_name?: string | null;
          created_at?: string | null;
          id?: string;
          lead_id?: string | null;
          metadata_id?: string | null;
          next_action?: string | null;
          pipeline_stage?: string | null;
          responded_at?: string | null;
          response_body?: string | null;
          response_type?: string | null;
          routed_to?: string | null;
          sentiment_score?: number | null;
          vertical?: string | null;
        };
        Relationships: [];
      };
      lg_enriched_leads: {
        Row: {
          brandfetch_data: Json | null;
          campaign_id: string | null;
          company_name: string | null;
          company_size: string | null;
          company_website: string | null;
          created_at: string | null;
          enriched_by: string | null;
          enrichment_status: string | null;
          firecrawl_data: Json | null;
          google_places_data: Json | null;
          id: string;
          industry: string | null;
          lead_email: string | null;
          lead_name: string;
          metadata_id: string | null;
          source: string | null;
          tech_stack: string[] | null;
          updated_at: string | null;
          vertical: string | null;
        };
        Insert: {
          brandfetch_data?: Json | null;
          campaign_id?: string | null;
          company_name?: string | null;
          company_size?: string | null;
          company_website?: string | null;
          created_at?: string | null;
          enriched_by?: string | null;
          enrichment_status?: string | null;
          firecrawl_data?: Json | null;
          google_places_data?: Json | null;
          id?: string;
          industry?: string | null;
          lead_email?: string | null;
          lead_name: string;
          metadata_id?: string | null;
          source?: string | null;
          tech_stack?: string[] | null;
          updated_at?: string | null;
          vertical?: string | null;
        };
        Update: {
          brandfetch_data?: Json | null;
          campaign_id?: string | null;
          company_name?: string | null;
          company_size?: string | null;
          company_website?: string | null;
          created_at?: string | null;
          enriched_by?: string | null;
          enrichment_status?: string | null;
          firecrawl_data?: Json | null;
          google_places_data?: Json | null;
          id?: string;
          industry?: string | null;
          lead_email?: string | null;
          lead_name?: string;
          metadata_id?: string | null;
          source?: string | null;
          tech_stack?: string[] | null;
          updated_at?: string | null;
          vertical?: string | null;
        };
        Relationships: [];
      };
      lg_outreach_credits: {
        Row: {
          created_at: string | null;
          credits_remaining: number | null;
          credits_total: number | null;
          credits_used: number | null;
          id: string;
          last_synced_at: string | null;
          leads_enriched: number | null;
          leads_sourced: number | null;
          platform: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          credits_remaining?: number | null;
          credits_total?: number | null;
          credits_used?: number | null;
          id?: string;
          last_synced_at?: string | null;
          leads_enriched?: number | null;
          leads_sourced?: number | null;
          platform: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          credits_remaining?: number | null;
          credits_total?: number | null;
          credits_used?: number | null;
          id?: string;
          last_synced_at?: string | null;
          leads_enriched?: number | null;
          leads_sourced?: number | null;
          platform?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      lm02_calculator_runs: {
        Row: {
          automation_maturity: string | null;
          created_at: string;
          id: string;
          inputs: Json;
          lead_id: string | null;
          outputs: Json;
          payback: number | null;
          priority_area: string | null;
          sector: string;
          session_id: string | null;
        };
        Insert: {
          automation_maturity?: string | null;
          created_at?: string;
          id?: string;
          inputs?: Json;
          lead_id?: string | null;
          outputs?: Json;
          payback?: number | null;
          priority_area?: string | null;
          sector: string;
          session_id?: string | null;
        };
        Update: {
          automation_maturity?: string | null;
          created_at?: string;
          id?: string;
          inputs?: Json;
          lead_id?: string | null;
          outputs?: Json;
          payback?: number | null;
          priority_area?: string | null;
          sector?: string;
          session_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "lm02_calculator_runs_lead_id_fkey";
            columns: ["lead_id"];
            isOneToOne: false;
            referencedRelation: "leads";
            referencedColumns: ["id"];
          },
        ];
      };
      lm02_sector_configs: {
        Row: {
          avg_error_cost: number | null;
          avg_error_rate: number | null;
          avg_hourly: number | null;
          avg_investment: number | null;
          avg_minutes: number | null;
          avg_volume: number | null;
          barriers_json: Json | null;
          enablers_json: Json | null;
          error_factor: number;
          error_reduction_default: number;
          id: string;
          productivity_factor: number;
          roi_mult: number | null;
          sector_name: string;
          strategies_json: Json | null;
          time_reduction_default: number;
        };
        Insert: {
          avg_error_cost?: number | null;
          avg_error_rate?: number | null;
          avg_hourly?: number | null;
          avg_investment?: number | null;
          avg_minutes?: number | null;
          avg_volume?: number | null;
          barriers_json?: Json | null;
          enablers_json?: Json | null;
          error_factor?: number;
          error_reduction_default: number;
          id?: string;
          productivity_factor?: number;
          roi_mult?: number | null;
          sector_name: string;
          strategies_json?: Json | null;
          time_reduction_default: number;
        };
        Update: {
          avg_error_cost?: number | null;
          avg_error_rate?: number | null;
          avg_hourly?: number | null;
          avg_investment?: number | null;
          avg_minutes?: number | null;
          avg_volume?: number | null;
          barriers_json?: Json | null;
          enablers_json?: Json | null;
          error_factor?: number;
          error_reduction_default?: number;
          id?: string;
          productivity_factor?: number;
          roi_mult?: number | null;
          sector_name?: string;
          strategies_json?: Json | null;
          time_reduction_default?: number;
        };
        Relationships: [];
      };
      lm06_downloads: {
        Row: {
          download_time: string | null;
          id: string;
          lead_id: string | null;
          pdf_version: string | null;
        };
        Insert: {
          download_time?: string | null;
          id?: string;
          lead_id?: string | null;
          pdf_version?: string | null;
        };
        Update: {
          download_time?: string | null;
          id?: string;
          lead_id?: string | null;
          pdf_version?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "lm06_downloads_lead_id_fkey";
            columns: ["lead_id"];
            isOneToOne: false;
            referencedRelation: "lm06_leads";
            referencedColumns: ["id"];
          },
        ];
      };
      lm06_events: {
        Row: {
          created_at: string | null;
          event_payload: Json | null;
          event_type: string;
          id: string;
          lead_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          event_payload?: Json | null;
          event_type: string;
          id?: string;
          lead_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          event_payload?: Json | null;
          event_type?: string;
          id?: string;
          lead_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "lm06_events_lead_id_fkey";
            columns: ["lead_id"];
            isOneToOne: false;
            referencedRelation: "lm06_leads";
            referencedColumns: ["id"];
          },
        ];
      };
      lm06_leads: {
        Row: {
          company: string | null;
          created_at: string | null;
          email: string;
          id: string;
          name: string;
          peak_challenge: string | null;
          peak_season_month: string | null;
          role: string | null;
          vertical: string | null;
        };
        Insert: {
          company?: string | null;
          created_at?: string | null;
          email: string;
          id?: string;
          name: string;
          peak_challenge?: string | null;
          peak_season_month?: string | null;
          role?: string | null;
          vertical?: string | null;
        };
        Update: {
          company?: string | null;
          created_at?: string | null;
          email?: string;
          id?: string;
          name?: string;
          peak_challenge?: string | null;
          peak_season_month?: string | null;
          role?: string | null;
          vertical?: string | null;
        };
        Relationships: [];
      };
      lm07_downloads: {
        Row: {
          downloaded_at: string | null;
          id: string;
          lead_id: string | null;
          template_version: string | null;
          workflow_name: string | null;
        };
        Insert: {
          downloaded_at?: string | null;
          id?: string;
          lead_id?: string | null;
          template_version?: string | null;
          workflow_name?: string | null;
        };
        Update: {
          downloaded_at?: string | null;
          id?: string;
          lead_id?: string | null;
          template_version?: string | null;
          workflow_name?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "lm07_downloads_lead_id_fkey";
            columns: ["lead_id"];
            isOneToOne: false;
            referencedRelation: "lm07_leads";
            referencedColumns: ["id"];
          },
        ];
      };
      lm07_events: {
        Row: {
          created_at: string | null;
          event_payload: Json | null;
          event_type: string;
          id: string;
          lead_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          event_payload?: Json | null;
          event_type: string;
          id?: string;
          lead_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          event_payload?: Json | null;
          event_type?: string;
          id?: string;
          lead_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "lm07_events_lead_id_fkey";
            columns: ["lead_id"];
            isOneToOne: false;
            referencedRelation: "lm07_leads";
            referencedColumns: ["id"];
          },
        ];
      };
      lm07_leads: {
        Row: {
          company: string | null;
          created_at: string | null;
          email: string;
          id: string;
          name: string;
          role: string | null;
          vertical: string | null;
        };
        Insert: {
          company?: string | null;
          created_at?: string | null;
          email: string;
          id?: string;
          name: string;
          role?: string | null;
          vertical?: string | null;
        };
        Update: {
          company?: string | null;
          created_at?: string | null;
          email?: string;
          id?: string;
          name?: string;
          role?: string | null;
          vertical?: string | null;
        };
        Relationships: [];
      };
      lm08_challenge_cleanup_archive: {
        Row: {
          archived_at: string;
          id: string;
          payload: Json;
          source_key: string;
          source_table: string;
        };
        Insert: {
          archived_at?: string;
          id?: string;
          payload: Json;
          source_key: string;
          source_table: string;
        };
        Update: {
          archived_at?: string;
          id?: string;
          payload?: Json;
          source_key?: string;
          source_table?: string;
        };
        Relationships: [];
      };
      lm08_challenge_email_log: {
        Row: {
          attempt_count: number;
          day: number;
          delivery_id: string | null;
          email: string;
          error_message: string | null;
          id: string;
          last_attempt_at: string;
          lead_id: string | null;
          metadata: Json;
          provider_message_id: string | null;
          sent_at: string | null;
          signup_id: string;
          status: string;
        };
        Insert: {
          attempt_count?: number;
          day: number;
          delivery_id?: string | null;
          email: string;
          error_message?: string | null;
          id?: string;
          last_attempt_at?: string;
          lead_id?: string | null;
          metadata?: Json;
          provider_message_id?: string | null;
          sent_at?: string | null;
          signup_id: string;
          status?: string;
        };
        Update: {
          attempt_count?: number;
          day?: number;
          delivery_id?: string | null;
          email?: string;
          error_message?: string | null;
          id?: string;
          last_attempt_at?: string;
          lead_id?: string | null;
          metadata?: Json;
          provider_message_id?: string | null;
          sent_at?: string | null;
          signup_id?: string;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: "lm08_challenge_email_log_delivery_id_fkey";
            columns: ["delivery_id"];
            isOneToOne: false;
            referencedRelation: "email_deliveries";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "lm08_challenge_email_log_lead_id_fkey";
            columns: ["lead_id"];
            isOneToOne: false;
            referencedRelation: "leads";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "lm08_challenge_email_log_signup_id_fkey";
            columns: ["signup_id"];
            isOneToOne: false;
            referencedRelation: "lm08_challenge_signups";
            referencedColumns: ["id"];
          },
        ];
      };
      lm08_challenge_progress: {
        Row: {
          completed: boolean;
          completed_at: string | null;
          current_day: number;
          id: string;
          last_error: string | null;
          last_sent_day: number;
          lead_id: string | null;
          next_send_at: string | null;
          signup_id: string;
          started_at: string;
          status: string;
          updated_at: string;
        };
        Insert: {
          completed?: boolean;
          completed_at?: string | null;
          current_day?: number;
          id?: string;
          last_error?: string | null;
          last_sent_day?: number;
          lead_id?: string | null;
          next_send_at?: string | null;
          signup_id: string;
          started_at?: string;
          status?: string;
          updated_at?: string;
        };
        Update: {
          completed?: boolean;
          completed_at?: string | null;
          current_day?: number;
          id?: string;
          last_error?: string | null;
          last_sent_day?: number;
          lead_id?: string | null;
          next_send_at?: string | null;
          signup_id?: string;
          started_at?: string;
          status?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "lm08_challenge_progress_lead_id_fkey";
            columns: ["lead_id"];
            isOneToOne: false;
            referencedRelation: "leads";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "lm08_challenge_progress_signup_id_fkey";
            columns: ["signup_id"];
            isOneToOne: true;
            referencedRelation: "lm08_challenge_signups";
            referencedColumns: ["id"];
          },
        ];
      };
      lm08_challenge_signups: {
        Row: {
          company: string | null;
          current_tools: string | null;
          email: string;
          first_name: string;
          id: string;
          last_name: string;
          lead_id: string | null;
          pilot_goal: string | null;
          role: string | null;
          signup_date: string | null;
          updated_at: string;
          vertical: string | null;
        };
        Insert: {
          company?: string | null;
          current_tools?: string | null;
          email: string;
          first_name: string;
          id?: string;
          last_name: string;
          lead_id?: string | null;
          pilot_goal?: string | null;
          role?: string | null;
          signup_date?: string | null;
          updated_at?: string;
          vertical?: string | null;
        };
        Update: {
          company?: string | null;
          current_tools?: string | null;
          email?: string;
          first_name?: string;
          id?: string;
          last_name?: string;
          lead_id?: string | null;
          pilot_goal?: string | null;
          role?: string | null;
          signup_date?: string | null;
          updated_at?: string;
          vertical?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "lm08_challenge_signups_lead_id_fkey";
            columns: ["lead_id"];
            isOneToOne: false;
            referencedRelation: "leads";
            referencedColumns: ["id"];
          },
        ];
      };
      lm08_events: {
        Row: {
          created_at: string | null;
          event_payload: Json | null;
          event_type: string;
          id: string;
          signup_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          event_payload?: Json | null;
          event_type: string;
          id?: string;
          signup_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          event_payload?: Json | null;
          event_type?: string;
          id?: string;
          signup_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "lm08_events_signup_id_fkey";
            columns: ["signup_id"];
            isOneToOne: false;
            referencedRelation: "lm08_challenge_signups";
            referencedColumns: ["id"];
          },
        ];
      };
      signflow_audit_logs: {
        Row: {
          details: Json | null;
          document_id: string;
          event_type: string;
          id: string;
          ip_address: string | null;
          timestamp: string;
          user_email: string | null;
        };
        Insert: {
          details?: Json | null;
          document_id: string;
          event_type: string;
          id?: string;
          ip_address?: string | null;
          timestamp?: string;
          user_email?: string | null;
        };
        Update: {
          details?: Json | null;
          document_id?: string;
          event_type?: string;
          id?: string;
          ip_address?: string | null;
          timestamp?: string;
          user_email?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "signflow_audit_logs_document_id_fkey";
            columns: ["document_id"];
            isOneToOne: false;
            referencedRelation: "signflow_documents";
            referencedColumns: ["id"];
          },
        ];
      };
      signflow_document_signers: {
        Row: {
          access_token: string;
          declined: boolean;
          document_id: string;
          email: string;
          full_name: string | null;
          id: string;
          order_index: number;
          signed: boolean;
        };
        Insert: {
          access_token?: string;
          declined?: boolean;
          document_id: string;
          email: string;
          full_name?: string | null;
          id?: string;
          order_index: number;
          signed?: boolean;
        };
        Update: {
          access_token?: string;
          declined?: boolean;
          document_id?: string;
          email?: string;
          full_name?: string | null;
          id?: string;
          order_index?: number;
          signed?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "signflow_document_signers_document_id_fkey";
            columns: ["document_id"];
            isOneToOne: false;
            referencedRelation: "signflow_documents";
            referencedColumns: ["id"];
          },
        ];
      };
      signflow_document_templates: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          pdf_path: string | null;
          workspace_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          pdf_path?: string | null;
          workspace_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          pdf_path?: string | null;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "signflow_document_templates_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "signflow_workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      signflow_document_versions: {
        Row: {
          created_at: string;
          document_id: string;
          id: string;
          pdf_path: string | null;
          version_number: number;
        };
        Insert: {
          created_at?: string;
          document_id: string;
          id?: string;
          pdf_path?: string | null;
          version_number: number;
        };
        Update: {
          created_at?: string;
          document_id?: string;
          id?: string;
          pdf_path?: string | null;
          version_number?: number;
        };
        Relationships: [
          {
            foreignKeyName: "signflow_document_versions_document_id_fkey";
            columns: ["document_id"];
            isOneToOne: false;
            referencedRelation: "signflow_documents";
            referencedColumns: ["id"];
          },
        ];
      };
      signflow_documents: {
        Row: {
          created_at: string;
          current_signer_index: number;
          id: string;
          status: string;
          template_id: string | null;
          title: string;
          workspace_id: string;
        };
        Insert: {
          created_at?: string;
          current_signer_index?: number;
          id?: string;
          status?: string;
          template_id?: string | null;
          title: string;
          workspace_id: string;
        };
        Update: {
          created_at?: string;
          current_signer_index?: number;
          id?: string;
          status?: string;
          template_id?: string | null;
          title?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "signflow_documents_template_id_fkey";
            columns: ["template_id"];
            isOneToOne: false;
            referencedRelation: "signflow_document_templates";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "signflow_documents_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "signflow_workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      signflow_notifications: {
        Row: {
          document_id: string;
          id: string;
          recipient_email: string;
          sent_at: string;
          status: string;
          type: string;
        };
        Insert: {
          document_id: string;
          id?: string;
          recipient_email: string;
          sent_at?: string;
          status?: string;
          type: string;
        };
        Update: {
          document_id?: string;
          id?: string;
          recipient_email?: string;
          sent_at?: string;
          status?: string;
          type?: string;
        };
        Relationships: [
          {
            foreignKeyName: "signflow_notifications_document_id_fkey";
            columns: ["document_id"];
            isOneToOne: false;
            referencedRelation: "signflow_documents";
            referencedColumns: ["id"];
          },
        ];
      };
      signflow_profiles: {
        Row: {
          created_at: string;
          email: string;
          full_name: string;
          id: string;
          initials: string | null;
        };
        Insert: {
          created_at?: string;
          email: string;
          full_name?: string;
          id: string;
          initials?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string;
          full_name?: string;
          id?: string;
          initials?: string | null;
        };
        Relationships: [];
      };
      signflow_signatures: {
        Row: {
          document_id: string;
          field_id: string | null;
          id: string;
          ip_address: string | null;
          signature_image_path: string | null;
          signed_at: string | null;
          signer_email: string;
          text_value: string | null;
        };
        Insert: {
          document_id: string;
          field_id?: string | null;
          id?: string;
          ip_address?: string | null;
          signature_image_path?: string | null;
          signed_at?: string | null;
          signer_email: string;
          text_value?: string | null;
        };
        Update: {
          document_id?: string;
          field_id?: string | null;
          id?: string;
          ip_address?: string | null;
          signature_image_path?: string | null;
          signed_at?: string | null;
          signer_email?: string;
          text_value?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "signflow_signatures_document_id_fkey";
            columns: ["document_id"];
            isOneToOne: false;
            referencedRelation: "signflow_documents";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "signflow_signatures_field_id_fkey";
            columns: ["field_id"];
            isOneToOne: false;
            referencedRelation: "signflow_template_fields";
            referencedColumns: ["id"];
          },
        ];
      };
      signflow_template_fields: {
        Row: {
          height: number;
          id: string;
          label: string | null;
          page: number;
          position_x: number;
          position_y: number;
          required: boolean;
          signer_index: number;
          template_id: string;
          type: string;
          width: number;
        };
        Insert: {
          height?: number;
          id?: string;
          label?: string | null;
          page?: number;
          position_x?: number;
          position_y?: number;
          required?: boolean;
          signer_index?: number;
          template_id: string;
          type: string;
          width?: number;
        };
        Update: {
          height?: number;
          id?: string;
          label?: string | null;
          page?: number;
          position_x?: number;
          position_y?: number;
          required?: boolean;
          signer_index?: number;
          template_id?: string;
          type?: string;
          width?: number;
        };
        Relationships: [
          {
            foreignKeyName: "signflow_template_fields_template_id_fkey";
            columns: ["template_id"];
            isOneToOne: false;
            referencedRelation: "signflow_document_templates";
            referencedColumns: ["id"];
          },
        ];
      };
      signflow_workspace_members: {
        Row: {
          id: string;
          joined_at: string;
          role: string;
          user_id: string;
          workspace_id: string;
        };
        Insert: {
          id?: string;
          joined_at?: string;
          role?: string;
          user_id: string;
          workspace_id: string;
        };
        Update: {
          id?: string;
          joined_at?: string;
          role?: string;
          user_id?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "signflow_workspace_members_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "signflow_profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "signflow_workspace_members_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "signflow_workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      signflow_workspaces: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          owner_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          owner_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          owner_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "signflow_workspaces_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "signflow_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      signflow_complete_signing: {
        Args: { _access_token: string; _fields: Json; _ip_address?: string };
        Returns: undefined;
      };
      signflow_get_document_for_signer: {
        Args: { _access_token: string };
        Returns: {
          document_id: string;
          signer_declined: boolean;
          signer_email: string;
          signer_name: string;
          signer_order_index: number;
          signer_signed: boolean;
          status: string;
          template_id: string;
          title: string;
        }[];
      };
      signflow_get_fields_for_signer: {
        Args: { _access_token: string };
        Returns: {
          height: number;
          id: string;
          label: string;
          page: number;
          position_x: number;
          position_y: number;
          required: boolean;
          signer_index: number;
          template_id: string;
          type: string;
          width: number;
        }[];
      };
      signflow_get_signer_by_token: {
        Args: { _access_token: string };
        Returns: {
          access_token: string;
          declined: boolean;
          document_id: string;
          email: string;
          full_name: string | null;
          id: string;
          order_index: number;
          signed: boolean;
        }[];
        SetofOptions: {
          from: "*";
          to: "signflow_document_signers";
          isOneToOne: false;
          isSetofReturn: true;
        };
      };
      signflow_guest_decline: {
        Args: { _access_token: string };
        Returns: undefined;
      };
      signflow_is_workspace_member: {
        Args: { _user_id: string; _workspace_id: string };
        Returns: boolean;
      };
      signflow_log_sent_event: {
        Args: { _document_id: string; _signer_emails: string[] };
        Returns: undefined;
      };
      signflow_log_view_event: {
        Args: { _access_token: string };
        Returns: undefined;
      };
      signflow_submit_guest_signature: {
        Args: {
          _access_token: string;
          _field_id?: string;
          _ip_address?: string;
          _signature_image_path?: string;
          _text_value?: string;
        };
        Returns: string;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
