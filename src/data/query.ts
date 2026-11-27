import type {
  Invoice,
  Member,
  MemberStatus,
  Plan,
  PlanTier,
  Reservation,
  ReservationStatus,
  Space,
  SpaceStatus,
  SpaceType,
} from './types'

// ---- Lookups ------------------------------------------------------------

export function spaceById(list: Space[], id: number): Space | undefined {
  return list.find((s) => s.id === id)
}

/** First space whose slug (type key) matches — used for the public detail page. */
export function spaceBySlug(list: Space[], slug: string): Space | undefined {
  return list.find((s) => s.slug === slug)
}

export function memberById(list: Member[], id: number): Member | undefined {
  return list.find((m) => m.id === id)
}

export function planById(list: Plan[], id: number): Plan | undefined {
  return list.find((p) => p.id === id)
}

export const SPACE_TYPES_ORDER: SpaceType[] = ['mesa-flex', 'mesa-fixa', 'sala-reuniao', 'sala-privativa', 'auditorio']
export const SPACE_STATUSES: SpaceStatus[] = ['livre', 'ocupado', 'reservado', 'manutencao']
export const RESERVATION_STATUSES: ReservationStatus[] = ['confirmada', 'em-uso', 'concluida', 'cancelada']
export const MEMBER_STATUSES: MemberStatus[] = ['ativo', 'inadimplente', 'pausado']
export const PLAN_TIERS: PlanTier[] = ['day-pass', 'flex', 'fixo', 'dedicado']

// ---- Space queries ------------------------------------------------------

export function spacesByType(list: Space[], type: SpaceType | 'all'): Space[] {
  return type === 'all' ? list : list.filter((s) => s.type === type)
}

export function spacesByStatus(list: Space[], status: SpaceStatus | 'all'): Space[] {
  return status === 'all' ? list : list.filter((s) => s.status === status)
}

/** Count of spaces grouped by live status — feeds the map legend counters. */
export function statusCounts(list: Space[]): Record<SpaceStatus, number> {
  const out: Record<SpaceStatus, number> = { livre: 0, ocupado: 0, reservado: 0, manutencao: 0 }
  for (const s of list) out[s.status]++
  return out
}

/** Count of spaces grouped by type — for the dashboard donut. */
export function countByType(list: Space[]): { type: SpaceType; count: number }[] {
  const counts = new Map<SpaceType, number>()
  for (const s of list) counts.set(s.type, (counts.get(s.type) ?? 0) + 1)
  return SPACE_TYPES_ORDER.map((type) => ({ type, count: counts.get(type) ?? 0 })).filter((x) => x.count > 0)
}

// ---- Date helpers -------------------------------------------------------

