// ── Config — replace with your Vercel URL after deploy ──────────────────────
const WEBAPP_URL = 'https://your-docgen-v2.vercel.app'
const API_URL = `${WEBAPP_URL}/api/generate`

const DOC_LABELS = {cv:'CV',resume:'Resume',sop:'SOP',cover:'Cover Letter',linkedin:'LinkedIn Bio'}

let selDoc = null, step = 0, form = {}, eduIdx=1, expIdx=1
let versions = [], selVer = 0, curOutput = ''

// ── Helpers ────────────────────────────────────────────────────────────────
const show = id => { document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active')); document.getElementById(id).classList.add('active') }
const $ = id => document.getElementById(id)
const val = id => $(id)?.value || ''

function goHome() { selDoc=null;step=0;form={};eduIdx=1;expIdx=1; document.querySelectorAll('.doc-card').forEach(c=>c.classList.remove('sel')); $('startBtn').disabled=true; show('s0') }

// ── Step config ────────────────────────────────────────────────────────────
function getSteps(t) {
  const base = [{id:'personal',lb:'Personal'},{id:'education',lb:'Education'},{id:'experience',lb:'Experience'}]
  if(t==='sop') return [...base,{id:'sop_x',lb:'University'},{id:'jd',lb:'JD'},{id:'cust',lb:'Customize'}]
  if(t==='cover') return [...base,{id:'cover_x',lb:'Job Info'},{id:'cust',lb:'Customize'}]
  if(t==='linkedin') return [{id:'personal',lb:'Personal'},{id:'experience',lb:'Experience'},{id:'skills',lb:'Skills'},{id:'cust',lb:'Customize'}]
  return [...base,{id:'skills',lb:'Skills'},{id:'jd',lb:'JD Analyzer'},{id:'cust',lb:'Customize'}]
}

// ── Landing ────────────────────────────────────────────────────────────────
function selDoc(type, el) { selDoc=type; document.querySelectorAll('.doc-card').forEach(c=>c.classList.remove('sel')); el.classList.add('sel'); $('startBtn').disabled=false }

function startWiz() { if(!selDoc) return; step=0; renderWiz(); show('s1') }

// ── Wizard ─────────────────────────────────────────────────────────────────
function renderWiz() {
  const steps=getSteps(selDoc), s=steps[step], tot=steps.length
  $('wizLabel').textContent=DOC_LABELS[selDoc]
  $('stepLbl').textContent=`Step ${step+1} of ${tot}`
  $('stepNm').textContent=s.lb
  $('pFill').style.width=`${((step+1)/tot)*100}%`
  $('nxtBtn').textContent=step===tot-1?(form.gen_mode==='multiple'?'✨ Generate 3 Versions':'✨ Generate'):'Next →'
  $('sPills').innerHTML=steps.map((x,i)=>`<span class="sp ${i<step?'sp-done':i===step?'sp-act':'sp-pend'}">${i<step?'✓ ':''}${x.lb}</span>`).join('')
  $('wizBody').innerHTML=getHTML(s.id)
  restoreForm(s.id)
}

function wizBack() { if(step===0){goHome();return} saveForm(getSteps(selDoc)[step].id); step--; renderWiz() }
function wizNext() { const steps=getSteps(selDoc); saveForm(steps[step].id); if(step<steps.length-1){step++;renderWiz()}else{generate()} }

// ── Step HTML ──────────────────────────────────────────────────────────────
function getHTML(id) {
  const fld=(lbl,inp,hint='')=>`<div class="field"><label>${lbl}</label>${inp}${hint?`<p style="font-size:10px;color:#9ca3af;margin-top:2px">${hint}</p>`:''}</div>`
  const inp=(id,ph,type='text')=>`<input id="${id}" placeholder="${ph}" type="${type}">`
  const ta=(id,ph,rows=3)=>`<textarea id="${id}" placeholder="${ph}" rows="${rows}"></textarea>`
  const sel=(id,opts)=>`<select id="${id}">${opts.map(o=>`<option>${o}</option>`).join('')}</select>`

  if(id==='personal') return `
    <div class="sec-title">Personal Info</div>
    <div class="g2">${fld('Name *',inp('f_name','Mohammad Rahman'))}${fld('Email *',inp('f_email','you@gmail.com','email'))}</div>
    <div class="g2">${fld('Phone',inp('f_phone','+880 17...'))}${fld('Location',inp('f_location','Dhaka, BD'))}</div>
    <div class="g2">${fld('LinkedIn',inp('f_linkedin','linkedin.com/in/...'))}${fld('Portfolio',inp('f_portfolio','github.com/...'))}</div>
    ${fld('Summary hint',ta('f_summary','Optional — AI নিজেই লিখবে',2))}`

  if(id==='education') return `
    <div class="sec-title">Education</div>
    <div id="eduList">${eduBlock(0)}</div>
    <button class="btn-g" style="color:#534AB7;font-size:11px" onclick="addEdu()">+ Add degree</button>`

  if(id==='experience') return `
    <div class="sec-title">Experience</div>
    <div class="alert a-info" style="margin-bottom:8px">কোনো experience না থাকলে ফাঁকা রাখো।</div>
    <div id="expList">${expBlock(0)}</div>
    <button class="btn-g" style="color:#534AB7;font-size:11px" onclick="addExp()">+ Add position</button>`

  if(id==='skills') return `
    <div class="sec-title">Skills</div>
    ${fld('Technical Skills',inp('f_tech','Python, React, SQL, Figma...'),'Comma দিয়ে আলাদা করো')}
    ${fld('Soft Skills',inp('f_soft','Leadership, Communication...'))}
    ${fld('Languages',inp('f_langs','Bangla (Native), English (C1)...'))}
    ${fld('Certifications',ta('f_certs','AWS Certified, Dean\'s List...',2))}
    ${fld('Projects',ta('f_proj','Project — description — tech...',2))}`

  if(id==='sop_x') return `
    <div class="sec-title">University & Goals</div>
    <div class="g2">${fld('University *',inp('f_uni','Univ. of Toronto'))}${fld('Program *',inp('f_prog','MSc CS'))}</div>
    ${fld('Why this program?',ta('f_why','কেন এই university/program?',3))}
    ${fld('Career goals',ta('f_goals','Degree এর পরে কী করতে চাও?',2))}
    ${fld('Word limit',sel('f_wlim',['500 words','750 words','1000 words']))}`

  if(id==='cover_x') return `
    <div class="sec-title">Job Details</div>
    <div class="g2">${fld('Company *',inp('f_co','Google BD'))}${fld('Job Title *',inp('f_jt','Software Engineer'))}</div>
    ${fld('Job Description',ta('f_jd','JD paste করো...',4),'AI automatically match করবে')}
    ${fld('Why this company?',ta('f_whyco','কেন এই company?',2))}`

  if(id==='jd') return `
    <div class="sec-title">JD Analyzer</div>
    <div class="alert a-info" style="margin-bottom:8px">🎯 JD paste করলে AI তোমার document automatically tailor করবে।</div>
    ${fld('Job Description (Optional)',ta('f_jd_ctx','এখানে job posting paste করো...',7),'যত বেশি detail, তত tailored result')}
    <div id="jdOk" style="display:none" class="alert a-ok">✅ JD detected!</div>`

  if(id==='cust') return `
    <div class="sec-title">Customize</div>
    <div class="g2">${fld('Tone',sel('f_tone',['Confident','Formal','Warm','Creative']))}${fld('Language',sel('f_lang',['English','বাংলা']))}</div>
    <div class="field"><label>Generation Mode</label>
      <div style="display:flex;gap:6px">
        <button class="mode-card sel" id="mSingle" onclick="setMode('single')"><div style="font-size:14px">⚡</div><div style="font-size:11px;font-weight:600">Single</div><div style="font-size:10px;color:#9ca3af">1 version, fast</div></button>
        <button class="mode-card" id="mMulti" onclick="setMode('multiple')"><div style="font-size:14px">✨</div><div style="font-size:11px;font-weight:600">3 Versions</div><div style="font-size:10px;color:#9ca3af">Pick the best</div></button>
      </div>
    </div>
    ${fld('Extra instructions',ta('f_extra','AI কে special কিছু বলো...',2))}`

  return ''
}

function setMode(m) {
  form.gen_mode=m
  $('mSingle').classList.toggle('sel',m==='single')
  $('mMulti').classList.toggle('sel',m==='multiple')
  $('nxtBtn').textContent=m==='multiple'?'✨ Generate 3 Versions':'✨ Generate'
}

// ── Edu / Exp blocks ───────────────────────────────────────────────────────
function eduBlock(i) {
  return `<div id="edu${i}" style="border:1px solid #e5e7eb;border-radius:8px;padding:9px;margin-bottom:7px;position:relative">
    ${i>0?`<button onclick="$('edu${i}').remove()" style="position:absolute;top:5px;right:7px;background:none;border:none;cursor:pointer;color:#d1d5db;font-size:14px">×</button>`:''}
    <div class="g2"><div class="field"><label>Degree</label><input id="edu_d_${i}" placeholder="B.Sc. CS"></div><div class="field"><label>Institution</label><input id="edu_i_${i}" placeholder="BUET"></div></div>
    <div class="g2"><div class="field"><label>Year</label><input id="edu_y_${i}" placeholder="2020-24"></div><div class="field"><label>GPA</label><input id="edu_g_${i}" placeholder="3.8/4.0"></div></div>
  </div>`
}
function addEdu(){$('eduList').insertAdjacentHTML('beforeend',eduBlock(eduIdx++))}

function expBlock(i) {
  return `<div id="exp${i}" style="border:1px solid #e5e7eb;border-radius:8px;padding:9px;margin-bottom:7px;position:relative">
    ${i>0?`<button onclick="$('exp${i}').remove()" style="position:absolute;top:5px;right:7px;background:none;border:none;cursor:pointer;color:#d1d5db;font-size:14px">×</button>`:''}
    <div class="g2"><div class="field"><label>Title</label><input id="exp_t_${i}" placeholder="Engineer"></div><div class="field"><label>Company</label><input id="exp_c_${i}" placeholder="Pathao"></div></div>
    <div class="g2"><div class="field"><label>Duration</label><input id="exp_d_${i}" placeholder="2023-Now"></div><div class="field"><label>Type</label><select id="exp_ty_${i}"><option>Full-time</option><option>Internship</option><option>Freelance</option></select></div></div>
    <div class="field"><label>Responsibilities</label><textarea id="exp_r_${i}" rows="2" placeholder="কী করতে, কী achieve করলে?"></textarea></div>
  </div>`
}
function addExp(){$('expList').insertAdjacentHTML('beforeend',expBlock(expIdx++))}

// ── Save / Restore ─────────────────────────────────────────────────────────
function saveForm(sid) {
  const g=id=>$(id)?.value||''
  if(sid==='personal') Object.assign(form,{name:g('f_name'),email:g('f_email'),phone:g('f_phone'),location:g('f_location'),linkedin:g('f_linkedin'),portfolio:g('f_portfolio'),summary:g('f_summary')})
  if(sid==='education'){form.education=[];for(let i=0;i<eduIdx;i++){if(!$('edu'+i))continue;form.education.push({degree:g(`edu_d_${i}`),institution:g(`edu_i_${i}`),year:g(`edu_y_${i}`),gpa:g(`edu_g_${i}`)})}}
  if(sid==='experience'){form.experience=[];for(let i=0;i<expIdx;i++){if(!$('exp'+i))continue;form.experience.push({title:g(`exp_t_${i}`),company:g(`exp_c_${i}`),duration:g(`exp_d_${i}`),type:g(`exp_ty_${i}`),responsibilities:g(`exp_r_${i}`)})}}
  if(sid==='skills') Object.assign(form,{techskills:g('f_tech'),softskills:g('f_soft'),langs:g('f_langs'),certs:g('f_certs'),projects:g('f_proj')})
  if(sid==='sop_x') Object.assign(form,{uni:g('f_uni'),program:g('f_prog'),why:g('f_why'),goals:g('f_goals'),wordlimit:g('f_wlim').split(' ')[0]})
  if(sid==='cover_x') Object.assign(form,{company:g('f_co'),jobtitle:g('f_jt'),jd:g('f_jd'),whyco:g('f_whyco')})
  if(sid==='jd') { form.jd_context=g('f_jd_ctx') }
  if(sid==='cust') Object.assign(form,{tone:g('f_tone').toLowerCase(),language:g('f_lang')==='বাংলা'?'bangla':'english',extra:g('f_extra')})
}

function restoreForm(sid) {
  const s=(id,v)=>{if($(id)&&v)$(id).value=v}
  if(sid==='personal'){s('f_name',form.name);s('f_email',form.email);s('f_phone',form.phone);s('f_location',form.location);s('f_linkedin',form.linkedin);s('f_portfolio',form.portfolio);s('f_summary',form.summary)}
  if(sid==='jd'&&form.jd_context){setTimeout(()=>{s('f_jd_ctx',form.jd_context);if(form.jd_context)$('jdOk')&&($('jdOk').style.display='block')},50)}
  if(sid==='cust'){setTimeout(()=>{if(form.gen_mode==='multiple')setMode('multiple')},50)}
}

// ── Prompt builder ─────────────────────────────────────────────────────────
function buildPrompt() {
  const d=form
  const p=`Name:${d.name||'N/A'}|Email:${d.email||''}|Phone:${d.phone||''}|Location:${d.location||''}|LinkedIn:${d.linkedin||''}|Portfolio:${d.portfolio||''}`
  const edu=(d.education||[]).filter(e=>e.institution).map(e=>`${e.degree} — ${e.institution}(${e.year}),GPA:${e.gpa}`).join('; ')||'N/A'
  const exp=(d.experience||[]).filter(e=>e.company).map(e=>`${e.title} at ${e.company}(${e.duration},${e.type}):${e.responsibilities}`).join('\n')||'No experience'
  const lang=d.language==='bangla'?'IMPORTANT: Write entirely in Bengali (Bangla).':'Write in professional English.'
  const jd=d.jd_context||d.jd||''
  const tone=d.tone||'confident'

  const prompts={
    cv:`You are a world-class CV writer. Create a complete professional CV.\n${lang} Tone: ${tone}.\n${jd?`JOB DESCRIPTION (tailor to match):\n${jd}\n`:''}\nPersonal:${p}\nEducation:${edu}\nExperience:\n${exp}\nSkills:${d.techskills||''}|${d.softskills||''}\nLanguages:${d.langs||''}\nCerts:${d.certs||''}\nProjects:${d.projects||''}\nSummary hint:${d.summary||'write compelling summary'}\nExtra:${d.extra||''}\n\nSections: PROFESSIONAL SUMMARY, EDUCATION, WORK EXPERIENCE, SKILLS, PROJECTS, CERTIFICATIONS. Bullet points, quantify achievements.`,
    resume:`You are an expert resume writer. ATS-optimized 1-page resume.\n${lang} Tone: ${tone}.\n${jd?`JD (match keywords):\n${jd}\n`:''}\nPersonal:${p}\nEducation:${edu}\nExperience:\n${exp}\nSkills:${d.techskills||''}\nExtra:${d.extra||''}\n\nFormat: Header → SUMMARY → EXPERIENCE → EDUCATION → SKILLS. Under 450 words. Action verbs. Quantify everything.`,
    sop:`You are an expert academic writer. Write SOP for ${d.program||'graduate program'} at ${d.uni||'university'}. ~${d.wordlimit||750} words.\n${lang} Tone:${tone}.\nPersonal:${p}\nEducation:${edu}\nExperience:\n${exp}\nWhy:${d.why||''}\nGoals:${d.goals||''}\nExtra:${d.extra||''}\n\nStructure: Hook → Background → Experience → Why this program → Goals → Closing. Personal, specific, no clichés.`,
    cover:`Write a cover letter for ${d.jobtitle||'role'} at ${d.company||'company'}.\n${lang} Tone:${tone}.\n${jd?`JD:\n${jd}\n`:''}\nPersonal:${p}\nEducation:${edu}\nExperience:\n${exp}\nWhy company:${d.whyco||''}\nExtra:${d.extra||''}\n\nFormat: Dear Hiring Manager → Hook → Achievement → Why company → CTA. Under 380 words.`,
    linkedin:`Write LinkedIn About section.\n${lang} Tone:${tone}.\nPersonal:${p}\nExperience:\n${exp}\nSkills:${d.techskills||''}|${d.softskills||''}\nExtra:${d.extra||''}\n\n1. HEADLINE: 3 options under 220 chars.\n2. ABOUT: 300-400 words, first person, hook → impact → achievements → goals → CTA.`,
  }
  return prompts[selDoc]||prompts.cv
}

// ── Generate ───────────────────────────────────────────────────────────────
async function generate() {
  const isMulti=form.gen_mode==='multiple'
  show('s2')
  if(isMulti){$('verBadges').style.display='flex';$('genSub').textContent='3টা version তৈরি হচ্ছে — একটু বেশি সময়'}
  const msgs=isMulti?['3 versions তৈরি করছে...','Confident লিখছে...','Formal লিখছে...','Warm লিখছে...']:['AI বিশ্লেষণ করছে...','Structure তৈরি করছে...','Content লিখছে...','Polish করছে...']
  let mi=0; const iv=setInterval(()=>{mi=(mi+1)%msgs.length;$('genMsg').textContent=msgs[mi]},3000)

  try {
    if(isMulti) {
      const tones=['confident','formal','warm']
      const labels=['Confident','Formal','Warm']
      const results=await Promise.all(tones.map(t=>callAPI(buildPromptWithTone(t))))
      clearInterval(iv)
      versions=results.map((c,i)=>({label:labels[i],content:c}))
      selVer=0
      showVersionPicker()
    } else {
      const content=await callAPI(buildPrompt())
      clearInterval(iv)
      showOutput(content)
    }
  } catch(err) {
    clearInterval(iv)
    $('errMsg').textContent='Error: '+err.message
    $('errMsg').style.display='block'
    showOutput('')
  }
}

async function regen() { form.gen_mode='single'; await generate() }

function buildPromptWithTone(tone) { const orig=form.tone; form.tone=tone; const p=buildPrompt(); form.tone=orig; return p }

async function callAPI(prompt) {
  const res=await fetch(API_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt})})
  if(!res.ok) throw new Error(`Server error ${res.status}`)
  const data=await res.json()
  return data.content
}

