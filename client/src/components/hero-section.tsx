import { Button } from "@/components/ui/button";
import heroImage from "@assets/embrace-scaled_1754341547885.jpg";

export default function HeroSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navHeight = 64;
      const targetPosition = element.offsetTop - navHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800"
      data-testid="hero-section"
    >
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="People embracing and supporting each other at sunset" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 
          className="text-4xl md:text-6xl lg:text-7xl font-bold hero-title-color mb-6"
          data-testid="hero-title"
        >
          Helping People Connect To Their Onward!
        </h1>
        <p 
          className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto"
          data-testid="hero-subtitle"
        >
          Empowering communities through education, connection, and workforce development.{" "}
          <span className="text-yellow-400 font-semibold">¡Sigues Adelante!</span>
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => scrollToSection("story")}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-4 text-lg font-semibold transform hover:scale-105 transition-all"
            data-testid="learn-story-button"
          >
            Learn Our Story
          </Button>
          <Button 
            onClick={() => scrollToSection("contact")}
            variant="outline"
            className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold transition-all"
            data-testid="get-involved-button"
          >
            Get Involved
          </Button>
        </div>
      </div>
    </section>
  );
}
