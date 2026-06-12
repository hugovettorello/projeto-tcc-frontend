"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Send, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Streamdown } from "streamdown";
import { cn } from "@/lib/utils";
import { checkOnboardingComplete } from "../_actions";

const messageSchema = z.object({
  message: z.string().min(1),
});

type OnboardingChatProps = {
  initialIsComplete: boolean;
};

export function OnboardingChat({ initialIsComplete }: OnboardingChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isComplete, setIsComplete] = useState(initialIsComplete);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: { message: "" },
  });

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: `${process.env.NEXT_PUBLIC_API_URL}/ai`,
      credentials: "include",
    }),
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isComplete || status !== "ready" || messages.length === 0) return;
    checkOnboardingComplete().then(setIsComplete);
  }, [status, isComplete, messages.length]);

  const handleSend = form.handleSubmit(({ message }) => {
    if (status === "streaming") return;
    sendMessage({ text: message });
    form.reset();
  });

  const handleSuggestedMessage = (text: string) => {
    sendMessage({ text });
  };

  return (
    <div className="flex flex-col h-screen bg-background">
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
        {isComplete ? (
          <Button asChild className="rounded-full shrink-0">
            <Link href="/">Acessar PlanejAI</Link>
          </Button>
        ) : (
          <Button className="rounded-full shrink-0" disabled>
            Acessar PlanejAI
          </Button>
        )}
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
    </div>
  );
}
