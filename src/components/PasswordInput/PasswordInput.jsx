import React, { useState } from "react";
import styles from "./PasswordInput.module.css";

const PasswordInput = ({
  id,
  name,
  value = "",
  onChange,
  placeholder = "Enter password",
  required = false,
  autoComplete = "current-password",
  className = "",
  disabled = false,
  showStrength = false,
  label,
  error,
  minLength = 6,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleVisibility = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPassword((prev) => !prev);
  };

  const getStrength = (pass) => {
    if (!pass) return { label: "", score: 0, color: "#cbd5e1" };
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 2) return { label: "Weak password (min 6 chars)", score: 33, color: "#ef4444" };
    if (score <= 4) return { label: "Good password", score: 66, color: "#f59e0b" };
    return { label: "Strong password", score: 100, color: "#10b981" };
  };

  const strength = showStrength ? getStrength(value) : null;

  return (
    <div className={styles.container}>
      {label && (
        <label htmlFor={id || name} className={styles.label}>
          {label} {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <div className={styles.inputWrapper}>
        <input
          type={showPassword ? "text" : "password"}
          id={id || name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          disabled={disabled}
          minLength={minLength}
          className={`${styles.input} ${error ? styles.inputError : ""} ${className}`}
        />
        <button
          type="button"
          onClick={toggleVisibility}
          className={styles.toggleBtn}
          aria-label={showPassword ? "Hide password" : "Show password"}
          title={showPassword ? "Hide password" : "Show password"}
          tabIndex={-1}
        >
          {showPassword ? "🙈" : "👁️"}
        </button>
      </div>

      {showStrength && value && (
        <div className={styles.strengthMeter}>
          <div className={styles.barTrack}>
            <div
              className={styles.barFill}
              style={{ width: `${strength.score}%`, backgroundColor: strength.color }}
            ></div>
          </div>
          <span className={styles.strengthText} style={{ color: strength.color }}>
            {strength.label}
          </span>
        </div>
      )}

      {error && <div className={styles.errorMessage}>⚠️ {error}</div>}
    </div>
  );
};

export default PasswordInput;
