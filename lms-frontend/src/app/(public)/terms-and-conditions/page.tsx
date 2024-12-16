import { getTermsConditionData } from "@/service/common";
import React from "react";

const TermsConditionPage = async () => {
  const response = await getTermsConditionData();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100">
      <div className="container my-28 min-h-full  rounded bg-white p-10 shadow-md">
        <h1 className="mb-8 text-center text-4xl font-bold text-gray-800">
          Terms and Conditions
        </h1>

        <div className="prose max-w-none text-gray-700">
          {response?.data?.terms_condition !== null ? (
            response?.data?.terms_condition
          ) : (
            <>
              <p>
                Welcome to our Online Learning Platform! We are delighted to
                have you as part of our educational community. These Terms and
                Conditions are designed to provide you with guidelines for using
                our services. By accessing and utilizing our platform, you are
                indicating your understanding and agreement to comply with the
                following terms.
              </p>

              <p>
                You acknowledge that you have read, understood, and accepted
                these terms and conditions. Your access to our services is
                contingent upon your agreement to be bound by these terms. If
                you do not agree with any part of these terms, kindly refrain
                from accessing our services.
              </p>

              <p>
                We strive to create a positive and respectful learning
                environment for all users. As a member of our community, you are
                expected to conduct yourself in a manner that promotes
                collaboration and inclusivity in the educational experience.
              </p>

              <h2 className="mt-4 text-xl font-semibold">1. User Accounts</h2>
              <p>
                Certain features of the platform may require you to create a
                user account. It is your responsibility to maintain the
                confidentiality of your account and password. Any activities
                that occur under your account are your sole responsibility.
              </p>

              <h2 className="mt-4 text-xl font-semibold">
                2. Intellectual Property
              </h2>
              <p>
                The content on our platform, including text, graphics, logos,
                images, and software, is the intellectual property of our
                platform and is protected by applicable laws. Without our
                express consent, you agree not to reproduce, distribute, modify,
                or create derivative works from any content.
              </p>

              <h2 className="mt-4 text-xl font-semibold">3. Privacy Policy</h2>
              <p>
                We prioritize the privacy of our users. Please take a moment to
                review our{" "}
                <a href="/privacy-policy" className="text-blue-500">
                  Privacy Policy
                </a>
                , which outlines how we collect, use, and safeguard your
                personal information.
              </p>

              <h2 className="mt-4 text-xl font-semibold">
                4. Termination of Access
              </h2>
              <p>
                We reserve the right to terminate or suspend your access to our
                services at any time and for any reason. Likewise, you have the
                option to discontinue using our services at any time.
              </p>

              <h2 className="mt-4 text-xl font-semibold">5. Disclaimer</h2>
              <p>
                Our platform provides educational content for informational
                purposes only. We do not guarantee the accuracy, completeness,
                or suitability of the information provided. Users are encouraged
                to use the information at their own risk.
              </p>

              <h2 className="mt-4 text-xl font-semibold">6. Revisions</h2>
              <p>
                We may make revisions to these terms and conditions without
                prior notice. Your continued use of our platform after such
                modifications indicates your acceptance of the revised terms.
              </p>

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                  Last updated: January 1, 2024
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TermsConditionPage;
