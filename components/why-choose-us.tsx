export function WhyChooseUs() {
  const reasons = [
    {
      title: 'Fully In-Country Operations',
      description: 'Advanced laboratory infrastructure based locally in Nigeria. No need to send samples abroad—faster turnaround times, lower costs.',
    },
    {
      title: 'Affordable & Accessible',
      description: 'Genetic testing designed to be affordable for African families. Breaking down barriers to access without compromising quality.',
    },
    {
      title: 'Clinically Accurate',
      description: 'Rigorous scientific standards ensuring reliable genetic insights that clinicians trust and families can act on.',
    },
    {
      title: 'Expert Genetic Counseling',
      description: 'Professional guidance from genetic specialists to help you understand your results and make informed health decisions.',
    },
  ]

  return (
    <section id="why" className="py-20 px-4 bg-secondary">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-secondary-foreground">Why Choose SyndicateBio?</h2>
          <p className="text-lg text-secondary-foreground opacity-90 max-w-2xl mx-auto">
            We're redefining genetic testing accessibility in Africa
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reasons.map((reason, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-primary-foreground font-bold">
                  {index + 1}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-secondary-foreground">{reason.title}</h3>
                <p className="text-secondary-foreground opacity-90">{reason.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
