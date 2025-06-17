import React from "react";

const PresensiTable = ({
  tableDisplayHeaders,
  filteredData,
  formatDateToDayOnly,
  getMonthName,
}) => {
  return (
    <div className="px-6">
      <div className="overflow-x-auto rounded-lg shadow">
        <div className="max-h-[calc(100vh-280px)] overflow-y-auto">
          <table className="min-w-full table-auto bg-white text-sm">
            <thead className="bg-[#3D6CB9] text-white sticky top-0 z-10">
              <tr>
                {tableDisplayHeaders.map((header, index, arr) => (
                  <th
                    key={header}
                    className="p-3 text-center whitespace-nowrap"
                    style={{
                      borderTopLeftRadius: index === 0 ? "0.5rem" : undefined,
                      borderTopRightRadius:
                        index === arr.length - 1 ? "0.5rem" : undefined,
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={tableDisplayHeaders.length}
                    className="text-center p-4 text-gray-500 font-medium"
                  >
                    Data Tidak Ditemukan
                  </td>
                </tr>
              ) : (
                filteredData.map((item, idx) => (
                  <tr
                    key={item.id_presensi || `presensi-${idx}`}
                    className="border-b text-center border-gray-200 hover:bg-gray-100 transition duration-150 ease-in-out"
                  >
                    <td className="p-3 whitespace-nowrap">
                      {item.nama_lengkap || "-"}
                    </td>
                    <td className="p-3 whitespace-nowrap">{item.no_hp || "-"}</td>
                    <td className="p-3 whitespace-nowrap">{item.role || "-"}</td>
                    <td className="p-3 whitespace-nowrap">
                      {formatDateToDayOnly(item.tanggal_bergabung)}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {getMonthName(item.bulan)}
                    </td>
                    <td className="p-3 whitespace-nowrap">{item.tahun || "-"}</td>
                    <td className="p-3 whitespace-nowrap">
                      {item.jumlah_kehadiran == null
                        ? "-"
                        : item.jumlah_kehadiran}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PresensiTable;
