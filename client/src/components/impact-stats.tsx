export default function ImpactStats() {
  const stats = [
    {
      number: "500+",
      label: "Students Served",
      description: "Through our education programs"
    },
    {
      number: "150+",
      label: "Families Supported",
      description: "In our community outreach"
    },
    {
      number: "75+",
      label: "Job Placements",
      description: "Through workforce development"
    },
    {
      number: "25+",
      label: "Partner Organizations",
      description: "Collaborative impact network"
    }
  ];

  return (
    <section className="py-20 bg-blue-600 text-white" data-testid="impact-stats">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4" data-testid="impact-title">
            Our Impact
          </h2>
          <p className="text-xl text-blue-100" data-testid="impact-subtitle">
            Making a difference one connection at a time
          </p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center" data-testid={`stat-${index}`}>
              <div className="text-5xl font-bold text-yellow-400 mb-2" data-testid={`stat-number-${index}`}>
                {stat.number}
              </div>
              <div className="text-lg font-semibold mb-1" data-testid={`stat-label-${index}`}>
                {stat.label}
              </div>
              <div className="text-blue-200 text-sm" data-testid={`stat-description-${index}`}>
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
