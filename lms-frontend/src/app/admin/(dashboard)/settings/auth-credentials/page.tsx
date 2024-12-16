"use client";
import BackButton from "@/components/back-button/BackButton";
import GithubSettings from "@/section/settings/auth/GithubSettings";
import GoogleSettings from "@/section/settings/auth/GoogleSettings";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function AuthCredentials() {
  const { t } = useTranslation();

  return (
    <div className="panel flex h-full flex-1 flex-col space-y-8 rounded-md border-2 p-4  md:p-8">
      <div className="flex items-center justify-between space-y-2 border-b pb-6">
        <div>
          <BackButton title="Back To Dashboard" slug={`/admin`} />
          <h2 className="text-2xl font-bold tracking-tight">
            {t(`Auth Credentials Settings`)}
          </h2>
        </div>
      </div>

      <div>
        <GithubSettings />

        <div className="mt-8">
          <GoogleSettings />
        </div>
      </div>
    </div>
  );
}
