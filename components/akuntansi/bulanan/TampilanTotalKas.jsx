import { formatRupiah } from "./Utilitas.js";

const TampilanTotalKas = ({ total }) => (
    <div className="fixed bottom-4 right-4 bg-white text-black px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-20">
        <span className="font-bold text-lg">Total Kas:</span>
        <span className="text-lg font-semibold text-[#3D6CB9]">{formatRupiah(total)}</span>
    </div>
);

export default TampilanTotalKas;