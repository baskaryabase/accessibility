import { NextRequest, NextResponse } from 'next/server'
import { SpeechClient } from '@google-cloud/speech'
import { v2 as translate } from '@google-cloud/translate'

// Initialize clients
const speechClient = new SpeechClient()
const { Translate } = translate
const translateClient = new Translate()

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio') as File
    const languageCode = formData.get('languageCode') as string || 'en-US'
    const enableTranslation = formData.get('enableTranslation') === 'true'
    const targetLanguage = formData.get('targetLanguage') as string

    if (!audioFile) {
      return NextResponse.json(
        { error: 'Audio file is required' },
        { status: 400 }
      )
    }

    // Convert File to Buffer
    const bytes = await audioFile.arrayBuffer()
    const audioBytes = new Uint8Array(bytes)

    // Configure the speech recognition request
    const audio = {
      content: Buffer.from(audioBytes).toString('base64'),
    }

    const config = {
      encoding: 'WEBM_OPUS' as const,
      sampleRateHertz: 48000,
      languageCode,
      enableAutomaticPunctuation: true,
      enableWordTimeOffsets: true,
      model: 'latest_long',
    }

    const speechRequest = {
      audio,
      config,
    }

    // Perform the speech recognition
    const [response] = await speechClient.recognize(speechRequest)
    const transcription = response.results
      ?.map(result => result.alternatives?.[0]?.transcript)
      .join('\n') || ''

    let translatedText = transcription
    
    // Translate if requested
    if (enableTranslation && targetLanguage && transcription) {
      try {
        const [translation] = await translateClient.translate(transcription, {
          from: languageCode,
          to: targetLanguage,
        })
        translatedText = translation
      } catch (translateError) {
        console.error('Translation error:', translateError)
        // Continue with original transcription if translation fails
      }
    }

    return NextResponse.json({
      transcription,
      translatedText: enableTranslation ? translatedText : undefined,
      confidence: response.results?.[0]?.alternatives?.[0]?.confidence || 0,
      wordTimeOffsets: response.results?.[0]?.alternatives?.[0]?.words || [],
    })

  } catch (error) {
    console.error('Speech-to-text error:', error)
    return NextResponse.json(
      { error: 'Failed to transcribe audio' },
      { status: 500 }
    )
  }
}