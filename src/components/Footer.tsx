import { Link } from "react-router-dom";
import { GraduationCap, MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">Champion English School</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Unleashing the Champion within everyone. Excellence in education, character, and values.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider">Quick Links</h3>
            <div className="flex flex-col space-y-2">
              <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                About Us
              </Link>
              <Link to="/events" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Events
              </Link>
              <Link to="/notices" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Notices
              </Link>
              <Link to="/results" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Results
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider">More</h3>
            <div className="flex flex-col space-y-2">
              <Link to="/gallery" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Photo Gallery
              </Link>
              <Link to="/leadership" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Leadership
              </Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Contact Us
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  Sayapatri Margha<br />
                  Dharan-15, Nepal
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary" />
                <p className="text-sm text-muted-foreground">+977-9814350277</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Champion English School. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}