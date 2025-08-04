import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      quote: "The digital equity program changed my son's entire educational trajectory. Now he has the tools and confidence to pursue his dreams in technology.",
      name: "Maria Rodriguez",
      role: "Parent, Education Program",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100"
    },
    {
      quote: "Through the workforce development program, I found not just a job, but a career path I'm passionate about. The mentorship was invaluable.",
      name: "James Chen",
      role: "Workforce Development Graduate",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100"
    },
    {
      quote: "Adelante Story Foundation didn't just help me during a difficult time - they connected me with a community that continues to support my family.",
      name: "Ana Gutierrez",
      role: "Community Program Participant",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100"
    }
  ];

  return (
    <section className="py-20 bg-gray-50" data-testid="testimonials-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4" data-testid="testimonials-title">
            Community Voices
          </h2>
          <p className="text-xl text-gray-600" data-testid="testimonials-subtitle">
            Stories of transformation and hope
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-6 italic" data-testid={`testimonial-quote-${index}`}>
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                    data-testid={`testimonial-image-${index}`}
                  />
                  <div>
                    <div className="font-semibold text-gray-800" data-testid={`testimonial-name-${index}`}>
                      {testimonial.name}
                    </div>
                    <div className="text-gray-600 text-sm" data-testid={`testimonial-role-${index}`}>
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
