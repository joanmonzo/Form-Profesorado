import { useState, useEffect } from "react";
import "./index.css";
import { Header, Footer, ThemeToggle, StepIndicator } from "./components/ui";
import { Step1Personal } from "./components/steps/Step1Personal";
import { Step2Profesional } from "./components/steps/Step2Profesional";
import { Step3Review } from "./components/steps/Step3Review";
import { validateStep } from "./utils/validations";

const API_URL = "https://script.google.com/macros/s/AKfycbwy8jdOcI_tuU05leo_ld68tGSjPw7rE2QA7tcOe46NIbrhuj-XsFKmTT6sWy-NUlrx/exec";

const BASE_CURSOS = [
  "UNE", "PRL", "Gestión Mediomabiental", "Limpieza", "Mantenimiento",
  "Electromecanica", "Electricidad", "Soldadura", "Logística", "Ingles",
  "BJ", "SAG", "Carretilla", "Carretilla- Traspalet",
  "Maquinaria Almacen 4M (carretilla-traspalet-retractil-apilador)",
  "Movimiento tierras 4M(pala cargadora-retroexcavadora-mini excavadora-Mini Dumper)",
  "Puente Grúa y Polipasto", "PEMP(Brazo-Tijera)", "Altura", "Espacios Confinados"
];

const INITIAL_FORM = {
  nombre: "", sexo: "", localidad: "", titulacion: "", cursos: [],
  precio: "", certificado_docencia: "", fecha_docencia: "",
  certificado_teleformacion: "", fecha_teleformacion: "",
  trabajado_con_orbel: "", detalles_orbel: "", observaciones: "",
};

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

  useEffect(() => {
    fetch(`${API_URL}?action=todos`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          const cursosExtraidos = [...new Set([
            ...BASE_CURSOS,
            ...data.flatMap(p => {
              if (!p.cursos) return [];
              return Array.isArray(p.cursos) ? p.cursos : String(p.cursos).split(",").map(c => c.trim());
            })
          ])].filter(Boolean).sort();
          setCursosDisponibles(cursosExtraidos);

          const locsExtraidas = [...new Set(
            data.map(p => p.localidad || p.PROVINCIA || p.provincia)
          )].filter(Boolean).sort();
          setLocalidades(locsExtraidas);
        } else {
          setCursosDisponibles([...BASE_CURSOS].sort());
        }
      })
      .catch(err => {
        console.error(err);
        setCursosDisponibles([...BASE_CURSOS].sort());
      })
      .finally(() => setLoadingOpts(false));
  }, []);

  useEffect(() => { document.documentElement.setAttribute("data-theme", theme); }, [theme]);

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
      cursos: prev.cursos.includes(curso) ? prev.cursos.filter(c => c !== curso) : [...prev.cursos, curso]
    }));
    if (errors.cursos) setErrors(prev => ({ ...prev, cursos: undefined }));
  };

  const handleNext = () => {
    const stepErrors = validateStep(currentStep, form);
    if (Object.keys(stepErrors).length > 0) { setErrors(stepErrors); return; }
    setErrors({}); setCurrentStep(prev => prev + 1); window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setErrors({}); setCurrentStep(prev => prev - 1); window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        action: "crear",
        "AÑO": new Date().getFullYear().toString(),
        "NOMBRE": form.nombre.toUpperCase(),
        "SEXO": form.sexo.toUpperCase(),
        "PROVINCIA": form.localidad.toUpperCase(),
        "TITULACIÓN": form.titulacion.toUpperCase(),
        "PRECIO": form.precio.trim().toUpperCase(),
        "CERTIF. DOCENCIA SSCE0110": form.certificado_docencia === "EN CURSO" ? `EN CURSO (${form.fecha_docencia})` : form.certificado_docencia,
        "CERTIF. TELEFORMACION/ E-LEARNIING": form.certificado_teleformacion === "EN CURSO" ? `EN CURSO (${form.fecha_teleformacion})` : form.certificado_teleformacion,
        "TRABAJADO CON ORBEL": form.trabajado_con_orbel === "SI" ? form.detalles_orbel.trim().toUpperCase() : "NO",
        "OBERV.": form.observaciones.toUpperCase(),
        "CURSOS": form.cursos.length > 0 ? form.cursos.join(", ").toUpperCase() : ""
      };

      cursosDisponibles.forEach(curso => {
        payload[curso] = form.cursos.includes(curso) ? "SI" : "NO";
      });

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error();
      setSubmitResult("success");
    } catch { setSubmitResult("error"); } finally { setSubmitting(false); }
  };

  const handleReset = () => {
    setForm(INITIAL_FORM); setIsOtraLocalidad(false); setCurrentStep(0); setErrors({}); setSubmitResult(null); window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (submitResult === "success") return (
    <div className="app-container"><ThemeToggle theme={theme} setTheme={setTheme} /><Header />
      <div className="success-card">
        <div className="success-icon">🎉</div>
        <h2 className="title-font" style={{ fontSize: 26 }}>¡Perfil registrado!</h2>
        <button className="btn-primary" onClick={handleReset}>➕ Añadir otro profesor</button>
      </div>
      <Footer theme={theme} />
    </div>
  );

  if (submitResult === "error") return (
    <div className="app-container"><ThemeToggle theme={theme} setTheme={setTheme} /><Header />
      <div className="panel" style={{ textAlign: "center" }}>
        <h2 style={{ color: "var(--danger-text)" }}>Error al enviar</h2>
        <button className="btn-primary" onClick={handleSubmit} disabled={submitting}>🔄 Reintentar</button>
      </div>
      <Footer theme={theme} />
    </div>
  );

  return (
    <div className="app-container">
      <ThemeToggle theme={theme} setTheme={setTheme} /><Header />
      <StepIndicator currentStep={currentStep} totalSteps={STEPS.length} stepLabels={STEPS} />
      {currentStep === 0 && <Step1Personal form={form} errors={errors} handleChange={handleChange} handleRadio={handleRadio} localidades={localidades} loadingOpts={loadingOpts} isOtraLocalidad={isOtraLocalidad} setIsOtraLocalidad={setIsOtraLocalidad} setForm={setForm} setErrors={setErrors} handleNext={handleNext} />}
      {currentStep === 1 && <Step2Profesional form={form} errors={errors} handleChange={handleChange} handleRadio={handleRadio} handleCursoToggle={handleCursoToggle} setForm={setForm} cursosDisponibles={cursosDisponibles} loadingOpts={loadingOpts} handleNext={handleNext} handleBack={handleBack} />}
      {currentStep === 2 && <Step3Review form={form} submitting={submitting} handleBack={handleBack} handleSubmit={handleSubmit} />}
      <Footer theme={theme} />
    </div>
  );
}