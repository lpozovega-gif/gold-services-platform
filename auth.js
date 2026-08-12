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
