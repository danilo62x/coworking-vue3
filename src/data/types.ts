// Domain model for the coworking / space-management template. Human-readable
// labels (space types, statuses, plan tiers) render via i18n keys; raw values
// (space names, prices, member names) live in the mock data and stores.

/** Category of bookable space. */
export type SpaceType = 'mesa-flex' | 'mesa-fixa' | 'sala-reuniao' | 'sala-privativa' | 'auditorio'

/** Live status of an individual space on the floor map. */
export type SpaceStatus = 'livre' | 'ocupado' | 'reservado' | 'manutencao'

/** Whether a space type is priced per hour or per day. */
export type PriceUnit = 'hora' | 'dia'

export interface Space {
  id: number
  slug: string
  name: string
  type: SpaceType
  /** seats / desks the space holds */
  capacity: number
  /** price in the active currency (mock values are BRL) */
  price: number
  priceUnit: PriceUnit
  description: string
  /** picsum seed -> photo URLs via spaceImage() */
  photos: string[]
  /** i18n key suffixes under `amenities.<amenity>` */
  amenities: string[]
  status: SpaceStatus
  /** floor / zone label, e.g. "Térreo", "1º andar" */
  floor: string
}

export type ReservationStatus = 'confirmada' | 'em-uso' | 'concluida' | 'cancelada'

export interface Reservation {
  id: number
  spaceId: number
  memberId: number
  /** ISO date-time (start) */
  start: string
  /** ISO date-time (end) */
  end: string
  status: ReservationStatus
  /** snapshot of total value */
  value: number
  /** true once the member has physically checked in */
  checkedIn: boolean
  notes: string
}

export type PlanTier = 'day-pass' | 'flex' | 'fixo' | 'dedicado'

export type MemberStatus = 'ativo' | 'inadimplente' | 'pausado'

export interface Member {
  id: number
  name: string
  email: string
  phone: string
  avatar: string
  /** plan id the member is subscribed to */
  planId: number
  status: MemberStatus
  /** ISO date the member joined */
  since: string
  /** remaining booking credits this cycle */
  credits: number
  company: string
}

export interface Plan {
  id: number
  tier: PlanTier
  name: string
  /** monthly price (day-pass is a single-day price) */
  price: number
  priceUnit: 'mes' | 'dia'
  /** monthly booking credits included */
  credits: number
  /** i18n key suffixes under `planBenefits.<benefit>` */
  benefits: string[]
  /** highlighted as the recommended plan */
  featured: boolean
}

export type InvoiceStatus = 'paga' | 'pendente' | 'vencida'

export interface Invoice {
  id: number
  memberId: number
  planId: number
  /** ISO date the invoice is due */
  dueDate: string
  amount: number
  status: InvoiceStatus
  /** "YYYY-MM" competence month */
  reference: string
}
