"use client";

import React, { useEffect, useMemo, useState } from "react";
import { format, addDays, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon, CheckIcon, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useTranslation } from "@/hooks/useTranslation";
import { Badge } from "./Badge";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "./Comand";
import { Command as CommandPrimitive } from "cmdk";

type DateRangeDropdownProps = {
  form: any;
  formName: string;
  formLabel: string;
  formPlaceholder: string;
  formDescription: string | null;
  isErrorMessageShow?: boolean;
  startDate?: Date | string | null;
  endDate?: Date | string | null;
};

export function DateRangeDropdown({
  form,
  formName,
  formLabel,
  formPlaceholder,
  formDescription,
  isErrorMessageShow = false,
  startDate,
  endDate,
}: DateRangeDropdownProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  console.log(form.getValues(), "form.values");

  // Generate date options between start and end dates
  const dateOptions = React.useMemo(() => {
    if (!startDate || !endDate) return [];

    const start =
      typeof startDate === "string" ? parseISO(startDate) : startDate;
    const end = typeof endDate === "string" ? parseISO(endDate) : endDate;

    const options = [];
    let currentDate = start;

    while (currentDate <= end) {
      const formattedLabel = format(currentDate, "MMM d, EEEE"); // Format as "Apr 5, Saturday"
      const formattedValue = format(currentDate, "yyyy-MM-dd"); // Format as ISO date string

      options.push({
        label: formattedLabel,
        value: formattedValue,
      });

      currentDate = addDays(currentDate, 1);
    }

    return options;
  }, [startDate, endDate]);

  // Set default value when dates change
  React.useEffect(() => {
    if (dateOptions.length > 0 && !form.getValues(formName)) {
      form.setValue(formName, []);
    }
  }, [dateOptions, form, formName]);

  const isDisabled = !startDate || !endDate || dateOptions.length === 0;

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "") {
            const currentValue = form.getValues(formName) || [];
            if (currentValue.length > 0) {
              form.setValue(formName, currentValue.slice(0, -1), {
                shouldValidate: true,
                shouldDirty: true,
              });
            }
          }
        }
        if (e.key === "Escape") {
          input.blur();
          setOpen(false);
        }
      }
    },
    [form, formName]
  );

  const handleUnselect = React.useCallback(
    (value: string) => {
      const currentValue = form.getValues(formName) || [];
      form.setValue(
        formName,
        currentValue.filter((v: string) => v !== value),
        { shouldValidate: true, shouldDirty: true }
      );
    },
    [form, formName]
  );

  // Filter options based on input
  const filteredOptions = React.useMemo(() => {
    if (!inputValue) return dateOptions;

    return dateOptions.filter((option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [dateOptions, inputValue]);

  // Get currently selected dates
  const selectedValues = form.watch(formName) || [];

  // Filter out already selected options
  const selectableOptions = filteredOptions.filter(
    (option) => !selectedValues.includes(option.value)
  );

  return (
    <FormField
      control={form.control}
      name={formName}
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel>{formLabel}</FormLabel>
          <Command
            onKeyDown={handleKeyDown}
            className="overflow-visible bg-transparent"
          >
            <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
              <div className="flex flex-wrap gap-1">
                {selectedValues.length > 0 &&
                  selectedValues.map((value: string) => {
                    const option = dateOptions.find(
                      (opt) => opt.value === value
                    );
                    return (
                      <Badge key={value} variant="secondary">
                        {option?.label}
                        <button
                          className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleUnselect(value);
                            }
                          }}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          onClick={() => handleUnselect(value)}
                        >
                          <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                        </button>
                      </Badge>
                    );
                  })}
                <div className="flex items-center gap-1 flex-1">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <CommandPrimitive.Input
                    ref={inputRef}
                    value={inputValue}
                    onValueChange={setInputValue}
                    onBlur={() => setOpen(false)}
                    onFocus={() => setOpen(true)}
                    placeholder={
                      selectedValues.length === 0
                        ? formPlaceholder
                        : "Add more dates..."
                    }
                    disabled={isDisabled}
                    className="ml-1 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                  />
                </div>
              </div>
            </div>
            <div className="relative mt-2">
              <CommandList>
                {open && selectableOptions.length > 0 ? (
                  <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                    <CommandInput
                      placeholder="Search dates..."
                      value={inputValue}
                      onValueChange={setInputValue}
                      className="border-none focus:ring-0"
                    />
                    <CommandGroup className="max-h-64 overflow-auto">
                      {selectableOptions.map((option) => {
                        return (
                          <CommandItem
                            key={option.value}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            onSelect={() => {
                              setInputValue("");
                              const currentValue = field.value || [];
                              form.setValue(
                                formName,
                                [...currentValue, option.value],
                                { shouldValidate: true, shouldDirty: true }
                              );
                            }}
                            className="cursor-pointer"
                          >
                            <CheckIcon className="mr-2 h-4 w-4 opacity-0" />
                            {option.label}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </div>
                ) : null}
              </CommandList>
            </div>
          </Command>
          {formDescription && (
            <FormDescription className="text-xs">
              {formDescription}
            </FormDescription>
          )}
          {isErrorMessageShow && <FormMessage />}
        </FormItem>
      )}
    />
  );
}
