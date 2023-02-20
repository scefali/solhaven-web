// import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// export const supabase = createClient(supabaseUrl!, supabaseKey!);


import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Database } from 'types/supabase_auth'

export const supabase = createBrowserSupabaseClient<Database>();