// Common Tailwind classes shared by normal inputs.
export const inputClass =
  "w-full rounded border border-gray-200 px-3 py-2.5 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-blue-600";

// Same input style, but with red borders for validation errors.
export const inputErrorClass =
  "w-full rounded border border-red-400 px-3 py-2.5 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-red-500";

// Pick the correct input style based on whether an error exists.
export function getInputClass(error?: string) {
  if (error) {
    return inputErrorClass;
  }

  return inputClass;
}

// Common style for each section heading.
export const sectionTitleClass = "mb-4 text-lg font-bold text-gray-700";
