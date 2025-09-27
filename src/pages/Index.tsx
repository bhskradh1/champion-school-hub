import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Bell, Image, Trophy, Users, Phone, GraduationCap, ArrowRight, Sparkles } from "lucide-react";
import { WelcomePopup } from "@/components/WelcomePopup";

const Index = () => {
  return (
    <Layout>
      <WelcomePopup />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-accent text-primary-foreground py-20 overflow-hidden">
        {/* Floating elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-float animation-delay-200"></div>
        <div className="absolute top-20 right-20 w-16 h-16 bg-white/5 rounded-full animate-bounce-gentle animation-delay-400"></div>
        <div className="absolute bottom-10 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-float animation-delay-600"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="flex justify-center mb-6 animate-fade-in">
            <div className="relative">
              <GraduationCap className="h-16 w-16 animate-bounce-gentle" />
              <Sparkles className="absolute -top-2 -right-2 h-6 w-6 animate-pulse text-accent" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in animation-delay-200">
            Champion English School
          </h1>
          <p className="text-xl md:text-2xl mb-4 opacity-90 animate-fade-in animation-delay-400">
            Sayapatri Margha, Dharan-15, Nepal
          </p>
          <p className="text-lg md:text-xl mb-8 opacity-80 max-w-2xl mx-auto animate-fade-in animation-delay-600">
            Unleashing the Champion within everyone
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in animation-delay-800">
            <Button asChild size="lg" variant="secondary" className="hover-scale group">
              <Link to="/about">
                Learn More
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover-scale">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section id="quick-access" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 animate-fade-in">Quick Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-xl transition-all duration-500 group hover-scale animate-fade-in animation-delay-200 border-2 hover:border-primary/20">
              <CardHeader className="text-center">
                <Calendar className="h-12 w-12 mx-auto text-primary group-hover:scale-125 group-hover:rotate-3 transition-all duration-300" />
                <CardTitle className="group-hover:text-primary transition-colors">Events</CardTitle>
                <CardDescription>Upcoming school events and activities</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full group">
                  <Link to="/events">
                    View Events
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-500 group hover-scale animate-fade-in animation-delay-400 border-2 hover:border-primary/20">
              <CardHeader className="text-center">
                <Bell className="h-12 w-12 mx-auto text-primary group-hover:scale-125 group-hover:rotate-12 transition-all duration-300" />
                <CardTitle className="group-hover:text-primary transition-colors">Notices</CardTitle>
                <CardDescription>Important announcements and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full group">
                  <Link to="/notices">
                    View Notices
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-500 group hover-scale animate-fade-in animation-delay-600 border-2 hover:border-primary/20">
              <CardHeader className="text-center">
                <Image className="h-12 w-12 mx-auto text-primary group-hover:scale-125 group-hover:-rotate-3 transition-all duration-300" />
                <CardTitle className="group-hover:text-primary transition-colors">Gallery</CardTitle>
                <CardDescription>Photos from school life and events</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full group">
                  <Link to="/gallery">
                    View Gallery
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-500 group hover-scale animate-fade-in animation-delay-800 border-2 hover:border-primary/20">
              <CardHeader className="text-center">
                <Trophy className="h-12 w-12 mx-auto text-primary group-hover:scale-125 group-hover:rotate-6 transition-all duration-300" />
                <CardTitle className="group-hover:text-primary transition-colors">Results</CardTitle>
                <CardDescription>Academic results and achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full group">
                  <Link to="/results">
                    View Results
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* School Info */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in animation-delay-200">
              <h2 className="text-3xl font-bold mb-6">Welcome to Champion English School</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                At Champion English School, we are committed to providing quality education that shapes 
                character, builds confidence, and prepares our students for success in every aspect of life. 
                Our dedicated team of educators creates a nurturing environment where learning is both 
                joyful and purposeful.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 group animate-fade-in animation-delay-400">
                  <Users className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                  <span className="story-link">Experienced and dedicated faculty</span>
                </div>
                <div className="flex items-center space-x-3 group animate-fade-in animation-delay-600">
                  <Trophy className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                  <span className="story-link">Focus on academic excellence</span>
                </div>
                <div className="flex items-center space-x-3 group animate-fade-in animation-delay-800">
                  <GraduationCap className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                  <span className="story-link">Holistic development approach</span>
                </div>
              </div>
              <Button asChild className="mt-6 hover-scale group">
                <Link to="/about">
                  Learn More About Us
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-8 animate-fade-in animation-delay-400 hover-scale border border-primary/10">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Phone className="h-5 w-5 mr-2 text-primary animate-bounce-gentle" />
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 group">
                  <Phone className="h-5 w-5 text-primary group-hover:rotate-12 transition-transform" />
                  <span className="story-link">+977-9814350277</span>
                </div>
                <div className="flex items-start space-x-3 group">
                  <Calendar className="h-5 w-5 text-primary mt-0.5 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-medium story-link">School Hours</p>
                    <p className="text-sm text-muted-foreground">Sunday - Friday: 8:00 AM - 5:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
