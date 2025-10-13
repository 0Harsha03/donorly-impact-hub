import { useState } from "react";
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
import { ArrowLeft, Sparkles } from "lucide-react";

const campaignSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  cause: z.string().min(5, "Cause must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  targetAmount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Please enter a valid amount",
  }),
  image: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
});

type CampaignFormData = z.infer<typeof campaignSchema>;

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
  });

  const onSubmit = (data: CampaignFormData) => {
    setIsLoading(true);

    setTimeout(() => {
      // Save to localStorage
      const existingCampaigns = JSON.parse(localStorage.getItem("campaigns") || "[]");
      const newCampaign = {
        ...data,
        id: Date.now(),
        targetAmount: Number(data.targetAmount),
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem("campaigns", JSON.stringify([...existingCampaigns, newCampaign]));

      toast.success("🎉 Your campaign has been successfully launched!", {
        description: "Your campaign is now live and ready to receive donations.",
      });

      setIsLoading(false);
      reset();

      setTimeout(() => {
        navigate("/campaigns");
      }, 1500);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <div className="container mx-auto max-w-3xl py-8">
        <Button variant="ghost" onClick={() => navigate("/ngo-dashboard")} className="gap-2 mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>

        <Card className="shadow-xl">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-accent" />
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Launch New Campaign
              </CardTitle>
            </div>
            <CardDescription>Create a fundraising campaign to make a difference</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Campaign Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Help Build a School in Rural India"
                  {...register("title")}
                  className={errors.title ? "border-destructive" : ""}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cause">Cause / Short Reason *</Label>
                <Input
                  id="cause"
                  placeholder="e.g., Education for All"
                  {...register("cause")}
                  className={errors.cause ? "border-destructive" : ""}
                />
                {errors.cause && (
                  <p className="text-sm text-destructive">{errors.cause.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Detailed Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Tell your story and explain why this campaign matters..."
                  rows={6}
                  {...register("description")}
                  className={errors.description ? "border-destructive" : ""}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetAmount">Target Amount (₹) *</Label>
                <Input
                  id="targetAmount"
                  type="number"
                  placeholder="100000"
                  {...register("targetAmount")}
                  className={errors.targetAmount ? "border-destructive" : ""}
                />
                {errors.targetAmount && (
                  <p className="text-sm text-destructive">{errors.targetAmount.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Campaign Banner Image URL (optional)</Label>
                <Input
                  id="image"
                  type="url"
                  placeholder="https://example.com/campaign-image.jpg"
                  {...register("image")}
                  className={errors.image ? "border-destructive" : ""}
                />
                {errors.image && (
                  <p className="text-sm text-destructive">{errors.image.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? "Launching Campaign..." : "🚀 Launch Campaign"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateCampaign;
