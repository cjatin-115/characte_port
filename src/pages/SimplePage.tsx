import type { ReactNode } from 'react'

export function SimplePage({ title, index, children, className = '' }: { title: string; index: string; children: ReactNode; className?: string }) {
  return <main id="main-content" className={`page-content ${className}`.trim()}><p className="eyebrow">{index} — {title.toUpperCase()}</p><h1>{title}</h1><div className="about-copy">{children}</div></main>
}
