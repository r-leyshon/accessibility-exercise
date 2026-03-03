"use client";

import { useState } from "react";

/**
 * Remaining bugs: Labelless Lickitung (axe), Errorless Eevee, Tiny Target Tyrogue
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
      setHasError(true);
      return;
    }
    setHasError(false); // cleared on valid submit
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
      <div style={{ flex: 1, position: "relative" }}>
        <input
          type="text"
          value={message}
          aria-label="Type your accessibility question"
          aria-describedby={hasError ? "chat-error" : undefined}
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
          border: hasError ? "2px solid #dc2626" : "1px solid #ccc",
          borderRadius: "4px",
          fontSize: "14px",
          fontFamily: "'Comic Sans MS', cursive",
            outline: "2px solid transparent",
          }}
        />
        {hasError && (
          <span
            id="chat-error"
            role="alert"
            style={{
              position: "absolute",
              bottom: "-18px",
              left: 0,
              fontSize: "12px",
              color: "#dc2626",
            }}
          >
            Please enter a message
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={disabled ? undefined : handleSubmit}
        disabled={disabled}
        aria-label="Send message"
        style={{
          backgroundColor: "#ff1493",
          color: "white",
          padding: "8px 16px",
          border: "none",
          borderRadius: "4px",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1,
          fontSize: "18px",
          lineHeight: 1,
          userSelect: "none",
        }}
      >
        Send
      </button>
    </div>
  );
}
