import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

const categories = [
  { id: "study", label: "Study", emoji: "📚" },
  { id: "meal", label: "Meal", emoji: "🍕" },
  { id: "sports", label: "Sports", emoji: "⚽" },
  { id: "social", label: "Social", emoji: "🎉" },
  { id: "arts", label: "Arts", emoji: "🎨" },
  { id: "other", label: "Other", emoji: "✨" },
];

export function ActivityFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
}: ActivityFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search activities..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <button 
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === null ? "default" : "secondary"}
          size="sm"
          onClick={() => onCategoryChange(null)}
          className="rounded-full"
        >
          All
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "secondary"}
            size="sm"
            onClick={() => onCategoryChange(category.id)}
            className="rounded-full gap-1.5"
          >
            <span>{category.emoji}</span>
            <span>{category.label}</span>
          </Button>
        ))}
      </div>

      {/* Active filters summary */}
      {(searchQuery || selectedCategory) && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span>
            Showing 
            {selectedCategory && ` ${categories.find(c => c.id === selectedCategory)?.label}`} activities
            {searchQuery && ` matching "${searchQuery}"`}
          </span>
          <button
            onClick={() => {
              onSearchChange("");
              onCategoryChange(null);
            }}
            className="text-primary hover:underline ml-auto"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
