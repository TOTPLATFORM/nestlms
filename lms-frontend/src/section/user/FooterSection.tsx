"use client";
import { Facebook, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { FaTwitter } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa6";
import { FaPinterest } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa";
import { IRootState } from "@/store";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { addSubscribeApi } from "@/service/common";
import { errorToast, processResponse } from "@/lib/helper";

export default function FooterSection() {
  const { settings } =
    useSelector((state: IRootState) => state?.common?.data) || {};
  const { t } = useTranslation();
  const [email, setEmail] = useState<any>("");
  const [loading, setLoading] = useState<any>(false);
  const handleSubscribe = async () => {
    if (!email) {
      errorToast("Email is required");
      return;
    }
    setLoading(true);
    try {
      const response = await addSubscribeApi({ email: email });
      processResponse(response);
      setLoading(false);
      if (response.success) {
        setEmail("");
      }
    } catch (error: any) {
      processResponse(error?.response?.data);
      setLoading(false);
    }
  };
  return (
    <section className="relative bg-green-900 pt-28">
      <div className="container text-[#E6E8E9]">
        <div className="grid grid-cols-1 gap-8 pb-28 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          <div>
            <div className="pb-[30px]">
              <Link href="#">
                <span className="sr-only">Your Company</span>
                <img
                  className="h-[57px] w-auto"
                  src={settings?.site_footer_logo || "/images/logo-white.png"}
                  alt=""
                />
              </Link>
            </div>
            <div className="pb-[30px]">
              <p className="text-sm">
                {t(`Learning Management System (LMS) is a software application or
                web-based platform designed to facilitate the administration,
                delivery, tracking, and management of educational courses or
                training programs`)}
              </p>
            </div>
            <div className="flex gap-4 ">
              <a
                href="/"
                target="_blank"
                className="hover:bg-primary flex h-[45px] w-[45px] items-center justify-center rounded-full"
              >
                <FaFacebookF size={20} />
              </a>
              <a
                href="/"
                target="_blank"
                className="hover:bg-primary flex h-[45px] w-[45px] items-center justify-center rounded-full"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="/"
                target="_blank"
                className="hover:bg-primary flex h-[45px] w-[45px] items-center justify-center rounded-full"
              >
                <FaLinkedinIn size={20} />
              </a>
              <a
                href="/"
                target="_blank"
                className="hover:bg-primary flex h-[45px] w-[45px] items-center justify-center rounded-full"
              >
                <FaPinterest size={20} />
              </a>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <h2 className="after:bg-primary relative mb-[30px] text-lg font-bold after:absolute after:-bottom-[3px] after:left-0 after:h-[2px] after:w-[34px]">
                {t(`Useful Links`)}
              </h2>
              <div className="flex flex-col gap-2">
                <Link href="/" className="hover:text-primary w-fit">
                  {t(`Home`)}
                </Link>
                <Link href="/tutors" className="hover:text-primary w-fit">
                  {t(`Instructors`)}
                </Link>
                <Link href="/courses" className="hover:text-primary w-fit">
                  {t(`Courses`)}
                </Link>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <h2 className="after:bg-primary relative mb-[30px] text-lg font-bold after:absolute after:-bottom-[3px] after:left-0 after:h-[2px] after:w-[34px]">
                {t(`Useful Links`)}
              </h2>
              <div className="flex flex-col gap-2">
                <Link href="/blogs" className="hover:text-primary w-fit">
                  {t(`Blogs`)}
                </Link>
                <Link
                  href="/privacy-policy"
                  className="hover:text-primary w-fit"
                >
                  {t(`Privacy Policy`)}
                </Link>
                <Link
                  href="/terms-and-conditions"
                  className="hover:text-primary w-fit"
                >
                  {t(`Terms & Conditions`)}
                </Link>
              </div>
            </div>
          </div>
          <div>
            <h2 className="after:bg-primary relative mb-[30px] text-lg font-bold after:absolute after:-bottom-[3px] after:left-0 after:h-[2px] after:w-[34px]">
              {t(`Subscribe`)}
            </h2>
            <div className="flex flex-col gap-y-2">
              <input
                type="email"
                className="h-[45px] rounded-[6px] p-[15px] text-[#80979D] focus:outline-0 "
                placeholder="Enter email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                className="bg-primary flex h-[45px] items-center justify-center rounded-[6px] px-[25px] py-[15px] font-bold text-white"
                onClick={handleSubscribe}
              >
                {loading ? t(`Loading...`) : t(`Subscribe`)}
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white py-[15px]">
          <div className="grid grid-cols-1 justify-center">
            <div>
              <p className=" text-center text-white">
                ©{settings?.site_copy_right_text}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
