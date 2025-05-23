"use client";
import * as React from "react";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";

import "react-toastify/dist/ReactToastify.css";
import "@/styles/globals.css";
import "@/styles/colors.css";
import "react-perfect-scrollbar/dist/css/styles.css";

import ProgressBarComp from "@/components/progress-bar/ProgressBarComp";
import store from "@/store/index";
import { LanguageProvider } from "@/contexts/LanguageContext";
import GlobalLayout from "@/components/layout/global.layout";
import { commonSettingsApi } from "@/service/common";
import RootLoader from "@/components/RootLoader";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = React.useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5 * 1000,
          },
          mutations: {
            retry: 1,
          },
        },
      }),
    []
  );

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
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
        />
        <title>{data?.meta_title || "أكاديمية المياه "}</title>
        <meta
          name="description"
          content={data?.meta_description || "TOT Platform"}
        />
        <meta
          name="keywords"
          content={data?.meta_description || "TOT Platform"}
        />
        <meta name="author" content={data?.meta_keywords || "TOT Platform"} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="font-primary">
        <main>
          <Provider store={store}>
            <QueryClientProvider client={queryClient}>
              <LanguageProvider>
                <GlobalLayout>{children}</GlobalLayout>
                <ProgressBarComp />
                <ToastContainer />
              </LanguageProvider>
            </QueryClientProvider>
          </Provider>
        </main>
      </body>
    </html>
  );
}
