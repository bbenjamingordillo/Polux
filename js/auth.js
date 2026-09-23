/* ============================================
   AUTH — helpers compartidos por login.html,
   dashboard.html y admin.html
   ============================================ */

async function poluxSignUp({ email, password, fullName }) {
  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } }
  });
  if (error) throw error;
  return data;
}

async function poluxSignIn({ email, password }) {
  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

async function poluxSignOut() {
  await supabaseClient.auth.signOut();
  window.location.href = "login.html";
}

// Devuelve el perfil (con el rol) de la persona logueada, o null.
async function poluxGetProfile() {
  const { data: sessionData } = await supabaseClient.auth.getSession();
  const session = sessionData.session;
  if (!session) return null;

  const { data, error } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  if (error) return null;
  return data;
}

// Usar al principio de dashboard.html: si no hay sesión, redirige a login.
async function poluxRequireAuth() {
  const profile = await poluxGetProfile();
  if (!profile) {
    window.location.href = "login.html";
    return null;
  }
  return profile;
}

// Usar al principio de admin.html: si no es admin, redirige a dashboard.
async function poluxRequireAdmin() {
  const profile = await poluxRequireAuth();
  if (profile && profile.role !== "admin") {
    window.location.href = "dashboard.html";
    return null;
  }
  return profile;
}
