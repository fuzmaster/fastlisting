import styles from './WorkflowAnimation.module.css'

function InboxIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="8" y="14" width="48" height="38" rx="6" fill="none" className="icon-stroke" strokeWidth="3.2" />
      <path d="M8 30 L24 30 L28 38 L36 38 L40 30 L56 30" fill="none" className="icon-stroke" strokeWidth="3.2" strokeLinejoin="round" />
      <circle cx="50" cy="16" r="6" className="icon-fill" />
      <circle cx="50" cy="16" r="3" fill="#fff" className={styles.pulseDot} />
    </svg>
  )
}

function GearIcon() {
  return (
    <svg width="44" height="44" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g className={styles.gearSpin}>
        <circle cx="32" cy="32" r="10" fill="none" className="icon-stroke" strokeWidth="3.2" />
        <g className="icon-fill">
          <rect x="29" y="6" width="6" height="8" rx="1" />
          <rect x="29" y="50" width="6" height="8" rx="1" />
          <rect x="6" y="29" width="8" height="6" rx="1" />
          <rect x="50" y="29" width="8" height="6" rx="1" />
          <rect x="13" y="13" width="6" height="8" rx="1" transform="rotate(-45 16 17)" />
          <rect x="45" y="13" width="6" height="8" rx="1" transform="rotate(45 48 17)" />
          <rect x="13" y="43" width="6" height="8" rx="1" transform="rotate(45 16 47)" />
          <rect x="45" y="43" width="6" height="8" rx="1" transform="rotate(-45 48 47)" />
        </g>
      </g>
    </svg>
  )
}

function ScreensIcon() {
  return (
    <svg width="46" height="40" viewBox="0 0 70 56" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="4" y="6" width="40" height="28" rx="3" fill="none" className="icon-stroke" strokeWidth="3" />
      <rect x="14" y="38" width="20" height="3" rx="1.5" className="icon-fill" />
      <path d="M20 16 L30 22 L20 28 Z" className="icon-fill" />
      <rect x="50" y="12" width="16" height="32" rx="3" fill="none" className="icon-stroke" strokeWidth="3" />
      <path d="M55 24 L62 28 L55 32 Z" className="icon-fill" />
    </svg>
  )
}

function DeliveryIcon() {
  return (
    <svg width="44" height="44" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M6 30 L58 8 L46 56 L34 38 Z"
        fill="none"
        className="icon-stroke"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      <path d="M34 38 L58 8" fill="none" className="icon-stroke" strokeWidth="3.2" strokeLinecap="round" />
      <circle cx="46" cy="56" r="4" className="icon-fill" />
    </svg>
  )
}

const STEPS = [
  {
    num: 'STEP 01',
    title: 'Your photos arrive',
    desc: 'I get an instant notification when your share link lands in my queue. No waiting on my end.',
    Icon: InboxIcon,
  },
  {
    num: 'STEP 02',
    title: 'Automation processes',
    desc: 'My pipeline sequences the shots, applies your brand colors and logo, and queues both renders.',
    Icon: GearIcon,
  },
  {
    num: 'STEP 03',
    title: 'Both formats render',
    desc: '16:9 for MLS and YouTube, 9:16 for Reels and TikTok — generated in parallel, not separately.',
    Icon: ScreensIcon,
  },
  {
    num: 'STEP 04',
    title: 'Delivered to you',
    desc: 'Download links arrive in your inbox within 24 hours — usually closer to 12.',
    Icon: DeliveryIcon,
  },
]

export function WorkflowAnimation() {
  return (
    <div className={styles.wrap}>
      <div className={styles.track}>
        {STEPS.map((s) => (
          <article key={s.num} className={styles.step}>
            <span className={styles.numBadge}>{s.num}</span>
            <div className={styles.iconWrap}>
              <s.Icon />
            </div>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
