const SUPABASE_URL = 'https://mjthtkwrcusjmlhweeqm.supabase.co';

const SUPABASE_PUBLISHABLE_KEY =
  'sb_publishable_Wm0jQrrP3zWHGPR0umeOAg_nVXb4R18';

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

window.goldSupabase = supabaseClient;


// ================================
// ELEMENTOS DEL LOGIN
// ================================

const login = document.getElementById('goldLogin');
const loginForm = document.getElementById('goldLoginForm');
const loginError = document.getElementById('goldLoginError');


// ================================
// MOSTRAR / OCULTAR LOGIN
// ================================

function mostrarLogin() {
  login.classList.remove('hidden');
}

function ocultarLogin() {
  login.classList.add('hidden');
}


// ================================
// CARGAR PERFIL
// ================================

async function iniciarSistema(session) {

  if (!session) {
    mostrarLogin();
    return;
  }

  const { data, error } = await supabaseClient
    .from('profiles')
    .select('id, organization_id, full_name, role')
    .eq('id', session.user.id)
    .maybeSingle();

  if (error) {

    console.error('Error cargando perfil:', error);

    loginError.textContent =
      'Error al cargar el perfil.';

    mostrarLogin();

    return;
  }

  if (!data) {

    console.error(
      'No existe perfil para este usuario.'
    );

    loginError.textContent =
      'El usuario no tiene un perfil configurado.';

    mostrarLogin();

    return;
  }


  // Guardar usuario y perfil

  window.goldCurrentUser = session.user;

  window.goldCurrentProfile = data;


  // Ocultar login

  ocultarLogin();


  console.log(
    'Gold Services - Usuario:',
    session.user.email
  );

  console.log(
    'Gold Services - Perfil:',
    data
  );
}


// ================================
// LOGIN
// ================================

loginForm.addEventListener(
  'submit',
  async function(event) {

    event.preventDefault();

    loginError.textContent = '';


    const email =
      document
        .getElementById('goldEmail')
        .value
        .trim();

    const password =
      document
        .getElementById('goldPassword')
        .value;


    const button =
      loginForm.querySelector('button');

    button.disabled = true;

    button.textContent = 'INGRESANDO...';


    const { data, error } =
      await supabaseClient.auth.signInWithPassword({

        email: email,

        password: password

      });


    button.disabled = false;

    button.textContent = 'INGRESAR';


    if (error) {

      console.error(
        'Error de autenticación:',
        error
      );

      loginError.textContent =
        'Correo o contraseña incorrectos.';

      return;
    }


    await iniciarSistema(data.session);

  }
);


// ================================
// CAMBIOS DE SESIÓN
// ================================

supabaseClient.auth.onAuthStateChange(
  function(event, session) {

    console.log(
      'Cambio de autenticación:',
      event
    );

    iniciarSistema(session);

  }
);


// ================================
// COMPROBAR SESIÓN EXISTENTE
// ================================

(async function() {

  const { data, error } =
    await supabaseClient.auth.getSession();


  if (error) {

    console.error(
      'Error obteniendo sesión:',
      error
    );

    return;
  }


  await iniciarSistema(data.session);

})();
