"use client";


interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export default function MessageBubble({
  role,
  content,
  timestamp,
}: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: isUser ? "4px" : "48px",
        marginLeft: isUser ? "80px" : "0",
        marginRight: isUser ? "0" : "80px",
        padding: "0 12px",
      }}
    >
      <div
        style={{
          backgroundColor: isUser ? "#ff69b4" : "#20b2aa",
          color: isUser ? "#ffb6c1" : "#999",
          // BUG: Contrast Cubone - #ffb6c1 on #ff69b4 ≈ 1.6:1 for user,
          //                        #999 on #20b2aa ≈ 1.9:1 for assistant
          padding: "10px 14px",
          borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
          maxWidth: "85%",
          fontSize: "14px",
          lineHeight: "1.4",
          wordBreak: "break-word",
        }}
      >
        <div style={{ whiteSpace: "pre-wrap" }}>{content}</div>
        {timestamp && (
          // BUG: Tiny Tentacool - text at 10px is too small
          <div
            style={{
              fontSize: "10px",
              color: "#ccc",
              marginTop: "4px",
              textAlign: "right",
            }}
          >
            {timestamp}
          </div>
        )}
      </div>
    </div>
  );
}
