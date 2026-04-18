'use client'

import { useState } from 'react'

interface Preset {
  id: string
  name: string
  agentName: string | null
  brokerageName: string | null
  primaryColor: string
  secondaryColor: string | null
}

interface Props {
  presets: Preset[]
  userId: string
}

const emptyForm = {
  name: '',
  agentName: '',
  brokerageName: '',
  primaryColor: '#E8D5B7',
  secondaryColor: '',
}

const is: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  backgroundColor: '#1A1A1A',
  border: '1px solid #262626',
  borderRadius: 6,
  color: '#F5F5F5',
  fontSize: 14,
  outline: 'none',
}

const ls: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  color: '#888888',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: 6,
}

export function BrandPresetsEditor({ presets: initialPresets, userId }: Props) {
  const [presets, setPresets] = useState<Preset[]>(initialPresets)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  function startEdit(preset: Preset) {
    setEditingId(preset.id)
    setForm({
      name: preset.name,
      agentName: preset.agentName ?? '',
      brokerageName: preset.brokerageName ?? '',
      primaryColor: preset.primaryColor ?? '#E8D5B7',
      secondaryColor: preset.secondaryColor ?? '',
    })
    setMessage('')
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(emptyForm)
    setMessage('')
  }

  async function handleSave() {
    if (!form.name.trim()) { setMessage('Preset name is required.'); return }
    setSaving(true)
    setMessage('')

    try {
      if (editingId) {
        // Update existing
        const res = await fetch(`/api/brand-presets/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.name.trim(),
            agentName: form.agentName.trim() || null,
            brokerageName: form.brokerageName.trim() || null,
            primaryColor: form.primaryColor || '#E8D5B7',
            secondaryColor: form.secondaryColor.trim() || null,
          }),
        })
        const updated = await res.json()
        setPresets(prev => prev.map(p => p.id === editingId ? updated : p))
        setMessage('Preset updated.')
      } else {
        // Create new
        const res = await fetch('/api/brand-presets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            name: form.name.trim(),
            agentName: form.agentName.trim() || null,
            brokerageName: form.brokerageName.trim() || null,
            primaryColor: form.primaryColor || '#E8D5B7',
            secondaryColor: form.secondaryColor.trim() || null,
          }),
        })
        const created = await res.json()
        setPresets(prev => [...prev, created])
        setMessage('Preset created.')
      }
      setEditingId(null)
      setForm(emptyForm)
    } catch {
      setMessage('Something went wrong. Try again.')
    }
    setSaving(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this preset?')) return
    await fetch(`/api/brand-presets/${id}`, { method: 'DELETE' })
    setPresets(prev => prev.filter(p => p.id !== id))
    if (editingId === id) cancelEdit()
  }

  const cardStyle: React.CSSProperties = {
    backgroundColor: '#141414',
    border: '1px solid #262626',
    borderRadius: 8,
    padding: 20,
    marginBottom: 12,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
  }

  return (
    <div>
      {/* PRESET LIST */}
      {presets.length === 0 && !editingId && (
        <div style={{ padding: 40, backgroundColor: '#141414', border: '1px solid #262626', borderRadius: 8, textAlign: 'center', color: '#888888', fontSize: 14, marginBottom: 24 }}>
          No presets yet. Create your first one below.
        </div>
      )}

      {presets.map(preset => (
        <div key={preset.id} style={{ ...cardStyle, borderColor: editingId === preset.id ? '#E8D5B7' : '#262626' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: preset.primaryColor ?? '#E8D5B7', flexShrink: 0 }} />
              <p style={{ fontWeight: 600, fontSize: 15, margin: 0 }}>{preset.name}</p>
            </div>
            {preset.agentName && <p style={{ fontSize: 13, color: '#888888', margin: '2px 0' }}>{preset.agentName}</p>}
            {preset.brokerageName && <p style={{ fontSize: 13, color: '#555', margin: '2px 0' }}>{preset.brokerageName}</p>}
          </div>
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            <button
              type="button"
              onClick={() => startEdit(preset)}
              style={{ padding: '6px 14px', backgroundColor: '#1A1A1A', border: '1px solid #262626', color: '#F5F5F5', borderRadius: 6, fontSize: 13, cursor: 'pointer' }}
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => handleDelete(preset.id)}
              style={{ padding: '6px 14px', backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#FCA5A5', borderRadius: 6, fontSize: 13, cursor: 'pointer' }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* FORM */}
      <div style={{ backgroundColor: '#141414', border: `1px solid ${editingId ? '#E8D5B7' : '#262626'}`, borderRadius: 8, padding: 24, marginTop: 8 }}>
        <h2 style={{ marginTop: 0, marginBottom: 20, fontSize: 16 }}>
          {editingId ? 'Edit Preset' : '+ New Preset'}
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={ls}>Preset Name *</label>
            <input style={is} type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Jane Doe – Compass" />
          </div>
          <div>
            <label style={ls}>Agent Name</label>
            <input style={is} type="text" value={form.agentName} onChange={e => setForm(f => ({ ...f, agentName: e.target.value }))} placeholder="Jane Doe" />
          </div>
          <div>
            <label style={ls}>Brokerage</label>
            <input style={is} type="text" value={form.brokerageName} onChange={e => setForm(f => ({ ...f, brokerageName: e.target.value }))} placeholder="Compass Realty" />
          </div>
          <div>
            <label style={ls}>Primary Color</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                type="color"
                value={form.primaryColor}
                onChange={e => setForm(f => ({ ...f, primaryColor: e.target.value }))}
                style={{ width: 40, height: 36, padding: 2, backgroundColor: '#1A1A1A', border: '1px solid #262626', borderRadius: 6, cursor: 'pointer' }}
              />
              <input
                style={{ ...is, flex: 1 }}
                type="text"
                value={form.primaryColor}
                onChange={e => setForm(f => ({ ...f, primaryColor: e.target.value }))}
                placeholder="#E8D5B7"
              />
            </div>
          </div>
          <div>
            <label style={ls}>Secondary Color</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                type="color"
                value={form.secondaryColor || '#ffffff'}
                onChange={e => setForm(f => ({ ...f, secondaryColor: e.target.value }))}
                style={{ width: 40, height: 36, padding: 2, backgroundColor: '#1A1A1A', border: '1px solid #262626', borderRadius: 6, cursor: 'pointer' }}
              />
              <input
                style={{ ...is, flex: 1 }}
                type="text"
                value={form.secondaryColor}
                onChange={e => setForm(f => ({ ...f, secondaryColor: e.target.value }))}
                placeholder="#ffffff (optional)"
              />
            </div>
          </div>
        </div>

        {message && (
          <p style={{ fontSize: 13, color: message.includes('wrong') ? '#FCA5A5' : '#86EFAC', marginBottom: 12 }}>
            {message}
          </p>
        )}

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            style={{ padding: '9px 20px', backgroundColor: '#E8D5B7', color: '#0A0A0A', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
          >
            {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Create Preset'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              style={{ padding: '9px 20px', backgroundColor: '#1A1A1A', border: '1px solid #262626', color: '#F5F5F5', borderRadius: 6, fontSize: 14, cursor: 'pointer' }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
