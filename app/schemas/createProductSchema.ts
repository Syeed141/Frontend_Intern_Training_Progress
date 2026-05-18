import { z } from "zod";

const rateSheetMemberSchema = z.object({
  teamStructureId: z.string(),
  employeeRoleId: z.string(),
  roleName: z.string(),
  internalRate: z.number(),
  billRate: z.number(),

  teamMemberId: z.string().min(1, "Team member is required."),
  workType: z.string().min(1, "Work type is required."),
  startDate: z.string().min(1, "Start date is required."),
  endDate: z.string(),
});

export const createProductSchema = z.object({
  companyId: z.string().min(1, "Company is required."),
  productName: z.string().min(1, "Product name is required."),
  productDetails: z
    .string()
    .min(1, "Product details is required.")
    .max(250, "Maximum 250 characters."),

  contractName: z.string().min(1, "Contract name is required."),
  status: z.string().min(1, "Contract status is required."),
  startDate: z.string().min(1, "Start date is required."),
  endDate: z.string().min(1, "End date is required."),
  teamMemberId: z.string(),

  safeTerms: z.coerce.number(),
  valuationCap: z.coerce.number(),
  discount: z.coerce.number(),

  rateSheetId: z.string().min(1, "Rate sheet is required."),
  rateSheetMembers: z.array(rateSheetMemberSchema),

  document: z.any(),
  useLinkToShareDocument: z.boolean(),
  documentLinks: z.array(
    z.object({
      url: z.string(),
    }),
  ),
});

export type CreateProductFormInput = z.input<typeof createProductSchema>;
export type CreateProductFormData = z.output<typeof createProductSchema>;
