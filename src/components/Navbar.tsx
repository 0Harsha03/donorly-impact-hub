import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <Heart className="w-6 h-6 text-primary-foreground fill-current" />
          </div>
          <span className="text-2xl font-bold text-primary">Donorly</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-foreground hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/campaigns" className="text-foreground hover:text-primary transition-colors">
            Campaigns
          </Link>
          <Link to="/about" className="text-foreground hover:text-primary transition-colors">
            About Us
          </Link>
          <Link to="/contact" className="text-foreground hover:text-primary transition-colors">
            Contact
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/auth">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link to="/auth">
            <Button className="bg-accent hover:bg-accent/90">Start Donating</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
