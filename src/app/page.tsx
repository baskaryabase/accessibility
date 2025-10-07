import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/sections/Hero'
import { Features } from '@/components/sections/Features'
import { VoiceNavigation } from '@/components/features/VoiceNavigation'

export default function Home() {
  return (
    <main>
      <Header />
      <div id="main-content">
        <Hero />
        <Features />
        <VoiceNavigation />
      </div>
      <Footer />
    </main>
  )
}