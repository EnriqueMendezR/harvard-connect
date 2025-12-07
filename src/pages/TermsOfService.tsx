import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="container py-8 max-w-3xl">
      <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>

      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Terms of Service</h1>
          <p className="text-muted-foreground">
            Last updated: December 2024
          </p>
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using Harvard Huddle, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this service.
          </p>

          <h2>2. Eligibility</h2>
          <p>
            Harvard Huddle is exclusively for current Harvard University students, faculty, and staff with valid Harvard email addresses (@harvard.edu or @college.harvard.edu). By using this service, you represent that you are affiliated with Harvard University.
          </p>

          <h2>3. User Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.
          </p>

          <h2>4. User Conduct</h2>
          <p>
            You agree not to:
          </p>
          <ul>
            <li>Use the service for any illegal purposes</li>
            <li>Harass, abuse, or harm other users</li>
            <li>Post false or misleading information</li>
            <li>Attempt to gain unauthorized access to other accounts</li>
            <li>Use the service to spam or advertise without permission</li>
          </ul>

          <h2>5. Activities and Content</h2>
          <p>
            Users are solely responsible for the activities they create and the content they post. Harvard Huddle does not endorse or verify user-created activities. Participate at your own risk and exercise reasonable caution.
          </p>

          <h2>6. Intellectual Property</h2>
          <p>
            The service and its original content, features, and functionality are owned by Harvard Huddle and are protected by copyright, trademark, and other intellectual property laws.
          </p>

          <h2>7. Disclaimer</h2>
          <p>
            Harvard Huddle is provided "as is" without any warranties, expressed or implied. We do not guarantee that the service will be uninterrupted, secure, or error-free.
          </p>

          <h2>8. Limitation of Liability</h2>
          <p>
            Harvard Huddle shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.
          </p>

          <h2>9. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.
          </p>

          <h2>10. Contact</h2>
          <p>
            For questions about these Terms of Service, please contact us at legal@harvardhuddle.com.
          </p>
        </div>
      </div>
    </div>
  );
}
