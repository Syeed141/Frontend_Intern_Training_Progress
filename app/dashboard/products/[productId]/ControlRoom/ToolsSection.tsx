import IconChip from "@/app/components/common/IconChip";
import type { ResourceTool } from "../../../../types/ControlRoomTypes";

type ToolsSectionProps = {
  tools: ResourceTool[];
  selectedToolIds: string[];
  isLoading: boolean;
  onToolChange: (toolId: string) => void;
};

export default function ToolsSection({
  tools,
  selectedToolIds,
  isLoading,
  onToolChange,
}: ToolsSectionProps) {
  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-gray-500">Tools</p>

      {isLoading ? (
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-9 w-24 animate-pulse rounded border border-gray-100 bg-gray-100"
            />
          ))}
        </div>
      ) : tools.length === 0 ? (
        <p className="text-sm text-gray-400">No tools found.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {tools.map((tool) => (
            <IconChip
              key={tool.toolId}
              label={tool.toolName}
              image={tool.logo}
              isActive={selectedToolIds.includes(tool.toolId)}
              onClick={() => onToolChange(tool.toolId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
