import React, { useState } from 'react'
import { useAI } from '../../hooks/useAI'

function ScoreRing({ score }) {
  const r = 40, c = 2 * Math.PI * r
  const offset = c - (score / 100) * c
  const color = score >= 80 ? '#059669' : score >= 60 ? '#d97706' : '#dc2626'
  return (
    <svg width="100" height="100" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={r} fill="none" stroke="#f3f4f6" strokeWidth="8" />
      <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        transform="rotate(-90 50 50)"
        style={{ transition: 'stroke-dashoffset 1.2s ease' }}
      />
      <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" fontSize="20" fontWeight="700" fill={color}>{score}</text>
      <text x="50" y="65" textAnchor="middle" dominantBaseline="middle" fontSize="10" fill="#9ca3af">/ 100</text>
    </svg>
  )
}

export default function ATSChecker({ content }) {
  const { checkATS, loading } = useAI()
  const [result, setResult] = useState(null)
  const [ran, setRan] = useState(false)

  async function run() {
    setRan(true)
    const r = await checkATS(content)
    setResult(r)
  }

  if (!ran) return (
    <button onClick={run} className="w-full btn-secondary flex items-center justify-center gap-2 py-3">
      🤖 ATS Score Check করো
    </button>
  )

  if (loading) return (
    <div className="text-center py-6">
      <div className="w-8 h-8 border-2 border-brand-200 border-t-brand-500 rounded-full animate-spin mx-auto mb-2" />
      <p className="text-sm text-gray-500">ATS analysis চলছে...</p>
    </div>
  )

  if (!result) return null

  const label = result.overall_score >= 80 ? 'Excellent' : result.overall_score >= 60 ? 'Good' : 'Needs Work'
  const labelColor = result.overall_score >= 80 ? 'text-green-600' : result.overall_score >= 60 ? 'text-amber-600' : 'text-red-600'

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-5 mb-4">
        <ScoreRing score={result.overall_score} />
        <div>
          <p className="text-sm text-gray-500">ATS Compatibility</p>
          <p className={`text-2xl font-bold ${labelColor}`}>{label}</p>
          <div className="flex gap-3 mt-2 text-xs text-gray-500">
            {Object.entries(result.breakdown || {}).map(([k, v]) => (
              <span key={k}>{k.replace('_',' ')}: <strong>{v}</strong></span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <div className="bg-green-50 border border-green-100 rounded-xl p-3">
          <p className="text-xs font-semibold text-green-700 mb-2">✅ Strengths</p>
          {(result.strengths || []).map((s,i) => <p key={i} className="text-xs text-green-700 mb-1">• {s}</p>)}
        </div>
        <div className="bg-red-50 border border-red-100 rounded-xl p-3">
          <p className="text-xs font-semibold text-red-700 mb-2">⚠️ Issues</p>
          {(result.issues || []).map((s,i) => <p key={i} className="text-xs text-red-700 mb-1">• {s}</p>)}
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
        <p className="text-xs font-semibold text-amber-700 mb-2">⚡ Quick Fixes</p>
        {(result.quick_fixes || []).map((s,i) => <p key={i} className="text-xs text-amber-700 mb-1">{i+1}. {s}</p>)}
      </div>
    </div>
  )
}
