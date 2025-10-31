import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Buscar boletines por título, descripción...",
}: SearchBarProps) {
  return (
    <div className="w-full mb-6 flex items-center">
      <div className="relative w-full">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-800 transition-colors duration-300 group-hover:text-blue-800"
        />
        <input
          type="text"
          placeholder={placeholder}
          className="pl-10 w-full rounded-xl border border-blue-800 py-3 px-4 text-sm md:text-base text-gray-800 placeholder:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white shadow-sm transition-all duration-300"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Buscar boletines"
        />
      </div>
    </div>
  );
}
