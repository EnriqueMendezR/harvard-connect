import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="font-display text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
        
        <p className="text-muted-foreground mb-8">
          Last updated: [Insert Date]
        </p>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Introduction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Harvard Huddle ("we," "our," or "us") is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
              when you use our platform.
            </p>
            <p className="text-muted-foreground">
              [Edit this section to customize your introduction]
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Information We Collect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h4 className="font-semibold text-foreground">Personal Information</h4>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Name and Harvard email address</li>
              <li>Profile information (year, concentration, dorm, interests)</li>
              <li>Instagram handle (optional)</li>
              <li>Profile pictures</li>
              <li>Activity participation history</li>
            </ul>
            <p className="text-muted-foreground">
              [Edit this section to list all data you collect]
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>To provide and maintain our service</li>
              <li>To match you with relevant activities</li>
              <li>To communicate with you about activities and updates</li>
              <li>To improve our platform and user experience</li>
            </ul>
            <p className="text-muted-foreground">
              [Edit this section to describe how you use data]
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Data Sharing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              We do not sell your personal information. Your profile information is visible to other 
              Harvard Huddle users as part of the activity-matching functionality.
            </p>
            <p className="text-muted-foreground">
              [Edit this section to describe your data sharing practices]
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Data Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              We implement appropriate technical and organizational measures to protect your personal 
              information against unauthorized access, alteration, disclosure, or destruction.
            </p>
            <p className="text-muted-foreground">
              [Edit this section to describe your security measures]
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Rights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Access your personal data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your account and data</li>
              <li>Object to processing of your data</li>
            </ul>
            <p className="text-muted-foreground">
              [Edit this section to describe user rights]
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              If you have questions about this Privacy Policy, please contact us at:
            </p>
            <p className="text-muted-foreground">
              [your-privacy-email@harvard.edu]
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
