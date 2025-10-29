import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Solo inicializa el cliente si las credenciales existen.
// De lo contrario, el cliente será null y las llamadas a la API se omitirán de forma segura.
export const supabase = 
  (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;
