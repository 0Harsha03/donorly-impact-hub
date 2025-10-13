import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Package, MapPin, Calendar } from "lucide-react";
import { useEffect, useState } from "react";

interface Donation {
  id: number;
  donationType: string;
  description: string;
  location: string;
  quantity?: string;
  date: string;
  coordinates?: { lat: number; lng: number } | null;
}

const DonorDashboard = () => {
  const navigate = useNavigate();
  const [donations, setDonations] = useState<Donation[]>([]);

  useEffect(() => {
    const savedDonations = JSON.parse(localStorage.getItem("donationData") || "[]");
    setDonations(savedDonations);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto p-4 md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
          <Button onClick={() => navigate("/donate")} className="gap-2">
            <Package className="h-4 w-4" />
            New Donation
          </Button>
        </div>

        <Card className="mb-8 shadow-xl border-primary/10">
          <CardHeader>
            <CardTitle className="text-3xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Donor Dashboard
            </CardTitle>
            <CardDescription>Welcome back! Here are your donation contributions.</CardDescription>
          </CardHeader>
        </Card>

        <div className="grid gap-6">
          <h2 className="text-2xl font-semibold">Your Donations ({donations.length})</h2>
          
          {donations.length === 0 ? (
            <Card className="p-12 text-center">
              <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No donations yet</h3>
              <p className="text-muted-foreground mb-4">Start making a difference today!</p>
              <Button onClick={() => navigate("/donate")}>Make Your First Donation</Button>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {donations.map((donation) => (
                <Card key={donation.id} className="hover:shadow-lg transition-shadow animate-fade-in">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-primary" />
                      {donation.donationType}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 text-xs">
                      <Calendar className="h-3 w-3" />
                      {new Date(donation.date).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-muted-foreground">{donation.description}</p>
                    <div className="flex items-start gap-1 text-sm">
                      <MapPin className="h-4 w-4 text-accent mt-0.5" />
                      <span>{donation.location}</span>
                    </div>
                    {donation.quantity && (
                      <p className="text-sm">
                        <span className="font-semibold">Quantity:</span> {donation.quantity}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;
