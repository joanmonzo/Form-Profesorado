import React from 'react';
import { ReviewRow } from '../ui';

const formatMonth = (dateStr) => {
    if (!dateStr) return "";
    const [year, month] = dateStr.split("-");
    return `${month}/${year}`;
};

export const Step3Review = ({ form, submitting, handleBack, handleSubmit }) => {
    const sexoLabel = { M: "Masculino", F: "Femenino", NS: "No indica" }[form.sexo] || "No indicado";

    const standardKeys = [
        'nombre', 'sexo', 'localidad', 'titulacion', 'precio', 'cursos',
        'certificado_docencia', 'fecha_docencia', 'certificado_teleformacion',
        'fecha_teleformacion', 'trabajado_con_orbel', 'detalles_orbel',
        'observaciones', 'entrevista_curso_anio'
    ];

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
                <ReviewRow label="Cursos" value={form.cursos?.length > 0 ? form.cursos.join(", ") : null} />

                <ReviewRow
                    label="Cert. Docencia"
                    value={form.certificado_docencia === "EN CURSO"
                        ? `EN CURSO (${formatMonth(form.fecha_docencia)})`
                        : form.certificado_docencia
                    }
                />

                <ReviewRow
                    label="Cert. E-Learning"
                    value={form.certificado_teleformacion === "EN CURSO"
                        ? `EN CURSO (${formatMonth(form.fecha_teleformacion)})`
                        : form.certificado_teleformacion
                    }
                />

                <ReviewRow
                    label="Experiencia en Orbel"
                    value={form.trabajado_con_orbel === "SI" ? form.detalles_orbel : "NO"}
                />

                <ReviewRow label="Observaciones" value={form.observaciones} />

                {Object.keys(form).map(key => {
                    if (!standardKeys.includes(key) && form[key] && typeof form[key] !== 'object') {
                        return (
                            <ReviewRow
                                key={key}
                                label={key.replace(/_/g, ' ')}
                                value={form[key]}
                            />
                        );
                    }
                    return null;
                })}
            </div>

            <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: 10, padding: "14px 18px", fontSize: 12, color: "var(--text-muted)", marginBottom: 20, lineHeight: 1.5 }}>
                ℹ️ Revisa que los datos son correctos. Al confirmar, el perfil se añadirá directamente al directorio de profesorado de Academia Industrial.
            </div>

            <div className="form-nav">
                <button className="btn-secondary" onClick={handleBack}>← Editar datos</button>
                <button className="btn-primary" onClick={handleSubmit} disabled={submitting}>
                    {submitting ? "Enviando..." : "✅ Confirmar y guardar"}
                </button>
            </div>
        </div>
    );
};