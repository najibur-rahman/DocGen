import React, { useState } from 'react'
import { useExport } from '../../hooks/useExport'
import { useAI } from '../../hooks/useAI'
import { useAuth } from '../../hooks/useAuth'
import { saveDocument } from '../../lib/supabase'
import ATSChecker from './ATSChecker'
import Improvements from './Improvements'
import TemplatePicker from '../Templates/TemplatePicker'
import toast from 'react-hot-toast'

const DOC_LABELS = { cv:'CV', resume:'Resume', sop:'SOP', cover:'Cover Letter', linkedin:'LinkedIn Bio' }

// ── Multiple versions picker ────────────────────────────────────────────────
function VersionPicker({ versions, onSelect }) {
  const [selected, setSelected] = useState(0)
  return (
    <div className="animate-slide-up">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">3টা version তৈরি হয়েছে!</h2>
      <p className="text-sm text-gray-500 mb-5">একটা select করো, তারপর edit ও export করতে পারবে।</p>
      <div className="space-y-3 mb-6">
        {versions.map((v, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
              selected === i ? 'border-brand-500 bg-brand-50' : 'border-gray-100 hover:border-brand-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-sm text-gray-900">{v.label} Version</span>
              {selected === i && <span className="badge bg-brand-100 text-brand-600">Selected</span>}
            </div>
            <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">{v.content.slice(0, 180)}...</p>
          </button>
        ))}
      </div>
      <button onClick={() => onSelect(versions[selected].content)} className="btn-primary w-full py-3">
        এই version দিয়ে continue করো →
      </button>
    </div>
  )
}

