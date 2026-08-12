const SUPABASE_URL = 'https://mjthtkwrcusjmlhweeqm.supabase.co';

const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_Wm0jQrrP3zWHGPR0umeOAg_nVXb4R18';

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

window.goldSupabase = supabaseClient;


// ================================
// ESTILOS DEL LOGIN
// ================================

const style = document.createElement('style');

style.textContent = `
#goldLogin {
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #07183f;
  font-family: Arial, sans-serif;
}

#goldLogin.hidden {
  display: none;
}

.gold-login-card {
  width: 380px;
  max-width: 90%;
  background: white;
  padding: 35px;
  border-radius: 18px;
  box-shadow: 0 25px 70px rgba(0,0,0,.35);
}

.gold-login-card h1 {
  color: #0B2265;
  margin-bottom: 5px;
}

.gold-login-card p {
  color: #667085;
  font-size: 14px;
}

.gold-login-card label {
  display: block;
  margin-top: 18px;
  margin-bottom: 6px;
  font-weight: bold;
  font-size: 13px;
}

.gold-login-card input {
  width: 100%;
  box-sizing: border-box;
  padding: 12px;
  border: 1px solid #d0d5dd;
  border-radius: 8px;
}

.gold-login-card button {
  width: 100%;
  margin-top: 22px;
  padding: 12px;
  border: 0;
  border-radius: 8px;
  background: #0B2265;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

.gold-login-card button:hover {
  opacity: 0.9;
}

#goldLoginError {
  color: #b42318;
  font-size: 13px;
  margin-top: 12px;
}
`;

document.head.appendChild(style);


// ================================
// INTERFAZ DE LOGIN
// ================================

document.body.insertAdjacentHTML('afterbegin', `
<div id="goldLogin">

  <div class="gold-login-card">

    <h1>GOLD SERVICES</h1>

    <p>
      Sistema Operativo Digital<br>
      Gold Services and Consulting SpA
    </p>

    <form id="goldLoginForm">

      <label>Correo electrónico</label>

      <input
        id="goldEmail"
        type="email"
        autocomplete="username"
        required
      >

      <label>Contraseña</label>

      <input
        id="goldPassword"
        type="password"
        autocomplete="current-password"
        required
      >

      <button type="submit">
        INGRESAR
      </button>

      <div id="goldLoginError"></div>

    </form>

  </div>

</div>
`);


// ================================
// ELEMENTOS DEL LOGIN
// ================================

const login = document.getElementById('goldLogin');

const loginError = document.getElementById('goldLoginError');


// ================================
// INICIAR SISTEMA
// ================================

async function iniciarSistema(session) {

  if (!session) {

    login.classList.remove('hidden');

    return;
  }

  try {

    const { data, error } = await supabaseClient
      .from('profiles')
      .select(
        'id, organization_id, full_name, role'
      )
      .eq('id', session.user.id)
      .maybeSingle();


    if (error) {

      console.error(
        'Error cargando perfil:',
        error
      );

      loginError.textContent =
        'No se pudo cargar el perfil de usuario.';

      return;
    }


    if (!data) {

      console.error(
        'No existe un perfil para este usuario.'
      );

      loginError.textContent =
        'El usuario no tiene un perfil configurado.';

      return;
    }


    // Guardamos la información de sesión

    window.goldCurrentUser =
      session.user;

    window.goldCurrentProfile =
      data;


    // Ocultar pantalla de login

    login.classList.add('hidden');


    console.log(
      'Gold Services - Usuario:',
      session.user
    );

    console.log(
      'Gold Services - Perfil:',
      data
    );


  } catch (error) {

    console.error(
      'Error inesperado:',
      error
    );

  }

}


// ================================
// LOGIN
// ================================

document
  .getElementById('goldLoginForm')
  .addEventListener(
    'submit',
    async function(event) {

      event.preventDefault();


      const email =
        document
          .getElementById('goldEmail')
          .value
          .trim();


      const password =
        document
          .getElementById('goldPassword')
          .value;


      loginError.textContent = '';


      const { data, error } =
        await supabaseClient.auth.signInWithPassword({

          email: email,

          password: password

        });


      if (error) {

        console.error(
          'Error de autenticación:',
          error
        );

        loginError.textContent =
          'Correo o contraseña incorrectos.';

        return;
      }


      iniciarSistema(
        data.session
      );

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


  iniciarSistema(
    data.session
  );

})();
