/**
 * Activity Detail Page Component
 * Displays full details of a single activity including:
 * - Activity information (title, time, location, etc.)
 * - Participant list
 * - Join/leave functionality
 * - Activity chat/messaging
 */

import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  Send,
  Share2,
  Flag,
  Instagram
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { activitiesApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { ActivityCategory } from "@/lib/types";

// Category display labels mapping
const categoryLabels: Record<ActivityCategory, string> = {
  study: "Study",
  meal: "Meal",
  sports: "Sports",
  social: "Social",
  arts: "Arts",
  other: "Other",
};

export default function ActivityDetail() {
  // Get activity ID from URL params
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState("");

  // Fetch activity details with participants and messages
  const { data: activity, isLoading, error } = useQuery({
    queryKey: ['activity', id],
    queryFn: () => activitiesApi.getActivity(id!),
    enabled: !!id,
  });

  // Join activity mutation
  const joinMutation = useMutation({
    mutationFn: () => activitiesApi.joinActivity(id!),
    onSuccess: () => {
      // Refetch activity data to update participant list and count
      queryClient.invalidateQueries({ queryKey: ['activity', id] });
      toast.success("Joined activity!");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to join activity");
    }
  });

  // Leave activity mutation
  const leaveMutation = useMutation({
    mutationFn: () => activitiesApi.leaveActivity(id!),
    onSuccess: () => {
      // Refetch activity data to update participant list and count
      queryClient.invalidateQueries({ queryKey: ['activity', id] });
      toast.success("Left activity");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to leave activity");
    }
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: (content: string) => activitiesApi.sendMessage(id!, content),
    onSuccess: () => {
      // Refetch to show new message
      queryClient.invalidateQueries({ queryKey: ['activity', id] });
      setNewMessage(""); // Clear input field
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to send message");
    }
  });

  if (isLoading) {
    return (
      <div className="container py-8">
        <p className="text-muted-foreground">Loading activity...</p>
      </div>
    );
  }

  if (error || !activity) {
    return (
      <div className="container py-8">
        <p className="text-destructive">Activity not found</p>
        <Link to="/activities">
          <Button variant="soft" className="mt-4">Back to Activities</Button>
        </Link>
      </div>
    );
  }

  const isFull = activity.participant_count >= activity.max_size;
  const spotsLeft = activity.max_size - activity.participant_count;
  const isParticipant = activity.participants?.some(p => p.user_id === user?.id);
  const isOrganizer = activity.organizer_id === user?.id;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { 
      weekday: "long", 
      month: "long", 
      day: "numeric",
      year: "numeric"
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("en-US", { 
      hour: "numeric", 
      minute: "2-digit",
      hour12: true 
    });
  };

  const formatMessageTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("en-US", { 
      hour: "numeric", 
      minute: "2-digit",
      hour12: true 
    });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    sendMessageMutation.mutate(newMessage);
  };

  const handleJoin = () => joinMutation.mutate();
  const handleLeave = () => leaveMutation.mutate();

  return (
    <div className="container py-8">
      {/* Back button */}
      <Link to="/activities" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to Activities
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Activity header */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant={activity.category}>{categoryLabels[activity.category]}</Badge>
                    {isFull ? (
                      <Badge variant="full">Full</Badge>
                    ) : (
                      <Badge variant="active">{spotsLeft} spots left</Badge>
                    )}
                  </div>
                  <h1 className="text-2xl md:text-3xl font-display font-bold">{activity.title}</h1>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Flag className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">{activity.description}</p>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-secondary/30 rounded-xl">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">{formatDate(activity.datetime)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-secondary/30 rounded-xl">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-medium">{formatTime(activity.datetime)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-secondary/30 rounded-xl sm:col-span-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{activity.location}</p>
                  </div>
                </div>
              </div>

              {/* Join/Leave button */}
              {isOrganizer ? (
                <Button variant="secondary" className="w-full" disabled>
                  You're the organizer
                </Button>
              ) : isParticipant ? (
                <Button 
                  variant="secondary" 
                  className="w-full" 
                  onClick={handleLeave}
                  disabled={leaveMutation.isPending}
                >
                  {leaveMutation.isPending ? "Leaving..." : "Leave Activity"}
                </Button>
              ) : (
                <Button 
                  variant={isFull ? "secondary" : "default"} 
                  className="w-full" 
                  disabled={isFull || joinMutation.isPending}
                  onClick={handleJoin}
                >
                  {joinMutation.isPending ? "Joining..." : isFull ? "Activity is Full" : "Join Activity"}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Group Chat */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Group Chat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Messages */}
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {activity.messages && activity.messages.length > 0 ? (
                  activity.messages.map((message) => (
                    <div key={message.id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs bg-secondary">
                          {message.sender_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2">
                          <span className="font-medium text-sm">{message.sender_name}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatMessageTime(message.created_at)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{message.content}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No messages yet. Be the first to say hi!
                  </p>
                )}
              </div>

              {/* Message input */}
              {(isParticipant || isOrganizer) && (
                <div className="flex gap-2 pt-4 border-t">
                  <Input
                    placeholder="Send a message to the group..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <Button 
                    onClick={handleSendMessage} 
                    disabled={!newMessage.trim() || sendMessageMutation.isPending}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Organizer */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Organizer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={activity.organizer.profile_picture_url} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {activity.organizer.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{activity.organizer.name}</p>
                  <p className="text-sm text-muted-foreground">Activity Organizer</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Participants */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                Participants ({activity.participant_count}/{activity.max_size})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activity.participants && activity.participants.map((participant) => (
                  <div key={participant.id} className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={participant.profile_picture_url} />
                      <AvatarFallback className="text-xs bg-secondary">
                        {participant.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{participant.name}</span>
                    {participant.user_id === activity.organizer_id && (
                      <Badge variant="outline" className="ml-auto text-xs">Host</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
