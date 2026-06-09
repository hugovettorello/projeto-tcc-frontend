"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { parseAsBoolean, parseAsString, useQueryState } from "nuqs";
import { Send, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Streamdown } from "streamdown";
import { cn } from "@/lib/utils";

export function Chatbot() {
  const [isOpen, setIsOpen] = useQueryState(
    "chat_open",
    parseAsBoolean.withDefault(false),
  );
  const [initialMessage, setInitialMessage] = useQueryState(
    "chat_initial_message",
    parseAsString.withDefault(""),
  );
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasSentInitialRef = useRef(false);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: `${process.env.NEXT_PUBLIC_API_URL}/ai`,
      credentials: "include",
    }),
  });

  useEffect(() => {
    if (
      isOpen &&
      initialMessage &&
      messages.length === 0 &&
      !hasSentInitialRef.current
    ) {
      hasSentInitialRef.current = true;
      sendMessage({ text: initialMessage });
      setInitialMessage(null);
    }
  }, [isOpen, initialMessage, messages.length, sendMessage, setInitialMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || status === "streaming") return;
    sendMessage({ text });
    setInput("");
  };

  const handleSuggestedMessage = (text: string) => {
    sendMessage({ text });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-foreground/20" />
      <div className="relative bg-background border border-foreground rounded-tl-[40px] rounded-tr-[40px] flex flex-col h-[90vh] overflow-hidden">
        <div className="flex items-center gap-3 px-5 pt-5 pb-4">
          <div className="bg-home-hero rounded-full p-3 shrink-0">
            <Sparkles className="size-6 text-background" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-foreground text-base leading-tight">
              Mestre do planejamento
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="size-2.5 rounded-full bg-online shrink-0" />
              <span className="text-xs text-foreground/70">Online</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 text-foreground hover:bg-muted"
            onClick={() => setIsOpen(null)}
          >
            <X className="size-6" />
          </Button>
        </div>

        <div className="h-px bg-border" />

        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-start justify-end pb-4 gap-2">
              <Button
                variant="outline"
                className="rounded-full px-5 py-2.5 h-auto text-sm font-normal"
                onClick={() =>
                  handleSuggestedMessage("Monte um planejamento semanal")
                }
              >
                Monte um planejamento semanal
              </Button>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "rounded-[20px] p-4 max-w-[78%] text-sm leading-relaxed",
                  message.role === "user"
                    ? "self-end bg-home-accent text-background"
                    : "self-start bg-muted text-foreground",
                )}
              >
                {message.role === "assistant" ? (
                  message.parts.map((part, i) =>
                    part.type === "text" ? (
                      <Streamdown
                        key={i}
                        animated
                        isAnimating={status === "streaming"}
                      >
                        {part.text}
                      </Streamdown>
                    ) : null,
                  )
                ) : (
                  <p>
                    {message.parts.find((p) => p.type === "text")?.text ?? ""}
                  </p>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="h-px bg-border" />

        <div className="p-4 flex items-center gap-3">
          <input
            className="flex-1 bg-muted rounded-full px-5 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none"
            placeholder="Digite sua mensagem"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
          />
          <Button
            size="icon"
            className="bg-home-hero hover:bg-home-hero/90 rounded-full size-12 shrink-0"
            onClick={handleSend}
            disabled={status === "streaming"}
          >
            <Send className="size-5 text-background" />
          </Button>
        </div>
      </div>
    </div>
  );
}
