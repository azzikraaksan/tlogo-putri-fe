"use client";
import { Search } from "lucide-react";

const SearchInput = ({ value, onChange, onClear, placeholder = "Cari..." }) => {
  return (
    <div className="relative w-72 max-w-sm">
      <Search
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        size={18}
      />

      <input
        type="text"
        placeholder={placeholder}
        className="border border-gray-300 rounded-[13px] pl-10 pr-10 py-2 w-full focus:outline-none focus:ring-2 focus:ring-black-200"
        value={value}
        onChange={onChange}
      />

      {value && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl cursor-pointer"
        >
          &times;
        </button>
      )}
    </div>
  );
};

export default SearchInput;
