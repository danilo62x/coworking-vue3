import type {
  Invoice,
  Member,
  Plan,
  Reservation,
  ReservationStatus,
  Space,
  SpaceStatus,
  SpaceType,
} from './types'

// Curated Unsplash sets (IDs verificados). Determinístico por seed.
const OFFICE = ['1497366216548-37526070297c', '1553877522-43269d4ea984', '1522202176988-66273c2fd55f', '1542744173-8e7e53415bb0', '1454165804606-c3d57bc86b40', '1519389950473-47ba0277781c', '1600880292203-757bb62b4baf', '1527192491265-7e15c55b1ed2', '1497215842964-222b430dc094', '1606857521015-7f9fcf423740', '1581091226825-a6a2a5aee158', '1507679799987-c73779587ccf', '1517245386807-bb43f82c33c4', '1552664730-d307ca884978']
const PEOPLE = ['1500648767791-00dcc994a43e', '1494790108377-be9c29b29330', '1507003211169-0a1dd7228f2d', '1438761681033-6461ffad8d80', '1633332755192-727a05c4013d', '1573496359142-b8d87734a5a2']
function imgHash(s: string): number { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }
function unsplash(id: string, w: number, h: number): string { return `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&q=70&auto=format`; }

/** Deterministic image URL for a space/coworking photo (Unsplash office set). */
export function spaceImage(seed: string, w = 1000, h = 700): string {
  return unsplash(OFFICE[imgHash('cw-' + seed) % OFFICE.length], w, h)
}

export const av = (seed: string) => unsplash(PEOPLE[imgHash('cw-mb-' + seed) % PEOPLE.length], 120, 120)

// ---- Helpers to anchor reservation dates around "today" -----------------

function atTime(dayOffset: number, hour: number, minute = 0): string {
  const d = new Date()
  d.setDate(d.getDate() + dayOffset)
  d.setHours(hour, minute, 0, 0)
  return d.toISOString()
}

function endAt(startIso: string, hours: number): string {
  const d = new Date(startIso)
  d.setHours(d.getHours() + hours)
  return d.toISOString()
}

// ---- Plans --------------------------------------------------------------

export const PLANS: Plan[] = [
  {
    id: 1,
    tier: 'day-pass',
    name: 'Day Pass',
    price: 69,
    priceUnit: 'dia',
    credits: 1,
    benefits: ['hotDesk', 'wifi', 'coffee', 'lounge'],
    featured: false,
  },
  {
    id: 2,
    tier: 'flex',
    name: 'Flex',
    price: 549,
    priceUnit: 'mes',
    credits: 10,
    benefits: ['hotDesk', 'wifi', 'coffee', 'lounge', 'meetingHours', 'lockers'],
    featured: true,
  },
  {
    id: 3,
    tier: 'fixo',
    name: 'Mesa Fixa',
    price: 899,
    priceUnit: 'mes',
    credits: 30,
    benefits: ['fixedDesk', 'wifi', 'coffee', 'lounge', 'meetingHours', 'lockers', 'mail', 'support24'],
    featured: false,
  },
  {
    id: 4,
    tier: 'dedicado',
    name: 'Sala Dedicada',
    price: 2490,
    priceUnit: 'mes',
    credits: 80,
    benefits: ['privateOffice', 'wifi', 'coffee', 'lounge', 'meetingHours', 'lockers', 'mail', 'support24', 'parking', 'phoneBooth'],
    featured: false,
  },
]

// ---- Spaces -------------------------------------------------------------

const AMEN_DESK = ['wifi', 'coffee', 'power', 'lounge']
const AMEN_FIXED = ['wifi', 'coffee', 'power', 'lounge', 'locker', 'monitor']
const AMEN_MEETING = ['wifi', 'tv', 'whiteboard', 'video', 'coffee', 'ac']
const AMEN_PRIVATE = ['wifi', 'power', 'locker', 'ac', 'phoneBooth', 'whiteboard']
const AMEN_AUDIT = ['wifi', 'projector', 'sound', 'stage', 'ac', 'catering']

