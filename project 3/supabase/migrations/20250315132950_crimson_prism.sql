/*
  # Initial Schema Setup for Restaurant Management System

  1. New Tables
    - `restaurants`
      - Basic restaurant information
      - Location and contact details
      - Operating hours and settings
    
    - `staff`
      - Staff member information
      - Role and permissions
      - Contact details and documents
    
    - `inventory`
      - Stock tracking
      - Minimum stock levels
      - Supplier information
    
    - `orders`
      - Order details from delivery platforms
      - Status tracking
      - Customer information
    
    - `platforms`
      - Delivery platform configurations
      - API credentials
      - Integration settings

  2. Security
    - Enable RLS on all tables
    - Set up authentication policies
    - Restrict access based on restaurant association

  3. Relationships
    - Staff members belong to restaurants
    - Inventory items belong to restaurants
    - Orders associated with restaurants and platforms
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Restaurants table
CREATE TABLE IF NOT EXISTS restaurants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  timezone text NOT NULL DEFAULT 'UTC',
  operating_hours jsonb NOT NULL DEFAULT '{}',
  settings jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Staff table
CREATE TABLE IF NOT EXISTS staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,
  role text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  schedule jsonb NOT NULL DEFAULT '{}',
  documents jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(email)
);

-- Inventory table
CREATE TABLE IF NOT EXISTS inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  current_stock numeric NOT NULL DEFAULT 0,
  minimum_stock numeric NOT NULL DEFAULT 0,
  unit text NOT NULL,
  supplier jsonb,
  auto_reorder boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Platform Configurations table
CREATE TABLE IF NOT EXISTS platforms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  platform_name text NOT NULL,
  credentials jsonb NOT NULL DEFAULT '{}',
  settings jsonb NOT NULL DEFAULT '{}',
  menu_sync jsonb NOT NULL DEFAULT '{}',
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(restaurant_id, platform_name)
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  platform_id uuid NOT NULL REFERENCES platforms(id) ON DELETE CASCADE,
  external_order_id text NOT NULL,
  status text NOT NULL,
  items jsonb NOT NULL DEFAULT '[]',
  customer jsonb NOT NULL DEFAULT '{}',
  payment jsonb NOT NULL DEFAULT '{}',
  timing jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(platform_id, external_order_id)
);

-- Enable Row Level Security
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policies for restaurants
CREATE POLICY "Users can view their own restaurants"
  ON restaurants
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT staff.id
      FROM staff
      WHERE staff.restaurant_id = restaurants.id
    )
  );

-- Create policies for staff
CREATE POLICY "Restaurant staff can view their colleagues"
  ON staff
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT s.id
      FROM staff s
      WHERE s.restaurant_id = staff.restaurant_id
    )
  );

-- Create policies for inventory
CREATE POLICY "Restaurant staff can manage inventory"
  ON inventory
  FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT staff.id
      FROM staff
      WHERE staff.restaurant_id = inventory.restaurant_id
    )
  );

-- Create policies for platforms
CREATE POLICY "Restaurant staff can manage platform configurations"
  ON platforms
  FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT staff.id
      FROM staff
      WHERE staff.restaurant_id = platforms.restaurant_id
    )
  );

-- Create policies for orders
CREATE POLICY "Restaurant staff can manage orders"
  ON orders
  FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT staff.id
      FROM staff
      WHERE staff.restaurant_id = orders.restaurant_id
    )
  );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_staff_restaurant ON staff(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_inventory_restaurant ON inventory(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_platforms_restaurant ON platforms(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_orders_restaurant ON orders(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_orders_platform ON orders(platform_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);