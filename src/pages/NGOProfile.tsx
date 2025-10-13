import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Building2 } from "lucide-react";

const ngoProfileSchema = z.object({
  name: z.string().min(1, "NGO name is required"),
  ngoId: z.string().min(1, "NGO ID is required"),
  logo: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

type NGOProfileData = z.infer<typeof ngoProfileSchema>;

const NGOProfile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NGOProfileData>({
    resolver: zodResolver(ngoProfileSchema),
  });

  useEffect(() => {
    const savedProfile = localStorage.getItem("ngoProfile");
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      reset(profile);
      setIsEditing(true);
    }
  }, [reset]);

  const onSubmit = (data: NGOProfileData) => {
    setIsLoading(true);
    
    setTimeout(() => {
      localStorage.setItem("ngoProfile", JSON.stringify(data));
      toast.success(isEditing ? "Profile updated successfully!" : "Profile created successfully!");
      setIsLoading(false);
      navigate("/ngo-dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {isEditing ? "Edit NGO Profile" : "Set Up NGO Profile"}
            </CardTitle>
          </div>
          <CardDescription>
            {isEditing ? "Update your organization details" : "Tell us about your organization"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">NGO Name *</Label>
              <Input
                id="name"
                placeholder="Hope Foundation"
                {...register("name")}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ngoId">NGO ID / Registration Number *</Label>
              <Input
                id="ngoId"
                placeholder="NGO123456"
                {...register("ngoId")}
                className={errors.ngoId ? "border-destructive" : ""}
              />
              {errors.ngoId && (
                <p className="text-sm text-destructive">{errors.ngoId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo">Logo URL (optional)</Label>
              <Input
                id="logo"
                type="url"
                placeholder="https://example.com/logo.png"
                {...register("logo")}
                className={errors.logo ? "border-destructive" : ""}
              />
              {errors.logo && (
                <p className="text-sm text-destructive">{errors.logo.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mission Statement / Description *</Label>
              <Textarea
                id="description"
                placeholder="Our mission is to..."
                rows={5}
                {...register("description")}
                className={errors.description ? "border-destructive" : ""}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Saving..." : isEditing ? "Update Profile" : "Create Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NGOProfile;
