/*
  # Add order verification fields

  1. Changes
    - Add verification fields to orders table:
      - verification_photo_url: URL of the verification photo
      - verified_at: Timestamp when order was verified
      - verified_by: Staff member who verified the order
      - verification_status: Current verification status
      - verification_notes: Any notes about verification
*/

ALTER TABLE orders
ADD COLUMN IF NOT EXISTS verification jsonb DEFAULT '{}'::jsonb;

-- Add index for verification status
CREATE INDEX IF NOT EXISTS idx_orders_verification ON orders((verification->>'status'));

-- Update RLS policies to allow staff to update verification
CREATE POLICY "Staff can update order verification"
  ON orders
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT staff.id
      FROM staff
      WHERE staff.restaurant_id = orders.restaurant_id
    )
  )
  WITH CHECK (
    auth.uid() IN (
      SELECT staff.id
      FROM staff
      WHERE staff.restaurant_id = orders.restaurant_id
    )
  );