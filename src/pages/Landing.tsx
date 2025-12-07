import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Users, 
  Calendar, 
  MessageCircle, 
  Sparkles, 
  ArrowRight,
  BookOpen,
  Utensils,
  Trophy,
  Music
} from "lucide-react";

export default function Landing() {
  const features = [
    {
      icon: Calendar,
      title: "Create & Join Activities",
      description: "Organize study sessions, pickup games, meals, and more. Set the details and watch your group fill up."
    },
    {
      icon: Users,
      title: "Build Your Community",
      description: "Connect with classmates who share your interests. Make friends naturally through shared experiences."
    },
    {
      icon: MessageCircle,
      title: "Coordinate Easily",
      description: "Chat with your group, share updates, and stay in sync. Everything you need in one place."
    },
    {
      icon: Sparkles,
      title: "AI Recommendations",
      description: "Get personalized activity suggestions based on your interests and past participation."
    }
  ];

  const categories = [
    { icon: BookOpen, label: "Study Groups", color: "bg-blue-100 text-blue-700" },
    { icon: Utensils, label: "Meal Buddies", color: "bg-orange-100 text-orange-700" },
    { icon: Trophy, label: "Sports & Fitness", color: "bg-green-100 text-green-700" },
    { icon: Music, label: "Social Events", color: "bg-purple-100 text-purple-700" },
  ];

  const stats = [
    { value: "500+", label: "Active Students" },
    { value: "1,200+", label: "Activities Created" },
    { value: "98%", label: "Found New Friends" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero text-primary-foreground">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-foreground/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gold/20 rounded-full blur-3xl" />
        </div>

        <div className="container relative py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-in">
            <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-none px-4 py-1.5">
              For Harvard Students Only
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-tight">
              Find Your{" "}
              <span className="relative">
                <span className="relative z-10">Crew</span>
                <span className="absolute bottom-2 left-0 right-0 h-3 bg-gold/40 -z-0" />
              </span>
              {" "}at Harvard
            </h1>
            
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Join study groups, grab meals, play sports, and make real connections. 
              Harvard Huddle makes it easy to find students who want to hang out — no awkward DMs required.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/auth?mode=signup">
                <Button variant="gold" size="xl" className="w-full sm:w-auto">
                  Sign Up with Harvard Email
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="heroOutline" size="xl" className="w-full sm:w-auto">
                  I Already Have an Account
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
              className="fill-background"
            />
          </svg>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="container py-12 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category, i) => (
            <Card 
              key={category.label} 
              variant="elevated" 
              className="animate-slide-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`p-3 rounded-xl ${category.color}`}>
                  <category.icon className="h-6 w-6" />
                </div>
                <span className="font-semibold">{category.label}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-20 md:py-28">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Everything You Need to{" "}
            <span className="text-primary">Connect</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Harvard Huddle removes the friction from making friends. Focus on the fun parts.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, i) => (
            <Card 
              key={feature.title} 
              variant="interactive"
              className="animate-slide-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <CardContent className="p-8">
                <div className="flex gap-5">
                  <div className="p-3 rounded-xl bg-primary/10 h-fit">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-secondary/50 py-16">
        <div className="container">
          <div className="grid grid-cols-3 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label} className="space-y-2">
                <p className="text-3xl md:text-5xl font-display font-bold text-primary">{stat.value}</p>
                <p className="text-sm md:text-base text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20 md:py-28">
        <Card variant="glass" className="bg-gradient-crimson text-primary-foreground overflow-hidden">
          <CardContent className="p-8 md:p-16 text-center relative">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary-foreground/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-gold/20 rounded-full blur-2xl" />
            </div>
            
            <div className="relative space-y-6 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-display font-bold">
                Ready to Find Your People?
              </h2>
              <p className="text-lg text-primary-foreground/80">
                Join hundreds of Harvard students already making connections through shared activities.
              </p>
              <Link to="/auth?mode=signup">
                <Button variant="gold" size="xl">
                  Get Started Now
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
