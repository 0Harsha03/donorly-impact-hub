import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Building2, PlusCircle, Edit, Target } from "lucide-react";
import { useEffect, useState } from "react";

interface NGOProfile {
  name: string;
  ngoId: string;
  logo?: string;
  description: string;
}

interface Campaign {
  id: number;
  title: string;
  cause: string;
  description: string;
  targetAmount: number;
  image?: string;
  createdAt: string;
}

const NGODashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<NGOProfile | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    const savedProfile = localStorage.getItem("ngoProfile");
    if (!savedProfile) {
      navigate("/ngo-profile");
      return;
    }
    setProfile(JSON.parse(savedProfile));

    const savedCampaigns = JSON.parse(localStorage.getItem("campaigns") || "[]");
    setCampaigns(savedCampaigns);
  }, [navigate]);

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto p-4 md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
          <Button variant="outline" onClick={() => navigate("/ngo-profile")} className="gap-2">
            <Edit className="h-4 w-4" />
            Edit Profile
          </Button>
        </div>

        <Card className="mb-8 shadow-xl border-primary/10">
          <CardHeader className="flex flex-row items-start gap-4">
            {profile.logo ? (
              <img src={profile.logo} alt={profile.name} className="h-16 w-16 rounded-lg object-cover" />
            ) : (
              <Building2 className="h-16 w-16 text-primary" />
            )}
            <div className="flex-1">
              <CardTitle className="text-3xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Welcome back, {profile.name}!
              </CardTitle>
              <CardDescription className="mt-2">
                <span className="font-semibold">NGO ID:</span> {profile.ngoId}
              </CardDescription>
              <p className="mt-3 text-sm text-muted-foreground">{profile.description}</p>
            </div>
          </CardHeader>
        </Card>

        <div className="grid gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Target className="h-6 w-6 text-accent" />
              Your Campaigns ({campaigns.length})
            </h2>
            <Button onClick={() => navigate("/create-campaign")} className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Launch New Campaign
            </Button>
          </div>

          {campaigns.length === 0 ? (
            <Card className="p-12 text-center">
              <Target className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No campaigns yet</h3>
              <p className="text-muted-foreground mb-4">Create your first campaign to start raising funds!</p>
              <Button onClick={() => navigate("/create-campaign")}>Create Campaign</Button>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {campaigns.map((campaign) => (
                <Card key={campaign.id} className="hover:shadow-lg transition-shadow animate-fade-in">
                  {campaign.image && (
                    <img src={campaign.image} alt={campaign.title} className="w-full h-48 object-cover rounded-t-lg" />
                  )}
                  <CardHeader>
                    <CardTitle className="line-clamp-1">{campaign.title}</CardTitle>
                    <CardDescription className="line-clamp-1">{campaign.cause}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">{campaign.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Target:</span>
                        <span className="font-semibold">₹{campaign.targetAmount.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-accent w-0" />
                      </div>
                      <p className="text-xs text-muted-foreground">₹0 raised of ₹{campaign.targetAmount.toLocaleString()}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <Button variant="outline" onClick={() => navigate("/campaigns")} className="w-full mt-4">
            View All Campaigns
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NGODashboard;
