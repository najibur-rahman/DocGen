import React, { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'

const DOC_TYPES = [
  { id: 'cv', icon: '📄', title: 'CV', sub: 'Academic & Professional', desc: 'Full CV with all sections', badge: 'Popular' },
  { id: 'resume', icon: '📋', title: 'Resume', sub: '1-Page ATS-Optimized', desc: 'Passes automated screening' },
  { id: 'sop', icon: '🎓', title: 'SOP', sub: 'Statement of Purpose', desc: 'University & scholarship admission' },
  { id: 'cover', icon: '✉️', title: 'Cover Letter', sub: 'Job Application', desc: 'Tailored to job description' },
  { id: 'linkedin', icon: '💼', title: 'LinkedIn Bio', sub: 'About & Headline', desc: 'Attract recruiters organically' },
]

const FEATURES = [
  { icon: '🎯', title: 'JD Analyzer', desc: 'Paste a job description — AI tailors your CV automatically' },
  { icon: '🤖', title: 'ATS Score', desc: 'See how well your resume scores against ATS systems' },
  { icon: '✨', title: '3 Versions', desc: 'Get 3 different versions simultaneously, pick the best' },
  { icon: '🔄', title: 'Section Regenerate', desc: "Don't like a section? Regenerate just that part" },
  { icon: '💡', title: 'AI Suggestions', desc: 'Get specific improvement tips from AI' },
  { icon: '🇧🇩', title: 'Bangla Support', desc: 'Generate documents in Bengali language' },
]

export default function Landing({ onStart }) {
  const [selected, setSelected] = useState(null)
  const { user, signInWithGoogle } = useAuth()

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-brand-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">D</div>
            <span className="font-semibold text-gray-900">DocGen AI</span>
            <span className="badge bg-brand-50 text-brand-600 border border-brand-100">v2.0</span>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <img src={user.user_metadata?.avatar_url} alt="" className="w-7 h-7 rounded-full" />
                <span className="text-sm text-gray-600 hidden sm:block">{user.user_metadata?.full_name?.split(' ')[0]}</span>
              </div>
            ) : (
              <button onClick={signInWithGoogle} className="btn-ghost text-sm">
                Sign in with Google
              </button>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6">
        {/* Hero */}
        <div className="text-center pt-16 pb-12">
          <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-600 text-sm font-medium px-4 py-2 rounded-full mb-5 border border-brand-100">
            <span>✨</span> Powered by Gemini 2.0 Flash
          </div>
          <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-5">
            Professional documents,<br />
            <span className="text-brand-500">AI দিয়ে সেকেন্ডে</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-xl mx-auto mb-8">
            CV, Resume, SOP, Cover Letter — ATS score, JD analysis, multiple versions সহ।
            <br />বাংলা ও English দুটোতেই।
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 text-sm text-gray-400 mb-12">
            <span>⚡ 15s generation</span>
            <span>🎨 5 templates</span>
            <span>📊 ATS scoring</span>
            <span>🇧🇩 Bangla support</span>
          </div>
        </div>

        {/* Doc type selection */}
        <div className="mb-4">
          <p className="text-center text-sm font-medium text-gray-500 mb-4">কী বানাতে চাও? একটি select করো</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
            {DOC_TYPES.map(doc => (
              <button
                key={doc.id}
                onClick={() => setSelected(doc.id)}
                className={`relative text-left p-4 rounded-2xl border-2 transition-all duration-200 bg-white hover:-translate-y-1 ${
                  selected === doc.id
                    ? 'border-brand-500 bg-brand-50 shadow-lg shadow-brand-100'
                    : 'border-gray-100 hover:border-brand-200 hover:shadow-md'
                }`}
              >
                {doc.badge && (
                  <span className="absolute -top-2 -right-2 bg-brand-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {doc.badge}
                  </span>
                )}
                <div className="text-2xl mb-2">{doc.icon}</div>
                <div className="font-semibold text-gray-900 text-sm">{doc.title}</div>
                <div className="text-[11px] text-brand-500 font-medium mt-0.5">{doc.sub}</div>
                {selected === doc.id && (
                  <div className="mt-2 text-[11px] text-brand-600 font-medium">✓ Selected</div>
                )}
              </button>
            ))}
          </div>

          <div className="flex flex-col items-center gap-3">
            <button
              onClick={() => selected && onStart(selected)}
              disabled={!selected}
              className="btn-primary text-base px-10 py-3 text-lg"
            >
              শুরু করো →
            </button>
            {!user && (
              <p className="text-xs text-gray-400">
                <button onClick={signInWithGoogle} className="text-brand-500 hover:underline">Sign in</button> করলে documents save হবে
              </p>
            )}
          </div>
        </div>

        {/* Features grid */}
        <div className="py-16 border-t border-gray-100 mt-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">V2 এর নতুন features</h2>
          <p className="text-gray-500 text-center mb-10">অন্য কোনো CV builder এ এগুলো নেই</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map(f => (
              <div key={f.title} className="card p-5">
                <div className="text-2xl mb-3">{f.icon}</div>
                <div className="font-semibold text-gray-900 mb-1">{f.title}</div>
                <div className="text-sm text-gray-500 leading-relaxed">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
