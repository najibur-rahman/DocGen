// ── Template definitions ────────────────────────────────────────────────────
// Each template defines how the PDF/preview will look

export const TEMPLATES = {
  classic: {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional, timeless layout',
    preview_color: '#1a1a2e',
    accent: '#1a1a2e',
    font: 'Georgia, serif',
    headingStyle: 'border-bottom: 2px solid #1a1a2e; padding-bottom: 4px; text-transform: uppercase; letter-spacing: 1px; font-size: 11pt;',
    nameStyle: 'font-size: 22pt; font-weight: bold; color: #1a1a2e; text-align: center;',
    bodyStyle: 'font-size: 10.5pt; line-height: 1.6; color: #222;',
    contactStyle: 'text-align: center; color: #555; font-size: 10pt;',
    emoji: '📜',
  },
  modern: {
    id: 'modern',
    name: 'Modern',
    description: 'Clean with purple accent sidebar',
    preview_color: '#534AB7',
    accent: '#534AB7',
    font: 'Inter, Arial, sans-serif',
    headingStyle: 'color: #534AB7; font-size: 11pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; margin-top: 14px;',
    nameStyle: 'font-size: 24pt; font-weight: 700; color: #1a1a1a;',
    bodyStyle: 'font-size: 10.5pt; line-height: 1.7; color: #333;',
    contactStyle: 'color: #534AB7; font-size: 10pt;',
    emoji: '✨',
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    description: 'Ultra clean, lots of whitespace',
    preview_color: '#374151',
    accent: '#374151',
    font: 'Helvetica Neue, Arial, sans-serif',
    headingStyle: 'font-size: 9pt; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; color: #9ca3af; margin-top: 16px;',
    nameStyle: 'font-size: 20pt; font-weight: 300; color: #111; letter-spacing: -0.5px;',
    bodyStyle: 'font-size: 10pt; line-height: 1.8; color: #4b5563;',
    contactStyle: 'color: #6b7280; font-size: 9.5pt;',
    emoji: '◻️',
  },
  creative: {
    id: 'creative',
    name: 'Creative',
    description: 'Bold, colorful for creative roles',
    preview_color: '#dc2626',
    accent: '#dc2626',
    font: 'Inter, sans-serif',
    headingStyle: 'background: #dc2626; color: white; padding: 3px 10px; border-radius: 4px; font-size: 10pt; font-weight: 600; display: inline-block; margin-top: 12px;',
    nameStyle: 'font-size: 26pt; font-weight: 800; color: #dc2626;',
    bodyStyle: 'font-size: 10.5pt; line-height: 1.7; color: #1f2937;',
    contactStyle: 'color: #dc2626; font-size: 10pt; font-weight: 500;',
    emoji: '🎨',
  },
  ats_clean: {
    id: 'ats_clean',
    name: 'ATS-Clean',
    description: 'Maximizes ATS parsing score',
    preview_color: '#059669',
    accent: '#059669',
    font: 'Arial, sans-serif',
    headingStyle: 'font-size: 11pt; font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 2px; margin-top: 12px; color: #111;',
    nameStyle: 'font-size: 18pt; font-weight: bold; color: #111;',
    bodyStyle: 'font-size: 11pt; line-height: 1.5; color: #111;',
    contactStyle: 'font-size: 10pt; color: #333;',
    emoji: '🤖',
    atsNote: 'Optimized for Applicant Tracking Systems — plain text, no tables',
  },
}

export const TEMPLATE_LIST = Object.values(TEMPLATES)

// ── Color themes (apply on top of any template) ────────────────────────────
export const COLOR_THEMES = [
  { id: 'purple', name: 'Purple', color: '#534AB7', bg: '#EEEDFE' },
  { id: 'blue', name: 'Blue', color: '#2563eb', bg: '#EFF6FF' },
  { id: 'green', name: 'Green', color: '#059669', bg: '#ECFDF5' },
  { id: 'red', name: 'Red', color: '#dc2626', bg: '#FEF2F2' },
  { id: 'dark', name: 'Dark', color: '#1f2937', bg: '#F9FAFB' },
  { id: 'teal', name: 'Teal', color: '#0d9488', bg: '#F0FDFA' },
]

// ── Generate styled HTML for PDF export ───────────────────────────────────
export function generateStyledHTML(content, templateId = 'modern', colorTheme = 'purple') {
  const template = TEMPLATES[templateId] || TEMPLATES.modern
  const theme = COLOR_THEMES.find(t => t.id === colorTheme) || COLOR_THEMES[0]
  const accentColor = theme.color

  // Override accent color in styles
  const headingStyle = template.headingStyle.replace(template.accent, accentColor)
  const nameStyle = template.nameStyle.replace(template.accent, accentColor)
  const contactStyle = template.contactStyle.replace(template.accent, accentColor)

  const lines = content.split('\n')
  let html = ''

  lines.forEach((line, i) => {
    const trimmed = line.trim()
    if (!trimmed) { html += '<div style="margin:4px 0"></div>'; return }

    // Detect name (first non-empty line)
    if (i === 0 && trimmed.length < 60 && !trimmed.includes(':')) {
      html += `<div style="${nameStyle} margin-bottom:4px;">${trimmed}</div>`
      return
    }
    // Detect contact info line (has @ or phone pattern)
    if (i <= 3 && (trimmed.includes('@') || trimmed.includes('+') || trimmed.includes('|') || trimmed.includes('linkedin'))) {
      html += `<div style="${contactStyle} margin-bottom:8px;">${trimmed}</div>`
      return
    }
    // Detect section headings (ALL CAPS or ends with colon, short line)
    if ((trimmed === trimmed.toUpperCase() && trimmed.length > 3 && trimmed.length < 40) || 
        (trimmed.endsWith(':') && trimmed.length < 35)) {
      html += `<div style="${headingStyle} margin-top:14px; margin-bottom:6px;">${trimmed}</div>`
      return
    }
    // Detect bullet points
    if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')) {
      html += `<div style="margin-left:16px; margin-bottom:3px; ${template.bodyStyle}">• ${trimmed.replace(/^[•\-\*]\s*/, '')}</div>`
      return
    }
    // Regular line
    html += `<div style="${template.bodyStyle} margin-bottom:3px;">${trimmed}</div>`
  })

  return `
    <div style="font-family:${template.font}; padding:32px 36px; max-width:760px; margin:0 auto; background:#fff;">
      ${html}
    </div>
  `
}
