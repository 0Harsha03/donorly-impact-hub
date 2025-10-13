import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MapPin, Package, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const donationSchema = z.object({
  donationType: z.string().min(1, "Please select a donation type"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string().min(3, "Please provide a location"),
  quantity: z.string().optional(),
});

type DonationFormData = z.infer<typeof donationSchema>;

const Donate = () => {
  const navigate = useNavigate();
  const [isLocating, setIsLocating] = useState(false);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DonationFormData>({
    resolver: zodResolver(donationSchema),
  });

  const donationType = watch("donationType");

  const handleGetLocation = () => {
    setIsLocating(true);
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ lat: latitude, lng: longitude });
          
          // Reverse geocoding simulation (in real app, use Google Maps API or similar)
          const mockLocation = `Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          setValue("location", mockLocation);
          
          toast.success("Location detected successfully!");
          setIsLocating(false);
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast.error("Unable to detect location. Please enter manually.");
          setIsLocating(false);
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
      setIsLocating(false);
    }
  };

  const onSubmit = async (data: DonationFormData) => {
    console.log("Donation Data:", {
      ...data,
      coordinates,
      timestamp: new Date().toISOString(),
    });

    // Save to localStorage
    const existingDonations = JSON.parse(localStorage.getItem("donationData") || "[]");
    const newDonation = {
      ...data,
      id: Date.now(),
      date: new Date().toISOString(),
      coordinates,
    };
    localStorage.setItem("donationData", JSON.stringify([...existingDonations, newDonation]));

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success("✅ Thank you for your donation!", {
      description: "Your donation details have been saved successfully.",
    });

    // Reset form and navigate
    reset();
    setCoordinates(null);
    
    setTimeout(() => {
      navigate("/donor-dashboard");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
          <h1 className="text-xl font-bold text-primary">Donorly</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="shadow-2xl border-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardHeader className="text-center space-y-2 bg-gradient-to-r from-primary/5 to-accent/5 border-b">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <Package className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Make a Donation
            </CardTitle>
            <CardDescription className="text-base">
              Fill in the details below to contribute to our cause
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Donation Type */}
              <div className="space-y-2">
                <Label htmlFor="donationType" className="text-base font-semibold">
                  Donation Type <span className="text-destructive">*</span>
                </Label>
                <Select onValueChange={(value) => setValue("donationType", value)}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select what you're donating" />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    <SelectItem value="clothes">👕 Clothes</SelectItem>
                    <SelectItem value="food">🍲 Food</SelectItem>
                    <SelectItem value="medicine">💊 Medicine</SelectItem>
                    <SelectItem value="others">📦 Others</SelectItem>
                  </SelectContent>
                </Select>
                {errors.donationType && (
                  <p className="text-sm text-destructive">{errors.donationType.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-base font-semibold">
                  Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe what you are donating (e.g., '5 winter jackets in good condition', '10kg of rice and lentils')..."
                  className="min-h-[120px] resize-none"
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location" className="text-base font-semibold">
                  Location <span className="text-destructive">*</span>
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="location"
                    placeholder="Enter your location or city"
                    className="flex-1 h-12"
                    {...register("location")}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 shrink-0"
                    onClick={handleGetLocation}
                    disabled={isLocating}
                  >
                    <MapPin className={`w-5 h-5 ${isLocating ? "animate-pulse" : ""}`} />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Click the location icon to auto-detect your position
                </p>
                {errors.location && (
                  <p className="text-sm text-destructive">{errors.location.message}</p>
                )}
                {coordinates && (
                  <div className="mt-2 p-3 bg-accent/10 rounded-lg border border-accent/20">
                    <p className="text-xs font-medium text-accent-foreground">
                      📍 Coordinates: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
                    </p>
                  </div>
                )}
              </div>

              {/* Quantity (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-base font-semibold">
                  Quantity <span className="text-muted-foreground text-sm">(Optional)</span>
                </Label>
                <Input
                  id="quantity"
                  type="text"
                  placeholder="e.g., 5 items, 10kg, 20 pieces"
                  className="h-12"
                  {...register("quantity")}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  "Confirm Donation"
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Your donation details will be reviewed and you'll be contacted soon.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Donate;
