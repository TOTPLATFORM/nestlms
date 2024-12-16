"use client";
import CartSection from "@/section/cart/CartSection";
import FooterSection from "@/section/user/FooterSection";
import NavbarUi from "@/section/user/NavbarUi";
import React, { useState } from "react";

export default function Layout({ children }: any) {
  const [openCart, setOpenCart] = useState<any>(false);
  return (
    <div>
      <NavbarUi setOpenCart={setOpenCart} />
      <CartSection setOpen={setOpenCart} open={openCart} />
      <div>{children}</div>
      <FooterSection />
    </div>
  );
}
