"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useTranslation } from "react-i18next";

export default function CheckboxType({
  form,
  formName,
  formLabel,
  checkboxId,
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
          <div className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>{t(formLabel)}</FormLabel>
              <FormDescription className="text-xs">
                {t(formDescription)}
              </FormDescription>
            </div>
          </div>
          {isErrorMessageShow && <FormMessage />}
        </FormItem>
      )}
    />
  );
}
