"use client";

import { Button, Modal } from "flowbite-react";
import { useState } from "react";

export default function CustomModal({
  children,
  header,
  modalSize = "2xl",
  isModalOpen = false,
  close,
  modalPlacement = "center",
}: any) {
  return (
    <>
      <Modal
        show={isModalOpen}
        size={modalSize}
        onClose={close}
        position={modalPlacement}
      >
        <Modal.Header>{header}</Modal.Header>
        <Modal.Body>{children}</Modal.Body>
      </Modal>
    </>
  );
}
