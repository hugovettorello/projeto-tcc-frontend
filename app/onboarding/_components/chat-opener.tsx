"use client";

import { useEffect } from "react";
import { parseAsBoolean, useQueryState } from "nuqs";

export function ChatOpener() {
  const [, setIsOpen] = useQueryState("chat_open", parseAsBoolean.withDefault(false));

  useEffect(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  return null;
}
