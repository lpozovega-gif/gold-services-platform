// =====================================================
// GOLD SERVICES - CIERRE DE SESIÓN GLOBAL
// =====================================================

async function cerrarSesion(event) {

  if (event) {
    event.preventDefault();
  }

  console.log("GOLD SERVICES: Cerrando sesión...");

  try {

    const { error } =
      await supabaseClient.auth.signOut();

    if (error) {

      console.error(
        "GOLD SERVICES: Error cerrando sesión:",
        error
      );

      return;
    }

    window.goldCurrentUser = null;
    window.goldCurrentProfile = null;

    if (typeof mostrarLogin === "function") {

      mostrarLogin();

    } else {

      const login =
        document.getElementById("goldLogin");

      const app =
        document.getElementById("goldApp");

      if (login) {
        login.style.display = "flex";
      }

      if (app) {
        app.style.display = "none";
      }

    }

    console.log(
      "GOLD SERVICES: Sesión cerrada correctamente."
    );

  } catch (error) {

    console.error(
      "GOLD SERVICES: Error inesperado:",
      error
    );

  }

}

// =====================================================
// HACER LA FUNCIÓN DISPONIBLE GLOBALMENTE
// =====================================================

window.cerrarSesion = cerrarSesion;

// =====================================================
// COMPATIBILIDAD CON BOTONES HTML
// =====================================================

// Permite que onclick="cerrarSesion()" funcione
// aunque el botón esté definido directamente en HTML.

if (typeof window.cerrarSesion !== "function") {

  window.cerrarSesion = async function(event) {

    return cerrarSesion(event);

  };

}
