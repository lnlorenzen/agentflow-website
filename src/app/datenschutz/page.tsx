'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Sun, Moon, Menu, Instagram } from 'lucide-react'

export default function DatenschutzPage() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-black text-white' : 'bg-white text-black'} relative overflow-x-hidden transition-colors duration-300 font-manrope`}>
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
            <Link href="/" className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'} transition-colors duration-200`}>
              Startseite
            </Link>
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

      <main className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Zurück zur Startseite
        </Link>
        <h1 className="text-4xl font-bold mb-8">Datenschutzerklärung</h1>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">1. Datenschutz auf einen Blick</h2>
          <h3 className="text-xl font-semibold mb-2">Allgemeine Hinweise</h3>
          <p className="mb-4">
            Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
          </p>
          <h3 className="text-xl font-semibold mb-2">Datenerfassung auf dieser Website</h3>
          <h4 className="text-lg font-semibold mb-2">Wer ist verantwortlich für die Datenerfassung auf dieser Website?</h4>
          <p className="mb-4">
            Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.
          </p>
          <h4 className="text-lg font-semibold mb-2">Wie erfassen wir Ihre Daten?</h4>
          <p className="mb-4">
            Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z.B. um Daten handeln, die Sie in ein Kontaktformular eingeben.
          </p>
          <p className="mb-4">
            Andere Daten werden automatisch beim Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor allem technische Daten (z.B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs). Die Erfassung dieser Daten erfolgt automatisch, sobald Sie diese Website betreten.
          </p>
          <h4 className="text-lg font-semibold mb-2">Wofür nutzen wir Ihre Daten?</h4>
          <p className="mb-4">
            Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten. Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden.
          </p>
          <h4 className="text-lg font-semibold mb-2">Welche Rechte haben Sie bezüglich Ihrer Daten?</h4>
          <p className="mb-4">
            Sie haben jederzeit das Recht unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung, Sperrung oder Löschung dieser Daten zu verlangen. Hierzu sowie zu weiteren Fragen zum Thema Datenschutz können Sie sich jederzeit unter der im Impressum angegebenen Adresse an uns wenden. Des Weiteren steht Ihnen ein Beschwerderecht bei der zuständigen Aufsichtsbehörde zu.
          </p>
        </div>
      </main>

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