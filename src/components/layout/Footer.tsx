import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-crimson flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold">H</span>
              </div>
              <span className="font-display text-lg font-semibold">
                Harvard Huddle
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Connecting Harvard students through shared activities and experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-sm">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/activities" className="hover:text-primary transition-colors">Browse Activities</Link></li>
              <li><Link to="/create" className="hover:text-primary transition-colors">Create Activity</Link></li>
              <li><Link to="/profile" className="hover:text-primary transition-colors">Your Profile</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4 text-sm">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link to="/guidelines" className="hover:text-primary transition-colors">Community Guidelines</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Harvard Huddle. Made with ❤️ for Harvard students.
          </p>
          <p className="text-xs text-muted-foreground">
            Not affiliated with Harvard University.
          </p>
        </div>
      </div>
    </footer>
  );
}
