import { useProfile } from "@/hooks/auth.hook";
import { useCommonSettings } from "@/hooks/common.hook";
import { useMyCartDetails } from "@/hooks/user/enrollment.hook";
import { IRootState } from "@/store";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Head from "next/head";
import CookieBanner from "../cookies";
import Header from "./header";
import { useLanguage } from "@/contexts/LanguageContext";

const GlobalLayout = ({ children }: { children: React.ReactNode }) => {
  useProfile();
  const { data, isLoading } = useCommonSettings();
  const { settings } = useSelector((state: IRootState) => state.common.data);
  const { currentLanguage } = useLanguage();

  useMyCartDetails();

  useEffect(() => {
    if (currentLanguage) {
      document.documentElement.dir = currentLanguage.direction;
      document.documentElement.lang = currentLanguage.code;
      document.body.classList.toggle('rtl', currentLanguage.direction === 'rtl');
    }
  }, [currentLanguage]);

  return (
    <div>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
        />
        <title>{settings?.meta_title}</title>
        <meta name="description" content={settings?.meta_description} />
        <meta name="keywords" content={settings?.meta_keywords} />
        <meta name="author" content={settings?.site_author} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href={settings?.site_fav_icon} />
      </Head>
      <CookieBanner />
      <GoogleOAuthProvider clientId={settings?.google_auth_client_id}>
        <Header />
        <div className="flex min-h-screen flex-col">
          <div className="flex-1">{children}</div>
        </div>
      </GoogleOAuthProvider>
    </div>
  );
};

export default GlobalLayout;
