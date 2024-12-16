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
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";

export default function TextAreaType({
  form,
  formName,
  formLabel,
  formPlaceholder,
  formDescription,
  isErrorMessageShow,
}: any) {
  const { t } = useTranslation();
  return (
    <FormField
      control={form.control}
      name={formName}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t(formLabel)}</FormLabel>
          <FormControl>
            <Textarea placeholder={formPlaceholder} {...field} />
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
