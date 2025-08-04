import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
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
    <footer className="bg-gray-800 text-white py-12" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-normal adelante-brand mb-4" data-testid="footer-logo">
              Adelante Story Foundation
            </div>
            <p className="text-gray-300 mb-6 max-w-md" data-testid="footer-description">
              Creating impact for people and communities through the power of connected experience.{" "}
              <span className="text-yellow-500 font-semibold">¡Sigues Adelante!</span>
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-yellow-500 transition-colors" data-testid="social-facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-yellow-500 transition-colors" data-testid="social-twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-yellow-500 transition-colors" data-testid="social-linkedin">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-yellow-500 transition-colors" data-testid="social-instagram">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4" data-testid="footer-programs-title">Programs</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <button 
                  onClick={() => scrollToSection("programs")}
                  className="hover:text-yellow-500 transition-colors text-left"
                  data-testid="footer-education-link"
                >
                  Education
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("programs")}
                  className="hover:text-yellow-500 transition-colors text-left"
                  data-testid="footer-community-link"
                >
                  Community
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("programs")}
                  className="hover:text-yellow-500 transition-colors text-left"
                  data-testid="footer-connection-link"
                >
                  Connection
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("programs")}
                  className="hover:text-yellow-500 transition-colors text-left"
                  data-testid="footer-partnerships-link"
                >
                  Partnerships
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4" data-testid="footer-involvement-title">Get Involved</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <button 
                  onClick={() => scrollToSection("contact")}
                  className="hover:community-color transition-colors text-left"
                  data-testid="footer-donate-link"
                >
                  Donate
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("contact")}
                  className="hover:text-yellow-500 transition-colors text-left"
                  data-testid="footer-volunteer-link"
                >
                  Volunteer
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("contact")}
                  className="hover:text-yellow-500 transition-colors text-left"
                  data-testid="footer-partner-link"
                >
                  Partner
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("contact")}
                  className="hover:text-yellow-500 transition-colors text-left"
                  data-testid="footer-contact-link"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p data-testid="footer-copyright">
            &copy; 2024 Adelante Story Foundation. All rights reserved. | 501(c)3 Non-Profit Organization
          </p>
        </div>
      </div>
    </footer>
  );
}
