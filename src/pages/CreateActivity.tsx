import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Calendar, MapPin, Users, Clock } from "lucide-react";
import { toast } from "sonner";

const categories = [
  { value: "study", label: "📚 Study", description: "Study groups, tutoring, exam prep" },
  { value: "meal", label: "🍕 Meal", description: "Lunch, dinner, or coffee meetups" },
  { value: "sports", label: "⚽ Sports", description: "Pickup games, gym sessions, outdoor activities" },
  { value: "social", label: "🎉 Social", description: "Hangouts, parties, game nights" },
  { value: "arts", label: "🎨 Arts", description: "Creative activities, performances, workshops" },
  { value: "other", label: "✨ Other", description: "Anything else!" },
];

export default function CreateActivity() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    location: "",
    date: "",
    time: "",
    maxSize: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (!formData.title || !formData.category || !formData.location || !formData.date || !formData.time || !formData.maxSize) {
      toast.error("Please fill in all required fields");
      return;
    }

    const maxSize = parseInt(formData.maxSize);
    if (maxSize < 2 || maxSize > 50) {
      toast.error("Group size must be between 2 and 50");
      return;
    }

    // Check date is in future
    const activityDate = new Date(`${formData.date}T${formData.time}`);
    if (activityDate <= new Date()) {
      toast.error("Activity must be scheduled for a future date");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success("Activity created successfully!");
    navigate("/activities");
  };

  return (
    <div className="container py-8 max-w-2xl">
      {/* Back button */}
      <Link to="/activities" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to Activities
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-display">Create New Activity</CardTitle>
          <CardDescription>
            Organize something fun and invite fellow Harvard students to join!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Activity Title *</Label>
              <Input
                id="title"
                placeholder="e.g., CS50 Study Session, Pickup Basketball"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      <div>
                        <span className="font-medium">{cat.label}</span>
                        <span className="text-muted-foreground ml-2 text-xs">{cat.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Tell people what to expect, what to bring, skill level, etc."
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={4}
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location *
              </Label>
              <Input
                id="location"
                placeholder="e.g., Lamont Library B Level, MAC Gym, Science Center Plaza"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
              />
            </div>

            {/* Date and Time */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date *
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange("date", e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Time *
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleChange("time", e.target.value)}
                />
              </div>
            </div>

            {/* Max Size */}
            <div className="space-y-2">
              <Label htmlFor="maxSize" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Maximum Group Size *
              </Label>
              <Input
                id="maxSize"
                type="number"
                placeholder="e.g., 6"
                min="2"
                max="50"
                value={formData.maxSize}
                onChange={(e) => handleChange("maxSize", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">You'll automatically be added as a participant</p>
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" className="flex-1" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Activity"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
