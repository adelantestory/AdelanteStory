import { Card, CardContent } from "@/components/ui/card";

export default function MissionStatement() {
  return (
    <section className="py-20 bg-gray-50" data-testid="mission-statement">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6" data-testid="mission-title">
          Welcome To The ASF
        </h2>
        <p className="text-lg text-gray-600 mb-8" data-testid="mission-greeting">
          Bienvenidos!, from the Adelante Story Foundation. We are an accredited 501(c)3 non-profit organization whose mission is:
        </p>
        
        <Card className="bg-white shadow-lg">
          <CardContent className="p-8">
            <h3 className="text-2xl md:text-3xl font-bold text-blue-600 mb-4" data-testid="mission-statement-text">
              To Create Impact for People and Communities Through the Power of Connected Experience.
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed" data-testid="mission-description">
              The connections we help create are dynamic and packed with possibility. From our individual mentoring program to our community project outreaches and charitable org-to-org collaborations; each is fueled by the power of YOUR Adelante spirit.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
