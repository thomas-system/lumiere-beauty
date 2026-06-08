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
      addresses: {
        Row: {
          address_line1: string
          address_line2: string | null
          city: string
          created_at: string
          deleted_at: string | null
          full_name: string
          governorate: string
          id: string
          is_default: boolean
          label: string | null
          latitude: number | null
          longitude: number | null
          phone: string
          postal_code: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          city: string
          created_at?: string
          deleted_at?: string | null
          full_name: string
          governorate: string
          id?: string
          is_default?: boolean
          label?: string | null
          latitude?: number | null
          longitude?: number | null
          phone: string
          postal_code?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          city?: string
          created_at?: string
          deleted_at?: string | null
          full_name?: string
          governorate?: string
          id?: string
          is_default?: boolean
          label?: string | null
          latitude?: number | null
          longitude?: number | null
          phone?: string
          postal_code?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "addresses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_action_log: {
        Row: {
          action: string
          admin_id: string
          created_at: string
          entity: string
          entity_id: string | null
          id: string
          ip_address: unknown
          new_value: Json | null
          old_value: Json | null
        }
        Insert: {
          action: string
          admin_id: string
          created_at?: string
          entity: string
          entity_id?: string | null
          id?: string
          ip_address?: unknown
          new_value?: Json | null
          old_value?: Json | null
        }
        Update: {
          action?: string
          admin_id?: string
          created_at?: string
          entity?: string
          entity_id?: string | null
          id?: string
          ip_address?: unknown
          new_value?: Json | null
          old_value?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_action_log_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string
          body_ar: string | null
          body_en: string | null
          cover_image_url: string | null
          created_at: string
          deleted_at: string | null
          excerpt_ar: string | null
          excerpt_en: string | null
          fts_ar: unknown
          fts_en: unknown
          id: string
          meta_desc_ar: string | null
          meta_desc_en: string | null
          meta_title_ar: string | null
          meta_title_en: string | null
          published_at: string | null
          slug: string
          status: Database["public"]["Enums"]["blog_status"]
          title_ar: string
          title_en: string
          updated_at: string
        }
        Insert: {
          author_id: string
          body_ar?: string | null
          body_en?: string | null
          cover_image_url?: string | null
          created_at?: string
          deleted_at?: string | null
          excerpt_ar?: string | null
          excerpt_en?: string | null
          fts_ar?: unknown
          fts_en?: unknown
          id?: string
          meta_desc_ar?: string | null
          meta_desc_en?: string | null
          meta_title_ar?: string | null
          meta_title_en?: string | null
          published_at?: string | null
          slug: string
          status?: Database["public"]["Enums"]["blog_status"]
          title_ar: string
          title_en: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          body_ar?: string | null
          body_en?: string | null
          cover_image_url?: string | null
          created_at?: string
          deleted_at?: string | null
          excerpt_ar?: string | null
          excerpt_en?: string | null
          fts_ar?: unknown
          fts_en?: unknown
          id?: string
          meta_desc_ar?: string | null
          meta_desc_en?: string | null
          meta_title_ar?: string | null
          meta_title_en?: string | null
          published_at?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["blog_status"]
          title_ar?: string
          title_en?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      brands: {
        Row: {
          created_at: string
          deleted_at: string | null
          description_ar: string | null
          description_en: string | null
          id: string
          is_active: boolean
          logo_url: string | null
          name: string
          slug: string
          sort_order: number
          updated_at: string
          website_url: string | null
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          description_ar?: string | null
          description_en?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          description_ar?: string | null
          description_en?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          deleted_at: string | null
          description_ar: string | null
          description_en: string | null
          id: string
          image_url: string | null
          is_active: boolean
          level: number
          name_ar: string
          name_en: string
          parent_id: string | null
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          description_ar?: string | null
          description_en?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          level?: number
          name_ar: string
          name_en: string
          parent_id?: string | null
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          description_ar?: string | null
          description_en?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          level?: number
          name_ar?: string
          name_en?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          code: string
          created_at: string
          deleted_at: string | null
          end_date: string
          id: string
          is_active: boolean
          max_discount: number | null
          min_order_amount: number | null
          start_date: string
          type: Database["public"]["Enums"]["coupon_type"]
          updated_at: string
          usage_count: number
          usage_limit: number | null
          user_limit: number | null
          value: number
        }
        Insert: {
          code: string
          created_at?: string
          deleted_at?: string | null
          end_date: string
          id?: string
          is_active?: boolean
          max_discount?: number | null
          min_order_amount?: number | null
          start_date: string
          type: Database["public"]["Enums"]["coupon_type"]
          updated_at?: string
          usage_count?: number
          usage_limit?: number | null
          user_limit?: number | null
          value?: number
        }
        Update: {
          code?: string
          created_at?: string
          deleted_at?: string | null
          end_date?: string
          id?: string
          is_active?: boolean
          max_discount?: number | null
          min_order_amount?: number | null
          start_date?: string
          type?: Database["public"]["Enums"]["coupon_type"]
          updated_at?: string
          usage_count?: number
          usage_limit?: number | null
          user_limit?: number | null
          value?: number
        }
        Relationships: []
      }
      governorates: {
        Row: {
          id: number
          name_ar: string
          name_en: string
        }
        Insert: {
          id?: number
          name_ar: string
          name_en: string
        }
        Update: {
          id?: number
          name_ar?: string
          name_en?: string
        }
        Relationships: []
      }
      inventory: {
        Row: {
          created_at: string
          id: string
          last_restocked: string | null
          qty_available: number
          qty_reserved: number
          reorder_point: number
          updated_at: string
          variant_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_restocked?: string | null
          qty_available?: number
          qty_reserved?: number
          reorder_point?: number
          updated_at?: string
          variant_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_restocked?: string | null
          qty_available?: number
          qty_reserved?: number
          reorder_point?: number
          updated_at?: string
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: true
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_transactions: {
        Row: {
          balance_after: number
          created_at: string
          description: string
          id: string
          order_id: string | null
          points: number
          type: Database["public"]["Enums"]["loyalty_tx_type"]
          user_id: string
        }
        Insert: {
          balance_after: number
          created_at?: string
          description: string
          id?: string
          order_id?: string | null
          points: number
          type: Database["public"]["Enums"]["loyalty_tx_type"]
          user_id: string
        }
        Update: {
          balance_after?: number
          created_at?: string
          description?: string
          id?: string
          order_id?: string | null
          points?: number
          type?: Database["public"]["Enums"]["loyalty_tx_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loyalty_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          product_name_ar: string
          product_name_en: string
          qty: number
          shade: string | null
          size: string | null
          sku: string
          total_price: number
          unit_price: number
          updated_at: string
          variant_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          product_name_ar: string
          product_name_en: string
          qty: number
          shade?: string | null
          size?: string | null
          sku: string
          total_price: number
          unit_price: number
          updated_at?: string
          variant_id: string
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          product_name_ar?: string
          product_name_en?: string
          qty?: number
          shade?: string | null
          size?: string | null
          sku?: string
          total_price?: number
          unit_price?: number
          updated_at?: string
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      order_status_history: {
        Row: {
          changed_by: string | null
          created_at: string
          id: string
          new_status: Database["public"]["Enums"]["order_status"]
          notes: string | null
          old_status: Database["public"]["Enums"]["order_status"] | null
          order_id: string
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          id?: string
          new_status: Database["public"]["Enums"]["order_status"]
          notes?: string | null
          old_status?: Database["public"]["Enums"]["order_status"] | null
          order_id: string
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          id?: string
          new_status?: Database["public"]["Enums"]["order_status"]
          notes?: string | null
          old_status?: Database["public"]["Enums"]["order_status"] | null
          order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_status_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_status_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address_id: string
          bosta_awb: string | null
          cod_otp_verified: boolean
          coupon_id: string | null
          created_at: string
          delivery_method: Database["public"]["Enums"]["delivery_method"]
          discount_amount: number
          guest_email: string | null
          guest_phone: string | null
          id: string
          notes: string | null
          order_number: string
          shipping_fee: number
          status: Database["public"]["Enums"]["order_status"]
          subtotal: number
          total: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address_id: string
          bosta_awb?: string | null
          cod_otp_verified?: boolean
          coupon_id?: string | null
          created_at?: string
          delivery_method?: Database["public"]["Enums"]["delivery_method"]
          discount_amount?: number
          guest_email?: string | null
          guest_phone?: string | null
          id?: string
          notes?: string | null
          order_number: string
          shipping_fee?: number
          status?: Database["public"]["Enums"]["order_status"]
          subtotal: number
          total: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address_id?: string
          bosta_awb?: string | null
          cod_otp_verified?: boolean
          coupon_id?: string | null
          created_at?: string
          delivery_method?: Database["public"]["Enums"]["delivery_method"]
          discount_amount?: number
          guest_email?: string | null
          guest_phone?: string | null
          id?: string
          notes?: string | null
          order_number?: string
          shipping_fee?: number
          status?: Database["public"]["Enums"]["order_status"]
          subtotal?: number
          total?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_address_id_fkey"
            columns: ["address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          gateway_response: Json | null
          id: string
          idempotency_key: string | null
          method: Database["public"]["Enums"]["payment_method"]
          order_id: string
          paymob_order_id: string | null
          status: Database["public"]["Enums"]["payment_status"]
          transaction_ref: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          gateway_response?: Json | null
          id?: string
          idempotency_key?: string | null
          method: Database["public"]["Enums"]["payment_method"]
          order_id: string
          paymob_order_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          transaction_ref?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          gateway_response?: Json | null
          id?: string
          idempotency_key?: string | null
          method?: Database["public"]["Enums"]["payment_method"]
          order_id?: string
          paymob_order_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          transaction_ref?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          alt_text_ar: string | null
          alt_text_en: string | null
          created_at: string
          id: string
          is_primary: boolean
          product_id: string
          sort_order: number
          url: string
        }
        Insert: {
          alt_text_ar?: string | null
          alt_text_en?: string | null
          created_at?: string
          id?: string
          is_primary?: boolean
          product_id: string
          sort_order?: number
          url: string
        }
        Update: {
          alt_text_ar?: string | null
          alt_text_en?: string | null
          created_at?: string
          id?: string
          is_primary?: boolean
          product_id?: string
          sort_order?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          created_at: string
          deleted_at: string | null
          hex_code: string | null
          id: string
          image_url: string | null
          is_active: boolean
          price_override: number | null
          product_id: string
          shade: string | null
          size: string | null
          sku: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          hex_code?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          price_override?: number | null
          product_id: string
          shade?: string | null
          size?: string | null
          sku: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          hex_code?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          price_override?: number | null
          product_id?: string
          shade?: string | null
          size?: string | null
          sku?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          avg_rating: number
          base_price: number
          brand_id: string
          category_id: string
          created_at: string
          deleted_at: string | null
          desc_ar: string | null
          desc_en: string | null
          fts_ar: unknown
          fts_en: unknown
          id: string
          is_active: boolean
          is_featured: boolean
          meta_desc_ar: string | null
          meta_desc_en: string | null
          meta_title_ar: string | null
          meta_title_en: string | null
          name_ar: string
          name_en: string
          review_count: number
          sale_price: number | null
          slug: string
          updated_at: string
        }
        Insert: {
          avg_rating?: number
          base_price: number
          brand_id: string
          category_id: string
          created_at?: string
          deleted_at?: string | null
          desc_ar?: string | null
          desc_en?: string | null
          fts_ar?: unknown
          fts_en?: unknown
          id?: string
          is_active?: boolean
          is_featured?: boolean
          meta_desc_ar?: string | null
          meta_desc_en?: string | null
          meta_title_ar?: string | null
          meta_title_en?: string | null
          name_ar: string
          name_en: string
          review_count?: number
          sale_price?: number | null
          slug: string
          updated_at?: string
        }
        Update: {
          avg_rating?: number
          base_price?: number
          brand_id?: string
          category_id?: string
          created_at?: string
          deleted_at?: string | null
          desc_ar?: string | null
          desc_en?: string | null
          fts_ar?: unknown
          fts_en?: unknown
          id?: string
          is_active?: boolean
          is_featured?: boolean
          meta_desc_ar?: string | null
          meta_desc_en?: string | null
          meta_title_ar?: string | null
          meta_title_en?: string | null
          name_ar?: string
          name_en?: string
          review_count?: number
          sale_price?: number | null
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          referee_id: string | null
          referral_code: string
          referrer_id: string
          reward_points: number | null
          status: Database["public"]["Enums"]["referral_status"]
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          referee_id?: string | null
          referral_code: string
          referrer_id: string
          reward_points?: number | null
          status?: Database["public"]["Enums"]["referral_status"]
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          referee_id?: string | null
          referral_code?: string
          referrer_id?: string
          reward_points?: number | null
          status?: Database["public"]["Enums"]["referral_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referee_id_fkey"
            columns: ["referee_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      review_images: {
        Row: {
          created_at: string
          id: string
          review_id: string
          sort_order: number
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          review_id: string
          sort_order?: number
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          review_id?: string
          sort_order?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_images_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          body: string
          created_at: string
          deleted_at: string | null
          helpful_count: number
          id: string
          is_approved: boolean
          is_verified: boolean
          order_id: string | null
          product_id: string
          rating: number
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          deleted_at?: string | null
          helpful_count?: number
          id?: string
          is_approved?: boolean
          is_verified?: boolean
          order_id?: string | null
          product_id: string
          rating: number
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          deleted_at?: string | null
          helpful_count?: number
          id?: string
          is_approved?: boolean
          is_verified?: boolean
          order_id?: string | null
          product_id?: string
          rating?: number
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          deleted_at: string | null
          email: string
          email_verified: boolean
          first_name: string
          id: string
          is_active: boolean
          last_name: string
          loyalty_points: number
          marketing_email: boolean
          marketing_sms: boolean
          marketing_whatsapp: boolean
          phone: string | null
          phone_verified: boolean
          referral_code: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          deleted_at?: string | null
          email: string
          email_verified?: boolean
          first_name: string
          id?: string
          is_active?: boolean
          last_name: string
          loyalty_points?: number
          marketing_email?: boolean
          marketing_sms?: boolean
          marketing_whatsapp?: boolean
          phone?: string | null
          phone_verified?: boolean
          referral_code?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string
          email_verified?: boolean
          first_name?: string
          id?: string
          is_active?: boolean
          last_name?: string
          loyalty_points?: number
          marketing_email?: boolean
          marketing_sms?: boolean
          marketing_whatsapp?: boolean
          phone?: string | null
          phone_verified?: boolean
          referral_code?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      wishlist_items: {
        Row: {
          created_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishlist_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      glora_attach_updated_at: { Args: { tbl: string }; Returns: undefined }
      glora_is_admin: { Args: never; Returns: boolean }
      glora_is_super_admin: { Args: never; Returns: boolean }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      unaccent: { Args: { "": string }; Returns: string }
    }
    Enums: {
      blog_status: "DRAFT" | "PUBLISHED" | "ARCHIVED"
      coupon_type: "PERCENTAGE" | "FIXED" | "FREE_SHIPPING" | "BOGO"
      delivery_method: "STANDARD" | "EXPRESS" | "SAME_DAY"
      loyalty_tx_type: "EARN" | "REDEEM" | "BONUS" | "EXPIRE" | "ADJUST"
      order_status:
        | "PENDING"
        | "CONFIRMED"
        | "PROCESSING"
        | "SHIPPED"
        | "DELIVERED"
        | "CANCELLED"
        | "REFUNDED"
      payment_method: "CARD" | "COD" | "WALLET" | "INSTALLMENT"
      payment_status:
        | "PENDING"
        | "PROCESSING"
        | "COMPLETED"
        | "FAILED"
        | "REFUNDED"
        | "CANCELLED"
      referral_status: "PENDING" | "COMPLETED" | "REWARDED" | "EXPIRED"
      user_role: "CUSTOMER" | "ADMIN" | "SUPER_ADMIN"
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
    Enums: {
      blog_status: ["DRAFT", "PUBLISHED", "ARCHIVED"],
      coupon_type: ["PERCENTAGE", "FIXED", "FREE_SHIPPING", "BOGO"],
      delivery_method: ["STANDARD", "EXPRESS", "SAME_DAY"],
      loyalty_tx_type: ["EARN", "REDEEM", "BONUS", "EXPIRE", "ADJUST"],
      order_status: [
        "PENDING",
        "CONFIRMED",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
        "REFUNDED",
      ],
      payment_method: ["CARD", "COD", "WALLET", "INSTALLMENT"],
      payment_status: [
        "PENDING",
        "PROCESSING",
        "COMPLETED",
        "FAILED",
        "REFUNDED",
        "CANCELLED",
      ],
      referral_status: ["PENDING", "COMPLETED", "REWARDED", "EXPIRED"],
      user_role: ["CUSTOMER", "ADMIN", "SUPER_ADMIN"],
    },
  },
} as const
