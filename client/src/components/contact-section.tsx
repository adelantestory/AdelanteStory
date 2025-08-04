import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ContactForm {
  fullName: string;
  email: string;
  message: string;
}

export default function ContactSection() {
  const [formData, setFormData] = useState<ContactForm>({
    fullName: "",
    email: "",
    message: ""
  });
  const { toast } = useToast();

  const contactMutation = useMutation({
    mutationFn: async (data: ContactForm) => {
      return apiRequest("POST", "/api/contact", data);
    },
    onSuccess: async (response) => {
      const result = await response.json();
      toast({
        title: "Message Sent!",
        description: result.message,
      });
      setFormData({ fullName: "", email: "", message: "" });
    },
    onError: async (error: any) => {
      const errorMessage = error.message || "Something went wrong. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }

    contactMutation.mutate(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <section id="contact" className="py-20 bg-white" data-testid="contact-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-4xl font-bold text-gray-800 mb-6" data-testid="contact-title">
              Get In Touch
            </h2>
            <p className="text-xl text-gray-600 mb-8" data-testid="contact-description">
              We encourage you to connect with us as a friend, participant or donor, and learn how YOUR talents and experiences can make a powerful difference for others.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center">
                <Mail className="text-blue-600 text-xl mr-4 h-5 w-5" />
                <div>
                  <div className="font-semibold text-gray-800">Email Us</div>
                  <div className="text-gray-600" data-testid="contact-email">hello@adelantestory.com</div>
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="text-blue-600 text-xl mr-4 h-5 w-5" />
                <div>
                  <div className="font-semibold text-gray-800">Call Us</div>
                  <div className="text-gray-600" data-testid="contact-phone">(555) 123-4567</div>
                </div>
              </div>
              <div className="flex items-center">
                <MapPin className="text-blue-600 text-xl mr-4 h-5 w-5" />
                <div>
                  <div className="font-semibold text-gray-800">Visit Us</div>
                  <div className="text-gray-600" data-testid="contact-address">
                    123 Community Street<br />San Antonio, TX 78201
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <Card className="bg-gray-50">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
                <div>
                  <Label htmlFor="fullName" className="block text-sm font-semibold text-gray-800 mb-2">
                    Full Name
                  </Label>
                  <Input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Your full name"
                    required
                    data-testid="input-fullName"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-2">
                    E-mail Address
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    required
                    data-testid="input-email"
                  />
                </div>
                
                <div>
                  <Label htmlFor="message" className="block text-sm font-semibold text-gray-800 mb-2">
                    Your Message
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us how you'd like to get involved or any questions you have..."
                    required
                    data-testid="input-message"
                  />
                </div>
                
                <Button
                  type="submit"
                  disabled={contactMutation.isPending}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 font-semibold transition-colors disabled:opacity-50"
                  data-testid="submit-contact"
                >
                  {contactMutation.isPending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
