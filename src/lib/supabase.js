import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ── Auth helpers ────────────────────────────────────────────────────────────

export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin }
  })
  if (error) throw error
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// ── Document storage ────────────────────────────────────────────────────────

export async function saveDocument({ userId, docType, title, content, formData, templateId }) {
  const { data, error } = await supabase
    .from('documents')
    .insert([{ user_id: userId, doc_type: docType, title, content, form_data: formData, template_id: templateId }])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getUserDocuments(userId) {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function deleteDocument(docId) {
  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', docId)
  if (error) throw error
}

export async function updateDocument(docId, content) {
  const { data, error } = await supabase
    .from('documents')
    .update({ content, updated_at: new Date().toISOString() })
    .eq('id', docId)
    .select()
    .single()
  if (error) throw error
  return data
}
