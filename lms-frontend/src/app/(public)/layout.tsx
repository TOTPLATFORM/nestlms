"use client";
import RootLoader from "@/components/RootLoader";
import CartSection from "@/section/cart/CartSection";
import FooterSection from "@/section/user/FooterSection";
import NavbarUi from "@/section/user/NavbarUi";
import { IRootState } from "@/store";
import React, { useState } from "react";
import { useSelector } from "react-redux";

export default function Layout({ children }: any) {
  const [openCart, setOpenCart] = useState<any>(false);

  const { loading } = useSelector((state: IRootState) => state.userSlice);

  if (loading) return <RootLoader />;

  return (
    <div>
      <NavbarUi setOpenCart={setOpenCart} />
      <CartSection setOpen={setOpenCart} open={openCart} />
      <div>{children}</div>
      <FooterSection />
    </div>
  );
}
