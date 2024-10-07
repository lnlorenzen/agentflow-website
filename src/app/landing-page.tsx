'use client'

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { Sun, Moon, Instagram, ArrowRight, Menu, Cpu, Cog, BarChart, GraduationCap, Briefcase, Clock } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../components/ui/textarea"
import { Card, CardContent } from "../../components/ui/card"
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group"
import { Label } from "../../components/ui/label"

const NavItem = ({ href, children, isDarkMode, onClick }: { href: string; children: React.ReactNode; isDarkMode: boolean; onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void }) => (
  <Link 
    href={href} 
    className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'} transition-colors duration-200`}
    onClick={onClick}
  >
    {children}
  </Link>
)

const InteractiveNetworkGraph = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [isMobile, setIsMobile] = useState(false)

  const handleResize = useCallback(() => {
    if (typeof window !== 'undefined') {
      setDimensions({ width: window.innerWidth, height: window.innerHeight })
      setIsMobile(window.innerWidth < 768)
    }
  }, [])

  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [handleResize])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = dimensions.width
    canvas.height = dimensions.height

    const numNodes = isMobile ? 35 : 70
    const nodes = Array.from({ length: numNodes }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      radius: Math.random() * 3 + 1,
      connections: new Set<number>()
    }))

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      nodes.forEach((node, i) => {
        node.x += node.vx
        node.y += node.vy

        if (node.x < 0 || node.x > canvas.width) node.vx *= -1
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1

        nodes.slice(i + 1).forEach((otherNode, j) => {
          const dx = otherNode.x - node.x
          const dy = otherNode.y - node.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            const otherIndex = i + j + 1
            if (!node.connections.has(otherIndex)) {
              node.connections.add(otherIndex)
              otherNode.connections.add(i)
              ctx.strokeStyle = isDarkMode
                ? `rgba(255, 255, 255, ${isMobile ? 0.2 : 0.4})`
                : `rgba(0, 0, 0, ${isMobile ? 0.2 : 0.4})`
            } else {
              ctx.strokeStyle = isDarkMode
                ? `rgba(255, 255, 255, ${isMobile ? 0.1 : 0.2})`
                : `rgba(0, 0, 0, ${isMobile ? 0.1 : 0.2})`
            }
            ctx.beginPath()
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(otherNode.x, otherNode.y)
            ctx.stroke()
          }
        })

        ctx.fillStyle = isDarkMode
          ? `rgba(255, 255, 255, ${isMobile ? 0.15 : 0.3})`
          : `rgba(0, 0, 0, ${isMobile ? 0.15 : 0.3})`
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      // Cleanup function if needed
    }
  }, [dimensions, isMobile, isDarkMode])

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none" />
}

