// =====================================================
// GOLD SERVICES - APP.JS
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

  console.log("GOLD SERVICES: APP.JS CARGADO - VERSION NUEVA");

  const loginView = document.getElementById("loginView");
  const dashboardView = document.getElementById("dashboardView");
  const loginForm = document.getElementById("goldLoginForm");
  const logoutButton = document.getElementById("logoutButton");


  // ===================================================
  // MOSTRAR LOGIN
  // ===================================================

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


  // ===================================================
  // MOSTRAR DASHBOARD
  // ===================================================

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


  // ===================================================
  // LOGIN
  // ===================================================

  if (loginForm) {

    loginForm.addEventListener("submit", function (event) {

      event.preventDefault();

      console.log("GOLD SERVICES: Formulario de login enviado.");

      if (typeof window.iniciarSesion === "function") {

        window.iniciarSesion(event);

      } else {

        console.error(
          "GOLD SERVICES: ERROR - iniciarSesion() no existe."
        );

      }

    });

  }


  // ===================================================
  // CERRAR SESIÓN
  // ===================================================

  if (logoutButton) {

    logoutButton.addEventListener("click", function (event) {

      event.preventDefault();

      console.log("GOLD SERVICES: Botón cerrar sesión.");

      if (typeof window.cerrarSesion === "function") {

        window.cerrarSesion(event);

      } else {

        console.error(
          "GOLD SERVICES: ERROR - cerrarSesion() no existe."
        );

      }

    });

  }


  // ===================================================
  // ESTADO INICIAL
  // ===================================================

  if (
    window.goldCurrentUser ||
    window.goldCurrentProfile
  ) {

    window.mostrarDashboard();

  } else {

    window.mostrarLogin();

  }

});
