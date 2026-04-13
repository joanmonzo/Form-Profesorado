# 📋 Form Profesorado — Academia Industrial by Orbel

Formulario React multi-paso para dar de alta a nuevos profesores directamente desde el navegador, **sin necesidad de entrar en el Excel**.

Los datos se envían al mismo Google Apps Script que ya usa `appProfesorado`, añadiendo únicamente una nueva acción `"insertar"` al `doPost`.

---

## 🚀 Instalación y arranque

```bash
npm install
npm start
# → http://localhost:3000
```

---

## 🏗️ Estructura

```
src/
  App.js                  → Punto de entrada
  FormProfesorado.jsx     → Componente principal (3 pasos + validación)
  index.css               → Design system (tokens, componentes, tema)
```

---

## ⚙️ Google Apps Script — Añadir acción `insertar`

Abre tu Apps Script existente y añade el `case "insertar"` dentro del `doPost`:

```javascript
function doPost(e) {
  const params = e.parameter;

  // ── Acción existente: observaciones ──────────────────────────
  if (params.action === "observaciones") {
    // ... tu código actual ...
  }

  // ── Nueva acción: alta de profesor ───────────────────────────
  if (params.action === "insertar") {
    const sheet = SpreadsheetApp.getActiveSpreadsheet()
      .getSheetByName("Profesorado"); // ajusta el nombre de tu hoja

    sheet.appendRow([
      new Date(),                        // Columna: Fecha de alta
      params.nombre             || "",
      params.sexo               || "",
      params.localidad          || "",
      params.titulacion         || "",
      params.cursos             || "",   // string CSV: "Soldadura, PRL"
      params.precio             || "",
      params.certificado_docencia      || "",
      params.certificado_teleformacion || "",
      params.trabajado_con_orbel       || "",
      params.observaciones      || "",
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

> ⚠️ Tras editar el script, **vuelve a desplegarlo** como aplicación web (nueva versión) para que los cambios surtan efecto.

---

## 📊 Campos del formulario

| Campo                       | Obligatorio | Tipo        | Notas                              |
|-----------------------------|-------------|-------------|------------------------------------|
| `nombre`                    | ✅          | texto       | Nombre completo                    |
| `sexo`                      | ✅          | M / F       | "NS" se envía como vacío           |
| `localidad`                 | ✅          | texto       | Cargado dinámicamente de la API    |
| `titulacion`                | ✅          | texto       | Libre                              |
| `cursos`                    | ✅          | texto CSV   | Pills cargadas de la API           |
| `precio`                    | —           | texto       | Fijo o rango (ej. `20-30`)         |
| `certificado_docencia`      | ✅          | Sí/No/En curso |                                 |
| `certificado_teleformacion` | ✅          | Sí/No/En curso |                                 |
| `trabajado_con_orbel`       | ✅          | Sí/No       |                                    |
| `observaciones`             | —           | texto largo | Notas libres                       |

---

## 🎨 Coherencia visual

El formulario comparte exactamente los mismos tokens CSS (`--accent-color`, `--bg-primary`, etc.), fuentes **League Spartan** + **Ubuntu** y patrón de tema claro/oscuro que `appProfesorado`. Ambas apps son visualmente idénticas sin ninguna configuración extra.

---

## 📦 Deploy recomendado

```bash
# Vercel (más sencillo)
npx vercel --prod

# GitHub Pages
# 1. Añade en package.json: "homepage": "."
# 2. npm install gh-pages --save-dev
# 3. npm run build && npx gh-pages -d build
```
