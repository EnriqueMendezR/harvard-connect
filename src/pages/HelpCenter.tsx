import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const HelpCenter = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="font-display text-4xl font-bold text-foreground mb-8">Help Center</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Welcome to Harvard Huddle! This guide will help you get started with finding and creating activities on campus.
            </p>
            <p className="text-muted-foreground">
              [Edit this section to add your getting started content]
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>How do I create an activity?</AccordionTrigger>
                <AccordionContent>
                  [Edit this answer] Navigate to the Activities page and click the "Create Activity" button. Fill in the details and submit.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>How do I join an activity?</AccordionTrigger>
                <AccordionContent>
                  [Edit this answer] Browse activities on the Activities page, click on one you're interested in, and click "Join Activity".
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Can I cancel my participation?</AccordionTrigger>
                <AccordionContent>
                  [Edit this answer] Yes, go to the activity details and click "Leave Activity" to cancel your participation.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>How do I contact the organizer?</AccordionTrigger>
                <AccordionContent>
                  [Edit this answer] Use the activity chat feature to communicate with the organizer and other participants.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Support</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Need more help? Reach out to us:
            </p>
            <p className="text-muted-foreground">
              Email: [your-support-email@harvard.edu]
            </p>
            <p className="text-muted-foreground">
              [Edit this section to add your contact information]
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HelpCenter;
