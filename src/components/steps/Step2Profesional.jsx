import React from 'react';
import { RadioCard, CheckboxPill } from '../ui';

export const Step2Profesional = ({ form, errors, handleChange, handleRadio, handleCursoToggle, setForm, cursosDisponibles, loadingOpts, handleNext, handleBack }) => {
    return (
        <div className="panel animate-in">
            <div className="panel-title">🎓 Perfil profesional</div>
            <div className="grid-2">
                <div className="grid-field full-width">
                    <label className="label required">Titulación</label>
                    <input type="text" name="titulacion" value={form.titulacion} onChange={handleChange} autoComplete="off" className={`input ${errors.titulacion ? "error" : ""}`} placeholder="Ej. Grado en Ingeniería Industrial…" />
                    {errors.titulacion && <span className="field-error">{errors.titulacion}</span>}
                </div>

                <div className="grid-field full-width">
                    <label className="label required">Rango de Precio (€/hora)</label>
                    <input type="text" name="precio" value={form.precio} onChange={handleChange} autoComplete="off" className={`input ${errors.precio ? "error" : ""}`} placeholder="Ej. 20-30" />
                    <span className="hint" style={{ color: errors.precio ? "var(--danger-text)" : "var(--text-muted)" }}>Obligatorio escribir un rango separado por guion (Ej. <em>20-30</em>).</span>
                    {errors.precio && <span className="field-error">{errors.precio}</span>}
                </div>

                <div className="grid-field full-width">
                    <label className="label required">Cursos que imparte</label>
                    {loadingOpts ? (
                        <p style={{ fontSize: 13, color: "var(--text-muted)", padding: "8px 0" }}>Cargando cursos disponibles…</p>
                    ) : cursosDisponibles.length > 0 ? (
                        <div className="checkbox-group">
                            {cursosDisponibles.map(curso => <CheckboxPill key={curso} label={curso} checked={form.cursos.includes(curso)} onChange={() => handleCursoToggle(curso)} />)}
                        </div>
                    ) : (
                        <input type="text" className="input" placeholder="Ej. Soldadura, Electricidad…" onChange={e => setForm(prev => ({ ...prev, cursos: e.target.value.split(",").map(c => c.trim()).filter(Boolean) }))} />
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
                                type="month"
                                name="fecha_docencia"
                                value={form.fecha_docencia}
                                onChange={handleChange}
                                className={`input ${errors.fecha_docencia ? "error" : ""}`}
                                style={{ cursor: 'pointer' }}
                            />
                            <span className="hint">Selecciona el mes y año previsto</span>
                            {errors.fecha_docencia && <span className="field-error">{errors.fecha_docencia}</span>}
                        </div>
                    )}
                </div>

                <div className="grid-field">
                    <label className="label required">Certificado E-Learning</label>
                    <div className="radio-group">
                        <RadioCard label="Sí" value="Sí" selected={form.certificado_teleformacion === "Sí"} onChange={v => handleRadio("certificado_teleformacion", v)} />
                        <RadioCard label="No" value="No" selected={form.certificado_teleformacion === "No"} onChange={v => handleRadio("certificado_teleformacion", v)} />
                        <RadioCard label="En curso" value="En curso" selected={form.certificado_teleformacion === "En curso"} onChange={v => handleRadio("certificado_teleformacion", v)} />
                    </div>
                    {form.certificado_teleformacion === "En curso" && (
                        <div style={{ marginTop: 8 }}>
                            <input
                                type="month"
                                name="fecha_teleformacion"
                                value={form.fecha_teleformacion}
                                onChange={handleChange}
                                className={`input ${errors.fecha_teleformacion ? "error" : ""}`}
                                style={{ cursor: 'pointer' }}
                            />
                            <span className="hint">Selecciona el mes y año previsto</span>
                            {errors.fecha_teleformacion && <span className="field-error">{errors.fecha_teleformacion}</span>}
                        </div>
                    )}
                </div>

                <div className="grid-field full-width">
                    <label className="label required">¿Ha trabajado o realizado alguna entrevista anteriormente con Orbel?</label>
                    <div className="radio-group">
                        <RadioCard label="Sí" value="Sí" emoji="✅" selected={form.trabajado_con_orbel === "Sí"} onChange={v => handleRadio("trabajado_con_orbel", v)} />
                        <RadioCard label="No" value="No" emoji="❌" selected={form.trabajado_con_orbel === "No"} onChange={v => handleRadio("trabajado_con_orbel", v)} />
                    </div>

                    {form.trabajado_con_orbel === "Sí" && (
                        <div style={{ marginTop: 8 }}>
                            <input
                                type="text"
                                name="detalles_orbel"
                                value={form.detalles_orbel}
                                onChange={handleChange}
                                className={`input ${errors.detalles_orbel ? "error" : ""}`}
                                placeholder="Especifique año/periodo y curso (Ej. 2024 SOLDADURA)"
                                autoFocus
                            />
                            {errors.detalles_orbel && <span className="field-error">{errors.detalles_orbel}</span>}
                        </div>
                    )}
                    {errors.trabajado_con_orbel && !errors.detalles_orbel && <span className="field-error">{errors.trabajado_con_orbel}</span>}
                </div>

                <div className="grid-field full-width">
                    <label className="label">Observaciones</label>
                    <textarea name="observaciones" value={form.observaciones} onChange={handleChange} rows={4} className="input" placeholder="Disponibilidad, especialidades concretas…" />
                </div>
            </div>
            <div className="form-nav">
                <button className="btn-secondary" onClick={handleBack}>← Atrás</button>
                <button className="btn-primary" onClick={handleNext}>Revisar datos →</button>
            </div>
        </div>
    );
};