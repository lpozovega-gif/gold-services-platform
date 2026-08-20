// =====================================================
// GOLD SERVICES - MÓDULO GESTIÓN TRIBUTARIA IA
// =====================================================
//
// Módulo de demostración inspirado en apps de gestión
// tributaria con IA (como Cenit). Es 100% local:
//   - No se conecta al SII, al SAT ni a ningún backend.
//   - Los movimientos se guardan en localStorage.
//   - El "asistente IA" es un motor de reglas simple que
//     responde en base a los datos ya registrados, no un
//     modelo de lenguaje conectado a internet.

const GOLD_TAX_KEY = "goldTaxMovements";
const GOLD_TAX_IVA_RATE = 0.19;

document.addEventListener("DOMContentLoaded", function () {

  // ===================================================
  // ELEMENTOS
  // ===================================================

  const navItems = document.querySelectorAll(".nav-item[data-view]");
  const viewTitle = document.getElementById("viewTitle");

  const taxAddButton = document.getElementById("taxAddButton");
  const taxModal = document.getElementById("taxModal");
  const taxModalClose = document.getElementById("taxModalClose");
  const taxCancelButton = document.getElementById("taxCancelButton");
  const taxMovementForm = document.getElementById("taxMovementForm");
  const taxMovementsBody = document.getElementById("taxMovementsBody");
  const taxEmptyState = document.getElementById("taxEmptyState");
  const taxExportButton = document.getElementById("taxExportButton");
  const taxToast = document.getElementById("taxToast");

  const taxChatForm = document.getElementById("taxChatForm");
  const taxChatInput = document.getElementById("taxChatInput");
  const taxChatLog = document.getElementById("taxChatLog");

  const panelTitles = {
    dashboard: "Dashboard operacional",
    tax: "Gestión Tributaria IA"
  };


  // ===================================================
  // NAVEGACIÓN ENTRE PANELES
  // ===================================================

  function mostrarPanel(view) {

    document.querySelectorAll("[data-panel]").forEach(function (panel) {
      panel.hidden = panel.getAttribute("data-panel") !== view;
    });

    navItems.forEach(function (item) {
      item.classList.toggle(
        "active",
        item.getAttribute("data-view") === view
      );
    });

    if (viewTitle && panelTitles[view]) {
      viewTitle.textContent = panelTitles[view];
    }

    if (view === "tax") {
      renderTax();
    }

  }

  navItems.forEach(function (item) {

    item.addEventListener("click", function () {
      mostrarPanel(item.getAttribute("data-view"));
    });

  });


  // ===================================================
  // DATOS: LOCALSTORAGE
  // ===================================================

  function cargarMovimientos() {

    try {

      const raw = localStorage.getItem(GOLD_TAX_KEY);
      return raw ? JSON.parse(raw) : [];

    } catch (error) {

      console.error(
        "GOLD SERVICES: Error leyendo movimientos tributarios:",
        error
      );

      return [];

    }

  }

  function guardarMovimientos(movimientos) {

    localStorage.setItem(
      GOLD_TAX_KEY,
      JSON.stringify(movimientos)
    );

  }

  function movimientosDelMes(movimientos) {

    const ahora = new Date();

    return movimientos.filter(function (mov) {

      const fecha = new Date(mov.fecha + "T00:00:00");

      return (
        fecha.getFullYear() === ahora.getFullYear() &&
        fecha.getMonth() === ahora.getMonth()
      );

    });

  }


  // ===================================================
  // CÁLCULOS
  // ===================================================

  function formatoCLP(monto) {

    return "$" + Math.round(monto).toLocaleString("es-CL");

  }

  function calcularResumen() {

    const movimientos = movimientosDelMes(cargarMovimientos());

    let ingresos = 0;
    let gastos = 0;

    movimientos.forEach(function (mov) {

      if (mov.tipo === "venta") {
        ingresos += Number(mov.monto) || 0;
      } else {
        gastos += Number(mov.monto) || 0;
      }

    });

    const margen = Math.max(ingresos - gastos, 0);
    const iva = margen * GOLD_TAX_IVA_RATE;

    return {
      ingresos: ingresos,
      gastos: gastos,
      iva: iva,
      vencimiento: proximoVencimiento(),
      movimientos: movimientos
    };

  }

  function proximoVencimiento() {

    const ahora = new Date();

    let mes = ahora.getMonth() + 1;
    let anio = ahora.getFullYear();

    if (mes > 11) {
      mes = 0;
      anio += 1;
    }

    const vencimiento = new Date(anio, mes, 12);

    return vencimiento.toLocaleDateString("es-CL", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });

  }


  // ===================================================
  // RENDER
  // ===================================================

  function renderTax() {

    const resumen = calcularResumen();

    const kpiIngresos = document.getElementById("taxKpiIngresos");
    const kpiGastos = document.getElementById("taxKpiGastos");
    const kpiIva = document.getElementById("taxKpiIva");
    const kpiVencimiento = document.getElementById("taxKpiVencimiento");

    if (kpiIngresos) kpiIngresos.textContent = formatoCLP(resumen.ingresos);
    if (kpiGastos) kpiGastos.textContent = formatoCLP(resumen.gastos);
    if (kpiIva) kpiIva.textContent = formatoCLP(resumen.iva);
    if (kpiVencimiento) kpiVencimiento.textContent = resumen.vencimiento;

    renderTabla(resumen.movimientos);

  }

  function renderTabla(movimientos) {

    if (!taxMovementsBody) {
      return;
    }

    taxMovementsBody.innerHTML = "";

    if (movimientos.length === 0) {

      if (taxEmptyState) taxEmptyState.hidden = false;
      return;

    }

    if (taxEmptyState) taxEmptyState.hidden = true;

    const ordenados = movimientos
      .slice()
      .sort(function (a, b) {
        return a.fecha < b.fecha ? 1 : -1;
      });

    ordenados.forEach(function (mov) {

      const fila = document.createElement("tr");

      const badgeClase = mov.tipo === "venta" ? "green" : "gold";
      const badgeTexto = mov.tipo === "venta" ? "Venta" : "Gasto";

      fila.innerHTML =
        "<td>" + mov.fecha + "</td>" +
        "<td><span class=\"badge " + badgeClase + "\">" + badgeTexto + "</span></td>" +
        "<td>" + escaparHtml(mov.descripcion) + "</td>" +
        "<td>" + formatoCLP(mov.monto) + "</td>" +
        "<td></td>";

      const borrarBtn = document.createElement("button");
      borrarBtn.type = "button";
      borrarBtn.className = "btn ghost small";
      borrarBtn.textContent = "Eliminar";

      borrarBtn.addEventListener("click", function () {
        eliminarMovimiento(mov.id);
      });

      fila.lastElementChild.appendChild(borrarBtn);

      taxMovementsBody.appendChild(fila);

    });

  }

  function escaparHtml(texto) {

    const div = document.createElement("div");
    div.textContent = texto;
    return div.innerHTML;

  }


  // ===================================================
  // CRUD MOVIMIENTOS
  // ===================================================

  function agregarMovimiento(datos) {

    const movimientos = cargarMovimientos();

    movimientos.push({
      id: "mov-" + Date.now(),
      tipo: datos.tipo,
      fecha: datos.fecha,
      descripcion: datos.descripcion,
      monto: Number(datos.monto) || 0
    });

    guardarMovimientos(movimientos);
    renderTax();
    mostrarToast("Movimiento registrado.");

  }

  function eliminarMovimiento(id) {

    const movimientos = cargarMovimientos().filter(function (mov) {
      return mov.id !== id;
    });

    guardarMovimientos(movimientos);
    renderTax();
    mostrarToast("Movimiento eliminado.");

  }


  // ===================================================
  // MODAL
  // ===================================================

  function abrirModal() {

    if (taxMovementForm) taxMovementForm.reset();

    const fechaInput = document.getElementById("taxFecha");
    if (fechaInput) {
      fechaInput.value = new Date().toISOString().slice(0, 10);
    }

    if (taxModal) taxModal.classList.remove("hidden");

  }

  function cerrarModal() {
    if (taxModal) taxModal.classList.add("hidden");
  }

  if (taxAddButton) {
    taxAddButton.addEventListener("click", abrirModal);
  }

  if (taxModalClose) {
    taxModalClose.addEventListener("click", cerrarModal);
  }

  if (taxCancelButton) {
    taxCancelButton.addEventListener("click", cerrarModal);
  }

  if (taxMovementForm) {

    taxMovementForm.addEventListener("submit", function (event) {

      event.preventDefault();

      const formData = new FormData(taxMovementForm);

      agregarMovimiento({
        tipo: formData.get("tipo"),
        fecha: formData.get("fecha"),
        descripcion: formData.get("descripcion"),
        monto: formData.get("monto")
      });

      cerrarModal();

    });

  }


  // ===================================================
  // EXPORTAR JSON
  // ===================================================

  if (taxExportButton) {

    taxExportButton.addEventListener("click", function () {

      const resumen = calcularResumen();

      const respaldo = {
        generadoEl: new Date().toISOString(),
        resumenMesActual: {
          ingresos: resumen.ingresos,
          gastos: resumen.gastos,
          ivaEstimado: resumen.iva,
          proximoVencimiento: resumen.vencimiento
        },
        movimientos: cargarMovimientos()
      };

      const blob = new Blob(
        [JSON.stringify(respaldo, null, 2)],
        { type: "application/json" }
      );

      const url = URL.createObjectURL(blob);
      const enlace = document.createElement("a");

      enlace.href = url;
      enlace.download = "gold-services-tributario.json";
      enlace.click();

      URL.revokeObjectURL(url);

      mostrarToast("Respaldo JSON exportado.");

    });

  }


  // ===================================================
  // TOAST
  // ===================================================

  let toastTimeout = null;

  function mostrarToast(mensaje) {

    if (!taxToast) return;

    taxToast.textContent = mensaje;
    taxToast.classList.remove("hidden");

    clearTimeout(toastTimeout);

    toastTimeout = setTimeout(function () {
      taxToast.classList.add("hidden");
    }, 2500);

  }


  // ===================================================
  // ASISTENTE IA (BASADO EN REGLAS, 100% LOCAL)
  // ===================================================

  function agregarMensajeChat(autor, texto) {

    if (!taxChatLog) return;

    const linea = document.createElement("p");
    linea.className = "small";
    linea.style.margin = "0 0 8px";

    const etiqueta = document.createElement("strong");
    etiqueta.textContent = autor + ": ";

    linea.appendChild(etiqueta);
    linea.appendChild(document.createTextNode(texto));

    taxChatLog.appendChild(linea);
    taxChatLog.scrollTop = taxChatLog.scrollHeight;

  }

  function responderAsistente(pregunta) {

    const resumen = calcularResumen();
    const q = pregunta.toLowerCase();

    if (q.indexOf("iva") !== -1) {

      return "Tu IVA estimado a pagar este mes es " +
        formatoCLP(resumen.iva) +
        " (19% sobre el margen ventas menos gastos). " +
        "Es una estimación local, no un cálculo oficial del SII.";

    }

    if (q.indexOf("venta") !== -1 || q.indexOf("ingreso") !== -1) {

      return "Llevas " + formatoCLP(resumen.ingresos) +
        " en ventas registradas este mes.";

    }

    if (q.indexOf("gasto") !== -1 || q.indexOf("compra") !== -1) {

      return "Tus gastos registrados este mes suman " +
        formatoCLP(resumen.gastos) + ".";

    }

    if (
      q.indexOf("vencimiento") !== -1 ||
      q.indexOf("fecha") !== -1 ||
      q.indexOf("cuando") !== -1 ||
      q.indexOf("cuándo") !== -1
    ) {

      return "Tu próximo vencimiento estimado del Formulario 29 es el " +
        resumen.vencimiento + ".";

    }

    if (q.indexOf("hola") !== -1) {

      return "¡Hola! Puedo responder preguntas sobre tus ventas, " +
        "gastos, IVA estimado y próximo vencimiento.";

    }

    return "Puedo responder sobre ventas, gastos, IVA estimado o " +
      "el próximo vencimiento del Formulario 29. Intenta preguntar, " +
      "por ejemplo: '¿Cuánto IVA debo pagar este mes?'";

  }

  if (taxChatForm) {

    taxChatForm.addEventListener("submit", function (event) {

      event.preventDefault();

      const pregunta = taxChatInput ? taxChatInput.value.trim() : "";

      if (!pregunta) {
        return;
      }

      agregarMensajeChat("Tú", pregunta);
      agregarMensajeChat("Asistente", responderAsistente(pregunta));

      if (taxChatInput) {
        taxChatInput.value = "";
      }

    });

  }

});
