import { IconClose } from "./icons";

type ModalHeaderProps = {
  title: string;
  closeId: string;
};

export default function ModalHeader({ title, closeId }: ModalHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold">{title}</h3>
      <label
        htmlFor={closeId}
        className="flex cursor-pointer items-center gap-2 rounded-full bg-[#f3efe6] px-3 py-1 text-xs font-semibold"
      >
        <IconClose className="h-3 w-3" />
        Fermer
      </label>
    </div>
  );
}
