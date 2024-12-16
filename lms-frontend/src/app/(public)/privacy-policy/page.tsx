import { getPrivacyPolicyData } from "@/service/common";
import Link from "next/link";
import React from "react";

const PrivacyPolicyPage = async () => {
  const response = await getPrivacyPolicyData();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 ">
      <div className="container min-h-full rounded bg-white p-10 shadow-md ">
        <h1 className="mb-8 text-center text-4xl font-bold text-gray-800">
          Privacy Policy
        </h1>

        <div className="prose max-w-none text-gray-700">
          {response?.privacy_policy !== null ? (
            response?.privacy_policy
          ) : (
            <>
              <p>
                Welcome to your dedicated online learning hub. This Privacy
                Policy clarifies how we handle your personal information. By
                using our platform, you agree to the terms outlined here.
              </p>

              <p>
                We collect details like your name and email when you sign up or
                use our services. This information helps us tailor and improve
                your learning experience. Rest assured, we prioritize the
                security of your data, implementing measures to safeguard it.
              </p>

              <p>
                Sometimes, we use third-party services for analytics and
                payments. Each service has its own privacy policies that we
                recommend you review. You have the right to update your account
                info and request account deletion.
              </p>
            </>
          )}

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="col-span-2 md:col-span-1">
              <h2 className="mt-6 text-2xl font-semibold">Data Security 🛡️</h2>
              <p>
                We take the security of your data seriously. Our platform
                employs industry-standard measures to protect your information
                from unauthorized access, disclosure, alteration, and
                destruction.
              </p>
            </div>

            <div className="col-span-2 md:col-span-1">
              <h2 className="mt-6 text-2xl font-semibold">Cookies 🍪</h2>
              <p>
                We use cookies to enhance your browsing experience. Cookies are
                small pieces of data stored on your device that help us improve
                our services. You can control and manage cookie preferences
                through your browser settings.
              </p>
            </div>

            <div className="col-span-2 md:col-span-1">
              <h2 className="mt-6 text-2xl font-semibold">
                Third-Party Links 🔗
              </h2>
              <p>
                Our platform may contain links to third-party websites or
                services. We are not responsible for the privacy practices or
                content of these external sites. Please review the privacy
                policies of those sites.
              </p>
            </div>

            <div className="col-span-2 md:col-span-1">
              <h2 className="mt-6 text-2xl font-semibold">
                Updates to Privacy Policy 🔄
              </h2>
              <p>
                We may update our Privacy Policy from time to time. Any changes
                will be communicated to you through email or a notice on our
                platform. Please review our Privacy Policy periodically for the
                latest information.
              </p>

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                  Last updated: January 1, 2024
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
