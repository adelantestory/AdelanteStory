import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);

      // Update active section based on scroll position
      const sections = ["home", "programs", "story", "contact"];
      const sectionElements = sections.map(id => document.getElementById(id)).filter(Boolean);
      
      for (const section of sectionElements) {
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navHeight = 64; // Height of navigation bar
      const targetPosition = element.offsetTop - navHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  };

  const navItems = [
    { id: "home", label: "Home" },
    { id: "programs", label: "Programs" },
    { id: "story", label: "Our Story" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <nav 
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-sm" : "bg-white/95 backdrop-blur-sm"
      }`}
      data-testid="navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={() => scrollToSection("home")}
              className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
              data-testid="logo-button"
            >
              Adelante Story Foundation
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    activeSection === item.id
                      ? "text-blue-600"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                  data-testid={`nav-${item.id}`}
                >
                  {item.label}
                </button>
              ))}
              <Button 
                onClick={() => scrollToSection("contact")}
                className="bg-red-600 hover:bg-red-700 text-white"
                data-testid="donate-button"
              >
                Donate
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" data-testid="mobile-menu-trigger">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className="text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-600 transition-colors"
                      data-testid={`mobile-nav-${item.id}`}
                    >
                      {item.label}
                    </button>
                  ))}
                  <Button 
                    onClick={() => scrollToSection("contact")}
                    className="bg-red-600 hover:bg-red-700 text-white mt-4"
                    data-testid="mobile-donate-button"
                  >
                    Donate
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
