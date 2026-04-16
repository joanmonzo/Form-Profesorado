import { useState, useEffect } from "react";
import "./index.css";

// =============================================
// URL API
// =============================================
const API_URL =
  "https://script.google.com/macros/s/AKfycbwy8jdOcI_tuU05leo_ld68tGSjPw7rE2QA7tcOe46NIbrhuj-XsFKmTT6sWy-NUlrx/exec";

const INITIAL_FORM = {
  nombre: "",
  sexo: "",
  localidad: "",
  titulacion: "",
  cursos: [],
  precio: "", // Ahora restringido a rango
  certificado_docencia: "",
  fecha_docencia: "",
  certificado_teleformacion: "",
  fecha_teleformacion: "",
  trabajado_con_orbel: "",
  entrevista_curso_anio: "",
  detalles_entrevista: "",
  observaciones: "",
};

// =============================================
// VALIDACIÓN LIMPIA Y DESACOPLADA
// =============================================
const validateStep = (step, form) => {
  const errors = {};

  if (step === 0) {
    if (!form.nombre.trim()) errors.nombre = "El nombre es obligatorio.";
    if (!form.sexo) errors.sexo = "Selecciona el sexo.";
    if (!form.localidad.trim()) errors.localidad = "La localidad es obligatoria.";
  }

  if (step === 1) {
    if (!form.titulacion.trim()) errors.titulacion = "La titulación es obligatoria.";

    // ✅ Restricción estricta del campo Precio (Regex)
    if (!form.precio.trim()) {
      errors.precio = "El precio es obligatorio.";
    } else {
      // Permite números (con coma o punto opcional) separados por guion con espacios opcionales
      const regexRango = /^\d+([.,]\d+)?\s*-\s*\d+([.,]\d+)?$/;
      if (!regexRango.test(form.precio.trim())) {
        errors.precio = "Formato inválido. Debe ser un rango con guion (Ej: 20-30).";
      }
    }

    if (form.cursos.length === 0) errors.cursos = "Selecciona al menos un curso.";

    if (!form.certificado_docencia) errors.certificado_docencia = "Campo obligatorio.";
    if (form.certificado_docencia === "En curso" && !form.fecha_docencia.trim()) {
      errors.fecha_docencia = "Indica cuándo prevés finalizarlo.";
    }

    if (!form.certificado_teleformacion) errors.certificado_teleformacion = "Campo obligatorio.";
    if (form.certificado_teleformacion === "En curso" && !form.fecha_teleformacion.trim()) {
      errors.fecha_teleformacion = "Indica cuándo prevés finalizarlo.";
    }

    if (!form.trabajado_con_orbel) errors.trabajado_con_orbel = "Campo obligatorio.";

    if (!form.entrevista_curso_anio) errors.entrevista_curso_anio = "Campo obligatorio.";
    if (form.entrevista_curso_anio === "Sí" && !form.detalles_entrevista.trim()) {
      errors.detalles_entrevista = "Especifica los detalles de la entrevista.";
    }
  }

  return errors;
};

// =============================================
// SUB-COMPONENTES DE UI
// =============================================
const StepIndicator = ({ currentStep, totalSteps, stepLabels }) => {
  const progress = (currentStep / (totalSteps - 1)) * 100;
  return (
    <div>
      <div className="progress-bar-track">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="step-indicator">
        {stepLabels.map((label, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center" }}>
            <div className="step-item">
              <div className={`step-circle ${i < currentStep ? "done" : i === currentStep ? "active" : ""}`}>
                {i < currentStep ? "✓" : i + 1}
              </div>
              <span className={`step-label ${i === currentStep ? "active" : ""}`}>{label}</span>
            </div>
            {i < totalSteps - 1 && <div className={`step-connector ${i < currentStep ? "done" : ""}`} />}
          </div>
        ))}
      </div>
    </div>
  );
};

const CheckboxPill = ({ label, checked, onChange }) => (
  <label className={`checkbox-pill ${checked ? "selected" : ""}`}>
    <input type="checkbox" checked={checked} onChange={onChange} />
    {checked ? "✓ " : ""}{label}
  </label>
);

const RadioCard = ({ label, value, selected, onChange, emoji }) => (
  <label className={`radio-card ${selected ? "selected" : ""}`}>
    <input type="radio" value={value} checked={selected} onChange={() => onChange(value)} />
    {emoji && <span>{emoji}</span>}
    {label}
  </label>
);

const ReviewRow = ({ label, value }) => (
  <div className="review-row">
    <span className="review-key">{label}</span>
    <span className={`review-val ${!value ? "empty" : ""}`}>{value || "No indicado"}</span>
  </div>
);

