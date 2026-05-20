type IconChipProps = {
  label: string;
  image?: string;
  isActive?: boolean;
  tintActiveImage?: boolean;
  onClick: () => void;
};

const activeIconStyle = {
  filter:
    "brightness(0) saturate(100%) invert(36%) sepia(78%) saturate(1895%) hue-rotate(211deg) brightness(96%) contrast(93%)",
};

export default function IconChip({
  label,
  image,
  isActive = false,
  tintActiveImage = false,
  onClick,
}: IconChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={`inline-flex cursor-pointer items-center gap-2 rounded border px-3 py-2 text-xs font-semibold shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:translate-y-px active:scale-[0.98] ${
        isActive
          ? "border-blue-300 bg-blue-50 text-blue-600"
          : "border-gray-200 bg-white text-gray-700 hover:border-blue-200 hover:bg-blue-50"
      }`}
    >
      {image && (
        <img
          src={image}
          alt=""
          className="h-4 w-4 rounded-sm object-contain transition"
          style={isActive && tintActiveImage ? activeIconStyle : undefined}
        />
      )}

      <span>{label}</span>
    </button>
  );
}
