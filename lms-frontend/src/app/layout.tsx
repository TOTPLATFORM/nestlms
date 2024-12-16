"use client";
import { Metadata } from "next";
import * as React from "react";

import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/router";
import "@/styles/colors.css";
import "react-perfect-scrollbar/dist/css/styles.css";

import ProgressBarComp from "@/components/progress-bar/ProgressBarComp";
import { Provider } from "react-redux";
import store from "../store/index";
import GlobalLayout from "@/components/layout/global.layout";
import { commonSettingsApi } from "@/service/common";
import RootLoader from "@/components/RootLoader";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  const [data, setData] = React.useState<any>({});

  React.useEffect(() => {
    getMetaData();
  }, []);

  const getMetaData = async () => {
    const response = await commonSettingsApi();
    if (response.success) {
      setData(response?.data?.settings);
    }
  };

  return (
    <html>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
        />
        <title>{data?.meta_title || "TutorLab"}</title>
        <meta
          name="description"
          content={data?.meta_description || "TutorLab"}
        />
        <meta name="keywords" content={data?.meta_description || "TutorLab"} />
        <meta name="author" content={data?.meta_keywords || "TutorLab"} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="font-primary">
        <main>
          <Provider store={store}>
            <QueryClientProvider client={queryClient}>
              <GlobalLayout>{children}</GlobalLayout>
              <ProgressBarComp />
              <ToastContainer />
            </QueryClientProvider>
          </Provider>
        </main>
      </body>
    </html>
  );
}