const ThemeToggle = ({ theme, setTheme }) => (
  <button className="theme-toggle" onClick={() => setTheme(t => t === "light" ? "dark" : "light")} title="Cambiar tema">
    {theme === "light" ? "☀️" : "🌙"}
  </button>
);

const Header = () => (
  <div style={{ marginBottom: 40, textAlign: "center" }}>
    <h1 className="title-font" style={{ fontSize: 34, fontWeight: 700, marginBottom: 4, letterSpacing: "-0.5px" }}>
      Academia Industrial by Orbel
    </h1>
    <p className="title-font" style={{ fontSize: 11, color: "var(--text-secondary)", letterSpacing: "4px", fontWeight: 600, textTransform: "uppercase", opacity: 0.8 }}>
      Alta de profesorado
    </p>
  </div>
);

const Footer = ({ theme }) => (
  <footer className="footer">
    <img src={theme === "light" ? "/logo-academia.jpeg" : "/logo-academia-dark.png"} alt="Academia Industrial by Orbel" />
  </footer>
);

// =============================================
// COMPONENTE PRINCIPAL
// =============================================
export default function FormProfesorado() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [isOtraLocalidad, setIsOtraLocalidad] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const [theme, setTheme] = useState("light");

  const [cursosDisponibles, setCursosDisponibles] = useState([]);
  const [localidades, setLocalidades] = useState([]);
  const [loadingOpts, setLoadingOpts] = useState(true);

  const STEPS = ["Datos personales", "Perfil profesional", "Revisión"];
  const TOTAL_STEPS = STEPS.length;

  useEffect(() => {
    fetch(`${API_URL}?action=todos`)
      .then(res => res.json())
      .then(data => {
        setCursosDisponibles([...new Set(data.flatMap(p => p.cursos ? (Array.isArray(p.cursos) ? p.cursos : p.cursos.split(",").map(c => c.trim())) : []).filter(Boolean))].sort());
        setLocalidades([...new Set(data.map(p => p.localidad || p.PROVINCIA).filter(Boolean))].sort());
      })
      .catch(() => { })
      .finally(() => setLoadingOpts(false));
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleRadio = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleCursoToggle = curso => {
    setForm(prev => ({
      ...prev,
      cursos: prev.cursos.includes(curso) ? prev.cursos.filter(c => c !== curso) : [...prev.cursos, curso],
    }));
    if (errors.cursos) setErrors(prev => ({ ...prev, cursos: undefined }));
  };

  const handleNext = () => {
    const stepErrors = validateStep(currentStep, form);
    if (Object.keys(stepErrors).length > 0) { setErrors(stepErrors); return; }
    setErrors({});
    setCurrentStep(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setErrors({});
    setCurrentStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const currentYear = new Date().getFullYear().toString();

      const docenciaFinal = form.certificado_docencia === "En curso"
        ? `En curso (${form.fecha_docencia})`
        : form.certificado_docencia;

      const teleformacionFinal = form.certificado_teleformacion === "En curso"
        ? `En curso (${form.fecha_teleformacion})`
        : form.certificado_teleformacion;

      const payload = {
        action: "crear",
        "AÑO": currentYear,
        "NOMBRE": form.nombre,
        "SEXO": form.sexo === "NS" ? "" : form.sexo,
        "PROVINCIA": form.localidad,
        "TITULACIÓN": form.titulacion,
        "PRECIO": form.precio.trim(), // Enviamos limpio de espacios extra
        "CERTIF. DOCENCIA SSCE0110": docenciaFinal,
        "CERTIF. TELEFORMACION/ E-LEARNIING": teleformacionFinal,
        "CERTIF. DOCENCIA PROFESIONALIDAD Y CERTIF. DE ESPECIALIDAD FORMATIVA (PO)": "NO",
        "Entrevista curso AÑO": form.entrevista_curso_anio === "Sí" ? form.detalles_entrevista.trim() : "NO",
        "TRABAJADO CON ORBEL ": form.trabajado_con_orbel,
        "OBERV.": form.observaciones,
        "CURSOS": form.cursos.length > 0 ? form.cursos.join(", ") : "",
      };

      const res = await fetch(`${API_URL}?action=crear`, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("HTTP error");

      setSubmitResult("success");
    } catch (err) {
      setSubmitResult("error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setIsOtraLocalidad(false);
    setCurrentStep(0);
    setErrors({});
    setSubmitResult(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const sexoLabel = { M: "Masculino", F: "Femenino", NS: "No indica" }[form.sexo] ?? null;

  if (submitResult === "success") {
    return (
      <div className="app-container">
        <ThemeToggle theme={theme} setTheme={setTheme} />
        <Header />
        <div className="success-card">
          <div className="success-icon">🎉</div>
          <h2 className="title-font" style={{ fontSize: 26, fontWeight: 700, marginBottom: 10 }}>¡Perfil registrado!</h2>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", maxWidth: 320, margin: "0 auto 28px", lineHeight: 1.6 }}>
            Los datos de <strong>{form.nombre}</strong> se han enviado correctamente y serán añadidos al directorio de profesorado.
          </p>
          <button className="btn-primary" onClick={handleReset}>➕ Añadir otro profesor</button>
        </div>
        <Footer theme={theme} />
      </div>
    );
  }

  if (submitResult === "error") {
    return (
      <div className="app-container">
        <ThemeToggle theme={theme} setTheme={setTheme} />
        <Header />
        <div style={{ background: "var(--danger-bg)", border: "1px solid var(--danger-border)", borderRadius: 16, padding: "40px 32px", textAlign: "center" }}>
          <div style={{ fontSize: 44, marginBottom: 14 }}>⚠️</div>
          <h2 className="title-font" style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: "var(--danger-text)" }}>Error al enviar</h2>
          <p style={{ fontSize: 13, color: "var(--danger-text)", marginBottom: 24, lineHeight: 1.6 }}>
            No se ha podido guardar el perfil. Comprueba tu conexión o que el servidor esté activo.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn-secondary" onClick={handleReset}>Empezar de nuevo</button>
            <button className="btn-primary" onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Reintentando…" : "🔄 Reintentar"}
            </button>
          </div>
        </div>
        <Footer theme={theme} />
      </div>
    );
  }

  return (
    <div className="app-container">
      <ThemeToggle theme={theme} setTheme={setTheme} />
      <Header />
      <StepIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} stepLabels={STEPS} />

      {currentStep === 0 && (
        <div className="panel animate-in">
          <div className="panel-title">👤 Datos personales</div>
          <div className="grid-2">
            <div className="grid-field full-width">
              <label className="label required">Nombre completo</label>
              <input type="text" name="nombre" value={form.nombre} onChange={handleChange} autoComplete="off" className={`input ${errors.nombre ? "error" : ""}`} placeholder="Ej. María García López" />
              {errors.nombre && <span className="field-error">{errors.nombre}</span>}
            </div>

            <div className="grid-field full-width">
              <label className="label required">Sexo</label>
              <div className="radio-group">
                <RadioCard label="Masculino" value="M" emoji="♂️" selected={form.sexo === "M"} onChange={v => handleRadio("sexo", v)} />
                <RadioCard label="Femenino" value="F" emoji="♀️" selected={form.sexo === "F"} onChange={v => handleRadio("sexo", v)} />
                <RadioCard label="No indica" value="NS" emoji="—" selected={form.sexo === "NS"} onChange={v => handleRadio("sexo", v)} />
              </div>
              {errors.sexo && <span className="field-error">{errors.sexo}</span>}
            </div>

            <div className="grid-field full-width">
              <label className="label required">Localidad</label>
              <select
                name="localidadSelector"
                value={isOtraLocalidad ? "__otra__" : form.localidad}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "__otra__") {
                    setIsOtraLocalidad(true);
                    setForm(prev => ({ ...prev, localidad: "" }));
                  } else {
                    setIsOtraLocalidad(false);
                    setForm(prev => ({ ...prev, localidad: val }));
                  }
                  if (errors.localidad) setErrors(prev => ({ ...prev, localidad: undefined }));
                }}
                className={`input ${errors.localidad ? "error" : ""}`}
                disabled={loadingOpts}
              >
                <option value="">{loadingOpts ? "Cargando..." : "Selecciona una localidad…"}</option>
                {localidades.map(l => <option key={l} value={l}>{l}</option>)}
                <option value="__otra__">Otra (escribir manualmente)</option>
              </select>

              {isOtraLocalidad && (
                <input
                  type="text"
                  name="localidad"
                  value={form.localidad}
                  autoComplete="off"
                  onChange={handleChange}
                  className={`input ${errors.localidad ? "error" : ""}`}
                  style={{ marginTop: 8 }}
                  placeholder="Escribe la localidad…"
                />
              )}
              {errors.localidad && <span className="field-error">{errors.localidad}</span>}
            </div>
          </div>
          <div className="form-nav">
            <button className="btn-primary" onClick={handleNext}>Siguiente →</button>
          </div>
        </div>
      )}

      {currentStep === 1 && (
        <div className="panel animate-in">
          <div className="panel-title">🎓 Perfil profesional</div>
          <div className="grid-2">
            <div className="grid-field full-width">
              <label className="label required">Titulación</label>
              <input type="text" name="titulacion" value={form.titulacion} onChange={handleChange} autoComplete="off" className={`input ${errors.titulacion ? "error" : ""}`} placeholder="Ej. Grado en Ingeniería Industrial, FP Electricidad…" />
              {errors.titulacion && <span className="field-error">{errors.titulacion}</span>}
            </div>

            {/* ✅ UI Restringida para Precio */}
            <div className="grid-field full-width">
              <label className="label required">Rango de Precio (€/hora)</label>
              <input
                type="text"
                name="precio"
                value={form.precio}
                onChange={handleChange}
                autoComplete="off"
                className={`input ${errors.precio ? "error" : ""}`}
                placeholder="Ej. 20-30"
              />
              <span className="hint" style={{ color: errors.precio ? "var(--danger-text)" : "var(--text-muted)" }}>
                Obligatorio escribir un rango separado por guion (Ej. <em>20-30</em>).
              </span>
              {errors.precio && <span className="field-error">{errors.precio}</span>}
            </div>

            <div className="grid-field full-width">
              <label className="label required">Cursos que imparte</label>
              {loadingOpts ? (
                <p style={{ fontSize: 13, color: "var(--text-muted)", padding: "8px 0" }}>Cargando cursos disponibles…</p>
              ) : cursosDisponibles.length > 0 ? (
                <div className="checkbox-group">
                  {cursosDisponibles.map(curso => (
                    <CheckboxPill key={curso} label={curso} checked={form.cursos.includes(curso)} onChange={() => handleCursoToggle(curso)} />
                  ))}
                </div>
              ) : (
                <input type="text" className="input" placeholder="Ej. Soldadura, Electricidad, PRL…" onChange={e => setForm(prev => ({ ...prev, cursos: e.target.value.split(",").map(c => c.trim()).filter(Boolean) }))} />
              )}
              {errors.cursos && <span className="field-error">{errors.cursos}</span>}
            </div>

            <div className="grid-field">
              <label className="label required">Certificado Docencia (SSCE0110)</label>
              <div className="radio-group">
                <RadioCard label="Sí" value="Sí" selected={form.certificado_docencia === "Sí"} onChange={v => handleRadio("certificado_docencia", v)} />
                <RadioCard label="No" value="No" selected={form.certificado_docencia === "No"} onChange={v => handleRadio("certificado_docencia", v)} />
                <RadioCard label="En curso" value="En curso" selected={form.certificado_docencia === "En curso"} onChange={v => handleRadio("certificado_docencia", v)} />
              </div>

              {form.certificado_docencia === "En curso" && (
                <div style={{ marginTop: 8 }}>
                  <input
                    type="text"
                    name="fecha_docencia"
                    value={form.fecha_docencia}
                    onChange={handleChange}
                    className={`input ${errors.fecha_docencia ? "error" : ""}`}
                    placeholder="Mes y año estimado (Ej: Sept 2026)"
                    autoFocus
                  />
                  {errors.fecha_docencia && <span className="field-error">{errors.fecha_docencia}</span>}
                </div>
              )}
              {errors.certificado_docencia && !errors.fecha_docencia && <span className="field-error">{errors.certificado_docencia}</span>}
            </div>

            <div className="grid-field">
              <label className="label required">Certificado E-Learning / Teleformación</label>
              <div className="radio-group">
                <RadioCard label="Sí" value="Sí" selected={form.certificado_teleformacion === "Sí"} onChange={v => handleRadio("certificado_teleformacion", v)} />
                <RadioCard label="No" value="No" selected={form.certificado_teleformacion === "No"} onChange={v => handleRadio("certificado_teleformacion", v)} />
                <RadioCard label="En curso" value="En curso" selected={form.certificado_teleformacion === "En curso"} onChange={v => handleRadio("certificado_teleformacion", v)} />
              </div>

              {form.certificado_teleformacion === "En curso" && (
                <div style={{ marginTop: 8 }}>
                  <input
                    type="text"
                    name="fecha_teleformacion"
                    value={form.fecha_teleformacion}
                    onChange={handleChange}
                    className={`input ${errors.fecha_teleformacion ? "error" : ""}`}
                    placeholder="Mes y año estimado (Ej: Sept 2026)"
                    autoFocus
                  />
                  {errors.fecha_teleformacion && <span className="field-error">{errors.fecha_teleformacion}</span>}
                </div>
              )}
              {errors.certificado_teleformacion && !errors.fecha_teleformacion && <span className="field-error">{errors.certificado_teleformacion}</span>}
            </div>

            <div className="grid-field full-width">
              <label className="label required">¿Has realizado una entrevista con nosotros durante este año?</label>
              <div className="radio-group">
                <RadioCard label="Sí" value="Sí" emoji="🗣️" selected={form.entrevista_curso_anio === "Sí"} onChange={v => handleRadio("entrevista_curso_anio", v)} />
                <RadioCard label="No" value="No" emoji="❌" selected={form.entrevista_curso_anio === "No"} onChange={v => handleRadio("entrevista_curso_anio", v)} />
              </div>

              {form.entrevista_curso_anio === "Sí" && (
                <div style={{ marginTop: 8 }}>
                  <input
                    type="text"
                    name="detalles_entrevista"
                    value={form.detalles_entrevista}
                    onChange={handleChange}
                    className={`input ${errors.detalles_entrevista ? "error" : ""}`}
                    placeholder="Especifique curso o puesto (Ej. 2026 BJ / 2026 SOLDADURA)"
                    autoFocus
                  />
                  {errors.detalles_entrevista && <span className="field-error">{errors.detalles_entrevista}</span>}
                </div>
              )}
              {errors.entrevista_curso_anio && !errors.detalles_entrevista && <span className="field-error">{errors.entrevista_curso_anio}</span>}
            </div>

            <div className="grid-field full-width">
              <label className="label required">¿Ha trabajado anteriormente con Orbel?</label>
              <div className="radio-group">
                <RadioCard label="Sí" value="Sí" emoji="✅" selected={form.trabajado_con_orbel === "Sí"} onChange={v => handleRadio("trabajado_con_orbel", v)} />
                <RadioCard label="No" value="No" emoji="❌" selected={form.trabajado_con_orbel === "No"} onChange={v => handleRadio("trabajado_con_orbel", v)} />
              </div>
              {errors.trabajado_con_orbel && <span className="field-error">{errors.trabajado_con_orbel}</span>}
            </div>

            <div className="grid-field full-width">
              <label className="label">Observaciones</label>
              <textarea name="observaciones" value={form.observaciones} onChange={handleChange} rows={4} className="input" placeholder="Disponibilidad, especialidades concretas, notas de contacto…" />
            </div>
          </div>
          <div className="form-nav">
            <button className="btn-secondary" onClick={handleBack}>← Atrás</button>
            <button className="btn-primary" onClick={handleNext}>Revisar datos →</button>
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="animate-in">
          <div className="panel">
            <div className="panel-title">📋 Datos personales</div>
            <ReviewRow label="Nombre" value={form.nombre} />
            <ReviewRow label="Sexo" value={sexoLabel} />
            <ReviewRow label="Localidad" value={form.localidad} />
          </div>

          <div className="panel">
            <div className="panel-title">🎓 Perfil profesional</div>
            <ReviewRow label="Titulación" value={form.titulacion} />
            <ReviewRow label="Precio (€/h)" value={form.precio ? `${form.precio} €` : null} />
            <ReviewRow label="Cursos" value={form.cursos.length > 0 ? form.cursos.join(", ") : null} />

            <ReviewRow
              label="Cert. Docencia"
              value={form.certificado_docencia === "En curso" ? `En curso (${form.fecha_docencia})` : form.certificado_docencia}
            />
            <ReviewRow
              label="Cert. E-Learning"
              value={form.certificado_teleformacion === "En curso" ? `En curso (${form.fecha_teleformacion})` : form.certificado_teleformacion}
            />

            <ReviewRow
              label="Entrevista este año"
              value={form.entrevista_curso_anio === "Sí" ? form.detalles_entrevista : "NO"}
            />

            <ReviewRow label="Trabajó en Orbel" value={form.trabajado_con_orbel} />
            <ReviewRow label="Observaciones" value={form.observaciones} />
          </div>

          <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: 10, padding: "14px 18px", fontSize: 12, color: "var(--text-muted)", marginBottom: 8, lineHeight: 1.5 }}>
            ℹ️ Revisa que los datos son correctos. Al confirmar, el perfil se añadirá directamente al directorio de profesorado de Academia Industrial.
          </div>

          <div className="form-nav">
            <button className="btn-secondary" onClick={handleBack}>← Editar</button>
            <button className="btn-primary" onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Enviando…" : "✅ Confirmar y guardar"}
            </button>
          </div>
        </div>
      )}

      <Footer theme={theme} />
    </div>
  );
}