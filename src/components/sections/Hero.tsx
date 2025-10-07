export function Hero() {
  return (
    <section id="home" className="bg-gradient-to-r from-primary-50 to-blue-50 py-20" aria-labelledby="hero-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 id="hero-heading" className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Campus Life Made{' '}
            <span className="text-primary-600">Accessible</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            EduAssist provides tools like voice navigation, automatic captioning, 
            and text-to-speech content reading to help visually and hearing-impaired 
            students navigate campus life with ease.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button className="btn-primary text-lg px-8 py-4">
              Get Started
            </button>
            <button className="btn-secondary text-lg px-8 py-4">
              Learn More
            </button>
          </div>
          
          {/* Accessibility Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-16">
            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl" role="img" aria-label="Voice">🔊</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Voice Navigation</h3>
              <p className="text-gray-600">
                Navigate the platform using simple voice commands like "Open timetable" or "Show library schedule"
              </p>
            </div>
            
            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl" role="img" aria-label="Captions">🎬</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Auto Captions</h3>
              <p className="text-gray-600">
                Automatically generate captions for lecture videos with editing and export capabilities
              </p>
            </div>
            
            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl" role="img" aria-label="Text to Speech">🗣️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Text-to-Speech</h3>
              <p className="text-gray-600">
                Convert announcements, lecture notes, and campus updates into natural-sounding speech
              </p>
            </div>
            
            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl" role="img" aria-label="Braille">⠃</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Braille Converter</h3>
              <p className="text-gray-600">
                Transform lectures and notes into Grade 1 or Grade 2 Braille format for tactile reading
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}