export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      restaurants: {
        Row: {
          id: string
          name: string
          address: string
          phone: string
          email: string
          timezone: string
          operating_hours: Json
          settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          address: string
          phone: string
          email: string
          timezone?: string
          operating_hours?: Json
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string
          phone?: string
          email?: string
          timezone?: string
          operating_hours?: Json
          settings?: Json
          created_at?: string
          updated_at?: string
        }
      }
      staff: {
        Row: {
          id: string
          restaurant_id: string
          first_name: string
          last_name: string
          email: string
          phone: string | null
          role: string
          status: string
          schedule: Json
          documents: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          first_name: string
          last_name: string
          email: string
          phone?: string | null
          role: string
          status?: string
          schedule?: Json
          documents?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          first_name?: string
          last_name?: string
          email?: string
          phone?: string | null
          role?: string
          status?: string
          schedule?: Json
          documents?: Json
          created_at?: string
          updated_at?: string
        }
      }
      inventory: {
        Row: {
          id: string
          restaurant_id: string
          name: string
          description: string | null
          current_stock: number
          minimum_stock: number
          unit: string
          supplier: Json | null
          auto_reorder: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          name: string
          description?: string | null
          current_stock?: number
          minimum_stock?: number
          unit: string
          supplier?: Json | null
          auto_reorder?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          name?: string
          description?: string | null
          current_stock?: number
          minimum_stock?: number
          unit?: string
          supplier?: Json | null
          auto_reorder?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      platforms: {
        Row: {
          id: string
          restaurant_id: string
          platform_name: string
          credentials: Json
          settings: Json
          menu_sync: Json
          enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          platform_name: string
          credentials?: Json
          settings?: Json
          menu_sync?: Json
          enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          platform_name?: string
          credentials?: Json
          settings?: Json
          menu_sync?: Json
          enabled?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          restaurant_id: string
          platform_id: string
          external_order_id: string
          status: string
          items: Json
          customer: Json
          payment: Json
          timing: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          platform_id: string
          external_order_id: string
          status: string
          items?: Json
          customer?: Json
          payment?: Json
          timing?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          platform_id?: string
          external_order_id?: string
          status?: string
          items?: Json
          customer?: Json
          payment?: Json
          timing?: Json
          created_at?: string
          updated_at?: string
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
  }
}