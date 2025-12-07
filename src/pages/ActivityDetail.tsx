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
  Flag
} from "lucide-react";
import { Activity } from "@/components/activities/ActivityCard";

// Mock activity data
const mockActivity: Activity & { 
  participants: Array<{ id: string; name: string; profilePictureUrl?: string }>;
  messages: Array<{ id: string; senderId: string; senderName: string; content: string; createdAt: string }>;
} = {
  id: "1",
  title: "CS50 Problem Set Study Session",
  category: "study",
  description: "Working through this week's problem set together. All skill levels welcome - we can help each other out! We'll be focusing on the data structures section and helping each other debug. Bring your laptop and any questions you have.",
  location: "Lamont Library, B Level, Study Room 4",
  datetime: "2024-12-08T14:00:00",
  maxSize: 6,
  participantCount: 4,
  organizer: { id: "u1", name: "Sarah Chen", profilePictureUrl: "" },
  participants: [
    { id: "u1", name: "Sarah Chen" },
    { id: "u2", name: "Marcus Johnson" },
    { id: "u3", name: "Emily Park" },
    { id: "u4", name: "David Kim" },
  ],
  messages: [
    { id: "m1", senderId: "u1", senderName: "Sarah Chen", content: "Hey everyone! Looking forward to the session. I'll bring some snacks 🍪", createdAt: "2024-12-07T10:30:00" },
    { id: "m2", senderId: "u2", senderName: "Marcus Johnson", content: "Awesome! I'm stuck on problem 3, hoping we can work through it together", createdAt: "2024-12-07T11:15:00" },
    { id: "m3", senderId: "u3", senderName: "Emily Park", content: "I finished problem 3 - happy to help! 😊", createdAt: "2024-12-07T14:00:00" },
  ]
};

const categoryLabels: Record<string, string> = {
  study: "Study",
  meal: "Meal",
  sports: "Sports",
  social: "Social",
  arts: "Arts",
  other: "Other",
};

export default function ActivityDetail() {
  const { id } = useParams();
  const [newMessage, setNewMessage] = useState("");
  const [isJoined, setIsJoined] = useState(false);

  const activity = mockActivity; // In real app, fetch by id
  const isFull = activity.participantCount >= activity.maxSize;
  const spotsLeft = activity.maxSize - activity.participantCount;

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
    // In real app, send to backend
    console.log("Sending message:", newMessage);
    setNewMessage("");
  };

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
                    <Badge variant={activity.category as any}>{categoryLabels[activity.category]}</Badge>
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
              {isJoined ? (
                <Button variant="secondary" className="w-full" onClick={() => setIsJoined(false)}>
                  Leave Activity
                </Button>
              ) : (
                <Button 
                  variant={isFull ? "secondary" : "default"} 
                  className="w-full" 
                  disabled={isFull}
                  onClick={() => setIsJoined(true)}
                >
                  {isFull ? "Activity is Full" : "Join Activity"}
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
                {activity.messages.map((message) => (
                  <div key={message.id} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs bg-secondary">
                        {message.senderName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2">
                        <span className="font-medium text-sm">{message.senderName}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatMessageTime(message.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message input */}
              <div className="flex gap-2 pt-4 border-t">
                <Input
                  placeholder="Send a message to the group..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
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
                  <AvatarImage src={activity.organizer.profilePictureUrl} />
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
                Participants ({activity.participantCount}/{activity.maxSize})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activity.participants.map((participant) => (
                  <div key={participant.id} className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={participant.profilePictureUrl} />
                      <AvatarFallback className="text-xs bg-secondary">
                        {participant.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{participant.name}</span>
                    {participant.id === activity.organizer.id && (
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
