// =============================================================================
// GLŌRA BEAUTY — Database Types
// Auto-generated from glora_beauty_schema.sql v1.0
// Run `supabase gen types typescript --local > src/types/database.ts` to refresh
// =============================================================================

// ─── ENUMS ────────────────────────────────────────────────────────────────────

export type UserRole = 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN'

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED'

export type PaymentMethod = 'CARD' | 'COD' | 'WALLET' | 'INSTALLMENT'

export type PaymentStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'REFUNDED'
  | 'CANCELLED'

export type CouponType = 'PERCENTAGE' | 'FIXED' | 'FREE_SHIPPING' | 'BOGO'

export type LoyaltyTxType = 'EARN' | 'REDEEM' | 'BONUS' | 'EXPIRE' | 'ADJUST'

export type ReferralStatus = 'PENDING' | 'COMPLETED' | 'REWARDED' | 'EXPIRED'

export type DeliveryMethod = 'STANDARD' | 'EXPRESS' | 'SAME_DAY'

export type BlogStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

// ─── TABLE ROW TYPES ──────────────────────────────────────────────────────────

export interface User {
  id: string
  email: string
  phone: string | null
  first_name: string
  last_name: string
  avatar_url: string | null
  role: UserRole
  is_active: boolean
  email_verified: boolean
  phone_verified: boolean
  loyalty_points: number
  referral_code: string
  marketing_email: boolean
  marketing_sms: boolean
  marketing_whatsapp: boolean
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface Address {
  id: string
  user_id: string
  label: string | null
  full_name: string
  phone: string
  address_line1: string
  address_line2: string | null
  city: string
  governorate: string
  postal_code: string | null
  is_default: boolean
  latitude: number | null
  longitude: number | null
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface Brand {
  id: string
  name: string
  slug: string
  logo_url: string | null
  description_en: string | null
  description_ar: string | null
  website_url: string | null
  is_active: boolean
  sort_order: number
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name_en: string
  name_ar: string
  slug: string
  description_en: string | null
  description_ar: string | null
  parent_id: string | null
  level: 1 | 2 | 3
  sort_order: number
  image_url: string | null
  is_active: boolean
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  slug: string
  name_en: string
  name_ar: string
  desc_en: string | null
  desc_ar: string | null
  brand_id: string
  category_id: string
  base_price: number
  sale_price: number | null
  is_featured: boolean
  is_active: boolean
  avg_rating: number
  review_count: number
  meta_title_en: string | null
  meta_title_ar: string | null
  meta_desc_en: string | null
  meta_desc_ar: string | null
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface ProductVariant {
  id: string
  product_id: string
  sku: string
  shade: string | null
  hex_code: string | null
  size: string | null
  price_override: number | null
  image_url: string | null
  is_active: boolean
  sort_order: number
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface ProductImage {
  id: string
  product_id: string
  url: string
  alt_text_en: string | null
  alt_text_ar: string | null
  sort_order: number
  is_primary: boolean
  created_at: string
}

export interface Inventory {
  id: string
  variant_id: string
  qty_available: number
  qty_reserved: number
  reorder_point: number
  last_restocked: string | null
  created_at: string
  updated_at: string
}

export interface Coupon {
  id: string
  code: string
  type: CouponType
  value: number
  min_order_amount: number | null
  max_discount: number | null
  usage_limit: number | null
  usage_count: number
  user_limit: number | null
  start_date: string
  end_date: string
  is_active: boolean
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  order_number: string
  user_id: string | null
  guest_email: string | null
  guest_phone: string | null
  address_id: string
  status: OrderStatus
  delivery_method: DeliveryMethod
  subtotal: number
  discount_amount: number
  shipping_fee: number
  total: number
  coupon_id: string | null
  notes: string | null
  bosta_awb: string | null
  cod_otp_verified: boolean
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  variant_id: string
  product_name_en: string
  product_name_ar: string
  shade: string | null
  size: string | null
  sku: string
  qty: number
  unit_price: number
  total_price: number
}

export interface Payment {
  id: string
  order_id: string
  method: PaymentMethod
  status: PaymentStatus
  amount: number
  currency: string
  paymob_order_id: string | null
  paymob_transaction_id: string | null
  idempotency_key: string | null
  metadata: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

export interface Review {
  id: string
  product_id: string
  user_id: string
  order_id: string | null
  rating: number
  title: string | null
  body: string | null
  is_approved: boolean
  is_verified_purchase: boolean
  helpful_count: number
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface ReviewImage {
  id: string
  review_id: string
  url: string
  sort_order: number
  created_at: string
}

export interface WishlistItem {
  id: string
  user_id: string
  product_id: string
  created_at: string
}

export interface LoyaltyTransaction {
  id: string
  user_id: string
  order_id: string | null
  type: LoyaltyTxType
  points: number
  balance_after: number
  note: string | null
  created_at: string
}

export interface Referral {
  id: string
  referrer_id: string
  referee_id: string
  status: ReferralStatus
  reward_points: number
  created_at: string
  updated_at: string
}

export interface BlogPost {
  id: string
  slug: string
  title_en: string
  title_ar: string
  body_en: string | null
  body_ar: string | null
  excerpt_en: string | null
  excerpt_ar: string | null
  cover_image_url: string | null
  author_id: string
  status: BlogStatus
  published_at: string | null
  meta_title_en: string | null
  meta_title_ar: string | null
  meta_desc_en: string | null
  meta_desc_ar: string | null
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface BlogTag {
  id: string
  name_en: string
  name_ar: string
  slug: string
  created_at: string
}

export interface Governorate {
  id: number
  name_en: string
  name_ar: string
}

// ─── INSERT TYPES (omit auto-generated fields) ────────────────────────────────

export type UserInsert = Omit<User, 'id' | 'loyalty_points' | 'referral_code' | 'created_at' | 'updated_at'>
export type AddressInsert = Omit<Address, 'id' | 'created_at' | 'updated_at'>
export type ProductInsert = Omit<Product, 'id' | 'avg_rating' | 'review_count' | 'created_at' | 'updated_at'>
export type ProductVariantInsert = Omit<ProductVariant, 'id' | 'created_at' | 'updated_at'>
export type OrderInsert = Omit<Order, 'id' | 'created_at' | 'updated_at'>
export type PaymentInsert = Omit<Payment, 'id' | 'created_at' | 'updated_at'>
export type ReviewInsert = Omit<Review, 'id' | 'helpful_count' | 'created_at' | 'updated_at'>

// ─── UPDATE TYPES (all fields optional except id) ─────────────────────────────

export type UserUpdate = Partial<Omit<User, 'id' | 'created_at'>>
export type AddressUpdate = Partial<Omit<Address, 'id' | 'created_at'>>
export type ProductUpdate = Partial<Omit<Product, 'id' | 'created_at'>>
export type OrderUpdate = Partial<Omit<Order, 'id' | 'created_at'>>

// ─── SUPABASE DATABASE SCHEMA TYPE ────────────────────────────────────────────
// Used to type the Supabase client: createClient<Database>()

export type Database = {
  public: {
    Tables: {
      users: {
        Row: User
        Insert: UserInsert
        Update: UserUpdate
      }
      addresses: {
        Row: Address
        Insert: AddressInsert
        Update: AddressUpdate
      }
      brands: {
        Row: Brand
        Insert: Omit<Brand, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Brand, 'id' | 'created_at'>>
      }
      categories: {
        Row: Category
        Insert: Omit<Category, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Category, 'id' | 'created_at'>>
      }
      products: {
        Row: Product
        Insert: ProductInsert
        Update: ProductUpdate
      }
      product_variants: {
        Row: ProductVariant
        Insert: ProductVariantInsert
        Update: Partial<Omit<ProductVariant, 'id' | 'created_at'>>
      }
      product_images: {
        Row: ProductImage
        Insert: Omit<ProductImage, 'id' | 'created_at'>
        Update: Partial<Omit<ProductImage, 'id' | 'created_at'>>
      }
      inventory: {
        Row: Inventory
        Insert: Omit<Inventory, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Inventory, 'id' | 'created_at'>>
      }
      coupons: {
        Row: Coupon
        Insert: Omit<Coupon, 'id' | 'usage_count' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Coupon, 'id' | 'created_at'>>
      }
      orders: {
        Row: Order
        Insert: OrderInsert
        Update: OrderUpdate
      }
      order_items: {
        Row: OrderItem
        Insert: Omit<OrderItem, 'id'>
        Update: never
      }
      payments: {
        Row: Payment
        Insert: PaymentInsert
        Update: Partial<Omit<Payment, 'id' | 'created_at'>>
      }
      reviews: {
        Row: Review
        Insert: ReviewInsert
        Update: Partial<Omit<Review, 'id' | 'created_at'>>
      }
      review_images: {
        Row: ReviewImage
        Insert: Omit<ReviewImage, 'id' | 'created_at'>
        Update: never
      }
      wishlist_items: {
        Row: WishlistItem
        Insert: Omit<WishlistItem, 'id' | 'created_at'>
        Update: never
      }
      loyalty_transactions: {
        Row: LoyaltyTransaction
        Insert: Omit<LoyaltyTransaction, 'id' | 'created_at'>
        Update: never
      }
      referrals: {
        Row: Referral
        Insert: Omit<Referral, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Referral, 'id' | 'created_at'>>
      }
      blog_posts: {
        Row: BlogPost
        Insert: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<BlogPost, 'id' | 'created_at'>>
      }
      blog_tags: {
        Row: BlogTag
        Insert: Omit<BlogTag, 'id' | 'created_at'>
        Update: Partial<Omit<BlogTag, 'id' | 'created_at'>>
      }
      governorates: {
        Row: Governorate
        Insert: Omit<Governorate, 'id'>
        Update: never
      }
    }
    Views: {
      mv_product_stats: {
        Row: {
          product_id: string
          avg_rating: number
          review_count: number
          total_sold: number
        }
      }
      mv_daily_revenue: {
        Row: {
          date: string
          revenue: number
          order_count: number
        }
      }
      mv_category_counts: {
        Row: {
          category_id: string
          active_product_count: number
        }
      }
    }
    Functions: {
      glora_search_products: {
        Args: {
          p_query: string
          p_lang?: string
          p_category?: string | null
          p_brand?: string | null
          p_min_price?: number | null
          p_max_price?: number | null
          p_page?: number
          p_limit?: number
        }
        Returns: {
          id: string
          slug: string
          name_en: string
          name_ar: string
          base_price: number
          sale_price: number | null
          avg_rating: number
          review_count: number
          primary_image: string | null
          rank: number
        }[]
      }
    }
    Enums: {
      user_role: UserRole
      order_status: OrderStatus
      payment_method: PaymentMethod
      payment_status: PaymentStatus
      coupon_type: CouponType
      loyalty_tx_type: LoyaltyTxType
      referral_status: ReferralStatus
      delivery_method: DeliveryMethod
      blog_status: BlogStatus
    }
  }
}