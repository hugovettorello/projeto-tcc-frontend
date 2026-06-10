"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useChat, type UIMessage } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { parseAsBoolean, parseAsString, useQueryState } from "nuqs";
import { Send, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Streamdown } from "streamdown";
import { cn } from "@/lib/utils";

const messageSchema = z.object({
  message: z.string().min(1),
});

function loadSession(sessionKey: string): UIMessage[] {
  try {
    const stored = localStorage.getItem(`chat_session_${sessionKey}`);
    return stored ? (JSON.parse(stored) as UIMessage[]) : [];
  } catch {
    return [];
  }
}

function saveSession(sessionKey: string, messages: UIMessage[]) {
  try {
    if (messages.length > 0) {
      localStorage.setItem(`chat_session_${sessionKey}`, JSON.stringify(messages));
    }
  } catch {}
}

interface ChatSessionProps {
  sessionKey: string;
  initialPrompt: string;
  onClose: () => void;
}

function ChatSession({ sessionKey, initialPrompt, onClose }: ChatSessionProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasSentInitialRef = useRef(false);

  const [storedMessages] = useState(() => loadSession(sessionKey));

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: { message: "" },
  });

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: `${process.env.NEXT_PUBLIC_API_URL}/ai`,
      credentials: "include",
    }),
    messages: storedMessages,
  });

  useEffect(() => {
    if (
      initialPrompt &&
      messages.length === 0 &&
      !hasSentInitialRef.current
    ) {
      hasSentInitialRef.current = true;
      sendMessage({ text: initialPrompt });
    }
  }, [initialPrompt, messages.length, sendMessage]);

  useEffect(() => {
    saveSession(sessionKey, messages);
  }, [messages, sessionKey]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = form.handleSubmit(({ message }) => {
    if (status === "streaming") return;
    sendMessage({ text: message });
    form.reset();
  });

  const handleSuggestedMessage = (text: string) => {
    sendMessage({ text });
  };

  return (
    <>
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
          onClick={onClose}
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

      <Form {...form}>
        <form onSubmit={handleSend} className="p-4 flex items-center gap-3">
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    {...field}
                    className="bg-muted rounded-full px-5 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none border-none shadow-none focus-visible:ring-0"
                    placeholder="Digite sua mensagem"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            size="icon"
            className="bg-home-hero hover:bg-home-hero/90 rounded-full size-12 shrink-0"
            disabled={status === "streaming"}
          >
            <Send className="size-5 text-background" />
          </Button>
        </form>
      </Form>
    </>
  );
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useQueryState(
    "chat_open",
    parseAsBoolean.withDefault(false),
  );
  const [taskId] = useQueryState("chat_task_id", parseAsString.withDefault(""));
  const [initialMessage, setInitialMessage] = useQueryState(
    "chat_initial_message",
    parseAsString.withDefault(""),
  );

  const handleClose = () => {
    setIsOpen(null);
    setInitialMessage(null);
  };

  if (!isOpen) return null;

  const sessionKey = taskId || "general";

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-foreground/20" />
      <div className="relative bg-background border border-foreground rounded-tl-[40px] rounded-tr-[40px] flex flex-col h-[90vh] overflow-hidden">
        <ChatSession
          key={sessionKey}
          sessionKey={sessionKey}
          initialPrompt={initialMessage}
          onClose={handleClose}
        />
      </div>
    </div>
  );
}
