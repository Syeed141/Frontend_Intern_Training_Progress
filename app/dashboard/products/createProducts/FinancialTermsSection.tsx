"use client";

import { useFormContext } from "react-hook-form";
import type { CreateProductFormData } from "@/app/schemas/createProductSchema";
import type { DropdownItem } from "@/app/services/productApi";
import FormRow from "./FormRow";
import { getInputClass, sectionTitleClass } from "./formStyles";

type FinancialTermsSectionProps = {
  // List shown inside the Rate Sheet dropdown.
  rateSheets: DropdownItem[];
};

export default function FinancialTermsSection({
  rateSheets,
}: FinancialTermsSectionProps) {
  // register connects these financial inputs to react-hook-form.
  const {
    register,
    formState: { errors },
  } = useFormContext<CreateProductFormData>();

  // Error messages are stored in variables to keep the JSX simple.
  const safeTermsError = errors.safeTerms?.message;
  const valuationCapError = errors.valuationCap?.message;
  const discountError = errors.discount?.message;
  const rateSheetError = errors.rateSheetId?.message;

  return (
    <section>
      <h2 className={sectionTitleClass}>Financial Terms</h2>

      <div className="space-y-4">
        <FormRow label="SAFE Terms" error={safeTermsError}>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-sm text-gray-400">
              $
            </span>

            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register("safeTerms")}
              className={`${getInputClass(safeTermsError)} pl-7 pr-12`}
            />

            <span className="absolute right-3 top-2.5 text-xs text-gray-400">
              USD
            </span>
          </div>
        </FormRow>

        <FormRow label="Valuation Cap" error={valuationCapError}>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-sm text-gray-400">
              $
            </span>

            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register("valuationCap")}
              className={`${getInputClass(valuationCapError)} pl-7 pr-12`}
            />

            <span className="absolute right-3 top-2.5 text-xs text-gray-400">
              USD
            </span>
          </div>
        </FormRow>

        <FormRow label="Discount" error={discountError}>
          <div className="relative">
             <span className="absolute left-3 top-2.5 text-sm text-gray-400">
              $
            </span>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register("discount")}
              className={`${getInputClass(discountError)} pl-7 pr-12`}
            />

            <span className="absolute right-3 top-2.5 text-xs text-gray-400">
              % Percentage
            </span>
          </div>
        </FormRow>

        <FormRow label="Rate Sheet" required error={rateSheetError}>
          <select
            {...register("rateSheetId")}
            className={getInputClass(rateSheetError)}
          >
            <option value="">Select</option>

            {rateSheets.map((rateSheet) => (
              <option key={rateSheet._id} value={rateSheet._id}>
                {rateSheet.name}
              </option>
            ))}
          </select>
        </FormRow>
      </div>
    </section>
  );
}