// ── Version picker ─────────────────────────────────────────────────────────
function showVersionPicker() {
  $('verList').innerHTML=versions.map((v,i)=>`
    <button class="ver-card ${i===0?'sel':''}" onclick="pickVer(${i},this)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
        <span style="font-size:12px;font-weight:600">${v.label} Version</span>
        ${i===0?'<span style="font-size:10px;background:#EEEDFE;color:#534AB7;border-radius:99px;padding:1px 7px">Selected</span>':''}
      </div>
      <p style="font-size:10px;color:#6b7280;line-height:1.6">${v.content.slice(0,120)}...</p>
    </button>`).join('')
  show('s3v')
}

function pickVer(i,el) {
  selVer=i
  document.querySelectorAll('.ver-card').forEach(c=>c.classList.remove('sel'))
  el.classList.add('sel')
}

function pickVersion() { showOutput(versions[selVer].content) }

// ── Output ─────────────────────────────────────────────────────────────────
function showOutput(text) {
  curOutput=text
  $('outLbl').textContent=DOC_LABELS[selDoc]
  $('outBox').textContent=text
  $('wdCt').textContent=text.trim().split(/\s+/).filter(Boolean).length+' words'
  $('errMsg').style.display='none'
  show('s3')
}

function swTab(id, el) {
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('act'))
  el.classList.add('act')
  $('tabPreview').style.display=id==='preview'?'block':'none'
  $('tabAts').style.display=id==='ats'?'block':'none'
  $('tabExport').style.display=id==='export'?'block':'none'
}

