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
  const loginError = document.getElementById("goldLoginError");


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
  // NOTIFICACIONES (TOAST)
  // ===================================================

  window.goldToast = function (mensaje) {

    const toast = document.getElementById("goldToast");

    if (!toast) {
      return;
    }

    toast.textContent = mensaje;
    toast.classList.remove("hidden");

    clearTimeout(window.__goldToastTimer);

    window.__goldToastTimer = setTimeout(function () {
      toast.classList.add("hidden");
    }, 3200);

  };


  // ===================================================
  // SESIÓN LOCAL (sin backend)
  // Los datos de Gold Services se guardan en localStorage,
  // por lo que el inicio de sesión también es local.
  // ===================================================

  window.iniciarSesion = function (event) {

    if (event) {
      event.preventDefault();
    }

    const emailInput = document.getElementById("goldEmail");
    const passwordInput = document.getElementById("goldPassword");

    const email = emailInput ? emailInput.value.trim() : "";
    const password = passwordInput ? passwordInput.value : "";

    if (loginError) {
      loginError.textContent = "";
    }

    if (!email || !password) {

      if (loginError) {
        loginError.textContent = "Ingresa tu correo y contraseña.";
      }

      return;

    }

    const perfil = { email: email };

    window.goldCurrentUser = perfil;
    window.goldCurrentProfile = perfil;

    localStorage.setItem("goldCurrentUser", JSON.stringify(perfil));

    window.mostrarDashboard();
    window.cambiarVista("home");

  };


  // ===================================================
  // NAVEGACIÓN ENTRE MÓDULOS
  // ===================================================

  const NAV_TITULOS = {
    home: { eyebrow: "MÓDULO", titulo: "Dashboard operacional" },
    propuestas: { eyebrow: "COMERCIAL", titulo: "Propuestas Comerciales" }
  };

  window.cambiarVista = function (vista) {

    document.querySelectorAll(".view").forEach(function (el) {
      el.hidden = el.id !== "view-" + vista;
    });

    document.querySelectorAll(".nav-item").forEach(function (btn) {
      btn.classList.toggle("active", btn.dataset.view === vista);
    });

    const info = NAV_TITULOS[vista];
    const eyebrowEl = document.getElementById("viewEyebrow");
    const tituloEl = document.getElementById("viewTitle");

    if (info && eyebrowEl && tituloEl) {
      eyebrowEl.textContent = info.eyebrow;
      tituloEl.textContent = info.titulo;
    }

    if (vista === "propuestas" && typeof window.actualizarKpisPropuestas === "function") {
      window.actualizarKpisPropuestas();
    }

  };

  document.querySelectorAll(".nav-item[data-view]").forEach(function (btn) {

    btn.addEventListener("click", function () {
      window.cambiarVista(btn.dataset.view);
    });

  });


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
  // Restaura la sesión guardada en localStorage, si existe.
  // ===================================================

  try {

    const sesionGuardada = localStorage.getItem("goldCurrentUser");

    if (sesionGuardada) {
      window.goldCurrentUser = JSON.parse(sesionGuardada);
      window.goldCurrentProfile = window.goldCurrentUser;
    }

  } catch (error) {

    console.error("GOLD SERVICES: No se pudo restaurar la sesión.", error);

  }

  if (
    window.goldCurrentUser ||
    window.goldCurrentProfile
  ) {

    window.mostrarDashboard();
    window.cambiarVista("home");

  } else {

    window.mostrarLogin();

  }

});
