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

export function FileType({
  form,
  formName,
  formLabel,
  formPlaceholder,
  formDescription,
  isErrorMessageShow,
  disabled = false,
  className = "",
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
            <Input
              placeholder={formPlaceholder}
              {...field}
              type={"file"}
              disabled={disabled}
              className={className}
            />
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
