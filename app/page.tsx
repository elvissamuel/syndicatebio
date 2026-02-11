import { Header } from '@/components/header'
import { SubmissionsCanvas } from '@/components/submissions-canvas'

export default function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />
      <SubmissionsCanvas />
    </main>
  )
}
