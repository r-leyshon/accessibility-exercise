"use client";

import { useState } from "react";

interface A11ymonImageProps {
  src: string;
  alt: string;
  id: number;
  caught?: boolean;
}

export default function A11ymonImage({ src, alt, id, caught = false }: A11ymonImageProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        style={{
          width: 96,
          height: 96,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(0,0,0,0.06)",
          borderRadius: "8px",
          border: "2px dashed rgba(0,0,0,0.15)",
          color: "#4b5563",
          fontSize: "32px",
          fontWeight: "bold",
          fontFamily: "monospace",
        }}
        aria-hidden
      >
        #{String(id).padStart(2, "0")}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={caught ? alt : `${alt} (not yet caught)`}
      width={96}
      height={96}
      style={{
        objectFit: "contain",
        borderRadius: "8px",
        backgroundColor: "rgba(0,0,0,0.04)",
        transition: "filter 0.3s ease",
        ...(caught
          ? {}
          : {
              filter: "grayscale(1) brightness(0) contrast(0.4)",
              opacity: 0.9,
            }),
      }}
      onError={() => setError(true)}
    />
  );
}
