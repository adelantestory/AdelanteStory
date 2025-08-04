import { Button } from "@/components/ui/button";

export default function StorySection() {
  return (
    <section id="story" className="py-20 bg-white" data-testid="story-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="lg:order-first">
            <img 
              src="https://images.unsplash.com/photo-1609220136736-443140cffec6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=800" 
              alt="Family matriarch with family members" 
              className="rounded-xl shadow-2xl w-full"
              data-testid="story-image"
            />
          </div>
          
          <div>
            <h2 className="text-4xl font-bold text-gray-800 mb-6" data-testid="story-title">
              Our Story
            </h2>
            <div className="prose prose-lg text-gray-600">
              <p className="mb-6" data-testid="story-intro">
                <strong className="text-blue-600">Maria Pilar Mares</strong>, our family matriarch. For us, the story starts with her. A loving bond, her unrelenting spirit, and most importantly – the power of her encouragement.
              </p>
              <p className="mb-6" data-testid="story-memory">
                In apartment #107 just behind our store, she willed us forward with the empowering words – <strong className="text-yellow-500">"Adelante Patron!"</strong> (Carry On, Go Forward Boss!)
              </p>
              <p className="mb-8" data-testid="story-mission">
                Today, our family and organization carry forward our mission through YOU, harnessing the power of YOUR Adelante relationships, YOUR Adelante experiences.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 font-semibold transition-colors"
                  data-testid="read-full-story-button"
                >
                  Read Full Story
                </Button>
                <Button 
                  variant="outline"
                  className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-6 py-3 font-semibold transition-colors"
                  data-testid="share-story-button"
                >
                  Share Your Story
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
