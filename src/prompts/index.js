// ── Shared helpers ─────────────────────────────────────────────────────────

export const personalBlock = (d) =>
`Name: ${d.name || 'N/A'}
Email: ${d.email || ''}
Phone: ${d.phone || ''}
Location: ${d.location || ''}
LinkedIn: ${d.linkedin || ''}
Portfolio/GitHub: ${d.portfolio || ''}`

export const eduBlock = (d) =>
  (d.education || []).filter(e => e.institution)
    .map(e => `• ${e.degree} — ${e.institution} (${e.year}) | GPA: ${e.gpa}`)
    .join('\n') || 'N/A'

export const expBlock = (d) =>
  (d.experience || []).filter(e => e.company)
    .map(e => `• ${e.title} at ${e.company} (${e.duration}, ${e.type})\n  ${e.responsibilities}`)
    .join('\n\n') || 'No experience listed.'

const langNote = (d) =>
  d.language === 'bangla'
    ? 'IMPORTANT: Write the ENTIRE document in Bengali (Bangla) language only.'
    : 'Write in clear, professional English.'

// ── CV ─────────────────────────────────────────────────────────────────────
export function buildCVPrompt(d, jdContext = '') {
  return `You are a world-class CV writer. Create a complete, professional CV.
${langNote(d)} Tone: ${d.tone || 'confident'}.
${jdContext ? `\n⚡ JOB DESCRIPTION CONTEXT (tailor CV to match):\n${jdContext}\n` : ''}

APPLICANT INFO:
${personalBlock(d)}

EDUCATION:\n${eduBlock(d)}
EXPERIENCE:\n${expBlock(d)}
TECHNICAL SKILLS: ${d.techskills || ''}
SOFT SKILLS: ${d.softskills || ''}
LANGUAGES: ${d.langs || ''}
CERTIFICATIONS: ${d.certs || ''}
PROJECTS: ${d.projects || ''}
PUBLICATIONS: ${d.publications || ''}
SUMMARY HINT: ${d.summary || 'Write a compelling 3-line professional summary'}
EXTRA: ${d.extra || ''}

FORMAT — Use these exact section headers (ALL CAPS):
PROFESSIONAL SUMMARY
EDUCATION
WORK EXPERIENCE
SKILLS
PROJECTS
CERTIFICATIONS
(only include sections with real data)

Rules: bullet points for experience, quantify achievements, no placeholder text, no tables.`
}

// ── Resume ─────────────────────────────────────────────────────────────────
export function buildResumePrompt(d, jdContext = '') {
  return `You are an expert resume writer specializing in ATS-optimized 1-page resumes.
${langNote(d)} Tone: ${d.tone || 'confident'}.
${jdContext ? `\n⚡ JOB DESCRIPTION (match keywords and requirements):\n${jdContext}\n` : ''}

APPLICANT:
${personalBlock(d)}
EDUCATION: ${eduBlock(d)}
EXPERIENCE:\n${expBlock(d)}
SKILLS: ${d.techskills || ''} | ${d.softskills || ''}
EXTRA: ${d.extra || ''}

FORMAT:
[Full Name]
[Email] | [Phone] | [Location] | [LinkedIn]

PROFESSIONAL SUMMARY
(2-3 punchy lines)

WORK EXPERIENCE
(reverse chronological, strong action verbs, quantify everything)

EDUCATION

SKILLS

Rules: under 450 words total, ATS-friendly (no columns/tables), start each bullet with action verb.`
}

// ── SOP ────────────────────────────────────────────────────────────────────
export function buildSOPPrompt(d) {
  return `You are an expert academic writer who has helped students get into Harvard, MIT, Oxford.
${langNote(d)} Tone: ${d.tone || 'formal yet personal'}.
Write a Statement of Purpose for: ${d.program || 'Graduate Program'} at ${d.uni || 'the university'}
Target length: ~${d.wordlimit || 750} words.

APPLICANT:
${personalBlock(d)}
EDUCATION: ${eduBlock(d)}
EXPERIENCE:\n${expBlock(d)}
WHY THIS PROGRAM: ${d.why || ''}
CAREER GOALS: ${d.goals || ''}
SKILLS: ${d.techskills || ''}
EXTRA: ${d.extra || ''}

STRUCTURE:
1. Compelling opening hook (a defining moment or question)
2. Academic background & relevant coursework
3. Research/work experience & key learnings
4. Why THIS specific program at THIS specific university
5. Clear research interests & career goals
6. Confident closing

Make it feel personal and specific. Avoid clichés like "from a young age I was passionate about..."`
}

