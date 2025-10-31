import { Button } from "@heroui/button";
import { tabs } from "@/constants/categories";

interface YearTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const allTabs = ["Todos", ...tabs]; 

export function YearTabs({ activeTab, onTabChange }: YearTabsProps) {
  return (
    <section className="px-2 sm:px-6">
      <div className="border-b border-[#E5E5E5]">
        <nav
          className="flex space-x-1 overflow-x-auto scrollbar-hide w-full"
          aria-label="Tabs"
        >
          {allTabs.map((label) => (
            <Button
              key={label}
              variant="light"
              size="sm"
              className={`whitespace-nowrap px-4 py-2 rounded-t-md transition-all duration-200 ${
                label === activeTab
                  ? "text-[#300E7A] border-b-2 border-[#300E7A] font-semibold bg-white shadow-sm"
                  : "text-[#6B7280] hover:text-[#300E7A] hover:bg-gray-50"
              }`}
              aria-current={label === activeTab ? "page" : undefined}
              onPress={() => onTabChange(label)}
            >
              {label}
            </Button>
          ))}
        </nav>
      </div>
    </section>
  );
}
