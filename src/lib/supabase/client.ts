import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please connect to Supabase using the "Connect to Supabase" button.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: 'public',
  },
});

// Initialize storage bucket
export async function initializeStorage() {
  try {
    // First check if we have an authenticated session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) throw sessionError;
    if (!session) {
      console.log('No authenticated session, skipping storage initialization');
      return;
    }

    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) throw bucketsError;
    
    const orderVerificationBucket = buckets?.find(b => b.name === 'order-verification');
    
    if (!orderVerificationBucket) {
      const { data, error } = await supabase.storage.createBucket('order-verification', {
        public: false,
        allowedMimeTypes: ['image/jpeg', 'image/png'],
        fileSizeLimit: 5242880, // 5MB
      });
      
      if (error) throw error;
      console.log('Created order-verification bucket');
    }
  } catch (error) {
    console.error('Failed to initialize storage:', error);
  }
}

export async function uploadOrderPhoto(orderId: string, photoBlob: Blob) {
  try {
    // Ensure storage is initialized before upload
    await initializeStorage();

    const fileName = `${orderId}-${Date.now()}.jpg`;
    const { data, error } = await supabase.storage
      .from('order-verification')
      .upload(`orders/${fileName}`, photoBlob, {
        contentType: 'image/jpeg',
        upsert: false,
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('order-verification')
      .getPublicUrl(`orders/${fileName}`);

    return publicUrl;
  } catch (error) {
    console.error('Failed to upload photo:', error);
    throw error;
  }
}

// Listen for auth state changes and initialize storage when user signs in
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN' && session) {
    initializeStorage();
  }
});