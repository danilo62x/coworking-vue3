import type { SpaceStatus } from '@/data/types'

/** Shared color tokens for the space-map status colors (tile + legend). */
export const SPACE_STATUS_META: Record<
  SpaceStatus,
  { tile: string; dot: string; text: string; badge: 'success' | 'warning' | 'brand' | 'gray' }
> = {
  livre: {
    tile: 'border-success-300 bg-success-50 text-success-700 hover:border-success-500 dark:border-success-500/40 dark:bg-success-500/10 dark:text-success-400',
    dot: 'bg-success-500',
    text: 'text-success-600',
    badge: 'success',
  },
  ocupado: {
    tile: 'border-error-300 bg-error-50 text-error-700 hover:border-error-500 dark:border-error-500/40 dark:bg-error-500/10 dark:text-error-400',
    dot: 'bg-error-500',
    text: 'text-error-600',
    badge: 'warning',
  },
  reservado: {
    tile: 'border-brand-300 bg-brand-50 text-brand-700 hover:border-brand-500 dark:border-brand-500/40 dark:bg-brand-500/10 dark:text-brand-400',
    dot: 'bg-brand-500',
    text: 'text-brand-600',
    badge: 'brand',
  },
  manutencao: {
    tile: 'border-gray-300 bg-gray-100 text-gray-500 hover:border-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400',
    dot: 'bg-gray-400',
    text: 'text-gray-500',
    badge: 'gray',
  },
}