function descFor(type: SpaceType): string {
  switch (type) {
    case 'mesa-flex':
      return 'Estação de trabalho compartilhada com acesso a toda a estrutura do espaço.'
    case 'mesa-fixa':
      return 'Mesa exclusiva com armário próprio e monitor, sempre reservada para você.'
    case 'sala-reuniao':
      return 'Sala equipada com TV, quadro branco e videoconferência para encontros produtivos.'
    case 'sala-privativa':
      return 'Escritório fechado para sua equipe, com privacidade e infraestrutura completa.'
    case 'auditorio':
      return 'Espaço amplo para eventos, palestras e workshops com som e projeção profissionais.'
  }
}

const STATUSES: SpaceStatus[] = ['livre', 'ocupado', 'reservado', 'manutencao']

function buildSpaces(): Space[] {
  const list: Space[] = []
  let id = 0

  // 16 flex desks (térreo open space) — statuses cycle for a lively map
  for (let i = 1; i <= 16; i++) {
    id++
    const status: SpaceStatus =
      i % 7 === 0 ? 'manutencao' : i % 3 === 0 ? 'reservado' : i % 2 === 0 ? 'ocupado' : 'livre'
    list.push({
      id,
      slug: 'mesa-flex',
      name: `Mesa Flex ${String(i).padStart(2, '0')}`,
      type: 'mesa-flex',
      capacity: 1,
      price: 18,
      priceUnit: 'hora',
      description: descFor('mesa-flex'),
      photos: [spaceImage('flex-1'), spaceImage('flex-2'), spaceImage('flex-3')],
      amenities: AMEN_DESK,
      status,
      floor: 'Térreo',
    })
  }

  // 8 fixed desks (1º andar)
  for (let i = 1; i <= 8; i++) {
    id++
    const status: SpaceStatus = i % 4 === 0 ? 'manutencao' : i % 2 === 0 ? 'ocupado' : i % 3 === 0 ? 'reservado' : 'livre'
    list.push({
      id,
      slug: 'mesa-fixa',
      name: `Mesa Fixa ${String(i).padStart(2, '0')}`,
      type: 'mesa-fixa',
      capacity: 1,
      price: 120,
      priceUnit: 'dia',
      description: descFor('mesa-fixa'),
      photos: [spaceImage('fixa-1'), spaceImage('fixa-2'), spaceImage('fixa-3')],
      amenities: AMEN_FIXED,
      status,
      floor: '1º andar',
    })
  }

  // 4 meeting rooms (1º andar)
  const meetingCaps = [6, 8, 12, 4]
  for (let i = 0; i < 4; i++) {
    id++
    const status: SpaceStatus = i === 1 ? 'ocupado' : i === 2 ? 'reservado' : i === 3 ? 'manutencao' : 'livre'
    list.push({
      id,
      slug: 'sala-reuniao',
      name: `Sala de Reunião ${['Atlântico', 'Pacífico', 'Índico', 'Ártico'][i]}`,
      type: 'sala-reuniao',
      capacity: meetingCaps[i],
      price: 90,
      priceUnit: 'hora',
      description: descFor('sala-reuniao'),
      photos: [spaceImage('meet-1'), spaceImage('meet-2'), spaceImage('meet-3')],
      amenities: AMEN_MEETING,
      status,
      floor: '1º andar',
    })
  }

  // 4 private offices (2º andar)
  const privCaps = [4, 6, 8, 10]
  for (let i = 0; i < 4; i++) {
    id++
    const status: SpaceStatus = i === 0 ? 'ocupado' : i === 3 ? 'reservado' : 'livre'
    list.push({
      id,
      slug: 'sala-privativa',
      name: `Sala Privativa ${i + 1}0${i + 1}`,
      type: 'sala-privativa',
      capacity: privCaps[i],
      price: 320,
      priceUnit: 'dia',
      description: descFor('sala-privativa'),
      photos: [spaceImage('priv-1'), spaceImage('priv-2'), spaceImage('priv-3')],
      amenities: AMEN_PRIVATE,
      status,
      floor: '2º andar',
    })
  }

  // 1 auditorium (2º andar)
  id++
  list.push({
    id,
    slug: 'auditorio',
    name: 'Auditório Horizonte',
    type: 'auditorio',
    capacity: 80,
    price: 480,
    priceUnit: 'hora',
    description: descFor('auditorio'),
    photos: [spaceImage('audi-1'), spaceImage('audi-2'), spaceImage('audi-3')],
    amenities: AMEN_AUDIT,
    status: 'livre',
    floor: '2º andar',
  })

  return list
}

