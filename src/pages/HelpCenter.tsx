import { Link } from "react-router-dom";
import { ArrowLeft, HelpCircle, MessageCircle, Mail, FileQuestion } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HelpCenter() {
  return (
    <div className="container py-8 max-w-3xl">
      <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>

      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Help Center</h1>
          <p className="text-muted-foreground">
            Find answers to common questions and get support for Harvard Huddle.
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileQuestion className="h-5 w-5 text-primary" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-1">How do I create an activity?</h4>
                <p className="text-sm text-muted-foreground">
                  Click the "Create Activity" button in the navigation bar. Fill in the details about your activity including title, category, location, date/time, and maximum group size.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Can anyone join Harvard Huddle?</h4>
                <p className="text-sm text-muted-foreground">
                  Harvard Huddle is exclusively for Harvard students. You must sign up with a valid @harvard.edu or @college.harvard.edu email address.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1">How do I join an activity?</h4>
                <p className="text-sm text-muted-foreground">
                  Browse activities on the Activities page and click "Join" on any activity that interests you. You'll be added to the participant list and can chat with other members.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Can I leave an activity after joining?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes! You can leave any activity at any time by visiting the activity detail page and clicking "Leave Activity."
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                Contact Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Can't find what you're looking for? Reach out to our support team.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4" />
                <span>support@harvardhuddle.com</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
