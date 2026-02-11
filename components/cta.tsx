export function CTA() {
  return (
    <section className="py-20 px-4 bg-primary text-primary-foreground">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <h2 className="text-4xl font-bold">Ready to Understand Your Family's Health?</h2>
        <p className="text-xl opacity-90">
          Start your genetic testing journey with SyndicateBio. Direct by SyndicateBio is here to help you make informed health decisions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-3 bg-primary-foreground text-primary rounded-lg font-semibold hover:opacity-90 transition">
            Get Started Today
          </button>
          <button className="px-8 py-3 border-2 border-primary-foreground text-primary-foreground rounded-lg font-semibold hover:bg-primary-foreground hover:text-primary transition">
            Schedule a Consultation
          </button>
        </div>
      </div>
    </section>
  )
}
