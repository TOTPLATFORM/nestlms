"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

export default function DialogModal({
  trigerComponent,
  children,
  dialogTitle,
  dialogDescription,
  dialogFooterComponent,
  closeComponent,
  isModalOpen,
  setIsModalOpen,
}: any) {
  return (
    <Dialog open={isModalOpen} onOpenChange={() => setIsModalOpen(false)}>
      <DialogOverlay className="opacity-10" />
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <div>{children}</div>
        <DialogFooter className="sm:justify-start">
          {dialogFooterComponent}
          <DialogClose asChild>{closeComponent}</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
