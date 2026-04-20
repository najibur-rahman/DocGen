import React, { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { getUserDocuments, deleteDocument } from '../../lib/supabase'
import toast from 'react-hot-toast'

const DOC_ICONS = { cv:'📄', resume:'📋', sop:'🎓', cover:'✉️', linkedin:'💼' }
const DOC_LABELS = { cv:'CV', resume:'Resume', sop:'SOP', cover:'Cover Letter', linkedin:'LinkedIn Bio' }

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })
}

export default function Dashboard({ onOpen, onNew }) {
  const { user, signOut } = useAuth()
  const [docs, setDocs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    getUserDocuments(user.id)
      .then(setDocs)
      .catch(() => toast.error('Could not load documents'))
      .finally(() => setLoading(false))
  }, [user])

  async function handleDelete(id) {
    if (!confirm('Delete this document?')) return
    try {
      await deleteDocument(id)
      setDocs(d => d.filter(x => x.id !== id))
      toast.success('Deleted')
    } catch { toast.error('Delete failed') }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-brand-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">D</div>
            <span className="font-semibold text-gray-900">DocGen AI</span>
          </div>
          <div className="flex items-center gap-3">
            {user && (
              <div className="flex items-center gap-2">
                <img src={user.user_metadata?.avatar_url} alt="" className="w-7 h-7 rounded-full" />
                <span className="text-sm text-gray-600 hidden sm:block">{user.user_metadata?.full_name?.split(' ')[0]}</span>
              </div>
            )}
            <button onClick={signOut} className="btn-ghost text-sm text-gray-400">Sign out</button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Top row */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Documents</h1>
            <p className="text-sm text-gray-400 mt-1">{docs.length} document{docs.length !== 1 ? 's' : ''} saved</p>
          </div>
          <button onClick={onNew} className="btn-primary">+ New Document</button>
        </div>

        {loading && (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-brand-200 border-t-brand-500 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-gray-400">Loading documents...</p>
          </div>
        )}

        {!loading && docs.length === 0 && (
          <div className="text-center py-20 card">
            <p className="text-4xl mb-4">📂</p>
            <p className="text-lg font-semibold text-gray-700 mb-2">কোনো saved document নেই</p>
            <p className="text-sm text-gray-400 mb-6">প্রথম document বানাও!</p>
            <button onClick={onNew} className="btn-primary">Create First Document</button>
          </div>
        )}

        {!loading && docs.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {docs.map(doc => (
              <div key={doc.id} className="card p-5 hover:shadow-md transition-shadow group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{DOC_ICONS[doc.doc_type] || '📄'}</span>
                    <span className="badge bg-brand-50 text-brand-600 border border-brand-100 text-xs">
                      {DOC_LABELS[doc.doc_type] || doc.doc_type}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-red-400 text-lg leading-none"
                  >×</button>
                </div>
                <p className="font-medium text-gray-900 text-sm mb-1 line-clamp-1">{doc.title}</p>
                <p className="text-xs text-gray-400 mb-4">{formatDate(doc.created_at)}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => onOpen(doc)}
                    className="btn-primary text-xs py-1.5 px-3 flex-1"
                  >Open</button>
                  <button
                    onClick={() => { navigator.clipboard.writeText(doc.content); toast.success('Copied!') }}
                    className="btn-ghost text-xs py-1.5 px-3"
                  >Copy</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
