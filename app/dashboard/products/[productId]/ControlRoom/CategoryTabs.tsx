import IconChip from "@/app/components/common/IconChip";
import type { ResourceCategory } from "../../../../types/ControlRoomTypes";

type CategoryTabsProps = {
  categories: ResourceCategory[];
  activeCategoryId: string;
  onCategoryChange: (categoryId: string) => void;
};

export default function CategoryTabs({
  categories,
  activeCategoryId,
  onCategoryChange,
}: CategoryTabsProps) {
  if (categories.length === 0) {
    return (
      <p className="text-sm text-gray-400">No categories found.</p>
    );
  }

  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-gray-500">Categories</p>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <IconChip
            key={category._id}
            label={category.name}
            image={category.image}
            isActive={category._id === activeCategoryId}
            tintActiveImage
            onClick={() => onCategoryChange(category._id)}
          />
        ))}
      </div>
    </div>
  );
}