export const SPACES: Space[] = buildSpaces()

/** Representative "type" cards for the public /espacos grid. */
export interface SpaceTypeInfo {
  type: SpaceType
  slug: string
  capacity: number
  price: number
  priceUnit: 'hora' | 'dia'
  amenities: string[]
  photos: string[]
  count: number
}

export const SPACE_TYPES: SpaceTypeInfo[] = (['mesa-flex', 'mesa-fixa', 'sala-reuniao', 'sala-privativa', 'auditorio'] as SpaceType[]).map(
  (type) => {
    const sample = SPACES.find((s) => s.type === type)!
    const count = SPACES.filter((s) => s.type === type).length
    return {
      type,
      slug: type,
      capacity: sample.capacity,
      price: sample.price,
      priceUnit: sample.priceUnit,
      amenities: sample.amenities,
      photos: sample.photos,
      count,
    }
  }
)

// ---- Members ------------------------------------------------------------

const MEMBER_NAMES: [string, string, number, number][] = [
  // name, company, planId, statusIndex (0 ativo,1 inadimplente,2 pausado)
  ['Marina Costa', 'Studio Bossa', 2, 0],
  ['Rafael Andrade', 'Andrade Dev', 3, 0],
  ['Juliana Reis', 'Freelancer', 1, 0],
  ['Bruno Cardoso', 'Northwind', 2, 0],
  ['Carla Nunes', 'Pixel & Co', 3, 1],
  ['Diego Martins', 'Lumina Labs', 4, 0],
  ['Elaine Souza', 'Souza Contábil', 2, 0],
  ['Felipe Ramos', 'Ramos Jurídico', 3, 0],
  ['Gabriela Lima', 'Freelancer', 1, 2],
  ['Henrique Alves', 'Alves Arquitetura', 4, 0],
  ['Isabela Moraes', 'Moraes Design', 2, 0],
  ['João Pedro', 'JP Consultoria', 2, 1],
  ['Larissa Pinto', 'Pinto Mídia', 1, 0],
  ['Marcos Vieira', 'Vieira Tech', 3, 0],
  ['Natália Rocha', 'Rocha & Filhos', 4, 0],
  ['Otávio Dias', 'Freelancer', 1, 0],
  ['Patrícia Gomes', 'Gomes Marketing', 2, 0],
  ['Quitéria Barros', 'Barros Studio', 2, 2],
  ['Ricardo Teixeira', 'Teixeira Law', 3, 0],
  ['Sofia Mendes', 'Mendes Creative', 2, 0],
  ['Tiago Fernandes', 'Fernandes IT', 3, 1],
  ['Úrsula Campos', 'Campos Consult', 4, 0],
  ['Vinícius Lopes', 'Freelancer', 1, 0],
  ['Wanessa Cunha', 'Cunha Brand', 2, 0],
]

const MEMBER_STATUS: Member['status'][] = ['ativo', 'inadimplente', 'pausado']

export const MEMBERS: Member[] = MEMBER_NAMES.map(([name, company, planId, statusIdx], i) => {
  const id = i + 1
  const since = new Date()
  since.setMonth(since.getMonth() - ((i * 3) % 28) - 1)
  const plan = PLANS.find((p) => p.id === planId)!
  return {
    id,
    name,
    email: `${name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '.')}@mail.com`,
    phone: `+55 11 9${String(8000 + i).padStart(4, '0')}-${String(1000 + i * 7).slice(0, 4)}`,
    avatar: av(String(id)),
    planId,
    status: MEMBER_STATUS[statusIdx],
    since: since.toISOString().slice(0, 10),
    credits: Math.max(0, plan.credits - ((i * 5) % (plan.credits + 1))),
    company,
  }
})

