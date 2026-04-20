import { generateStyledHTML } from '../lib/templates.js'

export function useExport() {

  async function downloadPDF(content, filename = 'document', templateId = 'modern', colorTheme = 'purple') {
    if (!window.html2pdf) {
      await new Promise((res, rej) => {
        const s = document.createElement('script')
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js'
        s.onload = res; s.onerror = rej
        document.head.appendChild(s)
      })
    }
    const html = generateStyledHTML(content, templateId, colorTheme)
    const el = document.createElement('div')
    el.innerHTML = html
    await window.html2pdf(el, {
      margin: [10, 15],
      filename: `${filename}.pdf`,
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    })
  }

  async function downloadDOCX(content, filename = 'document', templateId = 'modern') {
    const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } = await import('docx')
    const { saveAs } = await import('file-saver')

    const lines = content.split('\n')
    const children = []

    lines.forEach((line, i) => {
      const trimmed = line.trim()
      if (!trimmed) { children.push(new Paragraph({ spacing: { after: 80 } })); return }

      // Name (first line)
      if (i === 0) {
        children.push(new Paragraph({
          children: [new TextRun({ text: trimmed, bold: true, size: 48, color: '534AB7' })],
          spacing: { after: 100 },
        })); return
      }
      // Contact line
      if (i <= 3 && (trimmed.includes('@') || trimmed.includes('|') || trimmed.includes('+'))) {
        children.push(new Paragraph({
          children: [new TextRun({ text: trimmed, size: 20, color: '666666' })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
        })); return
      }
      // Section heading
      if (trimmed === trimmed.toUpperCase() && trimmed.length > 3 && trimmed.length < 40) {
        children.push(new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun({ text: trimmed, bold: true, size: 24, color: '534AB7' })],
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: 'CECBF6' } },
          spacing: { before: 280, after: 100 },
        })); return
      }
      // Bullet
      if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
        children.push(new Paragraph({
          bullet: { level: 0 },
          children: [new TextRun({ text: trimmed.replace(/^[•\-]\s*/, ''), size: 22 })],
          spacing: { after: 60 },
        })); return
      }
      children.push(new Paragraph({
        children: [new TextRun({ text: line, size: 22 })],
        spacing: { after: 60 },
      }))
    })

    const doc = new Document({ sections: [{ properties: {}, children }] })
    const blob = await Packer.toBlob(doc)
    saveAs(blob, `${filename}.docx`)
  }

  function downloadTxt(content, filename = 'document') {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `${filename}.txt`; a.click()
    URL.revokeObjectURL(url)
  }

  async function copyToClipboard(text) {
    await navigator.clipboard.writeText(text)
  }

  return { downloadPDF, downloadDOCX, downloadTxt, copyToClipboard }
}
