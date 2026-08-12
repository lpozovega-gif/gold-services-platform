async function cerrarSesion() {

  console.log("Cerrando sesión...");

  const { error } =
    await supabaseClient.auth.signOut();

  if (error) {
    console.error("Error cerrando sesión:", error);
    return;
  }

  window.goldCurrentUser = null;
  window.goldCurrentProfile = null;

  mostrarLogin();
}

window.cerrarSesion = cerrarSesion;
