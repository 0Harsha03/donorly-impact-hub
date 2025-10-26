import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import ImageCarousel from "@/components/ImageCarousel";
import TopBanner from "@/components/TopBanner";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<"donor" | "ngo">("donor");

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // Check user role and redirect
        checkUserRoleAndRedirect();
      }
    });
  }, []);

  const checkUserRoleAndRedirect = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (roles?.role === "donor") {
      navigate("/donor-dashboard");
    } else if (roles?.role === "ngo") {
      // Check if NGO profile exists
      const { data: ngoProfile } = await supabase
        .from("ngos")
        .select("id")
        .eq("user_id", user.id)
        .single();
      
      navigate(ngoProfile ? "/ngo-dashboard" : "/ngo-profile");
    }
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      setIsLoading(false);
      return;
    }

    toast.success("Welcome back!");
    await checkUserRoleAndRedirect();
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const phone = formData.get("phone") as string;
    const location = formData.get("location") as string;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      toast.error(error.message);
      setIsLoading(false);
      return;
    }

    if (!data.user) {
      toast.error("Failed to create account");
      setIsLoading(false);
      return;
    }

    // Create profile
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: data.user.id,
        full_name: fullName,
        email,
        phone_number: phone,
        location,
      });

    if (profileError) {
      toast.error("Failed to create profile: " + profileError.message);
      setIsLoading(false);
      return;
    }

    // Create user role
    const { error: roleError } = await supabase
      .from("user_roles")
      .insert({
        user_id: data.user.id,
        role: userType,
      });

    if (roleError) {
      toast.error("Failed to set user role: " + roleError.message);
      setIsLoading(false);
      return;
    }

    toast.success("Account created successfully!");
    
    if (userType === "donor") {
      navigate("/donor-dashboard");
    } else {
      navigate("/ngo-profile");
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <TopBanner />
      <div className="flex items-center justify-center p-4 py-12">
        <Card className="w-full max-w-md shadow-xl">
          <CardContent className="pt-6">
            <ImageCarousel />
          </CardContent>
          <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Welcome to Donorly
          </CardTitle>
          <CardDescription className="text-center">
            Sign in or create an account to start making an impact
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-6">
            <Label>I am a:</Label>
            <RadioGroup value={userType} onValueChange={(value) => setUserType(value as "donor" | "ngo")}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="donor" id="donor" />
                <Label htmlFor="donor" className="cursor-pointer">Donor</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ngo" id="ngo" />
                <Label htmlFor="ngo" className="cursor-pointer">NGO / Organization</Label>
              </div>
            </RadioGroup>
          </div>

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    name="email"
                    type="email"
                    placeholder="donor@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full transform transition-transform duration-200 hover:scale-105 active:scale-95" 
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    name="fullName"
                    type="text"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    name="email"
                    type="email"
                    placeholder="donor@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-phone">Phone Number</Label>
                  <Input
                    id="signup-phone"
                    name="phone"
                    type="tel"
                    placeholder="+91 1234567890"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-location">Location (City/District)</Label>
                  <Input
                    id="signup-location"
                    name="location"
                    type="text"
                    placeholder="Mumbai, Maharashtra"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    minLength={8}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full transform transition-transform duration-200 hover:scale-105 active:scale-95" 
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
