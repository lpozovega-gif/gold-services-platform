const SUPABASE_URL = "https://mjthtkwrcusjmlhweeqm.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_Wm0jQrrP3zWHGPR0umeOAg_nVXb4R18";

const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );

window.goldSupabase = supabaseClient;


// ==============================
// ELEMENTOS
// ==============================

const login = document.getElementById("goldLogin");
const app = document.getElementById("goldApp");

const form = document.getElementById("goldLoginForm");

const errorBox =
  document.getElementById("goldLoginError");


// ==============================
// MOSTRAR SISTEMA
// ==============================

function mostrarSistema() {

  login.style.display = "none";

  app.style.display = "flex";

}


// ==============================
// MOSTRAR LOGIN
// ==============================

function mostrarLogin() {

  login.style.display = "flex";

  app.style.display = "none";

}


// ==============================
// LOGIN
// ==============================

form.addEventListener(
  "submit",
  async function(event) {

    event.preventDefault();

    errorBox.textContent = "";

    const email =
      document
        .getElementById("goldEmail")
        .value
        .trim();

    const password =
      document
        .getElementById("goldPassword")
        .value;


    const button =
      form.querySelector("button");

    button.disabled = true;

    button.textContent =
      "INGRESANDO...";


    const { data, error } =
      await supabaseClient.auth
        .signInWithPassword({

          email: email,

          password: password

        });


    button.disabled = false;

    button.textContent =
      "INGRESAR";


    if (error) {

      console.error(error);

      errorBox.textContent =
        "Correo o contraseña incorrectos.";

      return;

    }


    await cargarPerfil(data.user);

  }
);


// ==============================
// PERFIL
// ==============================

async function cargarPerfil(user) {

  const { data, error } =
    await supabaseClient
      .from("profiles")
      .select(
        "id, organization_id, full_name, role"
      )
      .eq("id", user.id)
      .maybeSingle();


  if (error) {

    console.error(error);

    errorBox.textContent =
      "Error al cargar el perfil.";

    return;

  }


  if (!data) {

    errorBox.textContent =
      "No existe perfil para este usuario.";

    return;

  }


  window.goldCurrentUser =
    user;

  window.goldCurrentProfile =
    data;


  mostrarSistema();

}


// ==============================
// COMPROBAR SESIÓN
// ==============================

async function comprobarSesion() {

  const { data } =
    await supabaseClient
      .auth
      .getSession();


  if (data.session) {

    await cargarPerfil(
      data.session.user
    );

  } else {

    mostrarLogin();

  }

}


// ==============================
// CAMBIO DE SESIÓN
// ==============================

supabaseClient.auth.onAuthStateChange(
  async function(event, session) {

    console.log(
      "Auth:",
      event
    );

    if (session) {

      await cargarPerfil(
        session.user
      );

    } else {

      mostrarLogin();

    }

  }
);


// ==============================
// INICIO
// ==============================

comprobarSesion();
