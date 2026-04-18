'use client'

import { ReactNode } from 'react'
import styles from './ConfirmModal.module.css'

type ConfirmModalProps = {
  open: boolean
  title: string
  body: ReactNode
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({
  open,
  title,
  body,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null

  return (
    <div className={styles.overlay} role="presentation" onClick={onCancel}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ marginTop: 0 }}>{title}</h3>
        <div className="text-subtle">{body}</div>
        <div className={styles.actions}>
          <button type="button" className="btn-secondary" onClick={onCancel}>{cancelText}</button>
          <button type="button" className="btn-primary" onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </div>
  )
}
