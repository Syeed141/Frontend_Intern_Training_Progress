"use client";

import { useFormContext } from "react-hook-form";
import type { CreateProductFormData } from "@/app/schemas/createProductSchema";
import FormRow from "./FormRow";
import { inputClass, sectionTitleClass } from "./formStyles";

export default function LegalDocumentsSection() {
  // register connects the file input and checkbox to react-hook-form.
  const { register } = useFormContext<CreateProductFormData>();

  return (
    <section>
      <h2 className={sectionTitleClass}>Legal Documents</h2>

      <div className="space-y-4">
        <FormRow label="Upload Doc">
          <input
            type="file"
            {...register("document")}
            className={`${inputClass} file:mr-3 file:rounded file:border-0 file:bg-gray-100 file:px-3 file:py-1 file:text-sm file:font-semibold file:text-gray-700`}
          />

          <p className="mt-1 text-xs text-gray-400">
            Any document file can be uploaded within 10MB.
          </p>
        </FormRow>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-[160px_1fr] sm:gap-4">
          <div className="hidden sm:block" />

          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              {...register("useLinkToShareDocument")}
              className="h-4 w-4"
            />

            Use link to share document
          </label>
        </div>
      </div>
    </section>
  );
}
