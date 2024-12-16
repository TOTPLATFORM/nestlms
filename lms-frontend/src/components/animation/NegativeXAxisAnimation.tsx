"use client";
import { motion } from "framer-motion";
import React from "react";

export default function NegativeXAxisAnimation({
  children,
  classes = "",
  isOneTime = false,
}: any) {
  return (
    <motion.div
      initial={{ x: "0px", visibility: "hidden" }}
      whileInView={{
        visibility: "visible",
        x: ["-50px", "0px"],
        transition: {
          type: "spring",
          bounce: 0.4,
          duration: 2,
        },
      }}
      viewport={{ once: isOneTime }}
      className={classes}
    >
      {children}
    </motion.div>
  );
}
