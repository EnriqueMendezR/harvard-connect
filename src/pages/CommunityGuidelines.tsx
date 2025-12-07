import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function CommunityGuidelines() {
  return (
    <div className="container py-8 max-w-3xl">
      <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>

      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Community Guidelines</h1>
          <p className="text-muted-foreground">
            Guidelines for being a great member of the Harvard Huddle community.
          </p>
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h2>1. Be Respectful</h2>
          <p>
            Treat all members with respect and kindness. Harvard Huddle is a community built on mutual respect and shared experiences. Harassment, discrimination, or bullying of any kind will not be tolerated.
          </p>

          <h2>2. Be Honest</h2>
          <p>
            Provide accurate information about yourself and your activities. Misrepresenting who you are or what an activity entails undermines trust in our community.
          </p>

          <h2>3. Show Up</h2>
          <p>
            When you commit to an activity, show up! If you can't make it, leave the activity with enough notice so others can plan accordingly. Repeated no-shows may result in account restrictions.
          </p>

          <h2>4. Keep It Safe</h2>
          <p>
            Prioritize safety in all activities. Meet in public spaces when possible, especially for first-time meetings. Report any concerning behavior to our support team.
          </p>

          <h2>5. Be Inclusive</h2>
          <p>
            Welcome everyone to your activities unless there's a genuine reason for restrictions (like skill level requirements). Harvard Huddle is about building community across all backgrounds.
          </p>

          <h2>6. Communicate Clearly</h2>
          <p>
            Use the group chat to coordinate and keep everyone informed. If plans change, update the activity details or message participants promptly.
          </p>

          <h2>7. Report Issues</h2>
          <p>
            If you encounter inappropriate behavior, harassment, or any violations of these guidelines, please report it to our support team immediately. We take all reports seriously.
          </p>

          <h2>Consequences</h2>
          <p>
            Violations of these guidelines may result in warnings, temporary suspensions, or permanent removal from Harvard Huddle, depending on the severity and frequency of the violations.
          </p>
        </div>
      </div>
    </div>
  );
}
