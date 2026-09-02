interface ToolbarButtonProps {
  active: boolean;
  label: string;
  onClick: () => void;
}

export default function ToolbarButton({
  active,
  label,
  onClick,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded px-3 py-1 transition ${
        active
          ? "bg-emerald-600 text-white"
          : "border bg-white hover:bg-gray-100"
      }`}
    >
      {label}
    </button>
  );
}