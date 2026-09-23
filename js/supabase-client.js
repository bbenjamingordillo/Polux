/* ============================================
   SUPABASE — conexión a la base de datos
   Reemplazá estos dos valores por los de tu proyecto:
   Supabase → tu proyecto → Settings → API
   - "Project URL"        → SUPABASE_URL
   - "anon public" key    → SUPABASE_ANON_KEY
   Estos dos datos NO son secretos, están pensados para
   usarse en el navegador (la seguridad real la da la
   Row Level Security que configuramos en schema.sql).
   ============================================ */

const SUPABASE_URL = "https://jxkzkvccwykllahpjgft.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_nRMnPG5Nx7Ke7OOrTxTRcQ_fNt-Y1Ts";

const SUPABASE_CONFIGURED = !SUPABASE_URL.includes("ACA") && !SUPABASE_ANON_KEY.includes("ACA");

// Mientras no esté configurado, usamos una URL válida "de mentira" para que
// la librería no explote al cargar la página — ninguna de las páginas hace
// llamadas reales antes de chequear SUPABASE_CONFIGURED.
const supabaseClient = window.supabase.createClient(
  SUPABASE_CONFIGURED ? SUPABASE_URL : "https://placeholder.supabase.co",
  SUPABASE_CONFIGURED ? SUPABASE_ANON_KEY : "placeholder-anon-key"
);
