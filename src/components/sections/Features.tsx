export function Features() {
  const features = [
    {
      id: 'tts',
      title: 'Text-to-Speech (TTS)',
      description: 'Converts announcements, lecture notes, and campus updates into speech using Google Cloud Text-to-Speech API.',
      features: [
        'Multiple languages and voice options',
        'Natural-sounding AI voices',
        'Adjustable speech rate and pitch',
        'Offline content reading'
      ],
      icon: '🔊',
      link: '/tts'
    },
    {
      id: 'stt',
      title: 'Speech-to-Text (Voice Commands)',
      description: 'Navigate, fill forms, or search using voice commands powered by Google Cloud Speech-to-Text API.',
      features: [
        'Real-time voice recognition',
        'Natural language commands',
        'Hands-free navigation',
        'Form completion assistance'
      ],
      icon: '🎙️',
      link: '/voice'
    },
    {
      id: 'captions',
      title: 'Automatic Subtitles & Captions',
      description: 'Auto-generates captions for lecture videos using Google Cloud Video Intelligence and Speech-to-Text APIs.',
      features: [
        'Real-time caption generation',
        'Editable transcripts',
        'Export capabilities',
        'Multi-language support'
      ],
      icon: '🎬',
      link: '/captions'
    },
    {
      id: 'braille',
      title: 'Braille Converter',
      description: 'Convert lectures, speeches, and important notes into Grade 1 or Grade 2 Braille format for tactile reading.',
      features: [
        'Grade 1 & 2 Braille support',
        'File upload (TXT, PDF, DOC)',
        'Print-ready BRF format',
        'Visual Braille display'
      ],
      icon: '⠃',
      link: '/braille'
    },
    {
      id: 'interface',
      title: 'Accessible Interface',
      description: 'Designed with accessibility-first principles for seamless integration with assistive technologies.',
      features: [
        'High-contrast mode',
        'Adjustable font sizes',
        'ARIA labels and landmarks',
        'Keyboard navigation support'
      ],
      icon: '🌐',
      link: '/accessibility'
    },
    {
      id: 'translation',
      title: 'Multilingual Support',
      description: 'Translate transcripts, captions, and UI text using Google Cloud Translation API.',
      features: [
        'Real-time translation',
        'Regional language support',
        'Content localization',
        'Cultural adaptation'
      ],
      icon: '🗣️',
      link: '/translate'
    }
  ]

  return (
    <section id="features" className="py-20 bg-white" aria-labelledby="features-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 id="features-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Core Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive accessibility tools powered by Google Cloud APIs to support 
            students with visual and hearing impairments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className="card hover:shadow-lg transition-shadow duration-300"
              tabIndex={0}
              role="article"
              aria-labelledby={`feature-${feature.id}-title`}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl" role="img" aria-hidden="true">
                    {feature.icon}
                  </span>
                </div>
                <h3 id={`feature-${feature.id}-title`} className="text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>
              </div>

              <p className="text-gray-600 mb-6">
                {feature.description}
              </p>

              <ul className="space-y-2 mb-6" role="list">
                {feature.features.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start">
                    <span className="text-primary-600 mr-2 mt-1" aria-hidden="true">✓</span>
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>

              <a
                href={feature.link}
                className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
                aria-label={`Learn more about ${feature.title}`}
              >
                Learn More
                <span className="ml-2" aria-hidden="true">→</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}