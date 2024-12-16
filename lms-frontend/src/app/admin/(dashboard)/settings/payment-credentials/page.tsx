"use client";
import BackButton from "@/components/back-button/BackButton";

import { BRAINTREE_MODE } from "@/constant/core";

import BraintreeSettings from "@/section/settings/payments/BraintreeSettings";
import PaystackSettings from "@/section/settings/payments/PaystackSettings";
import RazorPaySettings from "@/section/settings/payments/RazorPaySettings";
import StripeSettings from "@/section/settings/payments/StripeSettings";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
const brainTree = [
  { value: BRAINTREE_MODE.LIVE, label: "Live" },
  { value: BRAINTREE_MODE.SANDBOX, label: "Sandbox" },
];
export default function PaymentCredentials() {
  const { t } = useTranslation();

  return (
    <div className="panel flex h-full flex-1 flex-col space-y-8 rounded-md border-2 p-4  md:p-8">
      <div className="flex items-center justify-between space-y-2 border-b pb-6">
        <div>
          <BackButton title="Back To Dashboard" slug={`/admin`} />
          <h2 className="text-2xl font-bold tracking-tight">
            {t(`Payment Credentials Settings`)}
          </h2>
        </div>
      </div>

      <div>
        <StripeSettings />

        <div className="mt-8">
          <RazorPaySettings />
        </div>
        <div className="mt-8">
          <PaystackSettings />
        </div>

        <div className="mt-8">
          <BraintreeSettings />
        </div>
      </div>
    </div>
  );
}
