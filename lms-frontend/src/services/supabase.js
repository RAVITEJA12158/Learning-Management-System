import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

<<<<<<< HEAD
// Supabase is optional while authentication is handled by the LMS API.
export const supabase =
  supabaseUrl && supabasePublishableKey
    ? createClient(supabaseUrl, supabasePublishableKey)
    : null
=======
// export const supabase = createClient(
//   supabaseUrl,
//   supabasePublishableKey,
// )
>>>>>>> 372372a56f1ecfeeb3044bb57e7cef9f68e1446c
