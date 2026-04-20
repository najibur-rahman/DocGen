import React from 'react'

export function Field({ label, required, hint, children }) {
  return (
    <div className="mb-4">
      <label className="label">
        {label} {required && <span className="text-red-400 normal-case">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  )
}

export function Grid2({ children }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
}

// ── Step: Personal ─────────────────────────────────────────────────────────
export function StepPersonal({ data, onChange }) {
  const set = k => e => onChange({ ...data, [k]: e.target.value })
  return (
    <div>
      <Grid2>
        <Field label="Full Name" required><input className="input-field" placeholder="Mohammad Rahman" value={data.name||''} onChange={set('name')} /></Field>
        <Field label="Email" required><input className="input-field" type="email" placeholder="you@gmail.com" value={data.email||''} onChange={set('email')} /></Field>
        <Field label="Phone"><input className="input-field" placeholder="+880 1712 345678" value={data.phone||''} onChange={set('phone')} /></Field>
        <Field label="Location"><input className="input-field" placeholder="Dhaka, Bangladesh" value={data.location||''} onChange={set('location')} /></Field>
        <Field label="LinkedIn URL"><input className="input-field" placeholder="linkedin.com/in/yourname" value={data.linkedin||''} onChange={set('linkedin')} /></Field>
        <Field label="Portfolio / GitHub"><input className="input-field" placeholder="github.com/yourname" value={data.portfolio||''} onChange={set('portfolio')} /></Field>
      </Grid2>
      <Field label="Professional Summary" hint="Optional — AI নিজেই লিখবে। তুমি hint দিলে আরো tailored হবে।">
        <textarea className="input-field" rows={3} placeholder="নিজের সম্পর্কে কিছু বলো..." value={data.summary||''} onChange={set('summary')} />
      </Field>
    </div>
  )
}

// ── Step: Education ────────────────────────────────────────────────────────
export function StepEducation({ data, onChange }) {
  const edu = data.education || [{}]
  const update = (i, k, v) => { const u=[...edu]; u[i]={...u[i],[k]:v}; onChange({...data,education:u}) }
  const add = () => onChange({...data, education:[...edu,{}]})
  const remove = i => onChange({...data, education:edu.filter((_,idx)=>idx!==i)})
  return (
    <div>
      {edu.map((e,i) => (
        <div key={i} className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-3 relative">
          {i>0 && <button onClick={()=>remove(i)} className="absolute top-3 right-3 text-gray-300 hover:text-red-400 text-xl leading-none">×</button>}
          {i>0 && <p className="text-xs text-gray-400 font-medium mb-3">Degree #{i+1}</p>}
          <Grid2>
            <Field label="Degree"><input className="input-field" placeholder="B.Sc. Computer Science" value={e.degree||''} onChange={ev=>update(i,'degree',ev.target.value)} /></Field>
            <Field label="Institution"><input className="input-field" placeholder="BUET / NSU / DU" value={e.institution||''} onChange={ev=>update(i,'institution',ev.target.value)} /></Field>
            <Field label="Year"><input className="input-field" placeholder="2020 – 2024" value={e.year||''} onChange={ev=>update(i,'year',ev.target.value)} /></Field>
            <Field label="GPA / Result"><input className="input-field" placeholder="3.82 / 4.00" value={e.gpa||''} onChange={ev=>update(i,'gpa',ev.target.value)} /></Field>
          </Grid2>
          <Field label="Relevant Courses / Thesis" hint="Optional">
            <input className="input-field" placeholder="ML, NLP, Data Structures, Thesis: Bangla NLP..." value={e.courses||''} onChange={ev=>update(i,'courses',ev.target.value)} />
          </Field>
        </div>
      ))}
      <button onClick={add} className="text-sm text-brand-500 hover:text-brand-700 font-medium">+ আরেকটি degree যোগ করো</button>
    </div>
  )
}

// ── Step: Experience ───────────────────────────────────────────────────────
export function StepExperience({ data, onChange }) {
  const exp = data.experience || [{}]
  const update = (i, k, v) => { const u=[...exp]; u[i]={...u[i],[k]:v}; onChange({...data,experience:u}) }
  const add = () => onChange({...data, experience:[...exp,{}]})
  const remove = i => onChange({...data, experience:exp.filter((_,idx)=>idx!==i)})
  return (
    <div>
      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-sm text-blue-700 mb-4">
        💡 কোনো experience না থাকলে ফাঁকা রাখো — AI সেই অনুযায়ী লিখবে।
      </div>
      {exp.map((e,i) => (
        <div key={i} className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-3 relative">
          {i>0 && <button onClick={()=>remove(i)} className="absolute top-3 right-3 text-gray-300 hover:text-red-400 text-xl leading-none">×</button>}
          <Grid2>
            <Field label="Job Title"><input className="input-field" placeholder="Software Engineer" value={e.title||''} onChange={ev=>update(i,'title',ev.target.value)} /></Field>
            <Field label="Company"><input className="input-field" placeholder="Pathao / Chaldal / bKash" value={e.company||''} onChange={ev=>update(i,'company',ev.target.value)} /></Field>
            <Field label="Duration"><input className="input-field" placeholder="Jan 2023 – Present" value={e.duration||''} onChange={ev=>update(i,'duration',ev.target.value)} /></Field>
            <Field label="Type">
              <select className="input-field" value={e.type||'Full-time'} onChange={ev=>update(i,'type',ev.target.value)}>
                <option>Full-time</option><option>Part-time</option><option>Internship</option><option>Freelance</option><option>Research</option>
              </select>
            </Field>
          </Grid2>
          <Field label="Responsibilities & Achievements" hint="Numbers দিলে ভালো — '40% faster', 'team of 5', '$10k revenue'">
            <textarea className="input-field" rows={3} placeholder="কী করতে? কী achieve করলে?" value={e.responsibilities||''} onChange={ev=>update(i,'responsibilities',ev.target.value)} />
          </Field>
        </div>
      ))}
      <button onClick={add} className="text-sm text-brand-500 hover:text-brand-700 font-medium">+ আরেকটি position যোগ করো</button>
    </div>
  )
}

// ── Step: Skills ───────────────────────────────────────────────────────────
export function StepSkills({ data, onChange }) {
  const set = k => e => onChange({...data,[k]:e.target.value})
  return (
    <div>
      <Field label="Technical Skills" hint="Comma দিয়ে আলাদা করো">
        <input className="input-field" placeholder="Python, React, SQL, Figma, AWS, Docker..." value={data.techskills||''} onChange={set('techskills')} />
      </Field>
      <Field label="Soft Skills">
        <input className="input-field" placeholder="Leadership, Communication, Problem-solving..." value={data.softskills||''} onChange={set('softskills')} />
      </Field>
      <Field label="Languages">
        <input className="input-field" placeholder="Bangla (Native), English (C1), Hindi (B1)" value={data.langs||''} onChange={set('langs')} />
      </Field>
      <Field label="Certifications & Awards">
        <textarea className="input-field" rows={2} placeholder="AWS Certified (2024), Dean's List 2022-23, National Hackathon 1st Place..." value={data.certs||''} onChange={set('certs')} />
      </Field>
      <Field label="Projects" hint="Optional — name, description, tech, link">
        <textarea className="input-field" rows={3} placeholder="BanglaBot — AI chatbot — Python, HuggingFace — github.com/..." value={data.projects||''} onChange={set('projects')} />
      </Field>
      <Field label="Publications / Research" hint="Optional">
        <textarea className="input-field" rows={2} placeholder="Paper title, Journal, Year..." value={data.publications||''} onChange={set('publications')} />
      </Field>
    </div>
  )
}

// ── Step: SOP Extra ────────────────────────────────────────────────────────
export function StepSOPExtra({ data, onChange }) {
  const set = k => e => onChange({...data,[k]:e.target.value})
  return (
    <div>
      <Grid2>
        <Field label="University Name" required><input className="input-field" placeholder="University of Toronto" value={data.uni||''} onChange={set('uni')} /></Field>
        <Field label="Program" required><input className="input-field" placeholder="MSc Computer Science" value={data.program||''} onChange={set('program')} /></Field>
      </Grid2>
      <Field label="Why this program?" hint="Specific কারণ — কোনো professor বা lab?">
        <textarea className="input-field" rows={4} placeholder="কেন এই university, এই program?" value={data.why||''} onChange={set('why')} />
      </Field>
      <Field label="Career Goals">
        <textarea className="input-field" rows={3} placeholder="Degree এর পরে short-term ও long-term goal..." value={data.goals||''} onChange={set('goals')} />
      </Field>
      <Field label="Word Limit">
        <select className="input-field" value={data.wordlimit||'750'} onChange={set('wordlimit')}>
          <option value="500">500 words</option>
          <option value="750">750 words (recommended)</option>
          <option value="1000">1000 words</option>
          <option value="1200">1200 words</option>
        </select>
      </Field>
    </div>
  )
}

// ── Step: Cover Extra ──────────────────────────────────────────────────────
export function StepCoverExtra({ data, onChange }) {
  const set = k => e => onChange({...data,[k]:e.target.value})
  return (
    <div>
      <Grid2>
        <Field label="Company Name" required><input className="input-field" placeholder="Google Bangladesh" value={data.company||''} onChange={set('company')} /></Field>
        <Field label="Job Title" required><input className="input-field" placeholder="Software Engineer" value={data.jobtitle||''} onChange={set('jobtitle')} /></Field>
      </Grid2>
      <Field label="Job Description" hint="JD paste করো — AI automatically match করবে">
        <textarea className="input-field" rows={5} placeholder="Job posting থেকে requirements paste করো..." value={data.jd||''} onChange={set('jd')} />
      </Field>
      <Field label="Why this company?">
        <textarea className="input-field" rows={2} placeholder="কেন এই specific company?" value={data.whyco||''} onChange={set('whyco')} />
      </Field>
    </div>
  )
}

// ── Step: JD Analyzer (new in V2) ──────────────────────────────────────────
export function StepJDAnalyzer({ data, onChange }) {
  const set = k => e => onChange({...data,[k]:e.target.value})
  return (
    <div>
      <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 mb-4">
        <p className="text-sm font-medium text-brand-700 mb-1">🎯 Job Description Analyzer</p>
        <p className="text-xs text-brand-600">JD paste করলে AI তোমার CV/Resume automatically সেই job এর জন্য optimize করবে — keywords match করবে, missing skills highlight করবে।</p>
      </div>
      <Field label="Job Description (Optional but recommended)" hint="যত বেশি detail দেবে, তত tailored হবে">
        <textarea className="input-field" rows={8} placeholder="এখানে job posting paste করো...&#10;&#10;Example:&#10;We are looking for a Software Engineer with 2+ years experience in React, Node.js...&#10;Responsibilities: Build scalable web apps, collaborate with design team..." value={data.jd_context||''} onChange={set('jd_context')} />
      </Field>
      {data.jd_context && (
        <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 text-sm text-green-700">
          ✅ JD detected! AI এটা analyze করে তোমার document optimize করবে।
        </div>
      )}
    </div>
  )
}

// ── Step: Customization ────────────────────────────────────────────────────
export function StepCustomization({ data, onChange, docType }) {
  const set = k => e => onChange({...data,[k]:e.target.value})
  return (
    <div>
      <Grid2>
        <Field label="Tone">
          <select className="input-field" value={data.tone||'confident'} onChange={set('tone')}>
            <option value="confident">Confident & Direct</option>
            <option value="formal">Formal & Traditional</option>
            <option value="warm">Warm & Personable</option>
            <option value="creative">Creative & Bold</option>
          </select>
        </Field>
        <Field label="Language">
          <select className="input-field" value={data.language||'english'} onChange={set('language')}>
            <option value="english">English</option>
            <option value="bangla">বাংলা (Bengali)</option>
          </select>
        </Field>
      </Grid2>

      <Field label="Generation Mode">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { value: 'single', icon: '⚡', title: 'Single version', desc: 'Fastest — 1 document' },
            { value: 'multiple', icon: '✨', title: '3 Versions', desc: 'Get 3 tones, pick the best' },
          ].map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange({...data, gen_mode: opt.value})}
              className={`text-left p-3.5 rounded-xl border-2 transition-all ${
                (data.gen_mode||'single') === opt.value
                  ? 'border-brand-500 bg-brand-50'
                  : 'border-gray-100 hover:border-brand-200'
              }`}
            >
              <div className="text-lg mb-1">{opt.icon}</div>
              <div className="text-sm font-medium text-gray-900">{opt.title}</div>
              <div className="text-xs text-gray-500 mt-0.5">{opt.desc}</div>
            </button>
          ))}
        </div>
      </Field>

      <Field label="Extra instructions" hint="Optional — AI কে specific কিছু বলো">
        <textarea className="input-field" rows={2} placeholder="কিছু বিশেষভাবে include/avoid করতে চাও?" value={data.extra||''} onChange={set('extra')} />
      </Field>

      <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 mt-2">
        <p className="text-sm font-medium text-brand-700">Ready! Generate এ click করো</p>
        <p className="text-xs text-brand-600 mt-1">Gemini 2.0 Flash তোমার তথ্য দিয়ে professional document তৈরি করবে। Generate হওয়ার পরে edit, ATS check, এবং export করতে পারবে।</p>
      </div>
    </div>
  )
}
