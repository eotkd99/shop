import { FilterType } from "@/types/products";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface FilterSidebarProps {
  filterTypes: FilterType[];
  selectedFilters: Record<string, number[]>;
  onFilterChange: (filterType: string, filterValueId: number, checked: boolean) => void;
}

export default function FilterSidebar({ filterTypes, selectedFilters, onFilterChange }: FilterSidebarProps) {
  return (
    <div>
      {filterTypes.map((type) => (
        <div key={type.id} className="mb-6">
          <h3 className="font-semibold mb-2 text-base">{type.display_name}</h3>
          <div className="pl-2 space-y-1">
            {type.values.map((v) => (
              <div key={v.id} className="flex items-center">
                <Checkbox
                  id={`filter-${v.id}`}
                  checked={selectedFilters[type.name]?.includes(v.id) ?? false}
                  onCheckedChange={(val) => onFilterChange(type.name, v.id, !!val)}
                />
                <Label htmlFor={`filter-${v.id}`} className="ml-2 text-[15px]">
                  {v.name}
                </Label>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
