"use client";

import { cn } from "@/lib/utils";
import { Button } from "./button";

import React, { JSX } from "react";

type ActionButtonProps = {
  action: (id: string) => void;
  id: string;
  children: React.ReactNode;
  className?: string
};

export default function ActionButton({ action, id, children, className }: ActionButtonProps): JSX.Element {
  return <Button onClick={() => action(id)} className={cn('ml-auto', className)} variant='destructive'>{children}</Button>
}
