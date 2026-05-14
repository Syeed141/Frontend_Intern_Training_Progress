import type { ReactNode } from "react";
import { AlertTriangle, CircleHelp } from "lucide-react";

type FormRowProps = {
  label: string;
  // Shows a red star beside the label.
  required?: boolean;
  // Optional help text shown on hover.
  tooltip?: string;
  // Optional validation message shown below the input.
  error?: string;
  // The input, textarea, select, or checkbox placed inside the row.
  children: ReactNode;
};

// FormRow keeps the label, input, tooltip, and error message in one layout.
export default function FormRow({
  label,
  required,
  tooltip,
  error,
  children,
}: FormRowProps) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-[160px_1fr] sm:gap-4">
      <label className="grid grid-cols-[1fr_16px] items-center gap-1 text-sm font-semibold text-gray-700 sm:pt-2 sm:text-right">
        <span className="min-w-0">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </span>

        {/* Show the help icon only when a tooltip is passed. */}
        <span className="group relative inline-flex h-4 w-4 items-center justify-center">
          {tooltip && <CircleHelp className="h-4 w-4 text-gray-400" />}
          {tooltip && (
            <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-1 hidden w-48 -translate-x-1/2 rounded bg-gray-900 px-2 py-1 text-center text-xs font-normal text-white group-hover:block">
              {tooltip}
            </span>
          )}
        </span>
      </label>

      <div>
        {children}

        {/* Show validation error text under the input. */}
        {error && (
          <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-red-500">
            <AlertTriangle className="h-4 w-4" />
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
