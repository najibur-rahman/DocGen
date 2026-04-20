import { useState, useCallback } from 'react'
import {
  buildCVPrompt, buildResumePrompt, buildSOPPrompt,
  buildCoverLetterPrompt, buildLinkedInPrompt,
  buildJDAnalyzerPrompt, buildATSScorePrompt,
  buildImprovementPrompt, buildSectionRegenPrompt,
} from '../prompts/index.js'

const BUILDERS = {
  cv: buildCVPrompt,
  resume: buildResumePrompt,
  sop: buildSOPPrompt,
  cover: buildCoverLetterPrompt,
  linkedin: buildLinkedInPrompt,
}

async function callAPI(prompt, options = {}) {
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, ...options }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Server error ${res.status}`)
  }
  const data = await res.json()
  return data.content
}

export function useAI() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // ── Generate single document ─────────────────────────────────────────────
  const generate = useCallback(async (docType, formData, jdContext = '') => {
    setLoading(true); setError(null)
    try {
      const builder = BUILDERS[docType]
      if (!builder) throw new Error('Unknown document type')
      const prompt = builder(formData, jdContext)
      return await callAPI(prompt)
    } catch (err) {
      setError(err.message); return null
    } finally {
      setLoading(false)
    }
  }, [])

  // ── Generate 3 versions simultaneously ──────────────────────────────────
  const generateMultiple = useCallback(async (docType, formData, jdContext = '') => {
    setLoading(true); setError(null)
    try {
      const builder = BUILDERS[docType]
      if (!builder) throw new Error('Unknown document type')

      const tones = ['confident and direct', 'formal and traditional', 'warm and personable']
      const labels = ['Confident', 'Formal', 'Warm']

      const promises = tones.map(tone =>
        callAPI(builder({ ...formData, tone }, jdContext))
      )
      const results = await Promise.all(promises)
      return results.map((content, i) => ({ label: labels[i], tone: tones[i], content }))
    } catch (err) {
      setError(err.message); return null
    } finally {
      setLoading(false)
    }
  }, [])

  // ── ATS Score ────────────────────────────────────────────────────────────
  const checkATS = useCallback(async (content) => {
    setLoading(true); setError(null)
    try {
      const raw = await callAPI(buildATSScorePrompt(content), { json: true })
      return JSON.parse(raw.replace(/```json\n?|```/g, '').trim())
    } catch (err) {
      setError(err.message); return null
    } finally {
      setLoading(false)
    }
  }, [])

  // ── JD Analyzer ──────────────────────────────────────────────────────────
  const analyzeJD = useCallback(async (jd, existingCV) => {
    setLoading(true); setError(null)
    try {
      const raw = await callAPI(buildJDAnalyzerPrompt(jd, existingCV), { json: true })
      return JSON.parse(raw.replace(/```json\n?|```/g, '').trim())
    } catch (err) {
      setError(err.message); return null
    } finally {
      setLoading(false)
    }
  }, [])

  // ── Improvement suggestions ───────────────────────────────────────────────
  const getImprovements = useCallback(async (content, section) => {
    setLoading(true); setError(null)
    try {
      const raw = await callAPI(buildImprovementPrompt(content, section), { json: true })
      return JSON.parse(raw.replace(/```json\n?|```/g, '').trim())
    } catch (err) {
      setError(err.message); return null
    } finally {
      setLoading(false)
    }
  }, [])

  // ── Section regenerate ────────────────────────────────────────────────────
  const regenerateSection = useCallback(async (sectionName, sectionContent, formData, instruction = '') => {
    setLoading(true); setError(null)
    try {
      return await callAPI(buildSectionRegenPrompt(sectionName, sectionContent, formData, instruction))
    } catch (err) {
      setError(err.message); return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { generate, generateMultiple, checkATS, analyzeJD, getImprovements, regenerateSection, loading, error }
}
