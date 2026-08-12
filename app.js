// =====================================================
// GOLD SERVICES - APP.JS
// VERSION SEGURA
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

  console.log("GOLD SERVICES: APP.JS NUEVO CARGADO");

  // ===================================================
  // ELEMENTOS
  // ===================================================

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

  if (loginForm !== null) {

    loginForm.addEventListener("submit", function (event) {

      event.preventDefault();

      console.log("GOLD SERVICES: LOGIN");

      if (typeof window.iniciarSesion === "function") {

        window.iniciarSesion(event);

      } else {

        console.error(
          "GOLD SERVICES: iniciarSesion() no está disponible."
        );

      }

    });

  } else {

    console.warn(
      "GOLD SERVICES: No se encontró #goldLoginForm"
    );

  }


  // ===================================================
  // CERRAR SESIÓN
  // ===================================================

  if (logoutButton !== null) {

    logoutButton.addEventListener("click", function (event) {

      event.preventDefault();

      console.log("GOLD SERVICES: CERRAR SESIÓN");

      if (typeof window.cerrarSesion === "function") {

        window.cerrarSesion(event);

      } else {

        console.error(
          "GOLD SERVICES: cerrarSesion() no está disponible."
        );

      }

    });

  } else {

    console.warn(
      "GOLD SERVICES: No se encontró #logoutButton"
    );

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