export function ymd(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function dateFromYmd(key: string): Date {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function isToday(iso: string): boolean {
  return ymd(new Date(iso)) === ymd(new Date())
}

// ---- Reservation filtering + pagination ---------------------------------

export interface ReservationFilters {
  spaceId?: number | 'all'
  status?: ReservationStatus | 'all'
  /** YYYY-MM-DD inclusive lower bound */
  from?: string
  /** YYYY-MM-DD inclusive upper bound */
  to?: string
  query?: string
}

export function filterReservations(
  list: Reservation[],
  filters: ReservationFilters,
  spaces: Space[],
  members: Member[]
): Reservation[] {
  const q = filters.query?.trim().toLowerCase() ?? ''
  return list.filter((r) => {
    if (filters.spaceId && filters.spaceId !== 'all' && r.spaceId !== filters.spaceId) return false
    if (filters.status && filters.status !== 'all' && r.status !== filters.status) return false
    const day = r.start.slice(0, 10)
    if (filters.from && day < filters.from) return false
    if (filters.to && day > filters.to) return false
    if (q) {
      const space = spaces.find((s) => s.id === r.spaceId)
      const member = members.find((m) => m.id === r.memberId)
      const hay = `${space?.name ?? ''} ${member?.name ?? ''} ${member?.company ?? ''}`.toLowerCase()
      if (!hay.includes(q)) return false
    }
    return true
  })
}

export interface Page<T> {
  rows: T[]
  total: number
  page: number
  pageCount: number
}

export function paginate<T>(list: T[], page: number, pageSize: number): Page<T> {
  const total = list.length
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const safe = Math.min(Math.max(1, page), pageCount)
  const start = (safe - 1) * pageSize
  return { rows: list.slice(start, start + pageSize), total, page: safe, pageCount }
}

export function reservationsForDay(list: Reservation[], dayKey: string): Reservation[] {
  return list
    .filter((r) => r.start.slice(0, 10) === dayKey && r.status !== 'cancelada')
    .sort((a, b) => +new Date(a.start) - +new Date(b.start))
}

export function todayReservations(list: Reservation[]): Reservation[] {
  return reservationsForDay(list, ymd(new Date()))
}

export function reservationsForSpace(list: Reservation[], spaceId: number): Reservation[] {
  return list
    .filter((r) => r.spaceId === spaceId)
    .sort((a, b) => +new Date(b.start) - +new Date(a.start))
}

export function reservationsForMember(list: Reservation[], memberId: number): Reservation[] {
  return list
    .filter((r) => r.memberId === memberId)
    .sort((a, b) => +new Date(b.start) - +new Date(a.start))
}

// ---- Member filtering ---------------------------------------------------

export interface MemberFilters {
  planId?: number | 'all'
  status?: MemberStatus | 'all'
  query?: string
}

export function filterMembers(list: Member[], filters: MemberFilters): Member[] {
  const q = filters.query?.trim().toLowerCase() ?? ''
  return list.filter((m) => {
    if (filters.planId && filters.planId !== 'all' && m.planId !== filters.planId) return false
    if (filters.status && filters.status !== 'all' && m.status !== filters.status) return false
    if (q && !`${m.name} ${m.company} ${m.email}`.toLowerCase().includes(q)) return false
    return true
  })
}

// ---- Invoice queries ----------------------------------------------------

export function invoicesForMember(list: Invoice[], memberId: number): Invoice[] {
  return list
    .filter((i) => i.memberId === memberId)
    .sort((a, b) => (a.dueDate < b.dueDate ? 1 : -1))
}

export function invoiceTotals(list: Invoice[]): { paid: number; pending: number; overdue: number } {
  let paid = 0
  let pending = 0
  let overdue = 0
  for (const i of list) {
    if (i.status === 'paga') paid += i.amount
    else if (i.status === 'pendente') pending += i.amount
    else overdue += i.amount
  }
  return { paid, pending, overdue }
}

// ---- Dashboard metrics --------------------------------------------------

export interface DashboardMetrics {
  /** occupancy rate 0..100 (occupied or reserved spaces / total) */
  occupancy: number
  activeMembers: number
  todayReservations: number
  /** revenue from paid invoices this month + completed/in-use reservations today */
  revenue: number
}

export function computeMetrics(
  spaces: Space[],
  reservations: Reservation[],
  members: Member[],
  invoices: Invoice[]
): DashboardMetrics {
  const occupied = spaces.filter((s) => s.status === 'ocupado' || s.status === 'reservado').length
  const occupancy = spaces.length > 0 ? Math.round((occupied / spaces.length) * 100) : 0

  const activeMembers = members.filter((m) => m.status === 'ativo').length

  const todayKey = ymd(new Date())
  const todayReservations = reservations.filter((r) => r.start.slice(0, 10) === todayKey && r.status !== 'cancelada').length

  const monthRef = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`
  const invoiceRevenue = invoices
    .filter((i) => i.reference === monthRef && i.status === 'paga')
    .reduce((s, i) => s + i.amount, 0)
  const bookingRevenue = reservations
    .filter((r) => r.start.slice(0, 10) === todayKey && (r.status === 'em-uso' || r.status === 'concluida'))
    .reduce((s, r) => s + r.value, 0)

  return { occupancy, activeMembers, todayReservations, revenue: invoiceRevenue + bookingRevenue }
}

/** Most-used spaces by (non-cancelled) reservation count. */
export function mostUsedSpaces(
  reservations: Reservation[],
  spaces: Space[],
  limit = 5
): { space: Space; count: number }[] {
  const counts = new Map<number, number>()
  for (const r of reservations) {
    if (r.status === 'cancelada') continue
    counts.set(r.spaceId, (counts.get(r.spaceId) ?? 0) + 1)
  }
  return [...counts.entries()]
    .map(([id, count]) => ({ space: spaces.find((s) => s.id === id)!, count }))
    .filter((x) => x.space)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

/**
 * Occupancy %, by-weekday, derived from the dashboard period series plus the
 * live status snapshot. Returns the area-chart shape the dashboard consumes.
 */
export function occupancySeries(series: { categories: string[]; occupancy: number[]; revenue: number[] }) {
  return {
    categories: series.categories,
    occupancy: series.occupancy,
    revenue: series.revenue,
  }
}

// ---- Hour helpers for reservations --------------------------------------

/** Whole hours between two ISO datetimes (rounded). */
export function hoursBetween(startIso: string, endIso: string): number {
  return Math.max(1, Math.round((+new Date(endIso) - +new Date(startIso)) / 3_600_000))
}
