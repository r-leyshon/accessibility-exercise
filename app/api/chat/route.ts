import { NextRequest } from "next/server";
import { getGeminiModel } from "@/lib/gemini";
import { SYSTEM_PROMPT } from "@/lib/system-prompt";
import type { Content } from "@google-cloud/vertexai";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const history: Content[] = messages.slice(0, -1).map(
      (msg: { role: string; content: string }) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      })
    );

    const lastMessage = messages[messages.length - 1];

    const chat = getGeminiModel().startChat({
      history,
      systemInstruction: { role: "system", parts: [{ text: SYSTEM_PROMPT }] },
    });

    const streamResult = await chat.sendMessageStream([
      { text: lastMessage.content },
    ]);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of streamResult.stream) {
            const text =
              chunk.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate response" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
