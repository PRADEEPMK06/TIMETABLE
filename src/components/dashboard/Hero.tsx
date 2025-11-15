import { Calendar, Clock, Users, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import heroImage from "@/assets/hero-image.jpg";
import { useNavigate } from "react-router-dom";

interface HeroProps {
  onGetStarted: () => void;
}

const Hero = ({ onGetStarted }: HeroProps) => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "Intelligent timetable generation with conflict detection",
    },
    {
      icon: Users,
      title: "Staff Management",
      description: "Efficiently manage faculty and their subject assignments",
    },
    {
      icon: Clock,
      title: "Time Optimization",
      description: "Optimized time slots for maximum efficiency",
    },
    {
      icon: BookOpen,
      title: "Subject Tracking",
      description: "Track subjects, labs, and academic requirements",
    },
  ];

  return (
    <div className="relative min-h-[80vh] flex items-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary-glow/5" />

      <div className="relative z-10 w-full flex flex-col items-center justify-center px-4 py-16 sm:py-32">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-center text-primary">
          Automate Your College’s Scheduling
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-center text-muted-foreground max-w-2xl">
          Create conflict-free academic schedules for your college with
          intelligent staff allocation, subject distribution, and optimized time
          management.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-10 justify-center">
          <Button
            variant="gradient"
            size="lg"
            onClick={onGetStarted}
            className="text-lg px-8 py-6"
          >
            Get Started
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="text-lg px-8 py-6"
            onClick={() => navigate("/description")}
          >
            Learn More
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-14 w-full max-w-4xl">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="flex flex-col items-center gap-3 py-8 px-4"
            >
              <feature.icon size={40} className="text-primary-glow mb-2" />
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground text-center">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>

        {/* Developer Info */}
        <div className="mt-8 text-center text-muted-foreground text-sm">
          Developed by <strong>PRADEEP M K</strong> |{" "}
          <a href="mailto:pradeepmk799@gmail.com" className="underline">pradeepmk799@gmail.com</a>
          <br />
          3rd Year B.Tech IT, Sri Shakthi Institute of Engineering and Technology
        </div>
      </div>
    </div>
  );
};

export default Hero;
