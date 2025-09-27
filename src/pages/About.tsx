import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Eye, Heart, Users, Award, BookOpen } from "lucide-react";

export default function About() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-6">About Champion English School</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Established with a vision to provide quality education, Champion English School has been
            nurturing young minds and building tomorrow's leaders.
          </p>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Target className="h-12 w-12 mx-auto text-primary mb-4" />
                <CardTitle>Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  To provide holistic education that develops academic excellence, character building,
                  and moral values in every student, preparing them for success in life.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Eye className="h-12 w-12 mx-auto text-primary mb-4" />
                <CardTitle>Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  To be a leading educational institution that nurtures confident, creative, and
                  responsible global citizens who contribute positively to society.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Heart className="h-12 w-12 mx-auto text-primary mb-4" />
                <CardTitle>Our Values</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-muted-foreground text-left space-y-2">
                  <li>• Excellence in Education</li>
                  <li>• Character Development</li>
                  <li>• Integrity & Honesty</li>
                  <li>• Respect & Compassion</li>
                  <li>• Innovation & Creativity</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* School History */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Our Story</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Champion English School was founded with a clear vision: to unleash the champion within
                every student. Located in the heart of Sayapatri Margha, Dharan-15, Nepal, our school
                has been serving the community by providing quality education that goes beyond academics.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Under the dedicated leadership of our Principal, Menuka Adhikari (Naju), Director
                Netra Prasad Subedi, and Vice Principal Abeen Rai, we have built a reputation for
                excellence in education and character development.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our commitment extends beyond traditional teaching methods. We believe in creating an
                environment where students can explore their potential, develop critical thinking skills,
                and build the confidence needed to face tomorrow's challenges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Champion English School?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <Users className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-semibold">Experienced Faculty</h3>
              <p className="text-muted-foreground">
                Our dedicated team of qualified teachers brings years of experience and passion for education.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center space-y-4">
              <BookOpen className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-semibold">Modern Curriculum</h3>
              <p className="text-muted-foreground">
                We follow an updated curriculum that combines traditional values with modern teaching methodologies.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center space-y-4">
              <Award className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-semibold">Excellence in Results</h3>
              <p className="text-muted-foreground">
                Our students consistently achieve outstanding academic results and excel in various competitions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}