"use client";

import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { useQueries, useQuery } from "@tanstack/react-query";
import { AlertTriangle, CircleMinus, UserCircle } from "lucide-react";

import type { CreateProductFormInput } from "@/app/schemas/createProductSchema";
import {
  getRateSheetDetails,
  getTeamMemberDropdownByRoleId,
} from "@/app/services/productApi";
import DateInput from "../../../components/forms/DateInput";

type RoleReference = string | { _id?: string; id?: string; name?: string };

function getRoleId(role?: RoleReference) {
  if (!role) {
    return "";
  }

  if (typeof role === "string") {
    return role;
  }

  return role._id ?? role.id ?? "";
}

function getRoleName(role?: RoleReference) {
  if (!role || typeof role === "string") {
    return "";
  }

  return role.name ?? "";
}

// Rate sheet details can expose the role id directly or inside the nested role.
// The employee lookup API needs this role id to load the correct dropdown items.
function getTeamStructureRoleId(
  teamStructure: NonNullable<
    Awaited<ReturnType<typeof getRateSheetDetails>>["teamStructures"]
  >[number],
) {
  return getRoleId(teamStructure.employeeRoleId) || getRoleId(teamStructure.role);
}

export function RateSheetMembersSection() {
  const {
    control,
    register,
    trigger,
    formState: { errors },
  } = useFormContext<CreateProductFormInput>();

  const [savedMembers, setSavedMembers] = useState<
    CreateProductFormInput["rateSheetMembers"]
  >([]);

  // This value comes from FinancialTermsSection's rate sheet dropdown.
  // Changing it drives the whole dynamic members section.
  const selectedRateSheetId = useWatch({
    control,
    name: "rateSheetId",
  });

  // Keep the latest dynamic row values available for save state and DateInput.
  const rateSheetMembers = useWatch({
    control,
    name: "rateSheetMembers",
  });

  // Load the selected rate sheet only after the user picks one.
  // The response contains the team structures that become dynamic form rows.
  const { data: rateSheetDetails } = useQuery({
    queryKey: ["rate-sheet-details", selectedRateSheetId],
    queryFn: () => getRateSheetDetails(selectedRateSheetId),
    enabled: Boolean(selectedRateSheetId),
  });

  const { fields, replace, remove } = useFieldArray({
    control,
    name: "rateSheetMembers",
  });

  // Normalize a missing teamStructures response to an empty list so downstream
  // memoized calculations can stay simple.
  const teamStructures = useMemo(
    () => rateSheetDetails?.teamStructures ?? [],
    [rateSheetDetails?.teamStructures],
  );

  // Each unique role needs one employee dropdown request.
  // Duplicates are removed so the same role is not fetched repeatedly.
  const teamStructureRoleIds = useMemo(
    () =>
      Array.from(
        new Set(teamStructures.map(getTeamStructureRoleId).filter(Boolean)),
      ),
    [teamStructures],
  );

  // Fetch active employees for every role found in the selected rate sheet.
  // React Query runs these requests in parallel.
  const teamMemberQueries = useQueries({
    queries: teamStructureRoleIds.map((employeeRoleId) => ({
      queryKey: ["team-members-by-role", employeeRoleId],
      queryFn: () => getTeamMemberDropdownByRoleId(employeeRoleId),
      enabled: Boolean(selectedRateSheetId),
    })),
  });

  // Store fetched employees by role id so each dynamic row can render the
  // correct team member options for its role.
  const teamMembersByRoleId = useMemo(
    () =>
      new Map(
        teamStructureRoleIds.map((employeeRoleId, index) => [
          employeeRoleId,
          teamMemberQueries[index]?.data ?? [],
        ]),
      ),
    [teamMemberQueries, teamStructureRoleIds],
  );

  const isLoadingTeamMembers = teamMemberQueries.some(
    (query) => query.isLoading,
  );

  function getFieldClass(error?: string) {
    return [
      "h-10 w-full rounded-md border bg-white px-10 text-sm font-semibold text-gray-700 outline-none transition-colors placeholder:text-gray-400",
      error
        ? "border-red-400 focus:border-red-500"
        : "border-gray-200 focus:border-blue-600",
    ].join(" ");
  }

  function getSelectClass(error?: string) {
    return `${getFieldClass(error)} appearance-none pr-9`;
  }

  // Validate only the dynamic rateSheetMembers array before marking it saved.
  // The final form submit still validates the complete product form.
  async function handleSaveMembers() {
    const isValid = await trigger("rateSheetMembers", { shouldFocus: true });

    if (isValid) {
      setSavedMembers(rateSheetMembers ?? []);
    }
  }

  // When rate sheet details arrive, convert each team structure from the API
  // into one row in react-hook-form's rateSheetMembers field array.
  useEffect(() => {
    if (!rateSheetDetails?.teamStructures) {
      replace([]);
      return;
    }

    const formsFromApi = teamStructures.map((item) => {
      return {
        teamStructureId: item._id,
        employeeRoleId: getTeamStructureRoleId(item),
        roleName: getRoleName(item.role) || getRoleName(item.employeeRoleId),
        internalRate: item.internalRate,
        billRate: item.billRate,

        // User-editable fields start empty and are filled from the row controls.
        teamMemberId: "",
        workType: "",
        startDate: "",
        endDate: "",
      };
    });

    replace(formsFromApi);
  }, [rateSheetDetails, replace, teamStructures]);

  // Hide this section until there is enough rate sheet data to build rows.
  if (!selectedRateSheetId || !rateSheetDetails) {
    return null;
  }

  return (
    <div className="mt-6 rounded-md border border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold">
            {rateSheetDetails.name} <span className="text-red-500">*</span>
          </h3>

          <span className="text-sm text-gray-500">
            With {fields.length} roles
          </span>
        </div>

        <button
          type="button"
          onClick={handleSaveMembers}
          className="rounded border border-blue-100 px-3 py-1.5 text-sm font-semibold text-blue-600 transition hover:border-blue-200 hover:bg-blue-50 active:scale-95"
        >
          {savedMembers.length > 0 ? "Saved" : "Save members"}
        </button>
      </div>

      {fields.map((field, index) => {
        // The field array provides stable row metadata, while useWatch gives
        // the latest user-entered values for the same row index.
        const teamMembersForThisRole =
          teamMembersByRoleId.get(field.employeeRoleId) ?? [];
        const memberErrors = errors.rateSheetMembers?.[index];
        const memberValues = rateSheetMembers?.[index];
        const teamMemberError = memberErrors?.teamMemberId?.message;
        const workTypeError = memberErrors?.workType?.message;
        const startDateError = memberErrors?.startDate?.message;

        return (
          <div
            key={field.id}
            className="relative border-b border-gray-100 px-6 py-6 last:border-b-0"
          >
            <button
              type="button"
              onClick={() => remove(index)}
              className="absolute right-6 top-6 rounded-full text-red-500 transition hover:bg-red-50 active:scale-90"
            >
              <CircleMinus className="h-5 w-5" />
            </button>

            <p className="mb-1 text-sm font-semibold text-gray-700">
              {field.roleName}
            </p>

            <p className="mb-4 border-b border-gray-100 pb-4 text-sm font-semibold text-gray-400">
              Internal Rate: ${field.internalRate} /month{" "}
              <span className="ml-4">
                Billing Rate: ${field.billRate} /month
              </span>
            </p>

            {/* Hidden inputs keep API-provided row metadata in form state so it
                is included in validation and payload creation. */}
            <input
              type="hidden"
              {...register(`rateSheetMembers.${index}.teamStructureId`)}
            />

            <input
              type="hidden"
              {...register(`rateSheetMembers.${index}.employeeRoleId`)}
            />

            <input
              type="hidden"
              {...register(`rateSheetMembers.${index}.roleName`)}
            />

            <input
              type="hidden"
              {...register(`rateSheetMembers.${index}.internalRate`, {
                valueAsNumber: true,
              })}
            />

            <input
              type="hidden"
              {...register(`rateSheetMembers.${index}.billRate`, {
                valueAsNumber: true,
              })}
            />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-800">
                  Team Member <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <UserCircle className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                  <select
                    {...register(`rateSheetMembers.${index}.teamMemberId`)}
                    className={getSelectClass(teamMemberError)}
                  >
                    <option value="">
                      {isLoadingTeamMembers ? "Loading members..." : "Select"}
                    </option>

                    {teamMembersForThisRole.map((member) => (
                      <option key={member._id} value={member._id}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                </div>

                {teamMemberError && (
                  <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-red-500">
                    <AlertTriangle className="h-4 w-4" />
                    {teamMemberError}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-800">
                  Work Type <span className="text-red-500">*</span>
                </label>

                <select
                  {...register(`rateSheetMembers.${index}.workType`)}
                  className={getSelectClass(workTypeError)}
                >
                  <option value="">Select</option>
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                </select>

                {workTypeError && (
                  <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-red-500">
                    <AlertTriangle className="h-4 w-4" />
                    {workTypeError}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-800">
                  Start Date <span className="text-red-500">*</span>
                </label>

                <DateInput
                  placeholder="Pick a start date"
                  value={memberValues?.startDate}
                  error={startDateError}
                  registration={register(`rateSheetMembers.${index}.startDate`)}
                  className={getFieldClass(startDateError)}
                />

                {startDateError && (
                  <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-red-500">
                    <AlertTriangle className="h-4 w-4" />
                    {startDateError}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-800">
                  End Date
                </label>

                <DateInput
                  placeholder="Pick an end date"
                  value={memberValues?.endDate}
                  registration={register(`rateSheetMembers.${index}.endDate`)}
                  className={getFieldClass()}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
