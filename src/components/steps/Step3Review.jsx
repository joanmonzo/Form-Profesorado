// src/components/steps/Step3Review.jsx
import React from 'react';
import { ReviewRow } from '../ui';

export const Step3Review = ({ form, submitting, handleBack, handleSubmit }) => {
    const sexoLabel = { M: "Masculino", F: "Femenino", NS: "No indica" }[form.sexo] ?? null;

    return (
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
                <ReviewRow label="Cert. Docencia" value={form.certificado_docencia === "En curso" ? `En curso (${form.fecha_docencia})` : form.certificado_docencia} />
                <ReviewRow label="Cert. E-Learning" value={form.certificado_teleformacion === "En curso" ? `En curso (${form.fecha_teleformacion})` : form.certificado_teleformacion} />
                <ReviewRow label="Entrevista realizada" value={form.entrevista_curso_anio === "Sí" ? form.detalles_entrevista : "NO"} />
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
    );
};