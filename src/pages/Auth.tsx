import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Mail, Lock, ArrowLeft, AlertCircle, User, Instagram, GraduationCap, BookOpen, Home } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function Auth() {
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const [searchParams] = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(searchParams.get("mode") === "signup");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    year: "",
    concentration: "",
    dorm: "",
    instagram_handle: "",
  });

  const validateHarvardEmail = (email: string) => {
    return email.endsWith("@college.harvard.edu") || email.endsWith("@harvard.edu");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate email
    if (!validateHarvardEmail(formData.email)) {
      setError("Please use your Harvard email address (@college.harvard.edu or @harvard.edu)");
      return;
    }

    // Validate password
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (isSignUp) {
      if (!formData.name.trim()) {
        setError("Please enter your name");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        await signup({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          year: formData.year,
          concentration: formData.concentration,
          dorm: formData.dorm,
          instagram_handle: formData.instagram_handle,
        });
        toast.success("Account created successfully!");
        navigate("/activities");
      } else {
        await login({
          email: formData.email,
          password: formData.password,
        });
        toast.success("Welcome back!");
        navigate("/activities");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-warm">
      <div className="w-full max-w-md">
        {/* Back to home */}
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <Card className="shadow-xl">
          <CardHeader className="text-center pb-2">
            <div className="h-12 w-12 rounded-xl bg-gradient-crimson flex items-center justify-center mx-auto mb-4 shadow-crimson">
              <span className="text-primary-foreground font-display font-bold text-xl">H</span>
            </div>
            <CardTitle className="text-2xl font-display">
              {isSignUp ? "Join Harvard Huddle" : "Welcome Back"}
            </CardTitle>
            <CardDescription>
              {isSignUp 
                ? "Create your account with your Harvard email" 
                : "Sign in to continue to Harvard Huddle"
              }
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error message */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Name (sign up only) */}
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Harvard Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@college.harvard.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Confirm Password (sign up only) */}
              {isSignUp && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <Separator />
                  <p className="text-sm text-muted-foreground">Optional profile info (you can add later)</p>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="year">Year</Label>
                      <div className="relative">
                        <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="year"
                          placeholder="2027"
                          value={formData.year}
                          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dorm">Dorm</Label>
                      <div className="relative">
                        <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="dorm"
                          placeholder="Adams House"
                          value={formData.dorm}
                          onChange={(e) => setFormData({ ...formData, dorm: e.target.value })}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="concentration">Concentration</Label>
                    <div className="relative">
                      <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="concentration"
                        placeholder="Computer Science"
                        value={formData.concentration}
                        onChange={(e) => setFormData({ ...formData, concentration: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram Handle</Label>
                    <div className="relative">
                      <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="instagram"
                        placeholder="your_handle"
                        value={formData.instagram_handle}
                        onChange={(e) => setFormData({ ...formData, instagram_handle: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Submit button */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading 
                  ? (isSignUp ? "Creating account..." : "Signing in...") 
                  : (isSignUp ? "Create Account" : "Sign In")
                }
              </Button>
            </form>

            <Separator className="my-6" />

            {/* Toggle between sign in and sign up */}
            <div className="text-center text-sm">
              {isSignUp ? (
                <p className="text-muted-foreground">
                  Already have an account?{" "}
                  <button 
                    className="text-primary font-medium hover:underline"
                    onClick={() => setIsSignUp(false)}
                  >
                    Sign in
                  </button>
                </p>
              ) : (
                <p className="text-muted-foreground">
                  Don't have an account?{" "}
                  <button 
                    className="text-primary font-medium hover:underline"
                    onClick={() => setIsSignUp(true)}
                  >
                    Sign up
                  </button>
                </p>
              )}
            </div>

            {/* Harvard email note */}
            <p className="text-xs text-muted-foreground text-center mt-4">
              Only Harvard students with valid @harvard.edu or @college.harvard.edu emails can join.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
