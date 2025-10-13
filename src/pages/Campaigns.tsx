import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Target, PlusCircle } from "lucide-react";

interface Campaign {
  id: number;
  title: string;
  cause: string;
  description: string;
  targetAmount: number;
  image?: string;
  createdAt: string;
}

const Campaigns = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const userType = localStorage.getItem("userType");

  useEffect(() => {
    const savedCampaigns = JSON.parse(localStorage.getItem("campaigns") || "[]");
    setCampaigns(savedCampaigns.sort((a: Campaign, b: Campaign) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto p-4 md:p-8">
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
          {userType === "ngo" && (
            <Button onClick={() => navigate("/create-campaign")} className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Launch New Campaign
            </Button>
          )}
        </div>

        <Card className="mb-8 shadow-xl border-primary/10">
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              <Target className="h-8 w-8 text-accent" />
              All Campaigns
            </CardTitle>
            <CardDescription>
              Explore and support campaigns making a difference in communities
            </CardDescription>
          </CardHeader>
        </Card>

        {campaigns.length === 0 ? (
          <Card className="p-12 text-center">
            <Target className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No campaigns yet</h3>
            <p className="text-muted-foreground mb-4">
              {userType === "ngo" 
                ? "Be the first to create a campaign and start making an impact!" 
                : "Check back soon for new campaigns to support!"}
            </p>
            {userType === "ngo" && (
              <Button onClick={() => navigate("/create-campaign")}>Create First Campaign</Button>
            )}
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign) => (
              <Card 
                key={campaign.id} 
                className="hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in overflow-hidden"
              >
                {campaign.image && (
                  <div className="relative h-48 w-full overflow-hidden">
                    <img 
                      src={campaign.image} 
                      alt={campaign.title} 
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" 
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="line-clamp-2">{campaign.title}</CardTitle>
                  <CardDescription className="line-clamp-1 flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    {campaign.cause}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {campaign.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-baseline">
                      <span className="text-sm text-muted-foreground">Goal</span>
                      <span className="text-xl font-bold text-primary">
                        ₹{campaign.targetAmount.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="w-full bg-secondary h-3 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500" 
                        style={{ width: '0%' }}
                      />
                    </div>
                    
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>₹0 raised</span>
                      <span>0% funded</span>
                    </div>
                  </div>

                  <Button className="w-full" variant="default">
                    Support This Campaign
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Campaigns;
