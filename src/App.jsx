import React, { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './hooks/useAuth'
import Landing from './components/Landing'
import Wizard from './components/Wizard'
import Output from './components/Output'
import Dashboard from './components/Dashboard'
import { useAI } from './hooks/useAI'

// Screens: 'landing' | 'wizard' | 'generating' | 'output' | 'dashboard'

const LOADING_MSGS = [
  'AI তোমার তথ্য বিশ্লেষণ করছে...',
  'Document structure তৈরি করছে...',
  'Content লিখছে...',
  'Final polish করছে...',
]

const MULTI_MSGS = [
  '3টা version তৈরি করছে...',
  'Confident version লিখছে...',
  'Formal version লিখছে...',
  'Warm version লিখছে...',
]

function AppInner() {
  const [screen, setScreen] = useState('landing')
  const [docType, setDocType] = useState(null)
  const [formData, setFormData] = useState({})
  const [outputContent, setOutputContent] = useState('')
  const [outputVersions, setOutputVersions] = useState(null)
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MSGS[0])
  const [openedDoc, setOpenedDoc] = useState(null)

  const { generate, generateMultiple, loading } = useAI()
  const { user } = useAuth()

  function cycleMessages(msgs) {
    let i = 0
    setLoadingMsg(msgs[0])
    return setInterval(() => {
      i = (i + 1) % msgs.length
      setLoadingMsg(msgs[i])
    }, 3200)
  }

  async function handleGenerate(data) {
    setFormData(data)
    setScreen('generating')
    const isMultiple = data.gen_mode === 'multiple'
    const interval = cycleMessages(isMultiple ? MULTI_MSGS : LOADING_MSGS)
    const jdContext = data.jd_context || data.jd || ''

    let result
    if (isMultiple) {
      result = await generateMultiple(docType, data, jdContext)
      clearInterval(interval)
      if (result) { setOutputVersions(result); setOutputContent(''); setScreen('output') }
      else { setScreen('wizard') }
    } else {
      result = await generate(docType, data, jdContext)
      clearInterval(interval)
      if (result) { setOutputContent(result); setOutputVersions(null); setScreen('output') }
      else { setScreen('wizard') }
    }
  }

  async function handleRegenerate() {
    setScreen('generating')
    const isMultiple = formData.gen_mode === 'multiple'
    const interval = cycleMessages(isMultiple ? MULTI_MSGS : LOADING_MSGS)
    const jdContext = formData.jd_context || formData.jd || ''

    if (isMultiple) {
      const result = await generateMultiple(docType, formData, jdContext)
      clearInterval(interval)
      if (result) { setOutputVersions(result); setOutputContent('') }
    } else {
      const result = await generate(docType, formData, jdContext)
      clearInterval(interval)
      if (result) setOutputContent(result)
    }
    setScreen('output')
  }

  function handleOpenSavedDoc(doc) {
    setDocType(doc.doc_type)
    setFormData(doc.form_data || {})
    setOutputContent(doc.content)
    setOutputVersions(null)
    setOpenedDoc(doc)
    setScreen('output')
  }

  function goHome() {
    setDocType(null); setFormData({}); setOutputContent('')
    setOutputVersions(null); setOpenedDoc(null)
    setScreen('landing')
  }

  // ── Generating screen ────────────────────────────────────────────────────
  if (screen === 'generating') {
    const isMulti = formData.gen_mode === 'multiple'
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-xs mx-auto px-6">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="w-20 h-20 bg-brand-50 rounded-3xl flex items-center justify-center">
              <div className="w-10 h-10 border-[3px] border-brand-200 border-t-brand-500 rounded-full animate-spin" />
            </div>
            {isMulti && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
            )}
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2 animate-pulse-slow">{loadingMsg}</h2>
          <p className="text-sm text-gray-400 mb-6">
            {isMulti ? '৩টা version তৈরি হচ্ছে — একটু বেশি সময় লাগবে' : 'এটা ১৫–৩০ সেকেন্ড লাগতে পারে'}
          </p>
          <div className="flex justify-center gap-2">
            {(isMulti ? [0,1,2] : [0,1,2]).map(i => (
              <div key={i} className="w-2 h-2 bg-brand-300 rounded-full animate-bounce" style={{animationDelay:`${i*0.18}s`}} />
            ))}
          </div>
          {isMulti && (
            <div className="mt-6 flex justify-center gap-2">
              {['Confident','Formal','Warm'].map((l,i) => (
                <span key={i} className="text-xs px-3 py-1 bg-brand-50 text-brand-500 rounded-full border border-brand-100">{l}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      {screen === 'landing' && (
        <Landing
          onStart={type => { setDocType(type); setScreen('wizard') }}
          onDashboard={() => setScreen('dashboard')}
        />
      )}
      {screen === 'wizard' && (
        <Wizard docType={docType} onGenerate={handleGenerate} onBack={goHome} />
      )}
      {screen === 'output' && (
        <Output
          content={outputContent}
          versions={outputVersions}
          docType={docType}
          formData={formData}
          onNew={goHome}
          onRegenerate={handleRegenerate}
          regenerating={loading}
        />
      )}
      {screen === 'dashboard' && (
        <Dashboard onOpen={handleOpenSavedDoc} onNew={goHome} />
      )}
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
      <Toaster position="bottom-center" toastOptions={{ style: { fontSize: '14px', borderRadius: '12px' } }} />
    </AuthProvider>
  )
}
