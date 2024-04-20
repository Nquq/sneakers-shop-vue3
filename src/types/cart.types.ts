import type { Card } from '@/types/card.types'
import type { Ref } from 'vue'

export interface CartProps {
  imageUrl: string
  title: string
  price: number
  isFavorite: boolean
}

export interface CartProvide {
  cart: Ref<Card[]>
  removeFromCart: (item: Card) => void
  addToCart: (item: Card) => void
  onClickAddToCartButton: (item: Card) => void
}
