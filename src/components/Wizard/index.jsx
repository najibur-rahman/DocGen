import React, { useState } from 'react'
import { StepPersonal, StepEducation, StepExperience, StepSkills, StepSOPExtra, StepCoverExtra, StepJDAnalyzer, StepCustomization } from './Steps'

const DOC_LABELS = { cv:'CV', resume:'Resume', sop:'SOP', cover:'Cover Letter', linkedin:'LinkedIn Bio' }

function getSteps(docType) {
  const base = [
    { id:'personal', label:'Personal' },
    { id:'education', label:'Education' },
    { id:'experience', label:'Experience' },
  ]
  if (docType === 'sop') return [...base, {id:'sop_extra',label:'University'}, {id:'jd_analyzer',label:'JD (Optional)'}, {id:'customization',label:'Customize'}]
  if (docType === 'cover') return [...base, {id:'cover_extra',label:'Job Info'}, {id:'customization',label:'Customize'}]
  if (docType === 'linkedin') return [{id:'personal',label:'Personal'}, {id:'experience',label:'Experience'}, {id:'skills',label:'Skills'}, {id:'customization',label:'Customize'}]
  // cv, resume
  return [...base, {id:'skills',label:'Skills'}, {id:'jd_analyzer',label:'JD Analyzer'}, {id:'customization',label:'Customize'}]
}

function StepContent({ stepId, data, onChange, docType }) {
  switch(stepId) {
    case 'personal': return <StepPersonal data={data} onChange={onChange} />
    case 'education': return <StepEducation data={data} onChange={onChange} />
    case 'experience': return <StepExperience data={data} onChange={onChange} />
    case 'skills': return <StepSkills data={data} onChange={onChange} />
    case 'sop_extra': return <StepSOPExtra data={data} onChange={onChange} />
    case 'cover_extra': return <StepCoverExtra data={data} onChange={onChange} />
    case 'jd_analyzer': return <StepJDAnalyzer data={data} onChange={onChange} />
    case 'customization': return <StepCustomization data={data} onChange={onChange} docType={docType} />
    default: return null
  }
}

export default function Wizard({ docType, onGenerate, onBack }) {
  const steps = getSteps(docType)
  const [current, setCurrent] = useState(0)
  const [formData, setFormData] = useState({ gen_mode: 'single' })

  const isLast = current === steps.length - 1
  const step = steps[current]
  const progress = ((current + 1) / steps.length) * 100

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">D</div>
            <span className="font-semibold text-gray-900 text-sm">{DOC_LABELS[docType]}</span>
          </div>
          <button onClick={onBack} className="text-xs text-gray-400 hover:text-gray-600">← Change document</button>
        </div>
        {/* Progress */}
        <div className="h-1 bg-gray-100">
          <div className="h-1 bg-brand-500 transition-all duration-500" style={{width:`${progress}%`}} />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Step info */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-gray-400 mb-1">Step {current+1} of {steps.length}</p>
            <h2 className="text-xl font-semibold text-gray-900">{step.label}</h2>
          </div>
          <div className="flex gap-1.5 flex-wrap justify-end max-w-xs">
            {steps.map((s,i) => (
              <span key={s.id} className={`text-[11px] px-2.5 py-1 rounded-full ${
                i < current ? 'bg-brand-100 text-brand-600' :
                i === current ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-400'
              }`}>
                {i < current ? '✓' : i+1}. {s.label}
              </span>
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="card p-6 mb-6 animate-slide-up">
          <StepContent stepId={step.id} data={formData} onChange={setFormData} docType={docType} />
        </div>

        {/* Nav */}
        <div className="flex items-center justify-between">
          <button onClick={() => current===0 ? onBack() : setCurrent(c=>c-1)} className="btn-ghost">
            ← {current===0 ? 'Home' : 'Back'}
          </button>
          <button onClick={() => isLast ? onGenerate(formData) : setCurrent(c=>c+1)} className="btn-primary">
            {isLast ? (formData.gen_mode==='multiple' ? '✨ Generate 3 Versions' : '✨ Generate Document') : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  )
}
