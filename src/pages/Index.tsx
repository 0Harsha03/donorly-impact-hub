import { Link } from "react-router-dom";
import { Shield, CheckCircle, TrendingUp, Heart, Users, Target, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/Navbar";
import heroImage from "@/assets/hero-image.jpg";

const Index = () => {
  const stats = [
    { icon: Heart, value: "₹5.2M+", label: "Total Donations" },
    { icon: Users, value: "12,500+", label: "Active Donors" },
    { icon: Target, value: "850+", label: "Campaigns Funded" },
    { icon: TrendingUp, value: "95%", label: "Success Rate" },
  ];

  const features = [
    {
      icon: Shield,
      title: "100% Secure",
      description: "All transactions are encrypted and verified with industry-leading security standards.",
    },
    {
      icon: CheckCircle,
      title: "Verified NGOs",
      description: "Every organization is thoroughly vetted to ensure your donations reach the right hands.",
    },
    {
      icon: TrendingUp,
      title: "Real Impact",
      description: "Track your donations and see the tangible difference you're making in real-time.",
    },
  ];

  const campaigns = [
    {
      id: 1,
      title: "Education for Underprivileged Children",
      description: "Help provide quality education and school supplies to children in rural areas who lack access to basic learning resources.",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
      category: "Education",
      raised: 45000,
      goal: 100000,
      donors: 234,
    },
    {
      id: 2,
      title: "Clean Water Initiative",
      description: "Building sustainable water wells in drought-affected regions to provide clean drinking water to communities in need.",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
      category: "Healthcare",
      raised: 78000,
      goal: 150000,
      donors: 456,
    },
    {
      id: 3,
      title: "Food Security Program",
      description: "Distributing nutritious meals and food packages to families struggling with food insecurity and hunger.",
      image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80",
      category: "Food & Nutrition",
      raised: 92000,
      goal: 120000,
      donors: 567,
    },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Beneficiary - Education Program",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80",
      quote: "Thanks to Donorly, I received a scholarship that changed my life. I'm now pursuing my dream of becoming a teacher and giving back to my community.",
    },
    {
      name: "Rajesh Kumar",
      role: "Regular Donor",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
      quote: "Donorly makes it so easy to support causes I care about. Seeing the direct impact of my donations motivates me to give more.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-in fade-in slide-in-from-left duration-700">
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                Supporting UN SDG 1 - No Poverty
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Empowering Giving,{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Empowering Lives
                </span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Join thousands of donors making a real difference. Every contribution counts towards building a better tomorrow.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/auth">
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-lg h-14 px-8">
                    Start Donating <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/campaigns">
                  <Button size="lg" variant="outline" className="text-lg h-14 px-8">
                    Browse Campaigns
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative animate-in fade-in slide-in-from-right duration-700">
              <img
                src={heroImage}
                alt="People helping each other"
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <div className="mx-auto w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                    <stat.icon className="w-7 h-7 text-accent" />
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold">Why Choose Donorly?</h2>
            <p className="text-xl text-muted-foreground">
              Transparent, secure, and impactful giving made simple
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 hover:border-primary transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Campaigns Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold">Featured Campaigns</h2>
            <p className="text-xl text-muted-foreground">
              Support these verified campaigns making real change in communities
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {campaigns.map((campaign) => {
              const percentage = Math.round((campaign.raised / campaign.goal) * 100);
              return (
                <Card key={campaign.id} className="overflow-hidden hover:shadow-2xl transition-shadow">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={campaign.image}
                      alt={campaign.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <Badge className="bg-primary">{campaign.category}</Badge>
                      <Badge className="bg-green-500">
                        <CheckCircle className="w-3 h-3 mr-1" /> Verified
                      </Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl">{campaign.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{campaign.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-semibold">
                          ${campaign.raised.toLocaleString()} raised
                        </span>
                        <span className="text-muted-foreground">
                          of ${campaign.goal.toLocaleString()}
                        </span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{campaign.donors} donors</span>
                        <span>{percentage}% funded</span>
                      </div>
                    </div>
                    <Button className="w-full" variant="default">
                      Donate Now
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <div className="text-center mt-12">
            <Link to="/campaigns">
              <Button size="lg" variant="outline">
                View All Campaigns
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold">Impact Stories</h2>
            <p className="text-xl text-muted-foreground">
              Real stories from people whose lives have been transformed
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-2">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-lg">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent text-white">
        <div className="container mx-auto px-4 text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold">Ready to Make a Difference?</h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Join our community of changemakers and start your giving journey today.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" variant="secondary" className="text-lg h-14 px-8">
                Create Account
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline" className="text-lg h-14 px-8 bg-white/10 hover:bg-white/20 text-white border-white">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
