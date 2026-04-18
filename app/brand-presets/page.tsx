import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getBrandPresetsByUserId } from '@/lib/db/brand-presets'
import { BrandPresetsEditor } from './BrandPresetsEditor'

export default async function BrandPresetsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const presets = await getBrandPresetsByUserId(session.user.id)

  return (
    <main style={{ padding: '32px 24px', maxWidth: 800, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ marginBottom: 4 }}>Brand Presets</h1>
        <p style={{ color: '#888888', fontSize: 14, margin: 0 }}>
          Save agent and brokerage details once. Apply to any project instantly.
        </p>
      </div>
      <BrandPresetsEditor presets={presets} userId={session.user.id} />
    </main>
  )
}
