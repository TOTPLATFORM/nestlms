"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { IRootState } from "@/store";
import SectionLoader from "@/components/SectionLoader";
import dynamic from "next/dynamic";
import { useEndLiveClassForInstructorFormHandler } from "@/hooks/user/user.settings.hook";
import { useRouter } from "next-nprogress-bar";
import { Button } from "@/components/ui/button";
const AgoraUIKit = dynamic(() => import("agora-react-uikit"), { ssr: false });
const App = () => {
  const router = useRouter();
  const { agora } =
    useSelector((state: IRootState) => state?.common?.data) || {};

  const { is_instructor } =
    useSelector((state: IRootState) => state?.userSlice?.user?.user_roles) ||
    {};

  const { endLiveClassHandler } = useEndLiveClassForInstructorFormHandler();

  const searchParams = useSearchParams();
  const class_name = searchParams.get("class_name");
  const user_token = searchParams.get("user_token");
  const [videoCall, setVideoCall] = useState(false);
  const [rtcProps, setrtcProps] = useState({
    appId: "",
    channel: "",
    token: "",
  });

  useEffect(() => {
    if (!user_token || !class_name || !agora?.agora_app_id) {
      return;
    }
    setrtcProps({
      appId: agora?.agora_app_id,
      channel: class_name.replace(/ /g, "+"),
      token: user_token.replace(/ /g, "+"),
    });
  }, [class_name, user_token, agora]);

  const callbacks = {
    EndCall: () => {
      setVideoCall(false);
      if (is_instructor) {
        endLiveClassHandler({
          className: rtcProps?.channel,
        });
        return;
      }
      router.back();
    },
  };
  if (!user_token || !class_name || !agora?.agora_app_id)
    return <SectionLoader />;

  return videoCall ? (
    <div style={{ display: "flex", width: "100vw", height: "100vh" }}>
      {agora?.agora_app_id && (
        <AgoraUIKit rtcProps={rtcProps} callbacks={callbacks} />
      )}
    </div>
  ) : (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="custom-shadow flex min-h-full min-w-[350px] flex-col items-center justify-center rounded-lg p-4 sm:min-h-[350px] md:p-8">
        <h3 className="mb-4 font-medium md:text-lg">
          Channel: {rtcProps?.channel}
        </h3>
        <Button
          onClick={() => {
            setVideoCall(true);
          }}
        >
          {is_instructor ? "Start Class" : "Join Class"}
        </Button>
      </div>
    </div>
  );
};

export default App;
