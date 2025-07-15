import { Link } from "wouter";
import {
  Home,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Send,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Home className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold">Master-House</span>
            </div>
            <p className="text-gray-400 mb-6">
              Profesjonelle tjenester i din by. Finn kvalifiserte håndverkere
              raskt og pålitelig.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Send className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">Tjenester</h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                <Link href="/services/plumbing">
                  <span className="hover:text-white transition-colors">
                    VVS
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/services/electrical">
                  <span className="hover:text-white transition-colors">
                    Elektriker
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/services/cleaning">
                  <span className="hover:text-white transition-colors">
                    Rengjøring
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/services/renovation">
                  <span className="hover:text-white transition-colors">
                    Reparasjon
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/services/appliances">
                  <span className="hover:text-white transition-colors">
                    Hvitevarer
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">Firma</h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                <Link href="/about">
                  <span className="hover:text-white transition-colors">
                    Om oss
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/how-it-works">
                  <span className="hover:text-white transition-colors">
                    Hvordan det fungerer
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/profile">
                  <span className="hover:text-white transition-colors">
                    Bli håndverker
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/support">
                  <span className="hover:text-white transition-colors">
                    Kundeservice
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/blog">
                  <span className="hover:text-white transition-colors">
                    Blogg
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">Kontakt</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-3" />
                <span>+47 93 98 94 94</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-3" />
                <span>kolyn607@gmail.com</span>
              </li>
              <li className="flex items-start">
                <MapPin className="h-4 w-4 mr-3 mt-1" />
                <span>Oslo, Karl Johans gate 1</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
          <p>&copy;2024 Master-House. Alle rettigheter reservert.</p>
        </div>
      </div>
    </footer>
  );
}
