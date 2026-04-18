'use client'

import Link from 'next/link'
import styles from './ProjectCard.module.css'

type Props = {
  id: string
  address: string | null
  price: string | null
  status: string
}

export function ProjectCard({ id, address, price, status }: Props) {
  const statusClass = status === 'COMPLETED'
    ? `${styles.status} ${styles.completed}`
    : status === 'RENDERING'
      ? `${styles.status} ${styles.rendering}`
      : `${styles.status} ${styles.draft}`

  return (
    <Link href={`/projects/${id}`}>
      <div className={styles.card}>
        <div>
          <p className={styles.title}>
            {address ?? 'Untitled Project'}
          </p>
          <p className={styles.sub}>
            {price ? `$${price}` : 'No price set'}
          </p>
        </div>
        <span className={statusClass}>
          {status}
        </span>
      </div>
    </Link>
  )
}
