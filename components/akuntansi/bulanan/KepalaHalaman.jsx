import { ArrowLeft } from "lucide-react";

const KepalaHalaman = ({ judul, saatKembali }) => (
    <h1 
        className="text-[28px] md:text-[32px] font-semibold text-black flex items-center gap-3 cursor-pointer hover:text-[#3D6CB9] transition-colors mb-6" 
        onClick={saatKembali}
    >
        <ArrowLeft size={28} /> {judul}
    </h1>
);

export default KepalaHalaman;