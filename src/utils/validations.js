export const validateStep = (step, form) => {
    const errors = {};

    if (step === 0) {
        if (!form.nombre.trim()) errors.nombre = "El nombre es obligatorio.";
        if (!form.sexo) errors.sexo = "Selecciona el sexo.";
        if (!form.localidad.trim()) errors.localidad = "La localidad es obligatoria.";
    }

    if (step === 1) {
        if (!form.titulacion.trim()) errors.titulacion = "La titulación es obligatoria.";

        if (!form.precio.trim()) {
            errors.precio = "El precio es obligatorio.";
        } else {
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