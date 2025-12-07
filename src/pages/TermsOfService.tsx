import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="font-display text-4xl font-bold text-foreground mb-8">Terms of Service</h1>
        
        <p className="text-muted-foreground mb-8">
          Last updated: [Insert Date]
        </p>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>1. Acceptance of Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              By accessing or using Harvard Huddle, you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our platform.
            </p>
            <p className="text-muted-foreground">
              [Edit this section to customize acceptance terms]
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>2. Eligibility</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Harvard Huddle is exclusively for Harvard University students, faculty, and staff with 
              valid Harvard email addresses (@college.harvard.edu or @harvard.edu).
            </p>
            <p className="text-muted-foreground">
              [Edit this section to define eligibility requirements]
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>3. User Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>You are responsible for maintaining the confidentiality of your account</li>
              <li>You agree to provide accurate and complete information</li>
              <li>You may not share your account with others</li>
              <li>You must notify us immediately of any unauthorized use</li>
            </ul>
            <p className="text-muted-foreground">
              [Edit this section to customize account terms]
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>4. Acceptable Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              You agree not to use Harvard Huddle to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Violate any applicable laws or regulations</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Post false, misleading, or fraudulent content</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use the platform for commercial purposes without permission</li>
            </ul>
            <p className="text-muted-foreground">
              [Edit this section to define acceptable use]
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>5. Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              You retain ownership of content you post. By posting content, you grant Harvard Huddle 
              a license to use, display, and distribute that content within our platform.
            </p>
            <p className="text-muted-foreground">
              [Edit this section to define content rights]
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>6. Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Harvard Huddle is provided "as is" without warranties of any kind. We are not responsible 
              for any damages arising from your use of the platform or interactions with other users.
            </p>
            <p className="text-muted-foreground">
              [Edit this section to define liability limitations]
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>7. Termination</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              We reserve the right to suspend or terminate your account at any time for violations 
              of these terms or our Community Guidelines.
            </p>
            <p className="text-muted-foreground">
              [Edit this section to define termination policies]
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              For questions about these Terms of Service, please contact us at:
            </p>
            <p className="text-muted-foreground">
              [your-legal-email@harvard.edu]
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsOfService;
