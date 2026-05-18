"use client";

import type { UseFormRegisterReturn } from "react-hook-form";
import { Calendar } from "lucide-react";

type DateInputProps = {
  placeholder: string;
  value?: string;
  error?: string;
  registration: UseFormRegisterReturn;
  className: string;
};

export default function DateInput({
  placeholder,
  value,
  error,
  registration,
  className,
}: DateInputProps) {
  const { onBlur, onChange, ...field } = registration;

  return (
    <div className="relative">
      <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

      {!value && (
        <span className="pointer-events-none absolute left-10 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">
          {placeholder}
        </span>
      )}

      <input
        {...field}
        type="date"
        aria-invalid={Boolean(error)}
        onClick={(event) => event.currentTarget.showPicker?.()}
        onBlur={(event) => void onBlur(event)}
        onChange={(event) => void onChange(event)}
        className={`${className} ${value ? "" : "text-transparent"} [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0`}
      />
    </div>
  );
}
