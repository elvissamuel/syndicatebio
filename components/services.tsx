export function Services() {
  const services = [
    {
      title: 'Genetic Testing',
      description: 'Comprehensive genetic screening to identify inherited health risks specific to your family history.',
      icon: '🧬',
    },
    {
      title: 'Health Insights',
      description: 'Actionable genetic information that helps you and your clinicians make informed health decisions.',
      icon: '📊',
    },
    {
      title: 'Family Reports',
      description: 'Detailed family health reports showing inherited patterns and risk assessments across generations.',
      icon: '👨‍👩‍👧‍👦',
    },
    {
      title: 'Clinical Support',
      description: 'Expert guidance from genetic counselors to help interpret your results and plan next steps.',
      icon: '🏥',
    },
  ]

  return (
    <section id="services" className="py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Our Services</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Direct by SyndicateBio offers comprehensive genetic testing and actionable health insights
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="p-6 bg-secondary rounded-xl border border-border hover:border-primary transition cursor-pointer group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-secondary-foreground">{service.title}</h3>
              <p className="text-secondary-foreground opacity-90">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
