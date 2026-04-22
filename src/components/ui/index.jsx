import React from 'react';

export const StepIndicator = ({ currentStep, totalSteps, stepLabels }) => {
    const progress = (currentStep / (totalSteps - 1)) * 100;
    return (
        <div style={{ position: "relative", marginBottom: "40px" }}>
            <div style={{ position: "absolute", top: "16px", left: "16%", right: "16%", height: "3px", background: "var(--border-color)", zIndex: 0 }}>
                <div style={{ width: `${progress}%`, height: "100%", background: "var(--primary-color)", transition: "width 0.4s ease-in-out" }} />
            </div>
            <div className="step-indicator" style={{ display: "flex", position: "relative", zIndex: 1 }}>
                {stepLabels.map((label, i) => (
                    <div key={i} className="step-item" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div className={`step-circle ${i < currentStep ? "done" : i === currentStep ? "active" : ""}`}>
                            {i < currentStep ? "✓" : i + 1}
                        </div>
                        <span className={`step-label ${i === currentStep ? "active" : ""}`} style={{ textAlign: "center", marginTop: "8px", maxWidth: "120px" }}>
                            {label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const CheckboxPill = ({ label, checked, onChange }) => (
    <label className={`checkbox-pill ${checked ? "selected" : ""}`}>
        <input type="checkbox" checked={checked} onChange={onChange} />
        {checked ? "✓ " : ""}{label}
    </label>
);

export const RadioCard = ({ label, value, selected, onChange, emoji }) => (
    <label className={`radio-card ${selected ? "selected" : ""}`}>
        <input type="radio" value={value} checked={selected} onChange={() => onChange(value)} />
        {emoji && <span>{emoji}</span>}
        {label}
    </label>
);

export const ReviewRow = ({ label, value }) => (
    <div className="review-row">
        <span className="review-key">{label}</span>
        <span className={`review-val ${!value ? "empty" : ""}`}>{value || "No indicado"}</span>
    </div>
);

export const ThemeToggle = ({ theme, setTheme }) => (
    <button className="theme-toggle" onClick={() => setTheme(t => t === "light" ? "dark" : "light")} title="Cambiar tema">
        {theme === "light" ? "☀️" : "🌙"}
    </button>
);

export const Header = () => (
    <div style={{ marginBottom: 40, textAlign: "center" }}>
        <h1 className="title-font" style={{ fontSize: 34, fontWeight: 700, marginBottom: 4, letterSpacing: "-0.5px" }}>Academia Industrial by Orbel</h1>
        <p className="title-font" style={{ fontSize: 11, color: "var(--text-secondary)", letterSpacing: "4px", fontWeight: 600, textTransform: "uppercase", opacity: 0.8 }}>Alta de profesorado</p>
    </div>
);

export const Footer = ({ theme }) => (
    <footer className="footer">
        <img src={theme === "light" ? "/logo-academia.jpeg" : "/logo-academia-dark.png"} alt="Academia Industrial by Orbel" />
    </footer>
);