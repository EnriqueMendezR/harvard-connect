import { useState, useMemo } from "react";
import { ActivityCard } from "@/components/activities/ActivityCard";
import { ActivityFilters } from "@/components/activities/ActivityFilters";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { activitiesApi } from "@/lib/api";

export default function Activities() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get("category") || null
  );

  const { data: activities = [], isLoading } = useQuery({
    queryKey: ['activities', searchQuery, selectedCategory],
    queryFn: () => activitiesApi.getActivities({ 
      search: searchQuery || undefined,
      category: selectedCategory || undefined 
    }),
  });

  const filteredActivities = useMemo(() => {
    return activities.sort((a, b) => 
      new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
    );
  }, [activities]);

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Activities</h1>
          <p className="text-muted-foreground">Find something fun to do with fellow students</p>
        </div>
        <Link to="/create">
          <Button variant="default" className="gap-2">
            <Plus className="h-4 w-4" />
            Create Activity
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <ActivityFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Recommended Section (if no filters) */}
      {!searchQuery && !selectedCategory && filteredActivities.length > 0 && (
        <div className="bg-secondary/30 rounded-2xl p-6 border border-border/50">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Recommended for You</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredActivities.slice(0, 3).map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        </div>
      )}

      {/* All Activities */}
      <div>
        <h2 className="font-semibold mb-4">
          {searchQuery || selectedCategory ? `${filteredActivities.length} Results` : "All Upcoming Activities"}
        </h2>
        
        {isLoading ? (
          <div className="text-center py-16 bg-secondary/20 rounded-2xl">
            <p className="text-muted-foreground">Loading activities...</p>
          </div>
        ) : filteredActivities.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-secondary/20 rounded-2xl">
            <p className="text-muted-foreground mb-4">No activities found matching your criteria</p>
            <Button variant="soft" onClick={() => { setSearchQuery(""); setSelectedCategory(null); }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
