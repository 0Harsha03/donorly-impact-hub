import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Building2, Edit, Package, MapPin, Calendar, Phone, Mail, User, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface NGOProfile {
  ngo_name: string;
  ngo_id: string;
  logo_url?: string;
  description: string;
  location: string;
}

interface Donation {
  id: string;
  donation_type: string;
  description: string;
  location: string;
  quantity?: string;
  created_at: string;
  donor_id: string;
}

interface DonorDetails {
  full_name: string;
  email: string;
  phone_number?: string;
  location: string;
}

const NGODashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<NGOProfile | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDonor, setSelectedDonor] = useState<DonorDetails | null>(null);
  const [loadingDonor, setLoadingDonor] = useState(false);

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/auth");
      return;
    }

    await loadNGOProfile(user.id);
    await loadLocationMatchedDonations(user.id);
  };

  const loadNGOProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("ngos")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      toast.error("Failed to load profile");
      navigate("/ngo-profile");
      return;
    }

    setProfile(data);
  };

  const loadLocationMatchedDonations = async (userId: string) => {
    // First get NGO location
    const { data: ngoData } = await supabase
      .from("ngos")
      .select("location")
      .eq("user_id", userId)
      .single();

    if (!ngoData) {
      setLoading(false);
      return;
    }

    // Get donations matching NGO location
    const { data, error } = await supabase
      .from("donations")
      .select("*")
      .eq("location", ngoData.location)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load donations");
      console.error(error);
    } else {
      setDonations(data || []);
    }
    setLoading(false);
  };

  const loadDonorDetails = async (donorId: string) => {
    setLoadingDonor(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("full_name, email, phone_number, location")
      .eq("id", donorId)
      .single();

    if (error) {
      toast.error("Failed to load donor details");
      console.error(error);
    } else {
      setSelectedDonor(data);
    }
    setLoadingDonor(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/");
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto p-4 md:p-8">
        <div className="mb-6 flex items-center justify-between flex-wrap gap-2">
          <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/ngo-profile")} className="gap-2">
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        <Card className="mb-8 shadow-xl border-primary/10">
          <CardHeader className="flex flex-row items-start gap-4">
            {profile.logo_url ? (
              <img src={profile.logo_url} alt={profile.ngo_name} className="h-16 w-16 rounded-lg object-cover" />
            ) : (
              <Building2 className="h-16 w-16 text-primary" />
            )}
            <div className="flex-1">
              <CardTitle className="text-3xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Welcome back, {profile.ngo_name}!
              </CardTitle>
              <CardDescription className="mt-2">
                <span className="font-semibold">NGO ID:</span> {profile.ngo_id}
              </CardDescription>
              <CardDescription className="mt-1">
                <span className="font-semibold">Location:</span> {profile.location}
              </CardDescription>
              <p className="mt-3 text-sm text-muted-foreground">{profile.description}</p>
            </div>
          </CardHeader>
        </Card>

        <div className="grid gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Package className="h-6 w-6 text-accent" />
              Available Donations in Your Area ({donations.length})
            </h2>
          </div>

          {loading ? (
            <Card className="p-12 text-center">
              <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading donations...</p>
            </Card>
          ) : donations.length === 0 ? (
            <Card className="p-12 text-center">
              <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No donations available</h3>
              <p className="text-muted-foreground">There are no donations in your area yet.</p>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {donations.map((donation) => (
                <Card key={donation.id} className="hover:shadow-lg transition-shadow animate-fade-in">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-primary" />
                      {donation.donation_type}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 text-xs">
                      <Calendar className="h-3 w-3" />
                      {new Date(donation.created_at).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
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
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full mt-2"
                          onClick={() => loadDonorDetails(donation.donor_id)}
                        >
                          View Donor Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Donor Contact Information</DialogTitle>
                        </DialogHeader>
                        {loadingDonor ? (
                          <div className="flex justify-center p-8">
                            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                          </div>
                        ) : selectedDonor ? (
                          <div className="space-y-4 py-4">
                            <div className="flex items-center gap-3">
                              <User className="h-5 w-5 text-primary" />
                              <div>
                                <p className="text-sm text-muted-foreground">Name</p>
                                <p className="font-semibold">{selectedDonor.full_name}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Mail className="h-5 w-5 text-primary" />
                              <div>
                                <p className="text-sm text-muted-foreground">Email</p>
                                <p className="font-semibold">{selectedDonor.email}</p>
                              </div>
                            </div>
                            {selectedDonor.phone_number && (
                              <div className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-primary" />
                                <div>
                                  <p className="text-sm text-muted-foreground">Phone</p>
                                  <p className="font-semibold">{selectedDonor.phone_number}</p>
                                </div>
                              </div>
                            )}
                            <div className="flex items-center gap-3">
                              <MapPin className="h-5 w-5 text-primary" />
                              <div>
                                <p className="text-sm text-muted-foreground">Location</p>
                                <p className="font-semibold">{selectedDonor.location}</p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <p className="text-center text-muted-foreground py-4">
                            Unable to load donor details
                          </p>
                        )}
                      </DialogContent>
                    </Dialog>
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

export default NGODashboard;
