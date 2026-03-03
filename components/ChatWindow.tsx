"use client";

import { useState, useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";

/**
 * INTENTIONAL ACCESSIBILITY BUGS IN THIS FILE:
 * - Statusless Snorlax (4.1.3): no aria-live region for new messages
 * - Zoomy Zubat (1.4.10): overflow: hidden breaks content at 400% zoom
 * - Landmarkless Lapras (1.3.1): no <main> landmark
 */

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

function formatTime() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
}

export default function ChatWindow() {
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setChatMessages([
      {
        role: "assistant",
        content:
          "Welcome, trainer! I'm Professor A11y. Ask me anything about WCAG 2.2 AA accessibility requirements or GDS standards. Together, we'll catch all the accessibility bugs!",
        timestamp: formatTime(),
      },
    ]);
  }, []);

  const handleSend = async (message: string) => {
    const userMessage: Message = {
      role: "user",
      content: message,
      timestamp: formatTime(),
    };

    const updatedMessages = [...chatMessages, userMessage];
    setChatMessages(updatedMessages);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) throw new Error("Failed to fetch response");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      const assistantMessage: Message = {
        role: "assistant",
        content: "",
        timestamp: formatTime(),
      };

      setChatMessages([...updatedMessages, assistantMessage]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          assistantContent += decoder.decode(value, { stream: true });
          setChatMessages([
            ...updatedMessages,
            { ...assistantMessage, content: assistantContent },
          ]);
        }
      }

      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch {
      setChatMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
          timestamp: formatTime(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // BUG: Landmarkless Lapras - no <main> landmark, just a <div>
    // BUG: Zoomy Zubat - overflow: hidden breaks at 400% zoom
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 60px)",
        overflow: "auto",
      }}
    >
      {/* BUG: Statusless Snorlax - no aria-live region */}
      <div
        aria-live="polite"
        aria-label="Chat messages"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 0",
          backgroundColor: "#fffde7",
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(0,0,0,0.02) 35px, rgba(0,0,0,0.02) 70px)",
        }}
      >
        {chatMessages.map((msg, i) => (
          <MessageBubble
            key={i}
            role={msg.role}
            content={msg.content}
            timestamp={msg.timestamp}
          />
        ))}
        {isLoading && (
          <div
            style={{
              padding: "8px 12px",
              color: "#525252",
              fontSize: "14px",
              fontStyle: "italic",
            }}
          >
            Professor A11y is thinking...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput onSend={handleSend} disabled={isLoading} />
    </div>
  );
}
