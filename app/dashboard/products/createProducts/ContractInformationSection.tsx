"use client";

import { useFormContext } from "react-hook-form";
import { Calendar } from "lucide-react";
import type { CreateProductFormData } from "@/app/schemas/createProductSchema";
import type { DropdownItem } from "@/app/services/productApi";
import FormRow from "./FormRow";
import { getInputClass, sectionTitleClass } from "./formStyles";

type ContractInformationSectionProps = {
  // List shown inside the Team Member dropdown.
  teamMembers: DropdownItem[];
};

export default function ContractInformationSection({
  teamMembers,
}: ContractInformationSectionProps) {
  // Get form helpers from the FormProvider in page.tsx.
  const {
    register,
    formState: { errors },
  } = useFormContext<CreateProductFormData>();

  // Error messages are stored in variables to keep the JSX simple.
  const contractNameError = errors.contractName?.message;
  const statusError = errors.status?.message;
  const startDateError = errors.startDate?.message;
  const endDateError = errors.endDate?.message;
  const teamMemberError = errors.teamMemberId?.message;

  return (
    <section>
      <h2 className={sectionTitleClass}>Contract Information</h2>

      <div className="space-y-4">
        <FormRow label="Contract Name" required error={contractNameError}>
          <input
            {...register("contractName")}
            placeholder="Contract name"
            className={getInputClass(contractNameError)}
          />
        </FormRow>

        <FormRow label="Status" required error={statusError}>
          <select
            {...register("status")}
            className={getInputClass(statusError)}
          >
            <option value="">Select</option>
            <option value="draft">Draft</option>
            <option value="signed">Signed</option>
            <option value="amended">Amended</option>
            <option value="terminated">Terminated</option>
            <option value="completed">Completed</option>
          </select>
        </FormRow>

        <FormRow label="Start Date" required error={startDateError}>
          <div className="relative">
            <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              {...register("startDate")}
              className={`${getInputClass(startDateError)} pl-9`}
            />
          </div>
        </FormRow>

        <FormRow label="End Date" required error={endDateError}>
          <div className="relative">
            <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              {...register("endDate")}
              className={`${getInputClass(endDateError)} pl-9`}
            />
          </div>
        </FormRow>

        <FormRow label="Team Member" error={teamMemberError}>
          <select
            {...register("teamMemberId")}
            className={getInputClass(teamMemberError)}
          >
            <option value="">Select</option>

            {teamMembers.map((member) => (
              <option key={member._id} value={member._id}>
                {member.name}
              </option>
            ))}
          </select>
        </FormRow>
      </div>
    </section>
  );
}
