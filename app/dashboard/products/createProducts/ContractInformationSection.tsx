"use client";

import { useFormContext } from "react-hook-form";
import { useWatch } from "react-hook-form";
import type { CreateProductFormInput } from "@/app/schemas/createProductSchema";
import type { DropdownItem } from "@/app/services/productApi";
import DateInput from "./DateInput";
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
    control,
    register,
    formState: { errors },
  } = useFormContext<CreateProductFormInput>();

  const startDate = useWatch({ control, name: "startDate" });
  const endDate = useWatch({ control, name: "endDate" });

  // Error messages are stored in variables 
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
          <DateInput
            placeholder="Pick a start date"
            value={startDate}
            error={startDateError}
            registration={register("startDate")}
            className={`${getInputClass(startDateError)} pl-10`}
          />
        </FormRow>

        <FormRow label="End Date" required error={endDateError}>
          <DateInput
            placeholder="Pick an end date"
            value={endDate}
            error={endDateError}
            registration={register("endDate")}
            className={`${getInputClass(endDateError)} pl-10`}
          />
        </FormRow>

        {/* <FormRow label="Team Member" error={teamMemberError}>
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
        </FormRow> */}
      </div>
    </section>
  );
}
