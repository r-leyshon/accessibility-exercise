"use client";

import { useState } from "react";

/**
 * INTENTIONAL ACCESSIBILITY BUGS IN THIS FILE:
 * - Labelless Lickitung (3.3.2): input has no <label> or aria-label
 * - Buttonless Bulbasaur (4.1.2): send button has no accessible name
 * - Divvy Ditto (4.1.2): submit uses <div onClick> instead of <button>
 * - Errorless Eevee (3.3.1): no error message on empty submit
 * - Colourblind Chansey (1.4.1): error indicated only by red colour
 * - Tabindex Teddiursa (2.4.3): positive tabindex values
 * - Tiny Target Tyrogue (2.5.8): clear button too small (for the error indicator)
 */

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [hasError, setHasError] = useState(false);

  const handleSubmit = () => {
    if (!message.trim()) {
      // BUG: Errorless Eevee - no visible error text
      // BUG: Colourblind Chansey - error only shown by red colour
      setHasError(true);
      return;
    }
    setHasError(false);
    onSend(message);
    setMessage("");
  };

  return (
    <div
      style={{
        padding: "12px 48px 12px 8px",
        display: "flex",
        gap: "8px",
        alignItems: "center",
        marginLeft: "30px",
      }}
    >
      {/* BUG: Labelless Lickitung - no <label> or aria-label */}
      {/* BUG: Tabindex Teddiursa - tabindex="3" disrupts tab order */}
      <input
        type="text"
        tabIndex={3}
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          if (hasError) setHasError(false);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSubmit();
        }}
        placeholder="Type your accessibility question..."
        disabled={disabled}
        style={{
          flex: 1,
          padding: "8px 12px",
          border: hasError ? "2px solid red" : "1px solid #ccc",
          borderRadius: "4px",
          fontSize: "14px",
          fontFamily: "'Comic Sans MS', cursive",
          outline: "none",
        }}
      />

      {/* BUG: Buttonless Bulbasaur - icon-only, no accessible name */}
      {/* BUG: Divvy Ditto - <div> with onClick instead of <button> */}
      <div
        onClick={disabled ? undefined : handleSubmit}
        tabIndex={5}
        style={{
          backgroundColor: "#ff1493",
          color: "white",
          padding: "8px 16px",
          borderRadius: "4px",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1,
          fontSize: "18px",
          lineHeight: 1,
          userSelect: "none",
        }}
      >
        ▶
      </div>
    </div>
  );
}
