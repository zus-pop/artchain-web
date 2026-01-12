import { ExhibitionPainting } from "@/types";
interface PanelProps {
  onClick: () => void;
  selectedItem: ExhibitionPainting;
}
export default function Panel({ onClick, selectedItem }: PanelProps) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-300"
      onClick={onClick}
    >
      <div
        className="bg-white p-5 rounded-md max-w-6xl max-h-screen overflow-auto flex items-center gap-5 transform transition-transform duration-300 scale-100 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClick}
          className="absolute top-2 right-2 px-3 py-2 bg-black text-white border-none rounded cursor-pointer text-xl"
        >
          X
        </button>
        <img
          src={selectedItem.imageUrl}
          alt={selectedItem.title}
          className="w-1/2 h-auto max-h-80vh rounded shrink-0"
        />
        <div className="flex-1 text-left">
          <h4 className="text-2xl font-bold mb-2 text-black">
            {selectedItem.title}
          </h4>
          <p className="mb-4 text-black">{selectedItem.description}</p>
        </div>
      </div>
    </div>
  );
}
