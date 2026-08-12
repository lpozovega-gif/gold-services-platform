// =====================================================
// GOLD SERVICES - APP.JS
// Control principal de la aplicación
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

  console.log("GOLD SERVICES: Aplicación iniciada.");

  // ---------------------------------------------------
  // ELEMENTOS PRINCIPALES
  // ---------------------------------------------------

  const loginView =
    document.getElementById("loginView");

  const dashboardView =
    document.getElementById("dashboardView");

  const loginForm =
    document.getElementById("goldLoginForm");

  const logoutButton =
    document.getElementById("logoutButton");


  // ---------------------------------------------------
  // PROTECCIÓN CONTRA ELEMENTOS INEXISTENTES
  // ---------------------------------------------------

  if (!loginView) {
    console.warn(
      "GOLD SERVICES: No existe #loginView."
    );
  }

  if (!dashboardView) {
    console.warn(
      "GOLD SERVICES: No existe #dashboardView."
    );
  }


  // ---------------------------------------------------
  // LOGIN
  // ---------------------------------------------------

  if (loginForm) {

    loginForm.addEventListener(
      "submit",
      function (event) {

        event.preventDefault();

        if (
          typeof window.iniciarSesion ===
          "function"
        ) {

          window.iniciarSesion(event);

        } else {

          console.error(
            "GOLD SERVICES: iniciarSesion() no está disponible."
          );

        }

      }
    );

  }


  // ---------------------------------------------------
  // CERRAR SESIÓN
  // ---------------------------------------------------

  if (logoutButton) {

    logoutButton.addEventListener(
      "click",
      function (event) {

        event.preventDefault();

        if (
          typeof window.cerrarSesion ===
          "function"
        ) {

          window.cerrarSesion(event);

        } else {

          console.error(
            "GOLD SERVICES: cerrarSesion() no está disponible."
          );

        }

      }
    );

  }


  // ---------------------------------------------------
  // FUNCIONES GLOBALES
  // ---------------------------------------------------

  window.mostrarLogin = function () {

    if (loginView) {
      loginView.hidden = false;
      loginView.style.display = "";
    }

    if (dashboardView) {
      dashboardView.hidden = true;
      dashboardView.style.display = "none";
    }

  };


  window.mostrarDashboard = function () {

    if (loginView) {
      loginView.hidden = true;
      loginView.style.display = "none";
    }

    if (dashboardView) {
      dashboardView.hidden = false;
      dashboardView.style.display = "";
    }

  };


  // ---------------------------------------------------
  // ESTADO INICIAL
  // ---------------------------------------------------

  if (
    window.goldCurrentUser ||
    window.goldCurrentProfile
  ) {

    window.mostrarDashboard();

  } else {

    window.mostrarLogin();

  }

});
