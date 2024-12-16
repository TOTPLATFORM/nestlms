"use client";

import { Spinner } from "flowbite-react";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";

export default function LoaderButton({
  buttonText,
  isLoading,
  loaderText,
  classNames = "",
}: any) {
  const { t } = useTranslation();
  return (
    <Button
      color="gray"
      type="submit"
      disabled={isLoading}
      className={classNames}
    >
      {isLoading && <Spinner color={"primary"} size="sm" />}

      <span className={`${isLoading && "pl-3"}`}>
        {isLoading ? t(loaderText) : t(buttonText)}
      </span>
    </Button>
  );
}
