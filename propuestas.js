// =====================================================
// GOLD SERVICES - PROPUESTAS COMERCIALES
// Genera cotizaciones con la identidad oficial de marca,
// replicando el formato de la propuesta comercial impresa.
// =====================================================

(function () {

  const IVA_TASA = 0.19;
  const STORAGE_KEY = "goldPropuestas";

  const ALCANCE_TITULO_DEFAULT =
    "Supervisión Técnica y Control de Calidad en Planta";

  const ALCANCE_TEXTO_DEFAULT =
    "1. Objetivo\n" +
    "Garantizar la conformidad de la fruta de exportación en cada etapa del proceso, desde la " +
    "recepción de materia prima hasta el despacho del contenedor, mediante inspección técnica " +
    "independiente, registro documentado y reportabilidad en tiempo real hacia el cliente.\n\n" +
    "2. Alcance Operativo en Planta\n" +
    "2.1 Recepción — Control en Entrada\n" +
    "Inspección de cada lote de materia prima al ingreso a planta: muestreo de calibre, BRIX, " +
    "firmeza, temperatura de pulpa y evaluación de defectos de condición y calidad según pauta " +
    "técnica. Registro fotográfico de muestras y generación de Puntaje Final y % de Exportación " +
    "estimado por lote.\n\n" +
    "2.2 Proceso — Línea de Empaque\n" +
    "Supervisión continua de la línea de packing: control de velocidad de proceso, temperatura de " +
    "cámara, gasificación, reinspección y condición orgánica cuando corresponda. Verificación de " +
    "embalaje y peso de caja, y registro de defectos detectados durante el proceso.\n\n" +
    "2.3 Despacho — Salida y Pre-Embarque\n" +
    "Control final previo a la carga del contenedor: verificación de composición de pallets, cajas " +
    "y kilos por variedad, temperatura de despacho, y sellado del informe de embarque con firma y " +
    "sello digital.\n\n" +
    "3. Sistema de Reportabilidad y Control de Información\n" +
    "3.1 Procesamiento Interno de Datos\n" +
    "Toda la información levantada en terreno se centraliza y estructura por cliente, variedad, " +
    "planta y fecha, permitiendo trazabilidad completa de cada lote desde recepción hasta embarque.\n\n" +
    "3.2 Informes Ejecutivos Consolidados\n" +
    "Generación de reportes consolidados por período (diario, semanal, por temporada) con " +
    "indicadores clave: puntajes de condición y calidad, % de exportación, volumen procesado y " +
    "detalle de defectos por categoría.\n\n" +
    "3.3 Sistema de Alertas Tempranas\n" +
    "Identificación de lotes fuera de rango o con defectos críticos (ej. pudrición, micelio) para " +
    "permitir acción correctiva inmediata antes del embarque.\n\n" +
    "4. Valor de la Propuesta\n" +
    "Un control de calidad independiente y sistemático reduce el riesgo de rechazos en destino, " +
    "protege la relación comercial con el cliente extranjero y entrega respaldo documental " +
    "verificable en cada etapa del proceso de exportación.\n\n" +
    "5. Compromiso de Servicio\n" +
    "Gold Services and Consulting SpA se compromete a la presencia de un inspector calificado en " +
    "cada turno de recepción y packing acordado, con entrega de informes dentro de las 24 horas " +
    "siguientes a su generación.";

  const CONDICIONES_COMERCIALES = [
    {
      titulo: "Facturación",
      texto: "Se realizará el último día de cada mes por los servicios efectivamente prestados durante dicho período."
    },
    {
      titulo: "Forma de pago",
      texto: "Transferencia bancaria."
    },
    {
      titulo: "Plazo de pago",
      texto: "El pago deberá efectuarse el último día del mes en que se hayan ejecutado los servicios."
    },
    {
      titulo: "Validez de la propuesta",
      texto: "La presente propuesta tendrá una vigencia de 30 días corridos contados desde la fecha indicada en el documento."
    }
  ];

  const GS_LOGO_SVG =
    '<svg width="46" height="46" viewBox="0 0 100 100" role="img" aria-label="Gold Services">' +
    '<polygon points="50,4 90,27 90,73 50,96 10,73 10,27" fill="none" stroke="#D4AF37" stroke-width="4"/>' +
    '<circle cx="50" cy="4" r="3.4" fill="#D4AF37"/><circle cx="90" cy="27" r="3.4" fill="#D4AF37"/>' +
    '<circle cx="90" cy="73" r="3.4" fill="#D4AF37"/><circle cx="50" cy="96" r="3.4" fill="#D4AF37"/>' +
    '<circle cx="10" cy="73" r="3.4" fill="#D4AF37"/><circle cx="10" cy="27" r="3.4" fill="#D4AF37"/>' +
    '<text x="50" y="53" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-weight="700" ' +
    'font-size="28" fill="#0B2265">GS</text>' +
    '<path d="M33 68 Q40 58 50 61 Q44 73 33 68 Z" fill="#2E6F40"/>' +
    '<path d="M67 68 Q60 58 50 61 Q56 73 67 68 Z" fill="#2E6F40"/></svg>';

  const money = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0
  });

  function formatCLP(valor) {
    return money.format(Math.round(valor || 0));
  }

  function escapeHtml(texto) {
    return String(texto || "").replace(/[&<>"']/g, function (c) {
      return ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      })[c];
    });
  }


  // ===================================================
  // ALMACENAMIENTO
  // ===================================================

  function obtenerPropuestas() {

    try {

      const datos = localStorage.getItem(STORAGE_KEY);
      return datos ? JSON.parse(datos) : [];

    } catch (error) {

      console.error("GOLD SERVICES: No se pudieron leer las propuestas.", error);
      return [];

    }

  }

  function guardarPropuestas(propuestas) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(propuestas));
  }

  function sembrarEjemplo() {

    if (obtenerPropuestas().length > 0) {
      return;
    }

    const ejemplo = {
      id: "gs-" + Date.now(),
      cliente: "Alfredo Moyano",
      fecha: "2026-08-17",
      items: [
        { servicio: "Servicio mensual R+QC+D", cantidad: 1, valorUnit: 6000000 }
      ],
      notas: "",
      alcanceTitulo: ALCANCE_TITULO_DEFAULT,
      alcanceTexto: ALCANCE_TEXTO_DEFAULT,
      creadoEn: new Date().toISOString()
    };

    guardarPropuestas([ejemplo]);

  }


  // ===================================================
  // FORMULARIO — LÍNEAS DE SERVICIO
  // ===================================================

  const itemsContainer = document.getElementById("propuestaItems");

  function crearFilaItem(servicio, cantidad, valorUnit) {

    const fila = document.createElement("div");
    fila.className = "item-row";

    fila.innerHTML =
      '<input type="text" class="item-servicio" placeholder="Servicio" value="' +
      escapeHtml(servicio || "") + '">' +
      '<input type="number" class="item-cantidad" min="1" step="1" value="' +
      (cantidad || 1) + '">' +
      '<input type="number" class="item-valor" min="0" step="1" placeholder="Valor unit. (CLP)" value="' +
      (valorUnit || "") + '">' +
      '<span class="item-subtotal">$0</span>' +
      '<button type="button" class="item-remove" title="Quitar servicio">✕</button>';

    fila.querySelectorAll("input").forEach(function (input) {
      input.addEventListener("input", recalcularTotales);
    });

    fila.querySelector(".item-remove").addEventListener("click", function () {

      if (itemsContainer.children.length > 1) {
        fila.remove();
        recalcularTotales();
      }

    });

    return fila;

  }

  function agregarFilaItem(servicio, cantidad, valorUnit) {
    itemsContainer.appendChild(crearFilaItem(servicio, cantidad, valorUnit));
    recalcularTotales();
  }

  function leerItemsFormulario() {

    return Array.from(itemsContainer.querySelectorAll(".item-row")).map(function (fila) {

      const cantidad = parseFloat(fila.querySelector(".item-cantidad").value) || 0;
      const valorUnit = parseFloat(fila.querySelector(".item-valor").value) || 0;

      return {
        servicio: fila.querySelector(".item-servicio").value.trim(),
        cantidad: cantidad,
        valorUnit: valorUnit
      };

    });

  }

  function calcularTotales(items) {

    const neto = items.reduce(function (acc, item) {
      return acc + (item.cantidad * item.valorUnit);
    }, 0);

    const iva = neto * IVA_TASA;

    return { neto: neto, iva: iva, total: neto + iva };

  }

  function recalcularTotales() {

    const items = leerItemsFormulario();

    Array.from(itemsContainer.querySelectorAll(".item-row")).forEach(function (fila, i) {

      const subtotal = items[i].cantidad * items[i].valorUnit;
      fila.querySelector(".item-subtotal").textContent = formatCLP(subtotal);

    });

    const totales = calcularTotales(items);

    document.getElementById("totalNeto").textContent = formatCLP(totales.neto);
    document.getElementById("totalIva").textContent = formatCLP(totales.iva);
    document.getElementById("totalTotal").textContent = formatCLP(totales.total);

  }


  // ===================================================
  // LISTADO DE PROPUESTAS
  // ===================================================

  function renderTablaPropuestas() {

    const propuestas = obtenerPropuestas();
    const tbody = document.getElementById("propuestasTableBody");
    const vacio = document.getElementById("propuestasEmpty");

    tbody.innerHTML = "";
    vacio.hidden = propuestas.length > 0;

    propuestas
      .slice()
      .reverse()
      .forEach(function (propuesta) {

        const totales = calcularTotales(propuesta.items);
        const fila = document.createElement("tr");

        fila.innerHTML =
          "<td>" + escapeHtml(propuesta.cliente) + "</td>" +
          "<td>" + escapeHtml(propuesta.fecha) + "</td>" +
          "<td>" + formatCLP(totales.total) + "</td>" +
          '<td style="white-space:nowrap;">' +
          '<button type="button" class="btn ghost ver-propuesta" data-id="' + propuesta.id + '">Ver</button> ' +
          '<button type="button" class="btn ghost eliminar-propuesta" data-id="' + propuesta.id + '">Eliminar</button>' +
          "</td>";

        tbody.appendChild(fila);

      });

    tbody.querySelectorAll(".ver-propuesta").forEach(function (btn) {
      btn.addEventListener("click", function () {
        imprimirPropuesta(btn.dataset.id);
      });
    });

    tbody.querySelectorAll(".eliminar-propuesta").forEach(function (btn) {
      btn.addEventListener("click", function () {
        eliminarPropuesta(btn.dataset.id);
      });
    });

  }

  function eliminarPropuesta(id) {

    const propuestas = obtenerPropuestas().filter(function (p) {
      return p.id !== id;
    });

    guardarPropuestas(propuestas);
    renderTablaPropuestas();
    actualizarKpisPropuestas();

    if (typeof window.goldToast === "function") {
      window.goldToast("Propuesta eliminada.");
    }

  }


  // ===================================================
  // KPIs DEL DASHBOARD
  // ===================================================

  window.actualizarKpisPropuestas = function () {

    const propuestas = obtenerPropuestas();

    const totalKpi = document.getElementById("kpiTotalPropuestas");
    const montoKpi = document.getElementById("kpiMontoTotal");
    const clienteKpi = document.getElementById("kpiUltimoCliente");
    const fechaKpi = document.getElementById("kpiUltimaFecha");

    if (!totalKpi) {
      return;
    }

    totalKpi.textContent = propuestas.length;

    const montoTotal = propuestas.reduce(function (acc, p) {
      return acc + calcularTotales(p.items).total;
    }, 0);

    montoKpi.textContent = formatCLP(montoTotal);

    if (propuestas.length > 0) {

      const ultima = propuestas[propuestas.length - 1];
      clienteKpi.textContent = ultima.cliente;
      fechaKpi.textContent = ultima.fecha;

    } else {

      clienteKpi.textContent = "—";
      fechaKpi.textContent = "Sin registros";

    }

  };


  // ===================================================
  // DOCUMENTO IMPRIMIBLE
  // ===================================================

  function renderAlcanceHtml(texto) {
    return escapeHtml(texto).replace(/\n/g, "<br>");
  }

  function imprimirPropuesta(id) {

    const propuesta = obtenerPropuestas().find(function (p) {
      return p.id === id;
    });

    if (!propuesta) {
      return;
    }

    const totales = calcularTotales(propuesta.items);

    const filasTabla = propuesta.items.map(function (item) {

      const subtotal = item.cantidad * item.valorUnit;

      return "<tr>" +
        "<td>" + escapeHtml(item.servicio) + "</td>" +
        "<td>" + item.cantidad + "</td>" +
        "<td>" + formatCLP(item.valorUnit) + "</td>" +
        "<td>" + formatCLP(subtotal) + "</td>" +
        "</tr>";

    }).join("");

    const condicionesHtml = CONDICIONES_COMERCIALES.map(function (c) {
      return "<li><strong>" + escapeHtml(c.titulo) + ":</strong> " + escapeHtml(c.texto) + "</li>";
    }).join("");

    const notasHtml = propuesta.notas
      ? "<p style=\"margin-top:10px;\">" + escapeHtml(propuesta.notas) + "</p>"
      : "";

    const printArea = document.getElementById("proposalPrintArea");

    printArea.innerHTML =
      '<div class="doc">' +
      '<div class="doc-head">' + GS_LOGO_SVG +
      "<h1>GOLD SERVICES - Propuesta Comercial</h1></div>" +
      '<hr class="doc-rule">' +
      '<div class="doc-fields">' +
      '<div class="doc-field"><label>Cliente:</label>' + escapeHtml(propuesta.cliente) + "</div>" +
      '<div class="doc-field"><label>Fecha:</label>' + escapeHtml(propuesta.fecha) + "</div>" +
      "</div>" +
      "<h2>Servicios y valores</h2>" +
      '<table class="doc-table"><thead><tr><th>Servicio</th><th>Cant.</th>' +
      "<th>Valor unit. (CLP)</th><th>Subtotal</th></tr></thead>" +
      "<tbody>" + filasTabla + "</tbody></table>" +
      '<div class="doc-totals">' +
      '<div class="row"><span>Neto</span><span>' + formatCLP(totales.neto) + "</span></div>" +
      '<div class="row"><span>IVA (19%)</span><span>' + formatCLP(totales.iva) + "</span></div>" +
      '<div class="row total"><span>Total</span><span>' + formatCLP(totales.total) + "</span></div>" +
      "</div>" +
      "<h3>Notas</h3>" +
      '<div class="doc-notes"><strong>Condiciones Comerciales</strong><ul>' +
      condicionesHtml + "</ul>" + notasHtml + "</div>" +
      '<div class="doc-pagebreak"></div>' +
      "<h2>Alcance de Servicio: " + escapeHtml(propuesta.alcanceTitulo || ALCANCE_TITULO_DEFAULT) + "</h2>" +
      '<div class="doc-alcance">' + renderAlcanceHtml(propuesta.alcanceTexto || ALCANCE_TEXTO_DEFAULT) + "</div>" +
      '<div class="doc-firma"><div class="doc-sign-line"></div>Firma responsable Gold Services</div>' +
      "</div>";

    printArea.hidden = false;
    document.body.classList.add("printing");

    window.print();

  }

  window.addEventListener("afterprint", function () {

    document.body.classList.remove("printing");

    const printArea = document.getElementById("proposalPrintArea");

    if (printArea) {
      printArea.hidden = true;
    }

  });


  // ===================================================
  // INICIALIZACIÓN
  // ===================================================

  document.addEventListener("DOMContentLoaded", function () {

    if (!itemsContainer) {
      return;
    }

    sembrarEjemplo();

    document.getElementById("propFecha").value =
      new Date().toISOString().slice(0, 10);

    document.getElementById("propAlcanceTitulo").value = ALCANCE_TITULO_DEFAULT;
    document.getElementById("propAlcanceTexto").value = ALCANCE_TEXTO_DEFAULT;

    agregarFilaItem("", 1, "");

    document.getElementById("addItemBtn").addEventListener("click", function () {
      agregarFilaItem("", 1, "");
    });

    document.getElementById("propuestaForm").addEventListener("submit", function (event) {

      event.preventDefault();

      const cliente = document.getElementById("propCliente").value.trim();
      const fecha = document.getElementById("propFecha").value;
      const items = leerItemsFormulario().filter(function (item) {
        return item.servicio && item.cantidad > 0 && item.valorUnit > 0;
      });

      if (!cliente || !fecha || items.length === 0) {

        if (typeof window.goldToast === "function") {
          window.goldToast("Completa cliente, fecha y al menos un servicio válido.");
        }

        return;

      }

      const propuesta = {
        id: "gs-" + Date.now(),
        cliente: cliente,
        fecha: fecha,
        items: items,
        notas: document.getElementById("propNotas").value.trim(),
        alcanceTitulo: document.getElementById("propAlcanceTitulo").value.trim() || ALCANCE_TITULO_DEFAULT,
        alcanceTexto: document.getElementById("propAlcanceTexto").value,
        creadoEn: new Date().toISOString()
      };

      const propuestas = obtenerPropuestas();
      propuestas.push(propuesta);
      guardarPropuestas(propuestas);

      renderTablaPropuestas();
      actualizarKpisPropuestas();

      if (typeof window.goldToast === "function") {
        window.goldToast("Propuesta guardada para " + cliente + ".");
      }

    });

    document.getElementById("exportPropuestasBtn").addEventListener("click", function () {

      const blob = new Blob(
        [JSON.stringify(obtenerPropuestas(), null, 2)],
        { type: "application/json" }
      );

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = "gold-services-propuestas.json";
      a.click();

      URL.revokeObjectURL(url);

    });

    document.getElementById("exportExcelBtn").addEventListener("click", function () {

      if (typeof XLSX === "undefined") {

        if (typeof window.goldToast === "function") {
          window.goldToast("No se pudo cargar el módulo de Excel (vendor/xlsx.core.min.js).");
        }

        return;

      }

      const propuestas = obtenerPropuestas();

      if (propuestas.length === 0) {

        if (typeof window.goldToast === "function") {
          window.goldToast("Aún no hay propuestas para exportar.");
        }

        return;

      }

      const filas = [];

      propuestas.forEach(function (propuesta) {

        const totales = calcularTotales(propuesta.items);

        propuesta.items.forEach(function (item, indice) {

          filas.push({
            Cliente: propuesta.cliente,
            Fecha: propuesta.fecha,
            Servicio: item.servicio,
            "Cantidad": item.cantidad,
            "Valor unit. (CLP)": item.valorUnit,
            "Subtotal (CLP)": item.cantidad * item.valorUnit,
            "Neto propuesta (CLP)": indice === 0 ? Math.round(totales.neto) : "",
            "IVA 19% (CLP)": indice === 0 ? Math.round(totales.iva) : "",
            "Total propuesta (CLP)": indice === 0 ? Math.round(totales.total) : "",
            "Alcance de servicio": indice === 0 ? propuesta.alcanceTitulo : "",
            "Notas": indice === 0 ? propuesta.notas : ""
          });

        });

      });

      const hoja = XLSX.utils.json_to_sheet(filas);

      hoja["!cols"] = [
        { wch: 20 }, { wch: 12 }, { wch: 26 }, { wch: 10 }, { wch: 16 },
        { wch: 16 }, { wch: 18 }, { wch: 14 }, { wch: 18 }, { wch: 34 }, { wch: 30 }
      ];

      const libro = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(libro, hoja, "Propuestas");

      XLSX.writeFile(libro, "gold-services-propuestas.xlsx");

      if (typeof window.goldToast === "function") {
        window.goldToast("Excel generado: gold-services-propuestas.xlsx");
      }

    });

    renderTablaPropuestas();
    actualizarKpisPropuestas();

  });

})();
