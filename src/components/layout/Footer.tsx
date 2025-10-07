export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200" role="contentinfo">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">EduAssist</h3>
            <p className="text-gray-600 mb-4">
              Making campus life more accessible to visually and hearing-impaired students 
              through innovative technology solutions.
            </p>
            <p className="text-sm text-gray-500">
              Built with accessibility-first design principles and WCAG 2.1 AA compliance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#features" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">
                  Features
                </a>
              </li>
              <li>
                <a href="/tts" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">
                  Text-to-Speech
                </a>
              </li>
              <li>
                <a href="/captions" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">
                  Auto Captions
                </a>
              </li>
              <li>
                <a href="/braille" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">
                  Braille Converter
                </a>
              </li>
              <li>
                <a href="/voice" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">
                  Voice Navigation
                </a>
              </li>
            </ul>
          </div>

          {/* Accessibility */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Accessibility
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="/accessibility" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">
                  Accessibility Statement
                </a>
              </li>
              <li>
                <a href="/help" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">
                  Help & Support
                </a>
              </li>
              <li>
                <a href="/keyboard-shortcuts" className="text-gray-600 hover:text-primary-600 transition-colors duration-200">
                  Keyboard Shortcuts
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              © 2024 EduAssist. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <p className="text-sm text-gray-500">
                Powered by Google Cloud APIs
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}