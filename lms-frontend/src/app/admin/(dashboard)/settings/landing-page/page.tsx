"use client";
import BackButton from "@/components/back-button/BackButton";

import { BRAINTREE_MODE } from "@/constant/core";
import AboutUsSectionSettings from "@/section/settings/landing-page/AboutUsSectionSettings";
import BannerSection from "@/section/settings/landing-page/BannerSection";
import ChooseUsSectionSettings from "@/section/settings/landing-page/ChooseUsSectionSettings";
import HowItWorkSectionSettings from "@/section/settings/landing-page/HowItWorkSectionSettings";

import BraintreeSettings from "@/section/settings/payments/BraintreeSettings";
import PaystackSettings from "@/section/settings/payments/PaystackSettings";
import RazorPaySettings from "@/section/settings/payments/RazorPaySettings";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
const brainTree = [
  { value: BRAINTREE_MODE.LIVE, label: "Live" },
  { value: BRAINTREE_MODE.SANDBOX, label: "Sandbox" },
];
export default function LandingPage() {
  const { t } = useTranslation();

  return (
    <div className="panel flex h-full flex-1 flex-col space-y-8 rounded-md border-2 p-4  md:p-8">
      <div className="flex items-center justify-between space-y-2 border-b pb-6">
        <div>
          <BackButton title="Back To Dashboard" slug={`/admin`} />
          <h2 className="text-2xl font-bold tracking-tight">
            {t(`Landing Page Settings`)}
          </h2>
        </div>
      </div>

      <div>
        <BannerSection />

        <div className="mt-8">
          <AboutUsSectionSettings />
        </div>
        <div className="mt-8">
          <ChooseUsSectionSettings />
        </div>

        <div className="mt-8">
          <HowItWorkSectionSettings />
        </div>
      </div>
    </div>
  );
}
