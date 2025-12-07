import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CommunityGuidelines = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="font-display text-4xl font-bold text-foreground mb-8">Community Guidelines</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Our Community Values</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Harvard Huddle is built on the foundation of respect, inclusivity, and genuine connection. 
              These guidelines help ensure our community remains a welcoming space for all Harvard students.
            </p>
            <p className="text-muted-foreground">
              [Edit this section to customize your community values]
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Respectful Behavior</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Treat all members with respect and dignity</li>
              <li>Use inclusive language in all communications</li>
              <li>Be mindful of different backgrounds and perspectives</li>
              <li>No harassment, discrimination, or bullying of any kind</li>
            </ul>
            <p className="text-muted-foreground">
              [Edit this section to add more guidelines]
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Activity Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Create activities with accurate and honest descriptions</li>
              <li>Show up when you commit to an activity</li>
              <li>Notify organizers if you need to cancel</li>
              <li>Keep activities appropriate and safe for all participants</li>
            </ul>
            <p className="text-muted-foreground">
              [Edit this section to add more activity guidelines]
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Safety & Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Protect your personal information</li>
              <li>Meet in public, well-lit areas for first-time activities</li>
              <li>Report any suspicious or inappropriate behavior</li>
              <li>Respect the privacy of other community members</li>
            </ul>
            <p className="text-muted-foreground">
              [Edit this section to add safety guidelines]
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Enforcement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Violations of these guidelines may result in warnings, temporary suspension, or permanent removal 
              from Harvard Huddle. We reserve the right to take action to protect our community.
            </p>
            <p className="text-muted-foreground">
              [Edit this section to customize enforcement policies]
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CommunityGuidelines;
