import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Camera, 
  Edit2, 
  Save, 
  X, 
  Calendar, 
  BookOpen,
  GraduationCap,
  Home,
  Sparkles,
  TrendingUp,
  Instagram
} from "lucide-react";
import { ActivityCard } from "@/components/activities/ActivityCard";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { activitiesApi } from "@/lib/api";
import type { Activity } from "@/lib/types";

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || "",
    year: user?.year || "",
    concentration: user?.concentration || "",
    dorm: user?.dorm || "",
    interests: user?.interests || [],
    instagram_handle: user?.instagram_handle || "",
  });
  const [newInterest, setNewInterest] = useState("");

  // Fetch activities for recommendations (in real app, filter by user)
  const { data: allActivities = [] } = useQuery({
    queryKey: ['activities'],
    queryFn: () => activitiesApi.getActivities(),
  });

  // For demo, show some activities as "recommended" and "joined"
  const recommendedActivities = allActivities.slice(0, 2);
  const joinedActivities = allActivities.slice(2, 4);
  const createdActivities = allActivities.filter(a => a.organizer_id === user?.id);

  const handleSave = async () => {
    try {
      await updateProfile(editForm);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleCancel = () => {
    setEditForm({
      name: user?.name || "",
      year: user?.year || "",
      concentration: user?.concentration || "",
      dorm: user?.dorm || "",
      interests: user?.interests || [],
      instagram_handle: user?.instagram_handle || "",
    });
    setIsEditing(false);
  };

  const addInterest = () => {
    if (newInterest.trim() && !editForm.interests.includes(newInterest.trim().toLowerCase())) {
      setEditForm(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim().toLowerCase()]
      }));
      setNewInterest("");
    }
  };

  const removeInterest = (interest: string) => {
    setEditForm(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  if (!user) {
    return (
      <div className="container py-8 text-center">
        <p className="text-muted-foreground">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-5xl">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                {/* Avatar */}
                <div className="relative inline-block">
                  <Avatar className="h-28 w-28 mx-auto border-4 border-background shadow-lg">
                    <AvatarImage src={user.profile_picture_url} />
                    <AvatarFallback className="text-3xl bg-primary/10 text-primary font-display">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-md hover:bg-primary/90 transition-colors">
                      <Camera className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Name & Email */}
                <div>
                  <h2 className="text-2xl font-display font-bold">{user.name}</h2>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>

                {/* Edit Button */}
                {!isEditing ? (
                  <Button variant="soft" className="w-full" onClick={() => setIsEditing(true)}>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={handleCancel}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button className="flex-1" onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>
                )}
              </div>

              {/* Profile Details */}
              <div className="mt-8 space-y-4">
              {isEditing ? (
                  <>
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input 
                        value={editForm.name} 
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                        placeholder="Your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Year</Label>
                      <Input 
                        value={editForm.year} 
                        onChange={(e) => setEditForm({...editForm, year: e.target.value})}
                        placeholder="e.g., 2027"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Concentration</Label>
                      <Input 
                        value={editForm.concentration} 
                        onChange={(e) => setEditForm({...editForm, concentration: e.target.value})}
                        placeholder="e.g., Computer Science"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Dorm</Label>
                      <Input 
                        value={editForm.dorm} 
                        onChange={(e) => setEditForm({...editForm, dorm: e.target.value})}
                        placeholder="e.g., Adams House"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Instagram Handle</Label>
                      <Input 
                        value={editForm.instagram_handle} 
                        onChange={(e) => setEditForm({...editForm, instagram_handle: e.target.value})}
                        placeholder="e.g., your_handle"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Interests</Label>
                      <div className="flex gap-2">
                        <Input 
                          value={newInterest}
                          onChange={(e) => setNewInterest(e.target.value)}
                          placeholder="Add interest"
                          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addInterest())}
                        />
                        <Button type="button" variant="secondary" onClick={addInterest}>Add</Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {editForm.interests.map((interest) => (
                          <Badge key={interest} variant="secondary" className="cursor-pointer hover:bg-destructive/20" onClick={() => removeInterest(interest)}>
                            {interest}
                            <X className="h-3 w-3 ml-1" />
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                      <GraduationCap className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Class Year</p>
                        <p className="font-medium">{user.year || "Not set"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Concentration</p>
                        <p className="font-medium">{user.concentration || "Not set"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                      <Home className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Dorm</p>
                        <p className="font-medium">{user.dorm || "Not set"}</p>
                      </div>
                    </div>
                    {user.instagram_handle && (
                      <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                        <Instagram className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">Instagram</p>
                          <p className="font-medium">@{user.instagram_handle}</p>
                        </div>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Interests</p>
                      <div className="flex flex-wrap gap-2">
                        {user.interests && user.interests.length > 0 ? (
                          user.interests.map((interest) => (
                            <Badge key={interest} variant="secondary">{interest}</Badge>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No interests added</p>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity History & Recommendations */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="recommendations" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="recommendations" className="gap-2">
                <Sparkles className="h-4 w-4" />
                For You
              </TabsTrigger>
              <TabsTrigger value="created" className="gap-2">
                <Calendar className="h-4 w-4" />
                Created
              </TabsTrigger>
              <TabsTrigger value="joined" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                Joined
              </TabsTrigger>
            </TabsList>

            <TabsContent value="recommendations" className="mt-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold">Recommended for You</h3>
                <p className="text-sm text-muted-foreground">Based on your interests and activity history</p>
              </div>
              {recommendedActivities.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {recommendedActivities.map((activity) => (
                    <ActivityCard key={activity.id} activity={activity} />
                  ))}
                </div>
              ) : (
                <Card className="bg-secondary/20">
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">No recommendations yet. Join some activities to get personalized suggestions!</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="created" className="mt-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold">Activities You Created</h3>
                <p className="text-sm text-muted-foreground">Manage and track your organized activities</p>
              </div>
              {createdActivities.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {createdActivities.map((activity) => (
                    <ActivityCard key={activity.id} activity={activity} />
                  ))}
                </div>
              ) : (
                <Card className="bg-secondary/20">
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">You haven't created any activities yet</p>
                    <Button variant="soft" className="mt-4" asChild>
                      <a href="/create">Create Your First Activity</a>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="joined" className="mt-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold">Activities You Joined</h3>
                <p className="text-sm text-muted-foreground">Your upcoming and past activities</p>
              </div>
              {joinedActivities.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {joinedActivities.map((activity) => (
                    <ActivityCard key={activity.id} activity={activity} />
                  ))}
                </div>
              ) : (
                <Card className="bg-secondary/20">
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">You haven't joined any activities yet</p>
                    <Button variant="soft" className="mt-4" asChild>
                      <a href="/activities">Browse Activities</a>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
