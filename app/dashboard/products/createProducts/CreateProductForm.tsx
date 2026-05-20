"use client";

import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";

import ProductInformationSection from "./ProductInformationSection";
import ContractInformationSection from "./ContractInformationSection";
import FinancialTermsSection from "./FinancialTermsSection";
import LegalDocumentsSection from "./LegalDocumentsSection";
import { RateSheetMembersSection } from "./RateSheetMembersSection";

import {
  getCompanyDropdown,
  getRateSheetDropdown,
} from "@/app/services/productApi";

import {
  createProductSchema,
  type CreateProductFormData,
  type CreateProductFormInput,
} from "@/app/schemas/createProductSchema";

import { createProductPayload } from "../../../helpers/productPayloadHelper";

const PRODUCTS_PAGE = "/dashboard/products";

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
  rateSheetMembers: [],
  document: undefined,
  useLinkToShareDocument: false,
  documentLinks: [{ url: "" }],
};

export default function CreateProductForm() {
  const router = useRouter();

  const form = useForm<CreateProductFormInput, unknown, CreateProductFormData>({
    resolver: zodResolver(createProductSchema),
    defaultValues,
  });

  const { data: companies = [] } = useQuery({
    queryKey: ["company-dropdown"],
    queryFn: getCompanyDropdown,
  });

  const { data: rateSheets = [] } = useQuery({
    queryKey: ["rate-sheet-dropdown"],
    queryFn: getRateSheetDropdown,
  });

  function handleCancel() {
    router.push(PRODUCTS_PAGE);
  }

  function handleCreateProduct(data: CreateProductFormData) {
    const payload = createProductPayload(data);

    console.log("Payload:", payload);
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
        <form onSubmit={form.handleSubmit(handleCreateProduct)}>
          <div className="mx-auto max-w-xl space-y-8">
            <ProductInformationSection companies={companies} />
            <ContractInformationSection />
            <FinancialTermsSection rateSheets={rateSheets} />
            <RateSheetMembersSection />
            <LegalDocumentsSection />
          </div>

          <div className="mx-auto mt-10 flex max-w-xl gap-3 bg-gray-50 px-5 py-5 sm:justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded border border-gray-200 bg-white px-5 py-2 text-xs font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-100 active:scale-95"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded bg-blue-600 px-5 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 active:scale-95"
            >
              Create Product
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
