// src/components/steps/Step1Personal.jsx
import React from 'react';
import { RadioCard } from '../ui';

export const Step1Personal = ({ form, errors, handleChange, handleRadio, localidades, loadingOpts, isOtraLocalidad, setIsOtraLocalidad, setForm, setErrors, handleNext }) => {
    return (
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
                        name="localidadSelector" value={isOtraLocalidad ? "__otra__" : form.localidad}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val === "__otra__") {
                                setIsOtraLocalidad(true); setForm(prev => ({ ...prev, localidad: "" }));
                            } else {
                                setIsOtraLocalidad(false); setForm(prev => ({ ...prev, localidad: val }));
                            }
                            if (errors.localidad) setErrors(prev => ({ ...prev, localidad: undefined }));
                        }}
                        className={`input ${errors.localidad ? "error" : ""}`} disabled={loadingOpts}
                    >
                        <option value="">{loadingOpts ? "Cargando..." : "Selecciona una localidad…"}</option>
                        {localidades.map(l => <option key={l} value={l}>{l}</option>)}
                        <option value="__otra__">Otra (escribir manualmente)</option>
                    </select>

                    {isOtraLocalidad && (
                        <input type="text" name="localidad" value={form.localidad} autoComplete="off" onChange={handleChange} className={`input ${errors.localidad ? "error" : ""}`} style={{ marginTop: 8 }} placeholder="Escribe la localidad…" />
                    )}
                    {errors.localidad && <span className="field-error">{errors.localidad}</span>}
                </div>
            </div>
            <div className="form-nav">
                <button className="btn-primary" onClick={handleNext}>Siguiente →</button>
            </div>
        </div>
    );
};