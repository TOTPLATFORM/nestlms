"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";

export function InputType({
  form,
  formName,
  formLabel,
  formPlaceholder,
  formDescription,
  isErrorMessageShow,
  type = "text",
  minNumber = 0,
  maxNumber = 1000000000,
  disabled = false,
}: any) {
  const { t } = useTranslation();
  return (
    <FormField
      control={form.control}
      name={formName}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>{t(formLabel)}</FormLabel>
          <FormControl>
            {type === "number" ? (
              <Input
                placeholder={formPlaceholder}
                {...field}
                type={type}
                min={minNumber}
                max={maxNumber}
                disabled={disabled}
              />
            ) : (
              <Input
                placeholder={formPlaceholder}
                {...field}
                type={type}
                disabled={disabled}
              />
            )}
          </FormControl>
          <FormDescription className="text-xs">
            {t(formDescription)}
          </FormDescription>
          {isErrorMessageShow && <FormMessage />}
        </FormItem>
      )}
    />
  );
}
