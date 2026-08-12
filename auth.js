const SUPABASE_URL = "https://mjthtkwrcusjmlhweeqm.supabase.co";

const SUPABASE_KEY = "sb_publishable_Wm0jQrrP3zWHGPR0umeOAg_nVXb4R18";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

window.goldSupabase = supabaseClient;

const login = document.getElementById("goldLogin");
const app = document.querySelector(".app-shell");
const form = document.getElementById("goldLoginForm");
const errorBox = document.getElementById("goldLoginError");

function mostrarSistema() {
  if (login) login.style.display = "none";
  if (app) app.style.display = "flex";
}

function mostrarLogin() {
  if (login) login.style.display = "flex";
  if (app) app.style.display = "none";
}

form.addEventListener("submit", async function(event) {

  event.preventDefault();

  errorBox.textContent = "";

  const email = document.getElementById("goldEmail").value.trim();
  const password = document.getElementById("goldPassword").value;

  const button = form.querySelector("button");

  button.disabled = true;
  button.textContent = "INGRESANDO...";

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: email,
    password: password
  });

  button.disabled = false;
  button.textContent = "INGRESAR";

  if (error) {
    console.error(error);
    errorBox.textContent = error.message;
    return;
  }

  mostrarSistema();

});

async function comprobarSesion() {

  const { data } = await supabaseClient.auth.getSession();

  if (data.session) {
    mostrarSistema();
  } else {
    mostrarLogin();
  }

}

supabaseClient.auth.onAuthStateChange(function(event, session) {

  console.log("Cambio de autenticación:", event);

  if (session) {
    mostrarSistema();
  } else {
    mostrarLogin();
  }

});

comprobarSesion();