async function runATS() {
  $('atsResult').innerHTML='<div style="text-align:center;padding:16px"><div class="spinner" style="width:28px;height:28px;border-width:2px;margin:0 auto 8px"></div><p style="font-size:11px;color:#9ca3af">ATS check চলছে...</p></div>'
  try {
    const res=await callAPI(`You are an ATS expert. Analyze this resume/CV for ATS compatibility.\n\nDOCUMENT:\n${curOutput}\n\nRespond in JSON:\n{"overall_score":<0-100>,"breakdown":{"keywords":<0-25>,"formatting":<0-25>,"structure":<0-25>,"content":<0-25>},"issues":["issue1","issue2"],"quick_fixes":["fix1","fix2","fix3"]}`)
    const data=JSON.parse(res.replace(/\`\`\`json\n?|\`\`\`/g,'').trim())
    const col=data.overall_score>=80?'#059669':data.overall_score>=60?'#d97706':'#dc2626'
    const lbl=data.overall_score>=80?'Excellent':data.overall_score>=60?'Good':'Needs Work'
    $('atsResult').innerHTML=`
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
        <div style="font-size:28px;font-weight:700;color:${col}">${data.overall_score}</div>
        <div><div style="font-size:13px;font-weight:600;color:${col}">${lbl}</div><div style="font-size:10px;color:#9ca3af">ATS Score / 100</div></div>
      </div>
      <div style="margin-bottom:8px">
        ${Object.entries(data.breakdown||{}).map(([k,v])=>`<div style="display:flex;justify-content:space-between;font-size:10px;padding:2px 0"><span style="color:#6b7280">${k}</span><span style="font-weight:600">${v}/25</span></div>`).join('')}
      </div>
      <div class="alert a-err" style="margin-bottom:6px"><strong>Issues:</strong><br>${(data.issues||[]).map(i=>'• '+i).join('<br>')}</div>
      <div class="alert a-warn"><strong>Quick fixes:</strong><br>${(data.quick_fixes||[]).map((f,i)=>`${i+1}. ${f}`).join('<br>')}</div>`
  } catch(e) { $('atsResult').innerHTML=`<div class="alert a-err">ATS check failed: ${e.message}</div>` }
}

function copyOut() {
  navigator.clipboard.writeText(curOutput).then(()=>{
    const m=$('copyMsg'); m.style.display='block'; setTimeout(()=>m.style.display='none',2000)
  })
}

function dlTxt() {
  const blob=new Blob([curOutput],{type:'text/plain'})
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob)
  a.download=`${DOC_LABELS[selDoc]}_${form.name||'doc'}.txt`; a.click()
}

function openWeb() { chrome.tabs.create({url:WEBAPP_URL}) }
