-- =============================================================================
-- GLŌRA BEAUTY — PostgreSQL Database Schema
-- Version: 1.0 | June 2026
-- Database: PostgreSQL 15+ (Supabase, Frankfurt / eu-central-1)
-- =============================================================================
-- Execution order:
--   1. Extensions
--   2. Helper functions & triggers
--   3. Tables (in dependency order)
--   4. Indexes
--   5. Row Level Security (RLS) policies
--   6. Business-logic triggers
-- =============================================================================


-- =============================================================================
-- SECTION 0 — EXTENSIONS
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";       -- gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pg_trgm";          -- trigram fuzzy search
CREATE EXTENSION IF NOT EXISTS "unaccent";         -- accent-insensitive search
CREATE EXTENSION IF NOT EXISTS "pg_cron";          -- scheduled jobs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";         -- encrypt / crypt helpers


-- =============================================================================
-- SECTION 1 — SHARED HELPER: updated_at AUTO-STAMP
-- =============================================================================

CREATE OR REPLACE FUNCTION glora_set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Convenience macro: attach the trigger to any table
-- Usage: SELECT glora_attach_updated_at('table_name');
CREATE OR REPLACE FUNCTION glora_attach_updated_at(tbl TEXT)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  EXECUTE format(
    'CREATE TRIGGER trg_%1$s_updated_at
       BEFORE UPDATE ON %1$I
       FOR EACH ROW EXECUTE FUNCTION glora_set_updated_at()',
    tbl
  );
END;
$$;


-- =============================================================================
-- SECTION 2 — ENUMS
-- =============================================================================

-- User roles
CREATE TYPE user_role AS ENUM ('CUSTOMER', 'ADMIN', 'SUPER_ADMIN');

-- Order lifecycle
CREATE TYPE order_status AS ENUM (
  'PENDING', 'CONFIRMED', 'PROCESSING',
  'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'
);

-- Payment methods
CREATE TYPE payment_method AS ENUM ('CARD', 'COD', 'WALLET', 'INSTALLMENT');

-- Payment statuses
CREATE TYPE payment_status AS ENUM (
  'PENDING', 'PROCESSING', 'COMPLETED',
  'FAILED', 'REFUNDED', 'CANCELLED'
);

-- Coupon types
CREATE TYPE coupon_type AS ENUM ('PERCENTAGE', 'FIXED', 'FREE_SHIPPING', 'BOGO');

-- Loyalty transaction types
CREATE TYPE loyalty_tx_type AS ENUM ('EARN', 'REDEEM', 'BONUS', 'EXPIRE', 'ADJUST');

-- Referral lifecycle
CREATE TYPE referral_status AS ENUM ('PENDING', 'COMPLETED', 'REWARDED', 'EXPIRED');

-- Delivery methods
CREATE TYPE delivery_method AS ENUM ('STANDARD', 'EXPRESS', 'SAME_DAY');

-- Blog post statuses
CREATE TYPE blog_status AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');


