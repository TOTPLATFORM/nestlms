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
import Select from "react-select";

export default function SelectType({
  form,
  formName,
  formLabel,
  formDescription,
  isErrorMessageShow,
  isMultipleSelect = false,
  selectOptions,
  classNamePrefix,
  isDisabled = false,
}: any) {
  const { t } = useTranslation();
  return (
    <FormField
      control={form.control}
      name={formName}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t(formLabel)}</FormLabel>

          <Select
            options={selectOptions}
            onChange={field.onChange}
            defaultValue={field.value}
            isMulti={isMultipleSelect}
            value={field.value}
            classNamePrefix={classNamePrefix}
            className="lms-react-select"
            isDisabled={isDisabled}
          />
          <FormDescription className="text-xs">
            {t(formDescription)}
          </FormDescription>
          {isErrorMessageShow && <FormMessage />}
        </FormItem>
      )}
    />
  );
}
