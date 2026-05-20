
import type { CreateProductFormData } from "@/app/schemas/createProductSchema";
import { toLocalDateISOString } from "./dateHelpers";




export function toEmploymentStatus(workType: string) {
  return workType.replace("-", "_").toUpperCase();
}

export function createProductPayload(data: CreateProductFormData) {
  return {
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
}