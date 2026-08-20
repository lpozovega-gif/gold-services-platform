# Gold Services — Sistema Operativo Digital V1.0

MVP web estático para **Gold Services and Consulting SpA**, enfocado en **arándanos y avellanas**.

## Módulos
- Dashboard operacional
- CRM de clientes/productores
- Catálogo Gold Sampling / Gold Certify / Gold Sourcing
- Operaciones y proyectos
- Gold Trace: registro de lotes + QR
- Checklist base GLOBALG.A.P. / SAG
- Matriz de mercados objetivo
- Gestión Tributaria IA (demo local, ver más abajo)
- Exportación de respaldo JSON

## Gestión Tributaria IA
Módulo demo inspirado en apps de gestión tributaria con IA (como Cenit),
pensado para que la propia empresa registre sus ventas y gastos:
- Registro manual de movimientos (ventas/gastos) guardado en `localStorage`.
- KPIs de ingresos, gastos, IVA estimado (19% sobre el margen del mes) y
  próximo vencimiento estimado del Formulario 29.
- Asistente de preguntas y respuestas **basado en reglas, 100% local**
  (no es un modelo de lenguaje conectado a internet).
- Exportación de un respaldo JSON del módulo.

**Importante:** este módulo NO se conecta al SII, al SAT ni a ningún
servicio externo. Es una demostración/prototipo, no un producto de
cumplimiento tributario real.

## Datos de negocio incorporados
- Gold Sampling: 6,5 UF / 8 UF / 3,5 UF / 2,5 UF mensual
- Gold Certify: 25 UF / 45 UF
- Gold Sourcing: US$1.200/mes + US$0,05/kg
- La certificación oficial la emite un organismo acreditado externo; Gold Services prepara y verifica.

## Ejecutar
Abre `index.html` en un navegador moderno. Los registros se guardan localmente en `localStorage`.

## GitHub Pages
El repositorio incluye un workflow en `.github/workflows/pages.yml`. Después de subir el proyecto a GitHub, configura Pages para usar **GitHub Actions**.