// ---- Reservations (≈30, around today) -----------------------------------

const RES_STATUS_BY_OFFSET = (offset: number): ReservationStatus => {
  if (offset < 0) return 'concluida'
  if (offset === 0) return 'em-uso'
  return 'confirmada'
}

function valueFor(space: Space, hours: number): number {
  return space.priceUnit === 'hora' ? space.price * hours : space.price
}

function buildReservations(): Reservation[] {
  const list: Reservation[] = []
  let id = 0
  // A spread of offsets from -10 to +12 days
  const plan: [number, number, number, number][] = [
    // spaceId, memberId, dayOffset, startHour
    [1, 3, -10, 9], [17, 1, -8, 10], [25, 6, -7, 9], [2, 13, -6, 14],
    [18, 4, -5, 11], [3, 16, -4, 9], [26, 10, -4, 13], [19, 7, -3, 10],
    [4, 23, -2, 15], [27, 2, -2, 9], [20, 11, -1, 10], [5, 9, -1, 16],
    // today (em-uso)
    [6, 1, 0, 9], [21, 4, 0, 10], [28, 6, 0, 11], [7, 13, 0, 14],
    // upcoming (confirmada)
    [22, 2, 1, 9], [8, 16, 1, 13], [29, 10, 2, 10], [23, 7, 2, 14],
    [9, 19, 3, 9], [24, 1, 3, 11], [30, 14, 4, 10], [10, 20, 5, 15],
    [25, 4, 6, 9], [11, 6, 7, 13], [26, 2, 8, 10], [12, 11, 9, 14],
    [27, 19, 10, 9], [13, 16, 12, 11],
  ]

  for (const [spaceId, memberId, offset, hour] of plan) {
    id++
    const space = SPACES.find((s) => s.id === spaceId)!
    const hours = space.type === 'sala-reuniao' || space.type === 'auditorio' ? 2 : space.priceUnit === 'hora' ? 4 : 8
    const start = atTime(offset, hour)
    let status = RES_STATUS_BY_OFFSET(offset)
    // sprinkle a couple of cancellations
    if (id === 4 || id === 18) status = 'cancelada'
    list.push({
      id,
      spaceId,
      memberId,
      start,
      end: endAt(start, hours),
      status,
      value: valueFor(space, hours),
      checkedIn: status === 'em-uso' || status === 'concluida',
      notes: '',
    })
  }
  return list
}

export const RESERVATIONS: Reservation[] = buildReservations()

// ---- Invoices -----------------------------------------------------------

const INV_STATUS: Invoice['status'][] = ['paga', 'pendente', 'vencida']

export const INVOICES: Invoice[] = MEMBERS.flatMap((m, i) => {
  const plan = PLANS.find((p) => p.id === m.planId)!
  const out: Invoice[] = []
  // Last 3 months of invoices per member
  for (let k = 0; k < 3; k++) {
    const due = new Date()
    due.setMonth(due.getMonth() - k)
    due.setDate(5)
    let status: Invoice['status'] = 'paga'
    if (k === 0) {
      status = m.status === 'inadimplente' ? 'vencida' : INV_STATUS[(i + 1) % 2 === 0 ? 1 : 0]
    } else if (k === 1 && m.status === 'inadimplente') {
      status = 'vencida'
    }
    out.push({
      id: i * 10 + k + 1,
      memberId: m.id,
      planId: m.planId,
      dueDate: due.toISOString().slice(0, 10),
      amount: plan.price,
      status,
      reference: `${due.getFullYear()}-${String(due.getMonth() + 1).padStart(2, '0')}`,
    })
  }
  return out
})

// ---- Dashboard period series --------------------------------------------

/** Occupancy % over the last 7 days + revenue, for the dashboard area chart. */
export const OCCUPANCY_SERIES = {
  categories: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
  occupancy: [62, 71, 68, 84, 79, 45, 28],
  revenue: [3200, 4100, 3800, 5200, 4800, 2100, 1200],
}
