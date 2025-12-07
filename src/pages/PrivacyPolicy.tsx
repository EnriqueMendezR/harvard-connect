import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="container py-8 max-w-3xl">
      <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>

      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground">
            Last updated: December 2024
          </p>
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h2>1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us, including:
          </p>
          <ul>
            <li>Account information (name, email, profile picture)</li>
            <li>Profile information (year, concentration, dorm, interests, Instagram handle)</li>
            <li>Activity data (activities created, joined, and messages sent)</li>
            <li>Usage data (how you interact with the platform)</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>
            We use the information we collect to:
          </p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Connect you with other Harvard students through activities</li>
            <li>Send you notifications about activities you've joined</li>
            <li>Personalize activity recommendations</li>
            <li>Ensure safety and security of the platform</li>
          </ul>

          <h2>3. Information Sharing</h2>
          <p>
            Your profile information and activities are visible to other Harvard Huddle users. We do not sell your personal information to third parties. We may share information:
          </p>
          <ul>
            <li>With your consent</li>
            <li>To comply with legal obligations</li>
            <li>To protect the safety of our users</li>
          </ul>

          <h2>4. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.
          </p>

          <h2>5. Your Rights</h2>
          <p>
            You can:
          </p>
          <ul>
            <li>Access and update your profile information at any time</li>
            <li>Delete your account and associated data</li>
            <li>Request a copy of your data</li>
          </ul>

          <h2>6. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us at privacy@harvardhuddle.com.
          </p>
        </div>
      </div>
    </div>
  );
}
