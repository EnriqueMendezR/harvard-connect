import { useState, useMemo } from "react";
import { ActivityCard, Activity } from "@/components/activities/ActivityCard";
import { ActivityFilters } from "@/components/activities/ActivityFilters";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data for activities
const mockActivities: Activity[] = [
  {
    id: "1",
    title: "CS50 Problem Set Study Session",
    category: "study",
    description: "Working through this week's problem set together. All skill levels welcome - we can help each other out!",
    location: "Lamont Library, B Level",
    datetime: "2024-12-08T14:00:00",
    maxSize: 6,
    participantCount: 4,
    organizer: { id: "u1", name: "Sarah Chen", profilePictureUrl: "" }
  },
  {
    id: "2",
    title: "Sunday Brunch at Annenberg",
    category: "meal",
    description: "Let's grab brunch together! Perfect for meeting new people in a chill setting.",
    location: "Annenberg Hall",
    datetime: "2024-12-08T11:00:00",
    maxSize: 8,
    participantCount: 3,
    organizer: { id: "u2", name: "Marcus Johnson" }
  },
  {
    id: "3",
    title: "Pickup Basketball @ MAC",
    category: "sports",
    description: "Casual 5v5 games. All skill levels welcome - just come ready to have fun!",
    location: "Malkin Athletic Center",
    datetime: "2024-12-09T16:00:00",
    maxSize: 10,
    participantCount: 7,
    organizer: { id: "u3", name: "Jordan Williams" }
  },
  {
    id: "4",
    title: "Board Game Night",
    category: "social",
    description: "Bringing Catan, Codenames, and more! Come play games and meet awesome people.",
    location: "Adams House JCR",
    datetime: "2024-12-08T19:00:00",
    maxSize: 12,
    participantCount: 12,
    organizer: { id: "u4", name: "Emily Park" }
  },
  {
    id: "5",
    title: "Pottery Class for Beginners",
    category: "arts",
    description: "Learning the basics of wheel throwing. No experience needed!",
    location: "Ceramics Studio, SOCH",
    datetime: "2024-12-10T15:00:00",
    maxSize: 8,
    participantCount: 5,
    organizer: { id: "u5", name: "Alex Rivera" }
  },
  {
    id: "6",
    title: "Econ 1010a Exam Prep",
    category: "study",
    description: "Going through practice problems for the upcoming midterm. Let's ace this together!",
    location: "Widener Study Room 3B",
    datetime: "2024-12-09T10:00:00",
    maxSize: 5,
    participantCount: 2,
    organizer: { id: "u6", name: "David Kim" }
  },
];

export default function Activities() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredActivities = useMemo(() => {
    return mockActivities
      .filter((activity) => {
        const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          activity.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = !selectedCategory || activity.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());
  }, [searchQuery, selectedCategory]);

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
      {!searchQuery && !selectedCategory && (
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
        
        {filteredActivities.length > 0 ? (
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
