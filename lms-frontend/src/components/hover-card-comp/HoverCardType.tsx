"use client";
import React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
export default function HoverCardType({
  isHoverOpen = false,
  setIsHoverOpen,
  children,
  hoverTitle,
}: any) {
  return (
    <HoverCard open={isHoverOpen} onOpenChange={() => setIsHoverOpen(false)}>
      <HoverCardTrigger />
      <HoverCardContent className="m-3">{children}</HoverCardContent>
    </HoverCard>
  );
}