// ── Cover Letter ────────────────────────────────────────────────────────────
export function buildCoverLetterPrompt(d, jdContext = '') {
  return `You are an expert cover letter writer. Write a compelling cover letter.
${langNote(d)} Tone: ${d.tone || 'confident'}.
Position: ${d.jobtitle || 'the role'} at ${d.company || 'the company'}
${jdContext ? `\nJOB DESCRIPTION:\n${jdContext}\n` : ''}

APPLICANT:
${personalBlock(d)}
EDUCATION: ${eduBlock(d)}
EXPERIENCE:\n${expBlock(d)}
SKILLS: ${d.techskills || ''}
WHY THIS COMPANY: ${d.whyco || ''}
EXTRA: ${d.extra || ''}

FORMAT:
[Date]
Dear Hiring Manager,

[Para 1 — Strong hook: mutual fit in 2-3 sentences]
[Para 2 — Your most relevant achievement with specific numbers/impact]
[Para 3 — Why this specific company excites you]
[Para 4 — Confident call to action]

Sincerely,
[Name]

Keep under 380 words. No generic phrases.`
}

// ── LinkedIn Bio ────────────────────────────────────────────────────────────
export function buildLinkedInPrompt(d) {
  return `You are an expert LinkedIn profile writer. Write a magnetic LinkedIn profile.
${langNote(d)} Tone: ${d.tone || 'warm and professional'}.

PERSON:
${personalBlock(d)}
EXPERIENCE:\n${expBlock(d)}
SKILLS: ${d.techskills || ''} | ${d.softskills || ''}
EXTRA: ${d.extra || ''}

Provide TWO sections:

1. HEADLINE (under 220 chars):
Format: "[Role] | [Value you deliver] | [Unique differentiator]"
Give 3 headline options.

2. ABOUT SECTION (300-400 words, first person):
- Opening hook (memorable, not "I am a [title]")
- What you do and the impact
- Key achievement highlights (2-3 specific)
- What excites you / working toward
- Call to action (open to opportunities / let's connect)

Sound human, not AI-generated.`
}

// ── JD Analyzer ────────────────────────────────────────────────────────────
export function buildJDAnalyzerPrompt(jd, existingCV) {
  return `You are an expert ATS consultant and career coach.

Analyze this job description and compare with the candidate's CV/Resume.

JOB DESCRIPTION:
${jd}

CANDIDATE'S CURRENT DOCUMENT:
${existingCV}

Respond in this EXACT JSON format:
{
  "match_score": <0-100 number>,
  "missing_keywords": ["keyword1", "keyword2", ...],
  "matched_keywords": ["keyword1", "keyword2", ...],
  "recommendations": [
    "Specific actionable suggestion 1",
    "Specific actionable suggestion 2",
    "Specific actionable suggestion 3"
  ],
  "tailored_summary": "A rewritten professional summary specifically tailored for this job in 3 sentences"
}`
}

// ── ATS Score Checker ───────────────────────────────────────────────────────
export function buildATSScorePrompt(content) {
  return `You are an ATS (Applicant Tracking System) expert. Analyze this resume/CV for ATS compatibility.

DOCUMENT:
${content}

Respond in this EXACT JSON format:
{
  "overall_score": <0-100 number>,
  "breakdown": {
    "keywords": <0-25>,
    "formatting": <0-25>,
    "structure": <0-25>,
    "content_quality": <0-25>
  },
  "issues": [
    "Issue description 1",
    "Issue description 2"
  ],
  "strengths": [
    "Strength 1",
    "Strength 2"
  ],
  "quick_fixes": [
    "Quick fix 1",
    "Quick fix 2",
    "Quick fix 3"
  ]
}`
}

// ── Improvement Suggestions ─────────────────────────────────────────────────
export function buildImprovementPrompt(content, section) {
  return `You are an expert career document writer. Review this ${section || 'document section'} and provide improvement suggestions.

CONTENT:
${content}

Respond in this EXACT JSON format:
{
  "score": <0-100>,
  "suggestions": [
    {
      "type": "critical|improvement|enhancement",
      "text": "Specific suggestion with example"
    }
  ],
  "improved_version": "Rewritten improved version of this content"
}`
}

// ── Section Regenerate ──────────────────────────────────────────────────────
export function buildSectionRegenPrompt(sectionName, sectionContent, formData, instruction = '') {
  return `You are an expert document writer. Rewrite ONLY this specific section better.

SECTION: ${sectionName}
CURRENT CONTENT:
${sectionContent}

APPLICANT CONTEXT:
Name: ${formData.name || ''}
Skills: ${formData.techskills || ''}
Experience summary: ${(formData.experience || []).map(e => `${e.title} at ${e.company}`).join(', ')}

${instruction ? `SPECIFIC INSTRUCTION: ${instruction}` : 'Make it more impactful, specific, and professional.'}

Return ONLY the rewritten section content, no explanations, no section header.`
}
