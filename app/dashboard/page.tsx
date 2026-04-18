import { auth } from '@/auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { getProjectsPageByUserId } from '@/lib/db/projects'
import { getUserById } from '@/lib/db/users'
import { PLAN_LIMITS } from '@/lib/constants'
import { ProjectCard } from './ProjectCard'
import { ManageBillingButton } from './ManageBillingButton'
import styles from './page.module.css'

const PAGE_SIZE = 8

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const search = await searchParams
  const page = Math.max(1, Number(search.page ?? '1') || 1)

  const [projectsPage, user] = await Promise.all([
    getProjectsPageByUserId(session.user.id, page, PAGE_SIZE),
    getUserById(session.user.id),
  ])

  const projects = projectsPage.projects
  const totalPages = Math.max(1, Math.ceil(projectsPage.total / PAGE_SIZE))

  const planTier = (user?.planTier ?? 'FREE') as keyof typeof PLAN_LIMITS
  const limit = PLAN_LIMITS[planTier] ?? 0
  const used = user?.monthlyUsage ?? 0
  const remaining = Math.max(0, limit - used)

  return (
    <main className={styles.shell}>
      <section className="container">
        <div className={styles.header}>
          <div>
            <h1 style={{ marginBottom: 4 }}>Projects</h1>
            <p className="text-subtle" style={{ margin: 0 }}>{session.user.email}</p>
          </div>

          <div className={styles.actions}>
            <div className={styles.pill}>
              <strong>{remaining}</strong> / {limit} renders left
            </div>

            {user?.stripeCustomerId ? (
              <ManageBillingButton />
            ) : (
              <Link href="/pricing" className="btn-primary">Upgrade</Link>
            )}

            <NewProjectButton userId={session.user.id} />
          </div>
        </div>

        {planTier === 'FREE' && (
          <div className={styles.banner}>
            <p style={{ margin: 0 }}>
              Free trial includes one render. Upgrade for recurring monthly volume.
            </p>
            <Link href="/pricing" className="btn-secondary">View plans</Link>
          </div>
        )}

        {remaining === 0 && (
          <div className={styles.banner}>
            <p style={{ margin: 0 }}>Monthly limit reached for your current plan.</p>
            <Link href="/pricing" className="btn-primary">Upgrade plan</Link>
          </div>
        )}

        {projects.length === 0 ? (
          <div className={`${styles.empty} surface-card`}>
            No projects yet. Click New Project to start your first render.
          </div>
        ) : (
          <div>
            {projects.map((p) => (
              <ProjectCard key={p.id} id={p.id} address={p.address} price={p.price} status={p.status} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <nav className={styles.pagination} aria-label="Project list pagination">
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageIndex = i + 1
              return (
                <Link
                  key={pageIndex}
                  href={`/dashboard?page=${pageIndex}`}
                  className={pageIndex === page ? 'btn-primary' : 'btn-secondary'}
                >
                  {pageIndex}
                </Link>
              )
            })}
          </nav>
        )}
      </section>
    </main>
  )
}

function NewProjectButton({ userId }: { userId: string }) {
  async function handleCreate() {
    'use server'
    const { createProject } = await import('@/lib/db/projects')
    const project = await createProject(userId)
    const { redirect } = await import('next/navigation')
    redirect(`/projects/${project.id}`)
  }

  return (
    <form action={handleCreate}>
      <button type="submit" className="btn-primary">+ New Project</button>
    </form>
  )
}
