export function FamilyFirst() {
  return (
    <section id="family" className="py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">A Family-First Approach to Health</h2>
            <div className="space-y-6">
              <p className="text-lg text-muted-foreground">
                Many conditions—including cancer, blood disorders, cardiovascular diseases, and some skin and respiratory conditions—have genetic roots that pass through generations.
              </p>
              <p className="text-lg text-muted-foreground">
                By helping families understand inherited risk, we enable earlier intervention and better health outcomes. It's not just about knowing your risk. It's about acting early.
              </p>
              <div className="space-y-4 pt-4">
                <div className="flex gap-3">
                  <span className="text-2xl">✓</span>
                  <div>
                    <h4 className="font-semibold mb-1">Prevention</h4>
                    <p className="text-sm text-muted-foreground">Understand risks early and take preventive measures</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-2xl">✓</span>
                  <div>
                    <h4 className="font-semibold mb-1">Early Detection</h4>
                    <p className="text-sm text-muted-foreground">Catch conditions at their earliest, most treatable stages</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-2xl">✓</span>
                  <div>
                    <h4 className="font-semibold mb-1">Targeted Treatment</h4>
                    <p className="text-sm text-muted-foreground">Personalized medical care based on your genetic profile</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-secondary rounded-2xl p-8 border border-border">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-secondary-foreground">Empowering African Families</h3>
              <p className="text-secondary-foreground opacity-90">
                For generations, many African families have sent genetic samples abroad for testing. SyndicateBio changes that. With our in-country laboratory infrastructure, we:
              </p>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span className="text-sm text-secondary-foreground opacity-90">Reduce costs by keeping everything local</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span className="text-sm text-secondary-foreground opacity-90">Speed up results—from weeks to days</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span className="text-sm text-secondary-foreground opacity-90">Build long-term healthcare capacity within Nigeria</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
