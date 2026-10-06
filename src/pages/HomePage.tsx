import { profile } from '../data/profile'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { Hero } from '../components/hero/Hero'
import { AboutSection } from '../components/sections/AboutSection'
import { ProjectsSection } from '../components/projects/ProjectsSection'
import { ContactSection } from '../components/sections/ContactSection'

export function HomePage() {
  useDocumentMeta(`${profile.name} | ${profile.role}`, profile.intro, true)

  return (
    <>
      <Hero />
      <AboutSection />
      <ProjectsSection />
      <ContactSection />
    </>
  )
}
