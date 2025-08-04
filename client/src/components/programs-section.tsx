import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Heart, Handshake } from "lucide-react";
import communityImage from "@assets/community-3x2-1-scaled_1754344789769.jpg";

export default function ProgramsSection() {
  const programs = [
    {
      id: "education",
      title: "Education",
      subtitle: "Empowering our Youth: Digital Equity Programs",
      description: "Breaking down digital barriers and creating pathways to educational success through technology access, digital literacy training, and mentorship programs.",
      icon: GraduationCap,
      color: "blue",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
    },
    {
      id: "community",
      title: "Community",
      subtitle: "Serving the Vulnerable and At-Risk",
      description: "Providing essential support services, resources, and advocacy for our most vulnerable community members through direct assistance and collaborative partnerships.",
      icon: Heart,
      color: "red",
      image: communityImage
    },
    {
      id: "connection",
      title: "Connection",
      subtitle: "Partnering to Drive Workforce & Skilling Impact",
      description: "Building bridges between talent and opportunity through strategic partnerships, workforce development initiatives, and professional networking programs.",
      icon: Handshake,
      color: "orange",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return {
          icon: "text-blue-600",
          button: "bg-blue-600 hover:bg-blue-700",
          subtitle: "text-blue-600"
        };
      case "red":
        return {
          icon: "text-red-600",
          button: "bg-red-600 hover:bg-red-700",
          subtitle: "text-red-600"
        };
      case "orange":
        return {
          icon: "text-yellow-500",
          button: "bg-yellow-500 hover:bg-yellow-600",
          subtitle: "text-yellow-500"
        };
      default:
        return {
          icon: "text-blue-600",
          button: "bg-blue-600 hover:bg-blue-700",
          subtitle: "text-blue-600"
        };
    }
  };

  return (
    <section id="programs" className="py-20 bg-white" data-testid="programs-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4" data-testid="programs-title">
            Our Programs
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto" data-testid="programs-subtitle">
            Three pillars of impact connecting communities to their potential
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {programs.map((program) => {
            const colors = getColorClasses(program.color);
            const IconComponent = program.icon;
            
            return (
              <div key={program.id} className="group hover:transform hover:scale-105 transition-all duration-300">
                <Card className="bg-white shadow-lg overflow-hidden h-full">
                  <img 
                    src={program.image} 
                    alt={`${program.title} program`} 
                    className="w-full h-64 object-cover"
                  />
                  <CardContent className="p-8">
                    <div className="flex items-center mb-4">
                      <IconComponent className={`${colors.icon} text-2xl mr-3 h-6 w-6`} />
                      <h3 className="text-2xl font-bold text-gray-800" data-testid={`program-${program.id}-title`}>
                        {program.title}
                      </h3>
                    </div>
                    <h4 className={`text-lg font-semibold ${colors.subtitle} mb-3`} data-testid={`program-${program.id}-subtitle`}>
                      {program.subtitle}
                    </h4>
                    <p className="text-gray-600 mb-6" data-testid={`program-${program.id}-description`}>
                      {program.description}
                    </p>
                    <Button 
                      className={`${colors.button} text-white font-semibold transition-colors`}
                      data-testid={`program-${program.id}-button`}
                    >
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
