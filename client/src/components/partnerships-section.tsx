import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, BarChart } from "lucide-react";

export default function PartnershipsSection() {
  const partnerships = [
    {
      id: "microsoft",
      title: "Microsoft Hackathon Partnership",
      subtitle: "Tech Innovation for Good",
      description: "We're partnering with Microsoft in an exciting hackathon focused on developing technology solutions for community challenges. Join us in creating innovative tools that make a real difference.",
      icon: Code,
      color: "blue"
    },
    {
      id: "wids",
      title: "Women in Data Science",
      subtitle: "Coming September 2024",
      description: "Our upcoming community project empowers women in STEM through data science education, mentorship, and career development opportunities. Building the next generation of female data leaders.",
      icon: BarChart,
      color: "red"
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
      default:
        return {
          icon: "text-blue-600",
          button: "bg-blue-600 hover:bg-blue-700",
          subtitle: "text-blue-600"
        };
    }
  };

  return (
    <section className="py-20 bg-gray-50" data-testid="partnerships-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4" data-testid="partnerships-title">
            Current Initiatives
          </h2>
          <p className="text-xl text-gray-600" data-testid="partnerships-subtitle">
            Exciting collaborations driving community impact
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {partnerships.map((partnership) => {
            const colors = getColorClasses(partnership.color);
            const IconComponent = partnership.icon;
            
            return (
              <Card key={partnership.id} className="bg-white shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <IconComponent className={`${colors.icon} text-3xl mr-4 h-8 w-8`} />
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800" data-testid={`partnership-${partnership.id}-title`}>
                        {partnership.title}
                      </h3>
                      <p className={`${colors.subtitle} font-semibold`} data-testid={`partnership-${partnership.id}-subtitle`}>
                        {partnership.subtitle}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6" data-testid={`partnership-${partnership.id}-description`}>
                    {partnership.description}
                  </p>
                  <Button 
                    className={`${colors.button} text-white font-semibold transition-colors`}
                    data-testid={`partnership-${partnership.id}-button`}
                  >
                    {partnership.id === "microsoft" ? "Get Involved" : "Learn More"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