-- =============================================================================
-- SECTION 3 — CORE TABLES
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 3.1  USERS
-- Supabase Auth (auth.users) is the SSO anchor.
-- This table extends it with application-level fields.
-- The id column MUST match auth.users.id for RLS auth.uid() lookups.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.users (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Supabase Auth links: email + phone are synced from auth.users by trigger
  email             TEXT        NOT NULL UNIQUE,
  phone             TEXT        UNIQUE,
  first_name        TEXT        NOT NULL CHECK (char_length(first_name) BETWEEN 2 AND 50),
  last_name         TEXT        NOT NULL CHECK (char_length(last_name) BETWEEN 2 AND 50),
  avatar_url        TEXT,
  role              user_role   NOT NULL DEFAULT 'CUSTOMER',
  is_active         BOOLEAN     NOT NULL DEFAULT TRUE,
  email_verified    BOOLEAN     NOT NULL DEFAULT FALSE,
  phone_verified    BOOLEAN     NOT NULL DEFAULT FALSE,
  loyalty_points    INTEGER     NOT NULL DEFAULT 0 CHECK (loyalty_points >= 0),
  referral_code     TEXT        UNIQUE NOT NULL DEFAULT SUBSTRING(gen_random_uuid()::TEXT, 1, 8),
  -- Marketing preferences (explicit opt-in – required for Egypt)
  marketing_email   BOOLEAN     NOT NULL DEFAULT FALSE,
  marketing_sms     BOOLEAN     NOT NULL DEFAULT FALSE,
  marketing_whatsapp BOOLEAN    NOT NULL DEFAULT FALSE,
  -- Soft delete
  deleted_at        TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

SELECT glora_attach_updated_at('users');

-- ---------------------------------------------------------------------------
-- 3.2  ADDRESSES
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.addresses (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  label           TEXT,                             -- "Home", "Work"
  full_name       TEXT        NOT NULL,
  phone           TEXT        NOT NULL,
  address_line1   TEXT        NOT NULL,
  address_line2   TEXT,
  city            TEXT        NOT NULL,
  governorate     TEXT        NOT NULL,             -- e.g. "Cairo", "Alexandria"
  postal_code     TEXT,
  is_default      BOOLEAN     NOT NULL DEFAULT FALSE,
  -- Coordinates for delivery-zone matching
  latitude        NUMERIC(10, 7),
  longitude       NUMERIC(10, 7),
  -- Soft delete
  deleted_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

SELECT glora_attach_updated_at('addresses');

-- ---------------------------------------------------------------------------
-- 3.3  BRANDS
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.brands (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT        NOT NULL,
  slug            TEXT        NOT NULL UNIQUE,
  logo_url        TEXT,
  description_en  TEXT,
  description_ar  TEXT,
  website_url     TEXT,
  is_active       BOOLEAN     NOT NULL DEFAULT TRUE,
  sort_order      INTEGER     NOT NULL DEFAULT 0,
  deleted_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

SELECT glora_attach_updated_at('brands');

-- ---------------------------------------------------------------------------
-- 3.4  CATEGORIES  (self-referential tree, max 3 levels)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.categories (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en         TEXT        NOT NULL,
  name_ar         TEXT        NOT NULL,
  slug            TEXT        NOT NULL UNIQUE,
  description_en  TEXT,
  description_ar  TEXT,
  parent_id       UUID        REFERENCES public.categories(id) ON DELETE SET NULL,
  level           INTEGER     NOT NULL DEFAULT 1 CHECK (level IN (1, 2, 3)),
  sort_order      INTEGER     NOT NULL DEFAULT 0,
  image_url       TEXT,
  is_active       BOOLEAN     NOT NULL DEFAULT TRUE,
  deleted_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Ensure level consistency: root nodes have no parent
  CONSTRAINT chk_category_root CHECK (
    (level = 1 AND parent_id IS NULL) OR (level > 1 AND parent_id IS NOT NULL)
  )
);

SELECT glora_attach_updated_at('categories');

-- ---------------------------------------------------------------------------
-- 3.5  PRODUCTS
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.products (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT          NOT NULL UNIQUE,
  name_en         TEXT          NOT NULL,
  name_ar         TEXT          NOT NULL,
  desc_en         TEXT,
  desc_ar         TEXT,
  brand_id        UUID          NOT NULL REFERENCES public.brands(id) ON DELETE RESTRICT,
  category_id     UUID          NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  base_price      NUMERIC(12,2) NOT NULL CHECK (base_price > 0),
  sale_price      NUMERIC(12,2) CHECK (sale_price > 0 AND sale_price < base_price),
  is_featured     BOOLEAN       NOT NULL DEFAULT FALSE,
  is_active       BOOLEAN       NOT NULL DEFAULT TRUE,
  avg_rating      NUMERIC(3,2)  NOT NULL DEFAULT 0 CHECK (avg_rating >= 0 AND avg_rating <= 5),
  review_count    INTEGER       NOT NULL DEFAULT 0 CHECK (review_count >= 0),
  -- SEO
  meta_title_en   TEXT,
  meta_title_ar   TEXT,
  meta_desc_en    TEXT,
  meta_desc_ar    TEXT,
  -- Full-text search vectors (maintained by trigger)
  fts_en          TSVECTOR,
  fts_ar          TSVECTOR,
  -- Soft delete
  deleted_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

SELECT glora_attach_updated_at('products');

-- ---------------------------------------------------------------------------
-- 3.6  PRODUCT VARIANTS  (shade / size / SKU)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.product_variants (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id      UUID          NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  sku             TEXT          NOT NULL UNIQUE,
  shade           TEXT,
  hex_code        TEXT          CHECK (hex_code ~ '^#[0-9A-Fa-f]{6}$'),
  size            TEXT,                             -- e.g. "30ml", "15g"
  price_override  NUMERIC(12,2) CHECK (price_override > 0),  -- NULL = inherit from product
  image_url       TEXT,
  is_active       BOOLEAN       NOT NULL DEFAULT TRUE,
  sort_order      INTEGER       NOT NULL DEFAULT 0,
  deleted_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

SELECT glora_attach_updated_at('product_variants');

-- ---------------------------------------------------------------------------
-- 3.7  PRODUCT IMAGES
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.product_images (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id      UUID        NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  url             TEXT        NOT NULL,
  alt_text_en     TEXT,
  alt_text_ar     TEXT,
  sort_order      INTEGER     NOT NULL DEFAULT 0,
  is_primary      BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 3.8  INVENTORY  (1-to-1 with product_variants)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.inventory (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id      UUID        NOT NULL UNIQUE REFERENCES public.product_variants(id) ON DELETE CASCADE,
  qty_available   INTEGER     NOT NULL DEFAULT 0 CHECK (qty_available >= 0),
  qty_reserved    INTEGER     NOT NULL DEFAULT 0 CHECK (qty_reserved >= 0),
  reorder_point   INTEGER     NOT NULL DEFAULT 10 CHECK (reorder_point >= 0),
  last_restocked  TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

SELECT glora_attach_updated_at('inventory');

-- ---------------------------------------------------------------------------
-- 3.9  COUPONS
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.coupons (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  code            TEXT          NOT NULL UNIQUE,
  type            coupon_type   NOT NULL,
  value           NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (value >= 0),
  min_order_amount NUMERIC(12,2) CHECK (min_order_amount >= 0),
  max_discount    NUMERIC(12,2) CHECK (max_discount >= 0),
  usage_limit     INTEGER       CHECK (usage_limit > 0),
  usage_count     INTEGER       NOT NULL DEFAULT 0 CHECK (usage_count >= 0),
  user_limit      INTEGER       CHECK (user_limit > 0),  -- max per customer
  start_date      TIMESTAMPTZ   NOT NULL,
  end_date        TIMESTAMPTZ   NOT NULL,
  is_active       BOOLEAN       NOT NULL DEFAULT TRUE,
  deleted_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_coupon_dates CHECK (end_date > start_date)
);

SELECT glora_attach_updated_at('coupons');

-- ---------------------------------------------------------------------------
-- 3.10  ORDERS
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.orders (
  id               UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number     TEXT          NOT NULL UNIQUE,
  user_id          UUID          REFERENCES public.users(id) ON DELETE SET NULL,
  guest_email      TEXT,
  guest_phone      TEXT,
  address_id       UUID          NOT NULL REFERENCES public.addresses(id) ON DELETE RESTRICT,
  status           order_status  NOT NULL DEFAULT 'PENDING',
  delivery_method  delivery_method NOT NULL DEFAULT 'STANDARD',
  subtotal         NUMERIC(12,2) NOT NULL CHECK (subtotal >= 0),
  discount_amount  NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
  shipping_fee     NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (shipping_fee >= 0),
  total            NUMERIC(12,2) NOT NULL CHECK (total >= 0),
  coupon_id        UUID          REFERENCES public.coupons(id) ON DELETE SET NULL,
  notes            TEXT,
  -- Bosta shipping
  bosta_awb        TEXT,
  -- COD fraud flags
  cod_otp_verified BOOLEAN       NOT NULL DEFAULT FALSE,
  created_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_order_total CHECK (
    total = subtotal - discount_amount + shipping_fee
  )
);

SELECT glora_attach_updated_at('orders');

-- ---------------------------------------------------------------------------
-- 3.11  ORDER ITEMS  (denormalised for historical accuracy)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.order_items (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        UUID          NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  variant_id      UUID          NOT NULL REFERENCES public.product_variants(id) ON DELETE RESTRICT,
  -- Snapshot fields (so refactoring product doesn't break history)
  product_name_en TEXT          NOT NULL,
  product_name_ar TEXT          NOT NULL,
  shade           TEXT,
  size            TEXT,
  sku             TEXT          NOT NULL,
  qty             INTEGER       NOT NULL CHECK (qty > 0),
  unit_price      NUMERIC(12,2) NOT NULL CHECK (unit_price >= 0),
  total_price     NUMERIC(12,2) NOT NULL CHECK (total_price >= 0),
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_order_item_total CHECK (total_price = unit_price * qty)
);

SELECT glora_attach_updated_at('order_items');

-- ---------------------------------------------------------------------------
-- 3.12  PAYMENTS
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.payments (
  id               UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id         UUID            NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  method           payment_method  NOT NULL,
  amount           NUMERIC(12,2)   NOT NULL CHECK (amount > 0),
  status           payment_status  NOT NULL DEFAULT 'PENDING',
  transaction_ref  TEXT,
  gateway_response JSONB,
  idempotency_key  TEXT            UNIQUE,
  paymob_order_id  TEXT,
  created_at       TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

SELECT glora_attach_updated_at('payments');

-- ---------------------------------------------------------------------------
-- 3.13  REVIEWS
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.reviews (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID        NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  product_id      UUID        NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  order_id        UUID        REFERENCES public.orders(id) ON DELETE SET NULL,
  rating          SMALLINT    NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title           TEXT        CHECK (char_length(title) <= 200),
  body            TEXT        NOT NULL CHECK (char_length(body) >= 10),
  is_verified     BOOLEAN     NOT NULL DEFAULT FALSE,
  is_approved     BOOLEAN     NOT NULL DEFAULT FALSE,
  helpful_count   INTEGER     NOT NULL DEFAULT 0,
  deleted_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- One review per product per user
  UNIQUE (user_id, product_id)
);

SELECT glora_attach_updated_at('reviews');

-- ---------------------------------------------------------------------------
-- 3.14  REVIEW IMAGES
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.review_images (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id   UUID        NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  url         TEXT        NOT NULL,
  sort_order  INTEGER     NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 3.15  WISHLIST ITEMS
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.wishlist_items (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  product_id  UUID        NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, product_id)
);

-- ---------------------------------------------------------------------------
-- 3.16  LOYALTY TRANSACTIONS  (immutable ledger)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.loyalty_transactions (
  id            UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID            NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  type          loyalty_tx_type NOT NULL,
  points        INTEGER         NOT NULL,  -- positive = earn, negative = redeem/expire
  description   TEXT            NOT NULL,
  order_id      UUID            REFERENCES public.orders(id) ON DELETE SET NULL,
  balance_after INTEGER         NOT NULL,
  created_at    TIMESTAMPTZ     NOT NULL DEFAULT NOW()
  -- No updated_at — immutable ledger rows
);

-- ---------------------------------------------------------------------------
-- 3.17  REFERRALS
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.referrals (
  id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id     UUID            NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  referee_id      UUID            UNIQUE REFERENCES public.users(id) ON DELETE RESTRICT,
  referral_code   TEXT            NOT NULL,
  status          referral_status NOT NULL DEFAULT 'PENDING',
  reward_points   INTEGER,
  completed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

SELECT glora_attach_updated_at('referrals');

-- ---------------------------------------------------------------------------
-- 3.18  BLOG POSTS  (bilingual SEO content)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT        NOT NULL UNIQUE,
  title_en        TEXT        NOT NULL,
  title_ar        TEXT        NOT NULL,
  body_en         TEXT,
  body_ar         TEXT,
  excerpt_en      TEXT,
  excerpt_ar      TEXT,
  cover_image_url TEXT,
  author_id       UUID        NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  status          blog_status NOT NULL DEFAULT 'DRAFT',
  published_at    TIMESTAMPTZ,
  meta_title_en   TEXT,
  meta_title_ar   TEXT,
  meta_desc_en    TEXT,
  meta_desc_ar    TEXT,
  -- FTS
  fts_en          TSVECTOR,
  fts_ar          TSVECTOR,
  deleted_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

SELECT glora_attach_updated_at('blog_posts');

-- ---------------------------------------------------------------------------
-- 3.19  ORDER STATUS HISTORY  (audit trail / timeline)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.order_status_history (
  id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID         NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  old_status  order_status,
  new_status  order_status NOT NULL,
  notes       TEXT,
  changed_by  UUID         REFERENCES public.users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 3.20  ADMIN ACTION LOG  (security audit trail)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.admin_action_log (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id    UUID        NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  action      TEXT        NOT NULL,
  entity      TEXT        NOT NULL,   -- e.g. 'products', 'orders'
  entity_id   UUID,
  old_value   JSONB,
  new_value   JSONB,
  ip_address  INET,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 3.21  APPLICATION EVENTS  (observability / analytics, 90-day retention)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.app_events (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        REFERENCES public.users(id) ON DELETE SET NULL,
  session_id  TEXT,
  event_name  TEXT        NOT NULL,
  properties  JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
) PARTITION BY RANGE (created_at);

-- Auto-create monthly partitions for app_events (2026 baseline)
CREATE TABLE IF NOT EXISTS public.app_events_2026_06
  PARTITION OF public.app_events
  FOR VALUES FROM ('2026-06-01') TO ('2026-07-01');

CREATE TABLE IF NOT EXISTS public.app_events_2026_07
  PARTITION OF public.app_events
  FOR VALUES FROM ('2026-07-01') TO ('2026-08-01');

CREATE TABLE IF NOT EXISTS public.app_events_2026_08
  PARTITION OF public.app_events
  FOR VALUES FROM ('2026-08-01') TO ('2026-09-01');

CREATE TABLE IF NOT EXISTS public.app_events_2026_09
  PARTITION OF public.app_events
  FOR VALUES FROM ('2026-09-01') TO ('2026-10-01');

CREATE TABLE IF NOT EXISTS public.app_events_2026_10
  PARTITION OF public.app_events
  FOR VALUES FROM ('2026-10-01') TO ('2026-11-01');

CREATE TABLE IF NOT EXISTS public.app_events_2026_11
  PARTITION OF public.app_events
  FOR VALUES FROM ('2026-11-01') TO ('2026-12-01');

CREATE TABLE IF NOT EXISTS public.app_events_2026_12
  PARTITION OF public.app_events
  FOR VALUES FROM ('2026-12-01') TO ('2027-01-01');


-- =============================================================================
-- SECTION 4 — INDEXES
-- =============================================================================

-- ── USERS ────────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_users_email              ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone              ON public.users(phone);
CREATE INDEX IF NOT EXISTS idx_users_referral_code      ON public.users(referral_code);
CREATE INDEX IF NOT EXISTS idx_users_role               ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_active             ON public.users(is_active) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_users_created            ON public.users(created_at DESC);

-- ── ADDRESSES ────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_addresses_user           ON public.addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_addresses_default        ON public.addresses(user_id, is_default)
  WHERE is_default = TRUE AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_addresses_governorate    ON public.addresses(governorate);

-- ── BRANDS ───────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_brands_slug              ON public.brands(slug);
CREATE INDEX IF NOT EXISTS idx_brands_active            ON public.brands(is_active) WHERE deleted_at IS NULL;

-- ── CATEGORIES ───────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_categories_slug          ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent        ON public.categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_level         ON public.categories(level, is_active) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_categories_sort          ON public.categories(sort_order) WHERE deleted_at IS NULL;

-- ── PRODUCTS ─────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_products_slug            ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category        ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand           ON public.products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_featured        ON public.products(is_featured, is_active)
  WHERE is_featured = TRUE AND is_active = TRUE AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_products_active_price    ON public.products(is_active, base_price)
  WHERE is_active = TRUE AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_products_rating          ON public.products(avg_rating DESC)
  WHERE is_active = TRUE AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_products_created         ON public.products(created_at DESC);
-- Full-text search
CREATE INDEX IF NOT EXISTS idx_products_fts_en          ON public.products USING GIN(fts_en);
CREATE INDEX IF NOT EXISTS idx_products_fts_ar          ON public.products USING GIN(fts_ar);
-- Trigram (partial match / autocomplete)
CREATE INDEX IF NOT EXISTS idx_products_trgm_name_en    ON public.products USING GIN(name_en gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_products_trgm_name_ar    ON public.products USING GIN(name_ar gin_trgm_ops);

-- ── PRODUCT VARIANTS ─────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_variants_product         ON public.product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_variants_sku             ON public.product_variants(sku);
CREATE INDEX IF NOT EXISTS idx_variants_active          ON public.product_variants(is_active)
  WHERE deleted_at IS NULL;

-- ── PRODUCT IMAGES ───────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_product_images_product   ON public.product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_primary   ON public.product_images(product_id, is_primary)
  WHERE is_primary = TRUE;
CREATE INDEX IF NOT EXISTS idx_product_images_sort      ON public.product_images(product_id, sort_order);

-- ── INVENTORY ────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_inventory_variant        ON public.inventory(variant_id);
CREATE INDEX IF NOT EXISTS idx_inventory_low_stock      ON public.inventory(qty_available, reorder_point)
  WHERE qty_available <= reorder_point;
CREATE INDEX IF NOT EXISTS idx_inventory_out_of_stock   ON public.inventory(qty_available)
  WHERE qty_available = 0;

-- ── COUPONS ──────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_coupons_code             ON public.coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_active           ON public.coupons(is_active, start_date, end_date)
  WHERE is_active = TRUE AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_coupons_end_date         ON public.coupons(end_date)
  WHERE is_active = TRUE AND deleted_at IS NULL;

-- ── ORDERS ───────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_orders_user              ON public.orders(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_orders_number            ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status            ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created           ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_coupon            ON public.orders(coupon_id) WHERE coupon_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_orders_bosta_awb         ON public.orders(bosta_awb) WHERE bosta_awb IS NOT NULL;

-- ── ORDER ITEMS ──────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_order_items_order        ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_variant      ON public.order_items(variant_id);

-- ── PAYMENTS ─────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_payments_order           ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_status          ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_method_status   ON public.payments(method, status);
CREATE INDEX IF NOT EXISTS idx_payments_idempotency     ON public.payments(idempotency_key)
  WHERE idempotency_key IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_payments_paymob_order    ON public.payments(paymob_order_id)
  WHERE paymob_order_id IS NOT NULL;

-- ── REVIEWS ──────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_reviews_product          ON public.reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user             ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_order            ON public.reviews(order_id) WHERE order_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_reviews_approved         ON public.reviews(product_id, is_approved)
  WHERE is_approved = TRUE AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_reviews_rating           ON public.reviews(product_id, rating)
  WHERE is_approved = TRUE AND deleted_at IS NULL;

-- ── REVIEW IMAGES ────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_review_images_review     ON public.review_images(review_id);

-- ── WISHLIST ─────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_wishlist_user            ON public.wishlist_items(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_product         ON public.wishlist_items(product_id);

-- ── LOYALTY TRANSACTIONS ─────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_loyalty_user             ON public.loyalty_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_order            ON public.loyalty_transactions(order_id)
  WHERE order_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_loyalty_type             ON public.loyalty_transactions(user_id, type);
CREATE INDEX IF NOT EXISTS idx_loyalty_created          ON public.loyalty_transactions(created_at DESC);

-- ── REFERRALS ────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_referrals_referrer       ON public.referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referee        ON public.referrals(referee_id) WHERE referee_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_referrals_code           ON public.referrals(referral_code);
CREATE INDEX IF NOT EXISTS idx_referrals_status         ON public.referrals(status);

-- ── BLOG POSTS ───────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_blog_slug                ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_status              ON public.blog_posts(status, published_at DESC)
  WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_blog_fts_en              ON public.blog_posts USING GIN(fts_en);
CREATE INDEX IF NOT EXISTS idx_blog_fts_ar              ON public.blog_posts USING GIN(fts_ar);

-- ── ORDER STATUS HISTORY ─────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_order_status_hist_order  ON public.order_status_history(order_id);
CREATE INDEX IF NOT EXISTS idx_order_status_hist_time   ON public.order_status_history(created_at DESC);

-- ── ADMIN ACTION LOG ─────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_admin_log_admin          ON public.admin_action_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_log_entity         ON public.admin_action_log(entity, entity_id);
CREATE INDEX IF NOT EXISTS idx_admin_log_created        ON public.admin_action_log(created_at DESC);

-- ── APP EVENTS ───────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_app_events_user          ON public.app_events(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_app_events_name          ON public.app_events(event_name, created_at DESC);


-- =============================================================================
-- SECTION 5 — ROW LEVEL SECURITY (RLS)
-- =============================================================================

-- Enable RLS on every application table
ALTER TABLE public.users                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_images         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_transactions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_action_log      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_events            ENABLE ROW LEVEL SECURITY;

-- ── Shared helper: is the current JWT an admin or super-admin? ────────────────
CREATE OR REPLACE FUNCTION glora_is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
      AND role IN ('ADMIN', 'SUPER_ADMIN')
      AND deleted_at IS NULL
  );
$$;

-- ── Shared helper: is the current JWT a super-admin? ─────────────────────────
CREATE OR REPLACE FUNCTION glora_is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
      AND role = 'SUPER_ADMIN'
      AND deleted_at IS NULL
  );
$$;


-- ── 5.1  USERS ───────────────────────────────────────────────────────────────

-- Anyone can read their own profile
CREATE POLICY "users: read own profile"
  ON public.users FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Admins read all non-deleted users
CREATE POLICY "users: admin read all"
  ON public.users FOR SELECT
  TO authenticated
  USING (glora_is_admin() AND deleted_at IS NULL);

-- Users update own profile (not role)
CREATE POLICY "users: update own profile"
  ON public.users FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid() AND role = (SELECT role FROM public.users WHERE id = auth.uid()));

-- Super-admin can update any user (incl. role changes)
CREATE POLICY "users: super-admin update any"
  ON public.users FOR UPDATE
  TO authenticated
  USING (glora_is_super_admin());

-- Insert handled by Supabase Auth trigger (service_role), no client policy needed
-- Delete: soft-delete only via UPDATE (no DELETE policy exposed to client)


-- ── 5.2  ADDRESSES ───────────────────────────────────────────────────────────

CREATE POLICY "addresses: read own"
  ON public.addresses FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() AND deleted_at IS NULL);

CREATE POLICY "addresses: admin read all"
  ON public.addresses FOR SELECT
  TO authenticated
  USING (glora_is_admin());

CREATE POLICY "addresses: insert own"
  ON public.addresses FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "addresses: update own"
  ON public.addresses FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() AND deleted_at IS NULL)
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "addresses: delete own"
  ON public.addresses FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());


-- ── 5.3  BRANDS ──────────────────────────────────────────────────────────────

CREATE POLICY "brands: public read active"
  ON public.brands FOR SELECT
  TO anon, authenticated
  USING (is_active = TRUE AND deleted_at IS NULL);

CREATE POLICY "brands: admin full access"
  ON public.brands FOR ALL
  TO authenticated
  USING (glora_is_admin());


-- ── 5.4  CATEGORIES ──────────────────────────────────────────────────────────

CREATE POLICY "categories: public read active"
  ON public.categories FOR SELECT
  TO anon, authenticated
  USING (is_active = TRUE AND deleted_at IS NULL);

CREATE POLICY "categories: admin full access"
  ON public.categories FOR ALL
  TO authenticated
  USING (glora_is_admin());


-- ── 5.5  PRODUCTS ────────────────────────────────────────────────────────────

CREATE POLICY "products: public read active"
  ON public.products FOR SELECT
  TO anon, authenticated
  USING (is_active = TRUE AND deleted_at IS NULL);

CREATE POLICY "products: admin read all"
  ON public.products FOR SELECT
  TO authenticated
  USING (glora_is_admin());

CREATE POLICY "products: admin write"
  ON public.products FOR INSERT, UPDATE, DELETE
  TO authenticated
  USING (glora_is_admin())
  WITH CHECK (glora_is_admin());


-- ── 5.6  PRODUCT VARIANTS ────────────────────────────────────────────────────

CREATE POLICY "variants: public read active"
  ON public.product_variants FOR SELECT
  TO anon, authenticated
  USING (is_active = TRUE AND deleted_at IS NULL);

CREATE POLICY "variants: admin full access"
  ON public.product_variants FOR ALL
  TO authenticated
  USING (glora_is_admin());


-- ── 5.7  PRODUCT IMAGES ──────────────────────────────────────────────────────

CREATE POLICY "product_images: public read"
  ON public.product_images FOR SELECT
  TO anon, authenticated
  USING (TRUE);

CREATE POLICY "product_images: admin write"
  ON public.product_images FOR INSERT, UPDATE, DELETE
  TO authenticated
  USING (glora_is_admin())
  WITH CHECK (glora_is_admin());


-- ── 5.8  INVENTORY ───────────────────────────────────────────────────────────

-- Public can see qty_available to display stock badges
CREATE POLICY "inventory: public read qty"
  ON public.inventory FOR SELECT
  TO anon, authenticated
  USING (TRUE);

CREATE POLICY "inventory: admin write"
  ON public.inventory FOR INSERT, UPDATE, DELETE
  TO authenticated
  USING (glora_is_admin());

-- Edge functions use service_role which bypasses RLS for reservation logic


-- ── 5.9  COUPONS ─────────────────────────────────────────────────────────────

-- Customers cannot enumerate coupons (anti-scraping); they apply via checkout
CREATE POLICY "coupons: no direct public read"
  ON public.coupons FOR SELECT
  TO anon
  USING (FALSE);

-- Authenticated users can validate a specific coupon (via server action)
-- In practice, coupon reads go through Edge Functions (service_role).
CREATE POLICY "coupons: admin full access"
  ON public.coupons FOR ALL
  TO authenticated
  USING (glora_is_admin());


-- ── 5.10  ORDERS ─────────────────────────────────────────────────────────────

CREATE POLICY "orders: read own"
  ON public.orders FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "orders: admin read all"
  ON public.orders FOR SELECT
  TO authenticated
  USING (glora_is_admin());

-- Insert via service_role Edge Function (checkout flow); users do not INSERT directly
CREATE POLICY "orders: admin update status"
  ON public.orders FOR UPDATE
  TO authenticated
  USING (glora_is_admin());

-- Users may request cancellation (Edge Function validates and updates)
CREATE POLICY "orders: user cancel own"
  ON public.orders FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() AND status IN ('PENDING', 'CONFIRMED'))
  WITH CHECK (status = 'CANCELLED' AND user_id = auth.uid());


-- ── 5.11  ORDER ITEMS ────────────────────────────────────────────────────────

CREATE POLICY "order_items: read own"
  ON public.order_items FOR SELECT
  TO authenticated
  USING (
    order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid())
  );

CREATE POLICY "order_items: admin read all"
  ON public.order_items FOR SELECT
  TO authenticated
  USING (glora_is_admin());


-- ── 5.12  PAYMENTS ───────────────────────────────────────────────────────────

CREATE POLICY "payments: read own"
  ON public.payments FOR SELECT
  TO authenticated
  USING (
    order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid())
  );

CREATE POLICY "payments: admin read all"
  ON public.payments FOR SELECT
  TO authenticated
  USING (glora_is_admin());


-- ── 5.13  REVIEWS ────────────────────────────────────────────────────────────

CREATE POLICY "reviews: public read approved"
  ON public.reviews FOR SELECT
  TO anon, authenticated
  USING (is_approved = TRUE AND deleted_at IS NULL);

CREATE POLICY "reviews: user read own"
  ON public.reviews FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "reviews: user insert"
  ON public.reviews FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "reviews: user update own"
  ON public.reviews FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() AND is_approved = FALSE)   -- can't edit after approval
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "reviews: admin full access"
  ON public.reviews FOR ALL
  TO authenticated
  USING (glora_is_admin());


-- ── 5.14  REVIEW IMAGES ──────────────────────────────────────────────────────

CREATE POLICY "review_images: public read"
  ON public.review_images FOR SELECT
  TO anon, authenticated
  USING (
    review_id IN (
      SELECT id FROM public.reviews WHERE is_approved = TRUE AND deleted_at IS NULL
    )
  );

CREATE POLICY "review_images: user insert own"
  ON public.review_images FOR INSERT
  TO authenticated
  WITH CHECK (
    review_id IN (SELECT id FROM public.reviews WHERE user_id = auth.uid())
  );

CREATE POLICY "review_images: admin full access"
  ON public.review_images FOR ALL
  TO authenticated
  USING (glora_is_admin());


-- ── 5.15  WISHLIST ITEMS ─────────────────────────────────────────────────────

CREATE POLICY "wishlist: read own"
  ON public.wishlist_items FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "wishlist: insert own"
  ON public.wishlist_items FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "wishlist: delete own"
  ON public.wishlist_items FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());


-- ── 5.16  LOYALTY TRANSACTIONS ───────────────────────────────────────────────

CREATE POLICY "loyalty: read own"
  ON public.loyalty_transactions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "loyalty: admin read all"
  ON public.loyalty_transactions FOR SELECT
  TO authenticated
  USING (glora_is_admin());

-- Inserts only via service_role (Edge Functions); no client policy needed


-- ── 5.17  REFERRALS ──────────────────────────────────────────────────────────

CREATE POLICY "referrals: read own"
  ON public.referrals FOR SELECT
  TO authenticated
  USING (referrer_id = auth.uid() OR referee_id = auth.uid());

CREATE POLICY "referrals: admin read all"
  ON public.referrals FOR SELECT
  TO authenticated
  USING (glora_is_admin());


-- ── 5.18  BLOG POSTS ─────────────────────────────────────────────────────────

CREATE POLICY "blog: public read published"
  ON public.blog_posts FOR SELECT
  TO anon, authenticated
  USING (status = 'PUBLISHED' AND deleted_at IS NULL);

CREATE POLICY "blog: admin full access"
  ON public.blog_posts FOR ALL
  TO authenticated
  USING (glora_is_admin());


-- ── 5.19  ORDER STATUS HISTORY ───────────────────────────────────────────────

CREATE POLICY "order_status_hist: read own"
  ON public.order_status_history FOR SELECT
  TO authenticated
  USING (
    order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid())
  );

CREATE POLICY "order_status_hist: admin read all"
  ON public.order_status_history FOR SELECT
  TO authenticated
  USING (glora_is_admin());


-- ── 5.20  ADMIN ACTION LOG ───────────────────────────────────────────────────

CREATE POLICY "admin_log: super-admin read"
  ON public.admin_action_log FOR SELECT
  TO authenticated
  USING (glora_is_super_admin());


-- ── 5.21  APP EVENTS ─────────────────────────────────────────────────────────

CREATE POLICY "app_events: user read own"
  ON public.app_events FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "app_events: admin read all"
  ON public.app_events FOR SELECT
  TO authenticated
  USING (glora_is_admin());

-- Inserts via service_role only (Edge Functions / server-side tracking)


-- =============================================================================
-- SECTION 6 — BUSINESS-LOGIC TRIGGERS
-- =============================================================================

-- ── 6.1  PRODUCT FULL-TEXT SEARCH VECTORS ────────────────────────────────────

CREATE OR REPLACE FUNCTION glora_update_product_fts()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.fts_en := TO_TSVECTOR('english',
    COALESCE(NEW.name_en, '') || ' ' ||
    COALESCE(NEW.desc_en, '') || ' ' ||
    COALESCE(NEW.meta_title_en, '') || ' ' ||
    COALESCE(NEW.meta_desc_en, '')
  );
  NEW.fts_ar := TO_TSVECTOR('arabic',
    COALESCE(NEW.name_ar, '') || ' ' ||
    COALESCE(NEW.desc_ar, '') || ' ' ||
    COALESCE(NEW.meta_title_ar, '') || ' ' ||
    COALESCE(NEW.meta_desc_ar, '')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_products_fts
  BEFORE INSERT OR UPDATE OF name_en, desc_en, name_ar, desc_ar,
    meta_title_en, meta_desc_en, meta_title_ar, meta_desc_ar
  ON public.products
  FOR EACH ROW EXECUTE FUNCTION glora_update_product_fts();


-- ── 6.2  BLOG POST FULL-TEXT SEARCH VECTORS ──────────────────────────────────

CREATE OR REPLACE FUNCTION glora_update_blog_fts()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.fts_en := TO_TSVECTOR('english',
    COALESCE(NEW.title_en, '') || ' ' ||
    COALESCE(NEW.body_en, '') || ' ' ||
    COALESCE(NEW.excerpt_en, '')
  );
  NEW.fts_ar := TO_TSVECTOR('arabic',
    COALESCE(NEW.title_ar, '') || ' ' ||
    COALESCE(NEW.body_ar, '') || ' ' ||
    COALESCE(NEW.excerpt_ar, '')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_blog_fts
  BEFORE INSERT OR UPDATE OF title_en, body_en, title_ar, body_ar
  ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION glora_update_blog_fts();


-- ── 6.3  RECALCULATE PRODUCT RATING ON REVIEW INSERT / UPDATE ────────────────

CREATE OR REPLACE FUNCTION glora_recalc_product_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.products
  SET
    avg_rating   = COALESCE(
      (SELECT ROUND(AVG(rating)::NUMERIC, 2)
       FROM public.reviews
       WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)
         AND is_approved = TRUE
         AND deleted_at IS NULL),
      0
    ),
    review_count = COALESCE(
      (SELECT COUNT(*)
       FROM public.reviews
       WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)
         AND is_approved = TRUE
         AND deleted_at IS NULL),
      0
    )
  WHERE id = COALESCE(NEW.product_id, OLD.product_id);
  RETURN NULL;
END;
$$;

CREATE TRIGGER trg_review_rating_update
  AFTER INSERT OR UPDATE OF rating, is_approved, deleted_at
  ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION glora_recalc_product_rating();

CREATE TRIGGER trg_review_rating_delete
  AFTER DELETE
  ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION glora_recalc_product_rating();


-- ── 6.4  DECREMENT INVENTORY WHEN ORDER ITEM IS INSERTED ─────────────────────

CREATE OR REPLACE FUNCTION glora_decrement_inventory_on_order()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.inventory
  SET
    qty_available = qty_available - NEW.qty,
    qty_reserved  = GREATEST(qty_reserved - NEW.qty, 0)
  WHERE variant_id = NEW.variant_id;

  -- Raise if stock goes negative (shouldn't happen if Edge Function pre-checks)
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Inventory row not found for variant %', NEW.variant_id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_decrement_inventory
  AFTER INSERT
  ON public.order_items
  FOR EACH ROW EXECUTE FUNCTION glora_decrement_inventory_on_order();


-- ── 6.5  RESTORE INVENTORY WHEN ORDER IS CANCELLED ───────────────────────────

CREATE OR REPLACE FUNCTION glora_restore_inventory_on_cancel()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Only fire when status transitions to CANCELLED or REFUNDED
  IF NEW.status IN ('CANCELLED', 'REFUNDED') AND OLD.status NOT IN ('CANCELLED', 'REFUNDED') THEN
    UPDATE public.inventory inv
    SET qty_available = inv.qty_available + oi.qty
    FROM public.order_items oi
    WHERE oi.order_id = NEW.id
      AND inv.variant_id = oi.variant_id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_restore_inventory
  AFTER UPDATE OF status
  ON public.orders
  FOR EACH ROW EXECUTE FUNCTION glora_restore_inventory_on_cancel();


-- ── 6.6  CREDIT LOYALTY POINTS WHEN ORDER IS DELIVERED ───────────────────────
-- Rule: 1 EGP spent = 1 loyalty point (configurable via app logic)

CREATE OR REPLACE FUNCTION glora_award_loyalty_on_delivery()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_points INTEGER;
  v_balance INTEGER;
BEGIN
  -- Only fire on transition to DELIVERED
  IF NEW.status = 'DELIVERED' AND OLD.status <> 'DELIVERED' AND NEW.user_id IS NOT NULL THEN
    v_points := FLOOR(NEW.total)::INTEGER;  -- 1 point per EGP

    SELECT loyalty_points INTO v_balance
    FROM public.users WHERE id = NEW.user_id;

    v_balance := v_balance + v_points;

    -- Update user balance
    UPDATE public.users
    SET loyalty_points = v_balance
    WHERE id = NEW.user_id;

    -- Insert ledger entry
    INSERT INTO public.loyalty_transactions
      (user_id, type, points, description, order_id, balance_after)
    VALUES
      (NEW.user_id, 'EARN', v_points,
       'Order ' || NEW.order_number || ' delivered',
       NEW.id, v_balance);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_loyalty_on_delivery
  AFTER UPDATE OF status
  ON public.orders
  FOR EACH ROW EXECUTE FUNCTION glora_award_loyalty_on_delivery();


-- ── 6.7  RECORD ORDER STATUS HISTORY ON EVERY STATUS CHANGE ──────────────────

CREATE OR REPLACE FUNCTION glora_record_order_status_history()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.status <> OLD.status THEN
    INSERT INTO public.order_status_history
      (order_id, old_status, new_status, changed_by)
    VALUES
      (NEW.id, OLD.status, NEW.status, auth.uid());
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_order_status_history
  AFTER UPDATE OF status
  ON public.orders
  FOR EACH ROW EXECUTE FUNCTION glora_record_order_status_history();


-- ── 6.8  INCREMENT COUPON USAGE COUNT ON ORDER INSERT ────────────────────────

CREATE OR REPLACE FUNCTION glora_increment_coupon_usage()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.coupon_id IS NOT NULL THEN
    UPDATE public.coupons
    SET usage_count = usage_count + 1
    WHERE id = NEW.coupon_id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_coupon_usage
  AFTER INSERT
  ON public.orders
  FOR EACH ROW EXECUTE FUNCTION glora_increment_coupon_usage();


-- ── 6.9  ENFORCE SINGLE DEFAULT ADDRESS PER USER ─────────────────────────────

CREATE OR REPLACE FUNCTION glora_enforce_single_default_address()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.is_default = TRUE THEN
    UPDATE public.addresses
    SET is_default = FALSE
    WHERE user_id = NEW.user_id
      AND id <> NEW.id
      AND is_default = TRUE
      AND deleted_at IS NULL;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_single_default_address
  BEFORE INSERT OR UPDATE OF is_default
  ON public.addresses
  FOR EACH ROW
  WHEN (NEW.is_default = TRUE)
  EXECUTE FUNCTION glora_enforce_single_default_address();


-- ── 6.10  AUTO-GENERATE ORDER NUMBER ─────────────────────────────────────────

CREATE OR REPLACE FUNCTION glora_generate_order_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := 'GB-' ||
      TO_CHAR(NOW(), 'YYYYMMDD') || '-' ||
      LPAD(FLOOR(RANDOM() * 9999 + 1)::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_order_number
  BEFORE INSERT
  ON public.orders
  FOR EACH ROW
  WHEN (NEW.order_number IS NULL OR NEW.order_number = '')
  EXECUTE FUNCTION glora_generate_order_number();


-- ── 6.11  SYNC SUPABASE AUTH USER → public.users ON FIRST SIGN-IN ────────────
-- This trigger fires when Supabase Auth creates a new auth.users record.
-- It inserts a corresponding row in public.users.

CREATE OR REPLACE FUNCTION glora_handle_new_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'Guest'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', 'User'),
    'CUSTOMER'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER trg_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION glora_handle_new_auth_user();


-- =============================================================================
-- SECTION 7 — MATERIALIZED VIEWS  (refresh on schedule via pg_cron)
-- =============================================================================

-- ── 7.1  Product Stats (rating + sales counts) ───────────────────────────────

CREATE MATERIALIZED VIEW IF NOT EXISTS public.mv_product_stats AS
SELECT
  p.id                                      AS product_id,
  COUNT(DISTINCT r.id)                      AS approved_review_count,
  ROUND(AVG(r.rating)::NUMERIC, 2)          AS avg_rating,
  COUNT(DISTINCT oi.id)                     AS total_units_sold,
  COALESCE(SUM(oi.total_price), 0)          AS total_revenue
FROM public.products p
LEFT JOIN public.reviews r
  ON r.product_id = p.id AND r.is_approved = TRUE AND r.deleted_at IS NULL
LEFT JOIN public.order_items oi
  ON oi.variant_id IN (
    SELECT id FROM public.product_variants WHERE product_id = p.id
  )
LEFT JOIN public.orders o
  ON o.id = oi.order_id AND o.status = 'DELIVERED'
WHERE p.deleted_at IS NULL
GROUP BY p.id;

CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_product_stats_product
  ON public.mv_product_stats(product_id);


-- ── 7.2  Daily Revenue ───────────────────────────────────────────────────────

CREATE MATERIALIZED VIEW IF NOT EXISTS public.mv_daily_revenue AS
SELECT
  DATE_TRUNC('day', o.created_at)           AS day,
  COUNT(DISTINCT o.id)                      AS order_count,
  COUNT(DISTINCT o.user_id)                 AS unique_customers,
  SUM(o.total)                              AS gross_revenue,
  SUM(o.discount_amount)                    AS total_discounts,
  SUM(o.shipping_fee)                       AS total_shipping,
  ROUND(AVG(o.total)::NUMERIC, 2)           AS avg_order_value
FROM public.orders o
WHERE o.status NOT IN ('CANCELLED', 'REFUNDED')
GROUP BY DATE_TRUNC('day', o.created_at);

CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_daily_revenue_day
  ON public.mv_daily_revenue(day);


-- ── 7.3  Category Product Counts ─────────────────────────────────────────────

CREATE MATERIALIZED VIEW IF NOT EXISTS public.mv_category_counts AS
SELECT
  c.id                                      AS category_id,
  COUNT(p.id)                               AS active_product_count
FROM public.categories c
LEFT JOIN public.products p
  ON p.category_id = c.id AND p.is_active = TRUE AND p.deleted_at IS NULL
WHERE c.deleted_at IS NULL
GROUP BY c.id;

CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_category_counts_cat
  ON public.mv_category_counts(category_id);


-- =============================================================================
-- SECTION 8 — pg_cron SCHEDULED JOBS
-- =============================================================================

-- Refresh materialized views every 15 minutes
SELECT cron.schedule(
  'refresh-mv-product-stats',
  '*/15 * * * *',
  'REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_product_stats'
);

-- Refresh daily revenue at midnight
SELECT cron.schedule(
  'refresh-mv-daily-revenue',
  '0 0 * * *',
  'REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_daily_revenue'
);

-- Refresh category counts every 30 minutes
SELECT cron.schedule(
  'refresh-mv-category-counts',
  '*/30 * * * *',
  'REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_category_counts'
);

-- Hard-purge soft-deleted records older than 1 year (runs daily at 02:00)
SELECT cron.schedule(
  'purge-soft-deleted-records',
  '0 2 * * *',
  $$
    DELETE FROM public.products      WHERE deleted_at < NOW() - INTERVAL '1 year';
    DELETE FROM public.product_variants WHERE deleted_at < NOW() - INTERVAL '1 year';
    DELETE FROM public.categories    WHERE deleted_at < NOW() - INTERVAL '1 year';
    DELETE FROM public.brands        WHERE deleted_at < NOW() - INTERVAL '1 year';
    DELETE FROM public.coupons       WHERE deleted_at < NOW() - INTERVAL '1 year';
    DELETE FROM public.users         WHERE deleted_at < NOW() - INTERVAL '1 year';
    DELETE FROM public.addresses     WHERE deleted_at < NOW() - INTERVAL '1 year';
    DELETE FROM public.reviews       WHERE deleted_at < NOW() - INTERVAL '1 year';
    DELETE FROM public.blog_posts    WHERE deleted_at < NOW() - INTERVAL '1 year';
  $$
);

-- Expire stale PENDING referrals older than 30 days (runs daily at 03:00)
SELECT cron.schedule(
  'expire-stale-referrals',
  '0 3 * * *',
  $$
    UPDATE public.referrals
    SET status = 'EXPIRED'
    WHERE status = 'PENDING'
      AND created_at < NOW() - INTERVAL '30 days';
  $$
);

-- Expire unused coupons (mark is_active = false after end_date)
SELECT cron.schedule(
  'deactivate-expired-coupons',
  '0 1 * * *',
  $$
    UPDATE public.coupons
    SET is_active = FALSE
    WHERE is_active = TRUE
      AND end_date < NOW()
      AND deleted_at IS NULL;
  $$
);

-- Purge old app_events beyond 90-day retention (runs weekly)
SELECT cron.schedule(
  'purge-old-app-events',
  '0 4 * * 0',
  $$
    DELETE FROM public.app_events
    WHERE created_at < NOW() - INTERVAL '90 days';
  $$
);


-- =============================================================================
-- SECTION 9 — SEED DATA: EGYPTIAN GOVERNORATES
-- Used for address validation / delivery-zone logic
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.governorates (
  id    SMALLSERIAL PRIMARY KEY,
  name_en TEXT NOT NULL UNIQUE,
  name_ar TEXT NOT NULL UNIQUE
);

ALTER TABLE public.governorates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "governorates: public read"
  ON public.governorates FOR SELECT
  TO anon, authenticated
  USING (TRUE);

INSERT INTO public.governorates (name_en, name_ar) VALUES
  ('Cairo',          'القاهرة'),
  ('Giza',           'الجيزة'),
  ('Alexandria',     'الإسكندرية'),
  ('Dakahlia',       'الدقهلية'),
  ('Red Sea',        'البحر الأحمر'),
  ('Beheira',        'البحيرة'),
  ('Fayoum',         'الفيوم'),
  ('Gharbia',        'الغربية'),
  ('Ismailia',       'الإسماعيلية'),
  ('Menofia',        'المنوفية'),
  ('Minya',          'المنيا'),
  ('Qaliubiya',      'القليوبية'),
  ('New Valley',     'الوادي الجديد'),
  ('North Sinai',    'شمال سيناء'),
  ('Port Said',      'بورسعيد'),
  ('Qalyubia',       'القليوبية'),
  ('Sharqia',        'الشرقية'),
  ('South Sinai',    'جنوب سيناء'),
  ('Suez',           'السويس'),
  ('Aswan',          'أسوان'),
  ('Assiut',         'أسيوط'),
  ('Beni Suef',      'بني سويف'),
  ('Kafr el-Sheikh', 'كفر الشيخ'),
  ('Luxor',          'الأقصر'),
  ('Matruh',         'مطروح'),
  ('Qena',           'قنا'),
  ('Sohag',          'سوهاج'),
  ('Damietta',       'دمياط')
ON CONFLICT DO NOTHING;


-- =============================================================================
-- SECTION 10 — USEFUL SEARCH HELPER FUNCTION
-- =============================================================================

-- Full-text + trigram hybrid search for products
CREATE OR REPLACE FUNCTION glora_search_products(
  p_query      TEXT,
  p_lang       TEXT    DEFAULT 'en',
  p_category   TEXT    DEFAULT NULL,
  p_brand      TEXT    DEFAULT NULL,
  p_min_price  NUMERIC DEFAULT NULL,
  p_max_price  NUMERIC DEFAULT NULL,
  p_page       INTEGER DEFAULT 1,
  p_limit      INTEGER DEFAULT 24
)
RETURNS TABLE (
  id           UUID,
  slug         TEXT,
  name_en      TEXT,
  name_ar      TEXT,
  base_price   NUMERIC,
  sale_price   NUMERIC,
  avg_rating   NUMERIC,
  review_count INTEGER,
  primary_image TEXT,
  rank         REAL
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    p.id,
    p.slug,
    p.name_en,
    p.name_ar,
    p.base_price,
    p.sale_price,
    p.avg_rating,
    p.review_count,
    (SELECT url FROM public.product_images pi
     WHERE pi.product_id = p.id AND pi.is_primary = TRUE LIMIT 1) AS primary_image,
    CASE
      WHEN p_lang = 'ar' THEN TS_RANK(p.fts_ar, TO_TSQUERY('arabic', p_query))
      ELSE                    TS_RANK(p.fts_en, TO_TSQUERY('english', p_query))
    END AS rank
  FROM public.products p
  LEFT JOIN public.categories c ON c.id = p.category_id
  LEFT JOIN public.brands b     ON b.id = p.brand_id
  WHERE
    p.is_active = TRUE AND p.deleted_at IS NULL
    AND (
      CASE
        WHEN p_lang = 'ar' THEN p.fts_ar @@ TO_TSQUERY('arabic', p_query)
        ELSE                    p.fts_en @@ TO_TSQUERY('english', p_query)
      END
      OR p.name_en ILIKE '%' || p_query || '%'
      OR p.name_ar  LIKE '%' || p_query || '%'
    )
    AND (p_category IS NULL OR c.slug = p_category)
    AND (p_brand    IS NULL OR b.slug = p_brand)
    AND (p_min_price IS NULL OR COALESCE(p.sale_price, p.base_price) >= p_min_price)
    AND (p_max_price IS NULL OR COALESCE(p.sale_price, p.base_price) <= p_max_price)
  ORDER BY rank DESC, p.avg_rating DESC
  LIMIT  p_limit
  OFFSET (p_page - 1) * p_limit;
$$;


-- =============================================================================
-- DONE
-- =============================================================================
-- Schema created for: Glōra Beauty
-- Total tables     : 22 (incl. partitioned app_events + governorates)
-- Total triggers   : 13
-- Total functions  : 13
-- Total indexes    : 60+
-- RLS policies     : 40+
-- pg_cron jobs     : 6
-- Materialized views: 3
-- =============================================================================