// ── Main Output ─────────────────────────────────────────────────────────────
export default function Output({ content: initialContent, versions, docType, formData, onNew, onRegenerate, regenerating }) {
  const [content, setContent] = useState(initialContent)
  const [selectedVersion, setSelectedVersion] = useState(null)
  const [activeTab, setActiveTab] = useState('preview')
  const [sideTab, setSideTab] = useState('export')
  const [template, setTemplate] = useState('modern')
  const [colorTheme, setColorTheme] = useState('purple')
  const [copied, setCopied] = useState(false)
  const [exporting, setExporting] = useState(null)
  const [saving, setSaving] = useState(false)

  const { downloadPDF, downloadDOCX, downloadTxt, copyToClipboard } = useExport()
  const { regenerateSection, loading: aiLoading } = useAI()
  const { user } = useAuth()

  // Show version picker if multiple versions and not yet selected
  if (versions && !selectedVersion && !initialContent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-start justify-center pt-16 px-6">
        <div className="max-w-2xl w-full">
          <VersionPicker versions={versions} onSelect={v => { setSelectedVersion(v); setContent(v) }} />
        </div>
      </div>
    )
  }

  const displayContent = selectedVersion || content
  const filename = `${DOC_LABELS[docType]}_${formData?.name || 'document'}`.replace(/\s+/g,'_')
  const wordCount = displayContent.trim().split(/\s+/).filter(Boolean).length

  async function handleExport(type) {
    setExporting(type)
    try {
      if (type === 'pdf') await downloadPDF(displayContent, filename, template, colorTheme)
      else if (type === 'docx') await downloadDOCX(displayContent, filename, template)
      else downloadTxt(displayContent, filename)
      toast.success(`${type.toUpperCase()} downloaded!`)
    } catch(e) { toast.error('Export failed: ' + e.message) }
    setExporting(null)
  }

  async function handleCopy() {
    await copyToClipboard(displayContent)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
    toast.success('Copied!')
  }

  async function handleSave() {
    if (!user) { toast.error('Save করতে Google দিয়ে login করো'); return }
    setSaving(true)
    try {
      await saveDocument({ userId: user.id, docType, title: `${DOC_LABELS[docType]} — ${formData?.name || 'Untitled'}`, content: displayContent, formData, templateId: template })
      toast.success('Document saved!')
    } catch(e) { toast.error('Save failed') }
    setSaving(false)
  }

  const SIDE_TABS = [
    { id: 'export', label: 'Export', icon: '📤' },
    { id: 'template', label: 'Template', icon: '🎨' },
    { id: 'ats', label: 'ATS Score', icon: '🤖' },
    { id: 'improve', label: 'Improve', icon: '💡' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">D</div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">{DOC_LABELS[docType]}</span>
                <span className="badge bg-green-50 text-green-600 border border-green-100">✓ Generated</span>
              </div>
              <p className="text-xs text-gray-400">{wordCount} words</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleSave} disabled={saving} className="btn-ghost text-sm">
              {saving ? '...' : user ? '💾 Save' : '🔒 Save (login)'}
            </button>
            <button onClick={onRegenerate} disabled={regenerating} className="btn-ghost text-sm">
              {regenerating ? <span className="animate-spin inline-block">↺</span> : '↺'} Regenerate
            </button>
            <button onClick={onNew} className="btn-secondary text-sm">+ New</button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* ── Main content ── */}
          <div className="lg:col-span-2">
            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-4">
              {['preview','edit'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
                    activeTab===tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}>
                  {tab==='preview' ? '👁 Preview' : '✏️ Edit'}
                </button>
              ))}
            </div>

            {activeTab === 'preview' ? (
              <div className="card p-6 min-h-96 animate-fade-in">
                <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800 leading-relaxed">{displayContent}</pre>
              </div>
            ) : (
              <div className="animate-fade-in">
                <p className="text-xs text-gray-400 mb-2">সরাসরি edit করো — changes auto-save হবে।</p>
                <textarea
                  className="w-full card p-6 font-mono text-sm text-gray-800 leading-relaxed min-h-96 focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
                  value={displayContent}
                  onChange={e => setContent(e.target.value)}
                  rows={30}
                />
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-4">
            {/* Side tab switcher */}
            <div className="card p-1 grid grid-cols-4 gap-1">
              {SIDE_TABS.map(t => (
                <button key={t.id} onClick={() => setSideTab(t.id)}
                  className={`flex flex-col items-center gap-0.5 py-2 rounded-xl text-xs font-medium transition-all ${
                    sideTab===t.id ? 'bg-brand-500 text-white' : 'text-gray-500 hover:bg-gray-50'
                  }`}>
                  <span className="text-base">{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </div>

            <div className="card p-5">
              {/* Export tab */}
              {sideTab==='export' && (
                <div className="space-y-2.5">
                  <p className="text-sm font-semibold text-gray-900 mb-3">Download</p>
                  <button onClick={() => handleExport('pdf')} disabled={exporting==='pdf'} className="btn-primary w-full py-2.5">
                    {exporting==='pdf' ? '⏳ Generating...' : '📄 Download PDF'}
                  </button>
                  <button onClick={() => handleExport('docx')} disabled={exporting==='docx'} className="btn-secondary w-full py-2.5">
                    {exporting==='docx' ? '⏳...' : '📝 Download Word (.docx)'}
                  </button>
                  <button onClick={() => handleExport('txt')} className="btn-ghost w-full py-2">
                    📋 Download Text (.txt)
                  </button>
                  <div className="border-t border-gray-50 pt-2.5">
                    <button onClick={handleCopy} className="btn-ghost w-full py-2">
                      {copied ? '✅ Copied!' : '⧉ Copy to Clipboard'}
                    </button>
                  </div>
                </div>
              )}

              {/* Template tab */}
              {sideTab==='template' && (
                <TemplatePicker
                  selectedTemplate={template}
                  selectedColor={colorTheme}
                  onTemplateChange={setTemplate}
                  onColorChange={setColorTheme}
                />
              )}

              {/* ATS tab */}
              {sideTab==='ats' && (
                <ATSChecker content={displayContent} />
              )}

              {/* Improve tab */}
              {sideTab==='improve' && (
                <Improvements content={displayContent} onApply={improved => { setContent(improved); setActiveTab('preview'); toast.success('Improved version applied!') }} />
              )}
            </div>

            {/* Tips */}
            <div className="bg-brand-50 border border-brand-100 rounded-2xl p-4">
              <p className="text-xs font-semibold text-brand-700 mb-2">Tips</p>
              <div className="text-xs text-brand-600 space-y-1.5 leading-relaxed">
                <p>🎨 Template tab এ design বদলাও</p>
                <p>🤖 ATS Score এ compatibility check করো</p>
                <p>💡 Improve tab এ AI suggestions নাও</p>
                <p>✏️ Edit tab এ সরাসরি edit করো</p>
                {!user && <p>💾 <button onClick={() => toast('Google দিয়ে login করো')} className="underline">Login করলে</button> documents save হবে</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
