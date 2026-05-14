"use client";

import { useFormContext } from "react-hook-form";

import type { CreateProductFormData } from "@/app/schemas/createProductSchema";
import type { DropdownItem } from "@/app/services/productApi";

import FormRow from "./FormRow";
import { getInputClass, sectionTitleClass } from "./formStyles";

type Props = {
  // List shown inside the Company dropdown.
  companies: DropdownItem[];
};

export default function ProductInformationSection({ companies }: Props) {
  // register connects each input to react-hook-form.
  const {
    register,
    formState: { errors },
  } = useFormContext<CreateProductFormData>();

  // Error messages are stored in variables to keep the JSX simple.
  const companyError = errors.companyId?.message;
  const productNameError = errors.productName?.message;
  const productDetailsError = errors.productDetails?.message;

  return (
    <section>
      <h2 className={sectionTitleClass}>Product Information</h2>

      <div className="space-y-4">
        <FormRow label="Company" required error={companyError}>
          <select
            {...register("companyId")}
            className={getInputClass(companyError)}
          >
            <option value="">Select company</option>

            {companies.map((company) => (
              <option key={company._id} value={company._id}>
                {company.name}
              </option>
            ))}
          </select>
        </FormRow>

        <FormRow label="Product Name" required error={productNameError}>
          <input
            {...register("productName")}
            placeholder="Enter product name"
            className={getInputClass(productNameError)}
          />
        </FormRow>

        <FormRow
          label="Product Details"
          required
          tooltip="Keep product details under 250 characters."
          error={productDetailsError}
        >
          <textarea
            {...register("productDetails")}
            placeholder="Enter product details"
            className={`${getInputClass(productDetailsError)} min-h-24 resize-none`}
          />

          <p className="mt-1 text-xs text-gray-400">
            Keep product details under 250 characters.
          </p>
        </FormRow>
      </div>
    </section>
  );
}
