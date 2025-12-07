import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

export interface Activity {
  id: string;
  title: string;
  category: "study" | "meal" | "sports" | "social" | "arts" | "other";
  description: string;
  location: string;
  datetime: string;
  maxSize: number;
  participantCount: number;
  organizer: {
    id: string;
    name: string;
    profilePictureUrl?: string;
  };
}

interface ActivityCardProps {
  activity: Activity;
}

const categoryLabels: Record<Activity["category"], string> = {
  study: "Study",
  meal: "Meal",
  sports: "Sports",
  social: "Social",
  arts: "Arts",
  other: "Other",
};

const categoryIcons: Record<Activity["category"], string> = {
  study: "📚",
  meal: "🍕",
  sports: "⚽",
  social: "🎉",
  arts: "🎨",
  other: "✨",
};

export function ActivityCard({ activity }: ActivityCardProps) {
  const isFull = activity.participantCount >= activity.maxSize;
  const spotsLeft = activity.maxSize - activity.participantCount;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { 
      weekday: "short", 
      month: "short", 
      day: "numeric" 
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

  return (
    <Card variant="interactive" className="group overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-lg">{categoryIcons[activity.category]}</span>
              <Badge variant={activity.category}>{categoryLabels[activity.category]}</Badge>
              {isFull && <Badge variant="full">Full</Badge>}
            </div>
            <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
              {activity.title}
            </h3>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pb-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {activity.description}
        </p>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4 text-primary/70" />
            <span>{formatDate(activity.datetime)}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4 text-primary/70" />
            <span>{formatTime(activity.datetime)}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground col-span-2">
            <MapPin className="h-4 w-4 text-primary/70" />
            <span className="truncate">{activity.location}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7 border-2 border-background">
              <AvatarImage src={activity.organizer.profilePictureUrl} />
              <AvatarFallback className="text-xs bg-secondary">
                {activity.organizer.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">
              by <span className="font-medium text-foreground">{activity.organizer.name}</span>
            </span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className={`text-sm font-medium ${isFull ? 'text-warning' : 'text-foreground'}`}>
              {activity.participantCount}/{activity.maxSize}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Link to={`/activities/${activity.id}`} className="w-full">
          <Button 
            variant={isFull ? "secondary" : "default"} 
            className="w-full group/btn"
          >
            <span>{isFull ? "View Details" : `Join • ${spotsLeft} spot${spotsLeft !== 1 ? 's' : ''} left`}</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
