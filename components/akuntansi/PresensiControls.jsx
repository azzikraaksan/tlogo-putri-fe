

import React from "react";
import {
  CalendarDays,
  RotateCcw,
  Zap,
  FileSpreadsheet,
  FileText,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const PresensiControls = ({
  calendarRef,
  isDatePickerOpen,
  setIsDatePickerOpen,
  selectedDateForFilter,
  tempDateForPicker,
  setTempDateForPicker,
  applyDateFilter,
  resetFilter,
  handleGeneratePresensiReport,
  handleExportExcel,
  handleExportPDF,
  filteredData,
  isLoading,
}) => {
    
  return (
    <div className="flex-1 p-4 md:p-6 relative">
      {/* Judul Presensi */}
      <h1 className="text-[28px] md:text-[32px] font-semibold text-black mb-6">
        Presensi
      </h1>

      {/* Kontrol */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        {/* Kiri: Filter tanggal & Buat laporan */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative" ref={calendarRef}>
            {!selectedDateForFilter ? (
              <button
                onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                className="flex items-center gap-2 bg-[#3D6CB9] hover:bg-[#B8D4F9] px-4 py-2 rounded-lg shadow text-white hover:text-black cursor-pointer"
              >
                <CalendarDays size={20} />
                <span>Pilih Tanggal</span>
              </button>
            ) : (
              <button
                onClick={resetFilter}
                className="flex items-center gap-2 bg-[#3D6CB9] hover:bg-[#B8D4F9] px-4 py-2 rounded-lg shadow text-white hover:text-black cursor-pointer"
              >
                <RotateCcw size={20} />
                <span>Atur Ulang</span>
              </button>
            )}
            {isDatePickerOpen && (
              <div
                className="absolute z-50 mt-2 bg-white border rounded-lg shadow-lg p-4 top-12 left-0 md:left-auto"
                style={{ minWidth: "280px" }}
              >
                <DatePicker
                  selected={tempDateForPicker}
                  onChange={(date) => setTempDateForPicker(date)}
                  inline
                  dateFormat="dd-MM-yyyy"
                  showPopperArrow={false}
                />
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => setIsDatePickerOpen(false)}
                    className="px-4 py-2 bg-red-200 text-black rounded hover:bg-red-500 hover:text-white cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    onClick={applyDateFilter}
                    className="px-4 py-2 bg-[#B8D4F9] text-black rounded hover:bg-[#3D6CB9] hover:text-white cursor-pointer"
                  >
                    Pilih Tanggal
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleGeneratePresensiReport}
            disabled={isLoading}
            className={`flex items-center gap-2 bg-[#3D6CB9] hover:bg-[#B8D4F9] px-4 py-2 rounded-lg shadow text-white hover:text-black ${
              isLoading ? "cursor-not-allowed opacity-70" : "cursor-pointer"
            }`}
          >
            <Zap size={20} />
            <span>Buat Laporan</span>
          </button>
        </div>

        {/* Kanan: Ekspor */}
        <div className="flex flex-wrap gap-4 items-center">
          <button
            onClick={handleExportExcel}
            disabled={filteredData.length === 0 || isLoading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow ${
              filteredData.length === 0 || isLoading
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-green-100 text-black hover:bg-green-200 cursor-pointer"
            }`}
          >
            <FileSpreadsheet
              size={20}
              color={filteredData.length === 0 || isLoading ? "gray" : "green"}
            />
            <span>Ekspor Excel</span>
          </button>

          <button
            onClick={handleExportPDF}
            disabled={filteredData.length === 0 || isLoading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow ${
              filteredData.length === 0 || isLoading
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-red-100 text-black hover:bg-red-200 cursor-pointer"
            }`}
          >
            <FileText
              size={20}
              color={filteredData.length === 0 || isLoading ? "gray" : "red"}
            />
            <span>Ekspor PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PresensiControls;
