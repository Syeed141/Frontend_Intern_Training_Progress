"use client";

import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";

import type { CreateProductFormInput } from "@/app/schemas/createProductSchema";
import FormRow from "./FormRow";
import { inputClass, sectionTitleClass } from "./formStyles";

export default function LegalDocumentsSection() {
  const { control, register } = useFormContext<CreateProductFormInput>();
  const useLinkToShareDocument = useWatch({
    control,
    name: "useLinkToShareDocument",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "documentLinks",
  });

  return (
    <section>
      <h2 className={sectionTitleClass}>Legal Documents</h2>

      <div className="space-y-4">
        <FormRow label="Upload Doc">
          <input
            type="file"
            disabled={useLinkToShareDocument}
            {...register("document")}
            className={`${inputClass} file:mr-3 file:rounded file:border-0 file:bg-gray-100 file:px-3 file:py-1 file:text-sm file:font-semibold file:text-gray-700 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400`}
          />

          <p className="mt-1 text-xs text-gray-400">
            {useLinkToShareDocument
              ? "Disable link sharing to upload a document."
              : "Any document file can be uploaded within 10MB."}
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

        {useLinkToShareDocument && (
          <FormRow label="Document Link">
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <input
                    {...register(`documentLinks.${index}.url`)}
                    placeholder="Paste document link"
                    className={inputClass}
                  />

                  <button
                    type="button"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded border border-gray-200 text-gray-500 transition hover:bg-gray-100 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => append({ url: "" })}
                className="inline-flex items-center gap-2 rounded border border-blue-100 px-3 py-2 text-sm font-semibold text-blue-600 transition hover:border-blue-200 hover:bg-blue-50 active:scale-95"
              >
                <Plus className="h-4 w-4" />
                Add link
              </button>
            </div>
          </FormRow>
        )}
      </div>
    </section>
  );
}
