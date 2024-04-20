import type { Card } from '@/types/card.types'

export interface FavoriteResponse {
  id: number
  item_id: number
}

export interface Favorite {
  id: number
  item: Card
}
