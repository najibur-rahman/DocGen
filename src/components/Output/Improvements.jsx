import React, { useState } from 'react'
import { useAI } from '../../hooks/useAI'

const TYPE_COLORS = {
  critical: 'bg-red-50 border-red-100 text-red-700',
  improvement: 'bg-amber-50 border-amber-100 text-amber-700',
  enhancement: 'bg-blue-50 border-blue-100 text-blue-700',
}
const TYPE_ICONS = { critical: '🚨', improvement: '💡', enhancement: '✨' }

export default function Improvements({ content, onApply }) {
  const { getImprovements, loading } = useAI()
  const [result, setResult] = useState(null)
  const [ran, setRan] = useState(false)

  async function run() {
    setRan(true)
    const r = await getImprovements(content, 'full document')
    setResult(r)
  }

  if (!ran) return (
    <button onClick={run} className="w-full btn-secondary flex items-center justify-center gap-2 py-3">
      💡 AI Suggestions নাও
    </button>
  )

  if (loading) return (
    <div className="text-center py-6">
      <div className="w-8 h-8 border-2 border-brand-200 border-t-brand-500 rounded-full animate-spin mx-auto mb-2" />
      <p className="text-sm text-gray-500">Analyzing your document...</p>
    </div>
  )

  if (!result) return null

  return (
    <div className="animate-fade-in space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-900">AI Suggestions</p>
        <span className="text-xs text-gray-400">Document score: {result.score}/100</span>
      </div>

      {(result.suggestions || []).map((s, i) => (
        <div key={i} className={`border rounded-xl px-3 py-2.5 text-xs leading-relaxed ${TYPE_COLORS[s.type] || TYPE_COLORS.enhancement}`}>
          <span className="mr-1">{TYPE_ICONS[s.type] || '💡'}</span>
          {s.text}
        </div>
      ))}

      {result.improved_version && (
        <div className="border border-brand-100 rounded-xl p-3 bg-brand-50">
          <p className="text-xs font-semibold text-brand-700 mb-2">✨ Improved version available</p>
          <p className="text-xs text-brand-600 line-clamp-3">{result.improved_version.slice(0, 150)}...</p>
          <button onClick={() => onApply(result.improved_version)} className="mt-2 text-xs text-brand-600 font-medium hover:underline">
            Apply improved version →
          </button>
        </div>
      )}
    </div>
  )
}
