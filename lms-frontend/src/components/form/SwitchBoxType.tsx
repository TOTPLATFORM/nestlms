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
import { Switch } from "@/components/ui/switch";
export default function SwitchBoxType({
  form,
  formName,
  formLabel,
  formDescription,
  isErrorMessageShow,
}: any) {
  return (
    <FormField
      control={form.control}
      name={formName}
      render={({ field }) => (
        <FormItem>
          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">{formLabel}</FormLabel>
              <FormDescription className="text-xs">
                {formDescription}
              </FormDescription>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </div>
          {isErrorMessageShow && <FormMessage />}
        </FormItem>
      )}
    />
  );
}
