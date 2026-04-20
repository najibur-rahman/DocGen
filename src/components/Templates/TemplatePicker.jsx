import React from 'react'
import { TEMPLATE_LIST, COLOR_THEMES } from '../../lib/templates'

export default function TemplatePicker({ selectedTemplate, selectedColor, onTemplateChange, onColorChange }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Template</p>
      <div className="grid grid-cols-1 gap-2 mb-4">
        {TEMPLATE_LIST.map(t => (
          <button
            key={t.id}
            onClick={() => onTemplateChange(t.id)}
            className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
              selectedTemplate === t.id ? 'border-brand-500 bg-brand-50' : 'border-gray-100 hover:border-brand-200'
            }`}
          >
            <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-white text-sm font-bold"
              style={{background: t.preview_color}}>
              {t.emoji}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{t.name}</p>
              <p className="text-xs text-gray-400">{t.description}</p>
              {t.atsNote && <p className="text-xs text-green-600 mt-0.5">🤖 {t.atsNote}</p>}
            </div>
            {selectedTemplate === t.id && <span className="ml-auto text-brand-500">✓</span>}
          </button>
        ))}
      </div>

      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Accent Color</p>
      <div className="grid grid-cols-3 gap-2">
        {COLOR_THEMES.map(c => (
          <button
            key={c.id}
            onClick={() => onColorChange(c.id)}
            className={`flex items-center gap-2 p-2.5 rounded-xl border-2 transition-all ${
              selectedColor === c.id ? 'border-brand-500' : 'border-gray-100 hover:border-gray-200'
            }`}
          >
            <div className="w-5 h-5 rounded-full flex-shrink-0" style={{background:c.color}} />
            <span className="text-xs text-gray-700">{c.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