const FadeInSection = ({ children }: { children: React.ReactNode }) => {
  const [ref, setRef] = useState<HTMLDivElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 }
    )

    if (ref) {
      observer.observe(ref)
    }

    return () => {
      if (ref) {
        observer.unobserve(ref)
      }
    }
  }, [ref])

  return (
    <div
      ref={setRef}
      className={`transition-opacity duration-1000 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {children}
    </div>
  )
}

export default function LandingPage() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormStatus('submitting')

    const form = e.currentTarget
    const formData = new FormData(form)
    const data = Object.fromEntries(formData)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setFormStatus('success')
        form.reset()
      } else {
        setFormStatus('error')
      }
    } catch (error) {
      console.error('Fehler beim Senden des Formulars:', error)
      setFormStatus('error')
    }
  }

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode)
    
    // Prevent horizontal scrolling
    document.body.style.overflowX = 'hidden'
    
    return () => {
      document.body.style.overflowX = 'auto'
    }
  }, [isDarkMode])

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault()
    const section = document.getElementById(sectionId)
    if (section) {
      const yOffset = -80 // Adjust this value to account for any fixed headers
      const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
    if (isMenuOpen) {
      setIsMenuOpen(false)
    }
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-black text-white' : 'bg-white text-black'} relative overflow-x-hidden transition-colors duration-300 font-manrope`}>
      <InteractiveNetworkGraph isDarkMode={isDarkMode} />
      
      <header className="container mx-auto py-4 relative z-10">
        <nav className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <Image 
              src={isDarkMode 
                ? "/images/logo-dark.svg"
                : "/images/logo-light.svg"
              }
              alt="AgentFlow Logo" 
              width={120}
              height={32}
              className="mr-2"
              priority
            />
          </Link>
          <div className="md:hidden">
            <button 
              onClick={toggleMenu} 
              className="p-2"
              aria-expanded={isMenuOpen}
              aria-controls="main-menu"
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
              <span className="sr-only">Toggle menu</span>
            </button>
          </div>
          <div 
            id="main-menu"
            className={`${isMenuOpen ? 'block' : 'hidden'} md:flex space-y-4 md:space-y-0 md:space-x-8 flex-col md:flex-row items-center absolute md:relative top-full left-0 right-0 bg-black md:bg-transparent p-4 md:p-0`}
          >
            <NavItem href="#leistungen" isDarkMode={isDarkMode} onClick={(e) => scrollToSection(e, 'leistungen')}>01 LEISTUNGEN</NavItem>
            <NavItem href="#about" isDarkMode={isDarkMode} onClick={(e) => scrollToSection(e, 'about')}>02 ÜBER UNS</NavItem>
            <NavItem href="#kontakt" isDarkMode={isDarkMode} onClick={(e) => scrollToSection(e, 'kontakt')}>03 KONTAKT</NavItem>
            <Button className={`${isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'} rounded-full transition-colors duration-200`}>
              Termin vereinbaren
            </Button>
            <button 
              onClick={toggleDarkMode} 
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <Sun className="h-5 w-5" aria-hidden="true" /> : <Moon className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>
        </nav>
      </header>

      <main className="container mx-auto py-10 md:py-20 relative z-10 px-4">
        <FadeInSection>
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-8 leading-tight">
              KI-Optimierte & Automatisierte Geschäftsprozesse
            </h1>
            <p className={`text-lg md:text-xl mb-8 md:mb-12 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto`}>
              Wir revolutionieren Ihre Geschäftsprozesse durch KI und Automatisierung. Steigern Sie Effizienz, 
              Qualität und Kundenzufriedenheit mit unseren maßgeschneiderten Lösungen.
            </p>
            <div className="flex justify-center">
              <Button className={`${isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'} text-base md:text-lg px-6 md:px-8 py-2 md:py-3 rounded-full transition-colors duration-200 flex items-center`}>
                Kostenlose Beratung
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <p className={`mt-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Wir entdecken neue Anwendungsfälle für Ihr Unternehmen.
            </p>
          </div>
        </FadeInSection>
      </main>

      <section id="leistungen" className="py-20 relative z-10">
        <FadeInSection>
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">Leistungen</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                <CardContent className="p-6 flex flex-col items-center text-center h-full">
                  <Cpu className="h-12 w-12 mb-4 text-primary" />
                  <h3 className="text-xl font-semibold mb-2">Prozessoptimierung durch KI</h3>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Unsere KI-gestützten Lösungen analysieren Ihre bestehenden Geschäftsprozesse und identifizieren Optimierungspotenziale. Durch intelligente Automatisierung steigern wir die Effizienz und reduzieren Fehlerquoten.
                  </p>
                </CardContent>
              </Card>
              <Card className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                <CardContent className="p-6 flex flex-col items-center text-center h-full">
                  <Cog className="h-12 w-12 mb-4 text-primary" />
                  <h3 className="text-xl font-semibold mb-2">Maßgeschneiderte Automatisierungslösungen</h3>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Wir entwickeln individuelle Automatisierungslösungen, die perfekt auf Ihre Unternehmensanforderungen zugeschnitten sind. Unsere Systeme integrieren sich nahtlos in Ihre bestehende Infrastruktur.
                  </p>
                </CardContent>
              </Card>
              <Card className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                <CardContent className="p-6 flex flex-col items-center text-center h-full">
                  <BarChart className="h-12 w-12 mb-4 text-primary" />
                  <h3 className="text-xl font-semibold mb-2">Datengetriebene Entscheidungsunterstützung</h3>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Unsere fortschrittlichen Analysewerkzeuge verwandeln Ihre Daten in wertvolle Erkenntnisse. Mit Machine Learning und prädiktiver Analytik unterstützen wir Ihre Entscheidungsfindung.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </FadeInSection>
      </section>

      <section id="about" className="py-20 relative z-10">
        <FadeInSection>
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">Über uns</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold">Unser Team</h3>
                <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  AgentFlow verfügt über langjährige Erfahrung aus akademischer Laufbahn und unserem Portfolio. Wir blicken auf jahrelange Erfahrungen in der Prozessmodellierung, -optimierung und Automatisierung zurück.
                </p>
                <div className="flex items-center space-x-4">
                  <GraduationCap className="h-8 w-8 text-primary" />
                  <span className="text-lg font-medium">Akademische Expertise</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Briefcase className="h-8 w-8 text-primary" />
                  <span className="text-lg font-medium">Umfangreiches Portfolio</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Clock className="h-8 w-8 text-primary" />
                  <span className="text-lg font-medium">Langjährige Erfahrung</span>
                </div>
              </div>
              <div className="relative">
                <div className={`absolute inset-0 bg-gradient-to-br from-primary to-secondary opacity-20 rounded-lg transform rotate-3`}></div>
                <Image
                  src="/images/team-at-work.jpg"
                  alt="Team at work"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg relative z-10"
                />
              </div>
            </div>
          </div>
        </FadeInSection>
      </section>

      <section id="kontakt" className="py-20 relative z-10">
        <FadeInSection>
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-8">Kontaktieren Sie uns</h2>
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="Max Mustermann"
                    className={`w-full ${isDarkMode ? '!bg-gray-800 !text-white' : '!bg-white !text-black'} transition-colors duration-200`}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">E-Mail</label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="max.mustermann@example.com"
                    className={`w-full ${isDarkMode ? '!bg-gray-800 !text-white' : '!bg-white !text-black'} transition-colors duration-200`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Bereich</label>
                  <RadioGroup defaultValue="vermietung" name="bereich" className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="vermietung" id="vermietung" />
                      <Label htmlFor="vermietung">Vermietung</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="unternehmen" id="unternehmen" />
                      <Label htmlFor="unternehmen">Unternehmen</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="social-media" id="social-media" />
                      <Label htmlFor="social-media">Social Media</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sonstiges" id="sonstiges" />
                      <Label htmlFor="sonstiges">Sonstiges</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">Nachricht</label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    placeholder="Ich interessiere mich für Ihre KI-Lösungen und möchte mehr erfahren..."
                    className={`w-full ${isDarkMode ? '!bg-gray-800 !text-white' : '!bg-white !text-black'} transition-colors duration-200`}
                  />
                </div>
                <div>
                  <Button
                    type="submit"
                    disabled={formStatus === 'submitting'}
                    className={`w-full ${isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'} rounded-full transition-colors duration-200 flex items-center justify-center`}
                  >
                    {formStatus === 'submitting' ? 'Wird gesendet...' : 'Nachricht senden'}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
                {formStatus === 'success' && (
                  <p className="text-green-500 text-center">Ihre Nachricht wurde erfolgreich gesendet!</p>
                )}
                {formStatus === 'error' && (
                  <p className="text-red-500 text-center">Es gab einen Fehler beim Senden Ihrer Nachricht. Bitte versuchen Sie es später erneut.</p>
                )}
              </form>
            </div>
          </div>
        </FadeInSection>
      </section>

      <footer className={`py-16 relative z-10 ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>Kontakt</h3>
              <p className={isDarkMode ? 'text-gray-300' : 'text-black'}>
                Email: info@agentflow-integrations.com<br />
                Adresse: Uasterstigh 3, 25946 Nebel
              </p>
            </div>
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>Links</h3>
              <ul className={`space-y-2 ${isDarkMode ? 'text-gray-300' : 'text-black'}`}>
                <li><Link href="/impressum" className={`hover:${isDarkMode ? 'text-white' : 'text-gray-600'} transition-colors duration-200`}>Impressum</Link></li>
                <li><Link href="/datenschutz" className={`hover:${isDarkMode ? 'text-white' : 'text-gray-600'} transition-colors duration-200`}>Datenschutzerklärung</Link></li>
              </ul>
            </div>
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>Folgen Sie uns</h3>
              <div className="flex space-x-4">
                <a href="#" className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-black hover:text-gray-600'} transition-colors duration-200`}>
                  <Instagram className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
          <div className={`mt-8 pt-8 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
            <p className={`text-center ${isDarkMode ? 'text-gray-300' : 'text-black'}`}>
              © {new Date().getFullYear()} AgentFlow. Alle Rechte vorbehalten.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}