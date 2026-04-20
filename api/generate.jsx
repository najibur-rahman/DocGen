// api/generate.js — Vercel Serverless Function
// Gemini 2.0 Flash — API key secure থাকে server এ

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { prompt, json } = req.body || {}
  if (!prompt || typeof prompt !== 'string') return res.status(400).json({ error: 'prompt required' })
  if (prompt.length > 10000) return res.status(400).json({ error: 'Prompt too long' })

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'Server config error' })

  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`

    const body = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 2048,
        topP: 0.95,
        ...(json ? { responseMimeType: 'application/json' } : {}),
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
      ],
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}))
      const msg = errData?.error?.message || `Gemini API error ${response.status}`
      return res.status(response.status).json({ error: msg })
    }

    const data = await response.json()

    // Extract text from Gemini response
    const content = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
    if (!content) return res.status(500).json({ error: 'Empty response from Gemini' })

    return res.status(200).json({ content })
  } catch (err) {
    console.error('Generate error:', err)
    return res.status(500).json({ error: 'Internal server error: ' + err.message })
  }
}
