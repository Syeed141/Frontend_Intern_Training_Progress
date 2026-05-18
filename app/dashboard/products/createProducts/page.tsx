"use client";


import { useRouter } from "next/navigation";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { RateSheetMembersSection } from "./RateSheetMembersSection";
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
  type CreateProductFormData,
  type CreateProductFormInput,
} from "@/app/schemas/createProductSchema";

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

function toLocalDateISOString(dateValue: string) {
  if (!dateValue) {
    return "";
  }

  const [year, month, day] = dateValue.split("-").map(Number);

  return new Date(year, month - 1, day).toISOString();
}

function toEmploymentStatus(workType: string) {
  return workType.replace("-", "_").toUpperCase();
}

export default function CreateProductPage() {
  const router = useRouter();

  const form = useForm<CreateProductFormInput, unknown, CreateProductFormData>({
    resolver: zodResolver(createProductSchema),
    defaultValues,
  });

  // selecting ratesheet id by ratesheet dropdown
  const selectedRateSheetId = useWatch({
    control: form.control,
    name: "rateSheetId",
  });

  // companies dropdown
  const { data: companies = [] } = useQuery({
    queryKey: ["company-dropdown"],
    queryFn: getCompanyDropdown,
  });

  // ratesheet Dropdown
  const { data: rateSheets = [] } = useQuery({
    queryKey: ["rate-sheet-dropdown"],
    queryFn: getRateSheetDropdown,
  });

  const { data: teamMembers = [] } = useQuery({
    queryKey: ["team-member-dropdown"],
    queryFn: getTeamMemberDropdown,
  });




  function handleCancel() {
    router.push(PRODUCTS_PAGE);
  }

  // product payload creation
  function handleCreateProduct(data: CreateProductFormData) {
    const payload = {
      companyId: data.companyId,
      productName: data.productName,
      productDetails: data.productDetails,
      contractName: data.contractName,
      contractStatus: data.status,
      startDate: toLocalDateISOString(data.startDate),
      safeAgreementAmount: data.safeTerms,
      valuationCapitalAmount: data.valuationCap,
      discount: data.discount,
      rateSheetId: data.rateSheetId,
      endDate: toLocalDateISOString(data.endDate),
      documentLink: "",
      documentKey: "",
      linksToShare: data.useLinkToShareDocument
        ? data.documentLinks
            .map((documentLink) => documentLink.url.trim())
            .filter(Boolean)
        : [],
      productEmployees: {
        assignedEmployees: data.rateSheetMembers.map((member) => ({
          _id: member.teamStructureId,
          teamRateId: member.employeeRoleId,
          name: member.roleName,
          employeeRoleId: member.employeeRoleId,
          employeeId: member.teamMemberId,
          employmentStatus: toEmploymentStatus(member.workType),
          internalRate: member.internalRate,
          billRate: member.billRate,
          startDate: toLocalDateISOString(member.startDate),
          endDate: toLocalDateISOString(member.endDate),
        })),
      },
    };

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

            <ContractInformationSection teamMembers={teamMembers} />

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
