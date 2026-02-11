export function Hero() {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
          Genetic Insights for <span className="text-primary">African Families</span>
        </h1>
        <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
          SyndicateBio makes genetic testing accessible, affordable, and locally available in Nigeria. Understand your inherited health risks and act early.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition">
            Start Your Genetic Test
          </button>
          <button className="px-8 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-primary-foreground transition">
            Learn More
          </button>
        </div>
      </div>
    </section>
  )
}
