"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";

import ProductInformationSection from "./ProductInformationSection";
import ContractInformationSection from "./ContractInformationSection";
import FinancialTermsSection from "./FinancialTermsSection";
import LegalDocumentsSection from "./LegalDocumentsSection";

import {
  getCompanyDropdown,
  getRateSheetDetails,
  getRateSheetDropdown,
  getTeamMemberDropdown,
} from "@/app/services/productApi";

import {
  createProductSchema,
  type CreateProductFormInput,
} from "@/app/schemas/createProductSchema";

const PRODUCTS_PAGE = "/dashboard/products";

// These values fill the form before the user types anything.
const defaultValues: CreateProductFormInput = {
  companyId: "",
  productName: "",
  productDetails: "",
  contractName: "",
  status: "",
  startDate: "",
  endDate: "",
  teamMemberId: "",
  safeTerms: 0,
  valuationCap: 0,
  discount: 0,
  rateSheetId: "",
  document: undefined,
  useLinkToShareDocument: false,
};

export default function CreateProductPage() {
  const router = useRouter();

  // react-hook-form stores all input values and validation errors.
  const form = useForm<CreateProductFormInput>({
    resolver: zodResolver(createProductSchema),
    defaultValues,
  });

  // This value changes when a rate sheet is selected.
  const selectedRateSheetId = useWatch({
    control: form.control,
    name: "rateSheetId",
  });

  // Company options for the Company dropdown.
  const { data: companies = [] } = useQuery({
    queryKey: ["company-dropdown"],
    queryFn: getCompanyDropdown,
  });

  // Rate sheet options for the Rate Sheet dropdown.
  const { data: rateSheets = [] } = useQuery({
    queryKey: ["rate-sheet-dropdown"],
    queryFn: getRateSheetDropdown,
  });

  // Team member options for the Team Member dropdown.
  const { data: teamMembers = [] } = useQuery({
    queryKey: ["team-member-dropdown"],
    queryFn: getTeamMemberDropdown,
  });

  // Load details only after the user selects a rate sheet.
  const { data: rateSheetDetails } = useQuery({
    queryKey: ["rate-sheet-details", selectedRateSheetId],
    queryFn: () => getRateSheetDetails(selectedRateSheetId),
    enabled: selectedRateSheetId !== "",
  });

  // When rate sheet details arrive, place them into the form fields.
  useEffect(() => {
    if (!rateSheetDetails) return;

    form.setValue("safeTerms", rateSheetDetails.safeTerms);
    form.setValue("valuationCap", rateSheetDetails.valuationCap);
    form.setValue("discount", rateSheetDetails.discount);
  }, [rateSheetDetails, form]);

  // Go back to the products list page.
  function handleCancel() {
    router.push(PRODUCTS_PAGE);
  }

  return (
    <div className="min-h-screen px-5 py-6 pt-16 lg:px-8 lg:pt-6">
      <div className="text-xs font-semibold">
        <span className="text-gray-400">Products</span>
        <span className="mx-2 text-gray-300">&gt;</span>
        <span className="text-blue-600">Create</span>
      </div>

      <h1 className="mt-1 text-2xl font-bold text-gray-800">Add Product</h1>

      <FormProvider {...form}>
        {/* FormProvider gives child components access to the same form. */}
        <form className="mt-8">
          <div className="mx-auto max-w-xl space-y-8">
            <ProductInformationSection companies={companies} />

            <ContractInformationSection teamMembers={teamMembers} />

            <FinancialTermsSection rateSheets={rateSheets} />

            <LegalDocumentsSection />
          </div>

          <div className="mt-10 flex bg-gray-50 px-5 py-5 sm:justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded border border-gray-200 bg-white px-5 py-2 text-xs font-semibold text-gray-700"
            >
              Cancel
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
