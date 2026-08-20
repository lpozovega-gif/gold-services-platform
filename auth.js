// =====================================================
// GOLD SERVICES - AUTENTICACIÓN LOCAL (SIN BACKEND)
// =====================================================
//
// Este MVP no tiene backend: toda la sesión se guarda en
// localStorage, igual que el resto de los datos de la app
// (ver README). Si en el futuro se conecta un backend real
// (p.ej. Supabase), reemplazar iniciarSesion/cerrarSesion
// por las llamadas correspondientes.

const GOLD_SESSION_KEY = "goldCurrentUser";

// Restaurar sesión persistida ANTES de que app.js decida
// qué vista mostrar.
(function restaurarSesion() {

  try {

    const stored = localStorage.getItem(GOLD_SESSION_KEY);

    if (stored) {
      window.goldCurrentUser = JSON.parse(stored);
    }

  } catch (error) {

    console.error(
      "GOLD SERVICES: No se pudo restaurar la sesión:",
      error
    );

  }

})();


// =====================================================
// INICIAR SESIÓN
// =====================================================

function iniciarSesion(event) {

  if (event) {
    event.preventDefault();
  }

  const emailInput = document.getElementById("goldEmail");
  const passwordInput = document.getElementById("goldPassword");
  const errorBox = document.getElementById("goldLoginError");

  const email = emailInput ? emailInput.value.trim() : "";
  const password = passwordInput ? passwordInput.value : "";

  if (!email || !password) {

    if (errorBox) {
      errorBox.textContent =
        "Ingresa tu correo y contraseña.";
    }

    return;
  }

  const user = { email: email };

  window.goldCurrentUser = user;

  localStorage.setItem(
    GOLD_SESSION_KEY,
    JSON.stringify(user)
  );

  if (errorBox) {
    errorBox.textContent = "";
  }

  console.log("GOLD SERVICES: Sesión iniciada:", email);

  if (typeof window.mostrarDashboard === "function") {

    window.mostrarDashboard();

  }

}

window.iniciarSesion = iniciarSesion;


// =====================================================
// GOLD SERVICES - CIERRE DE SESIÓN GLOBAL
// =====================================================

async function cerrarSesion(event) {

  if (event) {
    event.preventDefault();
  }

  console.log("GOLD SERVICES: Cerrando sesión...");

  try {

    if (
      typeof supabaseClient !== "undefined" &&
      supabaseClient &&
      supabaseClient.auth &&
      typeof supabaseClient.auth.signOut === "function"
    ) {

      await supabaseClient.auth.signOut();

    }

    window.goldCurrentUser = null;
    window.goldCurrentProfile = null;

    localStorage.removeItem(GOLD_SESSION_KEY);

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

if (typeof window.cerrarSesion !== "function") {

  window.cerrarSesion = async function(event) {

    return cerrarSesion(event);

  };

}


// =====================================================
// ACCESIBILIDAD - CORREGIR LABELS
// =====================================================

function repararLabels() {

  document.querySelectorAll("label").forEach((label, index) => {

    // Ya está correctamente asociado
    if (label.control) {
      return;
    }

    // Asociación implícita:
    // <label><input></label>
    if (
      label.querySelector(
        "input, select, textarea, button, meter, output, progress"
      )
    ) {
      return;
    }

    // Buscar el campo que contiene el label
    const field =
      label.closest(".field") ||
      label.parentElement;

    if (!field) {
      return;
    }

    // Buscar el control correspondiente
    const control = field.querySelector(
      "input:not([type='hidden']), select, textarea, button, meter, output, progress"
    );

    if (!control) {
      return;
    }

    // Crear ID si no existe
    if (!control.id) {

      control.id =
        "gold-field-" +
        index +
        "-" +
        Date.now();

    }

    // Asociar label con input/select/etc.
    label.htmlFor = control.id;

  });

}


// =====================================================
// EJECUTAR CORRECCIÓN
// =====================================================

repararLabels();


// =====================================================
// DETECTAR FORMULARIOS CREADOS DINÁMICAMENTE
// =====================================================

if (document.body) {

  const goldLabelObserver =
    new MutationObserver(() => {

      repararLabels();

    });

  goldLabelObserver.observe(document.body, {

    childList: true,
    subtree: true

  });

}
