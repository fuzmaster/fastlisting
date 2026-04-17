'use client'

import Link from 'next/link'
import { useState } from 'react'

type Props = {
  id: string
  address: string | null
  price: string | null
  status: string
}

export function ProjectCard({ id, address, price, status }: Props) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link href={`/projects/${id}`} style={{ textDecoration: 'none' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          padding: '16px 20px',
          backgroundColor: hovered ? '#1A1A1A' : '#141414',
          border: `1px solid ${hovered ? '#E8D5B7' : '#262626'}`,
          borderRadius: 8,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          transition: 'border-color 0.15s, background-color 0.15s',
          cursor: 'pointer',
          marginBottom: 8,
        }}
      >
        <div>
          <p style={{ fontWeight: 500, marginBottom: 2, marginTop: 0, color: '#F5F5F5' }}>
            {address ?? 'Untitled Project'}
          </p>
          <p style={{ fontSize: 13, color: '#888888', margin: 0 }}>
            {price ? `$${price}` : 'No price set'}
          </p>
        </div>
        <span style={{
          fontSize: 12,
          padding: '3px 8px',
          borderRadius: 4,
          backgroundColor: status === 'COMPLETED' ? '#166534' : status === 'RENDERING' ? '#92400E' : '#1A1A1A',
          color: status === 'COMPLETED' ? '#86EFAC' : status === 'RENDERING' ? '#FCD34D' : '#888888',
          border: '1px solid',
          borderColor: status === 'COMPLETED' ? '#166534' : status === 'RENDERING' ? '#92400E' : '#262626',
        }}>
          {status}
        </span>
      </div>
    </Link>
  )
}
